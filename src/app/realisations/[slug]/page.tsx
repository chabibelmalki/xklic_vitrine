import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink, Star } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { CtaBand } from "@/components/sections/cta-band";
import { InternalLinks, type LinkGroup } from "@/components/sections/internal-links";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import {
  getRealisation,
  getRealisations,
  slugify,
  type Realisation,
} from "@/lib/realisations";
import { metiers } from "@/data/metiers";
import { villes } from "@/data/villes";
import { cn } from "@/lib/utils";

// ISR : la liste vient du moteur, revalidée périodiquement (voir realisations.ts).
export const revalidate = 3600;

// Pré-rendu statique d'une page par client (slug dérivé du nom, cf. realisations.ts).
export async function generateStaticParams() {
  const items = await getRealisations();
  return items.map((it) => ({ slug: it.slug }));
}

type Props = { params: Promise<{ slug: string }> };

// ── Cross-link best-effort vers la page métier×ville correspondante ──────────
// Le `trade`/`city` d'une réalisation sont du texte libre (moteur). On tente
// une correspondance souple avec nos données : ville par slug, métier par
// rapprochement nom/noun. Renvoie un href interne, sinon null.
function matchVille(city: string) {
  if (!city) return undefined;
  const s = slugify(city);
  return villes.find((v) => v.slug === s || slugify(v.name) === s);
}

function matchMetier(trade: string) {
  if (!trade) return undefined;
  const s = slugify(trade);
  return metiers.find((m) => {
    const candidates = [m.slug, slugify(m.name), slugify(m.noun)];
    return candidates.some((c) => c === s || c.includes(s) || s.includes(c));
  });
}

function microlinkPreview(url: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(
    url,
  )}&screenshot=true&embed=screenshot.url&meta=false&viewport.width=414&viewport.height=896`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getRealisation(slug);
  if (!item) {
    return buildMetadata({
      title: "Réalisation introuvable",
      description: "Cette réalisation n'existe pas ou n'est plus en ligne.",
      path: `/realisations/${slug}`,
      noindex: true,
    });
  }

  const meta = [item.trade, item.city].filter(Boolean).join(" · ");
  return buildMetadata({
    title: `${item.client}${meta ? ` — ${meta}` : ""}`,
    description: `Site web créé par Xklic pour ${item.client}${
      item.trade ? `, ${item.trade.toLowerCase()}` : ""
    }${item.city ? ` à ${item.city}` : ""}. Découvre le site en ligne et lance le tien, en ligne en 2h.`,
    path: `/realisations/${item.slug}`,
  });
}

// JSON-LD CreativeWork décrivant le site client réalisé par Xklic (l'agence
// = créateur / publisher). PAS de Review/AggregateRating : aucun avis réel
// disponible → on n'invente rien (cf. seo.ts, garde-fou conformité Google).
function creativeWorkLd(item: Realisation) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/realisations/${item.slug}#creativework`,
    name: `Site web de ${item.client}`,
    headline: item.client,
    url: item.url,
    inLanguage: "fr-FR",
    ...(item.city ? { locationCreated: { "@type": "Place", name: item.city } } : {}),
    creator: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: {
      "@type": "WebSite",
      name: item.client,
      url: item.url,
      ...(item.trade ? { description: item.trade } : {}),
    },
    mainEntityOfPage: `${SITE_URL}/realisations/${item.slug}`,
  };
}

export default async function RealisationDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getRealisation(slug);
  if (!item) notFound();

  const meta = [item.trade, item.city].filter(Boolean).join(" · ");
  const displayUrl = item.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Cross-link métier×ville (best-effort), sinon repli /realisations + /demarrer.
  const ville = matchVille(item.city);
  const metier = matchMetier(item.trade);

  const crumbs: Crumb[] = [
    { href: "/", label: "Accueil" },
    { href: "/realisations", label: "Réalisations" },
    { label: item.client },
  ];

  // Maillage interne : page métier×ville si on a une correspondance, page
  // métier seul si on a juste le métier, sinon liens utiles génériques.
  const relatedLinks: LinkGroup["links"] = [];
  if (metier && ville) {
    relatedLinks.push({
      href: `/metiers/${metier.slug}/${ville.slug}`,
      label: `${metier.name} ${ville.prep}`,
    });
  }
  if (metier) {
    relatedLinks.push({
      href: `/metiers/${metier.slug}`,
      label: `Sites web pour ${metier.nounPlural}`,
    });
  }
  relatedLinks.push({ href: "/realisations", label: "Toutes les réalisations" });

  const internalGroups: LinkGroup[] = [
    {
      title: metier || ville ? "Aller plus loin" : "Explorer",
      links: relatedLinks,
    },
  ];

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={creativeWorkLd(item)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", url: SITE_URL },
          { name: "Réalisations", url: `${SITE_URL}/realisations` },
          { name: item.client, url: `${SITE_URL}/realisations/${item.slug}` },
        ])}
      />
      <Header />

      <main className="relative flex-1 pt-16 lg:pt-18">
        {/* Glow chaud en tête */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] glow-ember"
          aria-hidden
        />

        <section className="relative pt-12 sm:pt-16 lg:pt-20">
          <Container>
            <Reveal>
              <Breadcrumbs items={crumbs} className="mb-8" />
            </Reveal>

            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              {/* Colonne texte */}
              <Reveal>
                <div className="flex flex-col gap-5">
                  <Eyebrow>{meta || "Réalisation"}</Eyebrow>
                  <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-cream sm:text-5xl">
                    {item.client}
                  </h1>

                  <div className="flex items-center gap-1 text-amber" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="fill-amber" />
                    ))}
                  </div>

                  <p className="max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg">
                    Un site pro pensé pour {item.client}
                    {item.trade ? ` (${item.trade.toLowerCase()})` : ""}
                    {item.city ? ` à ${item.city}` : ""} : clair, rapide, optimisé
                    pour le mobile et pour être trouvé sur Google. Conçu et mis en
                    ligne par Xklic.
                  </p>

                  {/* Lien sortant DOFOLLOW vers le site client live. */}
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                      href={item.url}
                      rel="dofollow noopener"
                      target="_blank"
                      className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ember px-7 text-[0.95rem] font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(229,67,31,0.6)] transition-transform duration-300 hover:-translate-y-0.5 sm:h-14 sm:px-8 sm:text-base"
                    >
                      <ExternalLink size={18} />
                      Voir le site en ligne
                    </a>
                    <span className="truncate text-sm text-cream-faint">
                      {displayUrl}
                    </span>
                  </div>

                  {/* Méta détaillée */}
                  <dl className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm">
                    {item.trade ? (
                      <div className="flex flex-col gap-1">
                        <dt className="text-xs uppercase tracking-[0.14em] text-cream-faint">
                          Activité
                        </dt>
                        <dd className="text-cream">{item.trade}</dd>
                      </div>
                    ) : null}
                    {item.city ? (
                      <div className="flex flex-col gap-1">
                        <dt className="text-xs uppercase tracking-[0.14em] text-cream-faint">
                          Ville
                        </dt>
                        <dd className="text-cream">{item.city}</dd>
                      </div>
                    ) : null}
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs uppercase tracking-[0.14em] text-cream-faint">
                        Statut
                      </dt>
                      <dd className="text-cream">En ligne</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs uppercase tracking-[0.14em] text-cream-faint">
                        Réalisé par
                      </dt>
                      <dd className="text-cream">Xklic</dd>
                    </div>
                  </dl>

                  {metier && ville ? (
                    <p className="mt-4 text-sm text-cream-muted">
                      Vous êtes {metier.noun} {ville.prep} ?{" "}
                      <Link
                        href={`/metiers/${metier.slug}/${ville.slug}`}
                        className="inline-flex items-center gap-1 font-medium text-ember-deep underline-offset-4 hover:underline"
                      >
                        Découvrez nos sites pour {metier.nounPlural} {ville.prep}
                        <ArrowUpRight size={14} />
                      </Link>
                    </p>
                  ) : null}
                </div>
              </Reveal>

              {/* Colonne aperçu — maquette mobile (même approche que la carte) */}
              <Reveal>
                <a
                  href={item.url}
                  rel="dofollow noopener"
                  target="_blank"
                  aria-label={`Ouvrir le site de ${item.client} (nouvel onglet)`}
                  className="group relative block overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-soft p-8 transition-all duration-500 hover:border-line-strong hover:shadow-card"
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
                      item.accent,
                    )}
                    aria-hidden
                  />
                  <div className="relative mx-auto w-[230px]">
                    <div className="rounded-[2rem] border border-line-strong bg-cream p-2 shadow-float">
                      <div className="relative overflow-hidden rounded-[1.6rem] bg-ink">
                        {/* Capture mobile auto du site live (microlink, sans clé). */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={microlinkPreview(item.url)}
                          alt={`Aperçu du site de ${item.client}${
                            item.trade ? ` — ${item.trade}` : ""
                          }`}
                          loading="lazy"
                          className="h-[420px] w-full bg-ink object-cover object-top"
                        />
                      </div>
                    </div>
                  </div>
                </a>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* Maillage interne */}
        <InternalLinks
          eyebrow="Sur le même thème"
          heading="Continuer la visite"
          groups={internalGroups}
          className="mt-12"
        />

        {/* CTA fort (conversions sacrées) */}
        <CtaBand
          title="Vous voulez un site comme celui-ci ?"
          subtitle="On crée le vôtre, clés en main, en ligne en 2h. Sans engagement."
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
