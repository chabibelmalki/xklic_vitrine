"use client";

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
  Component: () => React.ReactNode;
};

function useErr() {
  const {
    formState: { errors },
  } = useFormContext<LeadValues>();
  return (k: keyof LeadValues) => errors[k]?.message as string | undefined;
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
                  onClick={() => field.onChange(opt.value)}
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

const ALL_STEPS: StepDef[] = [
  {
    id: "type",
    title: "Ton activité",
    subtitle: "Première chose : que vends-tu ? On adapte la suite.",
    fields: ["activityType"],
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
    fields: ["languages"],
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

export function buildSteps(activityType?: ActivityType): StepDef[] {
  return ALL_STEPS.filter((s) => !s.when || s.when(activityType));
}
