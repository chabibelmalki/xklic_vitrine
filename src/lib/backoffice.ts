import "server-only";
import type { LeadData, LeadValues } from "./lead-schema";
import { FORMULE_SLUGS, BOUTIQUE_TIERS, type FormuleSlug, type BoutiqueTier } from "./lead-schema";

// ─────────────────────────────────────────────────────────────────────────
// Écriture des commandes dans le back-office (API Go → Postgres), source de
// vérité unique depuis le 2026-07-05 (doc de chantier à la racine de /xklic).
//
// UN SEUL appel : POST {BACKOFFICE_API_URL}/v1/public/agency/orders, upsert
// transactionnel par `ref` (= OrderId) côté serveur :
//   • dossier   → upsert (la règle « Statut production jamais rétrogradé »
//                 est appliquée PAR L'API, plus ici) ;
//   • products  → sync remplaçante (envoyés à chaque appel) ;
//   • payment   → upsert par `stripe_session` (replay webhook idempotent).
//
// Ne jette jamais, renvoie un booléen. L'appelant décide quoi faire du `false` :
//   • /api/checkout, /api/lead → fire-and-forget (le parcours continue) ;
//   • webhook Stripe           → 500 pour forcer le retry Stripe (durabilité
//                                du statut « payé »).
// ─────────────────────────────────────────────────────────────────────────

export type Statut = "lead" | "panier" | "payé";

export interface PaymentInfo {
  amountTotal?: number | null; // en centimes
  currency?: string | null;
  promoCode?: string | null;
  discountCents?: number | null; // réduction appliquée (total_details.amount_discount)
  sessionId?: string | null;
  subscriptionId?: string | null;
  customerId?: string | null; // cus_… → colonne stripe_customer (lot 1)
}

const API_URL = () => process.env.BACKOFFICE_API_URL?.trim().replace(/\/$/, "");
const API_KEY = () => process.env.BACKOFFICE_API_KEY?.trim();

const TIMEOUT_MS = 5000;

const urls = (items?: { url?: string }[]): string[] =>
  Array.isArray(items) ? items.map((i) => i.url).filter((u): u is string => Boolean(u)) : [];

const arr = (a?: string[]): string[] => (Array.isArray(a) ? a.filter(Boolean) : []);

// Éclate une saisie texte libre (« Français, anglais, espagnol ») en tableau,
// séparateurs virgule / point-virgule / retour ligne. Trim + retrait des vides.
const splitList = (s?: string): string[] =>
  (s ?? "")
    .split(/[,;\n]/)
    .map((x) => x.trim())
    .filter(Boolean);

/** Mappe le lead vers les colonnes `agency_orders` (snake_case, types natifs). */
function dossierFields(lead: LeadData): Record<string, unknown> {
  const s = lead.socials ?? {};
  // type_activite dérivé du choix boutique + prestations (l'étape « activité » a
  // disparu du tunnel) :
  //   pas de boutique                → services
  //   boutique + prestations cochée  → les-deux
  //   boutique, prestations décochée → produits
  const typeActivite = !lead.boutiqueTier
    ? "services"
    : lead.wantsServices
      ? "les-deux"
      : "produits";
  return {
    entreprise: lead.companyName ?? "",
    formule: lead.formule ?? "",
    // Champ OPTIONNEL par nature : null (pas "") quand absent, pour que le
    // `WHERE boutique_tier IS NOT NULL` du lot 4 ne matche que les vraies
    // boutiques. Le tag Go `*string` écrit alors NULL (pas de coalesce à l'insert).
    boutique_tier: lead.boutiqueTier ?? null,
    metier: lead.trade ?? "",
    ville: lead.city ?? "",
    // Multi-pays : pré-rempli via l'IP, éditable dans le tunnel.
    pays: lead.country ?? "",
    type_activite: typeActivite,
    se_deplace: Boolean(lead.mobile),
    zone_deplacement: lead.serviceArea ?? "",
    prestations: lead.services ?? "",
    telephone: lead.phone ?? "",
    whatsapp: !lead.noWhatsapp,
    email: lead.email ?? "",
    local_boutique: Boolean(lead.hasShop),
    adresse: lead.address ?? "",
    disponibilites: lead.availability ?? "",
    siret: lead.siret ?? "",
    langues: splitList(lead.languages),
    couleurs: arr(lead.colorPreference),
    ambiance: lead.ambiance ?? "",
    logo_urls: urls(lead.logo),
    photo_urls: urls(lead.photos),
    facebook: s.facebook ?? "",
    instagram: s.instagram ?? "",
    tiktok: s.tiktok ?? "",
    x: s.x ?? "",
    google: s.google ?? "",
    extra: lead.extra ?? "",
  };
}

/**
 * Upsert d'une commande dans le back-office. Même signature que les écritures
 * historiques qu'il remplace — branchement sans friction dans les 3 routes.
 */
export async function upsertOrder(args: {
  statut: Statut;
  lead: LeadData;
  orderId?: string;
  payment?: PaymentInfo;
}): Promise<boolean> {
  const url = API_URL();
  const key = API_KEY();
  if (!url || !key) {
    console.info("[backoffice] non configuré (BACKOFFICE_API_URL / BACKOFFICE_API_KEY) — ignoré.");
    return false;
  }

  const { statut, lead, orderId, payment } = args;

  // `ref` est requis par l'API (clé d'upsert). Cas « lead » sans commande :
  // pas d'OrderId → on génère un UUID, comme `createOrder` le fait au checkout.
  const ref = orderId || crypto.randomUUID();

  const body: Record<string, unknown> = {
    ref,
    statut,
    dossier: dossierFields(lead),
    // Toujours envoyés : la sync remplaçante est côté serveur ([] = vider).
    products: (lead.products ?? []).map((p) => ({
      titre: p.title ?? "",
      description: p.description ?? "",
      prix: p.price ?? "",
      categorie: p.category ?? "",
    })),
  };
  if (payment) {
    body.payment = {
      amount_cents: payment.amountTotal ?? null,
      discount_cents: payment.discountCents ?? null,
      promo_code: payment.promoCode ?? "",
      stripe_session: payment.sessionId ?? "",
      stripe_subscription: payment.subscriptionId ?? "",
      // Plain string côté Go (nullif('') = ne pas écraser) : "" quand absent,
      // comme stripe_subscription. Le webhook (étape 3) fournira le cus_….
      stripe_customer: payment.customerId ?? "",
    };
  }

  try {
    const res = await fetch(`${url}/v1/public/agency/orders`, {
      method: "POST",
      headers: { "X-API-Key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[backoffice] upsert a répondu", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[backoffice] upsert échoué :", err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Reprise d'un dossier non payé — l'inverse de dossierFields().
//
// Un prospect a rempli le tunnel mais n'a pas payé : son dossier est capté en
// « panier » côté back-office. Depuis la fiche, un lien `?resume=<ref>` le renvoie
// sur /demarrer avec ses infos pré-remplies pour finir jusqu'au paiement. Le
// serveur (cette fonction, clé API jamais exposée au navigateur) recharge le
// dossier et le remappe vers les valeurs du formulaire.
//
// NB : les produits déclarés ne sont plus persistés sur le dossier (le catalogue
// vit dans la boutique, après paiement) → `products` repart vide, comme le reste
// du parc. Les logos/photos déjà téléversés sont conservés (URLs publiques).
// ─────────────────────────────────────────────────────────────────────────

export interface ResumeDossier {
  ref: string;
  values: Partial<LeadValues>;
}

// Forme partielle du dossier renvoyé par GET /agency/orders/{ref} (champ `order`).
// Snake_case, types natifs Postgres exposés en JSON. Seuls les champs remappés
// sont typés ici.
interface AgencyOrderJSON {
  ref?: string;
  statut_commande?: string;
  entreprise?: string;
  formule?: string;
  boutique_tier?: string | null;
  metier?: string;
  ville?: string;
  pays?: string;
  type_activite?: string;
  se_deplace?: boolean | null;
  zone_deplacement?: string;
  prestations?: string;
  telephone?: string;
  whatsapp?: boolean | null;
  email?: string;
  local_boutique?: boolean | null;
  adresse?: string;
  disponibilites?: string;
  siret?: string;
  langues?: string[] | null;
  couleurs?: string[] | null;
  ambiance?: string;
  logo_urls?: string[] | null;
  photo_urls?: string[] | null;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  google?: string;
  extra?: string;
}

// URLs publiques → items d'upload du formulaire ({ name, url } sans File brut :
// au ré-envoi, uploadFiles() les conserve tels quels, cf. lead-form).
const toUploads = (urls?: string[] | null, prefix = "image") =>
  (urls ?? []).filter(Boolean).map((url, i) => ({ name: `${prefix}-${i + 1}`, url }));

function orderToLeadValues(o: AgencyOrderJSON): Partial<LeadValues> {
  const couleurs = (o.couleurs ?? []).filter(Boolean);
  return {
    formule: FORMULE_SLUGS.includes(o.formule as FormuleSlug)
      ? (o.formule as FormuleSlug)
      : undefined,
    boutiqueTier: BOUTIQUE_TIERS.includes(o.boutique_tier as BoutiqueTier)
      ? (o.boutique_tier as BoutiqueTier)
      : undefined,
    // type_activite « produits » = vente seule → prestations non proposées.
    wantsServices: o.type_activite !== "produits",
    companyName: o.entreprise || "",
    trade: o.metier || "",
    city: o.ville || "",
    country: o.pays || "France",
    mobile: Boolean(o.se_deplace),
    serviceArea: o.zone_deplacement || "",
    services: o.prestations || "",
    phone: o.telephone || "",
    // whatsapp null (inconnu) → on ne coche pas « pas de WhatsApp ». Seul false explicite coche.
    noWhatsapp: o.whatsapp === false,
    email: o.email || "",
    hasShop: Boolean(o.local_boutique),
    address: o.adresse || "",
    availability: o.disponibilites || "",
    siret: o.siret || "",
    languages: (o.langues ?? []).filter(Boolean).join(", "),
    // Vide → on laisse le défaut du formulaire (rond de couleur pré-rempli).
    ...(couleurs.length ? { colorPreference: couleurs } : {}),
    ambiance: o.ambiance || "",
    logo: toUploads(o.logo_urls, "logo"),
    photos: toUploads(o.photo_urls, "photo"),
    socials: {
      facebook: o.facebook || "",
      instagram: o.instagram || "",
      tiktok: o.tiktok || "",
      x: o.x || "",
      google: o.google || "",
    },
    extra: o.extra || "",
    products: [],
  };
}

/**
 * Recharge un dossier non payé pour pré-remplir le tunnel (lien de reprise).
 * Renvoie null si non configuré, introuvable, illisible, ou DÉJÀ PAYÉ (aucune
 * reprise possible dans ce cas). Ne jette jamais.
 */
export async function fetchDossierForResume(ref: string): Promise<ResumeDossier | null> {
  const url = API_URL();
  const key = API_KEY();
  const cleanRef = ref.trim();
  if (!url || !key || !cleanRef) return null;

  try {
    const res = await fetch(`${url}/v1/public/agency/orders/${encodeURIComponent(cleanRef)}`, {
      headers: { "X-API-Key": key },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { order?: AgencyOrderJSON };
    const o = data?.order;
    // Dossier absent ou déjà réglé : pas de reprise (le tunnel repart vierge).
    if (!o || o.statut_commande === "payé") return null;
    return { ref: o.ref || cleanRef, values: orderToLeadValues(o) };
  } catch (err) {
    console.error("[backoffice] reprise dossier échouée :", err);
    return null;
  }
}
