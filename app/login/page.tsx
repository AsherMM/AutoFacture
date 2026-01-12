"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "lib/supabaseClient";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);

      // ✅ Redirige vers /dashboard si déjà connecté
      if (currentSession) router.replace("/dashboard");
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) router.replace("/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // 🌀 Loader pendant la vérification initiale
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-gray-400 animate-pulse">
        Chargement...
      </div>
    );
  }

  // 🧾 Formulaire de connexion
  if (!session)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Connexion à AutoFacture ⚡
          </h1>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: { background: "#2563eb", color: "white", borderRadius: "0.5rem" },
                input: { borderRadius: "0.5rem", backgroundColor: "#1f2937", color: "white" },
                label: { color: "#d1d5db" },
              },
              variables: {
                default: {
                  colors: {
                    brand: "#2563eb",
                    brandAccent: "#4338ca",
                    inputBackground: "#1f2937",
                    inputText: "#f3f4f6",
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Adresse e-mail",
                  password_label: "Mot de passe",
                  button_label: "Se connecter",
                },
                sign_up: {
                  email_label: "Adresse e-mail",
                  password_label: "Mot de passe",
                  button_label: "Créer un compte",
                },
              },
            }}
            providers={[]} // tu pourras ajouter "google", "github" plus tard
          />

          <p className="text-gray-500 text-center mt-6 text-sm">
            Pas encore de compte ?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-blue-400 hover:underline"
            >
              Inscrivez-vous ici
            </button>
          </p>
        </motion.div>
      </div>
    );

  // ✅ Si connecté (rarement affiché car redirection instantanée)
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenue, {session?.user?.email}
      </h1>
      <button
        onClick={() => supabase.auth.signOut()}
        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Se déconnecter
      </button>
    </div>
  );
}
