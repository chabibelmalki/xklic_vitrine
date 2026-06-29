import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
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
import {
  metierServiceLd,
  breadcrumbLd,
  faqLdFrom,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { metiers, metierSlugs, getMetier } from "@/data/metiers";
import { creerSiteUrlForMetier } from "@/data/creer-site";

export const revalidate = 86400;

export function generateStaticParams() {
  return metierSlugs().map((metier) => ({ metier }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ metier: string }>;
}): Promise<Metadata> {
  const { metier: slug } = await params;
  const metier = getMetier(slug);
  if (!metier) return {};

  return buildMetadata({
    title: `Site web pour ${metier.noun} — ${metier.name}`,
    description: `${metier.hero} Xklic crée ton site de ${metier.name.toLowerCase()} en 48h, optimisé pour le référencement local. 49€ puis 9,99€/mois, sans engagement.`,
    path: `/metiers/${metier.slug}`,
    keywords: metier.keywords,
  });
}

export default async function MetierPage({
  params,
}: {
  params: Promise<{ metier: string }>;
}) {
  const { metier: slug } = await params;
  const metier = getMetier(slug);
  if (!metier) notFound();

  const breadcrumb = breadcrumbLd([
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Métiers", url: `${SITE_URL}/metiers` },
    { name: metier.name, url: `${SITE_URL}/metiers/${metier.slug}` },
  ]);
  const faqLd = faqLdFrom(metier.faq);
  const creerSiteHref = creerSiteUrlForMetier(metier.slug);

  // Maillage : autres métiers (fiche recadrée — plus de pages métier×ville).
  const otherMetierGroup = [
    {
      title: "Autres métiers",
      links: metiers
        .filter((m) => m.slug !== metier.slug)
        .map((m) => ({ href: `/metiers/${m.slug}`, label: m.name })),
    },
  ];

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={metierServiceLd(metier)} />
      <JsonLd data={breadcrumb} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <Header />

      <main className="relative flex-1">
        <LocalHero
          eyebrow={metier.name}
          title={`Un site web pro pour les`}
          highlight={metier.nounPlural}
          subtitle={metier.hero}
          breadcrumbs={[
            { href: "/", label: "Accueil" },
            { href: "/metiers", label: "Métiers" },
            { label: metier.name },
          ]}
          secondaryCta={{ href: "/tarifs", label: "Voir les tarifs" }}
        />

        {/* Intro éditoriale du métier */}
        <section className="relative py-16 sm:py-20">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Le métier</Eyebrow>
              <p className="mt-5 text-lg leading-relaxed text-cream-muted">
                {metier.intro}
              </p>
              {creerSiteHref ? (
                <Link
                  href={creerSiteHref}
                  className="group mt-7 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-5 py-2.5 text-sm font-medium text-ember-deep transition-colors hover:bg-ember/15"
                >
                  Créer ton site de {metier.name.toLowerCase()}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              ) : null}
            </div>
          </Container>
        </section>

        {/* Prestations + pain points */}
        <section className="relative border-t border-line py-16 sm:py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                  Tes prestations, mises en valeur
                </h2>
                <ul className="mt-6 flex flex-col gap-3">
                  {metier.prestations.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-base leading-relaxed text-cream"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15">
                        <Check size={12} className="text-ember-deep" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                  Ce que cherchent tes clients
                </h2>
                <ul className="mt-6 flex flex-col gap-3">
                  {metier.painPoints.map((p) => (
                    <li
                      key={p}
                      className="rounded-2xl border border-line bg-ink-soft px-5 py-4 text-base leading-relaxed text-cream-muted"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <ProofBloc reassurances={["En ligne en 48h", "Sans engagement", "Optimisé pour Google local"]} />

        {/* FAQ métier */}
        {metier.faq.length > 0 ? (
          <section className="relative border-t border-line py-16 sm:py-20">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                <div>
                  <Eyebrow>Questions fréquentes</Eyebrow>
                  <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                    {metier.name} : ce qu&apos;on nous demande
                  </h2>
                </div>
                <ul className="flex flex-col">
                  {metier.faq.map((item) => (
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

        <InternalLinks groups={otherMetierGroup} />

        <CtaBand
          title={`Prêt à attirer plus de clients en ${metier.name.toLowerCase()} ?`}
          subtitle="On crée ton site pro, clés en main, en ligne en 48h. Sans engagement."
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
