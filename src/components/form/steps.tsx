"use client";

import { createContext } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ShoppingBag } from "lucide-react";
import { BOUTIQUE_TIERS, type BoutiqueTier, type LeadValues } from "@/lib/lead-schema";
import {
  BOUTIQUE_LABELS,
  BOUTIQUE_MONTHLY_CENTS,
  BOUTIQUE_PRODUCTS,
  euros,
  formules,
} from "@/lib/content";
import { CheckRow, Field, TextInput } from "./fields";

export type StepDef = {
  id: string;
  title: string;
  subtitle: string;
  fields: (keyof LeadValues)[];
  autoAdvance?: boolean; // étape à choix unique : le clic vaut « Continuer »
  Component: () => React.ReactNode;
};

// Contexte d'auto-avance — conservé pour compatibilité avec lead-form (qui
// enveloppe chaque étape). Depuis la refonte du tunnel minimal, aucune étape ne
// l'utilise ; on garde le Provider pour ne pas toucher au rendu de lead-form.
const AdvanceContext = createContext<(() => void) | null>(null);

export function StepNavProvider({
  advance,
  children,
}: {
  advance: () => void;
  children: React.ReactNode;
}) {
  return (
    <AdvanceContext.Provider value={advance}>{children}</AdvanceContext.Provider>
  );
}

function useErr() {
  const {
    formState: { errors },
  } = useFormContext<LeadValues>();
  return (k: keyof LeadValues) => errors[k]?.message as string | undefined;
}

/* ── Identité + SIRET (dernière étape, juste avant le paiement) ───────────── */

function IdentiteStep() {
  const { register, control } = useFormContext<LeadValues>();
  const err = useErr();
  const noSiret = useWatch<LeadValues>({ control, name: "noSiret" });
  return (
    <div className="grid gap-5">
      <Field
        label="Nom de votre entreprise"
        hint="Ex. : « Souad Ménage », « Garage Mécaline »"
        htmlFor="companyName"
        error={err("companyName")}
      >
        <TextInput
          id="companyName"
          placeholder="Le nom sous lequel vos clients vous connaissent"
          invalid={!!err("companyName")}
          {...register("companyName")}
        />
      </Field>
      <Field
        label="Votre métier"
        hint="Ex. : « Femme de ménage à domicile », « Plombier chauffagiste »"
        htmlFor="trade"
        error={err("trade")}
      >
        <TextInput
          id="trade"
          placeholder="Ce que vous faites, en quelques mots"
          invalid={!!err("trade")}
          {...register("trade")}
        />
      </Field>
      <Field label="Ville" hint="Ex. : « Lyon »" htmlFor="city" error={err("city")}>
        <TextInput
          id="city"
          placeholder="Votre ville principale"
          invalid={!!err("city")}
          {...register("city")}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Téléphone"
          hint="Le numéro affiché sur votre site."
          htmlFor="phone"
          error={err("phone")}
        >
          <TextInput
            id="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            invalid={!!err("phone")}
            {...register("phone")}
          />
        </Field>
        <Field
          label="Email"
          hint="C'est là qu'arriveront les demandes."
          htmlFor="email"
          error={err("email")}
        >
          <TextInput
            id="email"
            type="email"
            placeholder="Votre adresse email"
            invalid={!!err("email")}
            {...register("email")}
          />
        </Field>
      </div>

      {/* SIRET (facultatif) — fusionné ici : c'est la dernière étape avant de payer. */}
      <Field
        label="SIRET"
        optional
        hint="Facultatif — vous pourrez le renseigner plus tard."
        htmlFor="siret"
      >
        <TextInput
          id="siret"
          placeholder="Numéro SIRET (14 chiffres)"
          disabled={!!noSiret}
          {...register("siret")}
        />
      </Field>
      <Controller
        control={control}
        name="noSiret"
        render={({ field }) => (
          <CheckRow
            checked={!!field.value}
            onChange={field.onChange}
            label="SIRET en cours de création"
          />
        )}
      />
    </div>
  );
}

/* ── L'offre : formule socle + option boutique + prestations (1re étape) ──── */

const selectClass =
  "w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-[0.95rem] text-cream transition-colors duration-200 focus:border-line-strong focus:outline-none focus:ring-0";

function OffreStep() {
  const { control } = useFormContext<LeadValues>();
  const err = useErr();
  const formuleSlug = useWatch<LeadValues>({ control, name: "formule" });
  const boutique = useWatch<LeadValues>({ control, name: "boutiqueTier" }) as
    | BoutiqueTier
    | undefined;
  const selected = formules.find((f) => f.slug === formuleSlug);
  const monthlyCents =
    (selected?.monthlyCents ?? 0) +
    (boutique ? BOUTIQUE_MONTHLY_CENTS[boutique] : 0);
  const setupCents = selected?.setupCents ?? 0;
  return (
    <div className="grid gap-6">
      {/* Formule socle */}
      <Field
        label="Votre formule"
        hint="Vous pourrez en changer avec nous."
        error={err("formule")}
      >
        <Controller
          control={control}
          name="formule"
          render={({ field }) => (
            <div className="grid gap-3">
              {formules.map((f) => {
                const active = field.value === f.slug;
                return (
                  <button
                    type="button"
                    key={f.slug}
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(f.slug)}
                    className={
                      "flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 " +
                      (active
                        ? "border-ember/50 bg-ember/10"
                        : "border-line bg-ink-soft hover:border-line-strong")
                    }
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="flex flex-wrap items-center gap-2">
                        <span
                          className={
                            "text-base font-medium " +
                            (active ? "text-cream" : "text-cream-muted")
                          }
                        >
                          {f.name}
                        </span>
                        {f.featured ? (
                          <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ember-deep">
                            Recommandé
                          </span>
                        ) : null}
                      </span>
                      <span className="text-sm leading-relaxed text-cream-faint">
                        {f.phrase}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="font-display block text-xl font-semibold leading-none text-cream">
                        {f.setup}
                      </span>
                      <span className="mt-1 block text-xs text-cream-faint">
                        puis {f.monthly}/mois · TTC
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </Field>

      {/* Option boutique e-commerce (2e item du même abonnement) */}
      <Field
        label="Ajouter une boutique en ligne ?"
        hint="Mensuel, sans engagement, zéro commission. Vous ajouterez vos produits après."
      >
        <Controller
          control={control}
          name="boutiqueTier"
          render={({ field }) => (
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={18} className="shrink-0 text-cream-muted" />
              <select
                className={selectClass + " min-w-0 flex-1"}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? undefined : e.target.value)
                }
              >
                <option value="">Pas de boutique</option>
                {BOUTIQUE_TIERS.map((t) => (
                  <option key={t} value={t}>
                    {BOUTIQUE_LABELS[t]} — +{euros(BOUTIQUE_MONTHLY_CENTS[t])}/mois
                    {" "}({BOUTIQUE_PRODUCTS[t]})
                  </option>
                ))}
              </select>
            </div>
          )}
        />
      </Field>

      {/* Prestations : proposé seulement si une boutique est choisie */}
      {boutique ? (
        <Controller
          control={control}
          name="wantsServices"
          render={({ field }) => (
            <CheckRow
              checked={field.value !== false}
              onChange={field.onChange}
              label="Je propose aussi des prestations (pas seulement de la vente)"
            />
          )}
        />
      ) : null}

      {/* Récap prix — dès qu'une formule est choisie ; se met à jour live avec
          le palier boutique. Essai 30 j : aujourd'hui = l'installation seule. */}
      {selected ? (
        <div className="rounded-2xl border border-line bg-ink-soft/60 p-5">
          {boutique ? (
            <div className="mb-3 space-y-1.5 border-b border-line pb-3 text-sm text-cream-muted">
              <div className="flex justify-between gap-4">
                <span>{selected.name}</span>
                <span className="shrink-0">{euros(selected.monthlyCents)}/mois</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Boutique {BOUTIQUE_LABELS[boutique]}</span>
                <span className="shrink-0">
                  +{euros(BOUTIQUE_MONTHLY_CENTS[boutique])}/mois
                </span>
              </div>
            </div>
          ) : null}
          <div className="flex items-end justify-between gap-4">
            <span className="text-sm font-medium text-cream">Total TTC</span>
            <div className="text-right">
              <div className="font-display text-2xl font-semibold leading-none text-cream">
                {euros(monthlyCents)}
                <span className="text-sm font-normal text-cream-muted"> /mois</span>
              </div>
              <div className="mt-1.5 text-xs text-cream-faint">
                + {euros(setupCents)} d&apos;installation aujourd&apos;hui
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ── Registre des étapes (tunnel minimal avant paiement) ──────────────────── */

// Ordre : l'OFFRE d'abord (le client voit le prix tout de suite, et `?formule=`
// pré-sélectionne la carte), puis l'IDENTITÉ (+ SIRET) qui précède directement
// le paiement.
const ALL_STEPS: StepDef[] = [
  {
    id: "offre",
    title: "Votre offre",
    subtitle: "Choisissez votre formule, et une boutique en ligne si vous le souhaitez.",
    fields: ["formule"],
    Component: OffreStep,
  },
  {
    id: "identite",
    title: "Vos coordonnées",
    subtitle: "Dernière étape avant le paiement : qui vous êtes et comment vous joindre.",
    fields: ["companyName", "trade", "city", "phone", "email"],
    Component: IdentiteStep,
  },
];

export function buildSteps(): StepDef[] {
  return ALL_STEPS;
}
