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
import {
  localBusinessLd,
  breadcrumbLd,
  faqLdFrom,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import {
  allPairs,
  getMetier,
  getVille,
  composePair,
  isHandwrittenPair,
} from "@/data/compose";
import { metiers } from "@/data/metiers";
import { villes } from "@/data/villes";

export const revalidate = 86400;

export function generateStaticParams() {
  return allPairs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ metier: string; ville: string }>;
}): Promise<Metadata> {
  const { metier: mSlug, ville: vSlug } = await params;
  const metier = getMetier(mSlug);
  const ville = getVille(vSlug);
  if (!metier || !ville) return {};

  const { title, description } = composePair(metier, ville);

  // Anti-doorway : seules les paires rédigées à la main sont indexables. Les
  // paires générées passent en noindex + nofollow (accessibles mais hors index).
  const generated = !isHandwrittenPair(metier.slug, ville.slug);

  return buildMetadata({
    title,
    description,
    path: `/metiers/${metier.slug}/${ville.slug}`,
    keywords: [
      `${metier.noun} ${ville.name}`,
      `${metier.name.toLowerCase()} ${ville.prep}`,
      `site web ${metier.noun} ${ville.name}`,
      ...metier.keywords.slice(0, 3),
    ],
    geo: {
      region: `FR-${ville.deptCode}`,
      placename: ville.name,
      position: { lat: ville.geo.lat, lng: ville.geo.lng },
    },
    ...(generated ? { noindex: true, nofollow: true } : {}),
  });
}

export default async function PairPage({
  params,
}: {
  params: Promise<{ metier: string; ville: string }>;
}) {
  const { metier: mSlug, ville: vSlug } = await params;
  const metier = getMetier(mSlug);
  const ville = getVille(vSlug);
  if (!metier || !ville) notFound();

  const { body, intents, faq: pairFaq } = composePair(metier, ville);
  // FAQ différenciée par ville sur les paires rédigées main ; sinon, FAQ métier.
  const faq = pairFaq ?? metier.faq;

  const breadcrumb = breadcrumbLd([
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Métiers", url: `${SITE_URL}/metiers` },
    { name: metier.name, url: `${SITE_URL}/metiers/${metier.slug}` },
    {
      name: ville.name,
      url: `${SITE_URL}/metiers/${metier.slug}/${ville.slug}`,
    },
  ]);
  const faqLd = faqLdFrom(faq);

  // Maillage : autres métiers dans la même ville.
  const sameVilleGroup = {
    title: `Autres métiers ${ville.prep}`,
    links: metiers
      .filter((m) => m.slug !== metier.slug)
      .map((m) => ({
        href: `/metiers/${m.slug}/${ville.slug}`,
        label: `${m.name} ${ville.prep}`,
      })),
  };

  // Même métier dans les villes voisines.
  const nearbyVilles = ville.nearby
    .map((s) => villes.find((v) => v.slug === s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const nearbyGroup = {
    title: `${metier.name} à côté`,
    links: nearbyVilles.map((v) => ({
      href: `/metiers/${metier.slug}/${v.slug}`,
      label: `${metier.name} ${v.prep}`,
    })),
  };

  // Retour vers les pages hub.
  const hubGroup = {
    title: "Pages liées",
    links: [
      { href: `/metiers/${metier.slug}`, label: `${metier.name} (tous secteurs)` },
      { href: `/zones/${ville.slug}`, label: `Tous les métiers ${ville.prep}` },
    ],
  };

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={localBusinessLd(metier, ville)} />
      <JsonLd data={breadcrumb} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <Header />

      <main className="relative flex-1">
        <LocalHero
          eyebrow={`${metier.name} · ${ville.name}`}
          title={`${metier.name}`}
          highlight={ville.prep}
          subtitle={`Tu es ${metier.gender === "f" ? "une" : "un"} ${metier.noun} ${ville.prep} ? On crée ton site pro qui te fait trouver sur Google par les habitants du secteur. En ligne en 2h.`}
          breadcrumbs={[
            { href: "/", label: "Accueil" },
            { href: "/metiers", label: "Métiers" },
            { href: `/metiers/${metier.slug}`, label: metier.name },
            { label: ville.name },
          ]}
          secondaryCta={{ href: "/tarifs", label: "Voir les tarifs" }}
        />

        {/* Corps unique composé (≥ 300 mots) */}
        <section className="relative py-16 sm:py-20">
          <Container>
            <article className="max-w-3xl">
              <Eyebrow>
                {metier.name} {ville.prep}
              </Eyebrow>
              <div className="mt-6 flex flex-col gap-5">
                {body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-cream-muted sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          </Container>
        </section>

        {/* Prestations */}
        <section className="relative border-t border-line py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
              {metier.name} {ville.prep} : tes prestations en avant
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {metier.prestations.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-ink-soft px-5 py-4 text-base leading-relaxed text-cream"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15">
                    <Check size={12} className="text-ember-deep" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            {/* Intentions de recherche couvertes */}
            {intents.length > 0 ? (
              <div className="mt-10">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-cream-faint">
                  On te place sur ces recherches
                </p>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {intents.map((intent) => (
                    <li
                      key={intent}
                      className="rounded-full border border-line bg-ink/60 px-3.5 py-1.5 text-sm text-cream-muted"
                    >
                      {intent}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Container>
        </section>

        <ProofBloc reassurances={["En ligne en 2h", "Sans engagement", "Optimisé pour Google local"]} />

        {/* FAQ (différenciée par ville sur les paires rédigées main) */}
        {faq.length > 0 ? (
          <section className="relative border-t border-line py-16 sm:py-20">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                <div>
                  <Eyebrow>Questions fréquentes</Eyebrow>
                  <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                    {metier.name} {ville.prep} : vos questions
                  </h2>
                </div>
                <ul className="flex flex-col">
                  {faq.map((item) => (
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
          eyebrow="Maillage local"
          heading="À explorer aussi"
          groups={[sameVilleGroup, nearbyGroup, hubGroup]}
        />

        <CtaBand
          title={`Ton site de ${metier.name.toLowerCase()} ${ville.prep}, en ligne en 2h.`}
          subtitle="Clés en main, optimisé pour Google local. Sans engagement."
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
