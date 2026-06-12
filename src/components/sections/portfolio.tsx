import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { portfolio, type Work } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function Portfolio() {
  return (
    <Section id="realisations" className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow="Réalisations"
          title="Des sites simples, crédibles, qui travaillent pour eux."
          description="Chaque site est pensé pour un métier et une zone. Voici quelques activités que nous accompagnons."
        />
      </Reveal>

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
        {portfolio.map((work, i) => (
          <RevealItem key={work.client}>
            <WorkCard work={work} featured={i === 0} />
          </RevealItem>
        ))}
      </RevealGroup>

      <p className="mt-8 text-center text-sm text-cream-faint">
        Votre activité ici très bientôt.
      </p>
    </Section>
  );
}

function WorkCard({ work, featured }: { work: Work; featured?: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-ink-soft transition-all duration-500 hover:border-line-strong">
      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {work.image ? (
          <Image
            src={work.image}
            alt={`Site de ${work.client} — ${work.trade}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <PreviewMock work={work} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-transparent to-transparent" />
        {featured ? (
          <span className="absolute left-4 top-4 rounded-full border border-ember/30 bg-ink/70 px-3 py-1 text-[11px] font-medium text-ember-soft backdrop-blur">
            Première cliente
          </span>
        ) : null}
      </div>

      {/* Meta */}
      <div className="flex items-end justify-between gap-4 p-6">
        <div>
          <h3 className="font-display text-xl font-medium text-cream">
            {work.client}
          </h3>
          <p className="mt-1 text-sm text-cream-muted">{work.trade}</p>
          <p className="mt-0.5 text-xs text-cream-faint">{work.city}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-cream-muted transition-all duration-300 group-hover:border-ember/40 group-hover:bg-ember/10 group-hover:text-ember-soft">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </div>
  );
}

function PreviewMock({ work }: { work: Work }) {
  return (
    <div className={cn("absolute inset-0 bg-gradient-to-br", work.accent)}>
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="absolute inset-x-6 top-6 bottom-6 rounded-xl border border-cream/10 bg-ink/40 p-4 backdrop-blur-sm">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cream/20" />
          <span className="h-2 w-2 rounded-full bg-cream/20" />
          <span className="h-2 w-2 rounded-full bg-cream/20" />
        </div>
        <div className="mt-4 h-2 w-1/3 rounded-full bg-cream/25" />
        <div className="mt-3 h-4 w-3/4 rounded bg-cream/40" />
        <div className="mt-2 h-4 w-1/2 rounded bg-cream/25" />
        <div className="mt-4 flex gap-2">
          <span className="h-6 w-24 rounded-full bg-cream/30" />
          <span className="h-6 w-16 rounded-full bg-cream/15" />
        </div>
      </div>
    </div>
  );
}
