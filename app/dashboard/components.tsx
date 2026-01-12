"use client";

import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Phone,
  Settings,
  Check,
  Zap,
  Lock,
  Star,
  LineChart,
  BarChart3,
  Briefcase,
  Clock,
} from "lucide-react";
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

/* ==========================================================================
   🏢 SECTION ENTREPRISE
   ========================================================================== */
export function CompanySection({ profile }: { profile: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* LOGO ENTREPRISE */}
        <div className="flex-shrink-0">
          {profile?.company_logo_urls && profile.company_logo_urls.length > 0 ? (
            <Image
              src={profile.company_logo_urls[0]}
              alt="Logo entreprise"
              width={110}
              height={110}
              className="object-contain rounded-xl border border-gray-700 bg-gray-900 p-3 shadow-md"
              unoptimized
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 text-sm">
              Aucun logo
            </div>
          )}
        </div>

        {/* INFOS ENTREPRISE */}
        <div className="flex-1 space-y-2 text-gray-300">
          <h2 className="text-2xl font-semibold text-blue-400 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            {profile?.company_name || "Nom de l’entreprise non défini"}
          </h2>
          <p className="text-sm text-gray-400 italic">
            {profile?.company_status || "Statut juridique non renseigné"}
          </p>
          {profile?.company_siret && (
            <p className="text-sm text-gray-400">
              <span className="text-gray-500">SIRET :</span>{" "}
              {profile.company_siret}
            </p>
          )}
          {profile?.company_description && (
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              {profile.company_description}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              {profile?.company_address || "Adresse non définie"}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              {profile?.company_phone || "Téléphone non défini"}
            </p>
          </div>
        </div>

        {/* BOUTON PARAMÈTRES */}
        <div>
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-blue-400 hover:bg-gray-800"
          >
            <a href="/dashboard/settings">
              <Settings className="w-4 h-4 mr-2" />
              Modifier profil
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   🆓 PLAN GRATUIT
   ========================================================================== */
export function PlanFreeSection({ monthlyCount }: { monthlyCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
        <Lock className="w-5 h-5" /> Plan actuel : Free
      </h3>
      <p className="text-gray-400 text-sm mt-1">
        Vous pouvez créer jusqu’à{" "}
        <span className="font-semibold text-blue-400">5 factures</span> par mois.
      </p>

      {/* Barre de progression */}
      <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden mt-3">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{ width: `${(monthlyCount / 5) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {monthlyCount}/5 factures utilisées ce mois-ci
      </p>

      {/* Cartes Upgrade */}
      <div className="mt-5 flex flex-col md:flex-row gap-4">
        <UpgradeCard
          title="Premium Mensuel"
          price="9,99 € / mois"
          highlight
          features={[
            "Factures illimitées",
            "Support prioritaire",
            "Statistiques avancées",
            "Graphes interactifs",
          ]}
        />
        <UpgradeCard
          title="Premium Annuel"
          price="99,99 € / an"
          features={[
            "Factures illimitées",
            "Support prioritaire",
            "Économie 20%",
            "Analyses intelligentes",
          ]}
        />
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   💎 PLAN PREMIUM
   ========================================================================== */
export function PlanPremiumSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-700/50 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-400" /> AutoFacture Premium 💎
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            Facturation illimitée, support prioritaire et outils d’analyse avancés.
          </p>
        </div>
        <div className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-md">
          Abonnement actif
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   📊 CARTE STATISTIQUE
   ========================================================================== */
export function StatCard({
  title,
  value,
  subtext,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 160 }}
      className={`relative overflow-hidden rounded-2xl p-6 border border-gray-800 shadow-md bg-gray-900/80 backdrop-blur-md`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-100">{value}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtext}</p>
        </div>
        <div className="p-3 bg-gray-950/70 rounded-lg">{icon}</div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   ⚡️ CARTE UPGRADE PREMIUM
   ========================================================================== */
export function UpgradeCard({
  title,
  price,
  features,
  highlight = false,
}: {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`flex-1 p-5 rounded-2xl border shadow-md bg-gray-900/80 ${
        highlight
          ? "border-indigo-500/70 shadow-indigo-500/20"
          : "border-gray-700"
      }`}
    >
      {highlight && (
        <div className="text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 py-0.5 rounded-full inline-block mb-2">
          Populaire
        </div>
      )}
      <h4 className="text-gray-100 font-semibold text-lg">{title}</h4>
      <p className="text-indigo-400 text-sm mb-3">{price}</p>
      <ul className="text-gray-400 text-sm space-y-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-indigo-400" /> {f}
          </li>
        ))}
      </ul>
      <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600">
        <Zap className="w-4 h-4 mr-2" /> Passer Premium
      </Button>
    </motion.div>
  );
}

/* ==========================================================================
   📈 SECTION GRAPHIQUES + FACTURES RÉCENTES
   ========================================================================== */
export function DashboardCharts({
  chartType,
  setChartType,
  chartData,
  invoices,
  plan,
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* GRAPHIQUE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-lg lg:col-span-2"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            Statistiques d’activité
          </h3>

          {/* Boutons graphes */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setChartType("line")}
              variant={chartType === "line" ? "default" : "outline"}
              className="text-sm flex items-center gap-1"
            >
              <LineChart className="w-4 h-4" /> Courbe
            </Button>
            <Button
              onClick={() => setChartType("bar")}
              variant={chartType === "bar" ? "default" : "outline"}
              className="text-sm flex items-center gap-1"
            >
              <BarChart3 className="w-4 h-4" /> Barres
            </Button>
          </div>
        </div>

        {/* Graphique principal */}
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "line" ? (
            <RLineChart data={chartData}>
              <defs>
                <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  background: "rgba(30,30,40,0.85)",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="url(#colorLine)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#818cf8", strokeWidth: 1 }}
                activeDot={{ r: 6, fill: "#6366f1" }}
              />
            </RLineChart>
          ) : (
            <RBarChart data={chartData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  background: "rgba(30,30,40,0.85)",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="total" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
            </RBarChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* DERNIÈRES FACTURES */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-lg flex flex-col"
      >
        <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" /> Dernières factures
        </h3>
        {invoices.length === 0 ? (
          <p className="text-gray-500 italic text-center mt-10">
            Aucune facture récente.
          </p>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
            {invoices.map((invoice: any) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between bg-gray-800/70 border border-gray-700 rounded-xl px-4 py-3 hover:bg-gray-800/90 transition-all"
              >
                <div className="flex items-center gap-3">
                  {invoice.logo_url ? (
                    <Image
                      src={invoice.logo_url}
                      alt="logo"
                      width={36}
                      height={36}
                      className="rounded-md border border-gray-700 bg-gray-900 p-1 object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-600 text-xs">
                      —
                    </div>
                  )}
                  <div>
                    <p className="text-gray-100 font-medium text-sm">
                      {invoice.client_name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(invoice.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-100 font-semibold text-sm">
                    {invoice.amount.toLocaleString("fr-FR")} €
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      invoice.status === "Validée"
                        ? "bg-green-600/20 text-green-400 border border-green-500/30"
                        : invoice.status === "En cours"
                        ? "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-red-600/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
