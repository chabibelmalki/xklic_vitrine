# QA Report — Xklic SEO multi-page buildout

> 📌 **Snapshot daté (2026-06-21)** — rapport QA d'un build SEO précis. Conservé comme
> trace historique ; son périmètre excluait volontairement le tunnel (Stripe/Sheets/
> Baserow), qui a évolué depuis. Pour l'état actuel, voir `CLAUDE.md`.


**Date:** 2026-06-21
**Auditor:** Agent 5 (Performance & QA — final gate)
**Build:** Next.js 16.2.9, App Router. `npm run build` PASSES (240 pages, `tsc --noEmit` clean).
**Method:** Static source audit + served-HTML audit. Production build served via `npm run start`, pages fetched with `curl`. No chromium/Lighthouse (environment constraint).

## Summary table

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | No stray `.fr`; `contact@xklic.com` renders | **PASS** | `grep "xklic.fr" src/` empty. `contact@xklic.com` renders on home (footer), /demarrer, /contact. No other email variants. |
| 2 | Canonical uniqueness (1 per page, absolute, distinct) | **PASS** | Exactly 1 `<link rel="canonical">` per sampled page, all distinct. Absolute `https://xklic.com/…` once `NEXT_PUBLIC_SITE_URL` is correct (see WARN below). |
| 3 | Title / description uniqueness | **PASS** | All 12 sampled pages have distinct titles & descriptions, including the 3 métier×ville samples (not identical templated strings). |
| 4 | JSON-LD validity + expected @types, no fake ratings | **PASS** | Every block `JSON.parse`s. Expected @types present per page. No `AggregateRating` / `Review` in structured data anywhere. |
| 5 | Sitemap valid, includes new routes, excludes legal | **PASS** | Valid XML (xmllint/minidom OK). 217 `<url>` entries: 180 métier×ville + 20 zones + 9 métier + others. Legal pages excluded (0 matches). |
| 6 | Robots allows `/`, disallows `/api/`, links sitemap | **PASS** | `Allow: /`, `Disallow: /api/`, `Sitemap:` + `Host:` present. |
| 7 | Internal link integrity (no dead slugs) | **PASS** | 0 dead internal links across `src/app`, `src/components`, `src/data`, `src/lib`. 9 métiers / 20 villes / 4 articles / 4 réalisations all resolve. |
| 8 | Conversions intact (/demarrer, tel:, WhatsApp) | **PASS** | Present on home, métier×ville, /tarifs, blog article. `tel:+33663948128`, `wa.me/33663948128`, `/demarrer` all present. |
| 9 | Perf (static assessment) | **PASS (with notes)** | Reasoned LCP/CLS assessment below. No alarming bundle. |
| 10 | A11y quick pass (lang, single h1, alt, focus) | **PASS (after fix)** | `lang="fr"` everywhere, alt on all images, focus-visible ring present. **Fixed:** /tarifs and /faq were missing an `<h1>` (led with `<h2>`). |
| — | Canonical/sitemap/robots host driven by env | **WARN** | See "Environment / launch risk" — not a code bug, but a deploy-time gotcha to verify. |

**Issues found: 3 → Fixed: 3 (missing h1 on /tarifs, missing h1 on /faq, both via one shared-component change). Documented-only: 1 WARN (env var) + minor notes.**

---

## Evidence

### 1. No stray `.fr` / correct email
- `grep -rn "xklic.fr" src/` → no matches.
- `contact@xklic.com` rendered: home ×6, /contact ×10, /demarrer ×2. No `@xklic.fr` or other variants.

### 2. Canonical (per-page, distinct)
Each sampled page = exactly 1 canonical, all distinct paths:
```
/                                   /metiers
/metiers/plomberie                  /zones/argenteuil
/metiers/plomberie/argenteuil       /metiers/menage/paris
/tarifs   /faq   /blog              /blog/combien-coute-un-site-internet-artisan-2026
/realisations                       /realisations/garage-meca-atlas
```
After building with the correct base URL, they render absolute, e.g.:
`<link rel="canonical" href="https://xklic.com/metiers/plomberie/argenteuil">`.
Source of truth: `src/lib/site.ts` (`SITE_URL`, default `https://xklic.com`) + `src/lib/metadata.ts` (`buildMetadata`) + `src/app/layout.tsx` (`metadataBase`).

### 3. Title / description uniqueness (métier×ville not templated-identical)
```
/metiers/plomberie/argenteuil : "Plomberie à Argenteuil (95) : un plombier près de chez toi · Xklic"
/metiers/menage/paris         : "Trouver un professionnel du ménage à Paris | Ménage à domicile Paris · Xklic"
/zones/argenteuil             : "Création de site web à Argenteuil (95) · Xklic"
```
Descriptions likewise distinct per page.

### 4. JSON-LD (@types per page, all parse, no fake ratings)
```
home          : WebSite, Organization, Service, FAQPage
metiers        : WebSite, Organization, BreadcrumbList
plomberie      : WebSite, Organization, Service, BreadcrumbList, FAQPage
zone-argenteuil: WebSite, Organization, BreadcrumbList
plomberie/argenteuil : WebSite, Organization, Service, BreadcrumbList, FAQPage
menage/paris   : WebSite, Organization, Service, BreadcrumbList, FAQPage
tarifs         : WebSite, Organization, Service, BreadcrumbList
faq            : WebSite, Organization, FAQPage, BreadcrumbList
blog           : WebSite, Organization, CollectionPage, BreadcrumbList
blog/[slug]    : WebSite, Organization, BlogPosting, BreadcrumbList
realisations   : WebSite, Organization, CollectionPage
realisations/[slug] : WebSite, Organization, CreativeWork, BreadcrumbList
```
- All blocks `JSON.parse` cleanly.
- Métier×ville uses **`Service` with `areaServed`** (a `City` node with full `PostalAddress` + `GeoCoordinates`) + `BreadcrumbList` + `FAQPage` — a valid alternative to `LocalBusiness`. `provider` references the `#organization` node.
- **No `AggregateRating` / `Review` anywhere** in structured data. (Note: the /tarifs pricing card contains a *visual* "Google result" mock showing "4,9 (87 avis)" — this is plain UI markup, explicitly labelled fictitious in source, NOT JSON-LD, so it does not create a fake-rating rich-result risk.)

### 5. Sitemap (`/sitemap.xml`)
- Valid XML (well-formed, parsed by minidom).
- **217 `<url>` entries**: 180 métier×ville + 20 zones + 9 métier hubs + `/metiers` + home + /tarifs + /faq + /blog + 4 articles + /realisations + 4 réalisations + /contact.
- Spot-checks present: `/metiers/plomberie/argenteuil`, `/metiers/menage/paris`.
- Legal pages **excluded** (`mentions-legales`, `confidentialite` → 0 matches).

### 6. Robots (`/robots.txt`)
```
User-Agent: *
Allow: /
Disallow: /api/
Host: https://xklic.com
Sitemap: https://xklic.com/sitemap.xml
```

### 7. Internal link integrity
Script scanned all `href="/metiers/…"`, `/zones/…`, `/blog/…`, `/realisations/…` in source against the slug lists in `src/data/metiers.ts`, `src/data/villes.ts`, `src/data/articles.ts`, and the réalisations source (`src/lib/realisations.ts` + `src/lib/content.ts`). **0 dead links.** All 4 réalisation links on the listing page return 200 (`atelier-douceur`, `garage-meca-atlas`, `sanad-clean`, `vibe-coaching`). Dynamic/templated hrefs (built from the same data via `generateStaticParams`) are inherently consistent.

### 8. Conversions intact
| Page | /demarrer | tel: | wa.me |
|------|-----------|------|-------|
| home | 6 | yes (`tel:+33663948128`) | yes (`wa.me/33663948128`) |
| /metiers/plomberie/argenteuil | 6 | yes | yes |
| /tarifs | 5 | yes | yes |
| /blog/combien-coute… | 6 | yes | yes |

### 9. Performance (static assessment — no Chrome)
- **Route table:** 240 routes prerendered (Static / SSG). Blog, métiers, zones, réalisations carry ISR `revalidate` (1h–1d) — good for SEO freshness without rebuilds. `/demarrer`, `/api/*` are dynamic (`ƒ`) — correct (form reads searchParams; APIs are server actions/handlers).
- **Bundle (gzipped):** largest shared chunks ≈ 77 KB + 69 KB + 39 KB gz; total of *all* chunks concatenated ≈ 439 KB gz (per-page first-load is a subset, not the whole). This is a healthy size for a marketing site.
- **Client components:** only 8 `"use client"` files, all small/leaf: `header`, `hero`, `reveal`, `faq`, and the form (`lead-form`, `steps`, `fields`, `contact-form`). No large page is a client component — all 240 SEO pages are Server Components. `framer-motion` is the main third-party weight (present in 6 chunks; only loaded where the client leaves use it).
- **Images:** `next/image` used in the portfolio section. Réalisation cards/detail (`src/components/sections/realisation-card.tsx`, `src/app/realisations/[slug]/page.tsx`) use raw `<img>` for **external screenshot-service URLs** with `loading="lazy"` and descriptive `alt` — a reasonable choice since those remote hosts aren't in `next.config` `remotePatterns` (there is no images config). Low CLS risk on those (fixed aspect containers in markup), but adding explicit `width`/`height` or `aspect-ratio` would be a future nicety. Form file-preview `<img>` are client-only, not SEO/LCP relevant.
- **Animations:** CSS/transform-based (aurora/glow in `globals.css`), and `@media (prefers-reduced-motion: reduce)` zeroes out animations + transitions. No layout-shifting JS animations on critical path.
- **Reasoned LCP/CLS verdict:** **Low risk.** Server-rendered HTML, no blocking client page shells, modest JS, lazy images, fonts via `next/font` (display-swap handled by framework). LCP element on content pages is text/hero markup present in initial HTML. CLS risk mainly from the external screenshot `<img>` on réalisation pages — minor, behind lazy load and below the fold.

### 10. A11y quick pass
- `<html lang="fr">` on every sampled page.
- All `<img>` have non-empty `alt` (0 images without alt across samples).
- `*:focus-visible { outline: 2px solid var(--color-ember) }` present in `globals.css`.
- **Single `<h1>` per page after fix** (see below). Home not regressed (still exactly 1 h1).

---

## Fixes applied (small, safe, verified)

**Missing `<h1>` on `/tarifs` and `/faq`.** Both pages led with the section's `<h2>` and had no `<h1>`, because they reuse the shared `Formules` / `Faq` section components (correctly `<h2>` when embedded on the home page, which has its own h1). Fix — added an optional heading-level prop so the same component can render `<h1>` when it is the page's primary heading:

- `src/components/ui/section.tsx` — `SectionHeading` now takes `as?: "h1" | "h2"` (default `"h2"`); renders the dynamic tag instead of a hardcoded `<h2>`.
- `src/components/sections/formules.tsx` — `Formules({ headingAs = "h2" })`, threaded to `SectionHeading as={headingAs}`.
- `src/components/sections/faq.tsx` — `Faq({ headingAs = "h2" })`, threaded likewise.
- `src/app/tarifs/page.tsx` — `<Formules headingAs="h1" />`.
- `src/app/faq/page.tsx` — `<Faq headingAs="h1" />`.

Verified after rebuild: `/tarifs` h1=1, `/faq` h1=1, home h1=1 (no regression). `tsc` still clean (build passed).

---

## Environment / launch risk (WARN — documented, not a code bug)

The served HTML from a plain local `npm run build && npm run start` renders canonicals / sitemap / OG / robots with **`http://localhost:3000`**, because **`.env.local` sets `NEXT_PUBLIC_SITE_URL=http://localhost:3000`** and Next.js gives `.env.local` precedence at build time. `.env.local` is gitignored and **not** deployed to Vercel, and the code default in `src/lib/site.ts` is `https://xklic.com`, so production is correct *as long as* either (a) the code default is relied on, or (b) Vercel's project env sets `NEXT_PUBLIC_SITE_URL=https://xklic.com`.

Proof it is purely an env/build-time artifact (not hardcoded): rebuilding with `NEXT_PUBLIC_SITE_URL=https://xklic.com` produces correct absolute URLs everywhere — verified:
```
canonical /tarifs                  → https://xklic.com/tarifs
canonical /metiers/plomberie/argenteuil → https://xklic.com/metiers/plomberie/argenteuil
sitemap first <loc>                → https://xklic.com/
robots Host / Sitemap              → https://xklic.com
```

Note also: `.env.production` does **not** define `NEXT_PUBLIC_SITE_URL` (it only carries Stripe LIVE keys). So prod will fall back to the code default `https://xklic.com` unless Vercel overrides it — which happens to be correct, but is implicit.

---

## Fix-before-launch checklist

1. **(Verify, not code)** Confirm the Vercel **Production** build does NOT pick up a `localhost` `NEXT_PUBLIC_SITE_URL`. Either set `NEXT_PUBLIC_SITE_URL=https://xklic.com` explicitly in Vercel Production env, or rely on the code default — but do a one-time post-deploy `curl https://xklic.com/sitemap.xml | head` to confirm `<loc>` is `https://xklic.com`. (No code change needed; this report's local build used localhost only because of the gitignored `.env.local`.)
2. **(Security, out of scope for this QA but flagged)** `.env.production` contains **Stripe LIVE secret + webhook secret committed to the repo working tree** (gitignored, so not in git history — confirmed `git ls-files` shows no env files tracked). The file itself even says "importer dans Vercel … puis supprimer ce fichier." Make sure these live keys are in Vercel only and the local file is deleted/rotated as planned. Not touched here (lead/checkout/stripe plumbing is off-limits per scope).

Nothing else blocks launch. Everything in checks 1–10 is PASS (with the 3 h1 fixes applied).

---

## Scope respected
No changes to lead / checkout / Stripe / webhook / Sheets / email plumbing. Only the heading-level prop (5 files, additive + default-preserving) was changed. Build re-verified green after edits.
