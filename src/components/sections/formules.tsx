import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { formules } from "@/lib/content";
import { FormuleCard } from "./formule-card";

export function Formules({
  headingAs = "h2",
  variant = "full",
}: {
  headingAs?: "h1" | "h2";
  // "full" (/tarifs) : accordéon détails déroulable ; "home" (accueil) : détails
  // remplacés par un lien vers /tarifs.
  variant?: "full" | "home";
} = {}) {
  const t = useTranslations("formules");
  return (
    <Section id="tarif" className="relative border-t border-line">
      {/* Lueur chaude derrière la grille */}
      <div
        className="glow-ember pointer-events-none absolute inset-x-0 top-0 h-80"
        aria-hidden
      />

      <Reveal>
        <SectionHeading
          as={headingAs}
          align="center"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>

      {/* items-start : ouvrir l'accordéon d'une carte n'étire PAS les deux autres.
          Les cartes fermées restent à hauteur égale via les min-h de FormuleCard. */}
      <RevealGroup className="mt-14 grid items-start gap-6 lg:grid-cols-3 lg:gap-7">
        {formules.map((f) => (
          <RevealItem key={f.name} className="flex">
            <FormuleCard formule={f} variant={variant} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal>
        <div className="mt-9 flex flex-col items-center gap-2 text-center">
          <p className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm text-cream-muted">
            <ShoppingBag size={15} className="text-ember-deep" />
            {t("boutiqueNote")}{" "}
            <strong className="font-semibold text-cream">
              {t("boutiqueNoteStrong")}
            </strong>{" "}
            {t("boutiqueNoteEnd")}
          </p>
          <p className="text-xs text-cream-faint">{t("vatNote")}</p>
        </div>
      </Reveal>
    </Section>
  );
}
