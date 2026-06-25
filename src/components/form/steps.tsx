"use client";

import { createContext, useContext } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Plus,
  ShoppingBag,
  Trash2,
  Wrench,
} from "lucide-react";
import type { ActivityType, LeadValues } from "@/lib/lead-schema";
import { wantsProducts, wantsServices } from "@/lib/lead-schema";
import { formules } from "@/lib/content";
import {
  CheckRow,
  Field,
  ImageUpload,
  RadioCards,
  TextArea,
  TextInput,
} from "./fields";

export type StepDef = {
  id: string;
  title: string;
  subtitle: string;
  fields: (keyof LeadValues)[];
  when?: (t?: ActivityType) => boolean;
  autoAdvance?: boolean; // étape à choix unique : le clic vaut « Continuer »
  Component: () => React.ReactNode;
};

// Permet à une étape à choix unique (formule, type d'activité) de passer à la
// suite dès qu'une option est cliquée, sans bouton « Continuer ».
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

function useAdvance() {
  return useContext(AdvanceContext);
}

function useErr() {
  const {
    formState: { errors },
  } = useFormContext<LeadValues>();
  return (k: keyof LeadValues) => errors[k]?.message as string | undefined;
}

/* ── Étape formule : choix de l'offre (sautée si déjà choisie via une carte) ─ */

function FormuleStep() {
  const { control } = useFormContext<LeadValues>();
  const err = useErr();
  const advance = useAdvance();
  return (
    <Field
      label="Quelle formule t'intéresse ?"
      hint="Rien n'est définitif : on pourra en parler et l'ajuster ensemble."
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
                  onClick={() => {
                    field.onChange(f.slug);
                    advance?.();
                  }}
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
  );
}

/* ── Étape 0 : type d'activité (branchement) ────────────────────────────── */

const ACTIVITY_OPTIONS = [
  {
    value: "services" as const,
    title: "Des services",
    desc: "Tu interviens chez tes clients ou en atelier — ménage, plomberie, coiffure, mécanique…",
    Icon: Wrench,
  },
  {
    value: "produits" as const,
    title: "Des produits",
    desc: "Tu vends de la marchandise — boulangerie, boutique, créations artisanales…",
    Icon: ShoppingBag,
  },
  {
    value: "les-deux" as const,
    title: "Les deux",
    desc: "Tu proposes à la fois des prestations et des produits à la vente.",
    Icon: Layers,
  },
];

function TypeStep() {
  const { control } = useFormContext<LeadValues>();
  const err = useErr();
  const advance = useAdvance();
  return (
    <Field
      label="Que proposes-tu à tes clients ?"
      hint="On adapte les questions suivantes à ton activité."
      error={err("activityType")}
    >
      <Controller
        control={control}
        name="activityType"
        render={({ field }) => (
          <div className="grid gap-3">
            {ACTIVITY_OPTIONS.map((opt) => {
              const active = field.value === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    field.onChange(opt.value);
                    advance?.();
                  }}
                  className={
                    "flex items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 " +
                    (active
                      ? "border-ember/50 bg-ember/10"
                      : "border-line bg-ink-soft hover:border-line-strong")
                  }
                >
                  <span
                    className={
                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors " +
                      (active
                        ? "border-ember/40 bg-ember/15 text-ember-soft"
                        : "border-line text-cream-muted")
                    }
                  >
                    <opt.Icon size={18} />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span
                      className={
                        "text-base font-medium " +
                        (active ? "text-cream" : "text-cream-muted")
                      }
                    >
                      {opt.title}
                    </span>
                    <span className="text-sm leading-relaxed text-cream-faint">
                      {opt.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      />
    </Field>
  );
}

/* ── A. Entreprise & contact (entreprise + coordonnées + SIRET fusionnés) ── */

function EntrepriseContactStep() {
  const { register, control, setValue } = useFormContext<LeadValues>();
  const err = useErr();
  const mobile = useWatch<LeadValues>({ control, name: "mobile" });
  const hasShop = useWatch<LeadValues>({ control, name: "hasShop" });
  const noSiret = useWatch<LeadValues>({ control, name: "noSiret" });
  return (
    <div className="grid gap-5">
      <Field
        label="Nom de ton entreprise"
        hint="Ex. : « Souad Ménage », « Garage Mécaline »"
        htmlFor="companyName"
        error={err("companyName")}
      >
        <TextInput
          id="companyName"
          placeholder="Le nom sous lequel tes clients te connaissent"
          invalid={!!err("companyName")}
          {...register("companyName")}
        />
      </Field>
      <Field
        label="Ton métier"
        hint="Ex. : « Femme de ménage à domicile », « Plombier chauffagiste »"
        htmlFor="trade"
        error={err("trade")}
      >
        <TextInput
          id="trade"
          placeholder="Ce que tu fais, en quelques mots"
          invalid={!!err("trade")}
          {...register("trade")}
        />
      </Field>
      <Field
        label="Ville"
        hint="Ex. : « Lyon »"
        htmlFor="city"
        error={err("city")}
      >
        <TextInput
          id="city"
          placeholder="Ta ville principale"
          invalid={!!err("city")}
          {...register("city")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Téléphone"
          hint="Le numéro affiché sur ton site."
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
            placeholder="Ton adresse email"
            invalid={!!err("email")}
            {...register("email")}
          />
        </Field>
      </div>
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

      <Controller
        control={control}
        name="mobile"
        render={({ field }) => (
          <CheckRow
            checked={!!field.value}
            onChange={field.onChange}
            label="Je me déplace chez mes clients"
          />
        )}
      />
      {mobile ? (
        <Field
          label="Zone d'intervention"
          hint="Ex. : « Lyon et 20 km autour »"
          htmlFor="serviceArea"
          error={err("serviceArea")}
        >
          <TextInput
            id="serviceArea"
            placeholder="Jusqu'où tu interviens"
            invalid={!!err("serviceArea")}
            {...register("serviceArea")}
          />
        </Field>
      ) : null}

      <Controller
        control={control}
        name="hasShop"
        render={({ field }) => (
          <CheckRow
            checked={!!field.value}
            onChange={field.onChange}
            label="J'ai un local ou une boutique"
          />
        )}
      />
      {hasShop ? (
        <Field
          label="Adresse"
          hint="Utile pour le référencement local et l'itinéraire."
          htmlFor="address"
          optional
        >
          <TextInput
            id="address"
            placeholder="12 rue de la République, 69002 Lyon"
            {...register("address")}
          />
        </Field>
      ) : null}

      <Field
        label="Disponibilités"
        hint="Ex. : « Du lundi au samedi, 8h–19h »"
        htmlFor="availability"
        optional
      >
        <TextInput
          id="availability"
          placeholder="Tes horaires ou jours d'intervention"
          {...register("availability")}
        />
      </Field>

      <Field
        label="Numéro SIRET"
        hint="Facultatif. Coche ci-dessous si ton entreprise est en cours de création."
        htmlFor="siret"
        optional
      >
        <TextInput
          id="siret"
          inputMode="numeric"
          placeholder="14 chiffres"
          disabled={!!noSiret}
          className={
            noSiret
              ? "cursor-not-allowed bg-ink-panel text-cream-faint"
              : undefined
          }
          {...register("siret")}
        />
      </Field>
      <Controller
        control={control}
        name="noSiret"
        render={({ field }) => (
          <CheckRow
            checked={!!field.value}
            onChange={(v) => {
              field.onChange(v);
              if (v) setValue("siret", "");
            }}
            label="SIRET en cours de création"
          />
        )}
      />
    </div>
  );
}

/* ── S1. Prestations & prix (services / les-deux) ───────────────────────── */

function PrestationsStep() {
  const { register, control } = useFormContext<LeadValues>();
  const err = useErr();
  return (
    <div className="grid gap-6">
      <Field
        label="Tes prestations et tes prix"
        hint="Écris en vrac, on met en forme. Ex. : « Ménage 25€/h, repassage 20€/h, grand nettoyage sur devis. »"
        htmlFor="services"
        error={err("services")}
      >
        <TextArea
          id="services"
          placeholder="Liste ce que tu proposes et tes tarifs, même approximatifs…"
          invalid={!!err("services")}
          {...register("services")}
        />
      </Field>
      <Field
        label="Services à la personne / crédit d'impôt 50% ?"
        hint="Le crédit d'impôt est un argument fort : on le mettra en avant si tu es éligible."
        error={err("taxCredit")}
      >
        <Controller
          control={control}
          name="taxCredit"
          render={({ field }) => (
            <RadioCards
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "oui", label: "Oui" },
                { value: "non", label: "Non" },
                { value: "je-ne-sais-pas", label: "Je ne sais pas" },
              ]}
            />
          )}
        />
      </Field>
    </div>
  );
}

/* ── P1. Marchandise (produits / les-deux) — étape répétable ────────────── */

function ProductCard({ index }: { index: number }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<LeadValues>();
  const titleErr = errors.products?.[index]?.title?.message as
    | string
    | undefined;
  return (
    <div className="grid gap-4">
      <Field
        label="Nom du produit"
        hint="Ex. : « Croissant au beurre », « Bouquet de saison »"
        htmlFor={`products.${index}.title`}
        error={titleErr}
      >
        <TextInput
          id={`products.${index}.title`}
          placeholder="Comment s'appelle ce produit ?"
          invalid={!!titleErr}
          {...register(`products.${index}.title` as const)}
        />
      </Field>
      <Field
        label="Description courte"
        hint="En vrac, on l'améliorera. Ex. : « pur beurre, fait maison chaque matin »"
        htmlFor={`products.${index}.description`}
        optional
      >
        <TextArea
          id={`products.${index}.description`}
          className="min-h-20"
          placeholder="Quelques mots sur ce produit…"
          {...register(`products.${index}.description` as const)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Prix"
          hint="Ex. : « 1,20 € » ou « à partir de 25 € »"
          htmlFor={`products.${index}.price`}
          optional
        >
          <TextInput
            id={`products.${index}.price`}
            placeholder="Le tarif affiché"
            {...register(`products.${index}.price` as const)}
          />
        </Field>
        <Field
          label="Catégorie"
          hint="Ex. : « Viennoiseries », « Gâteaux »"
          htmlFor={`products.${index}.category`}
          optional
        >
          <TextInput
            id={`products.${index}.category`}
            placeholder="Pour regrouper tes produits"
            {...register(`products.${index}.category` as const)}
          />
        </Field>
      </div>
      <Field label="Photos du produit" optional>
        <Controller
          control={control}
          name={`products.${index}.photos` as const}
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              compact
              cta="Ajoute une ou plusieurs photos"
            />
          )}
        />
      </Field>
    </div>
  );
}

function ProduitsStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LeadValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "products",
  });
  const arrayErr = (errors.products as { message?: string } | undefined)
    ?.message;

  const addProduct = () =>
    append({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      price: "",
      category: "",
      photos: [],
    });

  return (
    <div className="grid gap-5">
      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-ink-soft px-5 py-8 text-center">
          <p className="text-sm text-cream-muted">
            Aucun produit pour l&apos;instant. Ajoutes-en autant que tu le
            souhaites — tu pourras les réordonner ou les retirer.
          </p>
        </div>
      ) : null}

      {fields.map((f, i) => (
        <div
          key={f.id}
          className="rounded-2xl border border-line bg-ink/40 p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-cream-muted">
              Produit {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                aria-label="Monter le produit"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-cream-muted transition-colors hover:border-line-strong hover:text-cream disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                disabled={i === fields.length - 1}
                aria-label="Descendre le produit"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-cream-muted transition-colors hover:border-line-strong hover:text-cream disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Supprimer le produit"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-cream-muted transition-colors hover:border-ember/40 hover:bg-ember/10 hover:text-ember-soft"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <ProductCard index={i} />
        </div>
      ))}

      {arrayErr && fields.length === 0 ? (
        <p className="text-xs text-ember-soft">{arrayErr}</p>
      ) : null}

      <button
        type="button"
        onClick={addProduct}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-ink-soft px-4 py-3.5 text-sm font-medium text-cream transition-colors hover:border-ember/40 hover:bg-ember/[0.03]"
      >
        <Plus size={16} />
        Ajouter un produit
      </button>
    </div>
  );
}

/* ── Identité visuelle & préférences (logo, photos, langues, style) ──────── */

// `flag` = code pays ISO pour l'image de drapeau (flagcdn). On évite les
// emojis-drapeaux qui ne s'affichent pas sous Windows.
const LANGS = [
  { value: "fr", label: "Français", flag: "fr" },
  { value: "en", label: "English", flag: "us" },
  { value: "ar", label: "العربية", flag: "sa" },
  { value: "es", label: "Español", flag: "es" },
  { value: "tr", label: "Türkçe", flag: "tr" },
  { value: "pt", label: "Português", flag: "pt" },
  { value: "it", label: "Italiano", flag: "it" },
  { value: "de", label: "Deutsch", flag: "de" },
  { value: "ru", label: "Русский", flag: "ru" },
  { value: "bn", label: "বাংলা", flag: "bd" },
  { value: "hi", label: "हिन्दी", flag: "in" },
];

const STYLE_VIBES = [
  "Chaleureux",
  "Épuré / minimaliste",
  "Pro & rassurant",
  "Moderne & dynamique",
  "Naturel",
  "Élégant / premium",
  "Fun & coloré",
];

const COLORS: { value: string; label: string; swatch?: string }[] = [
  { value: "bleu", label: "Bleu", swatch: "#2563eb" },
  { value: "vert", label: "Vert", swatch: "#16a34a" },
  { value: "rouge-orange", label: "Rouge / orange", swatch: "#ea580c" },
  { value: "violet", label: "Violet", swatch: "#7c3aed" },
  { value: "noir-blanc", label: "Noir & blanc", swatch: "#111827" },
  { value: "dore", label: "Doré", swatch: "#caa53d" },
  { value: "equipe", label: "Laisse faire l'équipe" },
];

/* ── Réseaux sociaux & fiche Google (présence en ligne, facultatif) ──────── */

// Icônes de marque en inline SVG (lucide n'expose pas ces logos de façon
// fiable). Monochrome `currentColor`, sauf Google qui garde ses 4 couleurs
// pour rester instantanément reconnaissable.
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.87v-8.4H7.08v-3.47h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.95H15.83c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.4C19.61 23.04 24 18.07 24 12.07z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-10.41a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
  </svg>
);
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93zM17.61 20.64h2.04L6.49 3.24H4.3z" />
  </svg>
);
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.4 5.4 0 0 1-2.4 3.58v2.84h3.86c2.26-2.09 3.56-5.17 3.56-8.66z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.84c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.45a7.2 7.2 0 0 1 0-4.62V6.74H1.29a12 12 0 0 0 0 10.8z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.74l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
    />
  </svg>
);

// Ordre logique pour une TPE/artisan FR (du plus répandu/visuel au moins
// utilisé). Google est traité à part : c'est une fiche d'établissement / avis,
// pas un fil social.
const SOCIALS = [
  {
    name: "facebook" as const,
    label: "Lien Facebook",
    placeholder: "facebook.com/ton-entreprise",
    Icon: FacebookIcon,
  },
  {
    name: "instagram" as const,
    label: "Lien Instagram",
    placeholder: "instagram.com/ton-compte",
    Icon: InstagramIcon,
  },
  {
    name: "tiktok" as const,
    label: "Lien TikTok",
    placeholder: "tiktok.com/@ton-compte",
    Icon: TiktokIcon,
  },
  {
    name: "x" as const,
    label: "Lien X (Twitter)",
    placeholder: "x.com/ton-compte",
    Icon: XIcon,
  },
];

function SocialRow({
  label,
  placeholder,
  Icon,
  name,
}: {
  label: string;
  placeholder: string;
  Icon: () => React.ReactNode;
  name: `socials.${"facebook" | "instagram" | "tiktok" | "x" | "google"}`;
}) {
  const { register } = useFormContext<LeadValues>();
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-ink-soft text-cream-muted"
        aria-hidden
      >
        <Icon />
      </span>
      <TextInput
        type="url"
        inputMode="url"
        autoCapitalize="none"
        spellCheck={false}
        aria-label={label}
        placeholder={placeholder}
        {...register(name)}
      />
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-baseline gap-2 text-sm font-medium text-cream">
        Tes réseaux &amp; ta fiche Google
        <span className="text-xs font-normal text-cream-faint">
          (facultatif)
        </span>
      </span>
      <p className="text-xs text-cream-faint">
        Déjà présent en ligne&nbsp;? Colle tes liens — on ajoute les boutons sur
        ton site et on relie tes avis Google.
      </p>
      <div className="mt-2 flex flex-col gap-2.5">
        {SOCIALS.map((s) => (
          <SocialRow
            key={s.name}
            name={`socials.${s.name}`}
            label={s.label}
            placeholder={s.placeholder}
            Icon={s.Icon}
          />
        ))}
        {/* Google mis à part : fiche d'établissement / avis, pas un fil social */}
        <div className="mt-1 border-t border-line pt-3">
          <SocialRow
            name="socials.google"
            label="Lien de ta fiche Google"
            placeholder="Ta fiche d'établissement Google (lien Maps)"
            Icon={GoogleIcon}
          />
        </div>
      </div>
    </div>
  );
}

function IdentitePreferencesStep() {
  const { control, register } = useFormContext<LeadValues>();
  const err = useErr();
  return (
    <div className="grid gap-6">
      <Field
        label="Ton logo"
        hint="Si tu n'en as pas, pas de souci : on t'en génère un."
        optional
      >
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              multiple={false}
              compact
              accept="image/*,.pdf,.svg"
              cta="Dépose ton logo"
              sub="PNG, SVG, JPG ou PDF"
            />
          )}
        />
      </Field>

      <Field
        label="Tes photos"
        hint="Lieu, devanture, réalisations, toi au travail… tout ce qui te représente. On fait le tri."
        optional
      >
        <Controller
          control={control}
          name="photos"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              cta="Glisse tes photos ici, ou clique pour parcourir"
            />
          )}
        />
      </Field>

      <SocialLinks />

      <Field
        label="Langues du site"
        hint="Le français est inclus par défaut. Ajoute d'autres langues si ta clientèle en a besoin."
        error={err("languages")}
      >
        <Controller
          control={control}
          name="languages"
          render={({ field }) => {
            const selected = field.value ?? ["fr"];
            const toggle = (v: string) => {
              if (selected.includes(v)) {
                field.onChange(selected.filter((x) => x !== v));
              } else {
                field.onChange([...selected, v]);
              }
            };
            return (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {LANGS.map((l) => {
                  const active = selected.includes(l.value);
                  const locked = l.value === "fr"; // toujours inclus
                  return (
                    <button
                      type="button"
                      key={l.value}
                      role="checkbox"
                      aria-checked={active}
                      aria-disabled={locked || undefined}
                      disabled={locked}
                      onClick={() => {
                        if (!locked) toggle(l.value);
                      }}
                      className={
                        "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 " +
                        (locked
                          ? "cursor-not-allowed border-line bg-ink-panel text-cream-faint"
                          : active
                            ? "border-ember/50 bg-ember/10 text-cream"
                            : "border-line bg-ink-soft text-cream-muted hover:border-line-strong hover:text-cream")
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://flagcdn.com/${l.flag}.svg`}
                        alt=""
                        aria-hidden
                        className={
                          "h-3.5 w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-line " +
                          (locked ? "opacity-60" : "")
                        }
                      />
                      {l.label}
                      {locked ? (
                        <Check size={14} className="text-cream-faint" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            );
          }}
        />
      </Field>

      <Field
        label="Style souhaité"
        hint="Choisis une ou plusieurs ambiances. On s'en sert comme direction — rien n'est figé."
        optional
      >
        <Controller
          control={control}
          name="styleVibes"
          render={({ field }) => {
            const selected = field.value ?? [];
            const toggle = (v: string) =>
              field.onChange(
                selected.includes(v)
                  ? selected.filter((x) => x !== v)
                  : [...selected, v],
              );
            return (
              <div className="flex flex-wrap gap-2">
                {STYLE_VIBES.map((v) => {
                  const active = selected.includes(v);
                  return (
                    <button
                      type="button"
                      key={v}
                      role="checkbox"
                      aria-checked={active}
                      onClick={() => toggle(v)}
                      className={
                        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 " +
                        (active
                          ? "border-ember/50 bg-ember/10 text-cream"
                          : "border-line bg-ink-soft text-cream-muted hover:border-line-strong hover:text-cream")
                      }
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            );
          }}
        />
      </Field>

      <Field
        label="Couleur dominante"
        hint="Une teinte qui te parle pour ton site ?"
        optional
      >
        <Controller
          control={control}
          name="colorPreference"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => {
                const active = field.value === c.value;
                return (
                  <button
                    type="button"
                    key={c.value}
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(active ? "" : c.value)}
                    className={
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 " +
                      (active
                        ? "border-ember/50 bg-ember/10 text-cream"
                        : "border-line bg-ink-soft text-cream-muted hover:border-line-strong hover:text-cream")
                    }
                  >
                    {c.swatch ? (
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                        style={{ backgroundColor: c.swatch }}
                        aria-hidden
                      />
                    ) : null}
                    {c.label}
                  </button>
                );
              })}
            </div>
          )}
        />
      </Field>

      <Field
        label="Autre précision ?"
        hint="Une idée, une marque que tu aimes, un détail à respecter…"
        htmlFor="ambiance"
        optional
      >
        <TextInput
          id="ambiance"
          placeholder="Facultatif — écris librement"
          {...register("ambiance")}
        />
      </Field>
    </div>
  );
}

/* ── Mot de la fin ──────────────────────────────────────────────────────── */

function ExtraStep() {
  const { register } = useFormContext<LeadValues>();
  return (
    <Field
      label="Quelque chose à ajouter ?"
      hint="Un service supplémentaire que tu aimerais mettre en avant, une idée pour ton site, une particularité de ton métier, une attente précise… Tout ce qui peut nous aider à faire un site qui te ressemble."
      htmlFor="extra"
      optional
    >
      <TextArea
        id="extra"
        placeholder="Écris librement — même une simple remarque nous est utile…"
        {...register("extra")}
      />
    </Field>
  );
}

/* ── Définition des étapes (avec branchement conditionnel) ──────────────── */

// Étape facultative, prepended quand aucune formule n'a été choisie en amont
// (clic sur « Créer mon site » plutôt que sur une carte de prix).
const FORMULE_STEP: StepDef = {
  id: "formule",
  title: "Ta formule",
  subtitle: "Choisis l'offre qui te convient. On pourra l'ajuster ensemble.",
  fields: ["formule"],
  autoAdvance: true,
  Component: FormuleStep,
};

const ALL_STEPS: StepDef[] = [
  {
    id: "type",
    title: "Ton activité",
    subtitle: "Première chose : que vends-tu ? On adapte la suite.",
    fields: ["activityType"],
    autoAdvance: true,
    Component: TypeStep,
  },
  {
    id: "entreprise",
    title: "Ton entreprise & contact",
    subtitle: "Qui tu es, où tu travailles, et comment te joindre.",
    fields: ["companyName", "trade", "city", "phone", "email", "serviceArea"],
    Component: EntrepriseContactStep,
  },
  {
    id: "prestations",
    title: "Prestations & prix",
    subtitle: "Ce que tu proposes. Pas besoin d'être exhaustif, on affinera.",
    fields: ["services", "taxCredit"],
    when: wantsServices,
    Component: PrestationsStep,
  },
  {
    id: "produits",
    title: "Tes produits",
    subtitle: "Ajoute ta marchandise, un produit à la fois.",
    fields: ["products"],
    when: wantsProducts,
    Component: ProduitsStep,
  },
  {
    id: "identite",
    title: "Photos & préférences",
    subtitle:
      "Logo, photos et style. Tout est facultatif — on s'adapte à ce que tu as.",
    fields: ["languages", "socials"],
    Component: IdentitePreferencesStep,
  },
  {
    id: "extra",
    title: "Le mot de la fin",
    subtitle:
      "As-tu autre chose à nous partager ? Une particularité, une envie… et c'est tout bon.",
    fields: ["extra"],
    Component: ExtraStep,
  },
];

export function buildSteps(
  activityType?: ActivityType,
  includeFormule = false,
): StepDef[] {
  const steps = ALL_STEPS.filter((s) => !s.when || s.when(activityType));
  return includeFormule ? [FORMULE_STEP, ...steps] : steps;
}
