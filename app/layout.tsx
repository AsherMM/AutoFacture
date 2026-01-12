import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "../app/ClientLayout";
import { ToastProvider } from "./components/ui/use-toast";

export const metadata: Metadata = {
  title: {
    default: "AutoFacture ⚡ | Votre solution de facturation intelligente",
    template: "%s | AutoFacture ⚡",
  },
  description:
    "AutoFacture est une application SaaS moderne pour créer, envoyer et gérer vos factures en quelques secondes. Gagnez du temps et simplifiez votre gestion.",
  keywords:
    "auto facture, application de facturation, logiciel de facturation, SaaS, factures automatiques, freelances, indépendants, comptabilité, gestion client, devis, auto entrepreneur",
  metadataBase: new URL("https://autofacture.app"),
  alternates: {
    canonical: "https://autofacture.app",
  },
  openGraph: {
    title: "AutoFacture ⚡ | Créez vos factures intelligemment",
    description:
      "Générez vos factures professionnelles en un clic. Simple, rapide et sécurisé avec AutoFacture.",
    url: "https://autofacture.app",
    siteName: "AutoFacture",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoFacture - Facturation intelligente",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@autofacture",
    creator: "@autofacture",
    title: "AutoFacture ⚡ | Votre solution de facturation intelligente",
    description:
      "Créez et envoyez vos factures pro en un clic avec AutoFacture. Simple, rapide et sécurisé.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png", 
  },
  manifest: "/site.webmanifest",
  themeColor: "#7c3aed",
  authors: [{ name: "AutoFacture", url: "https://autofacture.app" }],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* 🔍 SEO + Performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="application-name" content="AutoFacture" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AutoFacture" />
      </head>

      <body
        className="bg-gray-950 text-white antialiased selection:bg-purple-600/40 selection:text-white relative"
      >
        {/* 🔗 Accessibilité : skip link */}
        <a
          href="#main-content"
          className="absolute left-2 top-2 bg-purple-700 text-white px-3 py-2 rounded-lg text-sm opacity-0 focus:opacity-100 z-50"
        >
          Aller au contenu principal
        </a>

        {/* ⚡ Contexte global des toasts */}
        <ToastProvider>
          <ClientLayout>
            <main id="main-content">{children}</main>
          </ClientLayout>
        </ToastProvider>

        {/* 💡 Script de balisage JSON-LD (SEO avancé) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AutoFacture",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              url: "https://autofacture.app",
              image: "https://autofacture.app/og-image.png",
              description:
                "Créez, envoyez et gérez vos factures en ligne avec AutoFacture. Application SaaS simple et rapide.",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "124",
              },
              offers: {
                "@type": "Offer",
                price: "9.99",
                priceCurrency: "EUR",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
