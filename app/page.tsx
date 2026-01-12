import Hero from "./components/home/Hero";
import Script from "next/script";

export const metadata = {
  title: "AutoFacture ⚡ | Facturation intelligente par NeuriFlux",
  description:
    "AutoFacture est un service SaaS de NeuriFlux — la suite intelligente pour indépendants et PME. Créez, envoyez et gérez vos factures pro en quelques secondes, sans Excel ni stress.",
  keywords:
    "AutoFacture, NeuriFlux, logiciel de facturation, facturation intelligente, factures pro, SaaS gestion entreprise, auto-entrepreneur, indépendant, PME, automatisation, outils business intelligents",
  authors: [{ name: "NeuriFlux", url: "https://neuriflux.com" }],
  creator: "NeuriFlux",
  publisher: "NeuriFlux",
  metadataBase: new URL("https://autofacture.fr"),
  alternates: {
    canonical: "https://autofacture.fr",
  },
  openGraph: {
    title: "AutoFacture ⚡ — Facturation intelligente par NeuriFlux",
    description:
      "Générez vos factures professionnelles en quelques secondes. AutoFacture, un service intelligent proposé par NeuriFlux.",
    url: "https://autofacture.fr",
    siteName: "AutoFacture",
    images: [
      {
        url: "/og-image-autofacture.png",
        width: 1200,
        height: 630,
        alt: "AutoFacture - Facturation intelligente par NeuriFlux",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoFacture ⚡ par NeuriFlux",
    description:
      "Le SaaS de facturation rapide, sécurisé et intelligent pour indépendants et petites entreprises.",
    images: ["/og-image-autofacture.png"],
    creator: "@neuriflux",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/* ===========================================================
   🧠 PAGE PRINCIPALE
   =========================================================== */

export default function Home() {
  return (
    <>
      {/* === HERO (page produit AutoFacture) === */}
      <Hero />

      {/* === SEO Schema : NeuriFlux + AutoFacture === */}
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://neuriflux.com/#organization",
              name: "NeuriFlux",
              url: "https://neuriflux.com",
              logo: "https://neuriflux.com/logo.png",
              sameAs: [
                "https://twitter.com/neuriflux",
                "https://linkedin.com/company/neuriflux",
              ],
              description:
                "NeuriFlux développe des outils SaaS intelligents pour automatiser la gestion et la croissance des indépendants et petites entreprises.",
              brand: {
                "@type": "Brand",
                name: "NeuriFlux",
                slogan: "Intelligent Business Tools",
              },
            },
            {
              "@type": "Product",
              "@id": "https://autofacture.fr/#product",
              name: "AutoFacture",
              brand: {
                "@type": "Organization",
                name: "NeuriFlux",
                url: "https://neuriflux.com",
              },
              description:
                "AutoFacture est un logiciel SaaS de NeuriFlux permettant aux indépendants de créer, envoyer et gérer leurs factures professionnelles automatiquement.",
              image: "https://autofacture.fr/og-image-autofacture.png",
              url: "https://autofacture.fr",
              offers: {
                "@type": "Offer",
                priceCurrency: "EUR",
                price: "9.99",
                availability: "https://schema.org/InStock",
                url: "https://autofacture.fr/pricing",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "153",
              },
            },
          ],
        })}
      </Script>

      {/* === FOOTER MENTION === */}
      <footer className="bg-gray-950 text-center text-gray-500 py-6 border-t border-gray-800 text-sm">
        <p>
          © {new Date().getFullYear()}{" "}
          <strong className="text-blue-400">NeuriFlux</strong> — Tous droits
          réservés.
        </p>
        <p className="text-xs text-gray-600 mt-1">
          AutoFacture est un service SaaS proposé par{" "}
          <span className="font-semibold text-gray-300">NeuriFlux</span>, la
          suite d’outils intelligents pour indépendants et petites entreprises.
        </p>
        <div className="flex justify-center gap-4 text-gray-400 text-xs mt-3">
          <a
            href="https://neuriflux.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            🌐 neuriflux.com
          </a>
          <a
            href="https://twitter.com/neuriflux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            Twitter
          </a>
          <a
            href="https://linkedin.com/company/neuriflux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </>
  );
}
