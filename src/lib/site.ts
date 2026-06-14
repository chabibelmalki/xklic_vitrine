// ─────────────────────────────────────────────────────────────────────────
// URL de base & indexabilité — source unique pour metadataBase, canonical,
// Open Graph, sitemap et robots.
//
// SITE_URL est piloté par NEXT_PUBLIC_SITE_URL (à définir = https://xklic.com
// en prod). Le fallback est volontairement le domaine de prod, JAMAIS
// localhost ni *.vercel.app : ainsi canonical/OG restent corrects même si la
// variable manque sur un déploiement.
// ─────────────────────────────────────────────────────────────────────────

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://xklic.com"
).replace(/\/+$/, "");

// On indexe uniquement la prod (vrai domaine). Les previews Vercel
// (*.vercel.app) et `vercel dev` passent en noindex. Le dev local
// (`npm run dev`, VERCEL_ENV absent) reste indexable — non déployé, sans effet.
export const IS_INDEXABLE = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : true;
