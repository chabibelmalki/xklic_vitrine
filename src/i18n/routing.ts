import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale, LOCALE_COOKIE } from "./config";

// Routing i18n next-intl.
//   • localePrefix: "as-needed" → `fr` (défaut) servi SANS préfixe à la racine
//     (préserve les URLs existantes et le SEO), les autres langues préfixées.
//   • localeCookie → persistance du choix manuel (prime sur la détection IP).
//   • localeDetection: true → next-intl tente cookie puis Accept-Language ;
//     la détection IP est injectée en amont dans le proxy (voir src/proxy.ts).
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeCookie: {
    name: LOCALE_COOKIE,
    maxAge: 60 * 60 * 24 * 365, // 1 an
    sameSite: "lax",
  },
});
