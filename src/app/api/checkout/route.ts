import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { leadSchema } from "@/lib/lead-schema";
import { createOrder } from "@/lib/orders";
import { postToN8n } from "@/lib/n8n";
import { stripe, pricesFor } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

// Le bouton « Commander » appelle cette route. Elle :
//   1. valide le lead côté serveur,
//   2. STOCKE la commande (id) pour qu'elle survive au passage par Stripe,
//   3. CAPTURE le lead tout de suite (panier abandonné — même sans paiement),
//   4. crée une session Stripe Checkout en mode abonnement (mensuel + frais
//      d'installation, code promo activé, email pré-rempli, id en metadata),
//   5. renvoie l'URL de la session pour redirection.
//
// IMPORTANT : aucun déclenchement n8n « paiement » ici. Le succès réel n'est
// confirmé que par le webhook Stripe vérifié (/api/stripe/webhook).
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const lead = parsed.data;

  // 1+2. Persiste la commande (survit à Stripe).
  const order = await createOrder(lead);

  // 3. Capture immédiate du lead (panier abandonné). Best-effort, ne bloque pas.
  await postToN8n({
    event: "checkout_started",
    orderId: order.id,
    ...lead,
    receivedAt: new Date().toISOString(),
    source: "xklic-vitrine",
  });

  const prices = pricesFor(lead.formule);
  const origin = req.headers.get("origin") || SITE_URL;

  // 4. Repli gracieux : Stripe non configuré (dev) ou prix manquant → on a déjà
  //    stocké la commande et capturé le lead. Pas d'URL → le formulaire affiche
  //    le remerciement sans redirection.
  if (!stripe || !prices.monthly) {
    if (stripe && !prices.monthly) {
      console.error(`[checkout] Prix Stripe manquant pour la formule "${lead.formule}".`);
    }
    return NextResponse.json({ ok: true, orderId: order.id, url: null });
  }

  // Mensuel (récurrent) + installation (one-time, facturé sur la 1ʳᵉ facture).
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: prices.monthly, quantity: 1 },
  ];
  if (prices.setup) lineItems.push({ price: prices.setup, quantity: 1 });

  const metadata = { orderId: order.id, orderUrl: order.url, formule: lead.formule };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      allow_promotion_codes: true, // champ code promo activé
      customer_email: lead.email,
      client_reference_id: order.id,
      metadata,
      // Essai de 30 j sur la part récurrente : au paiement le client ne règle
      // QUE les frais d'installation (one-time) ; le 1er prélèvement mensuel
      // intervient le mois suivant (fin d'essai).
      subscription_data: { metadata, trial_period_days: 30 },
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/demarrer`,
    });

    if (!session.url) throw new Error("session sans url");
    return NextResponse.json({ ok: true, orderId: order.id, url: session.url });
  } catch (err) {
    console.error("[checkout] Création de session Stripe échouée :", err);
    return NextResponse.json({ ok: false, error: "stripe_error" }, { status: 502 });
  }
}
