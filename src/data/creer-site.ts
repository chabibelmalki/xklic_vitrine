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
      "Tu es plombier ou chauffagiste ? Crée ton site web pro avec Xklic : dépannage, urgences, devis, appel en un tap. En ligne en 48h, 49€ puis 9,99€/mois, sans engagement.",
    keywords: [
      "créer site plombier",
      "site internet plombier",
      "site web plombier",
      "création site plombier pas cher",
      "site plombier chauffagiste",
    ],
    eyebrow: "Créer ton site · Plomberie",
    h1: "Créer le site web d'un plombier",
    lead: "Un plombier se choisit en urgence, sur un téléphone, en quelques secondes. Si tu n'es pas visible à ce moment-là, c'est ton concurrent qu'on appelle.",
    intro:
      "Xklic te crée un site de plombier pensé pour ça : être trouvé sur Google quand quelqu'un a une fuite près de chez toi, rassurer en quelques secondes, et déclencher l'appel. Pas de jargon, pas de cahier des charges — un site pro, en ligne en 48h.",
    sections: [
      {
        h2: "Pourquoi un plombier a besoin d'un site",
        p: "La plomberie vit de l'urgence et de la confiance. Fuite, chauffe-eau en panne, WC bouché : le client tape « plombier » + sa ville et appelle les premiers résultats crédibles. Sans site, tu es invisible pour tous ceux qui ne te connaissent pas encore — c'est-à-dire la majorité de la demande. Un site te rend joignable 24h/24, montre ton sérieux et tes avis, et transforme une recherche pressée en intervention.",
      },
      {
        h2: "Ce que Xklic met sur ton site de plombier",
        p: "On construit un site clair qui parle ton métier : tes prestations (dépannage, recherche de fuite, installation sanitaire, chauffe-eau, chauffage), ta zone d'intervention, un bouton d'appel et WhatsApp en évidence, un formulaire de devis et de quoi récolter des avis. Le tout optimisé pour le référencement local et ultra-rapide sur mobile — parce que c'est là que tes clients te cherchent.",
      },
    ],
    bullets: [
      "Bouton d'appel + WhatsApp en un tap, visibles partout",
      "Tes prestations et ta zone d'intervention présentées clairement",
      "Formulaire de devis qui tombe direct dans ta boîte",
      "Mise en avant des urgences et du dépannage rapide",
      "Optimisé Google local pour « plombier + ta ville »",
      "QR code pour récolter des avis clients",
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
      "Aide-ménagère, repassage, ménage à domicile ? Crée ton site web pro avec Xklic et mets en avant le crédit d'impôt de 50%. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer site femme de ménage",
      "site aide à domicile",
      "site ménage à domicile",
      "création site femme de ménage",
      "site internet aide ménagère",
    ],
    eyebrow: "Créer ton site · Ménage à domicile",
    h1: "Créer le site d'une activité de ménage à domicile",
    lead: "Le ménage à domicile, c'est de la confiance avant tout : on laisse entrer quelqu'un chez soi. Un site pro rassure et met en avant ton meilleur argument.",
    intro:
      "Xklic te crée un site clair qui montre ton sérieux, explique simplement le crédit d'impôt de 50 % et te fait trouver par les familles débordées de ton secteur. En ligne en 48h, sans engagement — et tu peux démarrer même sans SIRET.",
    sections: [
      {
        h2: "Pourquoi une femme de ménage a besoin d'un site",
        p: "Tes futurs clients veulent une personne fiable, proche de chez eux, bien notée. Avant d'appeler, ils vérifient. Sans site, tu n'existes que par le bouche-à-oreille ; avec un site, tu captes aussi les nouveaux clients qui cherchent « femme de ménage » ou « aide-ménagère » près d'eux. Et tu peux expliquer clairement le crédit d'impôt — souvent ce qui déclenche la décision.",
      },
      {
        h2: "Ce que Xklic met sur ton site de ménage",
        p: "Un site rassurant : tes prestations (ménage régulier ou ponctuel, repassage, grand nettoyage, vitres, sortie de location), ta zone d'intervention, l'explication simple du crédit d'impôt de 50 %, tes témoignages, et un formulaire + bouton d'appel pour être contactée facilement. Optimisé pour le mobile et le référencement local.",
      },
    ],
    bullets: [
      "Mise en avant claire du crédit d'impôt de 50 %",
      "Tes prestations : ménage, repassage, grand nettoyage…",
      "Zone d'intervention par quartier / commune",
      "Espace avis et témoignages pour rassurer",
      "Bouton d'appel, WhatsApp et formulaire de contact",
      "Démarrage possible sans SIRET",
    ],
    faq: [
      {
        q: "Combien coûte un site pour une femme de ménage ?",
        a: "49 € à l'installation puis 9,99 €/mois, sans engagement. Hébergement, mises à jour et modifications inclus. Tu peux démarrer même sans SIRET et nous le transmettre ensuite.",
      },
      {
        q: "Le crédit d'impôt sera-t-il mis en avant sur mon site ?",
        a: "Oui, clairement. Si tu es éligible, on affiche que ta prestation revient à moitié prix après l'avantage fiscal — c'est ton argument le plus convaincant.",
      },
      {
        q: "Mon site va-t-il m'aider à trouver des clients près de chez moi ?",
        a: "Oui : on l'optimise pour les recherches locales (« femme de ménage + ta ville »), avec ta zone d'intervention, pour que tu apparaisses quand quelqu'un de ton secteur cherche.",
      },
    ],
  },

  {
    urlSlug: "creer-site-electricien",
    metierSlug: "electricite",
    metierLabel: "Électricité",
    metaTitle: "Créer un site d'électricien : pro et local",
    metaDescription:
      "Électricien ? Crée ton site web pro avec Xklic : mises aux normes, dépannage, rénovation, devis en ligne. En ligne en 48h, 49€ puis 9,99€/mois, sans engagement.",
    keywords: [
      "créer site électricien",
      "site internet électricien",
      "site web électricien",
      "création site électricien",
      "site électricien mise aux normes",
    ],
    eyebrow: "Créer ton site · Électricité",
    h1: "Créer le site web d'un électricien",
    lead: "L'électricité, c'est de l'urgence (panne, disjoncteur) et du projet (mise aux normes, rénovation, bornes de recharge). Ton site doit parler aux deux.",
    intro:
      "Xklic te crée un site d'électricien qui te fait trouver et qui inspire confiance — sécurité oblige. Tes prestations, ton assurance, tes réalisations et un formulaire de devis, le tout en ligne en 48h et optimisé pour le référencement local.",
    sections: [
      {
        h2: "Pourquoi un électricien a besoin d'un site",
        p: "On ne confie pas son installation électrique à n'importe qui. Le client veut un pro assuré, sérieux, proche. Il se renseigne en ligne avant d'appeler — l'un en panique pour un dépannage, l'autre tranquillement pour comparer des devis de rénovation. Sans site, tu rates ces deux profils. Avec un site, tu présentes tes compétences, ton assurance décennale et tes réalisations, et tu déclenches le contact.",
      },
      {
        h2: "Ce que Xklic met sur ton site d'électricien",
        p: "Tes prestations (dépannage, mise aux normes NF C 15-100, rénovation complète, tableau électrique, domotique, bornes de recharge), ta zone, un formulaire de devis, un bouton d'appel et WhatsApp, et la mise en avant de ton sérieux (assurance, garanties). Rapide sur mobile et optimisé pour « électricien + ta ville ».",
      },
    ],
    bullets: [
      "Prestations dépannage ET projets (mise aux normes, rénovation)",
      "Mise en avant de l'assurance décennale et des garanties",
      "Formulaire de devis pour les projets planifiés",
      "Bouton d'appel + WhatsApp pour les urgences",
      "Optimisé Google local « électricien + ta ville »",
      "Modifications de contenu illimitées",
    ],
    faq: [
      {
        q: "Combien coûte un site d'électricien ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Tout est inclus, y compris les modifications de contenu (nouveau service, photo de chantier, horaires).",
      },
      {
        q: "Puis-je mettre en avant mes devis et mon assurance ?",
        a: "Oui : on affiche clairement ton assurance décennale, tes garanties et un formulaire de devis. C'est exactement ce qui rassure un client avant des travaux électriques.",
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
    metaTitle: "Créer un site pour garage / mécanicien",
    metaDescription:
      "Garage ou mécanicien auto ? Crée ton site web pro avec Xklic : entretien, réparation, contrôle technique, contact facile. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer site garage",
      "site internet mécanicien",
      "site web garage automobile",
      "création site garage auto",
      "site mécanicien contrôle technique",
    ],
    eyebrow: "Créer ton site · Mécanique auto",
    h1: "Créer le site d'un garage ou d'un mécanicien",
    lead: "Avant de confier sa voiture, l'automobiliste vérifie les avis, regarde si le garage est proche et cherche un ordre de prix. Sans site, tu dépends du passage devant ta vitrine.",
    intro:
      "Xklic te crée un site de garage qui te rend visible et qui rassure : tes services, tes horaires, tes avis et un moyen simple d'appeler ou de demander un rendez-vous. En ligne en 48h, optimisé pour le référencement local.",
    sections: [
      {
        h2: "Pourquoi un garage a besoin d'un site",
        p: "Le client d'aujourd'hui choisit son garage sur Google et les avis. Entretien, panne, pneus, freinage, contre-visite de contrôle technique : il cherche « garage + sa ville » et compare. Un site te place dans la course, montre tes prestations et tes avis, et lui donne un moyen simple d'appeler ou de prendre rendez-vous. Il te fait aussi gagner en fidélité : tes habitués retrouvent tes horaires et te contactent en un tap.",
      },
      {
        h2: "Ce que Xklic met sur ton site de garage",
        p: "Tes services (entretien, vidange, freinage, pneus, distribution, diagnostic, contrôle technique et contre-visite), tes horaires, tes avis, ta localisation, un bouton d'appel et WhatsApp, et un formulaire de demande de devis ou de rendez-vous. Optimisé mobile et référencement local.",
      },
    ],
    bullets: [
      "Tes prestations : entretien, réparation, pneus, CT…",
      "Horaires et localisation du garage",
      "Avis clients mis en avant",
      "Bouton d'appel / WhatsApp / demande de RDV",
      "Optimisé Google local « garage + ta ville »",
      "Modifications incluses (services, horaires, photos)",
    ],
    faq: [
      {
        q: "Combien coûte un site pour un garage ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Hébergement, mises à jour et modifications de contenu inclus.",
      },
      {
        q: "Un site peut-il m'amener de nouveaux clients ?",
        a: "Oui : la plupart des automobilistes choisissent leur garage en ligne. Un site optimisé pour « garage + ta ville », avec tes avis et tes horaires, te rend visible auprès de ceux qui ne te connaissent pas encore.",
      },
      {
        q: "Puis-je afficher mes horaires et prendre des rendez-vous ?",
        a: "Oui : tes horaires sont mis en avant, et le client te contacte par appel, WhatsApp ou formulaire pour caler un rendez-vous ou un devis.",
      },
    ],
  },

  {
    urlSlug: "creer-site-serrurier",
    metierSlug: "serrurerie",
    metierLabel: "Serrurerie",
    metaTitle: "Créer un site de serrurier : pro et rassurant",
    metaDescription:
      "Serrurier ? Crée ton site web pro avec Xklic : ouverture de porte, dépannage, blindage, tarifs clairs qui rassurent. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer site serrurier",
      "site internet serrurier",
      "site web serrurier",
      "création site serrurier",
      "site serrurier dépannage",
    ],
    eyebrow: "Créer ton site · Serrurerie",
    h1: "Créer le site web d'un serrurier",
    lead: "La serrurerie souffre d'une réputation d'arnaques. Ton meilleur atout, c'est la transparence : un site clair te sépare instantanément des arnaqueurs.",
    intro:
      "Xklic te crée un site de serrurier honnête et pro : une vraie identité, des tarifs indicatifs, ta zone et tes avis. De quoi rassurer le client méfiant avant même qu'il décroche — et déclencher l'appel. En ligne en 48h, sans engagement.",
    sections: [
      {
        h2: "Pourquoi un serrurier a besoin d'un site",
        p: "Porte claquée, serrure forcée, cylindre à changer : le client cherche en urgence et se méfie. Il veut un serrurier identifiable, avec adresse, avis et tarifs annoncés. Sans site, tu es noyé parmi les annonces douteuses ; avec un site honnête, tu rassures avant même le premier appel et tu inspires la confiance que tes concurrents louches ne donnent jamais.",
      },
      {
        h2: "Ce que Xklic met sur ton site de serrurier",
        p: "Tes prestations (ouverture de porte, dépannage serrure, changement de cylindre, blindage, mise en sécurité), des tarifs indicatifs, ta zone d'intervention, tes avis, et un bouton d'appel + WhatsApp ultra-visibles pour capter l'urgence. Rapide sur mobile et optimisé pour « serrurier + ta ville ».",
      },
    ],
    bullets: [
      "Tarifs indicatifs affichés = confiance immédiate",
      "Prestations : ouverture, dépannage, blindage…",
      "Zone d'intervention claire",
      "Avis clients pour te démarquer des arnaques",
      "Bouton d'appel + WhatsApp pour l'urgence",
      "Optimisé Google local « serrurier + ta ville »",
    ],
    faq: [
      {
        q: "Combien coûte un site de serrurier ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Tout inclus, sans frais caché — la transparence commence par notre propre tarif.",
      },
      {
        q: "Comment le site me différencie des arnaqueurs ?",
        a: "En affichant ce qu'ils cachent : ton identité, tes tarifs indicatifs, ta zone et tes avis. Un client rassuré t'appelle plus vite et hésite moins.",
      },
      {
        q: "Le site capte-t-il les demandes en urgence ?",
        a: "Oui : bouton d'appel et WhatsApp en évidence, site optimisé pour « serrurier + ta ville » et « ouverture de porte », pour te trouver au moment exact où le client est coincé.",
      },
    ],
  },

  {
    urlSlug: "creer-site-jardinier",
    metierSlug: "jardinage",
    metierLabel: "Jardinage",
    metaTitle: "Créer un site de jardinier / paysagiste",
    metaDescription:
      "Jardinier ou paysagiste ? Crée ton site web pro avec Xklic : entretien, création de jardin, élagage, crédit d'impôt. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer site jardinier",
      "site internet paysagiste",
      "site web jardinier",
      "création site paysagiste",
      "site jardinier entretien",
    ],
    eyebrow: "Créer ton site · Jardinage",
    h1: "Créer le site d'un jardinier ou paysagiste",
    lead: "Le jardinage est un métier visuel et saisonnier. De belles photos de tes réalisations valent mille mots, et un site capte la demande au bon moment.",
    intro:
      "Xklic te crée un site qui montre ton travail, met en avant le crédit d'impôt sur l'entretien à domicile et remplit ton agenda — au printemps, avant l'été, à la rentrée. En ligne en 48h, sans engagement.",
    sections: [
      {
        h2: "Pourquoi un jardinier a besoin d'un site",
        p: "Tes clients veulent voir avant de confier leur jardin. Un site met en valeur tes photos avant/après, tes prestations et tes avis. Il joue aussi sur ta saisonnalité : entretien régulier, tonte, taille, élagage, création de jardin. Et comme pour le ménage, tu peux mettre en avant le crédit d'impôt de 50 % sur l'entretien de jardin à domicile — un argument décisif. Sans site, tu rates les clients qui cherchent « jardinier + leur ville » au moment où ils en ont besoin.",
      },
      {
        h2: "Ce que Xklic met sur ton site de jardinier",
        p: "Une galerie de tes réalisations, tes prestations (entretien, tonte, taille de haies, élagage, création et aménagement, contrats annuels), la mise en avant du crédit d'impôt, ta zone d'intervention, tes avis, un formulaire de devis et un bouton d'appel. Optimisé mobile et référencement local.",
      },
    ],
    bullets: [
      "Galerie photos de tes réalisations (avant/après)",
      "Mise en avant du crédit d'impôt sur l'entretien",
      "Prestations : entretien, élagage, création de jardin…",
      "Contrats annuels et devis en ligne",
      "Bouton d'appel, WhatsApp et formulaire",
      "Optimisé Google local « jardinier / paysagiste + ta ville »",
    ],
    faq: [
      {
        q: "Combien coûte un site de jardinier ou paysagiste ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Modifications de contenu et ajout de photos inclus, pour garder ta galerie à jour au fil des chantiers.",
      },
      {
        q: "Puis-je montrer mes réalisations sur le site ?",
        a: "Oui, c'est même essentiel : on crée une galerie qui met en valeur tes plus beaux chantiers avant/après. Le visuel, c'est ce qui convainc en jardinage.",
      },
      {
        q: "Le crédit d'impôt est-il mis en avant ?",
        a: "Oui, si tu fais de l'entretien de jardin à domicile éligible : on affiche clairement que ta prestation revient à moitié prix pour le client.",
      },
    ],
  },

  {
    urlSlug: "creer-site-coiffeur",
    metierSlug: "coiffure-beaute",
    metierLabel: "Coiffure & beauté",
    metaTitle: "Créer un site de coiffeur / salon de beauté",
    metaDescription:
      "Coiffeur, barbier, esthéticienne ? Crée ton site web pro avec Xklic : prestations, photos, contact et réservation faciles. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer site coiffeur",
      "site internet salon de coiffure",
      "site web coiffeur barbier",
      "création site esthéticienne",
      "site coiffure à domicile",
    ],
    eyebrow: "Créer ton site · Coiffure & beauté",
    h1: "Créer le site d'un coiffeur ou d'un salon de beauté",
    lead: "Coiffure, barbier, esthétique, onglerie : c'est un métier d'image et de fidélité. Un site met en valeur ton style, tes prestations et tes avis.",
    intro:
      "Xklic te crée un site à la hauteur de ton salon : ta galerie, tes prestations et tarifs, tes horaires et un moyen simple de te contacter ou de réserver. En ligne en 48h, optimisé pour le référencement local.",
    sections: [
      {
        h2: "Pourquoi un salon a besoin d'un site",
        p: "Avant de pousser la porte d'un salon, on regarde les photos, les avis et les prix. Que tu sois en salon ou à domicile, tes clients te cherchent sur leur téléphone. Un site présente ton univers, tes prestations et tes tarifs, met en avant tes réalisations (coupes, couleurs, soins) et facilite la prise de contact — de quoi attirer de nouveaux clients et fidéliser les habitués.",
      },
      {
        h2: "Ce que Xklic met sur ton site de coiffeur",
        p: "Une galerie de tes réalisations, tes prestations et tarifs (coupe, couleur, barbe, soins, ongles…), tes horaires, ta localisation, tes avis, et un bouton d'appel + WhatsApp pour la prise de rendez-vous. On peut aussi mettre en avant ton activité à domicile si tu en proposes. Optimisé mobile et référencement local.",
      },
    ],
    bullets: [
      "Galerie de tes coupes, couleurs et soins",
      "Prestations et tarifs présentés clairement",
      "Horaires et localisation du salon",
      "Prise de contact / RDV par appel et WhatsApp",
      "Option coiffure ou beauté à domicile",
      "Optimisé Google local « coiffeur / salon + ta ville »",
    ],
    faq: [
      {
        q: "Combien coûte un site pour un salon de coiffure ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Ajout de photos et modifications de prestations/tarifs inclus.",
      },
      {
        q: "Puis-je afficher mes prestations et mes tarifs ?",
        a: "Oui : on présente clairement tes services et tes prix, et une galerie met en valeur tes réalisations. C'est ce qui décide un nouveau client.",
      },
      {
        q: "Le site gère-t-il la prise de rendez-vous ?",
        a: "Tes clients te contactent par appel ou WhatsApp en un tap pour réserver. On met en avant le moyen de contact que tu préfères.",
      },
    ],
  },

  {
    urlSlug: "creer-site-macon",
    metierSlug: "maconnerie",
    metierLabel: "Maçonnerie",
    metaTitle: "Créer un site de maçon : pro et local",
    metaDescription:
      "Maçon ou entreprise de gros œuvre ? Crée ton site web pro avec Xklic : construction, rénovation, extension, devis en ligne. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer site maçon",
      "site internet maçonnerie",
      "site web maçon",
      "création site entreprise maçonnerie",
      "site maçon rénovation",
    ],
    eyebrow: "Créer ton site · Maçonnerie",
    h1: "Créer le site web d'un maçon",
    lead: "La maçonnerie, ce sont des projets importants : on ne choisit pas son maçon à la légère. Tes clients veulent voir tes chantiers et vérifier ton sérieux.",
    intro:
      "Xklic te crée un site qui montre ton savoir-faire et génère des demandes de devis qualifiées : tes réalisations, ton assurance décennale, tes avis et un formulaire clair. En ligne en 48h, sans engagement.",
    sections: [
      {
        h2: "Pourquoi un maçon a besoin d'un site",
        p: "Pour des travaux à plusieurs milliers d'euros, le client compare et se rassure longuement avant de se décider. Il cherche un maçon avec des réalisations visibles, une assurance décennale et de bons avis. Sans site, tu n'inspires pas cette confiance et tu rates les projets ; avec un site, tu présentes tes chantiers, tu prouves ton sérieux et tu reçois des demandes de devis déjà qualifiées.",
      },
      {
        h2: "Ce que Xklic met sur ton site de maçon",
        p: "Une galerie de tes réalisations (construction, rénovation, extension, dalle, mur, terrasse), tes prestations, la mise en avant de ton assurance décennale et de tes garanties, ta zone d'intervention, tes avis, et un formulaire de devis clair + bouton d'appel. Optimisé mobile et référencement local.",
      },
    ],
    bullets: [
      "Galerie de tes chantiers (avant/après)",
      "Prestations : gros œuvre, rénovation, extension…",
      "Mise en avant de l'assurance décennale",
      "Formulaire de devis pour projets qualifiés",
      "Bouton d'appel + WhatsApp",
      "Optimisé Google local « maçon + ta ville »",
    ],
    faq: [
      {
        q: "Combien coûte un site pour un maçon ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Ajout de photos de chantiers et modifications inclus.",
      },
      {
        q: "Puis-je présenter mes chantiers et mon assurance décennale ?",
        a: "Oui : une galerie met en valeur tes réalisations et on affiche clairement ton assurance et tes garanties — décisif pour des travaux importants.",
      },
      {
        q: "Le site génère-t-il des demandes de devis ?",
        a: "Oui : un formulaire de devis clair, plus l'appel et WhatsApp, font remonter des demandes directement chez toi, déjà qualifiées par la présentation de ton travail.",
      },
    ],
  },

  {
    urlSlug: "creer-site-peintre",
    metierSlug: "peinture",
    metierLabel: "Peinture",
    metaTitle: "Créer un site de peintre en bâtiment",
    metaDescription:
      "Peintre en bâtiment ou décorateur ? Crée ton site web pro avec Xklic : intérieur, façade, rénovation, devis en ligne. En ligne en 48h, 49€ puis 9,99€/mois.",
    keywords: [
      "créer site peintre",
      "site internet peintre en bâtiment",
      "site web peintre",
      "création site peintre décorateur",
      "site peintre façade",
    ],
    eyebrow: "Créer ton site · Peinture",
    h1: "Créer le site web d'un peintre en bâtiment",
    lead: "La peinture, c'est un métier où le rendu se voit. Des photos avant/après de tes chantiers valent tous les arguments.",
    intro:
      "Xklic te crée un site qui montre la qualité de ton travail et te fait trouver par les clients de ton secteur : galerie avant/après, prestations, avis et formulaire de devis. En ligne en 48h, sans engagement.",
    sections: [
      {
        h2: "Pourquoi un peintre a besoin d'un site",
        p: "Intérieur, façade, rénovation, décoration : le client veut voir le rendu et se rassurer sur la propreté du travail avant de te confier son logement. Il cherche « peintre + sa ville », regarde les photos et les avis. Sans site, tu restes invisible pour ces clients ; avec un site, tu exposes tes plus beaux chantiers, tu mets en avant ton soin et tu déclenches des demandes de devis.",
      },
      {
        h2: "Ce que Xklic met sur ton site de peintre",
        p: "Une galerie avant/après de tes réalisations, tes prestations (peinture intérieure, façade, ravalement, enduits, papier peint, décoration), ta zone d'intervention, tes avis, un formulaire de devis et un bouton d'appel + WhatsApp. Rapide sur mobile et optimisé pour le référencement local.",
      },
    ],
    bullets: [
      "Galerie avant/après de tes chantiers",
      "Prestations : intérieur, façade, ravalement, déco…",
      "Mise en avant du soin et de la propreté",
      "Formulaire de devis + bouton d'appel",
      "Zone d'intervention claire",
      "Optimisé Google local « peintre + ta ville »",
    ],
    faq: [
      {
        q: "Combien coûte un site de peintre en bâtiment ?",
        a: "49 € à l'installation, puis 9,99 €/mois, sans engagement. Ajout de photos et modifications de contenu inclus, pour garder ta galerie à jour.",
      },
      {
        q: "Puis-je montrer mes chantiers avant/après ?",
        a: "Oui, c'est l'élément clé : une galerie avant/après met en valeur la qualité de ton travail, ce qui convainc le plus en peinture.",
      },
      {
        q: "Le site m'aide-t-il à être trouvé localement ?",
        a: "Oui : on l'optimise pour « peintre + ta ville » avec ta zone d'intervention, pour apparaître quand un client de ton secteur cherche.",
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
