// lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ✅ Récupération des variables d’environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY; // compatibilité optionnelle

// 🛑 Vérification stricte : empêche un build silencieux cassé
if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [
    !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
    !supabaseAnonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]
    .filter(Boolean)
    .join(", ");

  throw new Error(
    `❌ Configuration Supabase incomplète : variable(s) manquante(s) → ${missing}`
  );
}

// ✅ Création du client Supabase
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ✅ Log utile en développement
if (process.env.NODE_ENV === "development") {
  console.log("🟢 Supabase client initialisé avec succès :", supabaseUrl);
}
