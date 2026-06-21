// ─────────────────────────────────────────────────────────────────────────
// Données structurées (schema.org / JSON-LD) construites depuis le contenu.
// WebSite + Organization (site-wide) + Service/Offer + FAQPage (home).
// ─────────────────────────────────────────────────────────────────────────

import { brand, faq } from "./content";
import { SITE_URL } from "./site";
import type { Metier, Ville } from "@/data/types";

// Signal de marque : associe le nom « Xklic » (et l'alias « Xklic.com ») au
// domaine. Pas de SearchAction : le site n'a pas de moteur de recherche interne.
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: brand.name,
    alternateName: brand.domain,
    url: SITE_URL,
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: brand.name,
    url: SITE_URL,
    logo: `${SITE_URL}/xklic-logo.svg`,
    image: `${SITE_URL}/opengraph-image`,
    email: brand.email,
    description: brand.tagline,
    // Renseigne brand.social (TikTok, Instagram…) pour activer sameAs.
    ...(brand.social.length ? { sameAs: brand.social } : {}),
  };
}

export function serviceLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Création de site web pour artisans, auto-entrepreneurs et TPE",
    serviceType: "Création de site internet professionnel",
    description:
      "Site vitrine professionnel clés en main pour indépendants et TPE (artisan, femme de ménage, plombier, électricien…), en ligne en 2h. 49€ à la création puis 9,99€/mois, sans engagement.",
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: brand.name,
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "France" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: "9.99",
      description: "49€ à la création puis 9,99€/mois, sans engagement.",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/demarrer`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "9.99",
        priceCurrency: "EUR",
        unitText: "MONTH",
      },
    },
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// FAQPage à partir d'une liste de Q/R arbitraire (FAQ métier, page paire…).
// Renvoie null si la liste est vide → ne pas injecter de JSON-LD inutile.
export function faqLdFrom(items: { q: string; a: string }[]) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// SEO local programmatique — JSON-LD par métier et par paire métier×ville.
// ─────────────────────────────────────────────────────────────────────────

// Service rattaché à un métier (page /metiers/[metier]). areaServed = l'Île-de-
// France au sens large ; le ciblage ville fin se fait sur la page paire.
export function metierServiceLd(metier: Metier) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/metiers/${metier.slug}#service`,
    name: `Création de site internet pour ${metier.noun}`,
    serviceType: `Site web pour ${metier.noun}`,
    description: metier.hero,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "AdministrativeArea", name: "Île-de-France" },
    ...(metier.prestations.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `Prestations — ${metier.name}`,
            itemListElement: metier.prestations.map((p) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: p },
            })),
          },
        }
      : {}),
  };
}

// LocalBusiness/Service ancré sur une paire métier×ville (page
// /metiers/[metier]/[ville]). areaServed = la ville, geo depuis ville.geo,
// provider = l'Organization site-wide (par @id, pas de duplication).
export function localBusinessLd(metier: Metier, ville: Ville) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/metiers/${metier.slug}/${ville.slug}#service`,
    name: `Création de site internet pour ${metier.noun} ${ville.prep}`,
    serviceType: `Site web pour ${metier.noun}`,
    description: `Site vitrine professionnel pour ${metier.nounPlural} ${ville.prep} (${ville.deptCode}) — en ligne en 2h, optimisé pour le référencement local.`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: {
      "@type": "City",
      name: ville.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: ville.name,
        addressRegion: ville.dept,
        postalCode: ville.postalCodes[0],
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: ville.geo.lat,
        longitude: ville.geo.lng,
      },
    },
  };
}

// Fil d'Ariane (BreadcrumbList). `items` = [{ name, url }] dans l'ordre,
// du plus général au plus précis. Les URL doivent être absolues.
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// AggregateRating — JAMAIS de faux avis. N'émet QUELQUE CHOSE que si on lui
// passe un volume d'avis réel (> 0) et une note. Sinon renvoie null et
// l'appelant n'injecte rien. Garde-fou volontaire pour la conformité Google.
export function aggregateRatingLd(input?: {
  ratingValue: number;
  reviewCount: number;
}) {
  if (!input || !(input.reviewCount > 0) || !(input.ratingValue > 0)) {
    return null;
  }
  return {
    "@type": "AggregateRating",
    ratingValue: input.ratingValue,
    reviewCount: input.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}
