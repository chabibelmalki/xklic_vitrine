import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Chargement de la configuration par requête (côté serveur) : résout la locale
// demandée et charge le dictionnaire de messages correspondant. Repli sur la
// locale par défaut si la valeur demandée n'est pas supportée.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
