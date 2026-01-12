// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["fr", "en", "es"],
  defaultLocale: "fr",
  localeDetection: true,
});

export const config = {
  // ⚙️ Appliquer l'i18n uniquement sur les pages "publiques"
  matcher: [
    // Toutes les pages SAUF api, _next et fichiers statiques
    "/((?!api|_next|.*\\..*|login|register|dashboard).*)",
  ],
};
