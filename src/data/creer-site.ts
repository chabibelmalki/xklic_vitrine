// ─────────────────────────────────────────────────────────────────────────
// Pages « Créer le site de [métier] » — le NOUVEAU cœur SEO.
//
// Pourquoi : nos acheteurs sont les artisans/TPE qui veulent un site, pas les
// clients finaux. Ils tapent « créer site plombier », « site femme de ménage »…
// Ces pages ciblent CETTE intention (≠ « plombier Argenteuil », qui attire le
// client final). Contenu rédigé à la main, orienté artisan, unique par métier.
//
// URL : /creer-site-[noun] (segment unique). `metierSlug` relie à /metiers/[x].
// ─────────────────────────────────────────────────────────────────────────

/** Un frein d'achat du petit pro (persona-acheteur) + la réponse qui le lève. */
export interface Objection {
  frein: string;
  reponse: string;
}

/** Une preuve : un site réel du secteur (lien-live) ou une maquette « exemple ». */
export interface ProofItem {
  /** nom affiché (entreprise réelle, ou nom de démo pour une maquette). */
  nom: string;
  /** ville / accroche secondaire. */
  ville?: string;
  /** site live → lien cliquable. Absent si maquette sans démo en ligne. */
  url?: string;
  /** capture d'écran optimisée dans /public (next/image). */
  image?: string;
  /** badge « Fiche Google » (preuve E-E-A-T) — jamais de note chiffrée. */
  googleAvis?: boolean;
  /** true = maquette de démonstration, étiquetée « exemple », jamais un client. */
  exemple?: boolean;
}

export interface CreerSite {
  /** segment d'URL = nom du dossier de route, ex. "creer-site-plombier". */
  urlSlug: string;
  /** slug du métier correspondant dans data/metiers.ts (maillage). */
  metierSlug: string;
  /** libellé court du métier pour le fil d'ariane / eyebrow. */
  metierLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  /** H1 — contient l'intention « créer site [métier] ». */
  h1: string;
  /** sous-titre du hero. */
  lead: string;
  /** paragraphe d'intro éditoriale. */
  intro: string;
  /** sections h2 + paragraphe (corps unique, orienté artisan). */
  sections: { h2: string; p: string }[];
  /** « Ce que Xklic met sur TON site » — points concrets par métier. */
  bullets: string[];
  /** FAQ propre au métier (créer un site), différente de metier.faq. */
  faq: { q: string; a: string }[];
  /** NOUVEAU — 2-3 freins/peurs du persona-acheteur + réponse qui les lève. */
  objections?: Objection[];
  /** NOUVEAU — preuve : sites réels du secteur (liens-live) ou maquettes « exemple ». */
  proof?: { intro: string; items: ProofItem[] };
}

export const creerSitePages: CreerSite[] = [
  {
    urlSlug: "creer-site-plombier",
    metierSlug: "plomberie",
    metierLabel: "Plomberie",
    metaTitle: "Créer un site de plombier : pro, en ligne en 48h",
    metaDescription:
      "Tu es plombier ou chauffagiste ? Crée ton site internet pro avec Xklic : urgences, devis, appel en un tap. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet plombier",
      "création site internet plombier",
      "site internet plombier pas cher",
      "site vitrine plombier",
      "créer un site internet chauffagiste",
    ],
    eyebrow: "Créer ton site · Plomberie",
    h1: "Créer le site internet d'un plombier",
    lead: "Une fuite n'attend pas. Ton futur client tape « plombier » sur son téléphone, panique, et appelle les deux premiers résultats sérieux. Si tu n'y es pas, c'est ton voisin qu'on appelle.",
    intro:
      "Xklic te crée un site de plombier pensé pour ce moment précis : être trouvé sur Google quand quelqu'un a de l'eau partout près de chez toi, le rassurer en trois secondes et déclencher l'appel. Pas de jargon, pas de cahier des charges interminable — un site pro, en ligne en 48h, à un prix d'artisan.",
    sections: [
      {
        h2: "Pourquoi un plombier a besoin d'un site",
        p: "La plomberie vit de l'urgence et de la confiance. Fuite, chauffe-eau mort, WC bouché : le client tape « plombier » + sa ville et appelle les premiers résultats crédibles. Sans site, tu es invisible pour tous ceux qui ne te connaissent pas encore — c'est-à-dire la majorité de la demande. Un site te rend joignable, montre ton sérieux et tes avis, et transforme une recherche pressée en intervention payée.",
      },
      {
        h2: "Ce que Xklic met sur ton site de plombier",
        p: "On construit un site clair qui parle ton métier : tes prestations (dépannage, recherche de fuite, installation sanitaire, chauffe-eau, chauffage), ta zone d'intervention, un bouton d'appel et WhatsApp toujours sous le pouce, un formulaire de devis et de quoi récolter des avis. Le tout optimisé pour le référencement local et ultra-rapide sur mobile — parce que c'est là, et seulement là, que tes clients te cherchent.",
      },
      {
        h2: "Capter l'urgence, à toute heure",
        p: "Ce qui te distingue d'un concurrent, c'est ta réactivité — encore faut-il qu'on puisse t'atteindre. Ton site affiche en haut « Dépannage rapide » et tes plages de disponibilité (soir, week-end, jours fériés si tu les fais), avec un bouton qui lance l'appel d'un seul tap, sans formulaire à remplir. Le client coincé n'hésite pas : il voit que tu interviens vite, il appuie, ça sonne chez toi. Ce demi-second gagné sur le concurrent, c'est l'intervention dans ta poche.",
      },
    ],
    bullets: [
      "Bouton d'appel + WhatsApp en un tap, visibles sur chaque écran",
      "Mise en avant des urgences et du dépannage rapide",
      "Tes prestations et ta zone d'intervention présentées clairement",
      "Formulaire de devis qui tombe direct dans ta boîte",
      "QR code pour récolter des avis clients après chaque chantier",
      "Optimisé Google local pour « plombier + ta ville »",
    ],
    objections: [
      {
        frein: "Je n'y connais rien en informatique.",
        reponse:
          "C'est justement notre boulot, pas le tien. Tu remplis un formulaire guidé (tes prestations, ta zone, tes coordonnées), on s'occupe de tout le reste. Zéro ligne de code, zéro logiciel à apprendre.",
      },
      {
        frein: "J'ai peur que ça coûte cher et que ça traîne.",
        reponse:
          "49 € à l'installation puis 9,99 €/mois, sans engagement, sans devis surprise. Et c'est en ligne en 48h, pas dans six mois. Tu peux arrêter quand tu veux.",
      },
      {
        frein: "Le bouche-à-oreille me suffit, non ?",
        reponse:
          "Il te ramène tes clients fidèles, pas les nouveaux. Or une urgence, on la cherche sur Google, pas dans son carnet. Sans site, ces appels-là partent direct chez un concurrent visible.",
      },
    ],
    faq: [
      {
        q: "Combien coûte la création d'un site de plombier ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Tout est inclus : hébergement, sécurité, mises à jour et modifications de contenu. Pas de devis gonflé ni de frais cachés.",
      },
      {
        q: "En combien de temps mon site de plombier est-il en ligne ?",
        a: "48 heures après réception de tes informations. Tu remplis un formulaire guidé, on conçoit le site, tu valides, on publie. Pas de cahier des charges ni de réunions.",
      },
      {
        q: "Le site me rend-il joignable pour les urgences ?",
        a: "Oui : appel et WhatsApp en un tap sur chaque page, et tes disponibilités (soir, week-end) affichées en évidence. Le client pressé te contacte sans remplir le moindre formulaire.",
      },
      {
        q: "Le site va-t-il me faire apparaître sur Google ?",
        a: "Oui, on l'optimise pour les recherches locales de ton métier. Le référencement naturel s'installe en quelques semaines ; pour être tout en haut tout de suite, la formule « En haut de Google » ajoute la publicité locale.",
      },
    ],
  },

  {
    urlSlug: "creer-site-menage",
    metierSlug: "menage",
    metierLabel: "Ménage à domicile",
    metaTitle: "Créer un site de femme de ménage / aide à domicile",
    metaDescription:
      "Aide-ménagère, repassage, ménage à domicile ? Crée ton site internet pro avec Xklic et mets en avant le crédit d'impôt. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet femme de ménage",
      "création site internet femme de ménage",
      "site internet aide à domicile pas cher",
      "site vitrine aide-ménagère",
      "créer un site internet ménage à domicile",
    ],
    eyebrow: "Créer ton site · Ménage à domicile",
    h1: "Créer le site d'une activité de ménage à domicile",
    lead: "Laisser entrer quelqu'un chez soi, ça ne se décide pas à la légère. Avant d'appeler, on vérifie : qui es-tu, es-tu bien notée, et combien ça coûte vraiment une fois le crédit d'impôt déduit ?",
    intro:
      "Xklic te crée un site clair qui montre ton sérieux, met en avant ton meilleur argument — le crédit d'impôt qui divise ton tarif perçu par deux — et te fait trouver par les familles débordées de ton secteur. En ligne en 48h, sans engagement, et tu peux même démarrer avant d'avoir ton SIRET.",
    sections: [
      {
        h2: "Pourquoi une femme de ménage a besoin d'un site",
        p: "Tes futurs clients veulent une personne fiable, proche d'eux, bien notée. Avant d'appeler, ils se renseignent. Sans site, tu n'existes que par le bouche-à-oreille ; avec un site, tu captes aussi les nouveaux clients qui cherchent « femme de ménage » ou « aide-ménagère » près d'eux. Tu prends une longueur d'avance sur celles qui n'ont qu'un numéro griffonné sur une annonce, et tu inspires confiance avant même le premier contact.",
      },
      {
        h2: "Ce que Xklic met sur ton site de ménage",
        p: "Un site rassurant : tes prestations (ménage régulier ou ponctuel, repassage, grand nettoyage, vitres, sortie de location), ta zone d'intervention, tes témoignages, et un formulaire + bouton d'appel pour être contactée facilement. On soigne la photo et le ton pour qu'on te sente sérieuse et de confiance dès la première seconde. Optimisé pour le mobile et le référencement local.",
      },
      {
        h2: "Ton crédit d'impôt, affiché comme ton meilleur argument",
        p: "Beaucoup de prospects ignorent qu'avec toi leur facture est divisée par deux. Sur ton site, on l'affiche noir sur blanc : « 20 €/h, soit 10 €/h réels après le crédit d'impôt ». Bien expliqué sur ta page, cet avantage devient ton argument le plus convaincant — il lève le frein du prix avant même que le client ne t'appelle. C'est ton tarif perçu coupé en deux, mis en valeur là où ça déclenche la décision.",
      },
    ],
    bullets: [
      "Ton crédit d'impôt affiché en clair : ton tarif perçu divisé par deux",
      "Tes prestations : ménage, repassage, grand nettoyage, vitres…",
      "Zone d'intervention par quartier / commune",
      "Espace avis et témoignages pour inspirer confiance",
      "Bouton d'appel, WhatsApp et formulaire de contact",
      "Optimisé Google local « femme de ménage + ta ville »",
    ],
    objections: [
      {
        frein: "Je débute, je n'ai presque pas d'avis ni de SIRET.",
        reponse:
          "On lance ton site avec ce que tu as et on l'enrichit au fil de l'eau : un QR code récolte tes premiers avis, et tu peux démarrer sans SIRET puis nous le transmettre. On grandit avec toi.",
      },
      {
        frein: "Le bouche-à-oreille marche bien, à quoi bon un site ?",
        reponse:
          "Il te ramène tes clientes fidèles, pas les familles qui cherchent là, maintenant, sur Google. Et une recommandation se conclut deux fois plus vite quand on peut t'envoyer un lien propre plutôt qu'un numéro.",
      },
      {
        frein: "J'ai peur que ça fasse cher pour une petite activité.",
        reponse:
          "49 € puis 9,99 €/mois, sans engagement : moins qu'une heure de ménage par mois. Un seul nouveau client par an rembourse l'année entière, et tu arrêtes quand tu veux.",
      },
    ],
    faq: [
      {
        q: "Combien coûte un site pour une femme de ménage ?",
        a: "49 € à l'installation puis 9,99 €/mois, sans engagement. Hébergement, mises à jour et modifications inclus. Tu peux démarrer même sans SIRET et nous le transmettre ensuite.",
      },
      {
        q: "Le crédit d'impôt sera-t-il mis en avant sur mon site ?",
        a: "Oui, clairement. Si tes prestations sont éligibles, on affiche que ta facture revient à moitié prix une fois l'avantage déduit. C'est l'argument qui lève le frein du prix et déclenche le plus d'appels.",
      },
      {
        q: "Mon site va-t-il m'aider à trouver des clients près de chez moi ?",
        a: "Oui : on l'optimise pour les recherches locales (« femme de ménage + ta ville »), avec ta zone d'intervention, pour que tu apparaisses quand quelqu'un de ton secteur cherche.",
      },
      {
        q: "Je ne suis pas à l'aise avec l'informatique, c'est compliqué ?",
        a: "Pas du tout : tu remplis un formulaire simple, on crée tout. Pour modifier une prestation ou ajouter un avis ensuite, tu nous écris un message et on s'en occupe — rien à installer ni à gérer.",
      },
    ],
    proof: {
      intro:
        "4 entreprises de ménage sont déjà en ligne avec Xklic, de Marseille à Saint-Étienne. Va voir leurs vrais sites :",
      items: [
        {
          nom: "Parfait Ménage 26",
          ville: "Pierrelatte (26)",
          url: "https://parfaitmenage26.fr",
          image: "/portfolio/menage/parfait-menage-26.jpg",
          googleAvis: true,
        },
        {
          nom: "SANAD CLEAN",
          ville: "Nîmes (30) · site trilingue FR/EN/AR",
          url: "https://sanadclean.fr",
          image: "/portfolio/menage/sanadclean.jpg",
          googleAvis: true,
        },
        {
          nom: "Casa Clean Provence",
          ville: "Marseille (13)",
          url: "https://casacleanprovence.fr",
          image: "/portfolio/menage/casa-clean-provence.jpg",
          googleAvis: true,
        },
        {
          nom: "Adelnet",
          ville: "Saint-Étienne (42)",
          url: "https://adel-net.fr",
          image: "/portfolio/menage/adelnet.jpg",
        },
      ],
    },
  },

  {
    urlSlug: "creer-site-electricien",
    metierSlug: "electricite",
    metierLabel: "Électricité",
    metaTitle: "Créer un site d'électricien : pro et local",
    metaDescription:
      "Électricien ? Crée ton site internet pro avec Xklic : mises aux normes, dépannage, rénovation, devis en ligne. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet électricien",
      "création site internet électricien",
      "site internet électricien pas cher",
      "site vitrine électricien",
      "créer un site internet électricien mise aux normes",
    ],
    eyebrow: "Créer ton site · Électricité",
    h1: "Créer le site internet d'un électricien",
    lead: "On ne confie pas son tableau électrique à un inconnu. Avant d'appeler, le client veut être sûr d'une chose : que tu es un vrai pro, assuré, qui connaît les normes. Ton site doit le prouver en un coup d'œil.",
    intro:
      "Xklic te crée un site d'électricien qui te fait trouver et qui inspire confiance — sécurité oblige. Tes prestations, ton assurance décennale, tes réalisations et un formulaire de devis, le tout en ligne en 48h et optimisé pour le référencement local. De quoi rassurer aussi bien le dépannage en panique que le projet de rénovation mûrement réfléchi.",
    sections: [
      {
        h2: "Pourquoi un électricien a besoin d'un site",
        p: "On ne confie pas son installation électrique à n'importe qui. Le client veut un pro assuré, sérieux, proche. Il se renseigne en ligne avant d'appeler — l'un en panique pour un dépannage, l'autre tranquillement pour comparer des devis de rénovation. Sans site, tu rates ces deux profils. Avec un site, tu présentes tes compétences, ton assurance décennale et tes réalisations, et tu transformes la prudence du client en demande de devis.",
      },
      {
        h2: "Ce que Xklic met sur ton site d'électricien",
        p: "Tes prestations (dépannage, mise aux normes NF C 15-100, rénovation complète, tableau électrique, domotique, bornes de recharge), ta zone, un formulaire de devis, un bouton d'appel et WhatsApp. On structure tout pour qu'on comprenne d'un regard ce que tu fais et où. Rapide sur mobile, optimisé pour « électricien + ta ville », et construit pour qu'on te sente fiable dès la page d'accueil.",
      },
      {
        h2: "La sécurité affichée, la confiance gagnée",
        p: "En électricité, la peur du client n'est pas le prix : c'est l'incendie, le travail bâclé, l'absence d'assurance le jour où ça tourne mal. Ton site désamorce tout ça. On met en avant ton assurance décennale, ta maîtrise des normes en vigueur, tes certifications et tes chantiers conformes. Le message est limpide : « avec moi, c'est aux normes et c'est couvert ». Cette réassurance, que tes concurrents amateurs ne peuvent pas offrir, fait pencher la balance avant le premier appel.",
      },
    ],
    bullets: [
      "Assurance décennale et certifications mises en avant",
      "Garantie d'un travail aux normes (NF C 15-100) affichée",
      "Prestations dépannage ET projets (mise aux normes, rénovation, bornes)",
      "Formulaire de devis pour les projets planifiés",
      "Bouton d'appel + WhatsApp pour les pannes",
      "Optimisé Google local « électricien + ta ville »",
    ],
    objections: [
      {
        frein: "Mes clients arrivent par les chantiers et les recommandations.",
        reponse:
          "Pour le dépannage et les particuliers en rénovation, non : ceux-là te cherchent sur Google. Un site capte cette demande que le bouche-à-oreille ne t'apportera jamais, sans rien retirer à tes circuits actuels.",
      },
      {
        frein: "Un site, ça ne va pas paraître crédible face aux grosses boîtes ?",
        reponse:
          "Au contraire. Un site soigné qui affiche ton assurance et tes réalisations te met au niveau des grosses entreprises, sans leur structure ni leurs prix. Le client voit un pro sérieux, pas un artisan « débrouille ».",
      },
      {
        frein: "Je n'ai pas le temps de m'occuper d'un site.",
        reponse:
          "Tu n'as rien à gérer : un formulaire guidé au départ, et ensuite une simple demande par message pour toute modif. Pendant que tu es sur le chantier, le site travaille pour toi.",
      },
    ],
    faq: [
      {
        q: "Combien coûte un site d'électricien ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Tout est inclus, y compris les modifications de contenu (nouveau service, photo de chantier, horaires).",
      },
      {
        q: "Puis-je mettre en avant mon assurance décennale et les normes ?",
        a: "Oui : on affiche clairement ton assurance, tes certifications et ta conformité aux normes en vigueur. C'est exactement ce qui rassure un client avant des travaux électriques et le décide à te confier le chantier.",
      },
      {
        q: "Le site convient-il à la fois au dépannage et aux gros projets ?",
        a: "Oui : appel et WhatsApp en évidence pour les pannes pressées, et un formulaire de devis détaillé pour les rénovations planifiées. Les deux profils trouvent immédiatement comment te contacter.",
      },
      {
        q: "Le site est-il optimisé pour Google ?",
        a: "Oui, pour les recherches locales de ton métier. Le naturel s'installe en quelques semaines ; la formule « En haut de Google » te place tout en haut immédiatement via la publicité.",
      },
    ],
  },

  {
    urlSlug: "creer-site-mecanicien",
    metierSlug: "mecanique-auto",
    metierLabel: "Mécanique auto",
    metaTitle: "Créer un site pour garage / mécanicien auto",
    metaDescription:
      "Garage ou mécanicien auto ? Crée ton site internet pro avec Xklic : entretien, réparation, avis, prise de RDV facile. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet garage",
      "création site internet garage automobile",
      "site internet mécanicien pas cher",
      "site vitrine garage auto",
      "créer un site internet mécanicien",
    ],
    eyebrow: "Créer ton site · Mécanique auto",
    h1: "Créer le site d'un garage ou d'un mécanicien",
    lead: "Aujourd'hui, on ne choisit plus son garage en passant devant la vitrine : on tape « garage + sa ville », on lit les avis, on compare. Le garage le mieux noté et le plus facile à joindre rafle le rendez-vous.",
    intro:
      "Xklic te crée un site de garage qui te rend visible et qui rassure : tes services, tes horaires, tes avis bien en avant et un moyen simple d'appeler ou de demander un rendez-vous. En ligne en 48h, optimisé pour le référencement local — pour capter l'automobiliste exactement au moment où il choisit à qui confier sa voiture.",
    sections: [
      {
        h2: "Pourquoi un garage a besoin d'un site",
        p: "Le client d'aujourd'hui choisit son garage sur Google et les avis. Entretien, panne, pneus, freinage, contre-visite de contrôle technique : il cherche « garage + sa ville » et compare. Un site te place dans la course, montre tes prestations et tes avis, et lui donne un moyen simple de te joindre. Il te fait aussi gagner en fidélité : tes habitués retrouvent tes horaires et te recontactent en un tap, sans chercher ton numéro.",
      },
      {
        h2: "Ce que Xklic met sur ton site de garage",
        p: "Tes services (entretien, vidange, freinage, pneus, distribution, diagnostic, contrôle technique et contre-visite), tes horaires, tes avis, ta localisation, un bouton d'appel et WhatsApp, et un formulaire de demande de devis ou de rendez-vous. On met tes avis bien en évidence, parce que c'est la première chose que l'automobiliste regarde. Optimisé mobile et référencement local.",
      },
      {
        h2: "Les avis et le RDV facile, c'est ce qui te fait choisir",
        p: "Entre deux garages, l'automobiliste tranche sur deux critères : la note et la simplicité du contact. Ton site capitalise sur les deux. On met tes avis clients en première ligne — un QR code en t'aidant à en récolter de nouveaux après chaque passage — et on rend la prise de rendez-vous évidente : un tap pour appeler ou envoyer ta demande de créneau. Le client rassuré par tes avis et qui décroche son RDV en dix secondes, c'est lui que tu accueilles demain dans ton atelier.",
      },
    ],
    bullets: [
      "Avis clients mis en première ligne (+ QR code pour en récolter)",
      "Demande de rendez-vous par appel, WhatsApp ou formulaire",
      "Tes prestations : entretien, réparation, pneus, CT, diagnostic…",
      "Horaires et localisation du garage bien visibles",
      "Modifications incluses (services, horaires, photos)",
      "Optimisé Google local « garage + ta ville »",
    ],
    objections: [
      {
        frein: "Mes clients me connaissent déjà, ils repassent.",
        reponse:
          "Tes fidèles, oui — mais ils déménagent, changent de voiture, partent à la retraite. Un site renouvelle ta clientèle en captant les nouveaux arrivants du quartier qui cherchent un garage de confiance sur Google.",
      },
      {
        frein: "Je n'ai pas beaucoup d'avis en ligne pour l'instant.",
        reponse:
          "On démarre avec ceux que tu as et on t'installe un QR code que tu montres au comptoir après chaque intervention. En quelques semaines, ta réputation en ligne décolle toute seule.",
      },
      {
        frein: "Mettre en place tout ça, ça doit prendre du temps.",
        reponse:
          "48h, et tu n'as qu'un formulaire à remplir. Ensuite, pour ajouter un service ou changer tes horaires de congés, tu nous envoies un message. Tu restes sous le capot, on gère l'écran.",
      },
    ],
    faq: [
      {
        q: "Combien coûte un site pour un garage ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Hébergement, mises à jour et modifications de contenu inclus.",
      },
      {
        q: "Puis-je mettre en avant mes avis clients ?",
        a: "Oui, et c'est central : tes avis sont affichés en première ligne, là où l'automobiliste regarde d'abord. Un QR code t'aide à en récolter de nouveaux après chaque passage à l'atelier.",
      },
      {
        q: "Le site gère-t-il la prise de rendez-vous ?",
        a: "Le client demande son créneau par appel, WhatsApp ou formulaire, en un tap. On met en avant le moyen que tu préfères pour recevoir et caler les rendez-vous sans friction.",
      },
      {
        q: "Un site peut-il vraiment m'amener de nouveaux clients ?",
        a: "Oui : la majorité des automobilistes choisissent leur garage en ligne. Un site optimisé pour « garage + ta ville », avec tes avis et tes horaires, te rend visible auprès de ceux qui ne te connaissent pas encore.",
      },
    ],
  },

  {
    urlSlug: "creer-site-serrurier",
    metierSlug: "serrurerie",
    metierLabel: "Serrurerie",
    metaTitle: "Créer un site de serrurier : pro et rassurant",
    metaDescription:
      "Serrurier ? Crée ton site internet pro avec Xklic : ouverture de porte, dépannage, tarifs clairs qui rassurent. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet serrurier",
      "création site internet serrurier",
      "site internet serrurier pas cher",
      "site vitrine serrurier",
      "créer un site internet serrurier dépannage",
    ],
    eyebrow: "Créer ton site · Serrurerie",
    h1: "Créer le site internet d'un serrurier",
    lead: "La serrurerie traîne une réputation d'arnaques, et le client le sait : il se méfie avant même de décrocher. Ton meilleur atout, c'est la transparence — un site clair te sépare instantanément des margoulins.",
    intro:
      "Xklic te crée un site de serrurier honnête et pro : une vraie identité, des tarifs indicatifs, ta zone et tes avis. De quoi rassurer le client échaudé avant même qu'il décroche — et déclencher l'appel chez toi plutôt que chez un numéro surtaxé anonyme. En ligne en 48h, sans engagement, à un prix lui aussi sans surprise.",
    sections: [
      {
        h2: "Pourquoi un serrurier a besoin d'un site",
        p: "Porte claquée, serrure forcée, cylindre à changer : le client cherche en urgence et se méfie. Il veut un serrurier identifiable, avec adresse, avis et tarifs annoncés. Sans site, tu es noyé parmi les annonces douteuses et les numéros surtaxés ; avec un site honnête, tu rassures avant même le premier appel et tu inspires une confiance que tes concurrents louches ne donnent jamais. C'est souvent ce qui fait qu'on t'appelle toi, et pas l'arnaqueur d'à côté.",
      },
      {
        h2: "Ce que Xklic met sur ton site de serrurier",
        p: "Tes prestations (ouverture de porte, dépannage serrure, changement de cylindre, blindage, mise en sécurité), des tarifs indicatifs, ta zone d'intervention, tes avis, et un bouton d'appel + WhatsApp ultra-visibles pour capter l'urgence. On affiche ce que les arnaqueurs cachent. Rapide sur mobile et optimisé pour « serrurier + ta ville » et « ouverture de porte ».",
      },
      {
        h2: "Afficher tes tarifs, c'est ta meilleure arme anti-arnaque",
        p: "Ce qui fait fuir le client, ce n'est pas ton prix : c'est la peur du devis qui explose une fois la porte ouverte. Ton site désamorce cette peur en affichant des fourchettes indicatives claires (« ouverture de porte simple à partir de X € »), ton identité, ton adresse et tes vrais avis. Tout ce que les arnaqueurs masquent, tu l'affiches. Le client se sent en confiance, te choisit toi, et arrive détendu plutôt que sur la défensive. La transparence, c'est ton argument commercial numéro un.",
      },
    ],
    bullets: [
      "Tarifs indicatifs affichés = la confiance avant l'appel",
      "Identité, adresse et zone d'intervention claires",
      "Vrais avis clients pour te démarquer des arnaques",
      "Prestations : ouverture, dépannage, blindage, mise en sécurité…",
      "Bouton d'appel + WhatsApp pour capter l'urgence",
      "Optimisé Google local « serrurier + ta ville »",
    ],
    objections: [
      {
        frein: "Afficher mes tarifs, ça ne va pas faire fuir le client ?",
        reponse:
          "C'est l'inverse : dans un métier miné par les arnaques, le prix annoncé rassure et te distingue. Le client préfère de loin une fourchette honnête à un devis surprise. Tes tarifs clairs deviennent ton argument de vente.",
      },
      {
        frein: "Tout le monde passe par les annuaires et les pubs, à quoi bon un site ?",
        reponse:
          "Justement, ces annuaires sont saturés de numéros surtaxés douteux. Un site à ton nom, avec ton vrai visage et tes avis, te sort de ce marécage et inspire la confiance qu'aucune ligne d'annuaire ne donne.",
      },
      {
        frein: "J'ai peur que ça coûte cher pour une petite structure.",
        reponse:
          "49 € puis 9,99 €/mois, sans engagement, sans frais caché — la transparence, on l'applique d'abord à notre propre tarif. Une seule intervention captée grâce au site rembourse des mois d'abonnement.",
      },
    ],
    faq: [
      {
        q: "Combien coûte un site de serrurier ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Tout inclus, sans frais caché — la transparence commence par notre propre tarif.",
      },
      {
        q: "Comment le site me différencie des arnaqueurs ?",
        a: "En affichant ce qu'ils cachent : ton identité, ton adresse, tes tarifs indicatifs et tes vrais avis. Un client rassuré t'appelle plus vite, hésite moins et arrive en confiance plutôt que sur la défensive.",
      },
      {
        q: "Puis-je vraiment afficher mes tarifs sans me piéger ?",
        a: "Oui, sous forme de fourchettes indicatives (« à partir de… »), qui rassurent sans t'engager au centime près. C'est ce flou maîtrisé mais honnête qui fait toute la différence avec les devis surprises.",
      },
      {
        q: "Le site capte-t-il les demandes en urgence ?",
        a: "Oui : bouton d'appel et WhatsApp en évidence, site optimisé pour « serrurier + ta ville » et « ouverture de porte », pour te trouver au moment exact où le client est coincé devant sa porte.",
      },
    ],
  },

  {
    urlSlug: "creer-site-jardinier",
    metierSlug: "jardinage",
    metierLabel: "Jardinage",
    metaTitle: "Créer un site de jardinier / paysagiste",
    metaDescription:
      "Jardinier ou paysagiste ? Crée ton site internet pro avec Xklic : galerie de réalisations, entretien, crédit d'impôt. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet jardinier",
      "création site internet paysagiste",
      "site internet jardinier pas cher",
      "site vitrine paysagiste",
      "créer un site internet jardinier entretien",
    ],
    eyebrow: "Créer ton site · Jardinage",
    h1: "Créer le site d'un jardinier ou paysagiste",
    lead: "Le jardinage est un métier qui se regarde avant de se confier. De belles photos avant/après valent tous les discours, et un site capte la demande pile au bon moment — printemps, avant l'été, rentrée.",
    intro:
      "Xklic te crée un site qui montre ton travail en images, met en avant le crédit d'impôt qui divise par deux le tarif perçu sur l'entretien à domicile, et remplit ton agenda au fil des saisons. Galerie, prestations, avis et devis en ligne, le tout publié en 48h et sans engagement.",
    sections: [
      {
        h2: "Pourquoi un jardinier a besoin d'un site",
        p: "Tes clients veulent voir avant de te confier leur jardin. Un site met en valeur tes photos avant/après, tes prestations et tes avis. Il joue aussi sur ta saisonnalité : entretien régulier, tonte, taille, élagage, création de jardin se cherchent à des moments précis de l'année. Sans site, tu rates les clients qui tapent « jardinier + leur ville » juste quand ils en ont besoin ; avec un site, tu es là au bon moment, photos à l'appui.",
      },
      {
        h2: "Ce que Xklic met sur ton site de jardinier",
        p: "Une galerie de tes réalisations, tes prestations (entretien, tonte, taille de haies, élagage, création et aménagement, contrats annuels), ta zone d'intervention, tes avis, un formulaire de devis et un bouton d'appel. On soigne particulièrement la galerie, parce qu'en jardinage le visuel vend. Optimisé mobile et référencement local pour « jardinier » et « paysagiste + ta ville ».",
      },
      {
        h2: "L'avant/après et ton crédit d'impôt : le combo qui décide",
        p: "Deux choses convainquent en jardinage : voir le résultat, et connaître le vrai prix. Ton site joue les deux. La galerie avant/après prouve ton talent mieux qu'un long texte — une haie en friche devenue nette, un jardin transformé. Et pour l'entretien à domicile éligible, on affiche que ton tarif est divisé par deux après le crédit d'impôt : bien expliqué sur ta page, c'est ton meilleur argument prix. Le client voit le résultat ET comprend qu'il est à sa portée. Il demande son devis.",
      },
    ],
    bullets: [
      "Galerie photos avant/après de tes réalisations",
      "Ton crédit d'impôt sur l'entretien affiché : tarif perçu divisé par deux",
      "Prestations : entretien, tonte, élagage, création de jardin…",
      "Contrats annuels et devis en ligne",
      "Bouton d'appel, WhatsApp et formulaire",
      "Optimisé Google local « jardinier / paysagiste + ta ville »",
    ],
    objections: [
      {
        frein: "Je n'ai pas de belles photos toutes prêtes de mes chantiers.",
        reponse:
          "Pas grave : un simple téléphone suffit, et on te dit quoi cadrer (le même angle avant et après). On démarre avec ce que tu as et on enrichit ta galerie au fil des saisons, photos incluses dans l'abonnement.",
      },
      {
        frein: "Mon activité est saisonnière, un site toute l'année se justifie-t-il ?",
        reponse:
          "C'est justement la force du site : il capte la demande aux pics (printemps, avant l'été, rentrée) sans que tu aies à y penser. Et l'entretien sous contrat annuel, lui, tourne toute l'année.",
      },
      {
        frein: "J'ai peur que ce soit compliqué et que ça coûte cher.",
        reponse:
          "Un formulaire à remplir, 48h d'attente, et c'est en ligne. 49 € puis 9,99 €/mois sans engagement : un seul contrat d'entretien décroché rembourse largement l'année.",
      },
    ],
    faq: [
      {
        q: "Combien coûte un site de jardinier ou paysagiste ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Modifications de contenu et ajout de photos inclus, pour garder ta galerie à jour au fil des chantiers et des saisons.",
      },
      {
        q: "Puis-je montrer mes réalisations sur le site ?",
        a: "Oui, c'est même essentiel : on crée une galerie qui met en valeur tes plus beaux chantiers avant/après. En jardinage, le visuel est ce qui convainc le plus — il prouve ton talent mieux qu'un long texte.",
      },
      {
        q: "Le crédit d'impôt est-il mis en avant ?",
        a: "Oui, si ton entretien à domicile est éligible : on affiche clairement que ton tarif revient à moitié prix une fois l'avantage déduit. Bien expliqué sur ta page, c'est ton argument prix le plus fort.",
      },
      {
        q: "Mon site m'aidera-t-il à remplir mon agenda au bon moment ?",
        a: "Oui : on l'optimise pour les recherches saisonnières (« jardinier + ta ville ») afin que tu apparaisses pile quand les clients cherchent, au printemps comme à la rentrée.",
      },
    ],
  },

  {
    urlSlug: "creer-site-coiffeur",
    metierSlug: "coiffure-beaute",
    metierLabel: "Coiffure & beauté",
    metaTitle: "Créer un site de coiffeur / salon de beauté",
    metaDescription:
      "Coiffeur, barbier, esthéticienne ? Crée ton site internet pro avec Xklic : galerie, prestations, prise de contact facile. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet coiffeur",
      "création site internet salon de coiffure",
      "site internet coiffeur pas cher",
      "site vitrine esthéticienne",
      "créer un site internet coiffure à domicile",
    ],
    eyebrow: "Créer ton site · Coiffure & beauté",
    h1: "Créer le site d'un coiffeur ou d'un salon de beauté",
    lead: "Coiffure, barbier, esthétique, onglerie : c'est un métier d'image et de fidélité. Avant de pousser ta porte, on regarde tes photos, tes avis et tes prix. Ton site, c'est ta vitrine quand le salon est fermé.",
    intro:
      "Xklic te crée un site à la hauteur de ton salon : ta galerie, tes prestations et tarifs, tes horaires et un moyen simple de te contacter ou de réserver. En ligne en 48h, optimisé pour le référencement local. Et si tu travailles à domicile, on le met en avant pour capter cette clientèle qui ne se déplace pas.",
    sections: [
      {
        h2: "Pourquoi un salon a besoin d'un site",
        p: "Avant de pousser la porte d'un salon, on regarde les photos, les avis et les prix. Que tu sois en salon ou à domicile, tes clients te cherchent sur leur téléphone. Un site présente ton univers, tes prestations et tes tarifs, met en avant tes réalisations (coupes, couleurs, soins, barbes) et facilite la prise de contact — de quoi attirer de nouveaux clients et fidéliser ceux qui reviennent. C'est ta vitrine ouverte 24h/24, même quand le salon est fermé.",
      },
      {
        h2: "Ce que Xklic met sur ton site de coiffeur",
        p: "Une galerie de tes réalisations, tes prestations et tarifs (coupe, couleur, barbe, soins, ongles…), tes horaires, ta localisation, tes avis, et un bouton d'appel + WhatsApp pour la prise de rendez-vous. On peut aussi mettre en avant ton activité à domicile si tu en proposes. On soigne le visuel pour que ton site respire ton style. Optimisé mobile et référencement local.",
      },
      {
        h2: "Plus pro qu'Insta, ta vitrine qui fidélise",
        p: "« J'ai déjà Instagram » — oui, mais Insta ne sort pas sur Google quand on cherche « coiffeur + ta ville », n'affiche ni tes tarifs ni tes horaires, et appartient à un algorithme que tu ne contrôles pas. Ton site, lui, te rend trouvable au moment où un nouveau client choisit, présente proprement tes prestations et prix, et garde tes habitués à un tap de toi. On peut même relier ton Insta à ton site : la spontanéité du feed, plus le sérieux d'une vraie vitrine pro qui te fidélise.",
      },
    ],
    bullets: [
      "Galerie de tes coupes, couleurs, barbes et soins",
      "Prestations et tarifs présentés clairement",
      "Option coiffure ou beauté à domicile mise en avant",
      "Horaires, localisation et lien vers ton Instagram",
      "Prise de contact / RDV par appel et WhatsApp",
      "Optimisé Google local « coiffeur / salon + ta ville »",
    ],
    objections: [
      {
        frein: "J'ai déjà Instagram, ça ne suffit pas ?",
        reponse:
          "Insta montre ton travail, mais ne te fait pas sortir sur Google, n'affiche pas tes tarifs ni tes horaires, et dépend d'un algorithme. Ton site fait tout ça — et on peut y relier ton Insta pour combiner les deux.",
      },
      {
        frein: "Je débute / je travaille seule à domicile, un site fait-il sérieux ?",
        reponse:
          "C'est même ton meilleur atout : un site propre te donne instantanément l'image d'une vraie pro, rassure une nouvelle cliente qui t'accueille chez elle, et te distingue des profils « amateur » sans vitrine.",
      },
      {
        frein: "Je n'ai pas le temps de gérer un site entre deux clients.",
        reponse:
          "Tu n'as rien à gérer : un formulaire au départ, et ensuite un message pour changer un tarif ou ajouter une photo. Pendant que tu coiffes, ton site attire et fidélise tout seul.",
      },
    ],
    faq: [
      {
        q: "Combien coûte un site pour un salon de coiffure ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Ajout de photos et modifications de prestations ou de tarifs inclus, pour garder ta vitrine à jour au fil des saisons.",
      },
      {
        q: "J'ai déjà Instagram, pourquoi un site en plus ?",
        a: "Parce qu'Instagram ne te fait pas trouver sur Google et n'affiche ni tes tarifs ni tes horaires. Ton site couvre ces manques et peut afficher ton feed Insta — tu gardes ta com', tu gagnes une vraie vitrine.",
      },
      {
        q: "Puis-je mettre en avant mon activité à domicile ?",
        a: "Oui : si tu te déplaces, on le met clairement en avant avec ta zone d'intervention, pour capter les clients qui préfèrent (ou ne peuvent pas) se déplacer. C'est une clientèle entière que ton salon seul ne touche pas.",
      },
      {
        q: "Le site gère-t-il la prise de rendez-vous ?",
        a: "Tes clients te contactent par appel ou WhatsApp en un tap pour réserver. On met en avant le moyen de contact que tu préfères, simple à suivre entre deux rendez-vous.",
      },
    ],
  },

  {
    urlSlug: "creer-site-macon",
    metierSlug: "maconnerie",
    metierLabel: "Maçonnerie",
    metaTitle: "Créer un site de maçon : pro et local",
    metaDescription:
      "Maçon ou gros œuvre ? Crée ton site internet pro avec Xklic : galerie de chantiers, décennale, devis qualifiés. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet maçon",
      "création site internet maçonnerie",
      "site internet maçon pas cher",
      "site vitrine maçon",
      "créer un site internet entreprise de maçonnerie",
    ],
    eyebrow: "Créer ton site · Maçonnerie",
    h1: "Créer le site internet d'un maçon",
    lead: "La maçonnerie, ce sont des projets à plusieurs milliers d'euros. On ne choisit pas son maçon à la légère : avant de signer, le client veut voir tes chantiers et vérifier ton sérieux, longuement.",
    intro:
      "Xklic te crée un site qui montre ton savoir-faire et génère des demandes de devis déjà qualifiées : tes réalisations en images, ton assurance décennale, tes avis et un formulaire clair. En ligne en 48h, sans engagement. Tu reçois moins de curieux et plus de vrais projets, parce que le client arrive déjà convaincu par ce qu'il a vu.",
    sections: [
      {
        h2: "Pourquoi un maçon a besoin d'un site",
        p: "Pour des travaux à plusieurs milliers d'euros, le client compare et se rassure longuement avant de se décider. Il cherche un maçon avec des réalisations visibles, une assurance décennale et de bons avis. Sans site, tu n'inspires pas cette confiance et tu rates les projets ; avec un site, tu présentes tes chantiers, tu prouves ton sérieux et tu reçois des demandes de devis déjà qualifiées — pas des curieux qui font le tour du marché sans budget.",
      },
      {
        h2: "Ce que Xklic met sur ton site de maçon",
        p: "Une galerie de tes réalisations (construction, rénovation, extension, dalle, mur, terrasse), tes prestations, la mise en avant de ton assurance décennale et de tes garanties, ta zone d'intervention, tes avis, et un formulaire de devis clair + bouton d'appel. On structure tout pour qu'un client sérieux trouve vite ce qu'il cherche et te contacte. Optimisé mobile et référencement local.",
      },
      {
        h2: "Tes chantiers font le tri : moins de curieux, plus de vrais devis",
        p: "Sur un gros budget, le client veut une preuve, pas une promesse. Ta galerie de chantiers réalisés — une extension sortie de terre, un mur monté propre, une rénovation aboutie — est cette preuve. Elle fait deux choses : elle convainc le client sérieux que tu sais faire, et elle fait fuir le « chasseur de prix » sans projet réel. Résultat, les demandes qui tombent dans ta boîte sont déjà mûres, qualifiées par ce qu'elles ont vu. Tu passes moins de temps à chiffrer dans le vide et plus à signer.",
      },
    ],
    bullets: [
      "Galerie de tes chantiers (avant/après, gros œuvre, extensions)",
      "Assurance décennale et garanties mises en avant",
      "Formulaire de devis qui fait remonter des projets qualifiés",
      "Prestations : construction, rénovation, extension, terrasse…",
      "Bouton d'appel + WhatsApp pour les premiers contacts",
      "Optimisé Google local « maçon + ta ville »",
    ],
    objections: [
      {
        frein: "Mes chantiers viennent du bouche-à-oreille et des artisans.",
        reponse:
          "Et ils continueront. Mais le particulier qui finance une extension de sa poche, lui, cherche d'abord sur Google et compare des réalisations. Sans site, ces projets-là — souvent les plus rentables — passent à côté de toi.",
      },
      {
        frein: "J'ai peur de crouler sous des demandes pas sérieuses.",
        reponse:
          "C'est l'inverse qui se produit : une galerie de chantiers ambitieux et ton assurance affichée découragent les chasseurs de prix sans budget. Tu reçois moins de demandes, mais nettement plus qualifiées.",
      },
      {
        frein: "Je suis sur les chantiers, pas devant un écran — c'est pas pour moi.",
        reponse:
          "Justement, on fait tout à ta place. Un formulaire au calme un soir, et 48h plus tard ton site travaille pendant que tu coules ta dalle. Une modif ? Un message, et on s'en occupe.",
      },
    ],
    faq: [
      {
        q: "Combien coûte un site pour un maçon ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Ajout de photos de chantiers et modifications inclus, pour enrichir ta galerie au fil des réalisations.",
      },
      {
        q: "Puis-je présenter mes chantiers et mon assurance décennale ?",
        a: "Oui : une galerie met en valeur tes réalisations et on affiche clairement ton assurance et tes garanties — décisif pour rassurer un client avant des travaux à plusieurs milliers d'euros.",
      },
      {
        q: "Le site génère-t-il des demandes de devis qualifiées ?",
        a: "Oui : un formulaire clair, plus l'appel et WhatsApp, font remonter des demandes directement chez toi — déjà qualifiées par ta galerie, qui décourage les curieux sans projet réel.",
      },
      {
        q: "Le site me rend-il visible pour les gros projets près de chez moi ?",
        a: "Oui : on l'optimise pour « maçon + ta ville » avec ta zone d'intervention, pour apparaître quand un particulier ou un pro de ton secteur cherche une entreprise de gros œuvre.",
      },
    ],
  },

  {
    urlSlug: "creer-site-peintre",
    metierSlug: "peinture",
    metierLabel: "Peinture",
    metaTitle: "Créer un site de peintre en bâtiment",
    metaDescription:
      "Peintre en bâtiment ou décorateur ? Crée ton site internet pro avec Xklic : galerie avant/après, façade, devis en ligne. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer un site internet peintre",
      "création site internet peintre en bâtiment",
      "site internet peintre pas cher",
      "site vitrine peintre en bâtiment",
      "créer un site internet peintre décorateur",
    ],
    eyebrow: "Créer ton site · Peinture",
    h1: "Créer le site internet d'un peintre en bâtiment",
    lead: "La peinture, c'est un métier où le rendu se voit au premier coup d'œil. Avant de te laisser entrer chez lui, le client veut deux preuves : que ton travail est net, et que tu ne saliras pas tout.",
    intro:
      "Xklic te crée un site qui montre la qualité de ton travail et te fait trouver par les clients de ton secteur : galerie avant/après, prestations, avis et formulaire de devis. En ligne en 48h, sans engagement. Tes plus beaux chantiers et ton soin du détail deviennent tes meilleurs commerciaux, jour et nuit.",
    sections: [
      {
        h2: "Pourquoi un peintre a besoin d'un site",
        p: "Intérieur, façade, rénovation, décoration : le client veut voir le rendu et se rassurer sur la propreté du travail avant de te confier son logement. Il cherche « peintre + sa ville », regarde les photos et les avis. Sans site, tu restes invisible pour ces clients ; avec un site, tu exposes tes plus beaux chantiers, tu mets en avant ton soin et tu déclenches des demandes de devis de la part de gens qui ont déjà vu ce que tu sais faire.",
      },
      {
        h2: "Ce que Xklic met sur ton site de peintre",
        p: "Une galerie avant/après de tes réalisations, tes prestations (peinture intérieure, façade, ravalement, enduits, papier peint, décoration), ta zone d'intervention, tes avis, un formulaire de devis et un bouton d'appel + WhatsApp. On met l'accent sur le visuel et la propreté, les deux choses qui décident en peinture. Rapide sur mobile et optimisé pour « peintre + ta ville ».",
      },
      {
        h2: "L'avant/après et ta propreté, vendus en images",
        p: "En peinture, deux peurs retiennent le client : un rendu décevant et un chantier qui salit tout. Ton site répond aux deux en images. La galerie avant/après prouve la qualité de ta finition — un mur défraîchi devenu impeccable, une façade ravivée. Et on met en avant ton soin : protections, bâches, chantier laissé propre, finitions nettes. Le client voit le résultat ET se rassure sur le déroulé. Cette double preuve, qu'un simple numéro de téléphone ne donnera jamais, transforme un curieux en demande de devis.",
      },
    ],
    bullets: [
      "Galerie avant/après de tes chantiers",
      "Mise en avant de ton soin et de la propreté du chantier",
      "Prestations : intérieur, façade, ravalement, enduits, déco…",
      "Formulaire de devis + bouton d'appel",
      "Avis clients pour rassurer sur la finition",
      "Optimisé Google local « peintre + ta ville »",
    ],
    objections: [
      {
        frein: "Je n'ai pas de photos avant/après bien prises.",
        reponse:
          "Un téléphone suffit : on te dit quoi cadrer et de penser à shooter le « avant » avant de commencer. On lance ton site avec ce que tu as, et on enrichit la galerie chantier après chantier, photos incluses.",
      },
      {
        frein: "Mes clients viennent par recommandation, un site change quoi ?",
        reponse:
          "Une recommandation se conclut deux fois plus vite quand tu peux envoyer un lien vers tes réalisations plutôt qu'un numéro. Et tu captes en plus les particuliers qui cherchent un peintre sur Google sans connaître personne.",
      },
      {
        frein: "J'ai peur que ce soit cher et long à mettre en place.",
        reponse:
          "48h pour être en ligne, et 49 € puis 9,99 €/mois sans engagement. Un seul chantier décroché grâce au site rembourse des années d'abonnement — et tu n'as qu'un formulaire à remplir.",
      },
    ],
    faq: [
      {
        q: "Combien coûte un site de peintre en bâtiment ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Ajout de photos et modifications de contenu inclus, pour garder ta galerie à jour au fil des chantiers.",
      },
      {
        q: "Puis-je montrer mes chantiers avant/après ?",
        a: "Oui, c'est l'élément clé : une galerie avant/après met en valeur la qualité de ta finition, ce qui convainc le plus en peinture. Elle prouve ton talent mieux que n'importe quel argument.",
      },
      {
        q: "Comment le site rassure-t-il sur la propreté du chantier ?",
        a: "On met en avant ton soin : protections, bâches, chantier laissé propre, finitions nettes, appuyés par tes avis. C'est la deuxième peur du client après le rendu — la lever te démarque nettement.",
      },
      {
        q: "Le site m'aide-t-il à être trouvé localement ?",
        a: "Oui : on l'optimise pour « peintre + ta ville » avec ta zone d'intervention, pour apparaître pile quand un client de ton secteur cherche un peintre pour son logement ou sa façade.",
      },
    ],
  },
];

export function getCreerSite(urlSlug: string): CreerSite | undefined {
  return creerSitePages.find((p) => p.urlSlug === urlSlug);
}

/** URL de la page « créer site » d'un métier (par slug métier), ou undefined. */
export function creerSiteUrlForMetier(metierSlug: string): string | undefined {
  const page = creerSitePages.find((p) => p.metierSlug === metierSlug);
  return page ? `/${page.urlSlug}` : undefined;
}
