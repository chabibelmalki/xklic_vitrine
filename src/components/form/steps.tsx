"use client";

import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
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

/* ── A. Activité ────────────────────────────────────────────────────────── */

function ActiviteStep() {
  const { register, control } = useFormContext<LeadValues>();
  const err = useErr();
  const mobile = useWatch<LeadValues>({ control, name: "mobile" });
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

/* ── B. Coordonnées ─────────────────────────────────────────────────────── */

function CoordonneesStep() {
  const { register } = useFormContext<LeadValues>();
  const err = useErr();
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Téléphone"
          hint="Ex. : « 06 12 34 56 78 »"
          htmlFor="phone"
          error={err("phone")}
        >
          <TextInput
            id="phone"
            type="tel"
            placeholder="Le numéro affiché sur le site"
            invalid={!!err("phone")}
            {...register("phone")}
          />
        </Field>
        <Field
          label="WhatsApp"
          hint="Ex. : « 06 12 34 56 78 » — laisse vide si identique au téléphone"
          htmlFor="whatsapp"
          optional
        >
          <TextInput
            id="whatsapp"
            type="tel"
            placeholder="Pour un bouton WhatsApp direct"
            {...register("whatsapp")}
          />
        </Field>
      </div>
      <Field
        label="Email"
        hint="Ex. : « contact@tonentreprise.fr ». C'est là qu'arriveront les demandes."
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
      <Field
        label="Adresse"
        hint="Ex. : « 12 rue de la République, 69002 Lyon ». Utile pour le référencement local."
        htmlFor="address"
        optional
      >
        <TextInput
          id="address"
          placeholder="Ton adresse, si tu souhaites l'afficher"
          {...register("address")}
        />
      </Field>
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
    </div>
  );
}

/* ── C. Entreprise ──────────────────────────────────────────────────────── */

function EntrepriseStep() {
  const { register, control } = useFormContext<LeadValues>();
  const err = useErr();
  return (
    <div className="grid gap-5">
      <Field
        label="Numéro SIRET"
        hint="Ex. : « 123 456 789 00012 » — les 14 chiffres de ton entreprise."
        htmlFor="siret"
        error={err("siret")}
      >
        <TextInput
          id="siret"
          inputMode="numeric"
          placeholder="14 chiffres"
          invalid={!!err("siret")}
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
            label="Je n'ai pas encore de SIRET (immatriculation en cours)"
          />
        )}
      />
    </div>
  );
}

/* ── D. Identité visuelle ───────────────────────────────────────────────── */

function IdentiteStep() {
  const { control } = useFormContext<LeadValues>();
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
        label="Photo du lieu / de la devanture"
        hint="L'extérieur de ta boutique, ton atelier, ton camion… ce qui te représente."
        optional
      >
        <Controller
          control={control}
          name="venuePhotos"
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} compact />
          )}
        />
      </Field>
      <Field
        label="Photos d'ambiance"
        hint="Quelques images qui donnent le ton : toi au travail, tes coulisses, tes clients satisfaits."
        optional
      >
        <Controller
          control={control}
          name="ambiancePhotos"
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
    </div>
  );
}

/* ── S2. Photos de services / réalisations (services / les-deux) ────────── */

function RealisationsStep() {
  const { control } = useFormContext<LeadValues>();
  return (
    <Field
      label="Photos de tes réalisations"
      hint="Avant / après, chantiers terminés, prestations réussies… La preuve par l'image rassure énormément."
      optional
    >
      <Controller
        control={control}
        name="servicePhotos"
        render={({ field }) => (
          <ImageUpload value={field.value} onChange={field.onChange} />
        )}
      />
    </Field>
  );
}

/* ── F. Langues & ambiance ──────────────────────────────────────────────── */

const LANGS = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "ar", label: "Arabe" },
  { value: "es", label: "Espagnol" },
  { value: "pt", label: "Portugais" },
  { value: "it", label: "Italien" },
];

function LanguesStep() {
  const { control, register } = useFormContext<LeadValues>();
  const err = useErr();
  return (
    <div className="grid gap-6">
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
                  return (
                    <button
                      type="button"
                      key={l.value}
                      role="checkbox"
                      aria-checked={active}
                      onClick={() => toggle(l.value)}
                      className={
                        "rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 " +
                        (active
                          ? "border-ember/50 bg-ember/10 text-cream"
                          : "border-line bg-ink-soft text-cream-muted hover:border-line-strong hover:text-cream")
                      }
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
      <Field
        label="Ambiance ou couleur souhaitée"
        hint="Ex. : « Tons chaleureux, plutôt épuré » ou « bleu confiance ». On te proposera de toute façon une direction."
        htmlFor="ambiance"
        optional
      >
        <TextInput
          id="ambiance"
          placeholder="Une préférence de style ou de couleur ?"
          {...register("ambiance")}
        />
      </Field>
    </div>
  );
}

/* ── G. Mot de la fin ───────────────────────────────────────────────────── */

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
    id: "activite",
    title: "Ton entreprise",
    subtitle: "Qui tu es et où tu travailles.",
    fields: ["companyName", "trade", "city", "mobile", "serviceArea"],
    Component: ActiviteStep,
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
    id: "coordonnees",
    title: "Tes coordonnées",
    subtitle: "Pour que tes futurs clients puissent te joindre facilement.",
    fields: ["phone", "email"],
    Component: CoordonneesStep,
  },
  {
    id: "entreprise",
    title: "Informations légales",
    subtitle: "Une formalité pour les mentions légales de ton site.",
    fields: ["siret", "noSiret"],
    Component: EntrepriseStep,
  },
  {
    id: "identite",
    title: "Identité visuelle",
    subtitle: "Logo et photos. Tout est facultatif — on s'adapte à ce que tu as.",
    fields: [],
    Component: IdentiteStep,
  },
  {
    id: "realisations",
    title: "Tes réalisations",
    subtitle: "Quelques photos de ton travail. Facultatif, mais ça change tout.",
    fields: [],
    when: wantsServices,
    Component: RealisationsStep,
  },
  {
    id: "langues",
    title: "Langues & ambiance",
    subtitle: "Tes préférences de langues et de style.",
    fields: ["languages"],
    Component: LanguesStep,
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
