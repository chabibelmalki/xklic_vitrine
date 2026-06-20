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
              Être bon dans son métier ne suffit plus.
              <br className="hidden sm:block" /> Encore faut-il qu&apos;on te
              trouve.
            </>
          }
          description="Aujourd'hui, le premier réflexe d'un client, c'est Google. Sans site crédible, tu laisses tes concurrents prendre les appels qui auraient dû être les tiens."
        />
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* Sans */}
        <RevealGroup className="flex flex-col gap-3 rounded-2xl border border-line bg-ink-soft/40 p-6 sm:p-8">
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

        {/* Avec */}
        <RevealGroup className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-ember/25 bg-gradient-to-b from-ember/[0.07] to-transparent p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ember/15 blur-3xl" />
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember/15">
              <Smile size={18} className="text-ember-soft" />
            </span>
            <span className="text-sm font-medium uppercase tracking-wider text-ember-soft">
              Avec Xklic
            </span>
          </div>
          {promises.map((p) => (
            <RevealItem
              key={p}
              className="flex items-start gap-3 border-t border-ember/15 py-3 text-sm leading-relaxed text-cream first-of-type:border-t-0"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember" />
              {p}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
