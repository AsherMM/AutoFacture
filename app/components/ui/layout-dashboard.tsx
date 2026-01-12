"use client";

import Sidebar from "./sidebar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 🔄 Remonte automatiquement en haut à chaque changement de page
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* === SIDEBAR === */}
      <Sidebar />

      {/* === CONTENU PRINCIPAL === */}
      <motion.main
        key={pathname} // 💫 permet une transition fluide à chaque navigation
        className="flex-1 relative overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900/30 px-8 md:px-12 py-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Dégradé lumineux subtile en fond */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.05)_0%,_transparent_70%)]"></div>
        
        {/* Contenu */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
