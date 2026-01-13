"use client";

import { useEffect, useState } from "react";
import { supabase } from "lib/supabaseClient";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type PlanSlug = "free" | "premium" | "pro";

/* ===========================================================
   ⚡ PAGE ABONNEMENT — AutoFacture by NeuriFlux
   =========================================================== */
export default function AbonnementPage() {
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<PlanSlug>("free");
  const [email, setEmail] = useState<string>("");
  const [expiration, setExpiration] = useState<Date | null>(null);

  /* ===========================================================
     🔍 Récupération du plan utilisateur depuis Supabase
     =========================================================== */
  useEffect(() => {
    async function getPlan() {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Utilisateur non connecté.");

        setEmail(user.email ?? "");

        const { data, error } = await supabase
          .from("users")
          .select("subscription_plan, premium_until")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        const plan = (data?.subscription_plan as PlanSlug) ?? "free";
        setUserPlan(plan);
        if (data?.premium_until) setExpiration(new Date(data.premium_until));
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement de votre plan.");
      } finally {
        setLoading(false);
      }
    }
    getPlan();
  }, []);

  /* ===========================================================
     💳 Gestion Stripe Checkout & Portal
     =========================================================== */
  const handleStripeCheckout = async (plan: Exclude<PlanSlug, "free">) => {
    try {
      toast.loading("Redirection vers Stripe…");
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("Erreur Stripe");
    } catch {
      toast.error("Impossible de lancer Stripe.");
    }
  };

  const openStripePortal = async () => {
    try {
      toast.loading("Ouverture du portail client Stripe…");
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error("Erreur lors de l’ouverture du portail.");
    }
  };

  /* ===========================================================
     🕓 Badge dynamique d’expiration
     =========================================================== */
  const getBadgeInfo = () => {
    if (!expiration) return null;

    const now = new Date();
    const diffMs = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        label: "Expire aujourd’hui",
        color: "bg-red-600/20 text-red-400 border-red-600/50",
      };
    } else if (diffDays <= 7) {
      return {
        label: `Expire dans ${diffDays} jour${diffDays > 1 ? "s" : ""}`,
        color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/40",
      };
    } else if (diffDays <= 25) {
      return {
        label: `Expire dans ${diffDays} jours`,
        color: "bg-blue-600/20 text-blue-400 border-blue-600/40",
      };
    } else {
      return {
        label: "Renouvellement automatique actif",
        color: "bg-green-600/20 text-green-400 border-green-600/40",
      };
    }
  };

  const badge = getBadgeInfo();

  const formattedDate = expiration
    ? expiration.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  /* ===========================================================
     LOADING
     =========================================================== */
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
        <p>Chargement de votre abonnement...</p>
      </div>
    );

  /* ===========================================================
     PAGE PRINCIPALE
     =========================================================== */
  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white min-h-screen px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto space-y-14"
      >
        <header className="text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Abonnement AutoFacture
          </h1>
          <p className="text-gray-400">
            Gérez votre formule en toute simplicité — paiements sécurisés via Stripe.
          </p>
        </header>

        {/* === PLAN ACTUEL === */}
        <section className="bg-gray-900/70 border border-gray-800 rounded-2xl shadow-xl p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-400">
                Plan actuel : <span className="capitalize text-white">{userPlan}</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">{email}</p>

              {formattedDate && (
                <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <p className="text-gray-300 text-sm">
                    🔒 Actif jusqu’au{" "}
                    <span className="text-blue-400 font-semibold">{formattedDate}</span>
                  </p>
                  {badge && (
                    <span
                      className={`text-xs font-medium border px-3 py-1 rounded-full ${badge.color}`}
                    >
                      <Clock className="inline w-3 h-3 mr-1" />
                      {badge.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions selon plan */}
            <div className="flex flex-wrap gap-3">
              {userPlan === "free" && (
                <>
                  <Button
                    onClick={() => handleStripeCheckout("premium")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md"
                  >
                    Passer Premium
                  </Button>
                  <Button
                    onClick={() => handleStripeCheckout("pro")}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-md"
                  >
                    Passer Pro
                  </Button>
                </>
              )}

              {userPlan === "premium" && (
                <>
                  <Button
                    onClick={() => handleStripeCheckout("pro")}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-md"
                  >
                    Passer Pro
                  </Button>
                  <Button
                    variant="outline"
                    onClick={openStripePortal}
                    className="border-red-500 text-red-400"
                  >
                    Gérer / Annuler
                  </Button>
                </>
              )}

              {userPlan === "pro" && (
                <Button
                  variant="outline"
                  onClick={openStripePortal}
                  className="border-red-500 text-red-400"
                >
                  Gérer mon abonnement
                </Button>
              )}
            </div>
          </div>

          {/* === SECTION DÉTAILS PRO === */}
          {userPlan === "pro" && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/70 border border-gray-700">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">
                Détails de votre abonnement Professionnel 💼
              </h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>✔️ Factures et clients illimités</li>
                <li>✔️ Accès complet au tableau de bord avancé</li>
                <li>✔️ Automatisations, rappels et statistiques en temps réel</li>
                <li>✔️ Support prioritaire 24/7</li>
                <li>✔️ Paiement sécurisé via Stripe</li>
              </ul>

              <div className="flex items-center gap-2 mt-5 text-gray-400 text-sm">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Facturation et gestion via Stripe</span>
              </div>
            </div>
          )}
        </section>

        {/* === OFFRES (invisibles pour Pro) === */}
        {userPlan !== "pro" && (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {plans
              .filter((p) => userPlan === "free" || p.slug !== "free")
              .map((p) => (
                <PlanCard
                  key={p.slug}
                  plan={p}
                  currentPlan={userPlan}
                  onSelectPlan={handleStripeCheckout}
                />
              ))}
          </section>
        )}

        {/* === STRIPE & FOOTER === */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
          <img src="/stripe-logo.svg" alt="Stripe" className="w-28 opacity-80" />
          <p className="text-gray-400 text-sm text-center md:text-left">
            Paiements sécurisés via{" "}
            <span className="text-white font-semibold">Stripe</span>. Données conformes PCI-DSS.
          </p>
        </section>

        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-blue-400 transition font-medium"
          >
            ← Retour au tableau de bord
          </Link>
        </div>

        <footer className="text-center text-gray-400 text-sm space-y-2 mt-12 border-t border-gray-800 pt-6">
          <div className="flex flex-wrap justify-center gap-5 text-sm">
            <Link href="/cgu">CGU</Link>
            <Link href="/cgv">CGV</Link>
            <Link href="/mentions-legales">Mentions Légales</Link>
            <Link href="/politique-confidentialite">
              Politique de Confidentialité
            </Link>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="text-blue-400 font-semibold">NeuriFlux</span> — AutoFacture ⚡  
            Tous droits réservés.
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

/* ===========================================================
   💎 COMPOSANT PLAN CARD
   =========================================================== */
function PlanCard({
  plan,
  currentPlan,
  onSelectPlan,
}: {
  plan: typeof plans[number];
  currentPlan: PlanSlug;
  onSelectPlan: (plan: Exclude<PlanSlug, "free">) => void;
}) {
  const isActive = currentPlan === plan.slug;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative overflow-hidden rounded-2xl border border-gray-700 shadow-lg bg-gradient-to-br ${plan.color} p-8`}
    >
      {plan.highlight && (
        <span className="absolute top-4 right-4 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full shadow-md">
          ⭐ Meilleur choix
        </span>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
      <p className="text-4xl font-extrabold text-white mb-2">{plan.price}</p>
      <p className="text-gray-200 mb-4 text-sm">{plan.subtitle}</p>

      <ul className="text-gray-200 text-sm mb-6 space-y-2">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-300" /> {feat}
          </li>
        ))}
      </ul>

      {isActive ? (
        <div className="text-center text-green-400 font-semibold">
          <ShieldCheck className="inline w-5 h-5 mr-1" /> Plan actuel
        </div>
      ) : plan.slug !== "free" ? (
        <Button
          onClick={() => onSelectPlan(plan.slug)}
          className="w-full bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
        >
          {plan.cta}
        </Button>
      ) : null}
    </motion.div>
  );
}

/* ===========================================================
   💰 PLANS TARIFAIRES
   =========================================================== */
const plans = [
  {
    slug: "free" as const,
    title: "Freemium",
    price: "0€",
    subtitle: "Découverte gratuite",
    features: [
      "Fonctions de base",
      "Factures limitées",
      "Accès au tableau de bord",
    ],
    cta: "Essayer gratuitement",
    color: "from-gray-800 to-gray-900",
  },
  {
    slug: "premium" as const,
    title: "Premium",
    price: "9,90€ / mois",
    subtitle: "Pour indépendants & freelances",
    features: [
      "Factures illimitées",
      "Personnalisation (logo, couleurs)",
      "Envoi automatique",
      "Support prioritaire",
    ],
    cta: "Passer Premium",
    color: "from-blue-600 to-indigo-600",
    highlight: true,
  },
  {
    slug: "pro" as const,
    title: "Professionnel",
    price: "19,90€ / mois",
    subtitle: "Pour agences & équipes",
    features: [
      "Tout Premium inclus",
      "Statistiques avancées",
      "Automatisations & rappels",
      "Exports & archivage",
      "Support 24/7 prioritaire",
    ],
    cta: "Passer Pro",
    color: "from-purple-600 to-fuchsia-600",
  },
];
