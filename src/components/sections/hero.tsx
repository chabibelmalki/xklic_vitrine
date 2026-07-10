import {
  ArrowRight,
  Check,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

const proofs = ["En ligne en 48h", "Sans engagement", "49€ + 9,99€/mois"];

// Composant serveur : les entrées se font en CSS pur (.rise) pour que le
// h1 — élément LCP — peigne dès le premier rendu HTML, sans attendre
// l'hydratation de framer-motion. prefers-reduced-motion est géré
// globalement dans globals.css (animations coupées).
const rise = (i: number) =>
  ({ "--rise-delay": `${0.07 * i}s` }) as React.CSSProperties;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
      {/* Effet signature : aurora chaude animée, adoucie */}
      <div className="aurora" aria-hidden />
      {/* Texture pointillée très discrète */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(27,22,17,0.07)_1px,transparent_0)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,0,0,0.5),transparent)]"
        aria-hidden
      />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
          {/* ── Copy ─────────────────────────────────────────────────── */}
          <div className="mx-auto flex max-w-xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
            <div className="rise" style={rise(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-card/60 px-4 py-1.5 text-xs font-medium text-cream-muted backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
                </span>
                Sites web professionnels, clés en main
              </span>
            </div>

            <h1
              className="rise font-display mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.02em] text-cream sm:text-5xl lg:text-[3.5rem] xl:text-[3.9rem]"
              style={rise(1)}
            >
              Ton site pro qui te{" "}
              <span className="text-gradient-warm">ramène des clients.</span>
            </h1>

            <p
              className="rise mt-5 max-w-lg text-base leading-relaxed text-cream-muted sm:text-lg"
              style={rise(2)}
            >
              Plombier, mécanicien, à ton compte dans le ménage&nbsp;? On crée
              ton site clés en main, soigné et pensé pour te trouver de
              nouveaux clients. En ligne en 48h, sans prise de tête.
            </p>

            <div
              className="rise mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
              style={rise(3)}
            >
              <ButtonLink
                href="/demarrer"
                size="lg"
                className="w-full sm:w-auto"
              >
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
            </div>

            <ul
              className="rise mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start"
              style={rise(4)}
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
            </ul>
          </div>

          {/* ── Preuve visuelle : le produit + le tunnel de demandes ──── */}
          <Showcase />
        </div>
      </Container>
    </section>
  );
}

/* Maquette d'un site artisan — 100 % fictive, dessinée aux couleurs Xklic —
   dans un cadre navigateur, posée sur un panneau chaud. Trois cartes
   flottantes racontent le parcours client : trouvé sur Google → message
   WhatsApp → appel reçu. */
function Showcase() {
  return (
    <div
      className="rise relative mx-auto w-full max-w-[560px] lg:max-w-none"
      style={rise(3)}
    >
      {/* Panneau chaud */}
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-ember/[0.13] via-amber/[0.09] to-transparent p-4 pb-0 sm:p-7 sm:pb-0">
        <div
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(27,22,17,0.06)_1px,transparent_0)] [background-size:20px_20px]"
          aria-hidden
        />

        {/* Cadre navigateur */}
        <div className="relative overflow-hidden rounded-t-xl border border-b-0 border-line-strong bg-card shadow-float sm:rounded-t-2xl">
          <div className="flex items-center gap-1.5 border-b border-line bg-ink px-3.5 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
            <span className="mx-auto flex -translate-x-3 items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[10px] text-cream-muted">
              <Lock size={9} className="text-cream-faint" />
              durand-plomberie.fr
            </span>
          </div>
          <SiteMock />
        </div>
      </div>

      {/* Carte : trouvé sur Google */}
      <div
        className="float-soft absolute -top-4 left-3 w-max rounded-2xl border border-line bg-card/95 px-3.5 py-2.5 shadow-card backdrop-blur sm:-left-6"
        style={{ "--float-delay": "0s" } as React.CSSProperties}
        aria-hidden
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/20">
            <Search size={15} className="text-ember-deep" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold text-cream">
              1<sup>er</sup> sur Google
            </p>
            <p className="text-[10px] text-cream-muted">« plombier Lyon »</p>
          </div>
        </div>
      </div>

      {/* Carte : nouvelle demande WhatsApp */}
      <div
        className="float-soft absolute -right-2 top-[46%] w-max rounded-2xl border border-line bg-card/95 px-3.5 py-2.5 shadow-card backdrop-blur sm:-right-6 sm:top-[38%]"
        style={{ "--float-delay": "1.1s" } as React.CSSProperties}
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
      </div>

      {/* Carte : appel reçu */}
      <div
        className="float-soft absolute -bottom-4 left-8 w-max rounded-2xl border border-line bg-card/95 px-3.5 py-2.5 shadow-card backdrop-blur sm:left-10"
        style={{ "--float-delay": "2.2s" } as React.CSSProperties}
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
      </div>
    </div>
  );
}

/* Le mini-site « Durand Plomberie » — entièrement dessiné, aucun vrai client. */
function SiteMock() {
  return (
    <div aria-hidden>
      {/* Nav du mini-site */}
      <div className="flex items-center justify-between border-b border-line bg-card px-4 py-2.5 sm:px-5">
        <span className="font-display text-[13px] font-semibold text-cream">
          Durand <span className="text-ember">Plomberie</span>
        </span>
        <div className="hidden items-center gap-3.5 text-[10px] text-cream-muted sm:flex">
          <span>Services</span>
          <span>Tarifs</span>
          <span>Avis</span>
          <span>Contact</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-ember px-2.5 py-1 text-[9px] font-semibold text-white">
          <Phone size={9} />
          06 12 34 56 78
        </span>
      </div>

      {/* Hero du mini-site */}
      <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-4 bg-card px-4 py-5 sm:gap-5 sm:px-5 sm:py-6">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-ember/[0.08] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-ember-deep">
            <MapPin size={8} />
            Plombier · Lyon · 7j/7
          </span>
          <p className="font-display mt-2 text-[17px] font-semibold leading-[1.15] tracking-tight text-cream sm:text-[21px]">
            Votre plombier de confiance, à Lyon.
          </p>
          {/* Lignes de texte suggérées */}
          <div className="mt-2.5 space-y-1.5">
            <div className="h-1.5 w-11/12 rounded-full bg-cream/[0.09]" />
            <div className="h-1.5 w-3/5 rounded-full bg-cream/[0.09]" />
          </div>
          <div className="mt-3.5 flex items-center gap-2">
            <span className="rounded-full bg-ember px-3 py-1.5 text-[9px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(229,67,31,0.6)]">
              Demander un devis
            </span>
            <span className="flex items-center gap-1 rounded-full border border-line-strong px-2.5 py-1.5 text-[9px] font-medium text-cream-muted">
              <Phone size={9} /> Appeler
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={9} className="fill-amber text-amber" />
            ))}
            <span className="ml-1 text-[9px] text-cream-muted">
              4,9 · 87 avis
            </span>
          </div>
        </div>

        {/* Visuel du mini-site */}
        <div className="relative aspect-[4/4.4] overflow-hidden rounded-xl bg-gradient-to-br from-ember via-ember-soft to-amber">
          <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] [background-size:12px_12px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Wrench size={34} className="text-white/90" strokeWidth={1.6} />
          </div>
          <span className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1 rounded-full bg-white/95 py-1 text-[8px] font-semibold text-cream backdrop-blur">
            <ShieldCheck size={9} className="text-ember" />
            Intervention en 30 min
          </span>
        </div>
      </div>

      {/* Bandeau de garanties du mini-site */}
      <div className="grid grid-cols-3 divide-x divide-line-dark border-t border-line bg-night px-1 py-2.5 text-center">
        {["Urgences 24h/24", "Devis gratuit", "Travail garanti"].map((g) => (
          <span
            key={g}
            className="px-1 text-[8.5px] font-medium text-paper-muted"
          >
            {g}
          </span>
        ))}
      </div>
    </div>
  );
}
