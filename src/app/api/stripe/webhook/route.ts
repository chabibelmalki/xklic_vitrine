import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getOrderByUrl } from "@/lib/orders";
import { upsertOrder } from "@/lib/backoffice";
import { sendMail, buildEmail, buildClientConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";
// Corps brut requis pour vérifier la signature : on ne lit JAMAIS req.json().

// Webhook Stripe — SEUL point qui enregistre un « paiement confirmé ».
//
// La redirection success_url N'EST PAS fiable (falsifiable, ratable) : on ne
// déclenche donc rien depuis /merci. Ici, on VÉRIFIE LA SIGNATURE Stripe
// (obligatoire), on écoute checkout.session.completed, on recharge la commande
// via l'URL en metadata, et on écrit le statut « payé » dans le back-office.
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

  // Récupère le code promo éventuel (non développé dans l'événement brut) et
  // le montant de la réduction appliquée.
  let promoCode: string | null = null;
  let discountCents: number | null = null;
  try {
    const full = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["discounts.promotion_code"],
    });
    const promo = full.discounts?.[0]?.promotion_code;
    if (promo && typeof promo !== "string") promoCode = promo.code;
    const discount = full.total_details?.amount_discount;
    if (typeof discount === "number" && discount > 0) discountCents = discount;
  } catch {
    /* enrichissement best-effort */
  }

  // 3. Écriture du statut « payé » dans le back-office (SEUL déclenchement
  //    provoqué par le paiement, depuis ce webhook vérifié). BLOQUANT : le
  //    back-office est la source de vérité — un échec renvoie 500 et Stripe
  //    rejouera l'événement (retries pendant plusieurs jours). Le replay est
  //    idempotent côté serveur : upsert du dossier par `ref` + upsert du
  //    paiement par `stripe_session` (aucun doublon).
  const written = await upsertOrder({
    statut: "payé",
    lead: order.lead,
    orderId: order.id,
    payment: {
      amountTotal: session.amount_total,
      currency: session.currency,
      promoCode,
      discountCents,
      sessionId: session.id,
      subscriptionId:
        typeof session.subscription === "string" ? session.subscription : null,
      // Client Stripe (cus_…) — nécessaire pour modifier l'abonnement plus tard
      // (ajout/retrait de l'item boutique). Non capturé jusqu'ici (colonne
      // stripe_customer, lot 1). En mode subscription, `customer` est toujours posé.
      customerId:
        typeof session.customer === "string" ? session.customer : null,
    },
  });

  if (!written) {
    // Échec d'écriture : 500 pour que Stripe réessaie (livraison fiable).
    return new Response("backoffice write failed", { status: 500 });
  }

  // 4. Notification e-mail à contact@xklic.com (best-effort, NON bloquant : un
  //    échec d'envoi ne doit pas re-déclencher le webhook — la source de vérité
  //    est le back-office, déjà écrit ci-dessus). On `await` quand même : sur
  //    Vercel, le travail après le retour de la fonction n'est pas garanti.
  const { lead } = order;
  const montant =
    session.amount_total != null
      ? `${(session.amount_total / 100).toFixed(2)} ${(session.currency ?? "eur").toUpperCase()}`
      : "—";
  const { html, text } = buildEmail({
    title: `Nouveau paiement confirmé — ${lead.companyName || "client"}`,
    rows: [
      ["Formule", lead.formule],
      ["Entreprise", lead.companyName],
      ["Métier", lead.trade],
      ["Ville", lead.city],
      ["Téléphone", lead.phone],
      ["E-mail", lead.email],
      ["Montant", montant],
      ["Code promo", promoCode],
      ["Commande", order.id],
      ["Session Stripe", session.id],
    ],
    footer: "Le récap complet est dans le back-office (statut « payé »).",
  });
  await sendMail({
    subject: `💳 Paiement confirmé — ${lead.companyName || "client"} (${montant})`,
    html,
    text,
    replyTo: lead.email || undefined,
  });

  // 5. E-mail CLIENT de confirmation (distinct de l'e-mail équipe ci-dessus, qui
  //    part vers LEAD_TO : les DEUX partent). Toutes les infos du site sont
  //    recueillies avant le paiement (tunnel) — plus de profil à compléter après.
  //    BEST-EFFORT STRICT : un échec ici ne doit JAMAIS faire échouer le webhook
  //    (sinon Stripe rejoue en boucle → risque de doublons). Le try/catch avale
  //    tout et on renvoie 200 quoi qu'il arrive (le statut « payé » est déjà
  //    écrit et durable au point 3).
  if (lead.email) {
    try {
      const client = buildClientConfirmationEmail({ companyName: lead.companyName });
      await sendMail({
        to: lead.email,
        subject: "Votre paiement est confirmé — votre site est en préparation",
        html: client.html,
        text: client.text,
      });
    } catch (err) {
      console.error("[stripe-webhook] E-mail client échoué (ignoré) :", err);
    }
  }

  return new Response("ok", { status: 200 });
}
