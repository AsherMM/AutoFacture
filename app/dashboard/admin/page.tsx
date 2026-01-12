"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { supabase } from "lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  FileText,
  DollarSign,
  RefreshCcw,
  Activity,
  Trash2,
  Unlock,
  Lock,
  BarChart3,
  Edit3,
  Crown,
  Building2,
  Clock,
  Rocket,
  Globe2,
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
  const [visits, setVisits] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState<{
    totalUsers: number;
    premiumUsers: number;
    proUsers: number;
    totalInvoices: number;
    totalRevenue: number;
    avgInvoice: number;
    revenuePerUser: number;
  } | null>(null);

  const [analytics, setAnalytics] = useState<any>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  /* ============================================================
     🔐 Vérification Admin
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
     🔄 Realtime Sync
  ============================================================ */
  const setupRealtimeSubscriptions = () => {
    const playSound = (file: string) => {
      const sound = new Audio(file);
      sound.volume = 0.3;
      sound.play();
    };

    const userSub = supabase
      .channel("users_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => {
        playSound("/sounds/notify.mp3");
        loadAdminData(true);
      })
      .subscribe();

    const invoiceSub = supabase
      .channel("invoices_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices" }, () => {
        playSound("/sounds/success.mp3");
        loadAdminData(true);
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

    const [usersRes, invoicesRes, visitsRes] = await Promise.all([
      supabase.from("users").select("*").order("created_at", { ascending: false }),
      supabase.from("invoices").select("*"),
      supabase.from("analytics_visits").select("*"),
    ]);

    if (usersRes.error || invoicesRes.error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données depuis Supabase.",
      });
      return;
    }

    const userList = usersRes.data || [];
    const invoiceList = invoicesRes.data || [];
    const visitList = visitsRes.data || [];

    setUsers(userList);
    setInvoices(invoiceList);
    setVisits(visitList);

    // === Stats utilisateurs ===
    const totalUsers = userList.length;
    const premiumUsers = userList.filter((u) => u.subscription_status === "premium").length;
    const proUsers = userList.filter((u) => u.subscription_status === "pro").length;

    // === Revenus ===
    const totalRevenue = invoiceList.reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const avgInvoice = invoiceList.length > 0 ? totalRevenue / invoiceList.length : 0;
    const revenuePerUser = totalUsers ? totalRevenue / totalUsers : 0;

    setStats({
      totalUsers,
      premiumUsers,
      proUsers,
      totalInvoices: invoiceList.length,
      totalRevenue,
      avgInvoice,
      revenuePerUser,
    });

    // === Analytics ===
    setAnalytics({
      daily: generateVisitsByPeriod(visitList, "day"),
      weekly: generateVisitsByPeriod(visitList, "week"),
      monthly: generateVisitsByPeriod(visitList, "month"),
    });

    if (showToast) {
      toast({
        title: "🔁 Données mises à jour",
        description: "Synchronisation en temps réel effectuée.",
      });
    }

    setLoading(false);
  }

  /* ============================================================
     🔍 Filtrage utilisateurs
  ============================================================ */
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-2">
            <Shield className="w-7 h-7 text-purple-500" /> Panneau d’administration NeuriFlux
          </h1>
          <p className="text-gray-500 mt-1">Supervision complète — Realtime & Analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <Button
            onClick={() => loadAdminData(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Rafraîchir
          </Button>
        </div>
      </header>

      {/* === STATS === */}
      <motion.div
        animate={{ opacity: [0, 1], y: [10, 0] }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-6 gap-6"
      >
        <AdminStatCard title="Utilisateurs" value={stats?.totalUsers} icon={<Users />} color="from-blue-500 to-cyan-500" />
        <AdminStatCard title="Premium" value={stats?.premiumUsers} icon={<Unlock />} color="from-yellow-500 to-orange-500" />
        <AdminStatCard title="Pro" value={stats?.proUsers} icon={<Crown />} color="from-amber-500 to-orange-400" />
        <AdminStatCard title="Factures" value={stats?.totalInvoices} icon={<FileText />} color="from-green-500 to-emerald-600" />
        <AdminStatCard title="Revenus" value={`${stats?.totalRevenue.toLocaleString("fr-FR")} €`} icon={<DollarSign />} color="from-purple-500 to-fuchsia-600" />
        <AdminStatCard title="Revenu / user" value={`${Math.round(stats?.revenuePerUser || 0)} €`} icon={<BarChart3 />} color="from-indigo-500 to-blue-600" />
      </motion.div>

      {/* === ANALYTICS === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Visites 24h" color="text-blue-400" data={analytics.daily} />
        <ChartCard title="Visites 7j" color="text-yellow-400" data={analytics.weekly} />
        <ChartCard title="Visites 30j" color="text-purple-400" data={analytics.monthly} />
      </div>

      {/* === UTILISATEURS === */}
      <UserTable users={filteredUsers} reload={loadAdminData} />

      {/* === LOGS === */}
      <LogsSection visits={visits} />
    </div>
  );
}

/* ============================================================
   🧱 COMPOSANTS
============================================================ */
function AdminStatCard({ title, value, icon, color }: any) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="relative p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-md overflow-hidden">
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
          <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ============================================================
   👥 UTILISATEURS — Gestion complète
============================================================ */
function UserTable({ users, reload }: any) {
  const { toast } = useToast();

  const updateUser = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from("users").update({ [field]: value }).eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message });
    else {
      toast({ title: "✅ Modifié avec succès" });
      reload();
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message });
    else {
      toast({ title: "🗑️ Utilisateur supprimé" });
      reload();
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-900/70 border border-gray-800 rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" /> Gestion des utilisateurs
      </h2>
      <table className="w-full text-sm text-left text-gray-300 border-collapse">
        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="py-3 px-4">Nom</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Entreprise</th>
            <th className="py-3 px-4">Abonnement</th>
            <th className="py-3 px-4">Rôle</th>
            <th className="py-3 px-4">Créé le</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
              <td className="py-3 px-4">{u.name || "—"}</td>
              <td className="py-3 px-4">{u.email}</td>
              <td className="py-3 px-4">{u.company_name || "—"}</td>
              <td className="py-3 px-4">
                <select
                  value={u.subscription_status || "free"}
                  onChange={(e) => updateUser(u.id, "subscription_status", e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md text-sm px-2 py-1"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="pro">Pro</option>
                </select>
              </td>
              <td className="py-3 px-4">
                <select
                  value={u.role || "user"}
                  onChange={(e) => updateUser(u.id, "role", e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md text-sm px-2 py-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-3 px-4">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
              <td className="py-3 px-4 text-center flex justify-center gap-3">
                <Button onClick={() => deleteUser(u.id)} className="bg-red-700 hover:bg-red-800 px-2 py-1 text-xs">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   📜 Logs & Activité
============================================================ */
function LogsSection({ visits }: any) {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" /> Activité récente
      </h2>
      <ul className="space-y-3">
        {visits.slice(-10).reverse().map((v: any) => (
          <li key={v.id} className="flex justify-between bg-gray-800/50 rounded-lg px-4 py-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-400" />
              <p className="font-medium text-gray-100">{v.page}</p>
            </div>
            <p className="text-gray-400 text-xs">
              {new Date(v.created_at).toLocaleString("fr-FR")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   📈 Analytics Helper
============================================================ */
function generateVisitsByPeriod(visits: any[], period: "day" | "week" | "month") {
  const grouped: Record<string, number> = {};
  visits.forEach((v) => {
    const d = new Date(v.created_at);
    let key = "";
    if (period === "day") key = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
    if (period === "week") key = `S${Math.ceil(d.getDate() / 7)} ${d.toLocaleDateString("fr-FR", { month: "short" })}`;
    if (period === "month") key = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    grouped[key] = (grouped[key] || 0) + 1;
  });
  return Object.entries(grouped).map(([label, count]) => ({ label, count }));
}
``
