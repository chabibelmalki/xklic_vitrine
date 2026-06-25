import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { LocalHero } from "@/components/sections/local-hero";
import { InternalLinks } from "@/components/sections/internal-links";
import { CtaBand } from "@/components/sections/cta-band";
import { ProofBloc } from "@/components/sections/proof-bloc";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbLd, faqLdFrom } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { creerSitePages, getCreerSite } from "@/data/creer-site";

// Métadonnées <head> d'une page « créer site [métier] » — indexable, unique.
export function creerSiteMetadata(urlSlug: string): Metadata {
  const page = getCreerSite(urlSlug);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.urlSlug}`,
    keywords: page.keywords,
  });
}

// JSON-LD Service : Xklic crée un site pour ce métier. Xklic est NATIONAL →
// areaServed = France (pas de LocalBusiness/NAP ici, cf. consigne).
function serviceLdFor(urlSlug: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/${urlSlug}#service`,
    name,
    serviceType: "Création de site internet professionnel",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "France" },
    description,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: "9.99",
      description: "49€ à la création puis 9,99€/mois, sans engagement.",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/demarrer`,
    },
  };
}

export function CreerSiteTemplate({ urlSlug }: { urlSlug: string }) {
  const page = getCreerSite(urlSlug);
  if (!page) notFound();

  const breadcrumb = breadcrumbLd([
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Métiers", url: `${SITE_URL}/metiers` },
    { name: `Créer un site · ${page.metierLabel}`, url: `${SITE_URL}/${page.urlSlug}` },
  ]);
  const serviceLd = serviceLdFor(page.urlSlug, page.metaTitle, page.metaDescription);
  const faqLd = faqLdFrom(page.faq);

  // Maillage : vers la page métier (référencement local) + autres « créer site ».
  const goFurther = {
    title: "Aller plus loin",
    links: [
      {
        href: `/metiers/${page.metierSlug}`,
        label: `${page.metierLabel} : référencement local`,
      },
      { href: "/tarifs", label: "Nos tarifs" },
      { href: "/realisations", label: "Nos réalisations" },
    ],
  };
  const otherTrades = {
    title: "Créer le site d'un autre métier",
    links: creerSitePages
      .filter((p) => p.urlSlug !== page.urlSlug)
      .map((p) => ({ href: `/${p.urlSlug}`, label: p.metierLabel })),
  };

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={serviceLd} />
      <JsonLd data={breadcrumb} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <Header />

      <main className="relative flex-1">
        <LocalHero
          eyebrow={page.eyebrow}
          title={page.h1}
          subtitle={page.lead}
          breadcrumbs={[
            { href: "/", label: "Accueil" },
            { href: "/metiers", label: "Métiers" },
            { label: "Créer un site" },
          ]}
          primaryCta={{ href: "/demarrer", label: "Créer mon site" }}
          secondaryCta={{ href: "/tarifs", label: "Voir les tarifs" }}
        />

        {/* Intro */}
        <section className="relative py-16 sm:py-20">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Ton site, simplement</Eyebrow>
              <p className="mt-5 text-lg leading-relaxed text-cream-muted">
                {page.intro}
              </p>
            </div>
          </Container>
        </section>

        {/* Sections éditoriales */}
        <section className="relative border-t border-line py-16 sm:py-20">
          <Container>
            <div className="flex max-w-3xl flex-col gap-12">
              {page.sections.map((s) => (
                <div key={s.h2}>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                    {s.h2}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-cream-muted sm:text-lg">
                    {s.p}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Ce qu'on met sur le site */}
        <section className="relative border-t border-line py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
              Ce que Xklic met sur ton site
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {page.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-ink-soft px-5 py-4 text-base leading-relaxed text-cream"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15">
                    <Check size={12} className="text-ember-deep" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <ProofBloc
          reassurances={["En ligne en 48h", "49€ puis 9,99€/mois", "Sans engagement"]}
        />

        {/* FAQ métier (création de site) */}
        {page.faq.length > 0 ? (
          <section className="relative border-t border-line py-16 sm:py-20">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                <div>
                  <Eyebrow>Questions fréquentes</Eyebrow>
                  <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                    Créer ton site : ce qu&apos;on nous demande
                  </h2>
                </div>
                <ul className="flex flex-col">
                  {page.faq.map((item) => (
                    <li
                      key={item.q}
                      className="border-b border-line py-5 first:border-t"
                    >
                      <h3 className="text-base font-medium text-cream sm:text-lg">
                        {item.q}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream-muted sm:text-base">
                        {item.a}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        ) : null}

        <InternalLinks
          eyebrow="À explorer"
          heading="Continue par là"
          groups={[goFurther, otherTrades]}
        />

        <CtaBand
          title={`Ton site de ${page.metierLabel.toLowerCase()}, en ligne en 48h.`}
          subtitle="Clés en main, optimisé pour Google. 49€ puis 9,99€/mois, sans engagement."
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
