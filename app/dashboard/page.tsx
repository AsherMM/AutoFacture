"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LayoutDashboard from "../components/ui/layout-dashboard";
import { motion } from "framer-motion";
import {
  CreditCard,
  FileText,
  Settings,
  Plus,
  LogOut,
  Building2,
  MapPin,
  Phone,
  Briefcase,
  Clock,
  BarChart3,
  LineChart,
  Star,
  Lock,
  Zap,
  Check,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import InvoiceModal from "../components/ui/invoice-modal";
import Image from "next/image";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  CompanySection,
  PlanFreeSection,
  PlanPremiumSection,
  StatCard,
  DashboardCharts,
} from "./components";

/* ==========================================================================
   DASHBOARD PRINCIPAL
   ========================================================================== */

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    "24h": { count: 0, total: 0 },
    "7j": { count: 0, total: 0 },
    "30j": { count: 0, total: 0 },
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // --- VARIABLES PLAN / ROLE / FACTURES ---
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [role, setRole] = useState<"user" | "admin">("user");

  // ============================================================
  // 🧠 RÉCUPÉRATION DES DONNÉES UTILISATEUR + FACTURES
  // ============================================================
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) return;

      // --- Profil utilisateur ---
      const { data: profileData, error: userError } = await supabase
        .from("users")
        .select(
          `
          id, email, role, subscription_status, 
          name, company_name, company_siret, 
          company_logo_urls, company_address, 
          company_phone, company_status, company_description
          `
        )
        .eq("id", user.id)
        .maybeSingle();

      if (userError) console.error("Erreur Supabase users:", userError);

      if (profileData) {
        setProfile(profileData);
        setRole(profileData.role || "user");

        // ✅ Déterminer plan (Premium / Admin / Free)
        const computedPlan =
          profileData.subscription_status === "premium" ||
          profileData.role === "admin"
            ? "premium"
            : "free";
        setPlan(computedPlan);
      }

      // --- Factures utilisateur ---
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (invoicesData) {
        setInvoices(invoicesData.slice(0, 5));

        const now = new Date();

        // Fonction pour les stats dynamiques
        const getStats = (days: number) => {
          const start = new Date(now);
          start.setDate(now.getDate() - days);
          const filtered = invoicesData.filter(
            (inv: any) => new Date(inv.created_at) >= start
          );
          return {
            count: filtered.length,
            total: filtered.reduce(
              (acc: number, inv: any) => acc + (inv.amount || 0),
              0
            ),
          };
        };

        // Mise à jour stats
        setStats({
          "24h": getStats(1),
          "7j": getStats(7),
          "30j": getStats(30),
        });

        // --- Génération des données graphiques (30 derniers jours)
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(now.getDate() - (29 - i));
          const day = d.toISOString().split("T")[0];
          const total = invoicesData
            .filter((inv: any) => inv.created_at.startsWith(day))
            .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
          return {
            date: d.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
            }),
            total,
          };
        });
        setChartData(last30Days);

        // --- Compteur mensuel (limite pour Free)
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyInvoices = invoicesData.filter((inv: any) => {
          const d = new Date(inv.created_at);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        setMonthlyCount(monthlyInvoices.length);
      }
    };
    fetchData();
  }, []);

  // ============================================================
  // 🔒 DÉCONNEXION
  // ============================================================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // ============================================================
  // 🚀 LOGIQUE DE PLAN
  // ============================================================
  const canCreate = plan === "premium" || (plan === "free" && monthlyCount < 5);

  if (!user)
    return (
      <LayoutDashboard>
        <div className="flex h-screen items-center justify-center text-gray-400">
          Chargement...
        </div>
      </LayoutDashboard>
    );

  // ============================================================
  // 🎨 RENDU VISUEL PRINCIPAL
  // ============================================================
  return (
    <LayoutDashboard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10 text-gray-100"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
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
              className={`bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-md flex items-center gap-2 transition-all ${
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
          transition={{ delay: 0.05 }}
          className={`flex items-center justify-between p-5 rounded-2xl border shadow-md backdrop-blur-sm ${
            role === "admin"
              ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
              : plan === "premium"
              ? "border-amber-500/40 bg-gradient-to-r from-yellow-500/10 to-orange-400/10 text-amber-200"
              : "border-blue-500/40 bg-blue-500/10 text-blue-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {role === "admin" ? (
              <>
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <p>
                  Statut :{" "}
                  <span className="font-semibold text-purple-400">
                    Administrateur
                  </span>{" "}
                  — accès complet Premium 💎
                </p>
              </>
            ) : plan === "premium" ? (
              <>
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <p>
                  Statut :{" "}
                  <span className="font-semibold text-yellow-400">Premium</span>{" "}
                  — toutes les fonctionnalités débloquées
                </p>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-blue-400" />
                <p>
                  Statut :{" "}
                  <span className="font-semibold text-blue-400">Free</span> —{" "}
                  passez Premium pour tout débloquer
                </p>
              </>
            )}
          </div>

          {plan === "free" && role !== "admin" && (
            <Button className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white text-sm">
              Devenir Premium
            </Button>
          )}
        </motion.div>

        {/* PLAN (FREE / PREMIUM) */}
        {plan === "free" && role !== "admin" ? (
          <PlanFreeSection monthlyCount={monthlyCount} />
        ) : (
          <PlanPremiumSection />
        )}

        {/* SECTION ENTREPRISE */}
        <CompanySection profile={profile} />

        {/* STATISTIQUES CHIFFRÉES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatCard
            title="Dernières 24h"
            value={`${stats["24h"].total.toLocaleString("fr-FR")} €`}
            subtext={`${stats["24h"].count} facture${
              stats["24h"].count > 1 ? "s" : ""
            }`}
            color="from-blue-500 to-cyan-500"
            icon={<Clock className="w-6 h-6 text-blue-300" />}
          />
          <StatCard
            title="7 derniers jours"
            value={`${stats["7j"].total.toLocaleString("fr-FR")} €`}
            subtext={`${stats["7j"].count} facture${
              stats["7j"].count > 1 ? "s" : ""
            }`}
            color="from-emerald-500 to-teal-500"
            icon={<FileText className="w-6 h-6 text-emerald-300" />}
          />
          <StatCard
            title="30 derniers jours"
            value={`${stats["30j"].total.toLocaleString("fr-FR")} €`}
            subtext={`${stats["30j"].count} facture${
              stats["30j"].count > 1 ? "s" : ""
            }`}
            color="from-purple-500 to-fuchsia-500"
            icon={<CreditCard className="w-6 h-6 text-fuchsia-300" />}
          />
        </motion.div>

        {/* GRAPHIQUE + FACTURES RÉCENTES */}
        <DashboardCharts
          chartType={chartType}
          setChartType={setChartType}
          chartData={chartData}
          invoices={invoices}
          plan={plan}
        />
      </motion.div>

      {/* MODAL FACTURE */}
      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onCreated={() => window.location.reload()}
      />
    </LayoutDashboard>
  );
}
