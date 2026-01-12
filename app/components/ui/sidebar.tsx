"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Shield,
  Users,
  Settings,
  HelpCircle,
  Brain,
  Lock,
  CreditCard,
} from "lucide-react";
import { supabase } from "lib/supabaseClient";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [subscription, setSubscription] = useState<"free" | "premium" | "pro">("free");
  const [loading, setLoading] = useState(true);

  /* ============================================================
     🧠 Chargement des infos utilisateur
  ============================================================ */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          await supabase.auth.signOut();
          router.replace("/login");
          return;
        }

        const { data, error: userError } = await supabase
          .from("users")
          .select("role, subscription_status")
          .eq("id", user.id)
          .maybeSingle();

        if (userError) console.error("Erreur récupération user:", userError.message);

        setRole(data?.role || "user");
        setSubscription(
          (data?.subscription_status as "free" | "premium" | "pro") || "free"
        );
      } catch (e) {
        console.error("Erreur critique chargement user:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  /* ============================================================
     📦 Données de navigation
  ============================================================ */
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      locked: false,
    },
    {
      name: "Factures",
      href: "/dashboard/factures",
      icon: FileText,
      locked: false,
    },
    {
      name: "Clients",
      href: "/dashboard/clients",
      icon: Users,
      // ✅ Débloqué uniquement pour les PRO ou ADMIN
      locked: !(subscription === "pro" || role === "admin"),
    },
    {
      name: "Support",
      href: "/dashboard/support",
      icon: HelpCircle,
      locked: false,
    },
    {
      name: "Abonnement",
      href: "/dashboard/abo",
      icon: CreditCard,
      locked: false,
    },
  ];

  const adminItem = {
    name: "Panel Admin",
    href: "/dashboard/admin",
    icon: Shield,
  };

  /* ============================================================
     🚪 Déconnexion
  ============================================================ */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  /* ============================================================
     🌀 Chargement
  ============================================================ */
  if (loading)
    return (
      <aside className="bg-gray-950 text-gray-400 w-64 h-screen flex items-center justify-center border-r border-gray-800">
        <div className="animate-pulse text-sm">Chargement...</div>
      </aside>
    );

  /* ============================================================
     🎨 Rendu principal
  ============================================================ */
  return (
    <motion.aside
      initial={{ x: -220 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 15 }}
      className="bg-gray-950 text-gray-100 w-64 h-screen flex flex-col shadow-2xl border-r border-gray-800"
    >
      {/* HEADER — Branding */}
      <div className="px-6 py-5 border-b border-gray-800 bg-gradient-to-r from-gray-950 to-gray-900/90">
        <h1 className="text-2xl font-extrabold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          <Brain className="w-6 h-6 text-blue-500" /> AutoFacture
        </h1>
        <p className="text-sm text-gray-500 mt-1">by NeuriFlux</p>

        {role === "admin" ? (
          <p className="text-xs mt-2 text-purple-400 font-semibold bg-purple-500/10 px-2 py-1 rounded-md inline-block">
            Administrateur
          </p>
        ) : (
          <p
            className={clsx(
              "text-xs mt-2 font-medium px-2 py-1 rounded-md inline-block",
              subscription === "pro"
                ? "text-amber-400 bg-amber-500/10"
                : subscription === "premium"
                ? "text-blue-400 bg-blue-500/10"
                : "text-gray-400 bg-gray-700/10"
            )}
          >
            Plan : {subscription}
          </p>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 mt-6 space-y-1 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon, locked }) => {
          const active = pathname === href;
          return (
            <div key={href} className="mx-3">
              <Link
                href={locked ? "#" : href}
                onClick={(e) => locked && e.preventDefault()}
                className={clsx(
                  "group flex items-center px-5 py-3 text-sm font-medium rounded-lg transition-all border border-transparent",
                  active
                    ? "bg-gradient-to-r from-blue-600/30 to-indigo-700/20 text-blue-400 border-blue-600/20 shadow-md"
                    : "hover:bg-gray-800/60 text-gray-400 hover:text-blue-300",
                  locked && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon
                  className={clsx(
                    "w-5 h-5 mr-3 transition-all group-hover:scale-110",
                    active ? "text-blue-400" : "text-gray-500"
                  )}
                />
                {name}
                {locked && (
                  <span className="ml-auto text-[10px] uppercase text-blue-400 font-semibold">
                    Pro
                  </span>
                )}
              </Link>
            </div>
          );
        })}

        {/* SECTION ADMIN */}
        {role === "admin" && (
          <div className="mt-4 border-t border-gray-800 pt-3">
            <Link
              href={adminItem.href}
              className="flex items-center px-6 py-3 text-sm font-semibold rounded-lg mx-3 transition-all border border-purple-500/20 text-purple-400 hover:bg-purple-700/10"
            >
              <adminItem.icon className="w-5 h-5 mr-3" />
              {adminItem.name}
            </Link>
          </div>
        )}
      </nav>

      {/* FOOTER */}
      <div className="px-6 py-5 border-t border-gray-800 bg-gray-950/80 space-y-3">
        <div className="flex justify-between items-center">
          <Link
            href="/dashboard/settings"
            className="text-xs text-gray-500 hover:text-blue-400 transition-all flex items-center gap-1"
          >
            <Settings className="w-4 h-4" /> Paramètres
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-all"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
        <p className="text-[10px] text-gray-600 mt-3 leading-tight">
          © {new Date().getFullYear()}{" "}
          <span className="text-blue-400 font-medium">NeuriFlux</span> — AutoFacture.
        </p>
      </div>
    </motion.aside>
  );
}
