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
