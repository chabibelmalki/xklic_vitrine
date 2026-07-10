import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Frown, Smile } from "lucide-react";

const problems = [
  "Tes clients te cherchent sur Google… et ne te trouvent pas.",
  "Une page Facebook ne suffit plus à inspirer confiance.",
  "Les devis d'agences web tournent à 1 500€, voire bien plus.",
  "Tu n'as ni le temps ni l'envie de gérer un site toi-même.",
];

const promises = [
  "Un site qui te fait apparaître quand on cherche ton métier près de chez toi.",
  "Une vitrine soignée qui rassure et donne envie de t'appeler.",
  "49€ à la création, 9,99€/mois. Tout compris, sans surprise.",
  "Tu ne touches à rien : on s'occupe de tout, tu valides.",
];

export function Problem() {
  return (
    <Section className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow="Le constat"
          title={
            <>
              Être bon dans son métier ne suffit plus.{" "}
              <br className="hidden sm:block" />
              Encore faut-il qu&apos;on te trouve.
            </>
          }
          description="Aujourd'hui, le premier réflexe d'un client, c'est Google. Sans site crédible, tu laisses tes concurrents prendre les appels qui auraient dû être les tiens."
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
              Sans Xklic
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
              Avec Xklic
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
