import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Frown, Smile } from "lucide-react";

export function Problem() {
  const t = useTranslations("problem");
  const problems = t.raw("problems") as string[];
  const promises = t.raw("promises") as string[];
  return (
    <Section className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleLine1")}{" "}
              <br className="hidden sm:block" />
              {t("titleLine2")}
            </>
          }
          description={t("description")}
        />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* Sans — carte blanche, sobre */}
        <RevealGroup className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-card sm:p-8">
          <div className="mb-2 flex items-center gap-2.5 text-cream-muted">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/[0.05]">
              <Frown size={18} className="text-cream-faint" />
            </span>
            <span className="text-sm font-medium uppercase tracking-wider text-cream-faint">
              {t("withoutLabel")}
            </span>
          </div>
          {problems.map((p) => (
            <RevealItem
              key={p}
              className="flex items-start gap-3 border-t border-line py-3 text-sm leading-relaxed text-cream-muted first-of-type:border-t-0"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cream-faint" />
              {p}
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Avec — panneau vermillon → ambre, les couleurs du logo en majesté */}
        <RevealGroup className="relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-ember-deep via-ember to-ember-soft p-6 shadow-float sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber/50 blur-[80px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:22px_22px]"
            aria-hidden
          />
          <div className="relative mb-2 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Smile size={18} className="text-white" />
            </span>
            <span className="text-sm font-medium uppercase tracking-wider text-white">
              {t("withLabel")}
            </span>
          </div>
          {promises.map((p) => (
            <RevealItem
              key={p}
              className="relative flex items-start gap-3 border-t border-white/20 py-3 text-sm leading-relaxed text-white first-of-type:border-t-0"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white" />
              {p}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
