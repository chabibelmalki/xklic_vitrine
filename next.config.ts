import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Le repo vit dans un dossier parent contenant d'autres lockfiles ;
  // on fixe la racine pour éviter l'inférence erronée de Turbopack.
  turbopack: {
    root: path.join(__dirname),
  },

  // Redirections permanentes (308) — l'ancienne home mono-page exposait des
  // ancres (#realisations, #tarif, #faq). Ces sections ont désormais de
  // vraies pages. ⚠️ Une redirection serveur ne peut PAS matcher un fragment
  // d'URL (#…) : le navigateur ne l'envoie jamais au serveur. On redirige donc
  // les chemins « nus » correspondants (anciens liens / favoris / partages),
  // et les ancres de la home elle-même (/#…) restent gérées côté client.
  async redirects() {
    return [
      // anciennes formulations de la page tarifs
      { source: "/tarif", destination: "/tarifs", permanent: true },
      { source: "/tarifs.html", destination: "/tarifs", permanent: true },
      { source: "/prix", destination: "/tarifs", permanent: true },
      // réalisations / portfolio
      { source: "/portfolio", destination: "/realisations", permanent: true },
      { source: "/realisation", destination: "/realisations", permanent: true },
      // questions fréquentes
      { source: "/questions", destination: "/faq", permanent: true },
      // anciennes entrées de conversion
      { source: "/commander", destination: "/demarrer", permanent: true },
      { source: "/devis", destination: "/demarrer", permanent: true },

      // ── Nettoyage SEO geo-métier (Phase A) ──────────────────────────────
      // Les anciennes paires métier×ville sont supprimées : on redirige (308)
      // chaque paire vers la page-offre acheteur du métier correspondant.
      // `:ville+` exige AU MOINS un segment ville → ne matche JAMAIS la fiche
      // métier nue `/metiers/{métier}` (conservée), ni le hub `/metiers`.
      // Les /zones partent en 410 (cf. src/proxy.ts), pas ici.
      { source: "/metiers/plomberie/:ville+", destination: "/creer-site-plombier", permanent: true },
      { source: "/metiers/menage/:ville+", destination: "/creer-site-menage", permanent: true },
      { source: "/metiers/electricite/:ville+", destination: "/creer-site-electricien", permanent: true },
      { source: "/metiers/mecanique-auto/:ville+", destination: "/creer-site-mecanicien", permanent: true },
      { source: "/metiers/serrurerie/:ville+", destination: "/creer-site-serrurier", permanent: true },
      { source: "/metiers/jardinage/:ville+", destination: "/creer-site-jardinier", permanent: true },
      { source: "/metiers/coiffure-beaute/:ville+", destination: "/creer-site-coiffeur", permanent: true },
      { source: "/metiers/maconnerie/:ville+", destination: "/creer-site-macon", permanent: true },
      { source: "/metiers/peinture/:ville+", destination: "/creer-site-peintre", permanent: true },
    ];
  },

  // Cache long pour les assets réellement immuables (servis par /public et
  // versionnés par hash côté Next). Les routes de page ne sont PAS ciblées :
  // elles gardent leur stratégie de cache (ISR/SSG) par défaut.
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
