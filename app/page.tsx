import Hero from "./components/home/Hero";

export const metadata = {
  title: "AutoFacture ⚡ | Créez vos factures pro en 1 clic",
  description:
    "AutoFacture est le logiciel de facturation le plus rapide et intelligent. Créez, envoyez et gérez vos factures automatiquement, sans stress ni Excel.",
  keywords:
    "facture automatique, logiciel de facturation, création facture, AutoFacture, SaaS gestion entreprise, facturation freelance, auto-entrepreneur, PME",
  openGraph: {
    title: "AutoFacture ⚡ | Le SaaS de facturation simple, rapide et automatisé",
    description:
      "Générez vos factures professionnelles en 30 secondes. AutoFacture vous fait gagner du temps et renforce votre image pro.",
    url: "https://autofacture.fr",
    siteName: "AutoFacture",
    images: [
      {
        url: "/og-image-autofacture.png",
        width: 1200,
        height: 630,
        alt: "AutoFacture - Créez vos factures facilement",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function Home() {
  return <Hero />;
}
