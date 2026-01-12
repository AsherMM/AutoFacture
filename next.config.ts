import type { NextConfig } from "next";

/**
 * ✅ Configuration Next.js 16 — Parfaite pour AutoFacture / NeuriFlux
 * ---------------------------------------------------------------
 * - 🌍 i18n désactivé (routes FR/EN/ES supprimées)
 * - 🖼️ Sécurité des images distantes (Google, GitHub, Supabase, etc.)
 * - ⚡ Optimisée pour Vercel / Netlify
 * - 🧱 Compatible App Router + Turbopack
 * - ✅ Typage strict et sans avertissement
 */

const nextConfig: NextConfig = {
  /* ===========================================================
     🖼️ Sécurité et configuration des images externes
     =========================================================== */
  images: {
    remotePatterns: [
      // 🔹 ImgBB
      { protocol: "https", hostname: "ibb.co" },
      { protocol: "https", hostname: "i.ibb.co" },

      // 🔹 Auth providers (Google / GitHub)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },

      // 🔹 Supabase (⚙️ adapte le domaine à ton instance Supabase)
      { protocol: "https", hostname: "zyhusyitdyognklgwunr.supabase.co" },

      // 🔹 Unsplash / Pixabay / Cloudinary (images libres et optimisées)
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  /* ===========================================================
     ⚙️ Configuration générale
     =========================================================== */
  reactStrictMode: true,

  // ✅ Optimisation du code en production (supprime les console.log)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 🚫 ESLint : ne bloque pas la build sur les warnings
  // @ts-expect-error: ESLint config is not typed in NextConfig
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🚫 TypeScript : build strict, mais sans bloquer sur erreurs externes
  typescript: {
    ignoreBuildErrors: false,
  },

  /* ===========================================================
     ⚗️ Expérimental / performances avancées
     =========================================================== */
  experimental: {
    // 🚀 Optimisation des imports automatiques (lucide-react, shadcn/ui, etc.)
    optimizePackageImports: ["lucide-react", "@/components/ui"],
  },

  /* ===========================================================
     🚀 Output et compatibilité Vercel / Netlify
     =========================================================== */
  output: "standalone", // Compatible avec Vercel, Netlify, Docker
};

export default nextConfig;
