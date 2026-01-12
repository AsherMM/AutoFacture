import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "NeuriFlux ⚙️ | Intelligent Business Tools",
    template: "%s | NeuriFlux ⚙️",
  },
  description:
    "NeuriFlux conçoit des outils SaaS intelligents pour automatiser la facturation, la gestion et la croissance des indépendants et PME. Découvrez AutoFacture, la solution de facturation professionnelle.",
  metadataBase: new URL("https://neuriflux.com"),
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-gray-950 text-white antialiased selection:bg-indigo-600/40 selection:text-white relative font-inter">
        <a
          href="#main-content"
          className="absolute left-2 top-2 bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm opacity-0 focus:opacity-100 z-50"
        >
          Aller au contenu principal
        </a>

        <ClientLayout>
          <main id="main-content">{children}</main>
        </ClientLayout>

        <Toaster position="top-right" richColors expand />

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
              },
            ],
          })}
        </Script>
      </body>
    </html>
  );
}
