import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
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
import { breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { villeSlugs, getVille } from "@/data/compose";
import { metiers } from "@/data/metiers";
import { villes } from "@/data/villes";

export const revalidate = 86400;

export function generateStaticParams() {
  return villeSlugs().map((ville) => ({ ville }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string }>;
}): Promise<Metadata> {
  const { ville: slug } = await params;
  const ville = getVille(slug);
  if (!ville) return {};

  return buildMetadata({
    title: `Création de site web ${ville.prep} (${ville.deptCode})`,
    description: `Xklic crée des sites web pro pour les artisans et indépendants ${ville.prep} (${ville.dept}). En ligne en 2h, optimisés pour le référencement local. 49€ puis 9,99€/mois.`,
    path: `/zones/${ville.slug}`,
    keywords: [
      `site web ${ville.name}`,
      `création site internet ${ville.name}`,
      `site artisan ${ville.name}`,
      `agence web ${ville.dept}`,
    ],
    geo: {
      region: `FR-${ville.deptCode}`,
      placename: ville.name,
      position: { lat: ville.geo.lat, lng: ville.geo.lng },
    },
  });
}

export default async function VillePage({
  params,
}: {
  params: Promise<{ ville: string }>;
}) {
  const { ville: slug } = await params;
  const ville = getVille(slug);
  if (!ville) notFound();

  const breadcrumb = breadcrumbLd([
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Zones", url: `${SITE_URL}/zones/${ville.slug}` },
    { name: ville.name, url: `${SITE_URL}/zones/${ville.slug}` },
  ]);

  // Maillage : tous les métiers dans cette ville.
  const metierGroups = [
    {
      title: `Métiers ${ville.prep}`,
      links: metiers.map((m) => ({
        href: `/metiers/${m.slug}/${ville.slug}`,
        label: `${m.name} ${ville.prep}`,
      })),
    },
  ];

  // Villes voisines (filtrées sur celles réellement connues).
  const nearbyVilles = ville.nearby
    .map((s) => villes.find((v) => v.slug === s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const nearbyGroup = [
    {
      title: "Villes voisines",
      links: nearbyVilles.map((v) => ({
        href: `/zones/${v.slug}`,
        label: `${v.name} (${v.deptCode})`,
      })),
    },
  ];

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={breadcrumb} />
      <Header />

      <main className="relative flex-1">
        <LocalHero
          eyebrow={`${ville.dept} · ${ville.deptCode}`}
          title={`Sites web pour artisans`}
          highlight={ville.prep}
          subtitle={`On crée ton site pro et on te rend visible auprès des habitants ${ville.prep}. En ligne en 2h, optimisé pour Google local.`}
          breadcrumbs={[
            { href: "/", label: "Accueil" },
            { label: ville.name },
          ]}
          secondaryCta={{ href: "/metiers", label: "Voir les métiers" }}
        />

        {/* Intro éditoriale ville */}
        <section className="relative py-16 sm:py-20">
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>{ville.name}</Eyebrow>
              <p className="mt-5 text-lg leading-relaxed text-cream-muted">
                {ville.intro}
              </p>
            </div>
          </Container>
        </section>

        {/* Repères locaux */}
        {ville.landmarks.length > 0 ? (
          <section className="relative border-t border-line py-16 sm:py-20">
            <Container>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                On couvre tout {ville.name} et ses environs
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-cream-muted">
                Quel que soit ton quartier, ton site te place sur les recherches
                locales des habitants {ville.prep}.
              </p>
              <ul className="mt-8 flex flex-wrap gap-3">
                {ville.landmarks.map((l) => (
                  <li
                    key={l}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-soft px-4 py-2 text-sm text-cream-muted"
                  >
                    <MapPin size={14} className="text-ember-deep" aria-hidden />
                    {l}
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        <ProofBloc reassurances={["En ligne en 2h", "Sans engagement", "Référencement local"]} />

        <InternalLinks
          eyebrow="Par métier"
          heading={`Quel est ton métier ${ville.prep} ?`}
          groups={metierGroups}
        />

        {nearbyGroup[0].links.length > 0 ? (
          <InternalLinks
            heading="Tu interviens aussi à côté ?"
            groups={nearbyGroup}
          />
        ) : null}

        <CtaBand
          title={`Fais-toi trouver ${ville.prep}.`}
          subtitle="On crée ton site pro, clés en main, en ligne en 2h. Sans engagement."
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
