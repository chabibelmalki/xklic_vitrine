import "server-only";
import type { LeadData } from "./lead-schema";
import type { Statut, PaymentInfo } from "./sheets";

// ─────────────────────────────────────────────────────────────────────────
// Écriture dans Baserow (base relationnelle) — remplace à terme Google Sheets.
//
// Contrairement à `sheets.ts` qui fait toujours un APPEND (d'où les doublons
// panier/payé faute d'identifiant), ici on fait un UPSERT par `Ref` (= OrderId) :
//   • /api/checkout (panier) → crée le Dossier (ou réutilise une fiche non payée
//     du même client via garde-fou email/téléphone, en réécrivant son `Ref`).
//   • webhook Stripe (payé)  → RETROUVE le Dossier par `Ref` et le met à jour,
//     puis écrit la ligne Paiement. Idempotent : un renvoi Stripe ne duplique pas.
//
// Modèle : Dossiers (1 ligne/client) ←─ Paiements, Produits (tables liées par la
// colonne texte `Dossier` = Ref). Production & Notes sont remplies à la MAIN par
// l'équipe : l'app n'y touche jamais (et `Statut production` n'est pas écrasé).
//
// Best-effort : ne jette jamais, renvoie un booléen (un échec ne casse pas le
// parcours visiteur). Tout est CÔTÉ SERVEUR.
// ─────────────────────────────────────────────────────────────────────────

const API = () =>
  (process.env.BASEROW_API_URL?.trim() || "https://api.baserow.io").replace(/\/$/, "");
const TOKEN = () => process.env.BASEROW_TOKEN?.trim();
const T_DOSSIERS = () => process.env.BASEROW_TABLE_DOSSIERS?.trim();
const T_PAIEMENTS = () => process.env.BASEROW_TABLE_PAIEMENTS?.trim();
const T_PRODUITS = () => process.env.BASEROW_TABLE_PRODUITS?.trim();

// Mêmes conventions de formatage que sheets.ts (cohérence des deux écritures).
const oN = (b?: boolean) => (b ? "oui" : "non");
const join = (a?: string[]) => (Array.isArray(a) ? a.filter(Boolean).join(", ") : "");
const urls = (items?: { url?: string }[]) =>
  Array.isArray(items) ? items.map((i) => i.url).filter(Boolean).join(", ") : "";

type Row = Record<string, unknown> & { id: number };

// Statuts du pipeline production pilotés automatiquement par l'app.
const PROD_PROSPECT = "Prospect"; // dossier créé, pas encore payé
const PROD_TODO = "À faire"; // payé → entre dans le pipeline de production

/**
 * Lit une cellule qu'elle soit de type texte OU menu déroulant : un champ
 * single-select renvoie un objet `{ value }` (et non une chaîne) via l'API.
 * Indispensable pour comparer les statuts de façon fiable quel que soit le type.
 */
function cellStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object" && "value" in (v as object)) {
    return String((v as { value?: unknown }).value ?? "");
  }
  return String(v);
}

const isEmptyProd = (v: unknown) => cellStr(v) === "";
// « initial » = pas encore pris en main par l'équipe (vide ou Prospect).
const isInitialProd = (v: unknown) => {
  const s = cellStr(v);
  return s === "" || s === PROD_PROSPECT;
};

function headers() {
  return { Authorization: `Token ${TOKEN()}`, "Content-Type": "application/json" };
}

const rowsUrl = (tableId: string) =>
  `${API()}/api/database/rows/table/${tableId}/?user_field_names=true`;

async function listRows(tableId: string, query: string): Promise<Row[]> {
  const res = await fetch(`${rowsUrl(tableId)}&${query}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`baserow list ${res.status}: ${await res.text().catch(() => "")}`);
  const data = await res.json();
  return (data?.results as Row[]) ?? [];
}

async function createRow(tableId: string, fields: Record<string, unknown>): Promise<Row> {
  const res = await fetch(rowsUrl(tableId), {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error(`baserow create ${res.status}: ${await res.text().catch(() => "")}`);
  return res.json();
}

async function updateRow(tableId: string, id: number, fields: Record<string, unknown>): Promise<Row> {
  const res = await fetch(
    `${API()}/api/database/rows/table/${tableId}/${id}/?user_field_names=true`,
    { method: "PATCH", headers: headers(), body: JSON.stringify(fields) },
  );
  if (!res.ok) throw new Error(`baserow update ${res.status}: ${await res.text().catch(() => "")}`);
  return res.json();
}

async function deleteRow(tableId: string, id: number): Promise<void> {
  await fetch(`${API()}/api/database/rows/table/${tableId}/${id}/`, {
    method: "DELETE",
    headers: headers(),
  });
}

const eq = (v: string) => `equal=${encodeURIComponent(v)}`;

/** Cherche un Dossier par sa clé métier `Ref` (= OrderId). */
async function findByRef(orderId: string): Promise<Row | null> {
  if (!orderId) return null;
  const rows = await listRows(T_DOSSIERS()!, `filter__Ref__${eq(orderId)}`);
  return rows[0] ?? null;
}

/**
 * Garde-fou « même client, 2 tentatives » : au panier, si un Dossier NON PAYÉ
 * existe déjà avec le même email OU téléphone, on le réutilise (filtre OR côté
 * API, exclusion des « payé » côté code pour éviter d'encoder un nom à espace).
 */
async function findUnpaidByContact(email?: string, phone?: string): Promise<Row | null> {
  const parts: string[] = [];
  if (email) parts.push(`filter__Email__${eq(email)}`);
  if (phone) parts.push(`filter__Telephone__${eq(phone)}`);
  if (!parts.length) return null;
  const rows = await listRows(T_DOSSIERS()!, `filter_type=OR&${parts.join("&")}`);
  return rows.find((r) => cellStr(r["Statut commande"]) !== "payé") ?? null;
}

/** Mappe le lead vers les champs de la table Dossiers (champs app uniquement). */
function dossierFields(statut: Statut, lead: LeadData, orderId?: string): Record<string, unknown> {
  const s = lead.socials ?? {};
  const f: Record<string, unknown> = {
    Entreprise: lead.companyName ?? "",
    "Statut commande": statut,
    Formule: lead.formule ?? "",
    Metier: lead.trade ?? "",
    Ville: lead.city ?? "",
    Type: lead.activityType ?? "",
    "Se deplace": oN(lead.mobile),
    "Zone deplacement": lead.serviceArea ?? "",
    Prestations: lead.services ?? "",
    "Credit impot": lead.taxCredit ?? "",
    Telephone: lead.phone ?? "",
    WhatsApp: oN(!lead.noWhatsapp),
    Email: lead.email ?? "",
    "Local/Boutique": oN(lead.hasShop),
    Adresse: lead.address ?? "",
    Disponibilites: lead.availability ?? "",
    SIRET: lead.siret ?? "",
    "SIRET en cours": oN(lead.noSiret),
    Langues: join(lead.languages),
    Styles: join(lead.styleVibes),
    Couleur: join(lead.colorPreference),
    Ambiance: lead.ambiance ?? "",
    Logo: urls(lead.logo),
    Photos: urls(lead.photos),
    Facebook: s.facebook ?? "",
    Instagram: s.instagram ?? "",
    TikTok: s.tiktok ?? "",
    X: s.x ?? "",
    Google: s.google ?? "",
    Extra: lead.extra ?? "",
    Mode: lead.assisted ? "À compléter par téléphone (conseiller)" : "Formulaire complet",
  };
  // `Ref` est la clé de matching ; `OrderId` garde la valeur Stripe brute.
  if (orderId) {
    f.Ref = orderId;
    f.OrderId = orderId;
  }
  return f;
}

/** Un paiement par dossier (upsert sur `Dossier` = Ref). `dossierId` = lien natif `Fiche`. */
async function upsertPaiement(
  dossierId: number,
  orderId: string,
  lead: LeadData,
  payment?: PaymentInfo,
): Promise<void> {
  const tbl = T_PAIEMENTS();
  if (!tbl || !orderId) return;
  const fields = {
    Dossier: orderId,
    Fiche: [dossierId], // lien natif → apparaît dans la fiche du Dossier
    Entreprise: lead.companyName ?? "",
    Montant: payment?.amountTotal != null ? (payment.amountTotal / 100).toFixed(2) : "",
    CodePromo: payment?.promoCode ?? "",
    SessionStripe: payment?.sessionId ?? "",
    AbonnementStripe: payment?.subscriptionId ?? "",
  };
  const existing = await listRows(tbl, `filter__Dossier__${eq(orderId)}`);
  if (existing[0]) await updateRow(tbl, existing[0].id, fields);
  else await createRow(tbl, fields);
}

/** Synchronise les produits du client (remplace l'éventuel existant — idempotent). */
async function syncProduits(dossierId: number, orderId: string, lead: LeadData): Promise<void> {
  const tbl = T_PRODUITS();
  if (!tbl || !orderId) return;
  const existing = await listRows(tbl, `filter__Dossier__${eq(orderId)}`);
  for (const r of existing) await deleteRow(tbl, r.id);
  for (const p of lead.products ?? []) {
    await createRow(tbl, {
      Dossier: orderId,
      Fiche: [dossierId], // lien natif → apparaît dans la fiche du Dossier
      Entreprise: lead.companyName ?? "",
      Titre: p.title ?? "",
      Description: p.description ?? "",
      Prix: p.price ?? "",
      Categorie: p.category ?? "",
    });
  }
}

/**
 * Upsert d'une commande dans Baserow. Même signature que `appendOrderRow`
 * (sheets.ts) pour brancher la double écriture sans friction. Renvoie un booléen
 * best-effort.
 */
export async function upsertOrder(args: {
  statut: Statut;
  lead: LeadData;
  orderId?: string;
  payment?: PaymentInfo;
}): Promise<boolean> {
  const dossiers = T_DOSSIERS();
  if (!TOKEN() || !dossiers) {
    console.info("[baserow] non configuré (BASEROW_TOKEN / BASEROW_TABLE_DOSSIERS) — ignoré.");
    return false;
  }

  const { statut, lead, orderId } = args;
  try {
    if (statut === "payé") {
      // Webhook : retrouve la fiche par Ref ; à défaut, rattrape une fiche NON
      // payée du même client (cas d'une session de paiement plus ancienne dont
      // le Ref a été réécrit) pour éviter de créer un doublon « payé ».
      let found = orderId ? await findByRef(orderId) : null;
      if (!found) found = await findUnpaidByContact(lead.email, lead.phone);
      const fields = dossierFields("payé", lead, orderId);
      let dossier: Row;
      if (found) {
        // Promotion auto Prospect → « À faire » SANS écraser un statut déjà
        // avancé par l'équipe (En prod / En ligne…) si le webhook se rejoue.
        if (isInitialProd(found["Statut production"])) fields["Statut production"] = PROD_TODO;
        dossier = await updateRow(dossiers, found.id, fields);
      } else {
        dossier = await createRow(dossiers, {
          ...fields,
          "Statut production": PROD_TODO,
          Date: new Date().toISOString(),
        });
      }
      if (orderId) {
        await upsertPaiement(dossier.id, orderId, lead, args.payment);
        await syncProduits(dossier.id, orderId, lead);
      }
      return true;
    }

    if (statut === "panier") {
      // Checkout : upsert par Ref, sinon garde-fou par contact (réutilise + réécrit Ref).
      let found = orderId ? await findByRef(orderId) : null;
      if (!found) found = await findUnpaidByContact(lead.email, lead.phone);
      const fields = dossierFields("panier", lead, orderId);
      let dossier: Row;
      if (found) {
        // Dossier non payé = « Prospect ». On n'initialise que si vide
        // (ne jamais écraser un statut posé à la main).
        if (isEmptyProd(found["Statut production"])) fields["Statut production"] = PROD_PROSPECT;
        dossier = await updateRow(dossiers, found.id, fields);
      } else {
        dossier = await createRow(dossiers, {
          ...fields,
          "Statut production": PROD_PROSPECT,
          Date: new Date().toISOString(),
        });
      }
      if (orderId) await syncProduits(dossier.id, orderId, lead);
      return true;
    }

    // statut "lead" — parcours non utilisé par l'UI actuelle, géré par sûreté.
    const found = await findUnpaidByContact(lead.email, lead.phone);
    const fields = dossierFields("lead", lead, orderId);
    if (found) {
      if (isEmptyProd(found["Statut production"])) fields["Statut production"] = PROD_PROSPECT;
      await updateRow(dossiers, found.id, fields);
    } else {
      await createRow(dossiers, {
        ...fields,
        "Statut production": PROD_PROSPECT,
        Date: new Date().toISOString(),
      });
    }
    return true;
  } catch (err) {
    console.error("[baserow] upsert échoué :", err);
    return false;
  }
}
