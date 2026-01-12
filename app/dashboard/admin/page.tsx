"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  FileText,
  DollarSign,
  RefreshCcw,
  Activity,
  Search,
  Trash2,
  Unlock,
  Lock,
  BarChart3,
  BellRing,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useToast } from "../../components/ui/use-toast";
import clsx from "clsx";

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState<{
    totalUsers: number;
    premiumUsers: number;
    freeUsers: number;
    totalInvoices: number;
    totalRevenue: number;
    avgInvoice: number;
    revenuePerUser: number;
  } | null>(null);

  const [revenueAnalysis, setRevenueAnalysis] = useState<any>({
    monthly: [],
    yearly: [],
    daily: [],
  });

  /* ============================================================
     🔐 Vérification de rôle & Authentification
  ============================================================ */
  useEffect(() => {
    const verifyAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/dashboard");
      setUser(user);

      const { data } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
      if (!data || data.role !== "admin") return router.push("/dashboard");
      setRole("admin");

      await loadAdminData();
      setupRealtimeSubscriptions();
    };

    verifyAdmin();
  }, [router]);

  /* ============================================================
     🔄 Realtime Sync + Notifications sonores
  ============================================================ */
  const setupRealtimeSubscriptions = () => {
    const notify = (msg: string, type: "success" | "info" | "error") => {
      toast({
        title: "📡 Mise à jour en temps réel",
        description: msg,
        type,
        duration: 4000,
      });
      const sound = new Audio("/sounds/notify.mp3");
      sound.volume = 0.3;
      sound.play();
    };

    const userSub = supabase
      .channel("users_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, (payload) => {
        notify(`Utilisateur ${payload.eventType.toLowerCase()} détecté`, "info");
        loadAdminData();
      })
      .subscribe();

    const invoiceSub = supabase
      .channel("invoices_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices" }, (payload) => {
        notify(`Facture ${payload.eventType.toLowerCase()} détectée`, "success");
        loadAdminData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(userSub);
      supabase.removeChannel(invoiceSub);
    };
  };

  /* ============================================================
     📊 Chargement des données
  ============================================================ */
  async function loadAdminData(showToast = false) {
    setLoading(true);
    const [usersRes, invoicesRes] = await Promise.all([
      supabase.from("users").select("*").order("created_at", { ascending: false }),
      supabase.from("invoices").select("*"),
    ]);

    if (usersRes.error || invoicesRes.error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données depuis Supabase.",
        type: "error",
      });
      return;
    }

    const userList = usersRes.data || [];
    const invoiceList = invoicesRes.data || [];

    const totalRevenue = invoiceList.reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const totalUsers = userList.length;
    const premiumUsers = userList.filter((u) => u.subscription_status === "premium").length;
    const freeUsers = totalUsers - premiumUsers;
    const avgInvoice = invoiceList.length > 0 ? totalRevenue / invoiceList.length : 0;
    const revenuePerUser = totalUsers ? totalRevenue / totalUsers : 0;

    setStats({
      totalUsers,
      premiumUsers,
      freeUsers,
      totalInvoices: invoiceList.length,
      totalRevenue,
      avgInvoice,
      revenuePerUser,
    });

    setRevenueAnalysis({
      monthly: generateRevenueByPeriod(invoiceList, "month"),
      yearly: generateRevenueByPeriod(invoiceList, "year"),
      daily: generateRevenueByPeriod(invoiceList, "day"),
    });

    setLogs((prev) => [
      { id: Date.now(), action: "Données synchronisées", by: "Supabase", date: new Date().toLocaleString() },
      ...prev.slice(0, 9),
    ]);

    if (showToast) {
      toast({
        title: "🔁 Données actualisées",
        description: "Le panneau d'administration a été rafraîchi avec succès.",
        type: "success",
      });
    }

    setLoading(false);
  }

  /* ============================================================
     🔍 Filtrage des utilisateurs
  ============================================================ */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        <RefreshCcw className="animate-spin mr-2 w-5 h-5" /> Chargement du panneau d’administration...
      </div>
    );

  /* ============================================================
     🎨 UI
  ============================================================ */
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-2">
            <Shield className="w-7 h-7 text-purple-500" /> Panneau d’administration AutoSAS
          </h1>
          <p className="text-gray-500 mt-1">Synchronisation en direct + statistiques complètes</p>
        </div>
        <Button
          onClick={() => loadAdminData(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
        >
          <RefreshCcw className="w-4 h-4 mr-2" /> Rafraîchir
        </Button>
      </header>

      <motion.div animate={{ opacity: [0, 1], y: [10, 0] }} transition={{ duration: 0.6 }}>
        <RealtimeDashboard stats={stats} revenueAnalysis={revenueAnalysis} users={filteredUsers} logs={logs} />
      </motion.div>
    </div>
  );
}

/* ========================================================================== */
/* 🧱 COMPOSANTS INTERNES */
/* ========================================================================== */

function RealtimeDashboard({ stats, revenueAnalysis, users, logs }: any) {
  return (
    <>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <AdminStatCard title="Utilisateurs" value={stats.totalUsers} icon={<Users />} color="from-blue-500 to-cyan-500" />
          <AdminStatCard title="Premium" value={stats.premiumUsers} icon={<Unlock />} color="from-yellow-500 to-orange-500" />
          <AdminStatCard title="Free" value={stats.freeUsers} icon={<Lock />} color="from-gray-700 to-gray-900" />
          <AdminStatCard title="Factures" value={stats.totalInvoices} icon={<FileText />} color="from-green-500 to-emerald-600" />
          <AdminStatCard title="Revenus" value={`${stats.totalRevenue.toLocaleString("fr-FR")} €`} icon={<DollarSign />} color="from-purple-500 to-fuchsia-600" />
          <AdminStatCard title="Revenu / utilisateur" value={`${Math.round(stats.revenuePerUser)} €`} icon={<BarChart3 />} color="from-indigo-500 to-blue-600" />
        </div>
      )}

      <Suspense fallback={<p>Chargement...</p>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="Revenus journaliers" color="text-pink-400" data={revenueAnalysis.daily} />
          <ChartCard title="Revenus mensuels" color="text-purple-400" data={revenueAnalysis.monthly} />
          <ChartCard title="Revenus annuels" color="text-indigo-400" data={revenueAnalysis.yearly} />
        </div>
      </Suspense>

      <UserTable users={users} />
      <LogsSection logs={logs} />
    </>
  );
}

function AdminStatCard({ title, value, icon, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-md overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
      <div className="relative flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
        </div>
        <div className="bg-gray-800/70 p-3 rounded-lg">{icon}</div>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, color, data }: any) {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className={clsx("text-lg font-semibold mb-3", color)}>{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
          <XAxis dataKey="label" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid #333" }} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function UserTable({ users }: any) {
  return (
    <div className="overflow-x-auto bg-gray-900/70 border border-gray-800 rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" /> Utilisateurs enregistrés
      </h2>
      <table className="w-full text-sm text-left text-gray-300 border-collapse">
        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="py-3 px-4">Nom</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Abonnement</th>
            <th className="py-3 px-4">Inscription</th>
            <th className="py-3 px-4">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <motion.tr
              key={u.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-800 hover:bg-gray-800/40 transition"
            >
              <td className="py-3 px-4">{u.name || "—"}</td>
              <td className="py-3 px-4">{u.email}</td>
              <td className="py-3 px-4">
                {u.subscription_status === "premium" ? (
                  <span className="text-yellow-400">Premium</span>
                ) : (
                  <span className="text-gray-400">Free</span>
                )}
              </td>
              <td className="py-3 px-4">
                {new Date(u.created_at).toLocaleDateString("fr-FR")}
              </td>
              <td className="py-3 px-4 capitalize">
                {u.role === "admin" ? (
                  <span className="text-purple-400 font-semibold">Admin</span>
                ) : (
                  "User"
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogsSection({ logs }: any) {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" /> Journal Realtime
      </h2>
      <ul className="space-y-3">
        {logs.map((log: any) => (
          <li
            key={log.id}
            className="flex justify-between bg-gray-800/50 rounded-lg px-4 py-2 text-sm text-gray-300"
          >
            <div>
              <p className="font-medium text-gray-100">{log.action}</p>
              <p className="text-gray-500 text-xs">{log.by}</p>
            </div>
            <p className="text-gray-400 text-xs">{log.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ========================================================================== */
/* 📈 Données analytiques */
/* ========================================================================== */
function generateRevenueByPeriod(invoices: any[], period: "day" | "month" | "year") {
  const grouped: Record<string, number> = {};
  invoices.forEach((inv) => {
    const date = new Date(inv.created_at);
    let key = "";
    if (period === "day") key = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
    if (period === "month") key = date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    if (period === "year") key = date.getFullYear().toString();
    grouped[key] = (grouped[key] || 0) + (inv.amount || 0);
  });

  return Object.entries(grouped).map(([label, revenue]) => ({ label, revenue }));
}
