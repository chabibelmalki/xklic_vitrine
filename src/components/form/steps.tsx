"use client";

import { createContext, useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { BOUTIQUE_TIERS, type BoutiqueTier, type LeadValues } from "@/lib/lead-schema";
import { COUNTRIES } from "@/data/countries";
import {
  BOUTIQUE_LABELS,
  BOUTIQUE_MONTHLY_CENTS,
  euros,
  formules,
} from "@/lib/content";
import { CheckRow, Field, ImageUpload, TextArea, TextInput } from "./fields";

export type StepDef = {
  id: string;
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

/* ── Sous-titre de section à l'intérieur d'une étape (regroupe les champs) ──── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 border-t border-line pt-5 text-xs font-semibold uppercase tracking-wide text-cream-faint">
      {children}
    </p>
  );
}

/* ── Activité : identité + localisation + modèle d'intervention ────────────── */

function ActiviteStep() {
  const t = useTranslations("demarrer.fields");
  const { register, control } = useFormContext<LeadValues>();
  const err = useErr();
  // Zone d'intervention : n'a de sens que si le client se déplace.
  const mobile = useWatch<LeadValues>({ control, name: "mobile" });
  return (
    <div className="grid gap-5">
      <Field
        label={t("companyLabel")}
        hint={t("companyHint")}
        htmlFor="companyName"
        error={err("companyName")}
      >
        <TextInput
          id="companyName"
          placeholder={t("companyPlaceholder")}
          invalid={!!err("companyName")}
          {...register("companyName")}
        />
      </Field>
      <Field
        label={t("tradeLabel")}
        hint={t("tradeHint")}
        htmlFor="trade"
        error={err("trade")}
      >
        <TextInput
          id="trade"
          placeholder={t("tradePlaceholder")}
          invalid={!!err("trade")}
          {...register("trade")}
        />
      </Field>

      <SectionLabel>{t("whereSection")}</SectionLabel>
      <Field
        label={t("addressLabel")}
        optional
        hint={t("addressHint")}
        htmlFor="address"
      >
        <TextInput
          id="address"
          placeholder={t("addressPlaceholder")}
          {...register("address")}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("cityLabel")} hint={t("cityHint")} htmlFor="city" error={err("city")}>
          <TextInput
            id="city"
            placeholder={t("cityPlaceholder")}
            invalid={!!err("city")}
            {...register("city")}
          />
        </Field>
        <Field label={t("countryLabel")} htmlFor="country" error={err("country")}>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <select
                id="country"
                className={selectClass}
                value={field.value ?? ""}
                onChange={field.onChange}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          />
        </Field>
      </div>

      <SectionLabel>{t("howSection")}</SectionLabel>
      <Controller
        control={control}
        name="hasShop"
        render={({ field }) => (
          <CheckRow
            checked={!!field.value}
            onChange={field.onChange}
            label={t("hasShop")}
          />
        )}
      />
      <Controller
        control={control}
        name="mobile"
        render={({ field }) => (
          <CheckRow
            checked={!!field.value}
            onChange={field.onChange}
            label={t("mobile")}
          />
        )}
      />
      {mobile ? (
        <Field
          label={t("serviceAreaLabel")}
          optional
          hint={t("serviceAreaHint")}
          htmlFor="serviceArea"
        >
          <TextInput
            id="serviceArea"
            placeholder={t("serviceAreaPlaceholder")}
            {...register("serviceArea")}
          />
        </Field>
      ) : null}

      <Field
        label={t("availabilityLabel")}
        optional
        hint={t("availabilityHint")}
        htmlFor="availability"
      >
        <TextArea
          id="availability"
          placeholder={t("availabilityPlaceholder")}
          {...register("availability")}
        />
      </Field>
    </div>
  );
}

/* ── Coordonnées + numéro d'immatriculation (avant les détails du site) ────── */

function CoordonneesStep() {
  const t = useTranslations("demarrer.fields");
  const { register, control } = useFormContext<LeadValues>();
  const err = useErr();
  const country = useWatch<LeadValues>({ control, name: "country" });
  // Libellé du numéro d'immatriculation adapté au pays : « SIRET » n'existe
  // qu'en France, ailleurs on parle d'un numéro d'immatriculation générique.
  const isFrance = country === "France";
  const regLabel = isFrance ? t("regFrance") : t("regOther");
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("phoneLabel")}
          hint={t("phoneHint")}
          htmlFor="phone"
          error={err("phone")}
        >
          <TextInput
            id="phone"
            type="tel"
            placeholder={t("phonePlaceholder")}
            invalid={!!err("phone")}
            {...register("phone")}
          />
        </Field>
        <Field
          label={t("emailLabel")}
          hint={t("emailHint")}
          htmlFor="email"
          error={err("email")}
        >
          <TextInput
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            invalid={!!err("email")}
            {...register("email")}
          />
        </Field>
      </div>

      {/* Numéro d'immatriculation (facultatif, multi-pays) — libellé adapté au
          pays choisi (« SIRET » en France). Facultatif : le champ vide suffit. */}
      <Field
        label={regLabel}
        optional
        hint={isFrance ? t("regHintFrance") : t("regHintOther")}
        htmlFor="siret"
      >
        <TextInput
          id="siret"
          placeholder={isFrance ? t("regPlaceholderFrance") : t("regPlaceholderOther")}
          {...register("siret")}
        />
      </Field>
    </div>
  );
}

/* ── L'offre : formule socle + option boutique + prestations (1re étape) ──── */

const selectClass =
  "w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-[0.95rem] text-cream transition-colors duration-200 focus:border-line-strong focus:outline-none focus:ring-0";

function OffreStep() {
  const t = useTranslations("demarrer.fields");
  const tf = useTranslations("formules");
  const tcard = useTranslations("formules.card");
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
        label={t("formuleLabel")}
        hint={t("formuleHint")}
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
                          {tf(`items.${f.slug}.name`)}
                        </span>
                        {f.featured ? (
                          <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ember-deep">
                            {tcard("recommended")}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-sm leading-relaxed text-cream-faint">
                        {tf(`items.${f.slug}.phrase`)}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="font-display block text-xl font-semibold leading-none text-cream">
                        {f.setup}
                      </span>
                      <span className="mt-1 block text-xs text-cream-faint">
                        {t("thenMonthly", { monthly: f.monthly })}
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
        label={tcard("addShop")}
        hint={t("addShopHint")}
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
                <option value="">{tcard("noShop")}</option>
                {BOUTIQUE_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tcard("shopOption", {
                      label: BOUTIQUE_LABELS[tier],
                      price: euros(BOUTIQUE_MONTHLY_CENTS[tier]),
                      products: tf(`boutiqueProducts.${tier}`),
                    })}
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
              label={t("alsoServices")}
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
                <span>{tf(`items.${selected.slug}.name`)}</span>
                <span className="shrink-0">{euros(selected.monthlyCents)}/mois</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>{t("shopLine", { tier: BOUTIQUE_LABELS[boutique] })}</span>
                <span className="shrink-0">
                  +{euros(BOUTIQUE_MONTHLY_CENTS[boutique])}/mois
                </span>
              </div>
            </div>
          ) : null}
          <div className="flex items-end justify-between gap-4">
            <span className="text-sm font-medium text-cream">{t("totalTTC")}</span>
            <div className="text-right">
              <div className="font-display text-2xl font-semibold leading-none text-cream">
                {euros(monthlyCents)}
                <span className="text-sm font-normal text-cream-muted"> {t("perMonth")}</span>
              </div>
              <div className="mt-1.5 text-xs text-cream-faint">
                {t("setupToday", { price: euros(setupCents) })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ── Détails du site : identité visuelle, langues, réseaux (avant paiement) ── */

function SiteDetailsStep() {
  const t = useTranslations("demarrer.fields");
  const { register, control, setValue, getValues } = useFormContext<LeadValues>();
  const boutique = useWatch<LeadValues>({ control, name: "boutiqueTier" }) as
    | BoutiqueTier
    | undefined;
  const wantsServices = useWatch<LeadValues>({ control, name: "wantsServices" });
  // WhatsApp : coché (défaut) = joignable sur WhatsApp. Le numéro affiché sur le
  // site est pré-rempli avec le téléphone saisi à l'étape précédente (éditable).
  const whatsapp = useWatch<LeadValues>({ control, name: "whatsapp" });
  const phone = useWatch<LeadValues>({ control, name: "phone" });
  // À l'affichage de l'étape : si le champ WhatsApp est vide (pas de reprise de
  // dossier), on le pré-remplit avec le téléphone déjà saisi.
  useEffect(() => {
    if (!getValues("whatsappPhone")?.trim()) {
      setValue("whatsappPhone", getValues("phone") ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // On demande de décrire l'activité si le dossier propose des prestations —
  // c.-à-d. pas de boutique, ou boutique + prestations cochées.
  const showDescription = !boutique || wantsServices !== false;
  return (
    <div className="grid gap-6">
      {showDescription ? (
        <Field
          label={t("describeLabel")}
          optional
          hint={t("describeHint")}
          htmlFor="services"
        >
          <TextArea
            id="services"
            placeholder={t("describePlaceholder")}
            {...register("services")}
          />
        </Field>
      ) : null}

      <Field label={t("logoLabel")} optional hint={t("logoHint")}>
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              multiple={false}
              compact
              cta={t("logoCta")}
            />
          )}
        />
      </Field>

      <Field label={t("photosLabel")} optional hint={t("photosHint")}>
        <Controller
          control={control}
          name="photos"
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>

      <Field
        label={t("colorsLabel")}
        optional
        hint={t("colorsHint")}
      >
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
                  {t("colorPrimary")}
                </label>
                <label className="flex items-center gap-2 text-sm text-cream-muted">
                  <input
                    type="color"
                    value={val[1] || "#f59e0b"}
                    onChange={(e) => setAt(1, e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-line bg-transparent"
                  />
                  {t("colorSecondary")}
                </label>
              </div>
            );
          }}
        />
      </Field>

      <Field
        label={t("ambianceLabel")}
        optional
        hint={t("ambianceHint")}
        htmlFor="ambiance"
      >
        <TextArea
          id="ambiance"
          placeholder={t("ambiancePlaceholder")}
          {...register("ambiance")}
        />
      </Field>

      <Field
        label={t("languagesLabel")}
        optional
        hint={t("languagesHint")}
        htmlFor="languages"
      >
        <TextInput
          id="languages"
          placeholder={t("languagesPlaceholder")}
          {...register("languages")}
        />
      </Field>

      <Field label={t("socialsLabel")} optional hint={t("socialsHint")}>
        <div className="grid gap-3">
          <TextInput placeholder="Facebook" {...register("socials.facebook")} />
          <TextInput placeholder="Instagram" {...register("socials.instagram")} />
          <TextInput placeholder="TikTok" {...register("socials.tiktok")} />
          <TextInput placeholder="X (Twitter)" {...register("socials.x")} />
          <TextInput placeholder={t("socialGoogle")} {...register("socials.google")} />
        </div>
      </Field>

      <Controller
        control={control}
        name="whatsapp"
        render={({ field }) => (
          <CheckRow
            checked={field.value !== false}
            onChange={(v) => {
              field.onChange(v);
              // Recoché après décochage : re-pré-remplir le numéro si resté vide.
              if (v && !getValues("whatsappPhone")?.trim()) {
                setValue("whatsappPhone", getValues("phone") ?? "");
              }
            }}
            label={t("whatsappLabel")}
          />
        )}
      />

      {whatsapp !== false && (
        <Field
          label={t("whatsappPhoneLabel")}
          hint={t("whatsappPhoneHint")}
          htmlFor="whatsappPhone"
        >
          <TextInput
            id="whatsappPhone"
            type="tel"
            placeholder={phone || t("phonePlaceholder")}
            {...register("whatsappPhone")}
          />
        </Field>
      )}

      <Field
        label={t("extraLabel")}
        optional
        hint={t("extraHint")}
        htmlFor="extra"
      >
        <TextArea
          id="extra"
          placeholder={t("extraPlaceholder")}
          {...register("extra")}
        />
      </Field>
    </div>
  );
}

/* ── Registre des étapes (offre → activité → coordonnées → site → paiement) ─── */

// Ordre : l'OFFRE d'abord (le client voit le prix tout de suite, et `?formule=`
// pré-sélectionne la carte), puis l'ACTIVITÉ (entreprise, localisation, modèle
// d'intervention), les COORDONNÉES (+ n° d'immatriculation), puis les DÉTAILS du
// site (identité visuelle, langues, réseaux). Le PAIEMENT vient en toute fin.
// Les titres/sous-titres sont traduits dans lead-form via `demarrer.steps.<id>`.
const ALL_STEPS: StepDef[] = [
  { id: "offre", fields: ["formule"], Component: OffreStep },
  {
    id: "activite",
    fields: ["companyName", "trade", "city", "country"],
    Component: ActiviteStep,
  },
  {
    id: "coordonnees",
    fields: ["phone", "email"],
    Component: CoordonneesStep,
  },
  { id: "site", fields: [], Component: SiteDetailsStep },
];

export function buildSteps(): StepDef[] {
  return ALL_STEPS;
}
