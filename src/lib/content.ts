// ─────────────────────────────────────────────────────────────────────────
// Contenu éditable du site. Tout ce qui change souvent vit ici.
// ─────────────────────────────────────────────────────────────────────────

export const brand = {
  name: "Brio",
  tagline: "Un site pro pour votre activité, en ligne en 48h.",
  email: "bonjour@brio.studio",
};

export const nav = [
  { label: "Comment ça marche", href: "/#process" },
  { label: "Réalisations", href: "/#realisations" },
  { label: "Tarif", href: "/#tarif" },
  { label: "Questions", href: "/#faq" },
];

export const pricing = {
  setup: "49€",
  monthly: "9,90€",
  includes: [
    "Site sur-mesure, conçu pour votre métier",
    "Mise en ligne en 48h, clés en main",
    "Nom de domaine & hébergement inclus",
    "Formulaire de contact + bouton d'appel direct",
    "Optimisé mobile et référencement local Google",
    "Modifications illimitées de votre contenu",
    "Hébergement, sécurité et sauvegardes gérés",
    "Sans engagement — résiliable à tout moment",
  ],
};

// Portfolio — Souad en premier. Remplacez `image` par une vraie capture
// déposée dans /public/portfolio/. Laissez `image` vide pour un placeholder.
export type Work = {
  client: string;
  trade: string;
  city: string;
  image?: string;
  accent: string; // teinte du placeholder
};

export const portfolio: Work[] = [
  {
    client: "Souad",
    trade: "Ménage & repassage à domicile",
    city: "Lyon",
    // Déposez la capture dans /public/portfolio/souad.png puis décommentez :
    // image: "/portfolio/souad.png",
    accent: "from-rose-500/20 to-amber-500/10",
  },
  {
    client: "Garage Mécaline",
    trade: "Mécanique automobile",
    city: "Villeurbanne",
    accent: "from-sky-500/20 to-emerald-500/10",
  },
  {
    client: "Élec Pro",
    trade: "Électricien certifié",
    city: "Vénissieux",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    client: "AquaFix",
    trade: "Plomberie & dépannage",
    city: "Bron",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
];

export const faq = [
  {
    q: "En combien de temps mon site est-il en ligne ?",
    a: "48h après réception de vos informations via le formulaire. Vous validez une version, on l'ajuste si besoin, puis on publie. Pas de réunions, pas de cahier des charges à rédiger.",
  },
  {
    q: "Suis-je engagé sur la durée ?",
    a: "Non. C'est sans engagement : 49€ une seule fois à la création, puis 9,90€/mois. Vous arrêtez quand vous voulez, en un message.",
  },
  {
    q: "Et si je veux modifier mon site plus tard ?",
    a: "Les modifications de contenu sont illimitées et incluses dans l'abonnement. Vous nous écrivez ce que vous voulez changer, on s'en occupe — généralement dans la journée.",
  },
  {
    q: "À qui appartiennent le site et le nom de domaine ?",
    a: "Le contenu (textes, photos, avis) est à vous. Le nom de domaine peut être enregistré à votre nom. Si vous partez, on vous accompagne pour récupérer votre domaine.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "49€ à la création puis 9,90€/mois par prélèvement sécurisé. Le paiement en ligne arrive très bientôt ; pour l'instant on vous recontacte pour finaliser après le formulaire.",
  },
  {
    q: "Je n'ai pas encore de SIRET, c'est possible ?",
    a: "Oui. Vous pouvez démarrer sans SIRET et nous le transmettre plus tard. On indique simplement « en cours d'immatriculation » sur le site en attendant.",
  },
  {
    q: "Je propose des services à la personne, le crédit d'impôt est-il mis en avant ?",
    a: "Absolument. Si vous êtes éligible au crédit d'impôt de 50%, on l'affiche clairement sur votre site — c'est un argument décisif pour vos clients.",
  },
];

export const steps = [
  {
    n: "01",
    title: "Vous remplissez le formulaire",
    body: "Quelques minutes pour décrire votre activité, vos prestations et vos coordonnées. Des exemples vous guident à chaque étape.",
  },
  {
    n: "02",
    title: "On crée votre site",
    body: "Notre équipe conçoit un site pro, soigné et pensé pour votre métier. Vous n'avez rien à installer ni à configurer.",
  },
  {
    n: "03",
    title: "Il est en ligne en 48h",
    body: "Votre site est publié sur votre nom de domaine, optimisé pour mobile et pour apparaître sur Google localement.",
  },
  {
    n: "04",
    title: "Vous recevez vos demandes clients",
    body: "Formulaire de contact, bouton d'appel et WhatsApp : les demandes arrivent directement chez vous, prêtes à transformer.",
  },
];
