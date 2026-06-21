import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { metierSlugs, villeSlugs } from "@/data/compose";

// Sitemap DYNAMIQUE : énumère les pages statiques + tout le SEO programmatique
// (métiers, zones, paires métier×ville) en mappant sur les slugs du contrat de
// données. Les pages légales (mentions-légales, confidentialité) sont en
// noindex → volontairement absentes.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;

  const metiers = metierSlugs();
  const villes = villeSlugs();

  // Pages éditoriales / statiques.
  const staticEntries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: url("/metiers"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: url("/realisations"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: url("/tarifs"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/faq"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: url("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: url("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: url("/demarrer"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Pages métier : /metiers/[metier]
  const metierEntries: MetadataRoute.Sitemap = metiers.map((slug) => ({
    url: url(`/metiers/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Pages zone : /zones/[ville]
  const villeEntries: MetadataRoute.Sitemap = villes.map((slug) => ({
    url: url(`/zones/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Pages paire métier×ville : /metiers/[metier]/[ville] (le gros du volume).
  const pairEntries: MetadataRoute.Sitemap = metiers.flatMap((metier) =>
    villes.map((ville) => ({
      url: url(`/metiers/${metier}/${ville}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [
    ...staticEntries,
    ...metierEntries,
    ...villeEntries,
    ...pairEntries,
  ];
}
