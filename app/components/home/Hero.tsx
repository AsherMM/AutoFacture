"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  Zap,
  ShieldCheck,
  FileText,
  UserPlus,
  LogIn,
  BarChart3,
  Send,
  Users,
} from "lucide-react";

/* ===========================================================
   🌐 HERO — AutoFacture by NeuriFlux
   =========================================================== */
export default function Hero() {
  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#pricing");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* === HEADER === */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent hover:opacity-90 transition"
          >
            NeuriFlux ⚙️
          </Link>

          <nav className="flex items-center gap-6 text-gray-300 text-sm">
            <Link href="#features" className="hover:text-blue-400 transition">
              Fonctionnalités
            </Link>
            <Link
              href="#pricing"
              onClick={scrollToPricing}
              className="hover:text-blue-400 transition"
            >
              Tarifs
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-lg font-semibold shadow-lg transition"
            >
              <UserPlus className="w-4 h-4" /> S’inscrire
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 border border-gray-600 hover:border-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              <LogIn className="w-4 h-4" /> Connexion
            </Link>
          </nav>
        </div>
      </header>

      {/* === HERO SECTION === */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between text-center lg:text-left py-48 px-8 max-w-7xl mx-auto gap-10">
        {/* Effets visuels dynamiques */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-700/10 blur-3xl rounded-full opacity-40 animate-pulse pointer-events-none" />

        {/* Texte principal */}
        <div className="flex-1 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center lg:justify-start gap-2 mb-3"
          >
            <Brain className="w-6 h-6 text-blue-400" />
            <p className="text-sm text-gray-400 font-medium">
              Un produit développé par{" "}
              <Link
                href="https://neuriflux.com"
                className="text-blue-400 hover:underline font-semibold"
                target="_blank"
              >
                NeuriFlux
              </Link>
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(79,70,229,0.6)]"
          >
            AutoFacture ⚡
            <br />
            <span className="text-4xl md:text-5xltext-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
              La facturation intelligente signée NeuriFlux
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed"
          >
            Générez, envoyez et gérez vos factures en quelques secondes.
            <br />
            <span className="text-gray-100 font-semibold">
              L’assistant de facturation conçu pour les freelances et TPE.
            </span>
          </motion.p>

          {/* CTA principal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-10 py-4 rounded-xl text-lg font-semibold shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="#pricing"
              onClick={scrollToPricing}
              className="border border-gray-600 hover:border-blue-600 hover:bg-gray-800 px-10 py-4 rounded-xl text-lg font-semibold transition-all"
            >
              Voir les tarifs
            </Link>
          </motion.div>
        </div>

        {/* Illustration visuelle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 relative z-10"
        >
          <Image
            src="/icons/banniere.png"
            alt="Interface AutoFacture par NeuriFlux"
            width={600}
            height={380}
            priority
            className="rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-gray-800 mx-auto"
          />
        </motion.div>
      </section>

      {/* === SECTION TARIFS === */}
      <PricingSection />

      {/* === FONCTIONNALITÉS === */}
      <Features />

      <Footer />
    </div>
  );
}

/* ===========================================================
   💎 Section Tarifs complète & vendeur
   =========================================================== */
function PricingSection() {
  const plans = [
    {
      title: "Freemium",
      price: "0€",
      subtitle: "Découverte gratuite du produit",
      features: [
        "Factures limitées par mois",
        "Fonctions de base incluses",
        "Découverte du tableau de bord",
      ],
      cta: "Essayer gratuitement",
      color: "from-gray-800 to-gray-900",
    },
    {
      title: "Premium",
      price: "9,90€ / mois",
      subtitle: "Idéal pour les indépendants",
      features: [
        "Factures illimitées",
        "Personnalisation (logo, couleurs)",
        "Envoi automatique des factures par email",
        "Support prioritaire",
      ],
      cta: "Passer Premium",
      highlight: true,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Professionnel",
      price: "19,90€ / mois",
      subtitle: "Pensé pour les équipes et agences",
      features: [
        "Tout Premium inclus",
        "Gestion avancée des clients",
        "Suivi intelligent & rappels de paiement",
        "Statistiques et tableaux de bord",
        "Export & archivage avancés",
        "Support ultra-prioritaire 24/7",
      ],
      cta: "Passer Pro",
      color: "from-purple-600 to-fuchsia-600",
    },
  ];

  return (
    <section id="pricing" className="py-28 px-6 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-blue-400">
          Tarifs simples, puissants et transparents 💎
        </h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
          Choisissez la formule qui s’adapte à votre rythme de croissance.
          <br />
          AutoFacture s’occupe du reste.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 160 }}
              className={`relative overflow-hidden rounded-2xl border backdrop-blur-md bg-gradient-to-br ${plan.color} ${
                plan.highlight ? "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]" : "border-gray-700"
              } p-10 text-left`}
            >
              {plan.highlight && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs px-3 py-1 rounded-full shadow-md">
                  ⭐ Meilleur choix
                </span>
              )}
              <h3 className="text-2xl font-semibold text-white mb-2">{plan.title}</h3>
              <p className="text-4xl font-extrabold text-white mb-1">{plan.price}</p>
              <p className="text-gray-300 mb-6 text-sm">{plan.subtitle}</p>

              <ul className="space-y-2 mb-8 text-gray-200 text-sm">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-[2px]" /> {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full block text-center py-3 rounded-xl font-semibold transition ${
                  plan.highlight
                    ? "bg-white text-blue-700 hover:bg-gray-200"
                    : "border border-gray-600 hover:bg-gray-800 text-gray-200"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================================================
   ⚙️ Section Fonctionnalités — Tech et crédibilité
   =========================================================== */
function Features() {
  const list = [
    {
      icon: <FileText className="w-8 h-8 text-blue-400" />,
      title: "Création instantanée de factures",
      text: "Générez des factures conformes et prêtes à l’envoi en moins de 30 secondes.",
    },
    {
      icon: <Send className="w-8 h-8 text-indigo-400" />,
      title: "Envoi automatisé par email",
      text: "Vos clients reçoivent leurs factures automatiquement et vous êtes notifié à chaque lecture.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Gestion clients simplifiée",
      text: "Centralisez vos clients, paiements et historiques dans une interface claire et moderne.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-yellow-400" />,
      title: "Statistiques & performance",
      text: "Analysez vos revenus, vos paiements et vos retards pour une vision complète de votre activité.",
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-300" />,
      title: "Automatisation intelligente",
      text: "AutoFacture apprend vos habitudes pour accélérer votre workflow à chaque utilisation.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
      title: "Sécurité NeuriFlux Cloud",
      text: "Vos données sont chiffrées et stockées en Europe sur une infrastructure fiable et conforme RGPD.",
    },
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-3 gap-10">
      {list.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="bg-gray-800/60 p-8 rounded-2xl border border-gray-700 shadow-lg text-center hover:shadow-blue-600/10"
        >
          <div className="flex justify-center mb-4">{item.icon}</div>
          <h3 className="text-lg font-semibold mb-2 text-blue-400">{item.title}</h3>
          <p className="text-gray-400 text-sm">{item.text}</p>
        </motion.div>
      ))}
    </section>
  );
}

/* ===========================================================
   🧾 Footer — Corporate & crédible
   =========================================================== */
function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-500 text-sm py-10 text-center border-t border-gray-800">
      © {new Date().getFullYear()} NeuriFlux — Tous droits réservés.
      <span className="block text-gray-600 text-xs mt-1">
        AutoFacture est un produit de{" "}
        <span className="text-blue-400 font-semibold">NeuriFlux</span> — Intelligent Business Tools.
      </span>
    </footer>
  );
}
