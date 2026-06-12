"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/utils";

const proofs = ["En ligne en 48h", "Sans engagement", "49€ + 9,90€/mois"];

export function Hero() {
  const reduce = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.05 * i, ease: EASE_OUT },
    }),
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48">
      {/* Warm glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] glow-ember"
        aria-hidden
      />
      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <Container className="relative">
        <motion.div
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.div custom={0} variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-cream/[0.03] px-4 py-1.5 text-xs font-medium text-cream-muted backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
              </span>
              Sites web pour artisans & TPE de service
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={item}
            className="font-display mt-7 text-4xl font-light leading-[1.02] tracking-tight text-cream sm:text-6xl lg:text-7xl"
          >
            Un site pro pour votre activité,{" "}
            <span className="text-gradient-warm">en ligne en 48h.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg"
          >
            Vous êtes plombier, mécanicien, à votre compte dans le ménage&nbsp;?
            On crée votre site clés en main, soigné et fait pour vous trouver de
            nouveaux clients. Sans prise de tête.
          </motion.p>

          <motion.div
            custom={3}
            variants={item}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <ButtonLink href="/demarrer" size="lg" className="w-full sm:w-auto">
              Créer mon site
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
            <ButtonLink
              href="/#realisations"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Voir des réalisations
            </ButtonLink>
          </motion.div>

          <motion.ul
            custom={4}
            variants={item}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {proofs.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 text-sm text-cream-muted"
              >
                <Check size={15} className="text-ember" />
                {p}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE_OUT }}
          className="relative mx-auto mt-16 max-w-4xl sm:mt-20"
        >
          <div className="absolute -inset-x-8 -top-8 bottom-0 glow-ember opacity-60" aria-hidden />
          <BrowserMock />
        </motion.div>
      </Container>
    </section>
  );
}

function BrowserMock() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-ink-panel shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
        <span className="ml-3 flex-1">
          <span className="block w-fit rounded-md bg-cream/[0.05] px-3 py-1 text-[11px] text-cream-faint">
            souad-menage.fr
          </span>
        </span>
      </div>
      {/* Fake site preview */}
      <div className="relative grid gap-4 p-6 sm:grid-cols-5 sm:p-8">
        <div className="sm:col-span-3 flex flex-col justify-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ember-soft">
            Ménage à domicile · Lyon
          </span>
          <span className="font-display text-2xl font-light leading-tight text-cream sm:text-3xl">
            Votre intérieur impeccable,
            <br />
            sans y penser.
          </span>
          <span className="text-sm text-cream-muted">
            Crédit d&apos;impôt 50% · Devis gratuit en 24h
          </span>
          <div className="mt-1 flex gap-2">
            <span className="rounded-full bg-ember px-4 py-2 text-xs font-medium text-ink">
              Demander un devis
            </span>
            <span className="rounded-full border border-line-strong px-4 py-2 text-xs text-cream-muted">
              06 12 34 56 78
            </span>
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-rose-500/25 via-amber-500/10 to-transparent ring-1 ring-inset ring-line" />
        </div>
      </div>
    </div>
  );
}
