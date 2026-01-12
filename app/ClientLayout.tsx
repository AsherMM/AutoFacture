"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import SessionGuard from "./components/SessionGuard";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes protégées (dashboard et ses sous-routes uniquement)
  const protectedRoutes = ["/dashboard"];
  const isProtected = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-x-hidden antialiased">
      {/* --- FOND DÉCORATIF --- */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent opacity-50 blur-3xl" />

      {/* --- CONTENU PRINCIPAL --- */}
      {isProtected ? (
        <SessionGuard>
          <AnimatedContent key={pathname}>{children}</AnimatedContent>
        </SessionGuard>
      ) : (
        <AnimatedContent key={pathname}>{children}</AnimatedContent>
      )}

      {/* --- TOASTER (notifications globales) --- */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "#111827",
            color: "#f3f4f6",
            border: "1px solid #374151",
            fontSize: "0.9rem",
            borderRadius: "0.75rem",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1)",
          },
          classNames: {
            title: "font-semibold text-gray-100",
            description: "text-gray-400",
          },
        }}
      />
    </div>
  );
}

/**
 * Composant gérant les animations de transition de page.
 */
function AnimatedContent({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={Math.random()} // Forcer un léger remount entre routes
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
