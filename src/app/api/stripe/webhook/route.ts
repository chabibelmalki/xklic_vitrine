import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getOrderByUrl } from "@/lib/orders";
import { appendOrderRow } from "@/lib/sheets";

export const runtime = "nodejs";
// Corps brut requis pour vérifier la signature : on ne lit JAMAIS req.json().

// Webhook Stripe — SEUL point qui enregistre un « paiement confirmé ».
//
// La redirection success_url N'EST PAS fiable (falsifiable, ratable) : on ne
// déclenche donc rien depuis /merci. Ici, on VÉRIFIE LA SIGNATURE Stripe
// (obligatoire), on écoute checkout.session.completed, on recharge la commande
// via l'URL en metadata, et on écrit la ligne « payé » dans Google Sheets.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const sig = req.headers.get("stripe-signature");

  if (!stripe || !secret) {
    console.error("[stripe-webhook] Stripe ou STRIPE_WEBHOOK_SECRET non configuré.");
    return new Response("not configured", { status: 500 });
  }
  if (!sig) return new Response("missing signature", { status: 400 });

  // 1. Vérification de signature sur le corps BRUT (anti-falsification).
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[stripe-webhook] Signature invalide :", (err as Error).message);
    return new Response("invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Autres événements : accusé de réception, rien à faire.
    return new Response("ignored", { status: 200 });
  }

  const session = event.data.object;
  const orderUrl = session.metadata?.orderUrl;
  const orderId = session.metadata?.orderId;

  // 2. Recharge la commande (enrichit la session avec le lead complet).
  const order = orderUrl ? await getOrderByUrl(orderUrl) : null;
  if (!order) {
    console.error(`[stripe-webhook] Commande introuvable (orderId=${orderId}).`);
    // 200 : la commande n'est pas récupérable, inutile que Stripe réessaie.
    return new Response("order not found", { status: 200 });
  }

  // Récupère le code promo éventuel (non développé dans l'événement brut).
  let promoCode: string | null = null;
  try {
    const full = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["discounts.promotion_code"],
    });
    const promo = full.discounts?.[0]?.promotion_code;
    if (promo && typeof promo !== "string") promoCode = promo.code;
  } catch {
    /* enrichissement best-effort */
  }

  // 3. Écriture de la ligne « payé » dans Google Sheets (SEUL déclenchement
  //    déclenché par le paiement, depuis ce webhook vérifié). Stripe peut
  //    renvoyer l'événement → un doublon éventuel est toléré (rare).
  const written = await appendOrderRow({
    statut: "payé",
    lead: order.lead,
    orderId: order.id,
    payment: {
      amountTotal: session.amount_total,
      currency: session.currency,
      promoCode,
      sessionId: session.id,
      subscriptionId:
        typeof session.subscription === "string" ? session.subscription : null,
    },
  });

  if (!written) {
    // Échec d'écriture : 500 pour que Stripe réessaie (livraison fiable).
    return new Response("sheet write failed", { status: 500 });
  }
  return new Response("ok", { status: 200 });
}
