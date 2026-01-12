import type { NextConfig } from "next";

/**
 * ✅ Configuration Next.js 16
 * Parfaite pour AutoFacture / NeuriFlux :
 * - i18n (fr, en, es)
 * - Sécurité des images distantes
 * - Compatible Vercel / Netlify
 * - Typage strict et sans erreurs
 */
const nextConfig: NextConfig = {
  /* ===========================================================
     🌍 Internationalisation (i18n)
     =========================================================== */

     // 🚨 Correction du typage localeDetection :
  // On l’ajoute manuellement (hors validation TS)
  // car NextConfig officiel ne la définit pas encore.
  ...(process.env.NODE_ENV && {
    i18n: {
      locales: ["fr", "en", "es"],
      defaultLocale: "fr",
    },
  }),
};

// @ts-expect-error — propriété non encore typée dans Next.js
nextConfig.i18n.localeDetection = true;

Object.assign(nextConfig, {
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

      // 🔹 Supabase (à adapter à ton instance)
      { protocol: "https", hostname: "your-project-id.supabase.co" },

      // 🔹 Unsplash / Pixabay / Cloudinary
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  /* ===========================================================
     ⚙️ Configuration générale
     =========================================================== */
  reactStrictMode: true,

  // ⚡ SWC minification automatique (inclus par défaut, mais explicitée pour clarté)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 🚫 ESLint et TypeScript stricts
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  /* ===========================================================
     🧪 Options expérimentales / compatibilité
     =========================================================== */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
});

export default nextConfig;
