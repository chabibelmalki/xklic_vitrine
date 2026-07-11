import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { portfolio, type Work } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Phone, Star } from "lucide-react";

// Libellés de métier traduits, dans l'ordre du tableau `portfolio`.
const TRADE_KEYS = ["sanad", "atelier", "meca", "vibe"] as const;

export function Portfolio() {
  const t = useTranslations("portfolio");
  return (
    <Section id="realisations" className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
        {portfolio.map((work, i) => (
          <RevealItem key={work.client}>
            <WorkCard
              work={{ ...work, trade: t(`trades.${TRADE_KEYS[i] ?? "sanad"}`) }}
              featured={i === 0}
              featuredLabel={t("firstClient")}
              quoteLabel={t("quote")}
            />
          </RevealItem>
        ))}
      </RevealGroup>

      <p className="mt-8 text-center text-sm text-cream-faint">
        {t("yoursSoon")}
      </p>
    </Section>
  );
}

function WorkCard({
  work,
  featured,
  featuredLabel,
  quoteLabel,
}: {
  work: Work;
  featured?: boolean;
  featuredLabel: string;
  quoteLabel: string;
}) {
  const Wrapper: React.ElementType = work.url ? "a" : "div";
  const linkProps = work.url
    ? { href: work.url, target: "_blank", rel: "noreferrer" }
    : {};
  return (
    <Wrapper
      {...linkProps}
      className="group relative block overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-line-strong hover:shadow-float"
    >
      {/* Aperçu — maquette mobile sur fond chaud */}
      <div className="relative h-72 overflow-hidden sm:h-80">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            work.accent,
          )}
        />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(27,22,17,0.06)_1px,transparent_0)] [background-size:22px_22px]" />

        {featured ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-ember/30 bg-ink/80 px-3 py-1 text-[11px] font-medium text-ember-deep backdrop-blur">
            {featuredLabel}
          </span>
        ) : null}

        {/* Téléphone qui émerge du bas */}
        <div className="absolute inset-x-0 top-8 mx-auto w-[176px] translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
          <div className="rounded-[1.6rem] border border-line-strong bg-cream p-1.5 shadow-float">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-ink">
              {work.image ? (
                <Image
                  src={work.image}
                  alt={`Site mobile de ${work.client} — ${work.trade}`}
                  width={320}
                  height={420}
                  className="h-[300px] w-full object-cover object-top"
                  sizes="176px"
                />
              ) : work.url ? (
                // Capture mobile auto du site live (microlink, gratuit, sans clé).
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://api.microlink.io/?url=${encodeURIComponent(
                    work.url,
                  )}&screenshot=true&embed=screenshot.url&meta=false&viewport.width=414&viewport.height=896`}
                  alt={`Site mobile de ${work.client} — ${work.trade}`}
                  loading="lazy"
                  className="h-[300px] w-full bg-ink object-cover object-top"
                />
              ) : (
                <PhoneSiteMock work={work} quoteLabel={quoteLabel} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Méta */}
      <div className="flex items-end justify-between gap-4 border-t border-line p-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-cream">
            {work.client}
          </h3>
          <p className="mt-1 text-sm text-cream-muted">{work.trade}</p>
          <p className="mt-0.5 text-xs text-cream-faint">{work.city}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-cream-muted transition-all duration-300 group-hover:border-ember/40 group-hover:bg-ember/10 group-hover:text-ember-deep">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Wrapper>
  );
}

function PhoneSiteMock({ work, quoteLabel }: { work: Work; quoteLabel: string }) {
  return (
    <div className="h-[300px] w-full">
      {/* Encoche */}
      <div className="mx-auto mt-1.5 h-3.5 w-16 rounded-full bg-cream" />
      <div className="px-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-[11px] font-semibold text-cream">
            {work.client}
          </span>
          <span className="rounded-full bg-ember px-2 py-0.5 text-[7px] font-semibold text-white">
            {quoteLabel}
          </span>
        </div>
        <div className="mt-2 aspect-[5/3] rounded-lg bg-gradient-to-br from-ember/25 via-amber/15 to-transparent ring-1 ring-inset ring-line" />
        <p className="mt-2 text-[7px] font-medium uppercase tracking-[0.15em] text-ember-deep">
          {work.trade} · {work.city}
        </p>
        <div className="mt-1 h-2 w-4/5 rounded bg-cream/30" />
        <div className="mt-1 h-2 w-3/5 rounded bg-cream/15" />
        <div className="mt-1.5 flex items-center gap-0.5 text-amber">
          <Star size={7} className="fill-amber" />
          <Star size={7} className="fill-amber" />
          <Star size={7} className="fill-amber" />
          <Star size={7} className="fill-amber" />
          <Star size={7} className="fill-amber" />
        </div>
        <div className="mt-2 flex gap-1.5">
          <span className="flex-1 rounded-full bg-ember py-1.5 text-center text-[7px] font-semibold text-white">
            Demander un devis
          </span>
          <span className="flex items-center gap-0.5 rounded-full border border-line-strong px-2 py-1.5 text-[7px] text-cream-muted">
            <Phone size={7} /> Appeler
          </span>
        </div>
      </div>
    </div>
  );
}
