import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "../app/ClientLayout";
import { ToastProvider } from "./components/ui/use-toast";
import Script from "next/script";

/* ===========================================================
   🌐 METADATA — NeuriFlux + AutoFacture
   =========================================================== */

export const metadata: Metadata = {
  title: {
    default: "NeuriFlux ⚙️ | Intelligent Business Tools",
    template: "%s | NeuriFlux ⚙️",
  },
  description:
    "NeuriFlux conçoit des outils SaaS intelligents pour automatiser la facturation, la gestion et la croissance des indépendants et PME. Découvrez AutoFacture, la solution de facturation professionnelle.",
  keywords:
    "NeuriFlux, AutoFacture, SaaS, logiciel de facturation, outils business intelligents, automatisation, auto-entrepreneur, PME, productivité, SaaS France",
  metadataBase: new URL("https://neuriflux.com"),
  alternates: {
    canonical: "https://neuriflux.com/autofacture",
  },
  openGraph: {
    title: "AutoFacture ⚡ par NeuriFlux — Facturation intelligente et rapide",
    description:
      "Créez, envoyez et gérez vos factures pro en quelques secondes. AutoFacture est un produit NeuriFlux conçu pour simplifier la gestion des indépendants et PME.",
    url: "https://neuriflux.com/autofacture",
    siteName: "NeuriFlux",
    images: [
      {
        url: "/og-image-neuriflux-autofacture.png",
        width: 1200,
        height: 630,
        alt: "AutoFacture par NeuriFlux - Facturation intelligente",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@neuriflux",
    creator: "@neuriflux",
    title: "AutoFacture ⚡ | Facturation intelligente par NeuriFlux",
    description:
      "AutoFacture est un produit NeuriFlux — la suite SaaS pour automatiser votre facturation professionnelle.",
    images: ["/og-image-neuriflux-autofacture.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#4f46e5",
  authors: [{ name: "NeuriFlux", url: "https://neuriflux.com" }],
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
        <meta name="application-name" content="NeuriFlux" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>

      <body className="bg-gray-950 text-white antialiased selection:bg-indigo-600/40 selection:text-white relative font-inter">
        <a
          href="#main-content"
          className="absolute left-2 top-2 bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm opacity-0 focus:opacity-100 z-50"
        >
          Aller au contenu principal
        </a>

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
                  "NeuriFlux développe des solutions SaaS intelligentes pour automatiser la gestion et la facturation.",
                brand: {
                  "@type": "Brand",
                  name: "NeuriFlux",
                  slogan: "Intelligent Business Tools",
                },
              },
              {
                "@type": "Product",
                "@id": "https://neuriflux.com/autofacture#product",
                name: "AutoFacture",
                brand: {
                  "@type": "Organization",
                  name: "NeuriFlux",
                  url: "https://neuriflux.com",
                },
                description:
                  "AutoFacture est un SaaS NeuriFlux pour créer, envoyer et gérer vos factures pro sans effort.",
                image: "https://neuriflux.com/og-image-neuriflux-autofacture.png",
                offers: {
                  "@type": "Offer",
                  priceCurrency: "EUR",
                  price: "9.90",
                  availability: "https://schema.org/InStock",
                  url: "https://neuriflux.com/autofacture",
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
      </body>
    </html>
  );
}
