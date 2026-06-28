// ─────────────────────────────────────────────────────────────────────────
// Contenu éditable du site. Tout ce qui change souvent vit ici.
// Ton : tutoiement (proche, rassurant), voix de Xklic vers l'artisan.
// ─────────────────────────────────────────────────────────────────────────

import type { FormuleSlug } from "./lead-schema";

export const brand = {
  name: "Xklic",
  tagline: "Le site pro qui te ramène des clients, en ligne en 48h.",
  email: "contact@xklic.com",
  domain: "xklic.com",
  phone: "0663948128", // numéro brut (FR)
  phoneDisplay: "06 63 94 81 28", // affichage formaté
  whatsapp: "0663948128", // numéro WhatsApp (souvent identique)
  whatsappMessage: "Bonjour Xklic, je voudrais créer mon site.",
  // Réseaux sociaux → alimente `sameAs` du JSON-LD Organization (SEO).
  // Ajoute les URLs réelles (TikTok, Instagram…) quand elles existent, ex. :
  // ["https://www.tiktok.com/@xklic", "https://www.instagram.com/xklic"]
  social: [] as string[],
};

// Informations légales — ⚠️ À COMPLÉTER avec les vraies données de l'entreprise.
export const legal = {
  company: "MINHAJ", // raison sociale (la forme « SAS » est dans `status`)
  status: "SAS", // forme juridique (Société par actions simplifiée)
  manager: "Chabib El Malki, président", // représentant légal / dir. publication
  siren: "106 303 944 · SIRET 106 303 944 00016", // SIREN · SIRET du siège
  rcs: "106 303 944 R.C.S. Pontoise", // immatriculation au RCS
  ape: "6202A — Conseil en systèmes et logiciels informatiques", // code APE/NAF
  capital: "1 000 €", // capital social
  address: "17 rue de Moscou, 95520 Osny", // siège social
  email: "contact@xklic.com",
  phone: "", // téléphone (optionnel)
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    site: "https://vercel.com",
  },
  updated: "22 juin 2026", // date de dernière mise à jour
};

// Sous-traitants / services tiers qui peuvent traiter des données personnelles
// pour notre compte. Alimente la section « Destinataires » de la politique de
// confidentialité. ⚠️ À TENIR À JOUR si on ajoute/retire un outil.
// `location` sert à signaler les transferts hors UE.
export type SubProcessor = {
  name: string;
  purpose: string;
  location: string;
  policy: string; // URL de la politique de confidentialité du prestataire
};

export const subProcessors: SubProcessor[] = [
  {
    name: "Vercel Inc.",
    purpose:
      "Hébergement du site et stockage sécurisé des fichiers que tu envoies (Vercel Blob).",
    location: "États-Unis",
    policy: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Stripe Payments Europe, Ltd.",
    purpose:
      "Traitement sécurisé des paiements en ligne. Tes données bancaires sont saisies directement chez Stripe — nous n'y avons jamais accès.",
    location: "Irlande (UE), avec transferts possibles aux États-Unis",
    policy: "https://stripe.com/fr/privacy",
  },
  {
    name: "Resend",
    purpose:
      "Envoi des emails transactionnels et des notifications liées à ta demande.",
    location: "États-Unis",
    policy: "https://resend.com/legal/privacy-policy",
  },
  {
    name: "Google (Google Ireland Ltd. / Google LLC)",
    purpose:
      "Réception et organisation des demandes (Google Sheets) et, pour les clients concernés, gestion de leur fiche Google Business Profile via l'API Google Business Profile (voir section dédiée).",
    location: "Irlande (UE), avec transferts possibles aux États-Unis",
    policy: "https://policies.google.com/privacy",
  },
  {
    name: "n8n",
    purpose:
      "Automatisation interne : acheminement de ta demande jusqu'à notre équipe.",
    location: "Union européenne",
    policy: "https://n8n.io/legal/privacy/",
  },
  {
    name: "Cloudflare, Inc.",
    purpose:
      "Protection anti-spam et anti-bot des formulaires (widget Cloudflare Turnstile) : un jeton est vérifié à l'envoi du formulaire de contact et du tunnel de commande.",
    location: "États-Unis",
    policy: "https://www.cloudflare.com/privacypolicy/",
  },
];

export const nav = [
  { label: "Métiers", href: "/metiers" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Questions", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// Secteurs accompagnés — affichés dans le bandeau de confiance.
export const trades = [
  "Ménage à domicile",
  "Plomberie",
  "Électricité",
  "Mécanique auto",
  "Serrurerie",
  "Jardinage",
  "Coiffure & beauté",
  "Maçonnerie",
  "Peinture",
  "Chauffagiste",
];

// Piliers de confiance — honnêtes (agence jeune, pas de chiffres gonflés).
export const trustPillars = [
  { value: "48h", label: "pour être en ligne" },
  { value: "Sans", label: "engagement, résiliable quand tu veux" },
  { value: "100%", label: "pensé pour le mobile" },
  { value: "🇫🇷", label: "conçu et géré en France" },
];

// Bénéfices concrets — ce que le site fait gagner au quotidien.
export const benefits = [
  {
    icon: "Search",
    title: "On te trouve sur Google",
    body: "Optimisé pour le référencement local : tu apparais quand un client cherche ton métier près de chez lui.",
  },
  {
    icon: "MessageSquare",
    title: "Les demandes arrivent chez toi",
    body: "Formulaire de contact et notifications : chaque demande tombe directement dans ta boîte, prête à rappeler.",
  },
  {
    icon: "Phone",
    title: "Bouton d'appel & WhatsApp",
    body: "Tes clients t'appellent ou t'écrivent sur WhatsApp en un seul tap, depuis leur téléphone.",
  },
  {
    icon: "ShieldCheck",
    title: "Sécurisé et sans souci",
    body: "Hébergement, HTTPS, sauvegardes et mises à jour : on gère toute la technique, ton site reste en ligne.",
  },
  {
    icon: "Smartphone",
    title: "Parfait sur mobile",
    body: "8 visiteurs sur 10 viennent du téléphone. Ton site est rapide, net et lisible sur le moindre écran.",
  },
  {
    icon: "RefreshCw",
    title: "Modifications illimitées",
    body: "Nouveau tarif, nouvelle photo, horaires d'été ? Tu nous écris, on met à jour — souvent dans la journée, sous 3 jours ouvrés au plus tard.",
  },
];

// Nos formules — 3 offres claires. Textes volontairement simples et humains
// (audience = artisans peu à l'aise avec internet) : AUCUN mot technique.
// Distinction nette « à l'installation (une seule fois) » vs « par mois ».
export type Formule = {
  slug: FormuleSlug; // identifiant stocké dans le lead + query `?formule=`
  name: string;
  phrase: string;
  setup: string; // payé une seule fois, à l'installation
  monthly: string; // par mois
  priceNote?: string; // précision sous le prix (budget pub, etc.)
  inherits?: string; // « Tout le pack précédent, et en plus : »
  features: string[];
  cta: string;
  featured?: boolean; // carte mise en avant (« Recommandé »)
};

export const formules: Formule[] = [
  {
    slug: "site",
    name: "Votre site",
    phrase: "Pour exister sur internet, simplement.",
    setup: "49€",
    monthly: "9,99€",
    features: [
      "Un beau site professionnel à votre nom",
      "Votre nom de domaine .fr offert : on l'achète et on le gère pour vous, vous n'avez rien à faire",
      "Vous apparaissez sur Google quand on vous cherche",
      "Vos clients vous trouvent et vous appellent en un clic",
      "Un QR code à montrer à vos clients pour récolter des avis",
    ],
    cta: "Je veux mon site",
  },
  {
    slug: "google",
    name: "On s'occupe de votre Google",
    phrase: "Vous travaillez, on s'occupe de votre image.",
    setup: "149€",
    monthly: "29€",
    inherits: "Tout le pack Site, et en plus :",
    features: [
      "On répond à vos avis clients pour vous",
      "On publie pour vous sur Google chaque mois",
      "On garde vos horaires et vos photos à jour",
      "Sans payer de publicité",
    ],
    cta: "Je veux la tranquillité",
  },
  {
    slug: "haut-google",
    name: "En haut de Google",
    phrase: "Soyez le premier que vos clients voient.",
    setup: "290€",
    monthly: "49€",
    priceNote:
      "Votre budget publicité, payé directement à Google — c'est vous qui choisissez le montant.",
    inherits: "Tout le pack précédent, et en plus :",
    features: [
      "Vous apparaissez tout en haut de Google, avant tout le monde",
      "Avec le badge vert « Garanti par Google » qui rassure vos clients",
      "Les clients vous appellent directement",
      "Vous ne payez Google que quand un vrai client vous contacte",
      "On installe et on gère tout à votre place",
    ],
    cta: "Je veux plus de clients",
    featured: true,
  },
];

// Portfolio — vrais sites clients. `url` → capture mobile auto (voir Portfolio).
// `image` (capture locale dans /public/portfolio/) a la priorité si renseigné.
export type Work = {
  client: string;
  trade: string;
  city: string;
  url?: string; // site live → preview par capture
  image?: string; // capture locale (prioritaire) /public/portfolio/…
  accent: string; // teinte du placeholder / fond
};

export const portfolio: Work[] = [
  {
    client: "SANAD CLEAN",
    trade: "Nettoyage & services à la personne",
    city: "Nîmes",
    url: "https://sanadclean.xklic.com",
    accent: "from-rose-500/20 to-amber-500/10",
  },
  {
    client: "Atelier Douceur",
    trade: "Pâtisserie de création",
    city: "Saint-Germain-en-Laye",
    url: "https://atelier-douceur.xklic.com",
    accent: "from-pink-500/20 to-amber-500/10",
  },
  {
    client: "Garage Méca Atlas",
    trade: "Réparation automobile",
    city: "Argenteuil",
    url: "https://meca-atlas.xklic.com",
    accent: "from-sky-500/20 to-slate-500/10",
  },
  {
    client: "Vibe Coaching",
    trade: "Coaching sportif",
    city: "Lyon",
    url: "https://vibe-coaching.xklic.com",
    accent: "from-emerald-500/20 to-lime-500/10",
  },
];

export const faq = [
  {
    q: "En combien de temps mon site est-il en ligne ?",
    a: "48h après réception de tes informations via le formulaire. Tu valides une version, on l'ajuste si besoin, puis on publie. Pas de réunions, pas de cahier des charges à rédiger.",
  },
  {
    q: "Suis-je engagé sur la durée ?",
    a: "Non. C'est sans engagement : 49€ une seule fois à la création, puis 9,99€/mois. Tu arrêtes quand tu veux, en un message.",
  },
  {
    q: "Et si je veux modifier mon site plus tard ?",
    a: "Les modifications de contenu sont illimitées et incluses dans l'abonnement. Tu nous écris ce que tu veux changer, on s'en occupe — généralement dans la journée, et au plus tard sous 3 jours ouvrés.",
  },
  {
    q: "À qui appartiennent le site et le nom de domaine ?",
    a: "Le contenu (textes, photos) est à toi. Le nom de domaine .fr est offert et géré par Xklic : on l'achète et on s'en occupe pour toi pendant toute la durée de ton abonnement, tu n'as rien à faire. Si tu arrêtes, tu peux demander à récupérer ton domaine via notre formulaire de contact (conditions détaillées dans nos CGV).",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Tu paies en ligne en toute sécurité (Stripe) à la fin du formulaire : seulement les 49€ d'installation aujourd'hui. Le premier prélèvement mensuel de 9,99€ intervient le mois suivant, et c'est sans engagement — tu arrêtes quand tu veux.",
  },
  {
    q: "Je n'ai pas encore de SIRET, c'est possible ?",
    a: "Oui. Tu peux démarrer sans SIRET et nous le transmettre plus tard. On indique simplement « en cours d'immatriculation » sur le site en attendant.",
  },
  {
    q: "Je propose des services à la personne, le crédit d'impôt est-il mis en avant ?",
    a: "Absolument. Si tu es éligible au crédit d'impôt de 50%, on l'affiche clairement sur ton site — c'est un argument décisif pour tes clients.",
  },
];

export const steps = [
  {
    n: "01",
    title: "Tu remplis le formulaire",
    body: "Quelques minutes pour décrire ton activité, tes prestations et tes coordonnées. Des exemples te guident à chaque étape.",
  },
  {
    n: "02",
    title: "On crée ton site",
    body: "Notre équipe conçoit un site pro, soigné et pensé pour ton métier. Tu n'as rien à installer ni à configurer.",
  },
  {
    n: "03",
    title: "Il est en ligne en 48h",
    body: "Ton site est publié sur ton nom de domaine .fr (offert, on s'en occupe pour toi), optimisé pour mobile et pour apparaître sur Google localement.",
  },
  {
    n: "04",
    title: "Tu reçois tes demandes clients",
    body: "Formulaire de contact, bouton d'appel et WhatsApp : les demandes arrivent directement chez toi, prêtes à transformer.",
  },
];
