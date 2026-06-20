import "server-only";

// ─────────────────────────────────────────────────────────────────────────
// Envoi vers le webhook n8n (capture de leads / événements commande).
//
// Source unique de l'appel n8n, réutilisée par /api/lead (capture à la
// soumission), /api/checkout (panier abandonné) et /api/stripe/webhook
// (paiement confirmé). Ne jette JAMAIS : un échec n8n ne doit pas casser le
// parcours visiteur ni faire échouer un webhook Stripe vérifié.
// ─────────────────────────────────────────────────────────────────────────

export async function postToN8n(payload: unknown): Promise<boolean> {
  const webhook = process.env.N8N_WEBHOOK_URL;

  if (!webhook) {
    console.info(
      "[n8n] N8N_WEBHOOK_URL absent — payload non transmis :",
      JSON.stringify(payload),
    );
    return false;
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[n8n] Webhook a répondu", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[n8n] Échec d'envoi au webhook :", err);
    return false;
  }
}
