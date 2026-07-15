"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, CreditCard, Loader2, PartyPopper } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  makeLeadSchema,
  type LeadValues,
  type FormuleSlug,
  type BoutiqueTier,
} from "@/lib/lead-schema";
import { brand } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Turnstile, TURNSTILE_ENABLED } from "@/components/form/turnstile";
import { buildSteps, StepNavProvider } from "./steps";
import { clearLeadDraft, useLeadDraft } from "./use-lead-draft";
import { cn, EASE_OUT } from "@/lib/utils";

// Forme souple d'un fichier dans l'état du formulaire. `file` est le File brut
// (présent dès qu'un fichier a été sélectionné), `url` un objectURL d'aperçu.
type UploadInput = {
  id?: string;
  name: string;
  size?: number;
  type?: string;
  url?: string;
  file?: unknown;
};

// Téléverse chaque fichier DIRECTEMENT vers Scaleway (browser -> S3, public) via
// une URL PUT présignée négociée sur /api/upload/sign, et renvoie { name, url }
// où `url` est l'URL publique (MEDIA_BASE_URL/<clé>). Le fichier ne transite
// jamais par nos fonctions serverless (pas de limite de body). Les objets non
// sérialisables (File, objectURL d'aperçu) ne partent donc jamais au webhook —
// seules les URLs publiques le font.
async function uploadFiles(items?: UploadInput[]) {
  return Promise.all(
    (items ?? []).map(async (item) => {
      // Pas de File brut (cas de bord) : on conserve au moins le nom.
      if (!(item.file instanceof File)) {
        return { name: item.name, url: item.url ?? "" };
      }
      const file = item.file;
      // 1. Négocie une URL PUT présignée (type + taille validés côté serveur).
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, type: file.type, size: file.size }),
      });
      if (!signRes.ok) throw new Error("sign failed");
      const { uploadUrl, publicUrl, headers } = (await signRes.json()) as {
        uploadUrl: string;
        publicUrl: string;
        headers: Record<string, string>;
      };
      // 2. PUT direct vers Scaleway avec exactement les en-têtes signés.
      const putRes = await fetch(uploadUrl, { method: "PUT", headers, body: file });
      if (!putRes.ok) throw new Error("upload failed");
      return { name: item.name, url: publicUrl };
    }),
  );
}

// Nombre total de fichiers à téléverser (pour n'afficher l'indicateur de
// téléversement que lorsqu'il y a réellement des images).
function countFiles(values: LeadValues) {
  const has = (items?: { file?: unknown }[]) =>
    (items ?? []).filter((i) => i.file instanceof File).length;
  return (
    has(values.logo) +
    has(values.photos) +
    (values.products ?? []).reduce((n, p) => n + has(p.photos), 0)
  );
}

type Status = "form" | "uploading" | "submitting" | "done" | "error";

export function LeadForm({
  initialFormule,
  initialBoutique,
  initialCountry,
  initialValues,
  resumeRef,
}: {
  // Formule pré-choisie via `?formule=` (clic sur une carte de prix).
  initialFormule?: FormuleSlug;
  // Palier boutique pré-choisi via `?boutique=` (select des cartes tarifs).
  initialBoutique?: BoutiqueTier;
  // Pays pré-rempli via l'IP (en-tête géo, résolu côté serveur). Repli "France".
  initialCountry?: string;
  // Reprise d'un dossier non payé (lien `?resume=<ref>` de la fiche back-office) :
  // valeurs rechargées côté serveur pour pré-remplir tout le tunnel, et `resumeRef`
  // (= la ref du dossier) renvoyée au checkout pour cibler le même dossier.
  initialValues?: Partial<LeadValues>;
  resumeRef?: string;
}) {
  const t = useTranslations("demarrer.form");
  const ts = useTranslations("demarrer.steps");
  const te = useTranslations("demarrer.errors");
  const reduce = useReducedMotion();
  // En reprise, on démarre directement à la dernière étape (paiement) : le dossier
  // est déjà rempli, le client n'a qu'à confirmer et payer (il peut revenir en
  // arrière pour relire). Sinon, début du tunnel.
  const [step, setStep] = useState(() =>
    resumeRef ? buildSteps().length - 1 : 0,
  );
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<Status>("form");
  const [token, setToken] = useState("");
  // Schéma avec messages de validation traduits.
  const [schema] = useState(() => makeLeadSchema((k) => te(k)));

  const methods = useForm<LeadValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      formule: initialFormule,
      boutiqueTier: initialBoutique,
      wantsServices: true,
      companyName: "",
      trade: "",
      city: "",
      country: initialCountry || "France",
      mobile: false,
      serviceArea: "",
      services: "",
      products: [],
      phone: "",
      noWhatsapp: false,
      email: "",
      hasShop: false,
      address: "",
      availability: "",
      siret: "",
      logo: [],
      photos: [],
      socials: { facebook: "", instagram: "", tiktok: "", x: "", google: "" },
      languages: "",
      // Principale pré-remplie : le rond est déjà là, le client n'a qu'à
      // l'ajuster (ou ajouter un accent, ou tout effacer = équipe décide).
      colorPreference: ["#2563eb"],
      ambiance: "",
      extra: "",
      // Reprise : les valeurs rechargées du dossier écrasent les défauts. Placé
      // en dernier pour primer ; `socials` fusionné à part (objet imbriqué) afin
      // de ne pas perdre les clés absentes du dossier.
      ...initialValues,
      ...(initialValues?.socials
        ? {
            socials: {
              facebook: "",
              instagram: "",
              tiktok: "",
              x: "",
              google: "",
              ...initialValues.socials,
            },
          }
        : {}),
    },
  });

  // Persistance du brouillon (sessionStorage) : un rechargement ou un retour
  // navigateur restaure les champs saisis et l'étape en cours. Désactivée en
  // reprise : les valeurs serveur font autorité (pas d'écrasement par un vieux
  // brouillon d'onglet).
  useLeadDraft(methods, step, setStep, Boolean(resumeRef));

  // Tunnel minimal : 3 étapes fixes (identité → offre → SIRET). La formule est
  // pré-sélectionnée par `initialFormule` mais toujours modifiable dans l'offre.
  const steps = buildSteps();
  const total = steps.length;
  const safeStep = Math.min(step, total - 1);
  const current = steps[safeStep];
  const isLast = safeStep === total - 1;
  const progress = ((safeStep + 1) / total) * 100;

  const goNext = async () => {
    const ok = await methods.trigger(current.fields as never[], {
      shouldFocus: true,
    });
    if (!ok) return;
    if (isLast) {
      void submit();
    } else {
      setDir(1);
      setStep(safeStep + 1);
    }
  };

  const goPrev = () => {
    if (safeStep === 0) return;
    setDir(-1);
    setStep(safeStep - 1);
  };

  const submit = methods.handleSubmit(async (values) => {
    // Anti-robot : si Turnstile est activé, on exige un jeton avant de payer.
    if (TURNSTILE_ENABLED && !token) {
      setStatus("error");
      return;
    }
    try {
      // 1. On téléverse d'abord toutes les images vers Vercel Blob, en
      //    parallèle. Le webhook n'est appelé qu'une fois TOUS les uploads
      //    terminés (le Promise.all sert de barrière).
      setStatus(countFiles(values) > 0 ? "uploading" : "submitting");
      const [logo, photos] = await Promise.all([
        uploadFiles(values.logo),
        uploadFiles(values.photos),
      ]);
      const products = await Promise.all(
        (values.products ?? []).map(async (p) => ({
          ...p,
          photos: await uploadFiles(p.photos),
        })),
      );

      // 2. Payload : chaque objet fichier est remplacé par { name, url }
      //    (URL publique Blob). Le reste de la structure est inchangé.
      //    Couleur : on ne transmet un choix que s'il est RÉEL — vide si un
      //    logo est fourni (on en extraira les couleurs) ou si le client n'a
      //    pas touché à la couleur par défaut (champ non « dirty »).
      const colorPreference =
        logo.length > 0 || !methods.formState.dirtyFields.colorPreference
          ? []
          : values.colorPreference;
      const payload = {
        ...values,
        colorPreference,
        logo,
        photos,
        products,
        turnstileToken: token || undefined,
        // Reprise : cible le dossier existant (upsert par ref, pas de doublon).
        ...(resumeRef ? { resumeRef } : {}),
      };

      // 3. Création de la commande + session de paiement (via /api/checkout) :
      //    la commande est stockée et le lead capturé côté serveur AVANT Stripe.
      setStatus("submitting");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad status");
      const data = (await res.json()) as { ok: boolean; url?: string | null };

      // La commande est enregistrée côté serveur : le brouillon local n'a plus
      // lieu d'être (évite de ressusciter d'anciennes données au retour Stripe).
      clearLeadDraft();

      if (data.url) {
        // 4. Redirection vers Stripe Checkout. La confirmation du paiement (et
        //    l'écriture « payé ») se fait UNIQUEMENT via le webhook vérifié —
        //    jamais ici. On laisse l'écran tel quel pendant la redirection.
        window.location.assign(data.url);
        return;
      }

      // Repli (Stripe non configuré) : la commande est enregistrée, on affiche
      // le remerciement sans redirection.
      setStatus("done");
    } catch {
      setStatus("error");
      setToken("");
    }
  });

  if (status === "done") {
    return <ThankYou />;
  }

  const stepTitle = ts(`${current.id}.title`);
  const stepSubtitle = ts(`${current.id}.subtitle`);

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full max-w-xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-cream-faint">
            <span className="font-medium text-cream-muted">
              {t("stepProgress", { current: safeStep + 1, total })}
            </span>
            <span>{stepTitle}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ember-deep via-ember to-amber"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-line bg-ink-soft/60 p-6 backdrop-blur-sm sm:p-9">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
              {stepTitle}
            </h1>
            <p className="mt-2 text-sm text-cream-muted">{stepSubtitle}</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void goNext();
            }}
          >
            {/* -mx-2 px-2 : gouttière interne pour que l'overflow-hidden (slide
                horizontal) ne rogne pas la bordure de focus des inputs w-full. */}
            <div className="relative -mx-2 overflow-hidden px-2">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={current.id}
                  custom={dir}
                  initial={
                    reduce ? false : { opacity: 0, x: dir * 28 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -28 }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                >
                  <StepNavProvider advance={() => void goNext()}>
                    <current.Component />
                  </StepNavProvider>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Défi anti-robot affiché à la dernière étape, juste avant le
                paiement (le jeton expire vite, on le résout au plus tard). */}
            {isLast && TURNSTILE_ENABLED ? (
              <div className="mt-7 flex justify-center">
                <Turnstile onVerify={setToken} onExpire={() => setToken("")} />
              </div>
            ) : null}

            {status === "error" ? (
              <p className="mt-5 rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember-soft">
                {t("error")}
              </p>
            ) : null}

            {/* Étape à choix unique (formule, type) au tout début : le clic
                vaut « Continuer », on masque donc toute la barre de navigation. */}
            {current.autoAdvance && safeStep === 0 ? null : (
              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goPrev}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm text-cream-muted transition-colors hover:text-cream",
                    safeStep === 0 && "pointer-events-none opacity-0",
                  )}
                >
                  <ArrowLeft size={16} />
                  {t("prev")}
                </button>

                {/* Sur les étapes auto-avance, pas de bouton « Continuer ». */}
                {current.autoAdvance ? (
                  <span className="text-xs text-cream-faint">
                    {t("touchToContinue")}
                  </span>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={
                      status === "submitting" || status === "uploading"
                    }
                    className="min-w-44"
                  >
                    {status === "uploading" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t("uploading")}
                      </>
                    ) : status === "submitting" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t("redirecting")}
                      </>
                    ) : isLast ? (
                      <>
                        {t("order")}
                        <CreditCard size={18} />
                      </>
                    ) : (
                      <>
                        {t("continue")}
                        <ArrowRight
                          size={18}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

          </form>
        </div>

        {/* Step dots */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === safeStep
                  ? "w-6 bg-ember"
                  : i < safeStep
                    ? "w-1.5 bg-ember/50"
                    : "w-1.5 bg-cream/15",
              )}
            />
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-cream-faint">
          {t("securityNote")}
        </p>
      </div>
    </FormProvider>
  );
}

function ThankYou() {
  const t = useTranslations("demarrer.form");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="mx-auto flex max-w-xl flex-col items-center text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-ember-soft">
        <PartyPopper size={28} />
      </span>
      <h1 className="font-display mt-7 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
        {t("thankYouTitle")}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-cream-muted">
        {t("thankYouBody")}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-strong px-6 text-sm text-cream transition-colors hover:bg-cream/[0.05]"
        >
          <ArrowLeft size={16} />
          {t("backHome")}
        </Link>
      </div>
      <p className="mt-8 text-xs text-cream-faint">
        {t("questionMeanwhile", { email: brand.email })}
      </p>
    </motion.div>
  );
}
