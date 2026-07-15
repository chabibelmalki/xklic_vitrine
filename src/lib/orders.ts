import "server-only";
import { putObject, getObjectText } from "./scaleway";
import type { LeadData } from "./lead-schema";

// ─────────────────────────────────────────────────────────────────────────
// Persistance des commandes — pas de base de données : on écrit un petit JSON
// sur Scaleway (stockage objet, même bucket que les images).
//
// La commande est écrite AVANT la redirection vers Stripe pour qu'elle SURVIVE
// au paiement : le webhook Stripe la recharge ensuite via la CLÉ transportée
// dans les `metadata` de la session. Contrairement à l'ancien schéma Blob (objet
// public à URL obscure), l'objet est ici PRIVÉ : seul le webhook (serveur, avec
// les credentials S3) le relit par sa clé — les données personnelles (email,
// téléphone, adresse) ne sont donc jamais exposées via une URL publique.
// ─────────────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "paid";

export interface Order {
  id: string;
  status: OrderStatus;
  formule: LeadData["formule"];
  lead: LeadData;
  createdAt: string;
}

export interface StoredOrder {
  id: string;
  key: string; // clé Scaleway de la commande (mise dans les metadata Stripe)
}

// UUID v4 (ou toute forme UUID) — les refs de dossier en sont. Sert à valider un
// `resumeRef` reçu du client avant de le réutiliser comme clé de commande.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Crée et persiste une commande. Renvoie son id + sa clé Scaleway de relecture.
 *
 * `resumeRef` (reprise depuis le back-office) : quand un prospect non payé revient
 * finir son paiement via un lien `?resume=<ref>`, on RÉUTILISE sa ref existante
 * comme id de commande. L'upsert back-office cible alors le MÊME dossier (par ref),
 * sans dépendre du seul rapprochement email/téléphone → pas de doublon même si le
 * client corrige son email dans le tunnel. Ignoré si ce n'est pas un UUID valide.
 */
export async function createOrder(lead: LeadData, resumeRef?: string): Promise<StoredOrder> {
  const id = resumeRef && UUID_RE.test(resumeRef) ? resumeRef : crypto.randomUUID();
  const order: Order = {
    id,
    status: "pending",
    formule: lead.formule,
    lead,
    createdAt: new Date().toISOString(),
  };
  const key = `orders/${id}.json`;
  await putObject(key, JSON.stringify(order), "application/json");
  return { id, key };
}

/** Recharge une commande depuis sa clé Scaleway (transportée par Stripe). */
export async function getOrderByKey(key: string): Promise<Order | null> {
  const text = await getObjectText(key);
  if (!text) return null;
  try {
    return JSON.parse(text) as Order;
  } catch (err) {
    console.error("[orders] JSON commande illisible :", err);
    return null;
  }
}

/**
 * Compat transition : commandes créées par l'ANCIENNE vitrine (stockées sur
 * Vercel Blob, URL publique en metadata). Simple `fetch` — aucune dépendance
 * Blob. À retirer une fois Blob décommissionné et plus aucune commande en vol.
 */
export async function getOrderByUrl(url: string): Promise<Order | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Order;
  } catch (err) {
    console.error("[orders] Lecture commande (URL legacy) échouée :", err);
    return null;
  }
}
