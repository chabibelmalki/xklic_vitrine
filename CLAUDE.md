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
   **`panier`** dans le back-office (fire-and-forget, cf. ci-dessous), puis crée
   une **session Stripe
   Checkout** en mode `subscription` (mensuel + frais d'installation one-time,
   essai 30 j, codes promo activés). Renvoie l'URL de redirection.
3. **Stripe Checkout** → succès → `/merci` : page **informative seule, aucun effet
   de bord** (la redirection n'est pas fiable).
4. **`POST /api/stripe/webhook`** — **seul point qui confirme un paiement**. Vérifie
   la signature Stripe (sur le corps **brut**), écoute `checkout.session.completed`,
   recharge la commande via l'URL Blob en `metadata`, écrit le statut **`payé`**
   dans le back-office (**bloquant** : échec → `500` → retry Stripe), puis envoie
   un mail (Resend). Idempotent côté données.

Routes annexes : `POST /api/lead` (capture simple, statut `lead` — **non utilisée
par l'UI actuelle**) ; `POST /api/contact` (formulaire de contact → email).

## Persistance : back-office (API Go → Postgres)

Google Sheets et Baserow sont **retirés** (décision CEO 2026-07-05, cf.
`../CHANTIER-BASEROW-OUT.md`). Le back-office (`xklic-backoffice`, API Go +
Postgres) est la **source de vérité unique**.

- **`src/lib/backoffice.ts`** → `upsertOrder({statut, lead, orderId?, payment?})` :
  UN POST `/v1/public/agency/orders` (header `X-API-Key`), upsert transactionnel
  **côté serveur** par `ref` (= OrderId) : dossier + sync remplaçante des produits
  déclarés + upsert paiement par `stripe_session`. Ne jette jamais, renvoie un
  booléen, timeout 5 s.
- **Règles côté serveur** (plus dans la vitrine) : promotion `Statut production`
  (`Prospect` → `À faire` au paiement, jamais de rétrogradation d'un statut posé
  par l'équipe), idempotence du replay webhook.
- **Politique d'appel** : `/api/checkout` et `/api/lead` = fire-and-forget (un
  échec est logué, le parcours visiteur continue) ; **webhook Stripe = BLOQUANT**
  (échec → `500` → retry Stripe, garantit qu'aucun statut « payé » n'est perdu).
- Cas lead sans commande (`/api/lead`) : pas d'OrderId → `ref` générée
  (`crypto.randomUUID()`).

## Organisation du repo

- `src/app/` — routes App Router : pages marketing + SEO programmatique
  (`metiers/[metier]/[ville]`, `zones/[ville]`, `creer-site-<metier>`, `blog/…`,
  pages légales) et **routes API** `api/{checkout,stripe/webhook,lead,contact,blob/upload}`.
- `src/lib/` — logique serveur : `lead-schema.ts` (Zod), `orders.ts` (Blob),
  `backoffice.ts`, `stripe.ts`, `email.ts` (Resend), `turnstile.ts`, `seo.ts`.
- `src/components/` — `form/` (tunnel), `sections/` (blocs de page), `site/`, `ui/`.
- `src/data/` — contenu SEO (métiers, villes, articles…).

## Variables d'environnement

`.env.local` (gitignoré). Toutes les intégrations externes
sont **best-effort** : env absente → fonctionnalité ignorée proprement, le parcours
visiteur ne casse jamais. À reporter dans Vercel (Production + Preview).

- **Stripe** : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `STRIPE_PRICE_{SITE,GOOGLE,HAUT_GOOGLE}_{MONTHLY,SETUP}`,
  `STRIPE_PRICE_SHOP_{STARTER,PRO,BUSINESS}_MONTHLY` (option boutique, mensuel seul),
  `STRIPE_TVA_RATE_ID` (opt).
- **Back-office** : `BACKOFFICE_API_URL` (API Go, sans slash final),
  `BACKOFFICE_API_KEY` (= `ENGINE_API_KEY` côté back-office).
- **Email (Resend)** : `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_TO`.
- **Turnstile** : `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- **Uploads** : `BLOB_READ_WRITE_TOKEN` (Vercel Blob).
- **Divers** : `NEXT_PUBLIC_SITE_URL` (défaut `https://xklic.com`), `AGENCE_ENGINE_URL`.

## Autres docs (statut)

- **`AGENTS.md`** — avertissement Next.js 16 (à lire avant de coder). **Vivant.**
- `RESEAU_CHANTIER.md` — **roadmap** d'un futur annuaire prestataires (non implémenté).
