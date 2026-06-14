import { z } from "zod";

const required = (msg: string) => z.string().trim().min(1, msg);

export const ACTIVITY_TYPES = ["services", "produits", "les-deux"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const wantsServices = (t?: ActivityType) =>
  t === "services" || t === "les-deux";
export const wantsProducts = (t?: ActivityType) =>
  t === "produits" || t === "les-deux";

// Un fichier uploadé. Deux formes transitent par ce schéma :
//   • côté client (état du formulaire) : { id, name, size, type, url, file }
//     où `url` est un objectURL d'aperçu et `file` le File brut ;
//   • côté payload envoyé au webhook (après upload Blob) : { name, url }
//     où `url` est l'URL publique Vercel Blob.
// Seul `name` est donc requis ; le reste est optionnel pour valider les deux.
export const uploadItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  size: z.number().optional(),
  type: z.string().optional(),
  url: z.string().optional(),
  file: z.any().optional(),
});
export type UploadItem = z.infer<typeof uploadItemSchema>;

const uploads = () => z.array(uploadItemSchema).default([]);

export const productSchema = z.object({
  id: z.string(),
  title: required("Donne un nom à ce produit."),
  description: z.string().trim().optional(),
  price: z.string().trim().optional(),
  category: z.string().trim().optional(),
  photos: uploads(),
});
export type ProductValues = z.input<typeof productSchema>;

export const leadSchema = z
  .object({
    // 0. Branchement
    activityType: z.enum(ACTIVITY_TYPES, {
      message: "Fais un choix pour continuer.",
    }),

    // A. Activité
    companyName: required("Indique le nom de ton entreprise."),
    trade: required("Indique ton métier."),
    city: required("Indique ta ville."),
    mobile: z.boolean().default(false),
    serviceArea: z.string().trim().optional(),

    // S1. Prestations & prix (services / les-deux) — requis conditionnellement
    services: z.string().trim().optional(),
    taxCredit: z.enum(["oui", "non", "je-ne-sais-pas"]).optional(),

    // P1. Marchandise (produits / les-deux)
    products: z.array(productSchema).default([]),

    // B. Coordonnées
    phone: required("Un numéro pour te joindre est nécessaire."),
    noWhatsapp: z.boolean().default(false), // coché = pas de WhatsApp sur le site
    email: z
      .string()
      .trim()
      .min(1, "Ton email est nécessaire.")
      .email("Cet email ne semble pas valide."),
    hasShop: z.boolean().default(false), // a un local / une boutique
    address: z.string().trim().optional(),
    availability: z.string().trim().optional(),

    // C. SIRET (facultatif — on ne le réclame pas)
    siret: z.string().trim().optional(),
    noSiret: z.boolean().default(false), // « SIRET en cours de création »

    // D. Identité visuelle (optionnel) : logo distinct + un seul bac photos
    logo: uploads(),
    photos: uploads(),

    // E. Présence en ligne — réseaux sociaux + fiche Google (tout facultatif).
    // Champs libres (lien ou pseudo) : l'équipe normalise, on ne bloque rien.
    socials: z
      .object({
        facebook: z.string().trim().optional(),
        instagram: z.string().trim().optional(),
        tiktok: z.string().trim().optional(),
        x: z.string().trim().optional(),
        google: z.string().trim().optional(),
      })
      .default({}),

    // F. Langues & style
    languages: z
      .array(z.string())
      .min(1, "Garde au moins une langue.")
      .default(["fr"]),
    styleVibes: z.array(z.string()).default([]),
    colorPreference: z.string().trim().optional(),
    ambiance: z.string().trim().optional(),

    // G. Mot de la fin (champ libre, facultatif)
    extra: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    // Zone de déplacement requise seulement si l'artisan se déplace
    if (data.mobile && !(data.serviceArea ?? "").trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["serviceArea"],
        message: "Indique ta zone de déplacement.",
      });
    }

    // Prestations requises pour les activités de service
    if (wantsServices(data.activityType)) {
      const s = (data.services ?? "").trim();
      if (s.length < 10) {
        ctx.addIssue({
          code: "custom",
          path: ["services"],
          message: s
            ? "Quelques mots de plus nous aident à bien te présenter."
            : "Décris tes prestations, même en vrac.",
        });
      }
      if (!data.taxCredit) {
        ctx.addIssue({
          code: "custom",
          path: ["taxCredit"],
          message: "Fais un choix.",
        });
      }
    }

    // Au moins un produit pour les activités qui vendent de la marchandise
    if (wantsProducts(data.activityType) && (data.products?.length ?? 0) === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["products"],
        message: "Ajoute au moins un produit pour continuer.",
      });
    }
  });

export type LeadValues = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;
