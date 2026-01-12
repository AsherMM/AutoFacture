"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      // Routes publiques
      const publicRoutes = ["/", "/login", "/register"];
      const isPublic = publicRoutes.some((route) => pathname === route);

      // ✅ Connecté et sur une route publique → redirection vers dashboard
      if (session && isPublic) {
        router.replace("/dashboard");
      }
      // 🚫 Non connecté et sur une route privée → redirection vers login
      else if (!session && pathname.startsWith("/dashboard")) {
        router.replace("/login");
      }

      if (active) setIsLoading(false);
    };

    checkSession();

    // 🔄 Surveillance de l'état d'authentification
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const publicRoutes = ["/", "/login", "/register"];
      const isPublic = publicRoutes.some((route) => pathname === route);

      if (session && isPublic) router.replace("/dashboard");
      else if (!session && pathname.startsWith("/dashboard")) router.replace("/login");
    });

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, [pathname, router]);

  // 💫 État de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 animate-pulse">
        Vérification de la session en cours...
      </div>
    );
  }

  return <>{children}</>;
}
