import "server-only";
import type { LeadData } from "./lead-schema";

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
    type_activite: typeActivite,
    se_deplace: Boolean(lead.mobile),
    zone_deplacement: lead.serviceArea ?? "",
    prestations: lead.services ?? "",
    credit_impot: lead.taxCredit ?? "",
    telephone: lead.phone ?? "",
    whatsapp: !lead.noWhatsapp,
    email: lead.email ?? "",
    local_boutique: Boolean(lead.hasShop),
    adresse: lead.address ?? "",
    disponibilites: lead.availability ?? "",
    siret: lead.siret ?? "",
    siret_en_cours: Boolean(lead.noSiret),
    langues: arr(lead.languages),
    styles: arr(lead.styleVibes),
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
    mode: lead.assisted ? "À compléter par téléphone (conseiller)" : "Formulaire complet",
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
// Complétion post-paiement (page /merci → POST /api/complete)
// ─────────────────────────────────────────────────────────────────────────

/** Vue d'un dossier pour le prefill de la page de complétion + le contrôle du
 *  statut. `null` si non configuré / introuvable / erreur (ne jette jamais). */
export interface DossierByRef {
  ref: string;
  statutCommande: string; // lead | panier | payé
  typeActivite: string; // services | produits | les-deux (dérivé au checkout)
  entreprise: string;
  prestations: string;
  logoUrls: string[];
  photoUrls: string[];
  couleurs: string[];
  styles: string[];
  ambiance: string;
  socials: { facebook: string; instagram: string; tiktok: string; x: string; google: string };
  langues: string[];
  siret: string;
  whatsapp: boolean;
}

const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

export async function fetchDossierByRef(ref: string): Promise<DossierByRef | null> {
  const url = API_URL();
  const key = API_KEY();
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/v1/public/agency/orders/${encodeURIComponent(ref)}`, {
      headers: { "X-API-Key": key },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { order?: Record<string, unknown> };
    const o = data.order;
    if (!o) return null;
    return {
      ref: String(o.ref ?? ""),
      statutCommande: String(o.statut_commande ?? ""),
      typeActivite: String(o.type_activite ?? ""),
      entreprise: String(o.entreprise ?? ""),
      prestations: String(o.prestations ?? ""),
      logoUrls: strArr(o.logo_urls),
      photoUrls: strArr(o.photo_urls),
      couleurs: strArr(o.couleurs),
      styles: strArr(o.styles),
      ambiance: String(o.ambiance ?? ""),
      socials: {
        facebook: String(o.facebook ?? ""),
        instagram: String(o.instagram ?? ""),
        tiktok: String(o.tiktok ?? ""),
        x: String(o.x ?? ""),
        google: String(o.google ?? ""),
      },
      langues: strArr(o.langues),
      siret: String(o.siret ?? ""),
      whatsapp: Boolean(o.whatsapp),
    };
  } catch (err) {
    console.error("[backoffice] fetchDossierByRef échoué :", err);
    return null;
  }
}

/**
 * Enrichissement PARTIEL d'un dossier par sa ref EXACTE (complétion post-paiement).
 * N'envoie que les champs fournis dans `dossier` (le back-office coalesce → les
 * colonnes non transmises restent intactes). `statut: "payé"` pour ne jamais
 * rétrograder. IMPORTANT : la ref étant exacte et le dossier déjà existant,
 * l'upsert prend la branche `refExists=true` → AUCUN rapprochement-par-contact
 * (celui-ci ne se déclenche que sur une ref inconnue), donc pas de fusion.
 */
export async function enrichOrder(ref: string, dossier: Record<string, unknown>): Promise<boolean> {
  const url = API_URL();
  const key = API_KEY();
  if (!url || !key) {
    console.info("[backoffice] non configuré — enrichissement ignoré.");
    return false;
  }
  try {
    const res = await fetch(`${url}/v1/public/agency/orders`, {
      method: "POST",
      headers: { "X-API-Key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ ref, statut: "payé", dossier }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[backoffice] enrich a répondu", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[backoffice] enrich échoué :", err);
    return false;
  }
}
