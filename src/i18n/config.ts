// ─────────────────────────────────────────────────────────────────────────
// Configuration i18n — source unique des locales et du mapping pays → langue.
//
// 8 langues, `fr` par défaut (servie à la racine, sans préfixe, pour préserver
// le SEO et les URLs existantes). Les 7 autres sont préfixées (`/en`, `/ar`…).
// ─────────────────────────────────────────────────────────────────────────

export const locales = ["fr", "en", "es", "pt", "de", "it", "nl", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

// Nom du cookie de persistance du choix de langue (partagé proxy ⇆ routing).
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Langues écrites de droite à gauche → pilote `dir="rtl"` et les ajustements CSS.
export const rtlLocales: readonly Locale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

// Libellé natif + drapeau, pour le sélecteur de langue. Le libellé est écrit
// DANS la langue elle-même (endonyme) : un hispanophone lit « Español ».
export const localeMeta: Record<Locale, { label: string; flag: string; dir: "ltr" | "rtl" }> = {
  fr: { label: "Français", flag: "🇫🇷", dir: "ltr" },
  en: { label: "English", flag: "🇬🇧", dir: "ltr" },
  es: { label: "Español", flag: "🇪🇸", dir: "ltr" },
  pt: { label: "Português", flag: "🇵🇹", dir: "ltr" },
  de: { label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  it: { label: "Italiano", flag: "🇮🇹", dir: "ltr" },
  nl: { label: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  ar: { label: "العربية", flag: "🇸🇦", dir: "rtl" },
};

// Balises `hreflang` / attribut OpenGraph `locale` par langue (format BCP-47).
export const ogLocale: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES",
  pt: "pt_PT",
  de: "de_DE",
  it: "it_IT",
  nl: "nl_NL",
  ar: "ar_MA",
};

// ── Mapping pays (ISO 3166-1 alpha-2) → langue ────────────────────────────
// Alimenté par l'en-tête géo `x-vercel-ip-country`. Tout pays absent retombe
// sur `fr` (marché historique). Le choix manuel (cookie) prime toujours.
//
// Choix assumés : Canada et Suisse → `fr` (positionnement francophone Xklic) ;
// Maghreb + Golfe + Levant → `ar` (demande explicite « Maroc = arabe »), le
// visiteur pouvant repasser en français en un clic via le sélecteur.
export const countryToLocale: Record<string, Locale> = {
  // Français (marchés francophones — la plupart retombent déjà sur le défaut)
  FR: "fr", BE: "fr", CH: "fr", LU: "fr", MC: "fr", CA: "fr", AD: "fr",
  SN: "fr", CI: "fr", CM: "fr", BJ: "fr", BF: "fr", BI: "fr", CG: "fr",
  CD: "fr", GA: "fr", GN: "fr", ML: "fr", NE: "fr", TD: "fr", TG: "fr",
  MG: "fr", MR: "fr", DJ: "fr", KM: "fr", CF: "fr", RW: "fr", HT: "fr",

  // Anglais
  US: "en", GB: "en", IE: "en", AU: "en", NZ: "en", GH: "en", KE: "en",
  NG: "en", IN: "en", SG: "en", ZA: "en", MU: "en", SC: "en",

  // Espagnol (Espagne + Amérique latine hispanophone)
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",

  // Portugais
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt", CV: "pt",

  // Allemand
  DE: "de", AT: "de", LI: "de",

  // Italien
  IT: "it", SM: "it", VA: "it",

  // Néerlandais
  NL: "nl",

  // Arabe (Maghreb + Golfe + Levant + Égypte)
  MA: "ar", DZ: "ar", TN: "ar", SA: "ar", AE: "ar", EG: "ar", QA: "ar",
  JO: "ar", LB: "ar", KW: "ar", BH: "ar", OM: "ar", IQ: "ar", LY: "ar",
  SD: "ar", YE: "ar",
};

// Résout une langue depuis un code pays ISO (ex. en-tête Vercel). Insensible à
// la casse. Renvoie `undefined` si non couvert → l'appelant décide du repli.
export function localeFromCountry(code?: string | null): Locale | undefined {
  if (!code) return undefined;
  return countryToLocale[code.trim().toUpperCase()];
}
