"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "lib/supabaseClient";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      setSession(data.session);
      setIsLoading(false);
    };

    checkSession();

    // 🔄 Met à jour la session à chaque changement d’état
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return; // 🔒 Attendre la session avant toute redirection

    const publicRoutes = ["/", "/login", "/register"];
    const isPublic = publicRoutes.some((route) => pathname === route);

    if (session && isPublic) {
      router.replace("/dashboard");
    } else if (!session && pathname.startsWith("/dashboard")) {
      router.replace("/login");
    }
  }, [isLoading, pathname, router, session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 animate-pulse">
        Vérification de la session en cours...
      </div>
    );
  }

  return <>{children}</>;
}
