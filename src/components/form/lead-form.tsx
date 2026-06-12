"use client";

import { useState } from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@vercel/blob/client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, PartyPopper } from "lucide-react";
import Link from "next/link";
import { leadSchema, type LeadValues } from "@/lib/lead-schema";
import { Button } from "@/components/ui/button";
import { buildSteps } from "./steps";
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

// Téléverse chaque fichier vers Vercel Blob (browser -> Blob, accès public) et
// renvoie, pour chacun, { name, url } où `url` est l'URL publique Blob. Les
// objets non sérialisables (File, objectURL d'aperçu) ne partent donc jamais
// au webhook — seules les URLs publiques le font.
async function uploadFiles(items?: UploadInput[]) {
  return Promise.all(
    (items ?? []).map(async (item) => {
      // Pas de File brut (cas de bord) : on conserve au moins le nom.
      if (!(item.file instanceof File)) {
        return { name: item.name, url: item.url ?? "" };
      }
      const blob = await upload(`leads/${item.file.name}`, item.file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });
      return { name: item.name, url: blob.url };
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
    has(values.venuePhotos) +
    has(values.ambiancePhotos) +
    has(values.servicePhotos) +
    (values.products ?? []).reduce((n, p) => n + has(p.photos), 0)
  );
}

type Status = "form" | "uploading" | "submitting" | "done" | "error";

export function LeadForm() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<Status>("form");

  const methods = useForm<LeadValues>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: {
      activityType: undefined,
      companyName: "",
      trade: "",
      city: "",
      mobile: false,
      serviceArea: "",
      services: "",
      taxCredit: undefined,
      products: [],
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      availability: "",
      siret: "",
      noSiret: false,
      logo: [],
      venuePhotos: [],
      ambiancePhotos: [],
      servicePhotos: [],
      reviews: "",
      languages: ["fr"],
      ambiance: "",
      extra: "",
    },
  });

  const activityType = useWatch({
    control: methods.control,
    name: "activityType",
  });
  const steps = buildSteps(activityType);
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
    try {
      // 1. On téléverse d'abord toutes les images vers Vercel Blob, en
      //    parallèle. Le webhook n'est appelé qu'une fois TOUS les uploads
      //    terminés (le Promise.all sert de barrière).
      setStatus(countFiles(values) > 0 ? "uploading" : "submitting");
      const [logo, venuePhotos, ambiancePhotos, servicePhotos] =
        await Promise.all([
          uploadFiles(values.logo),
          uploadFiles(values.venuePhotos),
          uploadFiles(values.ambiancePhotos),
          uploadFiles(values.servicePhotos),
        ]);
      const products = await Promise.all(
        (values.products ?? []).map(async (p) => ({
          ...p,
          photos: await uploadFiles(p.photos),
        })),
      );

      // 2. Payload : chaque objet fichier est remplacé par { name, url }
      //    (URL publique Blob). Le reste de la structure est inchangé.
      const payload = {
        ...values,
        logo,
        venuePhotos,
        ambiancePhotos,
        servicePhotos,
        products,
      };

      // 3. Envoi au webhook (via /api/lead).
      setStatus("submitting");
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  });

  if (status === "done") {
    return <ThankYou />;
  }

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full max-w-xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-cream-faint">
            <span className="font-medium text-cream-muted">
              Étape {safeStep + 1} sur {total}
            </span>
            <span>{current.title}</span>
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
            <h1 className="font-display text-2xl font-light tracking-tight text-cream sm:text-3xl">
              {current.title}
            </h1>
            <p className="mt-2 text-sm text-cream-muted">{current.subtitle}</p>
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
                  <current.Component />
                </motion.div>
              </AnimatePresence>
            </div>

            {status === "error" ? (
              <p className="mt-5 rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember-soft">
                Oups, l&apos;envoi a échoué. Réessayez dans un instant, ou
                écrivez-nous directement.
              </p>
            ) : null}

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
                Précédent
              </button>

              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting" || status === "uploading"}
                className="min-w-44"
              >
                {status === "uploading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Téléversement des images…
                  </>
                ) : status === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi…
                  </>
                ) : isLast ? (
                  <>
                    Envoyer ma demande
                    <Check size={18} />
                  </>
                ) : (
                  <>
                    Continuer
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </Button>
            </div>
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
          Aucun paiement aujourd&apos;hui. On vous recontacte pour finaliser.
        </p>
      </div>
    </FormProvider>
  );
}

function ThankYou() {
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
      <h1 className="font-display mt-7 text-3xl font-light tracking-tight text-cream sm:text-4xl">
        C&apos;est noté, merci&nbsp;!
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-cream-muted">
        Nous avons bien reçu vos informations. Notre équipe prépare votre site
        et revient vers vous très vite — généralement sous 48h — pour vous
        montrer une première version.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-strong px-6 text-sm text-cream transition-colors hover:bg-cream/[0.05]"
        >
          <ArrowLeft size={16} />
          Retour à l&apos;accueil
        </Link>
      </div>
      <p className="mt-8 text-xs text-cream-faint">
        Une question en attendant&nbsp;? bonjour@brio.studio
      </p>
    </motion.div>
  );
}
