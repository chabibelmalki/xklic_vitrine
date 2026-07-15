import { z } from "zod";

const required = (msg: string) => z.string().trim().min(1, msg);

// Messages de validation localisables. `m(key)` : défauts FR côté serveur
// (/api/checkout), traductions côté client (namespace `demarrer.errors`).
export type LeadMessages = (key: string) => string;

const FR_LEAD_MESSAGES: Record<string, string> = {
  productTitle: "Donne un nom à ce produit.",
  formule: "Choisis une formule pour continuer.",
  companyName: "Indique le nom de ton entreprise.",
  trade: "Indique ton métier.",
  city: "Indique ta ville.",
  country: "Indique ton pays.",
  phone: "Un numéro pour te joindre est nécessaire.",
  emailRequired: "Ton email est nécessaire.",
  emailInvalid: "Cet email ne semble pas valide.",
  colorMax: "Deux couleurs maximum.",
};

// Formules proposées (cf. `formules` dans content.ts). Le slug est la valeur
// stockée dans le lead et passée en query `?formule=` depuis les cartes de prix.
export const FORMULE_SLUGS = ["site", "google", "haut-google"] as const;
export type FormuleSlug = (typeof FORMULE_SLUGS)[number];

// Paliers de l'option boutique e-commerce (facultative — absente = pas de
// boutique). Source de vérité unique du type, comme FORMULE_SLUGS ; `stripe.ts`
// l'importe pour shopPriceFor().
export const BOUTIQUE_TIERS = ["starter", "pro", "business"] as const;
export type BoutiqueTier = (typeof BOUTIQUE_TIERS)[number];

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

const makeProductSchema = (m: LeadMessages) =>
  z.object({
    id: z.string(),
    title: required(m("productTitle")),
    description: z.string().trim().optional(),
    price: z.string().trim().optional(),
    category: z.string().trim().optional(),
    photos: uploads(),
  });

export const productSchema = makeProductSchema((k) => FR_LEAD_MESSAGES[k]);
export type ProductValues = z.input<typeof productSchema>;

// Fabrique le schéma du tunnel avec messages localisés. Défaut = FR (serveur).
export function makeLeadSchema(m: LeadMessages = (k) => FR_LEAD_MESSAGES[k]) {
  return z
  .object({
    // 0. Formule choisie (carte de prix ou étape dédiée du formulaire)
    formule: z.enum(FORMULE_SLUGS, {
      message: m("formule"),
    }),

    // 0bis. Option boutique e-commerce (facultative). undefined = pas de
    // boutique ; sinon palier choisi → 2e item mensuel sur le même abonnement
    // Stripe que le socle. Persisté en base à null quand absent (cf. backoffice).
    boutiqueTier: z.enum(BOUTIQUE_TIERS).optional(),

    // 0ter. « Je propose aussi des prestations (pas seulement de la vente) ».
    // Coché par défaut. Surtout pertinent quand une boutique est choisie. Sert
    // à dériver `type_activite` (back-office) et à décider si la description de
    // l'activité est demandée après paiement (page de complétion).
    wantsServices: z.boolean().default(true),

    // A. Activité
    companyName: required(m("companyName")),
    trade: required(m("trade")),
    city: required(m("city")),
    // Pays (multi-pays) : nom lisible (cf. src/data/countries.ts), pré-rempli
    // via l'IP côté serveur. A un défaut → toujours renseigné. Sert notamment à
    // adapter le libellé du numéro d'immatriculation (« SIRET » en France).
    country: z.string().trim().min(1, m("country")).default("France"),
    mobile: z.boolean().default(false),
    serviceArea: z.string().trim().optional(),

    // S1. Prestations & prix (services / les-deux) — requis conditionnellement
    services: z.string().trim().optional(),

    // P1. Marchandise (produits / les-deux)
    products: z.array(makeProductSchema(m)).default([]),

    // B. Coordonnées
    phone: required(m("phone")),
    // WhatsApp : case cochée (défaut) = joignable sur WhatsApp → `whatsappPhone`
    // porte le numéro affiché sur le site (pré-rempli avec `phone`, éditable).
    // Décochée → pas de WhatsApp (numéro ignoré). Le back-office ne stocke que le
    // NUMÉRO (`tel_whatsapp`, "" = pas de WhatsApp), plus de booléen.
    whatsapp: z.boolean().default(true),
    whatsappPhone: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .min(1, m("emailRequired"))
      .email(m("emailInvalid")),
    hasShop: z.boolean().default(false), // a un local / une boutique
    address: z.string().trim().optional(),
    availability: z.string().trim().optional(),

    // C. Numéro d'immatriculation de l'entreprise (facultatif, multi-pays).
    //    Le champ reste nommé `siret` (colonne back-office) mais accueille tout
    //    identifiant national : SIRET en France, n° d'entreprise/TVA ailleurs.
    //    Facultatif → pas d'indicateur « en cours de création », le vide suffit.
    siret: z.string().trim().optional(),

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

    // F. Langues — texte libre (« Français, anglais, espagnol »), séparé par des
    //    virgules. Le back-office l'éclate en tableau `langues`.
    languages: z.string().trim().optional(),
    // Jusqu'à 2 couleurs : [0] = principale, [1] = secondaire/accent.
    // Vide = on laisse l'équipe décider. Masqué dans l'UI si un logo est fourni.
    colorPreference: z.array(z.string()).max(2, m("colorMax")).default([]),
    ambiance: z.string().trim().optional(),

    // G. Mot de la fin (champ libre, facultatif)
    extra: z.string().trim().optional(),

    // Jeton Cloudflare Turnstile (anti-robot), vérifié côté serveur.
    turnstileToken: z.string().optional(),
  });
}

// Schéma par défaut (messages FR) — utilisé côté serveur (/api/checkout).
export const leadSchema = makeLeadSchema();

export type LeadValues = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;
