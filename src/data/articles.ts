// ─────────────────────────────────────────────────────────────────────────
// Articles du blog Xklic — longue traîne SEO, vraie valeur éditoriale.
// Ton : tutoiement, chaleureux, honnête (agence jeune, pas de chiffres gonflés).
// Pas de MDX : le corps est un tableau de blocs typés, rendus côté serveur.
// Dates codées en dur (2026) — ne JAMAIS appeler Date.now()/new Date() ici.
// ─────────────────────────────────────────────────────────────────────────

/** Lien interne contextuel à l'intérieur d'un paragraphe. */
export type InlineLink = { href: string; label: string };

/** Bloc de corps d'article — structure simple, sûre côté serveur. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  // Bloc d'appel à un lien interne (métier / zone / démarrer).
  | { type: "links"; title?: string; links: InlineLink[] };

export type Article = {
  /** identifiant d'URL → /blog/[slug] */
  slug: string;
  /** titre (h1) */
  title: string;
  /** meta description (~150–160 caractères) */
  description: string;
  /** accroche affichée sur la carte de l'index */
  excerpt: string;
  /** date de publication ISO — codée en dur (2026) */
  date: string;
  /** temps de lecture estimé (minutes) */
  readingMinutes: number;
  /** étiquettes / thèmes */
  tags: string[];
  /** slugs des métiers connexes (maillage interne /metiers/*) */
  relatedMetiers: string[];
  /** slugs des zones connexes (maillage interne /zones/*) */
  relatedVilles: string[];
  /** corps de l'article — blocs typés */
  body: Block[];
};

export const articles: Article[] = [
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "combien-coute-un-site-internet-artisan-2026",
    title: "Combien coûte un site internet pour un artisan en 2026 ?",
    description:
      "Le vrai prix d'un site internet d'artisan en 2026 : agence, freelance, abonnement, création soi-même. Les fourchettes, les pièges, et comment ne pas surpayer.",
    excerpt:
      "Devis à 3 000 €, abonnements à 9,99 €, sites « gratuits » qui coûtent cher en temps… On démêle le vrai prix d'un site d'artisan, sans langue de bois.",
    date: "2026-02-12",
    readingMinutes: 7,
    tags: ["Prix & budget", "Conseils"],
    relatedMetiers: ["plomberie", "electricite", "menage"],
    relatedVilles: ["argenteuil", "cergy"],
    body: [
      {
        type: "p",
        text: "C'est sûrement la première question que tu te poses, et c'est normal : tu veux un site pour trouver des clients, pas un gouffre financier. Le problème, c'est que selon à qui tu demandes, on te répond 200 € ou 5 000 €. Les deux peuvent être justes. Tout dépend de ce que tu paies réellement. Dans cet article, on pose les vraies fourchettes de 2026, ce qui fait grimper la facture, et comment éviter de payer pour des choses dont tu n'as pas besoin.",
      },
      { type: "h2", text: "Les quatre façons de se faire un site (et leur prix réel)" },
      {
        type: "p",
        text: "Il n'existe pas un prix unique, mais quatre grandes options, chacune avec sa logique. Voici à quoi t'attendre concrètement quand tu es artisan ou indépendant.",
      },
      {
        type: "ul",
        items: [
          "Le faire toi-même (Wix, WordPress…) : 0 à 300 €/an. Apparemment gratuit, mais tu paies en heures. Compte une à deux semaines de soirées pour un résultat correct, et le risque d'un site qui « fait amateur » si tu n'es pas du métier.",
          "Un freelance : 800 à 2 500 € pour un site vitrine. Bon rapport qualité-prix si tu tombes sur quelqu'un de sérieux. Le délai va de quelques semaines à quelques mois, et les modifications futures sont souvent facturées à part.",
          "Une agence classique : 2 500 à 6 000 €, parfois bien plus. Tu paies le sur-mesure, les réunions, le cahier des charges. Excellent pour une grosse structure, surdimensionné pour un artisan qui veut juste être trouvé.",
          "Un service par abonnement (comme Xklic) : un petit montant à la création puis un forfait mensuel. Le site, l'hébergement, les mises à jour et le référencement local sont inclus, sans gros budget de départ.",
        ],
      },
      {
        type: "quote",
        text: "Un site n'est pas un coût qui s'arrête le jour de la mise en ligne. La vraie question, c'est : combien va-t-il me coûter sur trois ans, modifications et hébergement compris ?",
      },
      { type: "h2", text: "Ce qui fait vraiment grimper la facture" },
      {
        type: "p",
        text: "Quand un devis dépasse les 3 000 €, ce n'est pas le « site » qui coûte cher, ce sont les options. Avant de signer, demande-toi si tu as réellement besoin de tout ça, surtout au démarrage.",
      },
      {
        type: "ul",
        items: [
          "Le design 100 % sur-mesure : magnifique, mais un modèle pro bien adapté fait largement le travail pour un artisan.",
          "Les fonctionnalités lourdes : réservation en ligne, espace client, paiement… inutiles si tes clients t'appellent ou t'écrivent.",
          "Les réunions et allers-retours : chaque rendez-vous se paie. Un process simple par formulaire évite cette inflation.",
          "La maintenance facturée à l'heure : c'est souvent là que la note explose après coup, à chaque changement d'horaire ou de tarif.",
        ],
      },
      { type: "h2", text: "De quoi un artisan a vraiment besoin" },
      {
        type: "p",
        text: "Pour un plombier, un électricien ou une professionnelle du ménage, l'objectif d'un site est simple : qu'un client de ton secteur te trouve sur Google, comprenne en dix secondes ce que tu fais, et te contacte. Pour ça, tu n'as besoin que de l'essentiel : tes prestations, ta zone d'intervention, des photos de ton travail, des avis, et un bouton d'appel bien visible. Le reste est du confort.",
      },
      {
        type: "p",
        text: "C'est exactement la logique qu'on défend chez Xklic : 49 € à la création puis 9,99 €/mois, hébergement et modifications de contenu inclus, sans engagement. On préfère un site honnête qui rapporte des appels qu'une vitrine luxueuse qui dort. Si tu veux voir à quoi ça ressemble pour ton métier, jette un œil aux pages dédiées.",
      },
      {
        type: "links",
        title: "Voir le détail par métier",
        links: [
          { href: "/metiers/plomberie", label: "Site internet pour plombier" },
          { href: "/metiers/electricite", label: "Site internet pour électricien" },
          { href: "/metiers/menage", label: "Site pour le ménage à domicile" },
        ],
      },
      { type: "h2", text: "Alors, ton budget en 2026 ?" },
      {
        type: "p",
        text: "Si tu pars de zéro et que tu veux surtout des appels, vise le moins cher possible à l'installation et un forfait mensuel qui inclut tout. Tu testes, tu vois si les demandes arrivent, et tu montes en gamme plus tard si ça vaut le coup. Tu n'es pas obligé de signer un devis à quatre chiffres pour exister sur internet. Le bon budget, c'est celui qui te ramène plus de clients qu'il ne te coûte — et ça commence souvent très bas.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "etre-visible-sur-google-quand-on-est-artisan",
    title: "Comment être visible sur Google quand on est artisan (sans agence hors de prix)",
    description:
      "Apparaître sur Google quand on est artisan : fiche Google, mots-clés locaux, avis, site optimisé. Les bons réflexes concrets, sans budget pub démesuré.",
    excerpt:
      "Tu veux que les clients te trouvent quand ils tapent « plombier près de chez moi » ? Voici les leviers qui marchent vraiment, expliqués simplement.",
    date: "2026-03-04",
    readingMinutes: 8,
    tags: ["Référencement", "Google"],
    relatedMetiers: ["serrurerie", "plomberie", "electricite"],
    relatedVilles: ["sarcelles", "nanterre"],
    body: [
      {
        type: "p",
        text: "Aujourd'hui, quand quelqu'un a une fuite, un volet bloqué ou un grand ménage à faire avant un état des lieux, il ne feuillette plus l'annuaire : il sort son téléphone et tape « plombier près de chez moi ». Si tu n'apparais pas dans ces premiers résultats, tu n'existes pas pour ce client. La bonne nouvelle, c'est qu'être visible sur Google ne demande ni budget énorme ni diplôme en informatique. Ça demande surtout de la méthode et de la régularité. Voici les leviers qui comptent, du plus rentable au plus accessoire.",
      },
      { type: "h2", text: "1. Ta fiche Google : le point de départ, et c'est gratuit" },
      {
        type: "p",
        text: "Avant même un site, crée ta fiche d'établissement Google (l'ancien « Google My Business »). C'est elle qui te fait apparaître dans la carte avec les avis quand on cherche ton métier dans ta ville. Remplis-la à fond : nom exact, catégorie précise, horaires, zone d'intervention, photos de chantiers, numéro de téléphone. Une fiche complète est prise au sérieux par Google et inspire confiance à celui qui la lit. C'est le geste le plus rentable de toute ta présence en ligne, et il ne coûte rien.",
      },
      { type: "h2", text: "2. Les avis clients : ton meilleur vendeur" },
      {
        type: "p",
        text: "Entre deux artisans, le client choisit presque toujours celui qui a le plus d'avis récents et positifs. Les avis pèsent à la fois sur ta position dans Google et sur la décision finale. Le secret n'est pas compliqué : demande systématiquement. À la fin d'une intervention réussie, propose un petit lien ou un QR code à scanner. La plupart des clients satisfaits acceptent volontiers, mais n'y pensent pas tout seuls.",
      },
      {
        type: "quote",
        text: "Dix avis sincères et récents valent mieux que cent promesses sur une page. C'est ce que tes futurs clients lisent en premier.",
      },
      { type: "h2", text: "3. Un site qui parle ta langue (et celle de Google)" },
      {
        type: "p",
        text: "Ta fiche te rend visible, mais ton site te crédibilise et te fait remonter sur des recherches plus précises. Pour ça, il doit être pensé pour le référencement local : ton métier et ta zone doivent apparaître clairement dans les textes, les titres et l'adresse des pages. Quelqu'un qui cherche « électricien à Nanterre » doit tomber sur une page qui parle exactement de ça, pas d'une page d'accueil générique.",
      },
      {
        type: "ul",
        items: [
          "Une page claire par prestation principale (dépannage, installation, rénovation…).",
          "Le nom de ta ville et de tes communes voisines écrit noir sur blanc dans le contenu.",
          "Un site rapide et lisible sur mobile : la grande majorité des recherches locales se font au téléphone.",
          "Un bouton d'appel et un formulaire visibles dès le premier écran.",
        ],
      },
      {
        type: "p",
        text: "C'est précisément ce qu'on construit chez Xklic : des sites organisés métier par métier et ville par ville, pour que Google comprenne exactement qui tu es et où tu interviens.",
      },
      {
        type: "links",
        title: "Des pages pensées pour ton métier",
        links: [
          { href: "/metiers/serrurerie", label: "Site internet pour serrurier" },
          { href: "/metiers/plomberie", label: "Site internet pour plombier" },
          { href: "/creer-site-serrurier", label: "Créer ton site de serrurier" },
        ],
      },
      { type: "h2", text: "4. La publicité Google : utile, mais pas indispensable" },
      {
        type: "p",
        text: "Les annonces payantes (Google Ads) placent ton numéro tout en haut, immédiatement. C'est efficace pour démarrer fort ou pour les métiers d'urgence comme la serrurerie. Mais ce n'est pas une obligation, et ça ne remplace jamais une bonne fiche et un bon site. Vois la pub comme un accélérateur, pas comme une fondation. Commence par le gratuit et le solide ; tu ajouteras de la pub plus tard si tu veux pousser.",
      },
      { type: "h2", text: "Par où commencer concrètement" },
      {
        type: "p",
        text: "Si tu ne dois faire qu'une chose cette semaine : crée ou complète ta fiche Google et demande trois avis à tes derniers clients contents. Si tu veux passer à la vitesse supérieure, ajoute un site bien référencé localement qui transforme les visiteurs en appels. Tu n'as pas besoin d'une grosse agence pour ça — juste des bases bien posées et un peu de constance.",
      },
      {
        type: "links",
        links: [{ href: "/demarrer", label: "Créer mon site et être trouvé sur Google" }],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "site-internet-ou-fiche-google-que-choisir",
    title: "Site internet ou fiche Google : que choisir pour trouver des clients ?",
    description:
      "Fiche Google ou site internet pour un artisan ? On compare les deux honnêtement : à quoi sert chacun, lequel commencer, et pourquoi ils marchent mieux ensemble.",
    excerpt:
      "Beaucoup d'artisans hésitent : faut-il un site, ou la fiche Google suffit-elle ? Réponse honnête, sans pousser à dépenser pour rien.",
    date: "2026-03-26",
    readingMinutes: 6,
    tags: ["Référencement", "Google", "Conseils"],
    relatedMetiers: ["mecanique-auto", "coiffure-beaute", "menage"],
    relatedVilles: ["cergy", "versailles"],
    body: [
      {
        type: "p",
        text: "« J'ai déjà ma fiche Google, est-ce que j'ai vraiment besoin d'un site ? » C'est une question qu'on nous pose souvent, et on va y répondre franchement, même si on vend des sites. Parce que la vérité, c'est que la fiche Google et le site ne font pas le même travail. L'un ne remplace pas l'autre. Voyons à quoi sert chacun, pour que tu choisisses en connaissance de cause.",
      },
      { type: "h2", text: "Ce que fait ta fiche Google" },
      {
        type: "p",
        text: "Ta fiche Google, c'est ta vitrine sur la carte. Elle affiche ton nom, tes horaires, ton numéro et tes avis quand quelqu'un cherche ton métier près de chez lui. Elle est gratuite, rapide à créer, et c'est souvent le premier contact entre toi et un client. Pour un dépannage ou une recherche express, elle suffit parfois à décrocher l'appel.",
      },
      {
        type: "ul",
        items: [
          "Avantages : gratuite, visible sur la carte, parfaite pour les avis et les appels immédiats.",
          "Limites : tu ne maîtrises pas la présentation, l'espace est restreint, et tu ne peux pas vraiment raconter ton métier ni te démarquer de tes concurrents.",
        ],
      },
      { type: "h2", text: "Ce que fait ton site internet" },
      {
        type: "p",
        text: "Ton site, c'est ta maison à toi, là où tu maîtrises tout. Tu y détailles tes prestations, tu montres tes réalisations en photo, tu affiches tes tarifs si tu veux, tu rassures avec ton parcours et tes garanties. C'est aussi lui qui te fait remonter sur des recherches précises et qui te crédibilise face à un client qui hésite entre toi et un autre. Quand quelqu'un compare deux artisans, c'est souvent le site qui fait pencher la balance.",
      },
      {
        type: "quote",
        text: "La fiche Google amène le client jusqu'à ta porte. Le site le convainc d'entrer.",
      },
      {
        type: "ul",
        items: [
          "Avantages : tu maîtrises tout, tu détailles tes prestations, tu te démarques et tu apparais sur des recherches précises.",
          "Limites : il demande un petit budget et un peu d'entretien — d'où l'intérêt d'une formule qui inclut hébergement et mises à jour.",
        ],
      },
      { type: "h2", text: "Le piège du « l'un OU l'autre »" },
      {
        type: "p",
        text: "Opposer les deux est une erreur. Ils se renforcent. Une fiche Google reliée à un vrai site inspire bien plus confiance qu'une fiche seule. Et un site sans fiche Google passe à côté de toutes les recherches locales sur la carte. Le bon réflexe n'est pas de choisir, mais de les faire travailler ensemble : la fiche pour la visibilité immédiate, le site pour la confiance et le détail.",
      },
      { type: "h2", text: "Par lequel commencer ?" },
      {
        type: "p",
        text: "Si tu n'as ni l'un ni l'autre, commence par la fiche Google : c'est gratuit et immédiat. Mais ne t'arrête pas là. Dès que tu peux, ajoute un site simple et bien fait, surtout si tu es dans un métier où le client compare et réfléchit avant d'appeler — mécanique, coiffure, ménage à domicile. Plus la décision est réfléchie, plus le site compte.",
      },
      {
        type: "p",
        text: "Une astuce simple pour décider : observe comment tes clients te contactent. S'ils appellent dans la minute pour une urgence, la fiche fait déjà beaucoup. S'ils demandent un devis, regardent tes tarifs, comparent plusieurs pros avant de se décider, alors un site bien fait te fera clairement gagner des chantiers. Dans tous les cas, garde en tête que les deux outils se nourrissent l'un l'autre : ton site renforce ta fiche, et ta fiche envoie du trafic vers ton site.",
      },
      {
        type: "links",
        title: "Exemples par métier",
        links: [
          { href: "/metiers/mecanique-auto", label: "Site pour garage / mécanique auto" },
          { href: "/metiers/coiffure-beaute", label: "Site pour coiffure & beauté" },
          { href: "/metiers/menage", label: "Site pour le ménage à domicile" },
        ],
      },
      {
        type: "p",
        text: "Chez Xklic, on conçoit des sites qui se branchent naturellement à ta fiche Google et qui sont optimisés pour le référencement local. Pas pour remplacer ta fiche, mais pour la prolonger et transformer plus de visiteurs en clients.",
      },
      {
        type: "links",
        links: [{ href: "/demarrer", label: "Compléter ma présence avec un vrai site" }],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "site-vitrine-plombier-electricien-ce-quil-faut-vraiment",
    title: "Site vitrine pour plombier ou électricien : ce qu'il faut vraiment",
    description:
      "Le site vitrine idéal pour un plombier ou un électricien : les pages utiles, ce qui rassure, ce qui déclenche l'appel. Un guide concret, sans superflu.",
    excerpt:
      "Pas besoin d'un site compliqué pour décrocher des chantiers. Voici ce qui compte vraiment sur le site d'un plombier ou d'un électricien.",
    date: "2026-04-15",
    readingMinutes: 7,
    tags: ["Conseils", "Métiers du bâtiment"],
    relatedMetiers: ["plomberie", "electricite", "serrurerie"],
    relatedVilles: ["argenteuil", "franconville", "ermont"],
    body: [
      {
        type: "p",
        text: "Plombier ou électricien, ton métier repose sur la confiance et la réactivité. Quand un client cherche quelqu'un, il a souvent un problème à régler vite, et il veut être sûr de tomber sur un pro sérieux. Ton site doit répondre à ces deux besoins en quelques secondes. Inutile de viser le site spectaculaire : ce qui compte, c'est qu'il rassure et qu'il déclenche l'appel. Voici, concrètement, ce qu'il faut — et ce dont tu peux te passer.",
      },
      { type: "h2", text: "Les pages qui servent vraiment" },
      {
        type: "p",
        text: "Un bon site de métier du bâtiment tient sur quelques pages bien faites. Pas besoin d'en empiler dix : chacune doit avoir un rôle clair.",
      },
      {
        type: "ul",
        items: [
          "L'accueil : qui tu es, ce que tu fais, ta zone d'intervention, et un gros bouton d'appel dès le premier écran.",
          "Les prestations : dépannage, installation, rénovation, mise aux normes… détaillées simplement, avec les mots que tes clients tapent.",
          "Les réalisations : des photos avant/après de chantiers réels. Rien ne rassure autant qu'un travail bien fini que l'on voit.",
          "Le contact : téléphone, WhatsApp, formulaire, et une mention claire de ta réactivité (« je rappelle dans l'heure »).",
        ],
      },
      { type: "h2", text: "Ce qui rassure un client qui hésite" },
      {
        type: "p",
        text: "Avant d'appeler un artisan qu'il ne connaît pas, le client cherche des signes de sérieux. Ton site doit les afficher sans qu'il ait à chercher. Quelques éléments font toute la différence et coûtent zéro à mettre en avant.",
      },
      {
        type: "ul",
        items: [
          "Tes avis clients, bien visibles.",
          "Ta zone d'intervention précise, avec les villes que tu couvres.",
          "Tes garanties et assurances (décennale, devis gratuit, intervention rapide).",
          "Des vraies photos de toi et de ton travail, plutôt que des images génériques.",
        ],
      },
      {
        type: "quote",
        text: "Un client n'appelle pas le site le plus beau. Il appelle celui qui lui donne l'impression qu'il ne se trompera pas.",
      },
      { type: "h2", text: "Ce qui déclenche l'appel" },
      {
        type: "p",
        text: "Tout ton site doit pousser vers une seule action : te contacter. Ça veut dire un numéro cliquable partout, un bouton WhatsApp pour ceux qui préfèrent écrire, et un formulaire ultra court. Sur mobile, le client doit pouvoir t'appeler en un seul tap, sans zoomer ni chercher. Chaque clic en trop, c'est un appel perdu. Pour un métier d'urgence comme le dépannage ou la serrurerie, cette rapidité de contact fait toute la différence.",
      },
      { type: "h2", text: "Ce dont tu peux te passer (pour l'instant)" },
      {
        type: "p",
        text: "On voit trop de plombiers et d'électriciens payer pour des fonctions qu'ils n'utiliseront jamais : prise de rendez-vous en ligne complexe, blog mis à jour tous les jours, animations partout. Au démarrage, garde les choses simples. Un site clair, rapide, honnête et bien référencé localement rapporte plus qu'une usine à gaz. Tu pourras toujours enrichir plus tard, une fois que les appels rentrent.",
      },
      {
        type: "p",
        text: "Pense aussi au référencement local dès le départ : indique précisément les villes que tu couvres et le détail de tes prestations. Quelqu'un qui cherche « électricien à Franconville » ou « plombier urgent à Ermont » doit trouver une page qui parle exactement de sa situation. C'est ce maillage entre ton métier et ta zone qui te place devant des concurrents pourtant installés depuis plus longtemps. Et c'est entièrement à ta portée, sans budget pub démesuré.",
      },
      {
        type: "links",
        title: "Pour ton métier",
        links: [
          { href: "/metiers/plomberie", label: "Site internet pour plombier" },
          { href: "/metiers/electricite", label: "Site internet pour électricien" },
          { href: "/creer-site-plombier", label: "Créer ton site de plombier" },
        ],
      },
      {
        type: "p",
        text: "C'est exactement la philosophie de Xklic : un site vitrine pro, pensé pour ton métier et ta ville, en ligne en 48h, qui va droit au but — décrocher des appels. 49 € à la création puis 9,99 €/mois, sans engagement.",
      },
      {
        type: "links",
        links: [{ href: "/demarrer", label: "Créer mon site de plombier ou d'électricien" }],
      },
    ],
  },
];

/** Retourne l'article correspondant au slug, ou undefined si introuvable. */
export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
