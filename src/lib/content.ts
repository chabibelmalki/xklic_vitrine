// ─────────────────────────────────────────────────────────────────────────
// Contenu éditable du site. Tout ce qui change souvent vit ici.
// Ton : tutoiement (proche, rassurant), voix de Xklic vers l'artisan.
// ─────────────────────────────────────────────────────────────────────────

export const brand = {
  name: "Xklic",
  tagline: "Le site pro qui te ramène des clients, en ligne en 2h.",
  email: "contact@xklic.fr",
  domain: "xklic.com",
  phone: "0663948128", // numéro brut (FR)
  phoneDisplay: "06 63 94 81 28", // affichage formaté
  whatsapp: "0663948128", // numéro WhatsApp (souvent identique)
  whatsappMessage: "Bonjour Xklic, je voudrais créer mon site.",
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
  { label: "Tarif", href: "/#tarif" },
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
    icon: "Star",
    title: "Tes avis Google mis en avant",
    body: "On affiche tes meilleurs avis pour rassurer en un coup d'œil et donner envie de te choisir.",
  },
  {
    icon: "Smartphone",
    title: "Parfait sur mobile",
    body: "8 visiteurs sur 10 viennent du téléphone. Ton site est rapide, net et lisible sur le moindre écran.",
  },
  {
    icon: "RefreshCw",
    title: "Modifications illimitées",
    body: "Nouveau tarif, nouvelle photo, horaires d'été ? Tu nous écris, on met à jour — souvent dans la journée.",
  },
];

export const pricing = {
  setup: "49€",
  monthly: "9,90€",
  includes: [
    "Site sur-mesure, conçu pour ton métier",
    "Mise en ligne en 2h, clés en main",
    "Nom de domaine & hébergement inclus",
    "Formulaire de contact + bouton d'appel direct",
    "Optimisé mobile et référencement local Google",
    "Modifications illimitées de ton contenu",
    "Hébergement, sécurité et sauvegardes gérés",
    "Sans engagement — résiliable à tout moment",
  ],
};

// Portfolio — Souad en premier. Remplace `image` par une vraie capture
// déposée dans /public/portfolio/. Laisse `image` vide pour un placeholder.
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
    // Dépose la capture dans /public/portfolio/souad.png puis décommente :
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
    a: "2h après réception de tes informations via le formulaire. Tu valides une version, on l'ajuste si besoin, puis on publie. Pas de réunions, pas de cahier des charges à rédiger.",
  },
  {
    q: "Suis-je engagé sur la durée ?",
    a: "Non. C'est sans engagement : 49€ une seule fois à la création, puis 9,90€/mois. Tu arrêtes quand tu veux, en un message.",
  },
  {
    q: "Et si je veux modifier mon site plus tard ?",
    a: "Les modifications de contenu sont illimitées et incluses dans l'abonnement. Tu nous écris ce que tu veux changer, on s'en occupe — généralement dans la journée.",
  },
  {
    q: "À qui appartiennent le site et le nom de domaine ?",
    a: "Le contenu (textes, photos, avis) est à toi. Le nom de domaine peut être enregistré à ton nom. Si tu pars, on t'accompagne pour récupérer ton domaine.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "49€ à la création puis 9,90€/mois par prélèvement sécurisé. Le paiement en ligne arrive très bientôt ; pour l'instant on te recontacte pour finaliser après le formulaire.",
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
