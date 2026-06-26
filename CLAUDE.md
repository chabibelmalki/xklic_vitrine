@AGENTS.md

# Baserow — base des commandes / clients

Les commandes sont écrites dans **Baserow** (base « xklic »), en **double écriture**
avec Google Sheets pendant la transition. Tant que le cutover n'est pas fait,
**Sheets reste la source de vérité** (c'est lui qui gate les retries Stripe).

## Point d'intégration unique

`src/lib/baserow.ts` → `upsertOrder({ statut, lead, orderId, payment })`, appelé
en parallèle de `appendOrderRow` (sheets.ts) sur :

- `src/app/api/checkout/route.ts` → statut `panier`
- `src/app/api/stripe/webhook/route.ts` → statut `payé`
- `src/app/api/lead/route.ts` → statut `lead` (route non utilisée par l'UI)

## Logique clé (corrige le bug historique de doublons panier/payé)

- **Upsert par `Ref` (= OrderId)** : `panier` crée la fiche, `payé` la met à jour
  (fini l'`append` aveugle qui dupliquait). Idempotent → un renvoi Stripe ne crée
  pas de doublon.
- **Garde-fou contact** : si la fiche n'est pas trouvée par `Ref`, on réutilise une
  fiche **non payée** du même **email OU téléphone** et on réécrit son `Ref`
  (gère « 2 tentatives » et « paiement d'une session périmée »).
- **Statut production auto** : `Prospect` à la création → `À faire` au paiement,
  **sans jamais écraser** un statut avancé par l'équipe (En prod / En ligne / SAV).
- **Liens natifs** : les Paiements/Produits créés posent le lien `Fiche` → ils
  remontent dans la fiche du Dossier.

## Modèle (base « xklic »)

`Dossiers` (1 ligne/client, clé `Ref`) ←─ tables liées `Paiements`, `Production`,
`Notes`, `Produits`. **Production & Notes sont remplies à la MAIN** par l'équipe —
l'app n'y touche pas. Deux statuts distincts : `Statut commande` (lead/panier/payé,
écrit par l'app) ≠ `Statut production` (kanban, équipe).

## Pièges

- Un champ **menu déroulant** (single-select) renvoie un objet `{ value }` via
  l'API, pas une chaîne → toujours comparer via `cellStr()`.
- Env requis : `BASEROW_TOKEN`, `BASEROW_TABLE_*` (5 IDs), `BASEROW_API_URL` — dans
  `.env.local` **et** Vercel. Absents → Baserow ignoré proprement (pas de crash,
  Sheets continue).

## Cutover (le jour où on coupe Sheets)

1. Basculer le retry `500` du webhook de Sheets **vers Baserow**.
2. Mettre à jour le texte de l'email de notif (« dans Google Sheets » → Baserow).
3. Retirer les appels Sheets + les clés `GOOGLE_*`.
