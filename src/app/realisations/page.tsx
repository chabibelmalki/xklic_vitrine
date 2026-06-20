import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { RealisationCard } from "@/components/sections/realisation-card";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getRealisations } from "@/lib/realisations";
import { SITE_URL } from "@/lib/site";

// Indexable (hérite du robots index/follow du layout — surtout pas de noindex).
export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Découvre les sites web créés par Xklic pour des artisans, indépendants et TPE : pâtisserie, garage, ménage, coaching… De vrais sites en ligne, métier par métier et ville par ville.",
  alternates: { canonical: "/realisations" },
  openGraph: {
    title: "Réalisations · Xklic",
    description:
      "Les sites web réalisés par Xklic pour des artisans et TPE — de vrais sites clients en ligne.",
    url: `${SITE_URL}/realisations`,
  },
};

// ISR : la liste vient du moteur, revalidée périodiquement (voir getRealisations).
export const revalidate = 3600;

function collectionLd(items: { client: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/realisations#page`,
    name: "Réalisations Xklic",
    url: `${SITE_URL}/realisations`,
    description:
      "Sites web créés par Xklic pour des artisans, indépendants et TPE.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: it.url,
        name: it.client,
      })),
    },
  };
}

export default async function RealisationsPage() {
  const items = await getRealisations();

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={collectionLd(items)} />
      <Header />

      <main className="relative flex-1 pt-16 lg:pt-18">
        {/* Glow chaud en tête de page */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] glow-ember"
          aria-hidden
        />

        {/* En-tête de page */}
        <section className="relative pt-16 sm:pt-20 lg:pt-24">
          <Container>
            <Reveal>
              <div className="flex max-w-2xl flex-col gap-4">
                <Eyebrow>Réalisations</Eyebrow>
                <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-[3.25rem]">
                  Des sites bien réels, en ligne et au travail.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg">
                  Chaque carte mène au vrai site du client. Pensés métier par
                  métier et ville par ville, d&apos;abord pour le mobile — et
                  conçus pour qu&apos;on les trouve sur Google.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Grille des réalisations */}
        <section className="relative py-14 sm:py-16 lg:py-20">
          <Container>
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <RevealItem key={item.url}>
                  <RealisationCard item={item} featured={i === 0} />
                </RevealItem>
              ))}
            </RevealGroup>

            {/* CTA discret en pied de grille */}
            <Reveal>
              <div className="mt-16 flex flex-col items-center gap-5 rounded-[var(--radius-card)] border border-line bg-ink-soft px-6 py-12 text-center">
                <p className="font-display text-2xl font-light text-cream sm:text-3xl">
                  La prochaine, c&apos;est peut-être la tienne.
                </p>
                <p className="max-w-md text-sm text-cream-muted">
                  Ton site pro, en ligne en 2h. Sans prise de tête, sans
                  engagement.
                </p>
                <ButtonLink href="/demarrer" size="lg">
                  Créer mon site
                  <ArrowRight size={18} />
                </ButtonLink>
                <Link
                  href="/"
                  className="text-sm text-cream-muted underline-offset-4 transition-colors hover:text-cream hover:underline"
                >
                  Revenir à l&apos;accueil
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
