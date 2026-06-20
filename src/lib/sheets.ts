import "server-only";
import crypto from "node:crypto";
import type { LeadData } from "./lead-schema";

// ─────────────────────────────────────────────────────────────────────────
// Écriture directe dans Google Sheets (remplace n8n).
//
// Auth compte de service en JWT RS256 signé localement (node:crypto) puis
// échangé contre un access token — AUCUNE dépendance externe (même pattern que
// le moteur, scripts/sync-sitemaps.mjs). Tout est CÔTÉ SERVEUR.
//
// Une LIGNE par événement, avec une colonne « Statut » :
//   lead   → soumission simple (/api/lead)
//   panier → commande créée, pas encore payée (/api/checkout) = panier abandonné
//   payé   → paiement confirmé par le webhook Stripe vérifié
// ─────────────────────────────────────────────────────────────────────────

const TOKEN_URI = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

// En-têtes canoniques (ordre = ordre des colonnes écrites).
const HEADERS = [
  "Date", "Statut", "Formule", "Entreprise", "Metier", "Ville", "Type",
  "Services", "Produits", "Telephone", "Email", "Adresse", "SIRET",
  "Langues", "Ambiance", "Extra",
  "Montant", "CodePromo", "OrderId", "SessionStripe", "AbonnementStripe",
] as const;

export type Statut = "lead" | "panier" | "payé";

export interface PaymentInfo {
  amountTotal?: number | null; // en centimes
  currency?: string | null;
  promoCode?: string | null;
  sessionId?: string | null;
  subscriptionId?: string | null;
}

function serviceAccount(): { client_email: string; private_key: string } | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (raw) {
    try {
      const j = JSON.parse(raw);
      if (j.client_email && j.private_key) return j;
    } catch {
      /* tombe sur les variables séparées */
    }
  }
  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  // Les clés en variable d'env ont souvent des \n littéraux à ré-échapper.
  const private_key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (client_email && private_key) return { client_email, private_key };
  return null;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Cache du token par instance chaude (évite un échange JWT à chaque appel).
let _token: { value: string; exp: number } | null = null;

async function getAccessToken(key: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (_token && _token.exp - 60 > now) return _token.value;

  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({
    iss: key.client_email, scope: SCOPE, aud: TOKEN_URI, iat: now, exp: now + 3600,
  }));
  const signingInput = `${header}.${claims}`;
  const signature = b64url(crypto.sign("RSA-SHA256", Buffer.from(signingInput), key.private_key));

  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signingInput}.${signature}`,
    }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.access_token) {
    throw new Error(`token endpoint -> ${res.status} ${body?.error_description || body?.error || res.statusText}`);
  }
  _token = { value: body.access_token, exp: now + 3600 };
  return body.access_token;
}

const SHEET_ID = () => process.env.GOOGLE_SHEET_ID?.trim();
const SHEET_TAB = () => process.env.GOOGLE_SHEET_TAB?.trim() || "Leads";

// Écrit la ligne d'en-têtes si l'onglet est vide. Au plus une fois par instance.
let _headersEnsured = false;
async function ensureHeaders(token: string, sheetId: string): Promise<void> {
  if (_headersEnsured) return;
  const tab = SHEET_TAB();
  const range = `${encodeURIComponent(tab)}!A1:U1`;
  const get = await fetch(`${SHEETS_API}/${sheetId}/values/${range}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (get.ok) {
    const data = await get.json().catch(() => null);
    const hasHeader = Array.isArray(data?.values) && data.values.length > 0;
    if (!hasHeader) {
      await fetch(
        `${SHEETS_API}/${sheetId}/values/${range}?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ values: [HEADERS] }),
        },
      );
    }
  }
  _headersEnsured = true;
}

function buildRow(statut: Statut, lead: LeadData, orderId: string, payment?: PaymentInfo): string[] {
  const montant =
    payment?.amountTotal != null ? (payment.amountTotal / 100).toFixed(2) : "";
  const langues = Array.isArray(lead.languages) ? lead.languages.join(", ") : "";
  return [
    new Date().toISOString(),
    statut,
    lead.formule ?? "",
    lead.companyName ?? "",
    lead.trade ?? "",
    lead.city ?? "",
    lead.activityType ?? "",
    lead.services ?? "",
    lead.products?.length ? JSON.stringify(lead.products) : "",
    lead.phone ?? "",
    lead.email ?? "",
    lead.address ?? "",
    lead.siret ?? "",
    langues,
    lead.ambiance ?? "",
    lead.extra ?? "",
    montant,
    payment?.promoCode ?? "",
    orderId,
    payment?.sessionId ?? "",
    payment?.subscriptionId ?? "",
  ];
}

/**
 * Ajoute une ligne au Sheet. Best-effort : ne jette jamais, renvoie un booléen
 * (un échec ne doit pas casser le parcours visiteur). L'appelant décide quoi
 * faire du `false` (ex. le webhook Stripe renvoie 500 pour forcer un retry).
 */
export async function appendOrderRow(args: {
  statut: Statut;
  lead: LeadData;
  orderId?: string;
  payment?: PaymentInfo;
}): Promise<boolean> {
  const key = serviceAccount();
  const sheetId = SHEET_ID();
  if (!key || !sheetId) {
    console.info("[sheets] Google non configuré (compte de service / GOOGLE_SHEET_ID) — ligne non écrite.");
    return false;
  }

  try {
    const token = await getAccessToken(key);
    await ensureHeaders(token, sheetId);
    const range = `${encodeURIComponent(SHEET_TAB())}!A1`;
    const row = buildRow(args.statut, args.lead, args.orderId ?? "", args.payment);
    const res = await fetch(
      `${SHEETS_API}/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [row] }),
      },
    );
    if (!res.ok) {
      console.error("[sheets] append a répondu", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[sheets] Écriture échouée :", err);
    return false;
  }
}
