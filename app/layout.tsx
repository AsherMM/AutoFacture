import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "../app/ClientLayout";
import { ToastProvider } from "./components/ui/use-toast";
import Script from "next/script";

/* ===========================================================
   🌐 METADATA — AutoFacture by NeuriFlux
   =========================================================== */

export const metadata: Metadata = {
  title: {
    default: "AutoFacture ⚡ | Facturation intelligente par NeuriFlux",
    template: "%s | AutoFacture ⚡ by NeuriFlux",
  },
  description:
    "AutoFacture est un service SaaS développé par NeuriFlux. Créez, envoyez et gérez vos factures pro en quelques secondes — une solution moderne, rapide et sécurisée pour freelances et petites entreprises.",
  keywords:
    "AutoFacture, NeuriFlux, logiciel de facturation, SaaS, facture automatique, facturation freelance, auto-entrepreneur, comptabilité en ligne, automatisation, outil business intelligent",
  metadataBase: new URL("https://autofacture.fr"),
  alternates: {
    canonical: "https://autofacture.fr",
  },
  openGraph: {
    title: "AutoFacture ⚡ | Facturation intelligente par NeuriFlux",
    description:
      "Créez et gérez vos factures professionnelles en un clic. AutoFacture est un service SaaS développé par NeuriFlux, la suite d’outils business intelligents.",
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
    site: "@neuriflux",
    creator: "@neuriflux",
    title: "AutoFacture ⚡ | Une solution NeuriFlux",
    description:
      "AutoFacture — un service NeuriFlux pour créer, envoyer et gérer vos factures intelligemment.",
    images: ["/og-image-autofacture.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#4f46e5",
  authors: [
    { name: "NeuriFlux", url: "https://neuriflux.com" },
    { name: "AutoFacture", url: "https://autofacture.fr" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/* ===========================================================
   ⚙️ ROOT LAYOUT — Structure principale
   =========================================================== */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* === SEO + Performance === */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="application-name" content="AutoFacture by NeuriFlux" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AutoFacture" />
      </head>

      <body
        className="bg-gray-950 text-white antialiased selection:bg-blue-600/40 selection:text-white relative font-inter"
      >
        {/* 🧭 Accessibilité — Skip link */}
        <a
          href="#main-content"
          className="absolute left-2 top-2 bg-blue-700 text-white px-3 py-2 rounded-lg text-sm opacity-0 focus:opacity-100 z-50"
        >
          Aller au contenu principal
        </a>

        {/* ⚡ Toasts & Context Provider */}
        <ToastProvider>
          <ClientLayout>
            <main id="main-content">{children}</main>
          </ClientLayout>
        </ToastProvider>

        {/* ===========================================================
            💡 JSON-LD — SEO Structuré : Organisation + Produit
            =========================================================== */}
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
                  "NeuriFlux conçoit des outils SaaS intelligents pour automatiser la gestion et la croissance des entreprises.",
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
                  "AutoFacture est une application SaaS signée NeuriFlux pour créer, envoyer et gérer vos factures pro en toute simplicité.",
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

        {/* ===========================================================
            🧩 Favicon / Apple manifest
            =========================================================== */}
        <link rel="manifest" href="/site.webmanifest" />
      </body>
    </html>
  );
}
