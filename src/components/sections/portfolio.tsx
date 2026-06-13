import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { portfolio, type Work } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Phone, Star } from "lucide-react";

export function Portfolio() {
  return (
    <Section id="realisations" className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow="Réalisations"
          title="Des sites simples, crédibles, qui travaillent pour eux."
          description="Chaque site est pensé pour un métier et une zone, et d'abord pour le mobile. Voici quelques activités que nous accompagnons."
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
        Ton activité ici très bientôt.
      </p>
    </Section>
  );
}

function WorkCard({ work, featured }: { work: Work; featured?: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-soft transition-all duration-500 hover:border-line-strong hover:shadow-card">
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
            Première cliente
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
              ) : (
                <PhoneSiteMock work={work} />
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
    </div>
  );
}

function PhoneSiteMock({ work }: { work: Work }) {
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
            Devis
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
