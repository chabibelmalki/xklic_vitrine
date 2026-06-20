import "server-only";
import { put } from "@vercel/blob";
import type { LeadData } from "./lead-schema";

// ─────────────────────────────────────────────────────────────────────────
// Persistance des commandes — pas de base de données : on réutilise Vercel Blob
// (déjà câblé pour les images du formulaire, cf. /api/blob/upload).
//
// La commande est écrite AVANT la redirection vers Stripe pour qu'elle SURVIVE
// au passage par le paiement : le webhook Stripe la recharge ensuite via l'URL
// transportée dans les `metadata` de la session. L'id est un UUID non devinable
// (l'URL Blob agit comme une capability-URL).
//
// ⚠️ Confidentialité : la commande contient des données personnelles (email,
// téléphone, adresse). Le store Blob est « public » mais l'URL est protégée par
// l'UUID + le suffixe aléatoire. Pour un cran de plus, basculer sur un store
// Blob privé ou un KV (voir AGENTS / env).
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
  url: string; // URL Blob de la commande (mise dans les metadata Stripe)
}

/** Crée et persiste une commande. Renvoie son id + l'URL Blob de relecture. */
export async function createOrder(lead: LeadData): Promise<StoredOrder> {
  const id = crypto.randomUUID();
  const order: Order = {
    id,
    status: "pending",
    formule: lead.formule,
    lead,
    createdAt: new Date().toISOString(),
  };

  const blob = await put(`orders/${id}.json`, JSON.stringify(order), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });

  return { id, url: blob.url };
}

/** Recharge une commande depuis son URL Blob (transportée par Stripe). */
export async function getOrderByUrl(url: string): Promise<Order | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Order;
  } catch (err) {
    console.error("[orders] Lecture commande échouée :", err);
    return null;
  }
}
