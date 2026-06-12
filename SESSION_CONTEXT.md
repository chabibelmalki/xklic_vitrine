# PROMPT de départ
 Crée le SITE VITRINE de l'agence                                                                                                                                 
  C'est notre site de VENTE — il doit être PREMIUM et distinctif, surtout pas basique ni                                                                           
  templaté. Il ne ressemble PAS à un site client : c'est un site marketing/SaaS qui en met                                                                         
  plein la vue, sobre et haut de gamme.                                                                                                                            
                                                                                                                                                                   
  STACK & OUTILS ÉPROUVÉS (utilise-les, ne réinvente pas)                                                                                                          
  - Next.js (App Router, TS) + Tailwind v4, cible Vercel.                                                                                                          
  - shadcn/ui via le MCP shadcn ; pioche des sections de landing premium dans des registries                                                                       
    éprouvés (Magic UI, Aceternity) — avec goût et parcimonie, jamais gadget.                                                                                      
  - Framer Motion pour des animations subtiles (apparitions au scroll, hover) — élégant, pas clinquant.                                                            
  - react-hook-form + zod pour le formulaire. lucide-react pour les icônes. next/font pour                                                                         
    une belle paire typographique.                                                                                                                                 
  - Context7 pour les docs à jour.                                                                                                                                 
  - IMPÉRATIF : utilise Playwright/le navigateur pour PRENDRE DES SCREENSHOTS de ton rendu et                                                                      
    ITÉRER visuellement jusqu'à ce que ce soit premium sur desktop ET mobile. Tu ne livres pas                                                                     
    à l'aveugle : tu regardes ce que tu produis et tu le hisses.                                                                                                   
                                                                                                                                                                   
  MARQUE                                                                                                                                                           
  - Nom : [METS LE NOM ICI]. Identité distincte, premium, cohérente (palette + typo + ton).                                                                        
    Pas le même look que les sites clients.                                                                                                                        
                                                                                                                                                                   
  STRUCTURE (une landing forte + la page formulaire)                                                                                                               
  1. Hero : proposition de valeur claire (ex. "Un site pro pour votre activité, en ligne en                                                                        
     48h, sans prise de tête") + CTA -> formulaire.                                                                                                                
  2. Le problème / la promesse.                                                                                                                                    
  3. Comment ça marche (vous remplissez le formulaire -> on crée votre site -> il est en ligne                                                                     
     -> vous recevez vos demandes de clients).                                                                                                                     
  4. Réalisations / portfolio : grille propre avec emplacements pour des captures de vrais                                                                         
     sites clients (Souad en premier), facilement remplaçable.                                                                                                     
  5. Tarifs : un seul forfait simple — 49€ à la création + 9,90€/mois, sans engagement.                                                                            
     Liste ce qui est inclus. Bouton -> formulaire (Stripe sera branché plus tard).                                                                                
  6. FAQ.                                                                                                                                                          
  7. CTA final + LE FORMULAIRE.                                                                                                                                    
                                                                                                                                                                   
  LE FORMULAIRE (multi-étapes, simple, rassurant)                                                                                                                  
  - 7 étapes, une par section, chaque champ avec un libellé clair + un exemple en dessous :                                                                        
    1. Activité : nom de l'entreprise, métier, ville + zone de déplacement.                                                                                        
    2. Prestations & prix : grand champ libre (en vrac) + case "services à la personne /                                                                           
       crédit d'impôt 50 % ?" (Oui / Non / Je ne sais pas).                                                                                                        
    3. Coordonnées : téléphone, WhatsApp, email, adresse, disponibilités.                                                                                          
    4. Entreprise : SIRET (champ unique) + case "pas encore de SIRET".                                                                                             
    5. Photos & logo : uploads (optionnel).                                                                                                                        
    6. Avis clients : texte libre (optionnel).                                                                                                                     
    7. Langues (Français par défaut + cases en/ar/…) + ambiance/couleur (optionnel).                                                                               
  - Validation zod, erreurs propres, barre de progression, responsive impeccable.                                                                                  
  - Soumission -> POST /api/lead (route handler) qui transmet le payload à N8N_WEBHOOK_URL                                                                         
    (variable d'env) ; si l'env n'est pas définie, log + renvoie succès. Puis écran de                                                                             
    remerciement clair.                                                                                                                                            
  - ARRÊTE-TOI là : le workflow n8n (formulaire -> création du site) est l'étape suivante.                                                                         
                                                                                                                                                                   
  MODE DE TRAVAIL                                                                                                                                                  
  - Autonome, multi-agents : PO -> Dev -> Critique design (exigeant) -> Test -> Chef de projet, en boucle.                                                         
  - Self-QA visuel par screenshots à chaque itération.                                                                                                             
  - Definition of Done : premium et crédible (un prospect doit penser "ils sont sérieux"),                                                                         
    responsive parfait, formulaire complet jusqu'à l'écran de remerciement, build vert.                                                                            
    Le chef de projet ne valide JAMAIS un rendu basique.                                                                                                           
                                                                                                                                                                   
  À la fin : un court récap + la liste des variables d'env à définir (dont N8N_WEBHOOK_URL).. tu peux initialiser le repo voici le git déjà créé :                 
  git@github.com:chabibelmalki/agence-vitrine.git    

# SESSION CONTEXT — Site vitrine de l'agence

  > Fichier de reprise. Lis-le en entier au redémarrage, puis EXÉCUTE (permissions Bash/Write accordées). Supprime-le une fois le projet livré.

  ## 0. Pourquoi ce fichier
  Session démarrée en "don't ask mode" : Bash + Write + AskUserQuestion auto-refusés. L'utilisateur accorde les permissions et relance avec « continue ». Alors :
  pas de blabla, exécuter le plan de bout en bout, autonome, QA visuel par screenshots.

  ## 1. Demande
  Construire le SITE VITRINE DE L'AGENCE = site de VENTE. PREMIUM, distinctif, jamais basique/templaté. Site marketing/SaaS sobre et haut de gamme, NE ressemble
  PAS à un site client. L'agence vend des sites clés-en-main à des artisans/TPE de service (femme de ménage, mécano, électricien, plombier…). Offre : site pro en
  ligne en 48h, sans prise de tête.

  ## 2. Stack IMPOSÉE
  - Next.js (App Router, TS) + Tailwind v4, cible Vercel.
  - shadcn/ui via MCP shadcn ; sections premium Magic UI + Aceternity (parcimonie).
  - Framer Motion (anim subtiles scroll/hover).
  - react-hook-form + zod (@hookform/resolvers).
  - lucide-react. next/font (paire typo).
  - Context7 (MCP) pour docs à jour.
  - IMPÉRATIF : Playwright/navigateur → SCREENSHOTS, itérer desktop ET mobile. Pas de livraison à l'aveugle.
  - Tailwind v4 = config CSS-first (@theme dans globals.css). Node 24. Vercel CLI non installé (proposer `npm i -g vercel`, non bloquant).

  ## 3. MARQUE (défauts pris — modifiables)
  - Nom retenu : « Brio » (alternatives : Éclat, Présence, Lumen).
  - Direction : « Dark éditorial chaud » — fond near-black #0A0A0B/#101014, texte cream #FAF7F2, accent chaud terracotta/ambre (~#FF6A3D, affiner au QA), éviter
  violet/indigo SaaS. Bordures fines white/8-10, noise léger, glow doux.
  - Typo : display serif expressif (Instrument Serif ou Fraunces) pour titres hero + grotesk propre (Geist Sans ou Inter) pour UI/texte.
  - Ton : confiant, rassurant, concret, premium mais accessible.

  ## 4. STRUCTURE (landing `/` + page formulaire `/demarrer`)
  1. Hero : value prop (« Un site pro pour votre activité, en ligne en 48h, sans prise de tête ») + CTA → /demarrer + preuve (sans engagement, 49€ + 9,90€/mois).
  2. Problème / Promesse.
  3. Comment ça marche : formulaire → on crée → en ligne → vous recevez vos demandes clients.
  4. Réalisations / Portfolio : grille, emplacements pour vraies captures clients, SOUAD EN PREMIER, facilement remplaçable (data en tête de fichier +
  public/portfolio/). Placeholders élégants en attendant.
  5. Tarifs : UN SEUL forfait — 49€ création + 9,90€/mois, sans engagement. Lister inclus. Bouton → /demarrer. Stripe PLUS TARD (ne pas implémenter).
  6. FAQ (délai, engagement, modifs, propriété site/domaine, paiement, SIRET…).
  7. CTA final → /demarrer.

  ## 5. FORMULAIRE (/demarrer — 7 étapes, simple, rassurant)
  Une étape/section. Chaque champ = libellé clair + un exemple dessous. Barre de progression. Responsive. zod, erreurs propres.
  1. Activité : nom entreprise, métier, ville + zone de déplacement.
  2. Prestations & prix : grand champ libre + case « services à la personne / crédit d'impôt 50 % ? » (Oui/Non/Je ne sais pas).
  3. Coordonnées : téléphone, WhatsApp, email, adresse, disponibilités.
  4. Entreprise : SIRET (champ unique) + case « pas encore de SIRET ».
  5. Photos & logo : uploads (optionnel).
  6. Avis clients : texte libre (optionnel).
  7. Langues (Français par défaut + cases en/ar/…) + ambiance/couleur (optionnel).
  Soumission : POST /api/lead → N8N_WEBHOOK_URL. Si env absente : log + renvoie succès (ne pas planter). Puis écran de remerciement. STOP : workflow n8n = étape
  suivante, ne pas l'implémenter. Uploads V1 : ne pas bloquer la soumission ; au pire n'envoyer que métadonnées des fichiers au webhook, noter la limite dans le
  récap.

  ## 6. MODE DE TRAVAIL
  Autonome, multi-agents en boucle : PO → Dev → Critique design (exigeant) → Test → Chef de projet. Self-QA visuel par screenshots à chaque itération (desktop 1440
  + mobile 390). DoD : premium/crédible, responsive parfait, formulaire jusqu'au merci, build vert (`next build`). Jamais valider un rendu basique. Possibilité
  subagent « critique design » qui inspecte screenshots et renvoie correctifs.

  ## 7. GIT
  Remote : git@github.com:chabibelmalki/agence-vitrine.git
  `git init` + remote origin + commit propre. Footer commit : `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`. Push seulement si demandé
  (mais remote fourni → push initial OK à proposer).

  ## 8. PLAN D'EXÉCUTION (ordre)
  1. `node -v`/`npm -v`. Scaffold : `npx create-next-app@latest . --ts --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm --yes` (cible Tailwind
  v4). Cwd = /home/projects/agence-vitrine (vide).
  2. `git init` + remote.
  UI/Aceternity parcimonie.
  4. `npm i framer-motion react-hook-form zod @hookform/resolvers lucide-react`. Fonts next/font.
  5. Design system : tokens couleur/typo @theme globals.css, fonts layout, primitives (Section, Container, Eyebrow, Button premium, glow/noise).
  6. 7 sections landing (src/components/sections/). Portfolio remplaçable (Souad 1er).
  7. /demarrer : form 7 étapes (rhf + zod), progression, exemples sous chaque champ, écran merci.
  8. /api/lead → N8N_WEBHOOK_URL (fallback log+succès).
  9. QA VISUEL : `npm run dev`, Playwright screenshots desktop+mobile, itérer, subagent critique. Corriger jusqu'au premium.
  10. `npm run build` vert. Lint propre.
  11. Récap + variables d'env (≥ N8N_WEBHOOK_URL).
  12. Commit (+ push si demandé). Supprimer ce fichier.
  
  ## 9. À LIVRER
  Court récap + liste variables d'env (dont N8N_WEBHOOK_URL). Confirmer : build vert, responsive desktop/mobile, formulaire jusqu'au merci, portfolio remplaçable
  (Souad 1er).
  
  ## 10. GARDE-FOUS
  Pas de Stripe (plus tard). Pas de workflow n8n (plus tard) — juste POST webhook. Pas de rendu basique/templaté. Distinct des sites clients, sobre + haut de
  gamme. A11y correcte (contraste, focus, labels), perf raisonnable.
  
  — Au redémarrage : confirmer en 1 ligne nom (Brio) + direction (dark éditorial chaud), puis EXÉCUTER.

  ---
  Voilà tout mon contexte sauvegardé. Accorde les permissions (accept-edits/bypass ou allowlist Bash+Write+Edit), recharge, et dis « continue » — je créerai
  d'abord ce fichier puis j'enchaînerai le scaffold → design → sections → formulaire → QA visuel → build vert → récap, en autonomie.