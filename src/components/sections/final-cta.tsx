import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      {/* Lueur chaude ancrée en bas */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px] glow-ember"
        aria-hidden
      />
      {/* Texture pointillée discrète */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:radial-gradient(circle_at_1px_1px,rgba(27,22,17,0.07)_1px,transparent_0)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_55%_55%_at_50%_100%,rgba(0,0,0,0.5),transparent)]"
        aria-hidden
      />

      <Container className="relative">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-cream sm:text-5xl">
            Ton site pro,{" "}
            <span className="text-gradient-warm">prêt sous 2h.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream-muted sm:text-lg">
            Quelques minutes pour remplir le formulaire. On s&apos;occupe du
            reste. Sans engagement, sans paiement aujourd&apos;hui.
          </p>
          <ButtonLink href="/demarrer" size="lg" className="mt-9">
            Créer mon site
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </ButtonLink>
          <p className="mt-4 text-sm text-cream-faint">
            49€ à la création · puis 9,99€/mois · résiliable à tout moment
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
