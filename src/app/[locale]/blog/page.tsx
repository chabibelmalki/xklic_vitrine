import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { articles } from "@/data/articles";
import { formatArticleDate } from "@/lib/format-date";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Conseils concrets pour les artisans, indépendants et TPE : prix d'un site, visibilité sur Google, fiche Google, référencement local. Sans jargon, sans langue de bois.",
  path: "/blog",
  keywords: [
    "blog site internet artisan",
    "conseils référencement local artisan",
    "prix site internet artisan",
    "être visible sur Google artisan",
  ],
});

// Revalidation quotidienne — contenu éditorial stable.
export const revalidate = 86400;

// Trie du plus récent au plus ancien (dates ISO codées en dur).
const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));

function collectionLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blog#page`,
    name: "Blog Xklic",
    url: `${SITE_URL}/blog`,
    description:
      "Conseils pour artisans et TPE : site internet, visibilité Google, référencement local.",
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sorted.length,
      itemListElement: sorted.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${a.slug}`,
        name: a.title,
      })),
    },
  };
}

export default function BlogIndexPage() {
  const crumbs = breadcrumbLd([
    { name: "Accueil", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ]);

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={collectionLd()} />
      <JsonLd data={crumbs} />
      <Header />

      <main className="relative flex-1 pt-16 lg:pt-18">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] glow-ember"
          aria-hidden
        />

        {/* En-tête */}
        <section className="relative pt-16 sm:pt-20 lg:pt-24">
          <Container>
            <Breadcrumbs
              items={[{ href: "/", label: "Accueil" }, { label: "Blog" }]}
              className="mb-8"
            />
            <div className="flex max-w-2xl flex-col gap-4">
              <Eyebrow>Le blog</Eyebrow>
              <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-[3.25rem]">
                Des conseils clairs pour trouver plus de clients.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg">
                Prix d&apos;un site, visibilité sur Google, fiche Google,
                référencement local… On répond aux vraies questions des artisans
                et des indépendants. Sans jargon, sans baratin.
              </p>
            </div>
          </Container>
        </section>

        {/* Liste des articles */}
        <section className="relative py-14 sm:py-16 lg:py-20">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2">
              {sorted.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group card-elev flex flex-col rounded-[var(--radius-card)] border border-line bg-ink-soft p-6 transition-colors hover:border-line-strong sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {a.tags.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-ember/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-ember-deep"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="font-display mt-5 text-xl font-medium leading-snug tracking-tight text-cream transition-colors group-hover:text-ember-deep sm:text-2xl">
                    {a.title}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-cream-muted">
                    {a.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between text-xs text-cream-faint">
                    <span className="flex items-center gap-3">
                      <time dateTime={a.date}>{formatArticleDate(a.date)}</time>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} aria-hidden />
                        {a.readingMinutes} min
                      </span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-cream-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ember-deep"
                      aria-hidden
                    />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <CtaBand />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
