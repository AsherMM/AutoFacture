"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Shield,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";
import { supabase } from "lib/supabaseClient";
import { motion } from "framer-motion";
import clsx from "clsx";

/* ==========================================================================
   🔹 NAVIGATION DYNAMIQUE SELON LE RÔLE
   ========================================================================== */
export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupération du rôle utilisateur depuis Supabase
  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) console.error("Erreur récupération rôle:", error);
      setRole(data?.role || "user");
      setLoading(false);
    };
    fetchUserRole();
  }, []);

  // Définition dynamique des items selon le rôle
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Factures", href: "/dashboard/factures", icon: FileText },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  ];

  // Admin Panel (visible uniquement pour admin)
  const adminItem = {
    name: "Panel Admin",
    href: "/dashboard/admin",
    icon: Shield,
    color: "text-purple-400",
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading)
    return (
      <aside className="bg-gray-950 text-gray-300 w-64 h-screen flex items-center justify-center border-r border-gray-800">
        <div className="animate-pulse text-sm text-gray-500">Chargement...</div>
      </aside>
    );

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="bg-gray-950 text-gray-100 w-64 h-screen flex flex-col shadow-2xl border-r border-gray-800"
    >
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-800 bg-gradient-to-r from-gray-950 to-gray-900/90">
        <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          AutoFacture ⚡
        </h1>
        <p className="text-sm text-gray-500 mt-1">Votre assistant comptable</p>
        {role === "admin" && (
          <p className="text-xs mt-2 text-purple-400 font-medium bg-purple-500/10 px-2 py-1 rounded-md inline-block">
            Administrateur
          </p>
        )}
      </div>

      {/* NAVIGATION PRINCIPALE */}
      <nav className="flex-1 mt-6 space-y-2 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "group flex items-center px-6 py-3 text-sm font-medium transition-all rounded-lg mx-3",
                active
                  ? "bg-gradient-to-r from-blue-600/30 to-indigo-700/20 text-blue-400 shadow-md border border-blue-600/20"
                  : "hover:bg-gray-800/60 text-gray-400 hover:text-blue-300"
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5 mr-3 transition-all group-hover:scale-110",
                  active ? "text-blue-400" : "text-gray-500"
                )}
              />
              {name}
            </Link>
          );
        })}

        {/* PANEL ADMIN */}
        {role === "admin" && (
          <div className="mt-4 border-t border-gray-800 pt-4">
            <Link
              href={adminItem.href}
              className={clsx(
                "flex items-center px-6 py-3 text-sm font-medium rounded-lg mx-3 transition-all hover:bg-purple-700/20 text-purple-400 border border-purple-500/20"
              )}
            >
              <adminItem.icon className="w-5 h-5 mr-3" />
              {adminItem.name}
            </Link>
          </div>
        )}
      </nav>

      {/* PIED DE BARRE */}
      <div className="px-6 py-4 border-t border-gray-800 bg-gray-950/80">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/settings"
            className="text-xs text-gray-500 hover:text-blue-400 transition-all flex items-center gap-1"
          >
            <Settings className="w-4 h-4" /> Paramètres
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
        <p className="text-[10px] text-gray-600 mt-3">
          © {new Date().getFullYear()} AutoFacture — Tous droits réservés
        </p>
      </div>
    </motion.aside>
  );
}
