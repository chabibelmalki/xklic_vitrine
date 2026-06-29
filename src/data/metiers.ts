// ─────────────────────────────────────────────────────────────────────────
// Données ATOMIQUES des 9 métiers accompagnés.
// Chaque champ est propre au métier (jamais de nom de ville ici) : c'est la
// combinaison métier × ville (cf. compose.ts) qui produit un contenu unique.
// Ton : tutoiement, chaleureux, rassurant — voix Xklic.
// ─────────────────────────────────────────────────────────────────────────

import type { Metier } from "./types";

export const metiers: Metier[] = [
  // ───────────────────────────────────────────── Ménage à domicile ────────
  {
    slug: "menage",
    name: "Ménage à domicile",
    noun: "professionnel du ménage",
    nounPlural: "professionnels du ménage",
    gender: "m",
    icon: "Sparkles",
    hero: "Un site qui rassure et remplit ton planning de ménage",
    intro:
      "Le ménage à domicile, c'est d'abord une histoire de confiance : on entre chez les gens, on touche à leur intimité, à leurs objets, à leur quotidien. Un client ne te choisit pas au hasard, il veut quelqu'un de sérieux, ponctuel et discret. C'est exactement ce qu'un site clair doit transmettre dès la première seconde : tes prestations, tes tarifs, ta zone et ta façon de travailler. Beaucoup de tes futurs clients ignorent encore qu'en passant par un professionnel déclaré, ils profitent d'un crédit d'impôt de 50 %. Le mettre en avant noir sur blanc, c'est souvent ce qui transforme une simple visite en demande de devis. Avec un site soigné, tu n'as plus à courir après le bouche-à-oreille : les particuliers, les actifs débordés et les personnes âgées te trouvent seuls, vérifient que tu es de confiance, et te contactent en un clic.",
    prestations: [
      "Ménage régulier (hebdomadaire ou bimensuel)",
      "Grand ménage de printemps et remise à neuf",
      "Nettoyage de fin de bail / état des lieux",
      "Repassage et entretien du linge",
      "Nettoyage de vitres et surfaces vitrées",
      "Entretien après travaux ou déménagement",
      "Aide ménagère pour personnes âgées ou dépendantes",
      "Ménage de résidences secondaires et locations courte durée",
    ],
    painPoints: [
      "trouver une personne vraiment de confiance à qui laisser ses clés",
      "ne plus passer ses week-ends à nettoyer la maison",
      "garder un intérieur impeccable malgré un emploi du temps chargé",
      "préparer un logement nickel pour un état des lieux ou une location",
      "soulager un parent âgé qui ne peut plus entretenir son logement",
    ],
    signals: [
      "rush des locations saisonnières à nettoyer entre deux séjours",
      "grands ménages de printemps et d'avant-fêtes de fin d'année",
      "états des lieux de sortie en période de déménagements (été, rentrée)",
      "remises en état express après des travaux",
    ],
    faq: [
      {
        q: "Le crédit d'impôt de 50 % s'applique-t-il à mes prestations ?",
        a: "Oui, si je suis déclaré pour les services à la personne, tu récupères la moitié de ce que tu paies. Concrètement, une heure facturée 25 € ne te coûte réellement que 12,50 €.",
      },
      {
        q: "Faut-il que je sois présent pendant le ménage ?",
        a: "Pas du tout. Beaucoup de clients me confient un jeu de clés. On définit ensemble un protocole simple et tu retrouves ton logement impeccable en rentrant.",
      },
      {
        q: "Apportez-vous le matériel et les produits ?",
        a: "Selon ce qu'on convient. Je peux venir avec mon matériel et mes produits, ou utiliser les tiens si tu préfères des produits précis (écologiques, sans parfum, hypoallergéniques…).",
      },
      {
        q: "Peut-on réserver un seul grand ménage ponctuel ?",
        a: "Bien sûr. Pas besoin de t'engager sur un contrat régulier : un grand ménage de printemps, un nettoyage après travaux ou avant une visite, c'est possible à la demande.",
      },
    ],
    keywords: [
      "femme de ménage",
      "ménage à domicile",
      "aide ménagère",
      "nettoyage maison",
      "repassage à domicile",
      "ménage fin de bail",
      "crédit d'impôt ménage",
    ],
  },

  // ─────────────────────────────────────────────────────── Plomberie ──────
  {
    slug: "plomberie",
    name: "Plomberie",
    noun: "plombier",
    nounPlural: "plombiers",
    gender: "m",
    icon: "Wrench",
    hero: "Un site qui te fait appeler quand la fuite ne peut pas attendre",
    intro:
      "En plomberie, le client ne réfléchit pas longtemps : une fuite qui coule, un chauffe-eau en panne, des WC bouchés un dimanche soir, et il tape une recherche depuis son téléphone, paniqué. Celui qu'il appelle est presque toujours celui qu'il trouve en premier et qui inspire confiance immédiatement. Un site bien fait te place exactement là, avec ton numéro en gros, un bouton d'appel direct et la promesse d'une intervention rapide. C'est aussi l'endroit où tu rassures sur ce qui inquiète le plus : un devis clair avant de commencer, des prix honnêtes, pas de mauvaise surprise sur la facture. Entre les dépannages d'urgence et les chantiers plus posés — rénovation de salle de bain, installation de robinetterie, détartrage — un site te permet de montrer tout ton savoir-faire et d'attirer les deux types de clients, ceux qui paniquent maintenant et ceux qui préparent leurs travaux.",
    prestations: [
      "Dépannage de fuite d'eau en urgence",
      "Débouchage de canalisations et WC",
      "Installation et remplacement de chauffe-eau",
      "Rénovation complète de salle de bain",
      "Pose de robinetterie, lavabos et sanitaires",
      "Recherche de fuite non destructive",
      "Détartrage et entretien des installations",
      "Raccordement lave-linge / lave-vaisselle",
    ],
    painPoints: [
      "stopper une fuite avant qu'elle n'inonde le logement",
      "retrouver de l'eau chaude après une panne de chauffe-eau",
      "déboucher des WC ou un évier qui refoulent",
      "obtenir un devis honnête sans gonflage de facture",
      "rénover sa salle de bain sans mauvaise surprise",
    ],
    signals: [
      "interventions d'urgence le soir, le week-end et les jours fériés",
      "pics de pannes de chauffe-eau et de gel des tuyaux en hiver",
      "dégâts des eaux à constater vite pour l'assurance",
      "fuites soudaines qui ne peuvent pas attendre le lendemain",
    ],
    faq: [
      {
        q: "Intervenez-vous en urgence le soir et le week-end ?",
        a: "Oui, pour les vraies urgences (fuite, dégât des eaux, plus d'eau chaude), je me déplace en soirée et le week-end. Le mieux est de m'appeler directement pour que j'estime le délai.",
      },
      {
        q: "Donnez-vous un devis avant d'intervener ?",
        a: "Toujours, sauf urgence absolue. Tu sais ce que tu paies avant que je commence. Pas de surprise sur la facture une fois le travail fait.",
      },
      {
        q: "Pouvez-vous détecter une fuite cachée sans tout casser ?",
        a: "Oui, j'utilise des méthodes de recherche de fuite non destructives pour localiser le problème avant d'ouvrir un mur ou un sol uniquement là où c'est nécessaire.",
      },
      {
        q: "Gérez-vous les petits travaux comme les gros chantiers ?",
        a: "Les deux. Un robinet qui goutte comme la rénovation complète d'une salle de bain : je m'adapte à ton besoin et à ton budget.",
      },
    ],
    keywords: [
      "plombier",
      "dépannage plomberie",
      "fuite d'eau urgence",
      "débouchage canalisation",
      "chauffe-eau panne",
      "rénovation salle de bain",
      "recherche de fuite",
    ],
  },

  // ─────────────────────────────────────────────────────── Électricité ────
  {
    slug: "electricite",
    name: "Électricité",
    noun: "électricien",
    nounPlural: "électriciens",
    gender: "m",
    icon: "Zap",
    hero: "Un site qui rassure : sécurité, normes et dépannage rapide",
    intro:
      "L'électricité, c'est le métier où la confiance se joue sur un mot : la sécurité. Une panne qui plonge la maison dans le noir, un tableau qui disjoncte sans arrêt, une odeur de brûlé près d'une prise — le client veut quelqu'un de qualifié, vite, et qui ne va pas bricoler dangereusement. Un site clair te permet de montrer que tu maîtrises les normes (NF C 15-100), que tu fais des installations propres et que tu sécurises avant tout. C'est aussi là que tu captes les projets : mise aux normes d'un logement ancien, rénovation complète du tableau électrique, installation de bornes de recharge pour voiture électrique, domotique. En affichant tes prestations, tes certifications et la promesse d'un diagnostic honnête, tu attires autant le particulier en panne que le propriétaire qui veut rénover en toute sérénité.",
    prestations: [
      "Dépannage électrique et recherche de panne",
      "Mise aux normes NF C 15-100",
      "Rénovation et remplacement de tableau électrique",
      "Installation de prises, interrupteurs et points lumineux",
      "Pose de borne de recharge pour véhicule électrique",
      "Tableau, disjoncteurs et protection différentielle",
      "Éclairage intérieur et extérieur",
      "Domotique et objets connectés",
    ],
    painPoints: [
      "retrouver le courant après une panne ou un court-circuit",
      "arrêter un tableau qui disjoncte sans arrêt",
      "mettre aux normes une installation ancienne et dangereuse",
      "sécuriser une prise qui chauffe ou qui sent le brûlé",
      "installer une borne de recharge fiable pour sa voiture électrique",
    ],
    signals: [
      "pannes de courant nécessitant un dépannage le jour même",
      "mises en sécurité urgentes (odeur de brûlé, surchauffe)",
      "diagnostics électriques exigés avant une vente ou une location",
      "hausse des installations de bornes de recharge à domicile",
    ],
    faq: [
      {
        q: "Mon installation est ancienne, est-elle dangereuse ?",
        a: "Souvent, les logements d'avant 1991 ne sont plus aux normes. Je fais un diagnostic, je t'explique les vrais risques et je te propose une mise en sécurité par étapes si besoin.",
      },
      {
        q: "Posez-vous des bornes de recharge pour voiture électrique ?",
        a: "Oui, j'installe des bornes adaptées à ta voiture et à ton tableau, avec la protection nécessaire. Selon ta situation, tu peux aussi bénéficier d'aides à l'installation.",
      },
      {
        q: "Travaillez-vous dans le respect des normes ?",
        a: "Toujours. Toutes mes installations respectent la norme NF C 15-100. La sécurité passe avant tout, c'est non négociable.",
      },
      {
        q: "Mon tableau disjoncte tout le temps, que faire ?",
        a: "C'est souvent le signe d'une surcharge ou d'un défaut. Je localise la cause précise plutôt que de remettre le courant à l'aveugle, puis je sécurise durablement.",
      },
    ],
    keywords: [
      "électricien",
      "dépannage électrique",
      "mise aux normes électrique",
      "rénovation tableau électrique",
      "borne de recharge",
      "panne de courant",
      "NF C 15-100",
    ],
  },

  // ───────────────────────────────────────────────────── Mécanique auto ───
  {
    slug: "mecanique-auto",
    name: "Mécanique auto",
    noun: "mécanicien",
    nounPlural: "mécaniciens",
    gender: "m",
    icon: "Car",
    hero: "Un site qui amène les automobilistes du quartier dans ton garage",
    intro:
      "Un garage se choisit souvent par méfiance autant que par besoin : tout le monde a peur de se faire surfacturer une réparation qu'il ne comprend pas. C'est précisément là qu'un site bien fait change tout. Il met en avant ce qui rassure : des devis clairs avant intervention, des tarifs annoncés, des prestations expliquées simplement, et la réputation d'un garage honnête de quartier. Entre l'entretien courant (vidange, freins, pneus), la préparation au contrôle technique et les réparations plus lourdes (embrayage, distribution, diagnostic électronique), tu as de quoi montrer ton savoir-faire. Un site te permet aussi de capter les recherches du moment — « garage pas cher », « contre-visite contrôle technique », « réparation embrayage » — et de transformer un automobiliste pressé en client fidèle qui revient à chaque entretien.",
    prestations: [
      "Vidange et révision complète",
      "Plaquettes, disques et système de freinage",
      "Montage, équilibrage et géométrie des pneus",
      "Préparation et passage au contrôle technique",
      "Remplacement d'embrayage et de distribution",
      "Diagnostic électronique (valise OBD)",
      "Climatisation : recharge et entretien",
      "Remplacement batterie, démarreur et alternateur",
    ],
    painPoints: [
      "faire réparer sa voiture sans se faire surfacturer",
      "réussir le contrôle technique ou sa contre-visite",
      "comprendre ce qui est vraiment à réparer et ce qui peut attendre",
      "ne pas rester immobilisé trop longtemps sans véhicule",
      "trouver un garage de confiance près de chez soi",
    ],
    signals: [
      "préparation au contrôle technique et contre-visites à corriger vite",
      "pannes de batterie et de démarrage lors des coups de froid",
      "rush des révisions et pneus neige avant l'hiver",
      "recharges de climatisation à l'approche de l'été",
    ],
    faq: [
      {
        q: "Donnez-vous un devis avant de réparer ?",
        a: "Systématiquement. Je t'explique ce qui est nécessaire, ce qui peut attendre, et tu valides le montant avant que je touche à la voiture.",
      },
      {
        q: "Pouvez-vous préparer ma voiture au contrôle technique ?",
        a: "Oui, je fais un point complet avant le passage et je corrige les défauts. Si tu as une contre-visite à passer, je m'occupe des points à reprendre.",
      },
      {
        q: "Travaillez-vous sur toutes les marques ?",
        a: "Oui, toutes marques. Avec ma valise de diagnostic, je lis les défauts électroniques sur la quasi-totalité des modèles, essence comme diesel.",
      },
      {
        q: "Reprenez-vous les pièces que j'apporte ?",
        a: "On en discute : selon la pièce, je peux monter celle que tu fournis ou te conseiller une référence fiable pour éviter les mauvaises surprises.",
      },
    ],
    keywords: [
      "garage auto",
      "mécanicien",
      "vidange révision",
      "contrôle technique",
      "réparation embrayage",
      "garage pas cher",
      "diagnostic auto",
    ],
  },

  // ─────────────────────────────────────────────────────── Serrurerie ─────
  {
    slug: "serrurerie",
    name: "Serrurerie",
    noun: "serrurier",
    nounPlural: "serruriers",
    gender: "m",
    icon: "KeyRound",
    hero: "Un site qui te trouve quand on est bloqué dehors, sans arnaque",
    intro:
      "La serrurerie est un métier où la confiance est devenue rare : trop d'arnaques, de devis explosés une fois la porte ouverte, de clients pris en otage dans l'urgence. Un site honnête et clair, c'est ton meilleur argument. Il affiche un prix d'intervention annoncé d'avance, ta zone, ton numéro joignable, et il rassure une personne paniquée bloquée sur son palier à minuit. Au-delà de l'ouverture de porte, tu montres tout ton savoir-faire : changement de serrure après cambriolage ou perte de clés, blindage de porte, installation de serrures multipoints, mise en sécurité. Un site bien fait te démarque des « dépanneurs » douteux : tu deviens le serrurier sérieux du quartier, celui qu'on rappelle et qu'on recommande, parce qu'il a donné un prix juste sans profiter de la détresse du client.",
    prestations: [
      "Ouverture de porte claquée ou fermée à clé",
      "Changement et remplacement de serrure",
      "Installation de serrure multipoints",
      "Blindage et renforcement de porte",
      "Mise en sécurité après cambriolage",
      "Pose de verrous et de cylindres haute sécurité",
      "Reproduction et dépannage de clés",
      "Dépannage de rideaux métalliques et volets",
    ],
    painPoints: [
      "rentrer chez soi quand on est bloqué dehors",
      "obtenir un prix annoncé d'avance, sans arnaque dans l'urgence",
      "sécuriser sa porte après une tentative d'effraction",
      "remplacer une serrure après une perte ou un vol de clés",
      "renforcer la sécurité de son logement contre les cambriolages",
    ],
    signals: [
      "ouvertures de porte en urgence de nuit, week-end et jours fériés",
      "mises en sécurité d'urgence après un cambriolage",
      "hausse des effractions pendant les vacances scolaires",
      "portes claquées à répétition aux heures de sortie et de rentrée",
    ],
    faq: [
      {
        q: "Combien coûte une ouverture de porte ?",
        a: "Je t'annonce le prix au téléphone, avant de me déplacer. Pas de devis qui explose une fois sur place : c'est le principe d'un serrurier honnête.",
      },
      {
        q: "Allez-vous abîmer ma porte pour l'ouvrir ?",
        a: "Pour une porte simplement claquée, j'ouvre sans dégât dans la grande majorité des cas. Je ne perce la serrure qu'en dernier recours et je t'en informe avant.",
      },
      {
        q: "Intervenez-vous en pleine nuit ?",
        a: "Oui, les urgences n'attendent pas. Je me déplace de nuit, le week-end et les jours fériés pour les ouvertures et les mises en sécurité.",
      },
      {
        q: "Pouvez-vous sécuriser ma porte après un cambriolage ?",
        a: "Oui, j'interviens en urgence pour refermer et sécuriser, puis je te propose une solution durable : serrure multipoints, blindage, verrous renforcés.",
      },
    ],
    keywords: [
      "serrurier",
      "ouverture de porte",
      "dépannage serrurerie",
      "changement de serrure",
      "serrure multipoints",
      "blindage de porte",
      "serrurier pas cher",
    ],
  },

  // ───────────────────────────────────────────────────────── Jardinage ────
  {
    slug: "jardinage",
    name: "Jardinage",
    noun: "jardinier",
    nounPlural: "jardiniers",
    gender: "m",
    icon: "Leaf",
    hero: "Un site qui remplit ton agenda d'entretien de jardins",
    intro:
      "Le jardinage est un métier de saisons et de régularité : on te confie un extérieur parce qu'on n'a pas le temps, plus la force, ou simplement l'envie de s'en occuper. Un site clair montre que tu es fiable, soigneux et que tu reviens quand il faut. Il met en avant ce qui rassure les particuliers comme les copropriétés : entretien régulier, tonte, taille des haies, débroussaillage, et la remise en état d'un jardin laissé à l'abandon. C'est aussi là que tu peux rappeler un argument décisif : l'entretien de jardin à domicile ouvre droit au crédit d'impôt de 50 % pour les particuliers. En affichant tes prestations et ta zone, tu captes les recherches saisonnières — « jardinier pour tonte », « taille de haie », « débroussaillage » — et tu transformes un contact ponctuel en contrat d'entretien à l'année.",
    prestations: [
      "Tonte et entretien régulier de pelouse",
      "Taille de haies, arbustes et arbres fruitiers",
      "Débroussaillage et nettoyage de terrain",
      "Création et engazonnement de pelouse",
      "Aménagement et plantation de massifs",
      "Ramassage de feuilles et évacuation des déchets verts",
      "Désherbage et entretien des allées",
      "Contrat d'entretien annuel pour particuliers et copropriétés",
    ],
    painPoints: [
      "garder un jardin propre sans y passer ses week-ends",
      "remettre en état un terrain laissé à l'abandon",
      "faire tailler des haies devenues trop hautes",
      "profiter du crédit d'impôt sur l'entretien de jardin",
      "confier l'entretien régulier de ses extérieurs à quelqu'un de fiable",
    ],
    signals: [
      "rush des tontes et tailles au printemps et en été",
      "débroussaillages obligatoires avant la saison sèche",
      "ramassage des feuilles et nettoyage d'automne",
      "remises en état après l'hiver, avant les beaux jours",
    ],
    faq: [
      {
        q: "L'entretien de mon jardin ouvre-t-il droit au crédit d'impôt ?",
        a: "Oui, les petits travaux de jardinage à domicile pour les particuliers donnent droit à 50 % de crédit d'impôt, dans la limite du plafond annuel. Je te remets une attestation.",
      },
      {
        q: "Proposez-vous un entretien régulier toute l'année ?",
        a: "Oui, je propose des contrats d'entretien (mensuel ou saisonnier) : tu n'as plus à y penser, je passe au bon moment selon les saisons.",
      },
      {
        q: "Évacuez-vous les déchets verts ?",
        a: "Oui, je m'occupe du ramassage et de l'évacuation des tontes, branches et feuilles. Ton jardin est laissé propre et net après mon passage.",
      },
      {
        q: "Pouvez-vous remettre en état un jardin très envahi ?",
        a: "Sans problème. Débroussaillage, taille sévère, désherbage : je remets d'aplomb un terrain à l'abandon, puis on peut passer sur un entretien régulier.",
      },
    ],
    keywords: [
      "jardinier",
      "entretien jardin",
      "tonte pelouse",
      "taille de haie",
      "débroussaillage",
      "crédit d'impôt jardinage",
      "paysagiste",
    ],
  },

  // ─────────────────────────────────────────────────── Coiffure & beauté ──
  {
    slug: "coiffure-beaute",
    name: "Coiffure & beauté",
    noun: "professionnel de la coiffure et de la beauté",
    nounPlural: "professionnels de la coiffure et de la beauté",
    gender: "m",
    icon: "Scissors",
    hero: "Un site qui remplit ton agenda et donne envie de réserver",
    intro:
      "En coiffure et en beauté, on choisit avec les yeux : avant de réserver, le client veut voir. Un site soigné, avec de belles photos de tes réalisations, vaut mille discours. Il montre ton style, ton univers, ton ambiance de salon ou ta prestation à domicile, et il donne envie de prendre rendez-vous tout de suite. C'est aussi l'outil qui te libère du téléphone : tarifs affichés, prestations détaillées, prise de contact simple, et tes clientes réservent sans te déranger en plein soin. Coupe, couleur, balayage, soins, coiffure à domicile, beauté des mains, mise en beauté pour les mariages : un site met en valeur toute ta palette et te démarque dans un quartier où la concurrence se joue à l'image. Tu transformes des passants curieux en clientes fidèles qui reviennent et qui parlent de toi.",
    prestations: [
      "Coupe femme, homme et enfant",
      "Coloration, balayage et mèches",
      "Soins capillaires et lissage",
      "Brushing et coiffure de tous les jours",
      "Chignons et coiffures de mariage / événement",
      "Coiffure et beauté à domicile",
      "Manucure, pose de vernis et beauté des mains",
      "Soins du visage et mise en beauté",
    ],
    painPoints: [
      "trouver un salon dont le style correspond vraiment à ses envies",
      "réserver facilement sans appeler aux heures d'ouverture",
      "voir des photos réelles de coupes et de couleurs avant de venir",
      "se faire coiffer à domicile faute de temps ou de mobilité",
      "être mis en beauté pour un mariage ou un événement important",
    ],
    signals: [
      "pic de réservations avant les fêtes de fin d'année",
      "saison des mariages et des événements au printemps et en été",
      "rush des coupes et couleurs avant la rentrée",
      "envies de changement et de nouveautés au fil des saisons",
    ],
    faq: [
      {
        q: "Peut-on réserver en ligne ou par message ?",
        a: "Oui, tu peux me contacter en un clic depuis le site, par appel ou message, et on cale le créneau qui t'arrange — sans attendre que je raccroche d'une autre cliente.",
      },
      {
        q: "Vous déplacez-vous à domicile ?",
        a: "Oui, je propose des prestations à domicile pour les coupes, brushings et mises en beauté, pratique si tu manques de temps ou de mobilité.",
      },
      {
        q: "Faites-vous les coiffures de mariage ?",
        a: "Avec plaisir. Je propose des essais en amont pour le grand jour, et je me déplace si besoin pour la mariée et son entourage.",
      },
      {
        q: "Travaillez-vous tous les types de cheveux ?",
        a: "Oui, lisses, bouclés, frisés, crépus : j'adapte coupe, soin et coiffage à ta nature de cheveux pour un rendu qui te ressemble et qui tient.",
      },
    ],
    keywords: [
      "coiffeur",
      "salon de coiffure",
      "coloration balayage",
      "coiffure à domicile",
      "coiffure mariage",
      "institut de beauté",
      "manucure",
    ],
  },

  // ────────────────────────────────────────────────────────── Maçonnerie ──
  {
    slug: "maconnerie",
    name: "Maçonnerie",
    noun: "maçon",
    nounPlural: "maçons",
    gender: "m",
    icon: "Hammer",
    hero: "Un site qui inspire confiance pour tes chantiers de maçonnerie",
    intro:
      "La maçonnerie engage le client sur du lourd : un mur, une terrasse, une extension, c'est de l'argent, du temps et du durable. Avant de confier un chantier, on veut voir du concret et sentir du sérieux. Un site bien construit, c'est ta vitrine de réalisations : des photos avant/après, des prestations détaillées, et tout ce qui rassure — devis clair, respect des délais, travail propre et finitions soignées. Il te place sur les recherches qui comptent : « maçon pour terrasse », « construction de mur », « ouverture de mur porteur », « ravalement de façade ». Entre les petits travaux (dalle, muret, scellement) et les gros œuvres (extension, dépose de cloison, fondations), tu montres l'étendue de ton savoir-faire. Un site, c'est ce qui transforme une réputation locale en demandes de devis régulières, sans dépendre uniquement du bouche-à-oreille.",
    prestations: [
      "Construction et réparation de murs et murets",
      "Création de terrasse et de dalle béton",
      "Ouverture de mur porteur et pose de linteau",
      "Extension et agrandissement de maison",
      "Ravalement et enduit de façade",
      "Dépose de cloison et réaménagement intérieur",
      "Fondations, chape et gros œuvre",
      "Pose de pavés, bordures et aménagement extérieur",
    ],
    painPoints: [
      "lancer un chantier sans mauvaise surprise sur le prix ou les délais",
      "trouver un maçon sérieux qui livre un travail propre et durable",
      "agrandir sa maison ou ouvrir un mur porteur en toute sécurité",
      "rénover une façade abîmée par le temps",
      "créer une terrasse ou une dalle bien réalisée",
    ],
    signals: [
      "saison haute des chantiers extérieurs au printemps et en été",
      "ravalements et reprises de façade avant l'hiver",
      "projets d'extension préparés à l'année",
      "réparations urgentes après fissures ou infiltrations",
    ],
    faq: [
      {
        q: "Fournissez-vous un devis détaillé ?",
        a: "Oui, je me déplace pour voir le chantier et je remets un devis clair : matériaux, main-d'œuvre, délais. Tu sais où tu vas avant qu'on commence.",
      },
      {
        q: "Pouvez-vous ouvrir un mur porteur ?",
        a: "Oui, avec les précautions nécessaires (étude de charge, pose d'IPN ou de linteau). C'est un travail technique que je réalise dans les règles de l'art.",
      },
      {
        q: "Gérez-vous aussi les petits travaux ?",
        a: "Bien sûr. Un muret, une dalle, un scellement, une reprise de fissure : je ne prends pas que les gros chantiers, les petits travaux aussi.",
      },
      {
        q: "Respectez-vous les délais annoncés ?",
        a: "C'est un point d'honneur. Je m'engage sur un planning réaliste dès le devis et je te tiens informé de l'avancement tout au long du chantier.",
      },
    ],
    keywords: [
      "maçon",
      "entreprise de maçonnerie",
      "construction mur",
      "terrasse béton",
      "ouverture mur porteur",
      "ravalement façade",
      "extension maison",
    ],
  },

  // ─────────────────────────────────────────────────────────── Peinture ───
  {
    slug: "peinture",
    name: "Peinture",
    noun: "peintre",
    nounPlural: "peintres",
    gender: "m",
    icon: "Paintbrush",
    hero: "Un site qui montre tes finitions et remplit ton carnet",
    intro:
      "La peinture, c'est un métier où le résultat se voit immédiatement : des murs nets, des angles parfaits, des finitions sans bavure. Et c'est exactement ce que le client veut vérifier avant de te confier son intérieur. Un site avec de belles photos de chantiers terminés fait tout le travail : il montre la qualité de tes finitions, ton sens du détail et ta propreté. Il rassure aussi sur ce qui inquiète quand on fait venir un peintre chez soi : protection des sols et des meubles, respect des délais, chantier propre rendu impeccable. Entre la rénovation intérieure, la peinture de façade, la pose de papier peint et l'enduit décoratif, tu montres toute ta palette. Un site te place sur les bonnes recherches — « peintre en bâtiment », « rénovation intérieure », « peinture façade » — et transforme un projet hésitant en devis concret.",
    prestations: [
      "Peinture intérieure (murs et plafonds)",
      "Rénovation et rafraîchissement de pièces",
      "Peinture de façade et ravalement décoratif",
      "Pose de papier peint et de toile de verre",
      "Enduit décoratif et finitions soignées",
      "Préparation des supports (rebouchage, ponçage)",
      "Peinture de boiseries, portes et volets",
      "Traitement et peinture anti-humidité",
    ],
    painPoints: [
      "obtenir des finitions impeccables, sans traces ni bavures",
      "rafraîchir son intérieur sans tout salir ni tout déménager",
      "rénover une façade défraîchie par le temps",
      "respecter le budget et les délais annoncés",
      "retrouver un logement propre et rangé après le chantier",
    ],
    signals: [
      "rush des rénovations intérieures avant l'hiver et les fêtes",
      "saison des façades et travaux extérieurs aux beaux jours",
      "remises en peinture entre deux locations (été, rentrée)",
      "rafraîchissements avant une vente ou une mise en location",
    ],
    faq: [
      {
        q: "Protégez-vous mes meubles et mes sols ?",
        a: "Systématiquement. Je bâche, je protège et je laisse le chantier propre chaque soir. Tu retrouves ton logement nickel à la fin, pas un capharnaüm.",
      },
      {
        q: "Préparez-vous les murs avant de peindre ?",
        a: "Oui, la préparation fait 80 % du résultat : rebouchage, ponçage, sous-couche. C'est ce qui garantit des finitions durables et sans défaut.",
      },
      {
        q: "Faites-vous aussi les façades ?",
        a: "Oui, je traite et peins les façades, y compris les enduits décoratifs et le traitement de l'humidité, pour redonner un coup de neuf à l'extérieur.",
      },
      {
        q: "Donnez-vous un devis avant de commencer ?",
        a: "Toujours. Après avoir vu les surfaces et l'état des supports, je remets un devis clair avec le détail des travaux, des produits et des délais.",
      },
    ],
    keywords: [
      "peintre en bâtiment",
      "peinture intérieure",
      "rénovation peinture",
      "peinture façade",
      "pose papier peint",
      "enduit décoratif",
      "rafraîchissement appartement",
    ],
  },
];

// ── Lookup helpers ─────────────────────────────────────────────────────────
// Relocalisés depuis l'ancien compose.ts (moteur de composition supprimé).
// Servent aux pages fiche-métier `/metiers` et au sitemap.
export function getMetier(slug: string): Metier | undefined {
  return metiers.find((m) => m.slug === slug);
}

export function metierSlugs(): string[] {
  return metiers.map((m) => m.slug);
}
