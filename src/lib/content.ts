// ─────────────────────────────────────────────────────────────────────────
// Contenu éditable du site. Tout ce qui change souvent vit ici.
// Ton : tutoiement (proche, rassurant), voix de Xklic vers l'artisan.
// ─────────────────────────────────────────────────────────────────────────

import type { FormuleSlug } from "./lead-schema";

export const brand = {
  name: "Xklic",
  tagline: "Le site pro qui te ramène des clients, en ligne en 2h.",
  email: "contact@xklic.fr",
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
  company: "Xklic", // raison sociale exacte (ex. « Xklic SAS »)
  status: "—", // forme juridique (SAS, SASU, auto-entrepreneur…)
  manager: "—", // nom du/de la dirigeant·e
  siren: "—", // SIREN / SIRET
  ape: "—", // code APE/NAF
  capital: "", // capital social (si société)
  address: "—", // siège social
  email: "contact@xklic.fr",
  phone: "", // téléphone (optionnel)
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    site: "https://vercel.com",
  },
  updated: "13 juin 2026", // date de dernière mise à jour
};

export const nav = [
  { label: "Comment ça marche", href: "/#process" },
  { label: "Réalisations", href: "/#realisations" },
  { label: "Formules", href: "/#tarif" },
  { label: "Questions", href: "/#faq" },
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
  { value: "2h", label: "pour être en ligne" },
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
      "Chaque mois, on vous dit combien de personnes vous ont trouvé et appelé",
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
    a: "2h après réception de tes informations via le formulaire. Tu valides une version, on l'ajuste si besoin, puis on publie. Pas de réunions, pas de cahier des charges à rédiger.",
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
    a: "Le contenu (textes, photos) est à toi. Le nom de domaine peut être enregistré à ton nom. Si tu pars, on t'accompagne pour récupérer ton domaine.",
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
    title: "Il est en ligne en 2h",
    body: "Ton site est publié sur ton nom de domaine, optimisé pour mobile et pour apparaître sur Google localement.",
  },
  {
    n: "04",
    title: "Tu reçois tes demandes clients",
    body: "Formulaire de contact, bouton d'appel et WhatsApp : les demandes arrivent directement chez toi, prêtes à transformer.",
  },
];
