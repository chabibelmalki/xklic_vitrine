import "server-only";
import Stripe from "stripe";
import type { FormuleSlug, BoutiqueTier } from "./lead-schema";

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

// Option boutique : 2e item du même abonnement que le socle, PAS de frais
// d'installation (self-service, mensuel récurrent seul). Le type `BoutiqueTier`
// vient de lead-schema.ts (source de vérité unique, cf. `FormuleSlug`).

/**
 * Mapping palier boutique → identifiant de prix Stripe MENSUEL, via variables
 * d'env. Même comportement que `pricesFor` : renvoie `undefined` si la var
 * n'est pas configurée (repli gracieux géré par l'appelant, pas d'exception).
 */
export function shopPriceFor(tier: BoutiqueTier): string | undefined {
  const map: Record<BoutiqueTier, string | undefined> = {
    starter: process.env.STRIPE_PRICE_SHOP_STARTER_MONTHLY,
    pro: process.env.STRIPE_PRICE_SHOP_PRO_MONTHLY,
    business: process.env.STRIPE_PRICE_SHOP_BUSINESS_MONTHLY,
  };
  return map[tier];
}
