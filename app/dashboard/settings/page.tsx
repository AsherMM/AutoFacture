"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Save,
  Building2,
  CheckCircle2,
  Loader2,
  Upload,
  Trash2,
  ImagePlus,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    name: "",
    company_name: "",
    company_status: "",
    company_description: "",
    company_phone: "",
    company_address: "",
    company_logo_urls: [],
    company_siret: "",
    subscription_status: "free",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ==============================
  // 🧠 1. CHARGEMENT DU PROFIL
  // ==============================
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Erreur récupération utilisateur:", authError);
        setLoading(false);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("users")
        .select(
          "name, company_name, company_status, company_description, company_phone, company_address, company_logo_urls, company_siret, subscription_status"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Erreur Supabase:", error);
        toast.error("Erreur lors du chargement du profil.");
        setLoading(false);
        return;
      }

      if (!data) {
        const empty = {
          name: "",
          company_name: "",
          company_status: "",
          company_description: "",
          company_phone: "",
          company_address: "",
          company_logo_urls: [],
          company_siret: "",
          subscription_status: "free",
        };
        await supabase.from("users").upsert({ id: user.id, email: user.email, ...empty });
        setProfile(empty);
      } else {
        // Rendre company_logo_urls toujours un tableau
        data.company_logo_urls = data.company_logo_urls || [];
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // ==============================
  // 📸 2. UPLOAD DU LOGO
  // ==============================
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const maxImages = profile.subscription_status === "premium" ? 3 : 1;

    if (profile.company_logo_urls.length >= maxImages) {
      toast.error(`Quota atteint (${maxImages} image${maxImages > 1 ? "s" : ""} max).`);
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("company_logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("company_logos").getPublicUrl(filePath);

      const updatedUrls = [...profile.company_logo_urls, data.publicUrl];
      setProfile({ ...profile, company_logo_urls: updatedUrls });

      toast.success("✅ Logo ajouté avec succès !");
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de l’upload du logo.");
    } finally {
      setUploading(false);
    }
  };

  // ==============================
  // 🗑️ 3. SUPPRESSION D'UN LOGO
  // ==============================
  const handleDeleteLogo = async (url: string) => {
    const fileName = url.split("/").pop();
    if (!fileName) return;

    await supabase.storage.from("company_logos").remove([`${user.id}/${fileName}`]);
    const updated = profile.company_logo_urls.filter((u: string) => u !== url);
    setProfile({ ...profile, company_logo_urls: updated });
    toast.info("🗑️ Logo supprimé.");
  };

  // ==============================
  // 💾 4. SAUVEGARDE
  // ==============================
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("users")
      .upsert(
        {
          id: user.id,
          email: user.email,
          ...profile,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    setSaving(false);

    if (error) {
      console.error("Erreur Supabase:", error);
      toast.error("Erreur lors de la mise à jour du profil.");
    } else {
      setSuccess(true);
      toast.success("✅ Informations enregistrées avec succès !");
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-400">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Chargement de vos paramètres...
      </div>
    );
  }

  // ==============================
  // 🎨 5. RENDU VISUEL
  // ==============================
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800 shadow-lg p-6 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-100">
            Paramètres de l’entreprise
          </h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition font-medium shadow-md ${
            saving
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Sauvegarder
            </>
          )}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-6 py-12 space-y-10"
      >
        <div className="flex items-start gap-3 bg-blue-600/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-xl shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <strong>Astuce :</strong> Téléversez votre logo pour le réutiliser automatiquement sur vos factures.
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* ✅ Animation succès */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl z-10"
              >
                <div className="flex flex-col items-center text-green-400">
                  <CheckCircle2 className="w-10 h-10 mb-2" />
                  <p className="text-lg font-semibold">Profil mis à jour !</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section Logo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-blue-400" />
              Logos de l’entreprise
            </h2>
            <div className="flex flex-wrap gap-4">
              {profile.company_logo_urls.map((url: string, i: number) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt="Logo"
                    className="h-24 w-24 object-contain bg-gray-900 border border-gray-700 rounded-lg p-2"
                  />
                  <button
                    onClick={() => handleDeleteLogo(url)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition">
                {uploading ? (
                  <Loader2 className="animate-spin text-blue-400" />
                ) : (
                  <Upload className="text-gray-500" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quota */}
            <div className="mt-3 text-gray-400 text-sm">
              {profile.company_logo_urls.length}/
              {profile.subscription_status === "premium" ? 3 : 1} image(s)
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  profile.subscription_status === "premium"
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30"
                    : "bg-gray-700 text-gray-300 border border-gray-600"
                }`}
              >
                {profile.subscription_status === "premium" ? (
                  <>
                    <Crown className="inline w-3 h-3 mr-1" /> Premium
                  </>
                ) : (
                  "Free"
                )}
              </span>
            </div>
          </div>

          {/* Formulaire principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nom complet" name="name" value={profile.name} onChange={(e: any) => setProfile({ ...profile, name: e.target.value })} />
            <FormField label="Nom de l’entreprise" name="company_name" value={profile.company_name} onChange={(e: any) => setProfile({ ...profile, company_name: e.target.value })} />
            <FormField label="Statut juridique" name="company_status" value={profile.company_status} onChange={(e: any) => setProfile({ ...profile, company_status: e.target.value })} />
            <FormField label="Téléphone" name="company_phone" value={profile.company_phone} onChange={(e: any) => setProfile({ ...profile, company_phone: e.target.value })} />
            <FormField label="SIRET / SIREN" name="company_siret" value={profile.company_siret} onChange={(e: any) => setProfile({ ...profile, company_siret: e.target.value })} />
            <FormField label="Adresse complète" name="company_address" value={profile.company_address} onChange={(e: any) => setProfile({ ...profile, company_address: e.target.value })} fullWidth />
            <FormArea label="Description de l’entreprise" name="company_description" value={profile.company_description} onChange={(e: any) => setProfile({ ...profile, company_description: e.target.value })} placeholder="Décrivez brièvement votre activité..." />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* 🧩 Composants réutilisables */
function FormField({ label, name, value, onChange, placeholder, fullWidth = false }: any) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
      />
    </div>
  );
}

function FormArea({ label, name, value, onChange, placeholder }: any) {
  return (
    <div className="md:col-span-2">
      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
      />
    </div>
  );
}
