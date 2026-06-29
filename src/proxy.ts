import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Proxy (ex-middleware, renommé en Next.js 16).
//
// 410 Gone pour l'ancien SEO local `/zones/*` : ces pages sont supprimées et
// n'ont AUCUNE cible pertinente (les pages-offre sont par métier, pas par
// ville). On émet un 410 explicite plutôt qu'un 301-vers-home (qui créerait
// des soft 404 et abîmerait la réputation du domaine). `redirects()` dans
// next.config.ts ne sait pas produire de 410 → c'est ici qu'on le fait.
//
// Les paires `/metiers/{métier}/{ville}` sont gérées en 308 par next.config.ts
// (évalué AVANT le proxy) ; le matcher ci-dessous ne cible donc QUE `/zones`,
// jamais `/metiers` (hub + fiches conservés et servis normalement).
export function proxy(_request: NextRequest) {
  return new NextResponse(
    "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\">" +
      "<meta name=\"robots\" content=\"noindex\">" +
      "<title>Page supprimée</title></head><body>" +
      "<p>Cette page n'existe plus. <a href=\"/\">Retour à l'accueil</a>.</p>" +
      "</body></html>",
    { status: 410, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export const config = {
  matcher: ["/zones", "/zones/:path*"],
};
