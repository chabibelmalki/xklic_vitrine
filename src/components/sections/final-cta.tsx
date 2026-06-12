import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[500px] glow-ember" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,black,transparent)]"
        aria-hidden
      />

      <Container className="relative">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-display text-3xl font-light leading-[1.05] tracking-tight text-cream sm:text-5xl">
            Votre site pro,{" "}
            <span className="text-gradient-warm">prêt sous 48h.</span>
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
            49€ à la création · puis 9,90€/mois · résiliable à tout moment
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
