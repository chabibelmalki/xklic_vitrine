import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { localeFromCountry, LOCALE_COOKIE } from "./i18n/config";

// Proxy (ex-middleware, renommé en Next.js 16). Trois responsabilités :
//   1. 410 Gone pour l'ancien SEO local `/zones/*` (pages supprimées).
//   2. Détection de langue par IP (en-tête géo Vercel) au 1ᵉʳ passage.
//   3. Routing i18n next-intl (préfixe as-needed, cookie, Accept-Language).
//
// Les paires `/metiers/{métier}/{ville}` restent gérées en 308 par
// next.config.ts (évalué AVANT le proxy).

const handleI18n = createMiddleware(routing);

function gone(): NextResponse {
  return new NextResponse(
    "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\">" +
      "<meta name=\"robots\" content=\"noindex\">" +
      "<title>Page supprimée</title></head><body>" +
      "<p>Cette page n'existe plus. <a href=\"/\">Retour à l'accueil</a>.</p>" +
      "</body></html>",
    { status: 410, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 1. Pages supprimées → 410 explicite (jamais indexé, jamais routé i18n).
  if (pathname === "/zones" || pathname.startsWith("/zones/")) {
    return gone();
  }

  // 2. Détection IP → langue. Priorité effective : cookie (choix manuel) >
  //    IP > Accept-Language > défaut. On n'agit QUE si aucun cookie n'existe
  //    encore : on injecte alors la langue déduite de l'IP dans la requête,
  //    et next-intl s'occupe de la redirection + de la persistance du cookie.
  const hasCookie = request.cookies.has(LOCALE_COOKIE);
  if (!hasCookie) {
    const country = request.headers.get("x-vercel-ip-country");
    const ipLocale = localeFromCountry(country);
    if (ipLocale) {
      request.cookies.set(LOCALE_COOKIE, ipLocale);
    }
  }

  // 3. Routing i18n.
  return handleI18n(request);
}

export const config = {
  // Tout sauf : routes API, internes Next/Vercel, et fichiers avec extension
  // (assets). `/zones` et les pages localisées passent bien par ici.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
