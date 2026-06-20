import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getOrderByUrl } from "@/lib/orders";
import { postToN8n } from "@/lib/n8n";

export const runtime = "nodejs";
// Corps brut requis pour vérifier la signature : on ne lit JAMAIS req.json().

// Webhook Stripe — SEUL déclencheur n8n « paiement confirmé ».
//
// La redirection success_url N'EST PAS fiable (falsifiable, ratable) : on ne
// déclenche donc rien depuis /merci. Ici, on VÉRIFIE LA SIGNATURE Stripe
// (obligatoire), on écoute checkout.session.completed, on recharge la commande
// via l'URL en metadata, et on POST n8n avec commande + infos de paiement.
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

  // 3. Déclenchement n8n (commande + paiement). Idempotence côté n8n via
  //    payment.sessionId (Stripe peut renvoyer l'événement plusieurs fois).
  const forwarded = await postToN8n({
    event: "payment_completed",
    orderId: order.id,
    payment: {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email ?? order.lead.email,
      customerId: typeof session.customer === "string" ? session.customer : null,
      subscriptionId:
        typeof session.subscription === "string" ? session.subscription : null,
      promoCode,
      amountDiscount: session.total_details?.amount_discount ?? 0,
    },
    formule: order.formule,
    order: order.lead,
    paidAt: new Date().toISOString(),
    source: "xklic-vitrine",
  });

  if (!forwarded) {
    // n8n a échoué : on renvoie 500 pour que Stripe réessaie (livraison fiable).
    return new Response("n8n delivery failed", { status: 500 });
  }
  return new Response("ok", { status: 200 });
}
