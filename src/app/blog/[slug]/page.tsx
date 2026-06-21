import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { InternalLinks, type LinkGroup } from "@/components/sections/internal-links";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { brand } from "@/lib/content";
import { formatArticleDate } from "@/lib/format-date";
import { articles, getArticle, type Block } from "@/data/articles";
import { metiers } from "@/data/metiers";
import { villes } from "@/data/villes";

// Revalidation quotidienne — contenu éditorial stable.
export const revalidate = 86400;

// Pré-génère une page par article au build.
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return buildMetadata({
      title: "Article introuvable",
      description: "Cet article n'existe pas ou a été déplacé.",
      path: `/blog/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${article.slug}`,
    keywords: article.tags,
  });
}

// Rend un bloc de corps d'article avec le style typographique du design system.
function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="font-display mt-12 text-2xl font-medium leading-snug tracking-tight text-cream sm:text-[1.75rem]"
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p
          key={i}
          className="mt-5 text-base leading-[1.75] text-cream-muted sm:text-[1.0625rem]"
        >
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="mt-5 flex flex-col gap-3">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="relative pl-6 text-base leading-[1.7] text-cream-muted sm:text-[1.0625rem]"
            >
              <span
                className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-ember"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={i}
          className="my-9 border-l-2 border-ember pl-5 text-lg font-light italic leading-relaxed text-cream sm:text-xl"
        >
          {block.text}
        </blockquote>
      );
    case "links":
      return (
        <div
          key={i}
          className="my-9 rounded-[var(--radius-card)] border border-line bg-ink-soft p-6"
        >
          {block.title ? (
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-cream-faint">
              {block.title}
            </p>
          ) : null}
          <ul className={block.title ? "mt-4 flex flex-col gap-2" : "flex flex-col gap-2"}>
            {block.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-medium text-ember-deep underline-offset-4 transition-colors hover:text-ember hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/blog/${article.slug}`;

  // BlogPosting JSON-LD — auteur = Organization Xklic.
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: "fr-FR",
    keywords: article.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": `${SITE_URL}/#organization`, name: brand.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const crumbs = breadcrumbLd([
    { name: "Accueil", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: article.title, url },
  ]);

  // Maillage interne contextuel — métiers + zones liés à l'article.
  const metierLinks = article.relatedMetiers
    .map((s) => metiers.find((m) => m.slug === s))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m) => ({ href: `/metiers/${m.slug}`, label: m.name }));

  const villeLinks = article.relatedVilles
    .map((s) => villes.find((v) => v.slug === s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))
    .map((v) => ({ href: `/zones/${v.slug}`, label: v.name }));

  const groups: LinkGroup[] = [
    { title: "Sites par métier", links: metierLinks },
    { title: "Sites par ville", links: villeLinks },
    {
      title: "Passer à l'action",
      links: [
        { href: "/demarrer", label: "Créer mon site" },
        { href: "/blog", label: "Tous les articles" },
      ],
    },
  ];

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={blogPostingLd} />
      <JsonLd data={crumbs} />
      <Header />

      <main className="relative flex-1 pt-16 lg:pt-18">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] glow-ember"
          aria-hidden
        />

        <article className="relative pt-16 sm:pt-20 lg:pt-24">
          <Container>
            <div className="mx-auto max-w-2xl">
              <Breadcrumbs
                items={[
                  { href: "/", label: "Accueil" },
                  { href: "/blog", label: "Blog" },
                  { label: article.title },
                ]}
                className="mb-8"
              />

              <div className="flex flex-wrap items-center gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-ember/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-ember-deep"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="font-display mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.01em] text-cream sm:text-[2.6rem]">
                {article.title}
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-cream-muted">
                {article.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-3 border-b border-line pb-8 text-sm text-cream-faint">
                <time dateTime={article.date}>
                  {formatArticleDate(article.date)}
                </time>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} aria-hidden />
                  {article.readingMinutes} min de lecture
                </span>
              </div>

              {/* Corps */}
              <div className="pt-2">
                {article.body.map((block, i) => renderBlock(block, i))}
              </div>
            </div>
          </Container>
        </article>

        <CtaBand />

        <InternalLinks
          eyebrow="Pour aller plus loin"
          heading="Le site qui va avec ton métier et ta ville"
          groups={groups}
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
