// ─────────────────────────────────────────────────────────────────────────
// Données structurées (schema.org / JSON-LD) construites depuis le contenu.
// WebSite + Organization (site-wide) + Service/Offer + FAQPage (home).
// ─────────────────────────────────────────────────────────────────────────

import { brand, faq } from "./content";
import { SITE_URL } from "./site";

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
