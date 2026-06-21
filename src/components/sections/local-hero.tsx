import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

type CTA = {
  href: string;
  label: string;
};

// Hero des pages locales (métier / ville / paire métier×ville).
// Server Component, LCP-friendly : aucun JS client, animations CSS (aurora +
// dégradé). Titre Fraunces, accent ember. Espaces réservés → CLS ~ 0.
export function LocalHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  breadcrumbs,
  primaryCta = { href: "/demarrer", label: "Créer mon site" },
  secondaryCta,
  className,
}: {
  /** sur-titre court (ex. « Plomberie · Argenteuil ») */
  eyebrow?: string;
  /** titre principal (h1) */
  title: string;
  /** portion du titre mise en valeur (dégradé vermillon→ambre), rendue après `title` */
  highlight?: string;
  /** sous-titre / accroche */
  subtitle?: string;
  /** fil d'Ariane optionnel, affiché au-dessus du titre */
  breadcrumbs?: Crumb[];
  /** CTA principal (défaut : Créer mon site → /demarrer) */
  primaryCta?: CTA;
  /** CTA secondaire optionnel */
  secondaryCta?: CTA;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40",
        className,
      )}
    >
      {/* Aurora chaude animée (CSS only, coupée si prefers-reduced-motion) */}
      <div className="aurora" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(27,22,17,0.07)_1px,transparent_0)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(0,0,0,0.5),transparent)]"
        aria-hidden
      />

      <Container className="relative">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs items={breadcrumbs} className="mb-8" />
        ) : null}

        <div className="max-w-3xl">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-ember-deep backdrop-blur">
              <span className="h-px w-5 bg-ember/60" aria-hidden />
              {eyebrow}
            </span>
          ) : null}

          <h1 className="font-display mt-6 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.02em] text-cream sm:text-5xl lg:text-6xl">
            {title}
            {highlight ? (
              <>
                {" "}
                <span className="text-gradient-warm">{highlight}</span>
              </>
            ) : null}
          </h1>

          {subtitle ? (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink
              href={primaryCta.href}
              size="lg"
              className="w-full sm:w-auto"
            >
              {primaryCta.label}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
            {secondaryCta ? (
              <ButtonLink
                href={secondaryCta.href}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                {secondaryCta.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
