// ─────────────────────────────────────────────────────────────────────────
// Contenu RÉDIGÉ À LA MAIN pour les paires métier×ville prioritaires.
//
// Pourquoi : les 180 pages métier×ville sont générées par composition
// déterministe (data/compose.ts). « Unique » ne veut pas dire « utile » :
// Google sait repérer le texte tournant mécaniquement. Pour les paires à plus
// fort potentiel (fort volume × ville où Xklic peut ranker), on remplace le
// contenu généré par du vrai contenu spécifique : problématiques réelles du
// métier dans la ville, exemples concrets, prix indicatifs locaux.
//
// composePair() retourne ce contenu tel quel quand la clé `${metier}-${ville}`
// existe ici. Sinon, il compose comme avant. Le reste des 174 pages reste
// généré — on enrichira selon ce qui remonte à l'indexation.
//
// Clé : `${metier.slug}-${ville.slug}`.
// ─────────────────────────────────────────────────────────────────────────

import type { PairContent } from "./types";

export const handwrittenPairs: Record<string, PairContent> = {
  // ── Plomberie × Argenteuil (home base + métier d'urgence top) ───────────
  "plomberie-argenteuil": {
    title: "Plombier à Argenteuil (95) : le site web pro qui remplit ton planning",
    description:
      "Tu es plombier à Argenteuil ? Xklic te crée un site qui te place sur « plombier Argenteuil » et transforme les recherches urgentes en appels. En ligne en 2h, 49€ puis 9,99€/mois, sans engagement.",
    body: [
      "Argenteuil, c'est la quatrième ville d'Île-de-France hors Paris : 110 000 habitants, et un parc de logements qui fait vivre les plombiers toute l'année. Les copropriétés et immeubles du Val d'Argent, d'Orgemont ou du Val Notre-Dame, les pavillons des bords de Seine, les appartements anciens du centre autour de la basilique Saint-Denys : partout, des installations qui vieillissent, des chauffe-eau qui lâchent et des fuites qui n'attendent pas. La demande est là, continue. La vraie question, c'est de savoir qui les habitants appellent en premier.",
      "Et ce premier appel se joue sur un téléphone. Une fuite sous l'évier un dimanche, un chauffe-eau en panne en plein hiver, des WC bouchés avant l'arrivée d'invités : le client tape « plombier Argenteuil » ou « plombier 95 urgence » et appelle les deux ou trois premiers résultats. S'il ne te trouve pas, il ne sait même pas que tu existes — il appelle ton concurrent.",
      "Les clients d'Argenteuil comparent aussi les prix avant d'appeler. À titre indicatif, sur le secteur, un déplacement tourne autour de 40 à 80 €, une recherche et réparation de fuite entre 90 et 200 €, et le remplacement d'un chauffe-eau plusieurs centaines d'euros main-d'œuvre comprise. Un site clair qui annonce ta zone d'intervention, ton sérieux et « devis gratuit » lève les doutes et fait pencher la balance de ton côté.",
      "Beaucoup de plombiers du secteur ne vivent que du bouche-à-oreille. Ça marche… jusqu'à ce que ça ralentisse. Or Argenteuil bouge : nouvelles familles, actifs qui rejoignent Paris Saint-Lazare en vingt minutes, locataires qui changent. Tous ces gens-là ne connaissent personne — ils cherchent en ligne. Sans site, tu es invisible pour une bonne moitié de ta clientèle potentielle.",
      "Xklic règle ça. On te crée un site de plombier pensé pour Argenteuil et le Val-d'Oise, en ligne en 2 heures : bouton d'appel, WhatsApp, formulaire de contact et fiche optimisée pour Google local. Tu apparais quand on te cherche, les demandes tombent directement chez toi. 49 € à l'installation, puis 9,99 €/mois, sans engagement.",
    ],
    intents: [
      "plombier argenteuil",
      "plombier argenteuil urgence",
      "dépannage plomberie argenteuil",
      "recherche de fuite argenteuil",
      "plombier 95 argenteuil",
      "plombier pas cher argenteuil",
    ],
  },

  // ── Serrurerie × Paris (volume énorme, urgence, enjeu confiance/arnaques) ─
  "serrurerie-paris": {
    title: "Serrurier à Paris : le site web qui inspire confiance (et fait appeler)",
    description:
      "Tu es serrurier à Paris ? Dans une ville saturée d'arnaques, un site pro clair te démarque et rassure avant l'appel. Xklic te place sur « serrurier Paris ». En ligne en 2h, 49€ puis 9,99€/mois.",
    body: [
      "Paris, c'est 2,1 millions d'habitants, des centaines de milliers de portes — haussmanniennes, blindées, à code, avec gardien — et une demande en serrurerie qui ne s'arrête jamais. Porte claquée en sortant les poubelles, serrure forcée après une tentative d'effraction, cylindre à changer après le départ d'un locataire : chaque jour, des Parisiens se retrouvent dehors et cherchent quelqu'un dans la minute.",
      "Mais la serrurerie à Paris traîne une réputation : celle des arnaques. Devis gonflés au téléphone, interventions facturées 800 € pour une porte simplement claquée, sociétés fantômes sans adresse. Résultat : avant d'appeler, le Parisien se méfie. Il cherche un serrurier qui a une vraie identité, des tarifs annoncés, des avis. C'est exactement là qu'un site honnête fait la différence — il te sépare instantanément des arnaqueurs.",
      "Jouer la transparence est ton meilleur argument. À titre indicatif sur Paris, une ouverture de porte claquée se situe souvent entre 90 et 150 € en journée, le changement d'un cylindre entre 100 et 250 € selon la marque, et tout est plus cher la nuit et le week-end. Afficher ces fourchettes et « devis avant intervention » sur ton site, c'est rassurer avant même le premier appel — et c'est ce que tes concurrents louches ne feront jamais.",
      "L'urgence se gagne en haut de Google. Quelqu'un coincé devant chez lui dans le 18e, le 19e ou le 20e tape « serrurier Paris » ou « ouverture de porte » et appelle le premier numéro crédible. Avec un bouton d'appel et un WhatsApp en évidence, tu captes l'intervention au moment exact où le client est prêt à dire oui.",
      "Xklic te crée ce site de serrurier en 2 heures : design pro qui inspire confiance, tarifs indicatifs, zone d'intervention par arrondissement, appel et WhatsApp en un tap, le tout optimisé pour les recherches locales à Paris. 49 € à l'installation, puis 9,99 €/mois, sans engagement — tu arrêtes quand tu veux.",
    ],
    intents: [
      "serrurier paris",
      "ouverture de porte paris",
      "serrurier paris urgence",
      "changement serrure paris",
      "serrurier paris 18",
      "serrurier pas cher paris",
    ],
  },

  // ── Électricité × Argenteuil (triple-down home base) ────────────────────
  "electricite-argenteuil": {
    title: "Électricien à Argenteuil (95) : le site web qui te fait trouver sur Google",
    description:
      "Tu es électricien à Argenteuil ? Mises aux normes, dépannages, rénovations : Xklic te crée un site qui capte la demande locale et fait sonner ton téléphone. En ligne en 2h, 49€ puis 9,99€/mois.",
    body: [
      "À Argenteuil, l'électricité est un métier d'avenir autant que de dépannage. Avec 110 000 habitants et un parc de logements en partie ancien — copropriétés du centre près de la basilique Saint-Denys, immeubles du Val d'Argent et d'Orgemont, pavillons du Val Notre-Dame — les tableaux électriques vétustes, les installations à remettre aux normes et les pannes du quotidien ne manquent jamais. Sans parler des rénovations : beaucoup de propriétaires refont leur logement avant de le louer ou de le revendre.",
      "La demande va de l'urgence (panne de courant, disjoncteur qui saute, prise qui chauffe) au projet planifié (rénovation complète, mise aux normes NF C 15-100, ajout de points lumineux, borne de recharge pour voiture électrique). Chaque type de client cherche différemment : l'un en panique sur son téléphone, l'autre tranquillement le soir en comparant plusieurs électriciens. Ton site doit parler aux deux.",
      "Les habitants d'Argenteuil se renseignent avant de t'appeler. À titre indicatif, la remise aux normes d'un tableau électrique se chiffre souvent entre 800 et 2 000 €, un simple dépannage autour de 80 à 150 €, un diagnostic électrique bien moins. Afficher clairement tes prestations, ton sérieux (assurance décennale, devis gratuit) et ta zone d'intervention, c'est ce qui transforme un visiteur hésitant en client.",
      "Le problème, c'est qu'un électricien sans site reste invisible pour tous ceux qui ne le connaissent pas encore — et à Argenteuil, bien reliée à Paris Saint-Lazare, les nouveaux habitants sont nombreux. Ils cherchent « électricien Argenteuil » sur Google et choisissent ce qu'ils trouvent. Si tu n'y es pas, tu n'existes pas pour eux.",
      "Xklic te met en ligne en 2 heures : un site d'électricien pro, optimisé pour « électricien Argenteuil » et le 95, avec appel direct, WhatsApp, formulaire de devis et présentation claire de tes prestations. Les demandes arrivent chez toi, prêtes à rappeler. 49 € à l'installation, puis 9,99 €/mois, sans engagement.",
    ],
    intents: [
      "électricien argenteuil",
      "mise aux normes électrique argenteuil",
      "dépannage électrique argenteuil",
      "rénovation électrique argenteuil",
      "électricien 95 argenteuil",
      "électricien pas cher argenteuil",
    ],
  },

  // ── Ménage à domicile × Paris (volume + angle crédit d'impôt) ───────────
  "menage-paris": {
    title: "Ménage à domicile à Paris : le site web qui remplit ton agenda",
    description:
      "Aide-ménagère ou société de ménage à Paris ? Xklic te crée un site qui met en avant le crédit d'impôt de 50% et te fait trouver près de tes clients. En ligne en 2h, 49€ puis 9,99€/mois.",
    body: [
      "À Paris, le ménage à domicile est un marché immense : 2,1 millions d'habitants, une majorité d'actifs débordés, beaucoup de couples qui travaillent et de personnes âgées à aider. Des petits studios étudiants aux grands appartements haussmanniens de l'ouest, en passant par les copropriétés du nord-est (18e, 19e, 20e), la demande d'aide-ménagère, de repassage et d'entretien régulier est continue et solvable.",
      "Et tu as un argument que beaucoup oublient de mettre en avant : le crédit d'impôt de 50 %. Pour un Parisien, une prestation affichée à 28 €/h ne coûte réellement que 14 € une fois l'avantage fiscal déduit — et avec l'avance immédiate, il ne fait même plus l'avance de trésorerie. C'est souvent ce qui déclenche la décision. Un site qui explique clairement ce mécanisme convertit bien mieux qu'un simple bouche-à-oreille.",
      "Le ménage, c'est aussi une question de confiance : on laisse entrer quelqu'un chez soi, parfois avec ses clés. Le client parisien veut une personne sérieuse, proche de son quartier, avec des avis rassurants. Ton site rassemble tes prestations (ménage régulier ou ponctuel, repassage, grand nettoyage, vitres), ta zone d'intervention par arrondissement et tes témoignages — tout ce qui lève les doutes avant le premier rendez-vous.",
      "Les Parisiens cherchent « femme de ménage Paris 11 » ou « aide-ménagère près de chez moi » sur leur téléphone, souvent le soir. Sans site, tu comptes uniquement sur le réseau ; avec un site optimisé pour le local, tu apparais pile quand quelqu'un de ton secteur a besoin de toi.",
      "Xklic te crée ce site de ménage à domicile en 2 heures : présentation claire, mise en avant du crédit d'impôt, prise de contact par appel, WhatsApp et formulaire, optimisation pour les recherches locales à Paris. 49 € à l'installation, puis 9,99 €/mois, sans engagement.",
    ],
    intents: [
      "femme de ménage paris",
      "aide ménagère paris",
      "ménage à domicile paris",
      "ménage crédit d'impôt paris",
      "repassage à domicile paris",
      "société de ménage paris",
    ],
  },

  // ── Plomberie × Cergy (ville nouvelle, université, turnover locatif) ─────
  "plomberie-cergy": {
    title: "Plombier à Cergy (95) : le site web qui te place sur Google local",
    description:
      "Tu es plombier à Cergy ? Entre résidences neuves, grands ensembles et turnover étudiant, la demande est forte. Xklic te crée un site qui la capte. En ligne en 2h, 49€ puis 9,99€/mois.",
    body: [
      "Cergy n'est pas une ville comme les autres : cœur de la ville nouvelle de Cergy-Pontoise, elle est jeune, étudiante et en mouvement permanent. 67 000 habitants répartis entre les grands ensembles de Cergy-Préfecture, les résidences récentes de Cergy-le-Haut et du Hazay, et de nombreux logements neufs. Pour un plombier, ça veut dire deux marchés à la fois : des installations récentes qui demandent du SAV et de l'entretien, et un parc locatif où les dépannages s'enchaînent.",
      "La présence de l'université CY Cergy Paris et du RER A crée un turnover locatif énorme. Chaque rentrée, chaque déménagement, ce sont des chauffe-eau à vérifier, des robinetteries à remplacer, des fuites à réparer entre deux locataires. Les bailleurs, agences et propriétaires de Cergy cherchent régulièrement un plombier fiable et réactif — celui qu'ils retrouvent facilement et rappellent.",
      "Comme partout, le client de Cergy compare avant d'appeler. À titre indicatif sur le secteur, un déplacement se situe autour de 40 à 80 €, une réparation de fuite entre 90 et 200 €, le remplacement d'un chauffe-eau plusieurs centaines d'euros. Afficher tes tarifs indicatifs, ta réactivité et « devis gratuit » sur ton site, c'est rassurer une clientèle jeune qui déteste les mauvaises surprises.",
      "Cergy est une ville étendue, bien desservie mais éclatée entre plusieurs quartiers, des bords de l'Oise à l'Axe Majeur. Les habitants cherchent « plombier Cergy » ou « plombier Cergy-le-Haut » sur leur téléphone et appellent le premier résultat crédible. Sans site, tu laisses cette demande à tes concurrents.",
      "Xklic te crée un site de plombier pensé pour Cergy et la ville nouvelle, en ligne en 2 heures : appel direct, WhatsApp, formulaire et optimisation pour Google local. Les demandes arrivent chez toi. 49 € à l'installation, puis 9,99 €/mois, sans engagement.",
    ],
    intents: [
      "plombier cergy",
      "plombier cergy le haut",
      "dépannage plomberie cergy",
      "plombier cergy pontoise",
      "plombier 95 cergy",
      "plombier pas cher cergy",
    ],
  },

  // ── Mécanique auto × Argenteuil (lié au vrai client Garage Méca Atlas) ───
  "mecanique-auto-argenteuil": {
    title: "Garage / mécanicien à Argenteuil (95) : le site web qui amène des clients",
    description:
      "Tu tiens un garage à Argenteuil ? Entretien, réparation, contre-visite : Xklic te crée un site qui te fait trouver et réserver — comme le Garage Méca Atlas. En ligne en 2h, 49€ puis 9,99€/mois.",
    body: [
      "À Argenteuil, la voiture reste reine. Avec 110 000 habitants, beaucoup de familles et d'actifs qui rejoignent toute l'Île-de-France au quotidien, le parc automobile est dense et fortement sollicité. Entretien courant, pannes, pneus, freinage, contre-visites de contrôle technique : un garage sérieux ne manque jamais de travail dans le Val-d'Oise. Encore faut-il que les automobilistes du coin pensent à toi avant d'aller chez un concurrent ou dans une grande enseigne.",
      "On connaît bien ce métier à Argenteuil : le Garage Méca Atlas, client Xklic installé dans la ville, a justement un site qui lui amène des demandes de réparation auto en continu. Le principe est simple — quand quelqu'un cherche « garage Argenteuil » ou « mécanicien près de chez moi », il faut y apparaître, avec les avis, les horaires et un bouton pour appeler ou réserver.",
      "L'automobiliste d'aujourd'hui se renseigne en ligne avant de confier sa voiture. Il compare les avis, regarde si le garage est proche, cherche un ordre de prix. À titre indicatif, une vidange tourne autour de 60 à 120 €, un changement de plaquettes de frein entre 100 et 250 €, une distribution bien plus. Un site qui présente clairement tes prestations et invite au devis met l'automobiliste en confiance et le fait pousser ta porte.",
      "Le garage vit autant de nouveaux clients que de la fidélité. Un site te permet les deux : être trouvé par ceux qui ne te connaissent pas encore (nombreux à Argenteuil, ville qui bouge), et garder le contact avec tes habitués via tes coordonnées, tes horaires et WhatsApp. Sans site, tu dépends uniquement du passage devant ta vitrine.",
      "Xklic te crée le site de ton garage en 2 heures : présentation de tes services, avis clients, horaires, appel et WhatsApp en un tap, optimisé pour « garage Argenteuil » et le 95. Les demandes arrivent directement chez toi. 49 € à l'installation, puis 9,99 €/mois, sans engagement.",
    ],
    intents: [
      "garage argenteuil",
      "mécanicien argenteuil",
      "réparation auto argenteuil",
      "contrôle technique contre visite argenteuil",
      "garage automobile 95 argenteuil",
      "vidange argenteuil",
    ],
  },
};
