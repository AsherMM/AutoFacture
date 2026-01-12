"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Zap,
  ShieldCheck,
  CheckCircle2,
  LogIn,
} from "lucide-react";

/* --- PAGE D'ACCUEIL --- */
export default function Hero() {
  // Scroll fluide vers la section #pricing
  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#pricing");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* === HEADER FIXE === */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent hover:opacity-90 transition"
          >
            AutoFacture ⚡
          </Link>

          <nav className="flex items-center gap-6 text-gray-300 text-sm">
            <Link
              href="#pricing"
              onClick={scrollToPricing}
              className="hover:text-blue-400 transition"
            >
              Tarifs
            </Link>
            <Link href="#how" className="hover:text-blue-400 transition">
              Comment ça marche
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2 rounded-lg font-semibold shadow-lg transition"
            >
              <LogIn className="w-4 h-4" /> Se connecter
            </Link>
          </nav>
        </div>
      </header>

      {/* === HERO === */}
      <section className="relative flex flex-col items-center text-center py-40 px-6">
        {/* Effets lumineux en arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-blue-600/10 blur-3xl rounded-full opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[800px] h-[800px] bg-purple-600/10 blur-3xl rounded-full opacity-25" />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(79,70,229,0.5)]"
        >
          AutoFacture ⚡<br />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed"
        >
          Le générateur de{" "}
          <span className="text-blue-400 font-semibold">
            factures premium par métier
          </span>
          . Créez une facture propre, conforme et prête à envoyer{" "}
          <span className="text-gray-200 font-semibold">en moins de 2 minutes</span>
          — sans modèle Word, sans prise de tête.
        </motion.p>

        {/* Micro preuves / bénéfices rapides */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-400 mb-10"
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            PDF professionnel instantané
          </span>
          <span className="hidden sm:block text-gray-700">•</span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            Thèmes adaptés à votre secteur
          </span>
          <span className="hidden sm:block text-gray-700">•</span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            Données sécurisées & privées
          </span>
        </motion.div>

        {/* CTA principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
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

        <p className="mt-8 text-gray-400 text-sm">
          🎉 <span className="text-blue-400 font-medium">Offre -20%</span> pour
          les <span className="text-gray-200 font-semibold">500</span> premiers abonnés
        </p>
      </section>

      {/* 🔥 SECTION TARIFS */}
      <Pricing />

      {/* --- FONCTIONNALITÉS --- */}
      <Features />

      {/* --- PLAN GRATUIT --- */}
      <FreePlan />

      {/* --- FOOTER --- */}
      <Footer />
    </main>
  );
}

/* --- SECTION TARIFS --- */
function Pricing() {
  const plans = [
    {
      title: "Mensuel",
      oldPrice: "11,99€",
      price: "9,99€",
      subtitle: "par mois, résiliable à tout moment",
      features: [
        "Factures illimitées",
        "Thèmes premium par métier",
        "Export PDF haute qualité",
        "Stockage sécurisé",
      ],
      highlight: false,
    },
    {
      title: "Annuel",
      price: "7,99€ /mois",
      subtitle: "soit 95,88€ / an (2 mois offerts)",
      features: [
        "2 mois offerts",
        "Historique illimité",
        "Accès complet à tous les thèmes",
        "Support prioritaire",
      ],
      highlight: true,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative py-28 px-6 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800 scroll-mt-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.05),transparent)]" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-extrabold mb-6 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          Une tarification simple. Une valeur claire. 💎
        </h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
          Testez gratuitement, puis passez Pro quand vous voulez.{" "}
          <span className="text-gray-200 font-semibold">-20%</span> pour les{" "}
          <span className="text-gray-200 font-semibold">500</span> premiers abonnés.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mt-10">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 180 }}
              className={`relative overflow-hidden rounded-2xl border backdrop-blur-md ${
                plan.highlight
                  ? "border-blue-500 bg-gradient-to-br from-gray-900/70 via-gray-950/80 to-blue-900/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
                  : "border-gray-700 bg-gray-900/70"
              } p-10 text-left shadow-xl transition-all`}
            >
              {plan.highlight && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs px-3 py-1 rounded-full shadow-md">
                  ⭐ Meilleur rapport qualité/prix
                </span>
              )}

              <h3 className="text-xl font-semibold text-white mb-2">
                {plan.title}
              </h3>

              {plan.oldPrice ? (
                <div className="flex items-end gap-2 mb-3">
                  <p className="text-5xl font-extrabold text-blue-400">
                    {plan.price}
                  </p>
                  <p className="text-gray-500 line-through text-lg">
                    {plan.oldPrice}
                  </p>
                  <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                    -17%
                  </span>
                </div>
              ) : (
                <p className="text-5xl font-extrabold text-blue-400 mb-3">
                  {plan.price}
                </p>
              )}

              <p className="text-gray-400 mb-6">{plan.subtitle}</p>

              <ul className="space-y-2 mb-8">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-300 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full block text-center py-3 rounded-xl font-semibold transition ${
                  plan.highlight
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                    : "border border-gray-600 hover:bg-gray-800 text-gray-300"
                }`}
              >
                Passer Pro
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- PLAN GRATUIT --- */
function FreePlan() {
  return (
    <section className="bg-gray-950 py-20 border-t border-gray-800 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="inline-block bg-blue-600/10 text-blue-400 border border-blue-600/40 px-4 py-2 rounded-full text-sm font-medium mb-4">
          💡 Gratuit pour démarrer
        </div>
        <h2 className="text-2xl font-bold mb-3 text-white">
          Testez AutoFacture en conditions réelles
        </h2>
        <br />
        <p className="text-gray-400 mb-6">
          Générez jusqu’à{" "}
          <span className="text-blue-400 font-semibold">
            1 facture gratuite par jour
          </span>{" "}
          et découvrez un rendu pro immédiatement.
        </p>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Idéal pour essayer le workflow, valider votre thème métier, et passer Pro
          uniquement quand vous en avez besoin.
        </p>
        <br />

        <Link
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl text-lg font-semibold shadow-lg transition"
        >
          Créer mon compte gratuit
        </Link>
      </div>
    </section>
  );
}

/* --- FONCTIONNALITÉS --- */
function Features() {
  const list = [
    {
      icon: <FileText className="w-8 h-8 text-blue-400" />,
      title: "PDF pro, prêt à envoyer",
      text: "Une facture nette, lisible et crédible — générée en quelques clics.",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Workflow ultra rapide",
      text: "Moins de saisie, moins d’erreurs : vous facturez vite, sans modèle à bricoler.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
      title: "Données privées & sécurisées",
      text: "Vos informations sont protégées, avec un accès strictement réservé à votre compte.",
    },
  ];

  return (
    <section
      id="features"
      className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-10"
    >
      {list.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="bg-gray-800/60 p-8 rounded-2xl border border-gray-700 shadow-lg text-center hover:shadow-blue-600/10"
        >
          <div className="flex justify-center mb-4">{item.icon}</div>
          <h3 className="text-lg font-semibold mb-2 text-blue-400">
            {item.title}
          </h3>
          <p className="text-gray-400 text-sm">{item.text}</p>
        </motion.div>
      ))}
    </section>
  );
}

/* --- FOOTER --- */
function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-500 text-sm py-8 text-center border-t border-gray-800">
      © {new Date().getFullYear()} AutoFacture — Tous droits réservés.
      <span className="text-gray-600 block text-xs mt-1">
        Propulsé avec ❤️ pour les indépendants, freelances et TPE.
      </span>
    </footer>
  );
}
