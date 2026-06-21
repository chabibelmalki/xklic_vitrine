# Xklic — Annuaire prestataires & base de données clients (spec, pour plus tard)

> Objectif : connecter tous les clients Xklic dans une base unique, exposer un **annuaire public searchable** (SEO + leads croisés entre prestataires), et garder une vue interne pour piloter.

---

## Idée en une phrase

Chaque site client (`*.xklic.com`) devient une **fiche** dans une base centrale. On en tire (1) un annuaire public recherchable par métier/ville, (2) un réseau de recommandation entre prestataires, (3) une base interne de pilotage.

---

## Modèle de données

### `providers` (prestataires = clients Xklic)
| champ | type | note |
|---|---|---|
| id | uuid | |
| slug | text | ex. `sanad-clean` |
| name | text | "SANAD CLEAN" |
| metier | text (fk `metiers`) | |
| metiers_secondaires | text[] | multi-métier |
| ville | text (fk `villes`) | |
| zones_intervention | text[] | rayon / villes couvertes |
| subdomain | text | `sanadclean.xklic.com` |
| phone / whatsapp / email | text | |
| description | text | indexé recherche |
| formule | enum | site / google / haut-google |
| status | enum | active / paused / churned |
| rating / reviews_count | num | sync Google Business |
| siret | text | nullable |
| created_at / updated_at | ts | |
| search_vector | tsvector | full-text (FR) |

### `metiers` / `villes`
Tables de référence (slug, label, intro SEO, géoloc lat/lng pour villes). Servent aussi aux pages programmatiques du site.

### `leads` (demandes clients)
| champ | type |
|---|---|
| id, provider_id, source (form/whatsapp/call), message, contact, status, created_at |

### `referrals` (recommandations entre prestataires)
Un plombier qui n'a pas de dispo recommande un confrère → `from_provider_id`, `to_provider_id`, `lead_id`, `commission?`.

---

## Recherche interne

- **Postgres full-text FR** (`tsvector` + `to_tsquery`, dictionnaire `french`, `unaccent`) → suffisant au début, gratuit, géré dans la même base.
- Filtres : métier, ville, rayon (PostGIS `ST_DWithin` si géoloc), formule, statut, note.
- Si volume/typo-tolérance ↑ plus tard → **Meilisearch** ou **Typesense** (auto-héberge bien sur Scaleway, sync via webhook n8n).
- Recherche publique = annuaire ; recherche interne = même moteur + champs privés (CA, statut paiement).

---

## Surfaces

### 1. Annuaire public `/annuaire`
- `/annuaire` (hub), `/annuaire/[metier]`, `/annuaire/[metier]/[ville]`.
- Chaque fiche = backlink dofollow vers le sous-domaine client → **boost SEO mutuel**.
- Schema `LocalBusiness` par fiche, `ItemList` sur les listings.
- Bénéfice : pages SEO en plus + valeur ajoutée perçue ("rejoindre un réseau").

### 2. Réseau de recommandation
- Un client surchargé/absent peut router une demande vers un confrère du réseau.
- Crée de la rétention (effet réseau) + nouvelle source de leads.

### 3. Back-office interne
- Vue Kanban statuts (active/paused/churned), MRR par formule, leads/mois par client.
- Alertes : client sans lead depuis 30j, avis Google en baisse, paiement échoué.

---

## Stack proposée

- **Base** : Postgres (Supabase ou Scaleway managed) — même écosystème que le reste.
- **Sync fiches** : à chaque onboarding client, n8n (`OQdRsgFnZ47xIDO5`) insère/maj la fiche `providers`.
- **Sync avis/horaires** : Google Business Profile API → cron n8n → maj `rating`, `reviews_count`.
- **API** : routes Next.js (App Router, route handlers) lisant Postgres, ISR pour l'annuaire public.
- **Recherche** : pg full-text d'abord, Meilisearch si besoin.
- **Auth interne** : back-office protégé (NextAuth + rôle admin).

---

## RGPD / légal

- Données prestataires = pro, OK en annuaire public (consentement à l'onboarding, opt-out possible).
- `leads` = données perso clients finaux → durée de conservation limitée, pas en public.
- Mention dans CGV onboarding : "ta fiche peut apparaître dans l'annuaire Xklic".

---

## Roadmap suggérée

1. **V0** : table `providers` + script de remplissage depuis les sous-domaines existants.
2. **V1** : annuaire public `/annuaire` + recherche pg full-text + schema. (gain SEO immédiat)
3. **V2** : back-office interne (pilotage MRR/leads).
4. **V3** : réseau de recommandation entre prestataires.
5. **V4** : Meilisearch + filtres géo avancés si volume.

---

## Lien avec le site

L'annuaire **réutilise** `data/metiers.ts` / `data/villes.ts` du site → une seule source de vérité pour les métiers et villes. Les pages métier×ville du site et les fiches annuaire se maillent entre elles.