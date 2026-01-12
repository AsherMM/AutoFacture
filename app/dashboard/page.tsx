"use client";

import { useEffect, useState } from "react";
import { supabase } from "lib/supabaseClient";
import LayoutDashboard from "../components/ui/layout-dashboard";
import { motion } from "framer-motion";
import {
  CreditCard,
  FileText,
  Settings,
  Plus,
  LogOut,
  ShieldCheck,
  Lock,
  Sparkles,
  Crown,
  Star,
  Clock,
  MapPin,
  Building2,
  Info,
  Phone,
  User,
  ScrollText,
} from "lucide-react";
import { Button } from "../components/ui/button";
import InvoiceModal from "../components/ui/invoice-modal";
import { StatCard, DashboardCharts } from "./components";
import clsx from "clsx";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [plan, setPlan] = useState<"free" | "premium" | "pro">("free");
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    "24h": { count: 0, total: 0 },
    "7j": { count: 0, total: 0 },
    "30j": { count: 0, total: 0 },
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  /* ============================================================
     ⚙️ Chargement des données utilisateur
  ============================================================ */
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) return;

      const { data: profileData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erreur chargement profil:", error);
        return;
      }

      let logos = [];
      try {
        logos = Array.isArray(profileData?.company_logo_urls)
          ? profileData.company_logo_urls
          : JSON.parse(profileData?.company_logo_urls || "[]");
      } catch {
        logos = [];
      }

      setProfile({ ...profileData, company_logo_urls: logos });
      setRole(profileData?.role || "user");

      const sub = profileData?.subscription_status;
      const currentPlan =
        sub === "pro"
          ? "pro"
          : sub === "premium" || profileData?.role === "admin"
          ? "premium"
          : "free";
      setPlan(currentPlan);

      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (invoicesData) {
        setInvoices(invoicesData.slice(0, 5));
        const now = new Date();
        const monthInvoices = invoicesData.filter((i: any) => {
          const d = new Date(i.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        setMonthlyCount(monthInvoices.length);

        const getStats = (days: number) => {
          const start = new Date();
          start.setDate(start.getDate() - days);
          const filtered = invoicesData.filter(
            (i: any) => new Date(i.created_at) >= start
          );
          return {
            count: filtered.length,
            total: filtered.reduce((acc: number, i: any) => acc + (i.amount || 0), 0),
          };
        };

        setStats({
          "24h": getStats(1),
          "7j": getStats(7),
          "30j": getStats(30),
        });

        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          const day = d.toISOString().split("T")[0];
          const total = invoicesData
            .filter((inv: any) => inv.created_at.startsWith(day))
            .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
          return {
            date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
            total,
          };
        });
        setChartData(last30Days);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const canCreate = plan !== "free" || monthlyCount < 3;

  /* ============================================================
     🎨 Thèmes dynamiques
  ============================================================ */
  const theme =
    role === "admin"
      ? { accent: "from-purple-600 to-purple-400", glow: "shadow-[0_0_60px_rgba(168,85,247,0.3)]", bg: "bg-purple-900/10" }
      : plan === "pro"
      ? { accent: "from-amber-600 to-yellow-400", glow: "shadow-[0_0_60px_rgba(245,158,11,0.3)]", bg: "bg-amber-900/10" }
      : plan === "premium"
      ? { accent: "from-blue-600 to-cyan-400", glow: "shadow-[0_0_60px_rgba(59,130,246,0.3)]", bg: "bg-blue-900/10" }
      : { accent: "from-gray-600 to-gray-400", glow: "shadow-[0_0_40px_rgba(107,114,128,0.2)]", bg: "bg-gray-800/10" };

  /* ============================================================
     🧭 Rendu principal
  ============================================================ */
  if (!user)
    return (
      <LayoutDashboard>
        <div className="flex h-screen items-center justify-center text-gray-400">
          Chargement...
        </div>
      </LayoutDashboard>
    );

  return (
    <LayoutDashboard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`space-y-10 text-gray-100 ${theme.bg}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {plan === "pro" && <Crown className="w-6 h-6 text-amber-400" />}
              {plan === "premium" && <Sparkles className="w-6 h-6 text-blue-400" />}
              Bienvenue 👋
            </h1>
            <p className="text-gray-400 mt-1">
              Heureux de vous revoir,{" "}
              <span className="text-blue-400 font-semibold">
                {profile?.name || user.email}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowInvoiceModal(true)}
              disabled={!canCreate}
              className={`bg-gradient-to-r ${theme.accent} ${theme.glow} hover:opacity-90 shadow-md flex items-center gap-2 transition-all ${
                !canCreate && "opacity-50 cursor-not-allowed"
              }`}
            >
              <Plus className="w-4 h-4" /> Créer une facture
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gray-700 hover:bg-gray-800 text-gray-400"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* STATUT UTILISATEUR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`flex items-center justify-between p-5 rounded-2xl border shadow-md backdrop-blur-sm bg-gradient-to-r ${theme.accent} bg-opacity-10`}
        >
          <div className="flex items-center gap-3">
            {role === "admin" ? (
              <>
                <ShieldCheck className="w-5 h-5 text-purple-300" />
                <p>
                  Statut : <span className="font-semibold text-purple-300">Administrateur</span> — accès complet 💎
                </p>
              </>
            ) : plan === "pro" ? (
              <>
                <Crown className="w-5 h-5 text-amber-300" />
                <p>
                  Statut : <span className="font-semibold text-amber-300">Professionnel</span> — outils d’élite activés 🚀
                </p>
              </>
            ) : plan === "premium" ? (
              <>
                <Sparkles className="w-5 h-5 text-blue-300" />
                <p>
                  Statut : <span className="font-semibold text-blue-300">Premium</span> — accès complet sans limites ✨
                </p>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-gray-400" />
                <p>
                  Statut : <span className="font-semibold text-gray-300">Freemium</span> — limité à 3 factures/mois
                </p>
              </>
            )}
          </div>

          {plan === "free" && (
            <Button
              onClick={() => (window.location.href = "/dashboard/abo")}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-sm flex items-center gap-2"
            >
              <Star className="w-4 h-4" /> Passer Premium
            </Button>
          )}
        </motion.div>

        {/* INFOS ENTREPRISE */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border border-gray-800 bg-gray-900/60 rounded-2xl p-6 shadow-md backdrop-blur-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-200">
                  Informations de l’entreprise
                </h3>
              </div>
              {profile.company_logo_urls?.length > 0 && (
                <img
                  src={profile.company_logo_urls[0]}
                  alt="Logo entreprise"
                  className="h-12 w-auto object-contain rounded-lg border border-gray-700 bg-white/5 p-2"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <InfoLine icon={<User />} label="Nom" value={profile.company_name} />
              <InfoLine icon={<Info />} label="Statut" value={profile.company_status} />
              <InfoLine icon={<MapPin />} label="Adresse" value={profile.company_address} />
              <InfoLine icon={<Phone />} label="Téléphone" value={profile.company_phone} />
              <InfoLine icon={<CreditCard />} label="SIRET / SIREN" value={profile.company_siret} />
              <InfoLine icon={<ScrollText />} label="RCS / RM" value={profile.company_rcs_rm} />
            </div>

            {/* MENTIONS LÉGALES */}
            <div className="border-t border-gray-800 pt-4">
              <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                <ScrollText className="w-5 h-5" /> Mentions légales & conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <InfoLine
                  label="TVA"
                  value={
                    profile.company_tva_option === "non_applicable"
                      ? "Non applicable (art. 293B du CGI)"
                      : profile.company_tva_option
                  }
                />
                <InfoLine
                  label="Pénalités de retard"
                  value={profile.company_penalty_option || "—"}
                />
                <InfoLine
                  label="Frais de recouvrement"
                  value={profile.company_recovery_fee_option || "—"}
                />
                <InfoLine
                  label="Escompte"
                  value={profile.company_escompte_option || "—"}
                />
                <InfoLine
                  label="Type de mentions légales"
                  value={profile.company_legal_mentions_option || "—"}
                />
                <div className="md:col-span-2 text-gray-400 bg-gray-950/50 border border-gray-800 rounded-xl p-3">
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {profile.company_legal_mentions_text || "Aucune mention personnalisée."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* === STATS & GRAPHIQUES === */}
        {plan === "free" ? (
          <div className="text-center border border-blue-800/30 bg-gradient-to-r from-gray-900 via-gray-950 to-blue-950/20 rounded-2xl p-8 shadow-md">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              Débloquez vos statistiques de performance 📊
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              Suivez vos revenus, vos dernières factures et vos tendances dès la version Premium.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/abo")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 mx-auto"
            >
              <Star className="w-4 h-4" /> Passer Premium
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Dernières 24h"
                value={`${stats["24h"].total.toLocaleString("fr-FR")} €`}
                subtext={`${stats["24h"].count} facture(s)`}
                color="from-blue-500 to-cyan-500"
                icon={<Clock className="w-6 h-6 text-blue-300" />}
              />
              <StatCard
                title="7 derniers jours"
                value={`${stats["7j"].total.toLocaleString("fr-FR")} €`}
                subtext={`${stats["7j"].count} facture(s)`}
                color="from-emerald-500 to-teal-500"
                icon={<FileText className="w-6 h-6 text-emerald-300" />}
              />
              <StatCard
                title="30 derniers jours"
                value={`${stats["30j"].total.toLocaleString("fr-FR")} €`}
                subtext={`${stats["30j"].count} facture(s)`}
                color="from-purple-500 to-fuchsia-500"
                icon={<CreditCard className="w-6 h-6 text-fuchsia-300" />}
              />
            </div>

            <DashboardCharts
              chartType={chartType}
              setChartType={setChartType}
              chartData={chartData}
              invoices={invoices}
              plan={plan}
            />

            {plan === "premium" && (
              <div className="text-center mt-8 border border-amber-500/30 bg-amber-900/10 rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                  Passez au niveau Professionnel 🚀
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Accédez à la gestion avancée des clients, aux statistiques détaillées et aux exports comptables.
                </p>
                <Button
                  onClick={() => (window.location.href = "/dashboard/abo")}
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-90 text-black flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" /> Passer Pro
                </Button>
              </div>
            )}
          </>
        )}
      </motion.div>

      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onCreated={() => window.location.reload()}
      />
    </LayoutDashboard>
  );
}

/* ===============================
   🧩 Sous-composant ligne info
================================= */
function InfoLine({ icon, label, value }: any) {
  return (
    <p className="flex items-center gap-2 text-gray-300 text-sm">
      {icon && <span className="text-blue-400">{icon}</span>}
      <span className="text-gray-400">{label} :</span>
      <span className="text-gray-200 font-medium">{value || "—"}</span>
    </p>
  );
}
