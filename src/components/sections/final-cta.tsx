import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  const t = useTranslations("finalCta");
  const tc = useTranslations("common");
  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-night px-6 py-16 text-center shadow-float sm:rounded-[2.5rem] sm:px-12 sm:py-24">
            {/* Lueurs chaudes dans la nuit */}
            <div
              className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-ember/30 blur-[110px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-32 right-1/5 h-80 w-80 rounded-full bg-amber/20 blur-[110px]"
              aria-hidden
            />
            {/* Texture pointillée discrète */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(circle_at_1px_1px,rgba(250,246,240,0.08)_1px,transparent_0)] [background-size:24px_24px]"
              aria-hidden
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-paper sm:text-5xl">
                {t("titleLead")}{" "}
                <span className="text-gradient-warm">{t("titleAccent")}</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-paper-muted sm:text-lg">
                {t("subtitle")}
              </p>
              <ButtonLink href="/demarrer" size="lg" className="mt-9">
                {t("cta")}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </ButtonLink>
              <p className="mt-4 text-sm text-paper-faint">
                {tc("priceLine")}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
