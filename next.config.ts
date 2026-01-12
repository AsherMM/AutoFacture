import type { NextConfig } from "next";

/**
 * ✅ Configuration Next.js 14
 * Parfaite pour AutoFacture / NeuriFlux :
 * - i18n (fr, en, es)
 * - Sécurité des images distantes
 * - Typage strict et sans erreurs
 */
const nextConfig = {
  /* ===========================================================
     🌍 Internationalisation (i18n)
     =========================================================== */
  i18n: {
    // Langues supportées
    locales: ["fr", "en", "es"],

    // Langue par défaut
    defaultLocale: "fr",

    // Détection automatique de la langue du navigateur
    // (non encore typée officiellement, mais prise en charge par Next.js)
    localeDetection: true,
  },

  /* ===========================================================
     🖼️ Configuration des images externes
     =========================================================== */
  images: {
    remotePatterns: [
      // 🔹 ImgBB
      {
        protocol: "https",
        hostname: "ibb.co",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co", // ImgBB héberge les vraies images ici
      },

      // 🔹 Auth providers (Google / GitHub)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },

      // 🔹 Supabase (à remplacer par ton domaine Supabase)
      {
        protocol: "https",
        hostname: "your-project-id.supabase.co",
      },

      // 🔹 Unsplash (visuels libres)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // 🔹 Pixabay (visuels libres)
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },

      // 🔹 Cloudinary (images optimisées)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  /* ===========================================================
     ⚙️ Options supplémentaires
     =========================================================== */
  reactStrictMode: true,
  swcMinify: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false, // ✅ pour garder le typage strict
  },
} satisfies NextConfig; // ✅ typage TS strict et sans erreur

export default nextConfig;
