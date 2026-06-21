// ─────────────────────────────────────────────────────────────────────────
// Fabrique de métadonnées <head> — source UNIQUE pour que chaque page ait des
// title/description/canonical/OG non dupliqués. Le RootLayout fixe déjà
// `metadataBase`, le `title.template` (« %s · Xklic »), `robots` et l'OG de
// base ; ce helper ne renvoie donc QUE le delta par page.
//
// Next 16 : on retourne un objet `Metadata`. Les URL (canonical, OG) sont
// construites en absolu à partir de SITE_URL (cf. lib/site.ts) pour rester
// correctes même hors contexte de requête.
// ─────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { SITE_URL } from "./site";

type BuildMetadataInput = {
  /** Titre de la page (sans le suffixe « · Xklic » — ajouté par le template). */
  title: string;
  /** Meta description unique (~150–160 caractères idéalement). */
  description: string;
  /** Chemin de la page, ex. "/metiers/plomberie" ou "/metiers/plomberie/argenteuil". */
  path: string;
  /** Mots-clés longue traîne (optionnel). */
  keywords?: string[];
  /** Géociblage local — active les meta `geo.*` (pages métier×ville). */
  geo?: {
    /** ex. "FR-95" (FR + code département) ou "FR-IDF". */
    region: string;
    /** nom de lieu lisible, ex. "Argenteuil". */
    placename: string;
    /** position "lat;lng" pour `ICBM` / `geo.position` (optionnel). */
    position?: { lat: number; lng: number };
  };
  /** Empêche l'indexation de cette page précise (ex. pages utilitaires). */
  noindex?: boolean;
  /** Empêche aussi le suivi des liens (robots: nofollow). N'a d'effet qu'avec
   *  `noindex`. Utilisé pour les pages métier×ville générées (anti-doorway). */
  nofollow?: boolean;
};

/** Normalise un chemin en un chemin absolu commençant par "/". */
function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Construit l'objet `Metadata` Next 16 d'une page : title/description uniques,
 * `alternates.canonical` absolu, Open Graph + Twitter cohérents, et — pour les
 * pages locales — les meta géo (`geo.region`, `geo.placename`, `geo.position`,
 * `ICBM`) via le champ `other`.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  geo,
  noindex,
  nofollow,
}: BuildMetadataInput): Metadata {
  const canonicalPath = normalizePath(path);
  const url = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;

  // Meta géo locales (Google n'en tient pas un compte majeur, mais elles
  // restent un signal local propre et peu coûteux pour les pages métier×ville).
  const geoOther: Record<string, string> = {};
  if (geo) {
    geoOther["geo.region"] = geo.region;
    geoOther["geo.placename"] = geo.placename;
    if (geo.position) {
      const pos = `${geo.position.lat};${geo.position.lng}`;
      geoOther["geo.position"] = pos;
      geoOther["ICBM"] = `${geo.position.lat}, ${geo.position.lng}`;
    }
  }

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url,
      siteName: "Xklic",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: !nofollow } } : {}),
    ...(Object.keys(geoOther).length ? { other: geoOther } : {}),
  };
}
