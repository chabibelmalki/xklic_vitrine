@AGENTS.md

# Xklic — Vitrine

Site **Next.js 16** (App Router, React 19, Tailwind v4, TypeScript) : la vitrine
commerciale de Xklic **et le tunnel de commande** (formulaire → paiement Stripe →
enregistrement de la commande). À ne pas confondre avec les sites clients, qui
sont générés par le repo voisin `xklic_engine`.

> ⚠️ Next.js 16 a des breaking changes vs les versions connues — lire la consigne
> d'**AGENTS.md** (consulter `node_modules/next/dist/docs/`) avant d'écrire du code Next.

## Lancer / vérifier

```bash
npm install
npm run dev      # next dev
npm run build    # next build — lance ESLint (un échec lint casse le build Vercel)
npm run lint     # eslint seul
npm start        # prod en local
```

Pas de suite de tests (Playwright est en dépendance mais sans tests dédiés).
**Vérifier un changement = `npm run build`** (typecheck + lint) + parcours manuel
du formulaire `/demarrer`.

## Le tunnel de commande (cœur métier)

Parcours réel : `/demarrer` → formulaire multi-étapes → paiement → enregistrement.

1. **Formulaire** — `src/components/form/lead-form.tsx` (+ `steps.tsx`, `fields.tsx`).
   Multi-étapes, validé par **Zod** (`src/lib/lead-schema.ts`), anti-robot
   **Cloudflare Turnstile**. Les images (logo/photos) sont téléversées vers
   **Vercel Blob** via `POST /api/blob/upload` **avant** la soumission (on envoie
   ensuite les URLs Blob, pas les fichiers).
2. **`POST /api/checkout`** — valide le lead, **persiste la commande** dans Vercel
   Blob (`src/lib/orders.ts` ; pas de base de données — l'URL Blob voyage dans les
   `metadata` Stripe pour survivre au paiement), capture le lead en statut
   **`panier`** (double écriture, cf. ci-dessous), puis crée une **session Stripe
   Checkout** en mode `subscription` (mensuel + frais d'installation one-time,
   essai 30 j, codes promo activés). Renvoie l'URL de redirection.
3. **Stripe Checkout** → succès → `/merci` : page **informative seule, aucun effet
   de bord** (la redirection n'est pas fiable).
4. **`POST /api/stripe/webhook`** — **seul point qui confirme un paiement**. Vérifie
   la signature Stripe (sur le corps **brut**), écoute `checkout.session.completed`,
   recharge la commande via l'URL Blob en `metadata`, écrit le statut **`payé`**,
   puis envoie un mail (Resend). Idempotent côté données.

Routes annexes : `POST /api/lead` (capture simple, statut `lead` — **non utilisée
par l'UI actuelle**) ; `POST /api/contact` (formulaire de contact → email).

## Persistance : double écriture Google Sheets + Baserow

Migration en cours **Sheets → Baserow**. Pendant la transition, **double écriture**
sur les 3 routes ; **Google Sheets reste la source de vérité** : c'est l'échec de
son écriture qui renvoie `500` au webhook (→ retry Stripe). Baserow est best-effort.

- **`src/lib/sheets.ts`** → `appendOrderRow()` : **append** d'une ligne (compte de
  service Google, JWT RS256 signé via `node:crypto`, sans dépendance).
- **`src/lib/baserow.ts`** → `upsertOrder()` : **upsert** (corrige le bug de
  doublons `panier`/`payé` que produisait l'append aveugle). Même signature que
  `appendOrderRow`, appelé en parallèle.

Logique Baserow clé :
- **Upsert par `Ref` (= OrderId)** : `panier` crée la fiche, `payé` la met à jour.
- **Garde-fou contact** : si pas trouvé par `Ref`, réutilise une fiche **non payée**
  de même email/téléphone et réécrit son `Ref` (gère 2 tentatives / session périmée).
- **Statut production auto** : `Prospect` à la création → `À faire` au paiement,
  **sans jamais écraser** un statut avancé par l'équipe (En prod / En ligne / SAV).
- **Liens natifs** : les Paiements/Produits créés posent le lien `Fiche`.
- ⚠️ Un champ **menu déroulant** (single-select) Baserow renvoie un objet `{value}`
  via l'API → toujours comparer via le helper `cellStr()`.

Modèle Baserow (base « xklic ») : `Dossiers` (clé `Ref`) ←─ tables liées
`Paiements`, `Production`, `Notes`, `Produits`. **`Production` et `Notes` sont
remplies à la MAIN** par l'équipe (l'app n'y touche pas). Deux statuts distincts :
`Statut commande` (lead/panier/payé, écrit par l'app) ≠ `Statut production` (kanban).

## Organisation du repo

- `src/app/` — routes App Router : pages marketing + SEO programmatique
  (`metiers/[metier]/[ville]`, `zones/[ville]`, `creer-site-<metier>`, `blog/…`,
  pages légales) et **routes API** `api/{checkout,stripe/webhook,lead,contact,blob/upload}`.
- `src/lib/` — logique serveur : `lead-schema.ts` (Zod), `orders.ts` (Blob),
  `sheets.ts`, `baserow.ts`, `stripe.ts`, `email.ts` (Resend), `turnstile.ts`, `seo.ts`.
- `src/components/` — `form/` (tunnel), `sections/` (blocs de page), `site/`, `ui/`.
- `src/data/` — contenu SEO (métiers, villes, articles…).

## Variables d'environnement

`.env.local` (gitignoré ; cf. `.env.example`). Toutes les intégrations externes
sont **best-effort** : env absente → fonctionnalité ignorée proprement, le parcours
visiteur ne casse jamais. À reporter dans Vercel (Production + Preview).

- **Stripe** : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `STRIPE_PRICE_{SITE,GOOGLE,HAUT_GOOGLE}_{MONTHLY,SETUP}`, `STRIPE_TVA_RATE_ID` (opt).
- **Google Sheets** : `GOOGLE_SERVICE_ACCOUNT_JSON` **ou**
  (`GOOGLE_SERVICE_ACCOUNT_EMAIL` + `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`),
  `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB` (défaut « Leads »).
- **Baserow** : `BASEROW_TOKEN`, `BASEROW_API_URL` (défaut `https://api.baserow.io`),
  `BASEROW_TABLE_DOSSIERS`, `BASEROW_TABLE_PAIEMENTS`, `BASEROW_TABLE_PRODUITS`
  (l'app n'écrit pas Production/Notes).
- **Email (Resend)** : `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_TO`.
- **Turnstile** : `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- **Uploads** : `BLOB_READ_WRITE_TOKEN` (Vercel Blob).
- **Divers** : `NEXT_PUBLIC_SITE_URL` (défaut `https://xklic.com`), `AGENCE_ENGINE_URL`.

## Cutover (le jour où on coupe Sheets)

1. Basculer le retry `500` du webhook de Sheets **vers Baserow**.
2. Mettre à jour le texte du mail de notif (« Google Sheets » → Baserow).
3. Retirer les appels Sheets + les clés `GOOGLE_*`.

## Autres docs (statut)

- **`AGENTS.md`** — avertissement Next.js 16 (à lire avant de coder). **Vivant.**
- `RESEAU_CHANTIER.md` — **roadmap** d'un futur annuaire prestataires (non implémenté).
