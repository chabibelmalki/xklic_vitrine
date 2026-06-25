"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Phone, MessageCircle, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/utils";

const proofs = ["En ligne en 48h", "Sans engagement", "49€ + 9,99€/mois"];

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
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44">
      {/* Effet signature : aurora chaude animée */}
      <div className="aurora" aria-hidden />
      {/* Texture pointillée très discrète */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:radial-gradient(circle_at_1px_1px,rgba(27,22,17,0.07)_1px,transparent_0)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(0,0,0,0.5),transparent)]"
        aria-hidden
      />

      <Container className="relative">
        <motion.div
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.div custom={0} variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink/60 px-4 py-1.5 text-xs font-medium text-cream-muted backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
              </span>
              Sites web professionnels, clés en main
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={item}
            className="font-display mt-7 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.02em] text-cream sm:text-6xl lg:text-7xl"
          >
            Ton site pro qui te{" "}
            <span className="text-gradient-warm">ramène des clients.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg"
          >
            Plombier, mécanicien, à ton compte dans le ménage&nbsp;? On crée ton
            site clés en main, soigné et pensé pour te trouver de nouveaux
            clients. En ligne en 48h, sans prise de tête.
          </motion.p>

          <motion.div
            custom={3}
            variants={item}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
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

        {/* Preuve visuelle : maquette mobile + demandes clients qui arrivent */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE_OUT }}
          className="relative mx-auto mt-20 flex max-w-md justify-center sm:mt-24"
        >
          <PhoneMock reduce={!!reduce} />
        </motion.div>
      </Container>
    </section>
  );
}

function PhoneMock({ reduce }: { reduce: boolean }) {
  const float = (delay: number) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -9, 0] },
          transition: {
            duration: 5,
            delay,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };

  return (
    <div className="relative">
      {/* Halo derrière le téléphone */}
      <div
        className="pointer-events-none absolute -inset-10 rounded-full bg-ember/10 blur-3xl"
        aria-hidden
      />

      {/* Téléphone */}
      <div className="relative mx-auto w-[270px] rounded-[2.6rem] border border-line-strong bg-cream p-2.5 shadow-float sm:w-[300px]">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink">
          {/* Encoche */}
          <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-cream" />

          {/* Mini-site artisan (exemple ménage) */}
          <div className="h-[500px] overflow-hidden sm:h-[540px]">
            {/* Header du mini-site */}
            <div className="flex items-center justify-between px-4 pt-8 pb-3">
              <span className="font-display text-sm font-semibold text-cream">
                Maison Martin
              </span>
              <span className="rounded-full bg-ember px-2.5 py-1 text-[9px] font-semibold text-white">
                Devis
              </span>
            </div>
            {/* Hero du mini-site */}
            <div className="relative px-4 pt-2">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-ember/25 via-amber/15 to-transparent ring-1 ring-inset ring-line">
                <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(27,22,17,0.05)_1px,transparent_0)] [background-size:14px_14px]" />
              </div>
              <span className="mt-3 block text-[10px] font-medium uppercase tracking-[0.18em] text-ember-deep">
                Artisan à domicile · Lyon
              </span>
              <span className="font-display mt-1 block text-lg font-semibold leading-tight text-cream">
                Un travail soigné, près de chez vous.
              </span>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-cream-muted">
                <Star size={10} className="fill-amber text-amber" />
                <Star size={10} className="fill-amber text-amber" />
                <Star size={10} className="fill-amber text-amber" />
                <Star size={10} className="fill-amber text-amber" />
                <Star size={10} className="fill-amber text-amber" />
                <span className="ml-1">Devis gratuit en 24h</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="flex-1 rounded-full bg-ember py-2 text-center text-[10px] font-semibold text-white">
                  Demander un devis
                </span>
                <span className="flex items-center gap-1 rounded-full border border-line-strong px-3 py-2 text-[10px] text-cream-muted">
                  <Phone size={10} /> Appeler
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carte flottante : nouvelle demande WhatsApp */}
      <motion.div
        {...float(0.2)}
        className="absolute -left-6 top-24 w-max rounded-2xl border border-line bg-ink/90 px-3.5 py-2.5 shadow-card backdrop-blur sm:-left-12"
        aria-hidden
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <MessageCircle size={15} />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold text-cream">
              Nouvelle demande
            </p>
            <p className="text-[10px] text-cream-muted">
              « Bonjour, vous êtes dispo&nbsp;? »
            </p>
          </div>
        </div>
      </motion.div>

      {/* Carte flottante : appel reçu */}
      <motion.div
        {...float(1.4)}
        className="absolute -right-4 bottom-20 w-max rounded-2xl border border-line bg-ink/90 px-3.5 py-2.5 shadow-card backdrop-blur sm:-right-10"
        aria-hidden
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember/15 text-ember">
            <Phone size={15} />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold text-cream">Appel reçu</p>
            <p className="text-[10px] text-cream-muted">+33 6 12 · 0:42</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
