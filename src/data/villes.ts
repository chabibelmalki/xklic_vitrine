// ─────────────────────────────────────────────────────────────────────────
// Données ATOMIQUES des 20 villes d'Île-de-France couvertes.
// Repères, géoloc, codes postaux : réels (zone de chalandise d'Argenteuil).
// Aucun métier ici : la combinaison ville × métier (compose.ts) crée l'unicité.
// ─────────────────────────────────────────────────────────────────────────

import type { Ville } from "./types";

export const villes: Ville[] = [
  // ───────────────────────────────────────────────────────── Argenteuil ───
  {
    slug: "argenteuil",
    name: "Argenteuil",
    prep: "à Argenteuil",
    dept: "Val-d'Oise",
    deptCode: "95",
    postalCodes: ["95100"],
    population: 110000,
    intro:
      "Quatrième ville d'Île-de-France hors Paris, Argenteuil mêle grands quartiers d'habitat, pavillons et bords de Seine immortalisés par les impressionnistes. Entre le centre-ville autour de la basilique Saint-Denys, les quartiers du Val Notre-Dame, d'Orgemont et du Val d'Argent, la demande locale est forte et continue. Bien reliée à Paris Saint-Lazare par le Transilien, la ville attire autant les familles que les actifs, avec un parc de logements varié — immeubles, copropriétés, pavillons — qui génère un flux constant de besoins d'entretien, de dépannage et de travaux du quotidien.",
    landmarks: [
      "Basilique Saint-Denys",
      "Bords de Seine et parc des Berges",
      "Quartier du Val Notre-Dame",
      "Quartier d'Orgemont",
      "Marché du centre-ville",
      "Gare d'Argenteuil",
    ],
    geo: { lat: 48.9472, lng: 2.2467 },
    nearby: ["bezons", "sartrouville", "houilles", "gennevilliers", "ermont"],
  },

  // ───────────────────────────────────────────────────────────── Paris ────
  {
    slug: "paris",
    name: "Paris",
    prep: "à Paris",
    dept: "Paris",
    deptCode: "75",
    postalCodes: [
      "75001",
      "75008",
      "75011",
      "75015",
      "75017",
      "75018",
      "75019",
      "75020",
    ],
    population: 2100000,
    intro:
      "Capitale dense et exigeante, Paris concentre une demande énorme et permanente, des immeubles haussmanniens aux petites copropriétés des arrondissements populaires. Les contraintes y sont propres à la ville : appartements anciens, parties communes, gardiens, accès difficiles, stationnement compliqué. Du nord-est animé (18e, 19e, 20e) aux quartiers résidentiels de l'ouest, chaque arrondissement a ses besoins. La proximité immédiate avec la boucle nord des Hauts-de-Seine et du Val-d'Oise fait de Paris un prolongement naturel pour les artisans installés à ses portes, capables d'y intervenir vite.",
    landmarks: [
      "Quartiers du nord-est (18e, 19e, 20e)",
      "Immeubles haussmanniens",
      "Périphérique et portes de Paris",
      "Gare Saint-Lazare",
      "Boucle nord des arrondissements",
    ],
    geo: { lat: 48.8566, lng: 2.3522 },
    nearby: ["saint-denis", "aubervilliers", "courbevoie", "asnieres-sur-seine", "montreuil"],
  },

  // ───────────────────────────────────────────────────────────── Cergy ────
  {
    slug: "cergy",
    name: "Cergy",
    prep: "à Cergy",
    dept: "Val-d'Oise",
    deptCode: "95",
    postalCodes: ["95000"],
    population: 67000,
    intro:
      "Cœur de la ville nouvelle de Cergy-Pontoise, Cergy est une ville jeune, étudiante et en mouvement, organisée autour de la préfecture, de l'université et de la base de loisirs au bord de l'Oise. L'habitat y est récent et varié : grands ensembles de Cergy-Préfecture, quartiers résidentiels de Cergy-le-Haut et du Hazay, pavillons et résidences neuves. Cette population mêlée de familles, d'étudiants et de jeunes actifs génère des besoins constants en services à domicile, dépannages et petits travaux, sur un territoire étendu bien desservi par le RER A et la ligne L.",
    landmarks: [
      "Cergy-Préfecture",
      "Base de loisirs de Cergy-Pontoise",
      "Université CY Cergy Paris",
      "Quartier de l'Axe Majeur",
      "Cergy-le-Haut",
      "Bords de l'Oise",
    ],
    geo: { lat: 49.0361, lng: 2.0631 },
    nearby: ["franconville", "ermont", "sarcelles"],
  },

  // ──────────────────────────────────────────────────────────── Sarcelles ──
  {
    slug: "sarcelles",
    name: "Sarcelles",
    prep: "à Sarcelles",
    dept: "Val-d'Oise",
    deptCode: "95",
    postalCodes: ["95200"],
    population: 60000,
    intro:
      "Sarcelles est une ville populaire et cosmopolite, célèbre pour son Grand Ensemble, l'un des plus emblématiques de la région, et pour son village historique préservé autour de l'église Saint-Pacôme. Entre les tours et barres rénovées, les pavillons du vieux Sarcelles et les commerces très animés du quartier des Flanades, la densité de population crée une demande quotidienne soutenue. Bien reliée par le RER D et le Transilien, la ville rassemble une mosaïque de familles et de travailleurs aux besoins concrets : entretien des logements, dépannages, petits et grands travaux.",
    landmarks: [
      "Le Grand Ensemble",
      "Village historique de Sarcelles",
      "Église Saint-Pacôme",
      "Quartier des Flanades",
      "Gare de Garges-Sarcelles",
    ],
    geo: { lat: 48.9956, lng: 2.3786 },
    nearby: ["saint-denis", "cergy", "ermont", "aubervilliers"],
  },

  // ────────────────────────────────────────────────────────── Franconville ─
  {
    slug: "franconville",
    name: "Franconville",
    prep: "à Franconville",
    dept: "Val-d'Oise",
    deptCode: "95",
    postalCodes: ["95130"],
    population: 37000,
    intro:
      "Adossée à la forêt de Montmorency, Franconville est une ville résidentielle prisée pour son cadre verdoyant et ses quartiers pavillonnaires. Le centre-ville commerçant, les zones d'activité et les résidences récentes côtoient des maisons individuelles avec jardins, ce qui crée une vraie demande d'entretien d'extérieurs, de travaux et de services à domicile. Desservie par la gare Franconville-Le Plessis-Bouchard sur la ligne H, la commune attire des familles à la recherche d'un compromis entre nature et accès rapide à Paris, avec des besoins réguliers liés à la maison et au jardin.",
    landmarks: [
      "Forêt de Montmorency",
      "Centre-ville et le Vieux Marché",
      "Quartiers pavillonnaires",
      "Gare de Franconville-Le Plessis-Bouchard",
      "Parc Cadet de Vaux",
    ],
    geo: { lat: 48.9886, lng: 2.2289 },
    nearby: ["ermont", "cergy", "argenteuil"],
  },

  // ───────────────────────────────────────────────────────────── Ermont ───
  {
    slug: "ermont",
    name: "Ermont",
    prep: "à Ermont",
    dept: "Val-d'Oise",
    deptCode: "95",
    postalCodes: ["95120"],
    population: 30000,
    intro:
      "Ermont est une ville résidentielle de la vallée de Montmorency, appréciée pour sa tranquillité et son excellente desserte ferroviaire — c'est un véritable nœud, avec les gares d'Ermont-Eaubonne et d'Ermont-Halte reliant Paris en quelques minutes par les lignes H, J, C et le RER. Son tissu mêle pavillons, petites copropriétés et commerces de centre-ville, avec une population de familles et d'actifs. Cette proximité de Paris combinée à un habitat à taille humaine entretient une demande constante de services du quotidien : entretien, dépannage et travaux dans les maisons comme dans les appartements.",
    landmarks: [
      "Gare d'Ermont-Eaubonne",
      "Centre-ville d'Ermont",
      "Quartier des Chênes",
      "Parc de la mairie",
      "Vallée de Montmorency",
    ],
    geo: { lat: 48.9908, lng: 2.2603 },
    nearby: ["franconville", "argenteuil", "sarcelles", "cergy"],
  },

  // ───────────────────────────────────────────────────────────── Bezons ───
  {
    slug: "bezons",
    name: "Bezons",
    prep: "à Bezons",
    dept: "Val-d'Oise",
    deptCode: "95",
    postalCodes: ["95870"],
    population: 30000,
    intro:
      "Posée sur la rive droite de la Seine, juste en face de Nanterre, Bezons est une ville en pleine mutation, marquée par l'arrivée du tramway T2 qui la relie directement à La Défense. Entre les pôles tertiaires modernes, les quartiers d'habitat rénovés et les bords de Seine réaménagés, la commune attire de nouveaux habitants tout en conservant son tissu populaire. Cette population active et familiale, répartie entre immeubles et pavillons, génère une demande régulière de services à domicile et de dépannages, à deux pas d'Argenteuil et du nord des Hauts-de-Seine.",
    landmarks: [
      "Terminus du tramway T2",
      "Bords de Seine",
      "Quartier du Val Notre-Dame (rive bezonnaise)",
      "Centre-ville de Bezons",
      "Pont de Bezons",
    ],
    geo: { lat: 48.9244, lng: 2.2156 },
    nearby: ["argenteuil", "nanterre", "houilles", "colombes", "sartrouville"],
  },

  // ──────────────────────────────────────────────────────────── Nanterre ──
  {
    slug: "nanterre",
    name: "Nanterre",
    prep: "à Nanterre",
    dept: "Hauts-de-Seine",
    deptCode: "92",
    postalCodes: ["92000"],
    population: 96000,
    intro:
      "Préfecture des Hauts-de-Seine, Nanterre est une ville à deux visages : d'un côté le quartier d'affaires de La Défense et ses gratte-ciel, de l'autre des quartiers résidentiels, l'université et un centre-ville en pleine rénovation autour du futur cœur de quartier. Cette diversité — bureaux, grands ensembles, pavillons, résidences neuves le long de la Seine — crée une demande dense et variée. Très bien desservie par le RER A, le RER E et le tramway, la ville rassemble étudiants, cadres et familles, avec des besoins permanents en entretien, dépannage et travaux, du studio au pavillon.",
    landmarks: [
      "La Défense (côté Nanterre)",
      "Préfecture des Hauts-de-Seine",
      "Université Paris Nanterre",
      "Parc André-Malraux",
      "Quartier des Provinces Françaises",
      "Arena Nanterre La Défense",
    ],
    geo: { lat: 48.8924, lng: 2.2069 },
    nearby: ["courbevoie", "colombes", "bezons", "asnieres-sur-seine", "gennevilliers"],
  },

  // ──────────────────────────────────────────────────────────── Colombes ──
  {
    slug: "colombes",
    name: "Colombes",
    prep: "à Colombes",
    dept: "Hauts-de-Seine",
    deptCode: "92",
    postalCodes: ["92700"],
    population: 86000,
    intro:
      "L'une des plus grandes villes des Hauts-de-Seine, Colombes est une commune résidentielle et familiale, organisée autour de plusieurs centralités — le centre historique, le quartier de la gare, les Fossés-Jean, l'Europe. Son habitat très varié, des pavillons aux résidences récentes en passant par les copropriétés, en fait un terrain idéal pour les services du quotidien. Bien reliée par le Transilien (lignes J et L) et le tramway T2 tout proche, la ville mêle classes moyennes, familles et jeunes actifs, avec une demande constante d'entretien de logements, de dépannages et de petits travaux.",
    landmarks: [
      "Centre historique de Colombes",
      "Quartier des Fossés-Jean",
      "Stade Yves-du-Manoir",
      "Parc Lagravère",
      "Quartier de l'Europe",
      "Gare de Colombes",
    ],
    geo: { lat: 48.9236, lng: 2.2522 },
    nearby: ["asnieres-sur-seine", "gennevilliers", "nanterre", "courbevoie", "bezons"],
  },

  // ───────────────────────────────────────────────── Asnières-sur-Seine ───
  {
    slug: "asnieres-sur-seine",
    name: "Asnières-sur-Seine",
    prep: "à Asnières-sur-Seine",
    dept: "Hauts-de-Seine",
    deptCode: "92",
    postalCodes: ["92600"],
    population: 87000,
    intro:
      "Aux portes de Paris, Asnières-sur-Seine est une ville prisée, élégante par endroits et populaire ailleurs, célèbre pour ses villas de bord de Seine et son patrimoine art déco. Entre le quartier des Grésillons en pleine transformation, le centre-ville commerçant et les rives de Seine recherchées, la demande y est forte et exigeante. Très proche de Paris et de Clichy, parfaitement desservie par le Transilien et le tramway, la commune attire une population de jeunes cadres et de familles, avec un parc d'appartements anciens et de copropriétés qui réclame entretien, dépannage et travaux réguliers.",
    landmarks: [
      "Bords de Seine et villas d'Asnières",
      "Quartier des Grésillons",
      "Centre-ville et hôtel de ville",
      "Gare d'Asnières-sur-Seine",
      "Parc Robinson",
    ],
    geo: { lat: 48.9189, lng: 2.2861 },
    nearby: ["colombes", "gennevilliers", "courbevoie", "nanterre", "paris"],
  },

  // ──────────────────────────────────────────────────────────── Courbevoie ─
  {
    slug: "courbevoie",
    name: "Courbevoie",
    prep: "à Courbevoie",
    dept: "Hauts-de-Seine",
    deptCode: "92",
    postalCodes: ["92400"],
    population: 82000,
    intro:
      "Adossée à La Défense, Courbevoie est une ville dense et dynamique, l'une des plus peuplées au kilomètre carré de France. Entre le quartier d'affaires, le centre historique de Bécon-les-Bruyères, le Faubourg de l'Arche et les bords de Seine, elle mêle gratte-ciel, immeubles anciens et résidences cossues. Cette population de cadres, de familles et de jeunes actifs, logée surtout en appartement, génère une demande continue de services du quotidien. Idéalement reliée à Paris par le RER, le Transilien et le métro tout proche, la ville offre un flux régulier de besoins d'entretien, de dépannage et de rénovation.",
    landmarks: [
      "La Défense (côté Courbevoie)",
      "Bécon-les-Bruyères",
      "Faubourg de l'Arche",
      "Bords de Seine et île de la Jatte",
      "Parc de Bécon",
      "Gare de Courbevoie",
    ],
    geo: { lat: 48.8975, lng: 2.2564 },
    nearby: ["nanterre", "asnieres-sur-seine", "colombes", "gennevilliers", "paris"],
  },

  // ────────────────────────────────────────────────────────── Gennevilliers ─
  {
    slug: "gennevilliers",
    name: "Gennevilliers",
    prep: "à Gennevilliers",
    dept: "Hauts-de-Seine",
    deptCode: "92",
    postalCodes: ["92230"],
    population: 49000,
    intro:
      "Située dans la boucle nord de la Seine, Gennevilliers est une ville à la fois industrielle et résidentielle, marquée par son grand port autonome — le premier port fluvial d'Île-de-France — et par ses quartiers d'habitat en pleine rénovation. Entre le centre-ville, les Grésillons, le Luth et la zone d'activités, la commune mêle population ouvrière, familles et nouveaux habitants. Désormais connectée à Paris par le métro ligne 13 et le tramway T1, elle voit ses besoins en services à domicile et en travaux progresser, portés par un parc de logements varié et un tissu d'habitants aux demandes très concrètes.",
    landmarks: [
      "Port de Gennevilliers",
      "Quartier du Luth",
      "Quartier des Grésillons",
      "Parc des Chanteraines",
      "Terminus métro ligne 13 (Les Courtilles)",
    ],
    geo: { lat: 48.9333, lng: 2.2956 },
    nearby: ["asnieres-sur-seine", "colombes", "argenteuil", "nanterre", "saint-denis"],
  },

  // ──────────────────────────────────────────────────────────── Saint-Denis ─
  {
    slug: "saint-denis",
    name: "Saint-Denis",
    prep: "à Saint-Denis",
    dept: "Seine-Saint-Denis",
    deptCode: "93",
    postalCodes: ["93200", "93210"],
    population: 113000,
    intro:
      "Ville d'histoire et ville en pleine effervescence, Saint-Denis abrite la basilique nécropole des rois de France et le Stade de France, tout en accueillant l'un des plus grands chantiers de transformation urbaine de la région. Entre le centre médiéval, le marché parmi les plus importants d'Île-de-France, La Plaine Saint-Denis devenue pôle tertiaire, et les quartiers très peuplés du nord, la demande locale est immense et diverse. Connectée à Paris par le métro 13, le RER B et D et le tramway, la ville rassemble une population jeune et cosmopolite aux besoins quotidiens en entretien, dépannage et travaux.",
    landmarks: [
      "Basilique-cathédrale de Saint-Denis",
      "Stade de France",
      "La Plaine Saint-Denis",
      "Marché de Saint-Denis",
      "Canal Saint-Denis",
      "Université Paris 8 (toute proche)",
    ],
    geo: { lat: 48.9362, lng: 2.3574 },
    nearby: ["aubervilliers", "sarcelles", "gennevilliers", "paris", "montreuil"],
  },

  // ─────────────────────────────────────────────────────────── Aubervilliers ─
  {
    slug: "aubervilliers",
    name: "Aubervilliers",
    prep: "à Aubervilliers",
    dept: "Seine-Saint-Denis",
    deptCode: "93",
    postalCodes: ["93300"],
    population: 89000,
    intro:
      "Collée à Paris et à Saint-Denis, Aubervilliers est une ville populaire, dense et commerçante, mondialement connue pour ses grossistes du quartier de la Haie-Coq et son immense activité de négoce. Entre le centre-ville, le Fort d'Aubervilliers, les Quatre-Chemins et les nouveaux quartiers du Campus Condorcet, la commune se transforme à grande vitesse, désormais reliée par le prolongement du métro 12. Sa population jeune et cosmopolite, logée majoritairement en appartement, génère une demande quotidienne et soutenue de services à domicile, de dépannages et de petits travaux.",
    landmarks: [
      "Quartier des grossistes (Haie-Coq)",
      "Campus Condorcet",
      "Fort d'Aubervilliers",
      "Quartier des Quatre-Chemins",
      "Canal Saint-Denis",
      "Métro ligne 12 (Mairie d'Aubervilliers)",
    ],
    geo: { lat: 48.9146, lng: 2.3823 },
    nearby: ["saint-denis", "paris", "montreuil", "sarcelles"],
  },

  // ──────────────────────────────────────────────────────────── Montreuil ──
  {
    slug: "montreuil",
    name: "Montreuil",
    prep: "à Montreuil",
    dept: "Seine-Saint-Denis",
    deptCode: "93",
    postalCodes: ["93100"],
    population: 111000,
    intro:
      "Aux portes est de Paris, Montreuil est une ville à l'identité forte, à la fois populaire, créative et résidentielle, surnommée le « 21e arrondissement » pour sa proximité et son ambiance. Entre le Bas-Montreuil bohème, le centre-ville, les Murs à Pêches classés et les quartiers résidentiels du haut, la commune mêle ateliers d'artistes, familles, jeunes actifs et habitants de longue date. Très bien reliée par le métro ligne 9, elle conjugue immeubles anciens, pavillons et copropriétés, ce qui entretient une demande riche et continue de services du quotidien, de rénovation et de dépannage.",
    landmarks: [
      "Bas-Montreuil",
      "Murs à Pêches",
      "Centre-ville et mairie de Montreuil",
      "Parc des Beaumonts",
      "Métro ligne 9 (Mairie de Montreuil)",
      "Croix-de-Chavaux",
    ],
    geo: { lat: 48.8638, lng: 2.4485 },
    nearby: ["paris", "aubervilliers", "saint-denis"],
  },

  // ─────────────────────────────────────────────────────────── Sartrouville ─
  {
    slug: "sartrouville",
    name: "Sartrouville",
    prep: "à Sartrouville",
    dept: "Yvelines",
    deptCode: "78",
    postalCodes: ["78500"],
    population: 53000,
    intro:
      "Sur la rive gauche de la Seine, face à Argenteuil, Sartrouville est l'une des plus grandes villes des Yvelines, à la fois résidentielle et bien connectée. Entre le centre-ville autour de la gare RER A, les quartiers pavillonnaires du Plateau et des Richebourgs, et les bords de Seine, la commune attire des familles et des actifs travaillant à Paris ou à La Défense. Son parc de logements, dominé par les maisons individuelles et les petites copropriétés, génère une forte demande d'entretien d'extérieurs, de travaux et de services à domicile, à deux pas d'Argenteuil et de Houilles.",
    landmarks: [
      "Gare de Sartrouville (RER A)",
      "Quartier du Plateau",
      "Quartier des Richebourgs",
      "Bords de Seine",
      "Centre-ville et le Vieux Pays",
    ],
    geo: { lat: 48.9389, lng: 2.1631 },
    nearby: ["houilles", "argenteuil", "bezons", "poissy", "nanterre"],
  },

  // ───────────────────────────────────────────────────────────── Houilles ──
  {
    slug: "houilles",
    name: "Houilles",
    prep: "à Houilles",
    dept: "Yvelines",
    deptCode: "78",
    postalCodes: ["78800"],
    population: 32000,
    intro:
      "Ville résidentielle et familiale des Yvelines, Houilles cultive un esprit village très apprécié, avec un centre-ville commerçant animé et un habitat largement pavillonnaire. Coincée entre Sartrouville et la boucle de la Seine, parfaitement desservie par la gare Houilles-Carrières-sur-Seine (RER A et Transilien), elle attire des familles et des cadres recherchant calme et proximité de Paris et de La Défense. Ce tissu de maisons avec jardins et de petites copropriétés crée une demande régulière d'entretien d'extérieurs, de travaux de rénovation et de services du quotidien.",
    landmarks: [
      "Centre-ville et marché de Houilles",
      "Gare de Houilles-Carrières-sur-Seine",
      "Quartiers pavillonnaires",
      "Parc Charles-de-Gaulle",
      "Place de la Libération",
    ],
    geo: { lat: 48.9269, lng: 2.1875 },
    nearby: ["sartrouville", "argenteuil", "bezons", "poissy"],
  },

  // ──────────────────────────────────────────────────────────── Versailles ──
  {
    slug: "versailles",
    name: "Versailles",
    prep: "à Versailles",
    dept: "Yvelines",
    deptCode: "78",
    postalCodes: ["78000"],
    population: 85000,
    intro:
      "Préfecture des Yvelines et ville royale, Versailles est aussi prestigieuse qu'exigeante, marquée par son château classé au patrimoine mondial et son urbanisme du Grand Siècle. Entre les quartiers historiques de Notre-Dame et Saint-Louis, les hôtels particuliers, les copropriétés haussmanniennes et les quartiers résidentiels de Montreuil et Porchefontaine, la demande locale est aisée et soignée. Reliée à Paris par le RER C et plusieurs gares Transilien, la ville rassemble une population de familles, de cadres et de professions libérales, avec un patrimoine bâti ancien qui réclame un entretien et des travaux de qualité.",
    landmarks: [
      "Château de Versailles",
      "Quartier Notre-Dame et le marché",
      "Quartier Saint-Louis",
      "Quartier de Porchefontaine",
      "Potager du Roi",
      "Gare Versailles Château Rive Gauche",
    ],
    geo: { lat: 48.8049, lng: 2.1204 },
    nearby: ["saint-germain-en-laye", "poissy"],
  },

  // ───────────────────────────────────────────────── Saint-Germain-en-Laye ──
  {
    slug: "saint-germain-en-laye",
    name: "Saint-Germain-en-Laye",
    prep: "à Saint-Germain-en-Laye",
    dept: "Yvelines",
    deptCode: "78",
    postalCodes: ["78100"],
    population: 44000,
    intro:
      "Ville d'art et d'histoire perchée au-dessus de la Seine, Saint-Germain-en-Laye séduit par son château Renaissance, sa célèbre Grande Terrasse de Le Nôtre et sa forêt domaniale. Entre le centre-ville chic et commerçant, les quartiers résidentiels du Bel-Air et du Pecq tout proche, et les belles demeures bordant la forêt, la commune attire une population aisée et exigeante. Desservie par le terminus du RER A, elle rassemble familles, cadres et professions libérales logés dans un patrimoine bâti souvent ancien et de standing, qui appelle un entretien soigné, des travaux de qualité et des services à domicile haut de gamme.",
    landmarks: [
      "Château de Saint-Germain-en-Laye",
      "Grande Terrasse (Le Nôtre)",
      "Forêt domaniale de Saint-Germain",
      "Centre-ville et marché",
      "Quartier du Bel-Air",
      "Terminus du RER A",
    ],
    geo: { lat: 48.8978, lng: 2.0936 },
    nearby: ["poissy", "versailles", "sartrouville"],
  },

  // ──────────────────────────────────────────────────────────── Poissy ──────
  {
    slug: "poissy",
    name: "Poissy",
    prep: "à Poissy",
    dept: "Yvelines",
    deptCode: "78",
    postalCodes: ["78300"],
    population: 38000,
    intro:
      "Au bord de la Seine, Poissy est une ville à l'identité industrielle et patrimoniale, connue pour son usine automobile historique, sa collégiale et la villa Savoye de Le Corbusier. Entre le centre-ville rénové, les quartiers pavillonnaires de Beauregard et Saint-Exupéry, et les nouveaux écoquartiers, la commune se transforme tout en gardant un fort ancrage local. Desservie par le RER A et le Transilien, elle attire familles et actifs travaillant vers Paris et La Défense. Son habitat mêlé de maisons individuelles et de résidences génère une demande régulière de services du quotidien, de travaux et d'entretien.",
    landmarks: [
      "Collégiale Notre-Dame de Poissy",
      "Villa Savoye (Le Corbusier)",
      "Parc Meissonier",
      "Bords de Seine",
      "Centre-ville et marché de Poissy",
      "Gare de Poissy (RER A)",
    ],
    geo: { lat: 48.9294, lng: 2.0411 },
    nearby: ["saint-germain-en-laye", "sartrouville", "houilles", "versailles"],
  },
];
