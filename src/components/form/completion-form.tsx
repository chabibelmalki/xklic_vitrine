"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { upload } from "@vercel/blob/client";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CheckRow, Field, ImageUpload, TextArea, TextInput } from "./fields";
import { cn, EASE_OUT } from "@/lib/utils";

type UploadItem = { id?: string; name: string; url?: string; file?: unknown };

export type CompletionInitial = {
  description: string;
  logo: UploadItem[];
  photos: UploadItem[];
  colorPreference: string[];
  ambiance: string;
  socials: { facebook: string; instagram: string; tiktok: string; x: string; google: string };
  languages: string[];
  noWhatsapp: boolean;
  siret: string;
};

type FormValues = CompletionInitial;

const LANGS: { code: string; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "Anglais" },
  { code: "ar", label: "Arabe" },
  { code: "es", label: "Espagnol" },
  { code: "pt", label: "Portugais" },
  { code: "it", label: "Italien" },
];

type Status = "form" | "uploading" | "submitting" | "done" | "error";

// Téléverse chaque image vers Vercel Blob (comme le tunnel) et renvoie { name, url }.
// Un item déjà en ligne (pas de `file`) est conservé tel quel — la complétion est
// donc ré-éditable sans re-téléverser ni perdre les images existantes.
async function uploadFiles(items?: UploadItem[]) {
  return Promise.all(
    (items ?? []).map(async (item) => {
      if (!(item.file instanceof File)) return { name: item.name, url: item.url ?? "" };
      const blob = await upload(`completion/${item.file.name}`, item.file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });
      return { name: item.name, url: blob.url };
    }),
  );
}

export function CompletionForm({
  sessionId,
  initial,
  showDescription,
  hasSiret,
  companyName,
}: {
  sessionId: string;
  initial: CompletionInitial;
  showDescription: boolean;
  hasSiret: boolean;
  companyName: string;
}) {
  const [status, setStatus] = useState<Status>("form");
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: initial,
  });

  const submit = handleSubmit(async (values) => {
    try {
      const nbFiles =
        (values.logo ?? []).filter((i) => i.file instanceof File).length +
        (values.photos ?? []).filter((i) => i.file instanceof File).length;
      setStatus(nbFiles > 0 ? "uploading" : "submitting");
      const [logo, photos] = await Promise.all([
        uploadFiles(values.logo),
        uploadFiles(values.photos),
      ]);
      setStatus("submitting");

      // On n'envoie que les champs pertinents (whitelist confirmée côté serveur).
      const payload = {
        sessionId,
        ...(showDescription ? { description: values.description } : {}),
        logo,
        photos,
        colorPreference: (values.colorPreference ?? []).filter(Boolean),
        ambiance: values.ambiance,
        socials: values.socials,
        languages: values.languages ?? [],
        noWhatsapp: values.noWhatsapp,
        ...(hasSiret ? {} : { siret: values.siret }),
      };

      const res = await fetch("/api/complete", {
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
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="rounded-3xl border border-line bg-ink-soft/60 p-8 text-center"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-ember-soft">
          <CheckCircle2 size={26} />
        </span>
        <h2 className="font-display mt-5 text-2xl font-semibold text-cream">
          Profil complété, merci&nbsp;!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-cream-muted">
          Tout est reçu. Notre équipe a maintenant ce qu&apos;il faut pour
          préparer votre site.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-ink-soft/60 p-6 backdrop-blur-sm sm:p-9">
      <div className="mb-7">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
          Dernière étape&nbsp;: complétez votre profil
        </h2>
        <p className="mt-2 text-sm text-cream-muted">
          {companyName ? `${companyName} — ` : ""}quelques infos de plus pour
          qu&apos;on construise votre site à votre image. Tout est facultatif, et
          vous pouvez revenir plus tard avec le lien de votre email.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="grid gap-6"
      >
        {showDescription ? (
          <Field
            label="Décrivez votre activité"
            hint="Vos prestations, votre façon de travailler… en vrac, on affinera."
            htmlFor="description"
          >
            <TextArea
              id="description"
              placeholder="Ce que vous proposez, à qui, comment…"
              {...register("description")}
            />
          </Field>
        ) : null}

        <Field label="Votre logo" optional hint="Si vous en avez un.">
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                multiple={false}
                compact
                cta="Déposez votre logo"
              />
            )}
          />
        </Field>

        <Field label="Vos photos" optional hint="Chantiers, réalisations, local…">
          <Controller
            control={control}
            name="photos"
            render={({ field }) => (
              <ImageUpload value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>

        <Field label="Vos couleurs" optional hint="Principale et secondaire — ou laissez, on choisira.">
          <Controller
            control={control}
            name="colorPreference"
            render={({ field }) => {
              const val = field.value ?? [];
              const setAt = (i: number, v: string) => {
                const next = [...val];
                next[i] = v;
                field.onChange(next);
              };
              return (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-cream-muted">
                    <input
                      type="color"
                      value={val[0] || "#2563eb"}
                      onChange={(e) => setAt(0, e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-line bg-transparent"
                    />
                    Principale
                  </label>
                  <label className="flex items-center gap-2 text-sm text-cream-muted">
                    <input
                      type="color"
                      value={val[1] || "#f59e0b"}
                      onChange={(e) => setAt(1, e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-line bg-transparent"
                    />
                    Secondaire
                  </label>
                </div>
              );
            }}
          />
        </Field>

        <Field
          label="Style & ambiance"
          optional
          hint="Chaleureux, moderne, sérieux, coloré… décrivez l'esprit voulu."
          htmlFor="ambiance"
        >
          <TextArea
            id="ambiance"
            placeholder="L'ambiance que vous imaginez pour votre site…"
            {...register("ambiance")}
          />
        </Field>

        <Field label="Langues du site" optional hint="Choisissez une ou plusieurs langues.">
          <Controller
            control={control}
            name="languages"
            render={({ field }) => {
              const val = field.value ?? [];
              const toggle = (code: string) =>
                field.onChange(
                  val.includes(code) ? val.filter((c) => c !== code) : [...val, code],
                );
              return (
                <div className="flex flex-wrap gap-2">
                  {LANGS.map((l) => {
                    const active = val.includes(l.code);
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => toggle(l.code)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm transition-colors",
                          active
                            ? "border-ember/50 bg-ember/10 text-cream"
                            : "border-line bg-ink-soft text-cream-muted hover:border-line-strong",
                        )}
                      >
                        {l.label}
                      </button>
                    );
                  })}
                </div>
              );
            }}
          />
        </Field>

        <Field label="Réseaux sociaux" optional hint="Lien ou pseudo — on normalise.">
          <div className="grid gap-3">
            <TextInput placeholder="Facebook" {...register("socials.facebook")} />
            <TextInput placeholder="Instagram" {...register("socials.instagram")} />
            <TextInput placeholder="TikTok" {...register("socials.tiktok")} />
            <TextInput placeholder="X (Twitter)" {...register("socials.x")} />
            <TextInput placeholder="Fiche Google" {...register("socials.google")} />
          </div>
        </Field>

        <Controller
          control={control}
          name="noWhatsapp"
          render={({ field }) => (
            <CheckRow
              checked={!!field.value}
              onChange={field.onChange}
              label="Je n'ai pas WhatsApp (ne pas afficher de bouton WhatsApp)"
            />
          )}
        />

        {!hasSiret ? (
          <Field label="SIRET" optional hint="Si vous l'avez maintenant." htmlFor="siret">
            <TextInput
              id="siret"
              placeholder="Numéro SIRET (14 chiffres)"
              {...register("siret")}
            />
          </Field>
        ) : null}

        {status === "error" ? (
          <p className="rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember-soft">
            Oups, l&apos;envoi a échoué. Réessayez dans un instant.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "uploading" || status === "submitting"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember-deep via-ember to-amber px-6 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
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
          ) : (
            "Enregistrer mon profil"
          )}
        </button>
      </form>
    </div>
  );
}
