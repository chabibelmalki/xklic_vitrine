import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Le repo vit dans un dossier parent contenant d'autres lockfiles ;
  // on fixe la racine pour éviter l'inférence erronée de Turbopack.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
