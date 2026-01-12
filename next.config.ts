/** @type {import('next').NextConfig} */
const nextConfig = {
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

      // 🔹 Supabase (à adapter à ton domaine)
      {
        protocol: "https",
        hostname: "your-project-id.supabase.co",
      },

      // 🔹 Unsplash (pour les visuels libres de droits)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // 🔹 Pixabay (autres visuels libres de droits)
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },

      // 🔹 Cloudinary (si tu héberges des images optimisées)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
