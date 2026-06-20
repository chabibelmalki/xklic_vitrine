import "server-only";
import Stripe from "stripe";
import type { FormuleSlug } from "./lead-schema";

// ─────────────────────────────────────────────────────────────────────────
// Stripe — CÔTÉ SERVEUR UNIQUEMENT. La clé secrète et le secret de webhook ne
// doivent jamais être exposés au client (aucun préfixe NEXT_PUBLIC_).
// ─────────────────────────────────────────────────────────────────────────

const secret = process.env.STRIPE_SECRET_KEY?.trim();

/** Stripe activé seulement si la clé est présente (repli gracieux en dev). */
export const stripe = secret ? new Stripe(secret) : null;

/**
 * Mapping formule → identifiants de prix Stripe, via variables d'env.
 * Chaque formule a un prix MENSUEL (récurrent) et un prix d'INSTALLATION
 * (one-time, ajouté à la première facture).
 *
 *   site        → « Votre site »            (Site)
 *   google      → « On s'occupe de Google » (Présence)
 *   haut-google → « En haut de Google »     (Leads)
 */
export interface FormulePrices {
  monthly?: string;
  setup?: string;
}

export function pricesFor(formule: FormuleSlug): FormulePrices {
  const map: Record<FormuleSlug, FormulePrices> = {
    site: {
      monthly: process.env.STRIPE_PRICE_SITE_MONTHLY,
      setup: process.env.STRIPE_PRICE_SITE_SETUP,
    },
    google: {
      monthly: process.env.STRIPE_PRICE_GOOGLE_MONTHLY,
      setup: process.env.STRIPE_PRICE_GOOGLE_SETUP,
    },
    "haut-google": {
      monthly: process.env.STRIPE_PRICE_HAUT_GOOGLE_MONTHLY,
      setup: process.env.STRIPE_PRICE_HAUT_GOOGLE_SETUP,
    },
  };
  return map[formule];
}
