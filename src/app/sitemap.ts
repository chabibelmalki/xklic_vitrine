import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { metierSlugs } from "@/data/metiers";
import { villeSlugs, handwrittenPairList } from "@/data/compose";
import { creerSitePages } from "@/data/creer-site";

// Sitemap DYNAMIQUE : énumère les pages statiques + tout le SEO programmatique
// (métiers, zones, paires métier×ville) en mappant sur les slugs du contrat de
// données. La page « confidentialité » est indexable (exigence de vérification
// Google Business Profile API) → incluse. Les « mentions-légales » restent en
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
    {
      url: url("/confidentialite"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/cgv"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Pages « créer site [métier] » — le CŒUR SEO (intention d'achat artisan).
  const creerSiteEntries: MetadataRoute.Sitemap = creerSitePages.map((p) => ({
    url: url(`/${p.urlSlug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

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

  // Paires métier×ville : SEULES les paires rédigées à la main sont indexées
  // (les 174 générées sont en noindex → volontairement hors sitemap, anti-doorway).
  const pairEntries: MetadataRoute.Sitemap = handwrittenPairList().map(
    ({ metier, ville }) => ({
      url: url(`/metiers/${metier}/${ville}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  return [
    ...staticEntries,
    ...creerSiteEntries,
    ...metierEntries,
    ...villeEntries,
    ...pairEntries,
  ];
}
