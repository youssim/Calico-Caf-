import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Force la racine du projet : il existe un package-lock.json parasite dans
  // /Users/salim, ce qui faisait inférer une mauvaise racine à Turbopack et
  // rendait le service des fichiers statiques de public/ incohérent.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
