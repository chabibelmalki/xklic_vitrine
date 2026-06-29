import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { MetierCard } from "@/components/sections/metier-card";
import { CtaBand } from "@/components/sections/cta-band";
import { ProofBloc } from "@/components/sections/proof-bloc";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { metiers } from "@/data/metiers";
import { creerSiteUrlForMetier } from "@/data/creer-site";

// ISR : contenu programmatique stable, revalidé une fois par jour.
export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Sites web par métier — artisans & indépendants",
  description:
    "Plomberie, électricité, ménage, mécanique, serrurerie… Xklic crée un site web pro pensé pour ton métier, en ligne en 48h, optimisé pour le référencement local en Île-de-France.",
  path: "/metiers",
  keywords: [
    "site web artisan",
    "site internet plombier",
    "site web électricien",
    "création site métier",
    "site vitrine indépendant Île-de-France",
  ],
});

export default function MetiersPage() {
  const breadcrumb = breadcrumbLd([
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Métiers", url: `${SITE_URL}/metiers` },
  ]);

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={breadcrumb} />
      <Header />

      <main className="relative flex-1 pt-16 lg:pt-18">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] glow-ember"
          aria-hidden
        />

        <section className="relative pt-16 sm:pt-20 lg:pt-24">
          <Container>
            <Reveal>
              <div className="flex max-w-2xl flex-col gap-4">
                <Eyebrow>Métiers</Eyebrow>
                <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-[3.25rem]">
                  Un site pensé pour ton métier.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg">
                  Chaque métier a ses clients, ses urgences et ses arguments.
                  On crée un site qui parle le bon langage et te fait trouver
                  sur Google par les gens du coin — en ligne en 48h, sans
                  engagement.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="relative py-14 sm:py-16 lg:py-20">
          <Container>
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {metiers.map((metier) => (
                <RevealItem key={metier.slug} className="flex">
                  <MetierCard
                    metier={metier}
                    href={creerSiteUrlForMetier(metier.slug)}
                    className="w-full"
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>

        <ProofBloc reassurances={["En ligne en 48h", "Sans engagement", "Conçu et géré en France"]} />

        <CtaBand
          title="Ton métier mérite un vrai site."
          subtitle="On le crée pour toi, clés en main, en ligne en 48h. Sans engagement."
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
