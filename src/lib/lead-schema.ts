import { z } from "zod";

const required = (msg: string) => z.string().trim().min(1, msg);

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
    // 0. Formule choisie (carte de prix ou étape dédiée du formulaire)
    formule: z.enum(FORMULE_SLUGS, {
      message: "Choisis une formule pour continuer.",
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
    // Jusqu'à 2 couleurs : [0] = principale, [1] = secondaire/accent.
    // Vide = on laisse l'équipe décider. Masqué dans l'UI si un logo est fourni.
    colorPreference: z.array(z.string()).max(2, "Deux couleurs maximum.").default([]),
    ambiance: z.string().trim().optional(),

    // G. Mot de la fin (champ libre, facultatif)
    extra: z.string().trim().optional(),

    // Parcours « express » : le client réserve avec ses seules coordonnées et
    // un conseiller complète le reste (prestations, produits, identité…) par
    // téléphone. Quand il est à true, on relâche les exigences des étapes
    // sautées pour pouvoir passer au paiement immédiatement.
    assisted: z.boolean().default(false),

    // Jeton Cloudflare Turnstile (anti-robot), vérifié côté serveur.
    turnstileToken: z.string().optional(),
  });

export type LeadValues = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

// ─── Complétion post-paiement (page /merci) ─────────────────────────────────
// Le dossier « propose des prestations » — donc on lui demande une description
// de l'activité APRÈS paiement — si `type_activite` vaut services ou les-deux
// (valeur dérivée au checkout, cf. backoffice.ts). Remplace l'ancien
// `wantsServices(activityType)`, désormais basé sur la valeur stockée.
export const impliesServices = (typeActivite?: string | null) =>
  typeActivite === "services" || typeActivite === "les-deux";

// Payload accepté par POST /api/complete. Whitelist STRICTE : Zod retire toute
// clé inconnue par défaut → `statut`, `formule`, `payment`… ne peuvent JAMAIS
// passer. Tous les champs (sauf sessionId) sont optionnels : on n'écrit que ce
// qui est fourni (le back-office coalesce, les autres colonnes restent intactes).
export const completionSchema = z.object({
  sessionId: z.string().trim().min(1),
  description: z.string().trim().optional(),
  logo: z.array(uploadItemSchema).optional(),
  photos: z.array(uploadItemSchema).optional(),
  colorPreference: z.array(z.string()).max(2, "Deux couleurs maximum.").optional(),
  styleVibes: z.array(z.string()).optional(),
  ambiance: z.string().trim().optional(),
  socials: z
    .object({
      facebook: z.string().trim().optional(),
      instagram: z.string().trim().optional(),
      tiktok: z.string().trim().optional(),
      x: z.string().trim().optional(),
      google: z.string().trim().optional(),
    })
    .partial()
    .optional(),
  languages: z.array(z.string()).optional(),
  noWhatsapp: z.boolean().optional(),
  siret: z.string().trim().optional(),
});
export type CompletionValues = z.input<typeof completionSchema>;
export type CompletionData = z.output<typeof completionSchema>;
