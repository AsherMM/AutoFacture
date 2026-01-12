"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertCircle,
  Save,
  Building2,
  CheckCircle2,
  Loader2,
  Upload,
  Trash2,
  ImagePlus,
  ScrollText,
} from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState<any>({
    name: "",
    company_name: "",
    company_status: "",
    company_description: "",
    company_phone: "",
    company_address: "",
    company_city: "",
    company_siret: "",
    company_rcs_rm: "",
    company_logo_urls: [],
    company_tva_option: "",
    company_penalty_option: "",
    company_recovery_fee_option: "",
    company_escompte_option: "",
    company_legal_mentions_option: "",
    company_legal_mentions_text: "",
    subscription_status: "free",
  });

  /* ============================================================
     🧠 Chargement du profil utilisateur
  ============================================================ */
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        router.replace("/login");
        return;
      }
      setUser(authData.user);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error("Erreur de chargement du profil.");
        return;
      }

      let logos: string[] = [];
      try {
        logos = Array.isArray(data?.company_logo_urls)
          ? data.company_logo_urls
          : JSON.parse(data?.company_logo_urls || "[]");
      } catch {
        logos = [];
      }

      setProfile({
        ...profile,
        ...data,
        company_logo_urls: logos,
      });
      setRole(data?.role || "user");
      setLoading(false);
    };

    fetchProfile();
  }, []);

  /* ============================================================
     📸 Upload logo
  ============================================================ */
  const handleLogoUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("company_logos")
        .upload(filePath, file);

      if (error) throw error;
      const { data } = supabase.storage.from("company_logos").getPublicUrl(filePath);
      setProfile({
        ...profile,
        company_logo_urls: [...profile.company_logo_urls, data.publicUrl],
      });
      toast.success("Logo ajouté !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l’upload du logo.");
    } finally {
      setUploading(false);
    }
  };

  /* ============================================================
     🗑️ Suppression logo
  ============================================================ */
  const handleDeleteLogo = async (url: string) => {
    const fileName = url.split("/").pop();
    if (!fileName) return;
    await supabase.storage.from("company_logos").remove([`${user.id}/${fileName}`]);
    setProfile({
      ...profile,
      company_logo_urls: profile.company_logo_urls.filter((u: string) => u !== url),
    });
    toast.info("Logo supprimé.");
  };

  /* ============================================================
     💾 Sauvegarde
  ============================================================ */
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase.from("users").upsert(
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
      toast.error("Erreur lors de la sauvegarde.");
    } else {
      toast.success("✅ Paramètres enregistrés !");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 bg-gray-950">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Chargement...
      </div>
    );

  /* ============================================================
     🎨 UI / Thème
  ============================================================ */
  const themes = {
    free: { accent: "text-gray-300", border: "border-gray-700" },
    premium: { accent: "text-blue-400", border: "border-blue-600/30" },
    pro: { accent: "text-amber-400", border: "border-amber-600/30" },
    admin: { accent: "text-purple-400", border: "border-purple-600/30" },
  };
  const theme = themes[profile.subscription_status as keyof typeof themes] || themes.free;

  /* ============================================================
     🧭 Rendu principal
  ============================================================ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 shadow-lg p-6 flex justify-between items-center">
        <motion.button
          whileHover={{ x: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 hover:border-blue-500 hover:bg-gray-800 text-gray-300 hover:text-blue-400 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </motion.button>

        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Paramètres de l’entreprise
          </h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-md",
            saving
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white"
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Enregistrement..." : "Sauvegarder"}
        </motion.button>
      </header>

      {/* CONTENU */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-8 py-14 space-y-12"
      >
        <div className="flex items-start gap-3 bg-blue-600/10 border border-blue-500/30 text-blue-300 px-5 py-4 rounded-xl shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p className="text-sm leading-relaxed">
            Configurez vos informations d’entreprise et mentions légales. Ces informations seront
            automatiquement appliquées à toutes vos factures.
          </p>
        </div>

        <section
          className={clsx(
            "bg-gray-900/80 backdrop-blur-md rounded-3xl border shadow-2xl overflow-hidden p-10 relative",
            theme.border
          )}
        >
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl"
              >
                <CheckCircle2 className="text-green-400 w-12 h-12" />
              </motion.div>
            )}
          </AnimatePresence>

          <LogoManager
            logos={profile.company_logo_urls}
            uploading={uploading}
            onUpload={handleLogoUpload}
            onDelete={handleDeleteLogo}
          />

          <CompanyForm profile={profile} setProfile={setProfile} />
          <MentionsLegalesForm profile={profile} setProfile={setProfile} />
        </section>
      </motion.main>
    </div>
  );
}

/* ===============================
   🧩 Sous-composants
================================= */

function LogoManager({ logos, onUpload, onDelete, uploading }: any) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-blue-400">
        <ImagePlus className="w-5 h-5" /> Logo de l’entreprise
      </h2>
      <div className="flex gap-5 flex-wrap">
        {logos.map((url: string, i: number) => (
          <div key={i} className="relative group">
            <img src={url} className="h-24 w-24 object-contain bg-gray-950 border border-gray-700 rounded-xl p-2" />
            <button
              onClick={() => onDelete(url)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <label className="h-24 w-24 border-2 border-dashed border-gray-600 flex items-center justify-center rounded-xl hover:border-blue-400 cursor-pointer transition-all">
          {uploading ? <Loader2 className="animate-spin text-blue-400" /> : <Upload className="text-gray-500" />}
          <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
}

function CompanyForm({ profile, setProfile }: any) {
  const handleChange = (e: any) => setProfile({ ...profile, [e.target.name]: e.target.value });

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-blue-400">Informations de l’entreprise</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <FormField label="Nom complet" name="name" value={profile.name} onChange={handleChange} />
        <FormField label="Nom de l’entreprise" name="company_name" value={profile.company_name} onChange={handleChange} />
        <FormField label="Statut juridique" name="company_status" value={profile.company_status} onChange={handleChange} />
        <FormField label="Téléphone" name="company_phone" value={profile.company_phone} onChange={handleChange} />
        <FormField label="SIRET / SIREN" name="company_siret" value={profile.company_siret} onChange={handleChange} />
        <FormField label="RCS / RM" name="company_rcs_rm" value={profile.company_rcs_rm} onChange={handleChange} />
        <FormField label="Ville d’immatriculation" name="company_city" value={profile.company_city} onChange={handleChange} />
        <FormField label="Adresse complète" name="company_address" value={profile.company_address} onChange={handleChange} fullWidth />
        <FormArea label="Description" name="company_description" value={profile.company_description} onChange={handleChange} placeholder="Décrivez brièvement votre activité..." />
      </div>
    </>
  );
}

function MentionsLegalesForm({ profile, setProfile }: any) {
  const handleChange = (e: any) => setProfile({ ...profile, [e.target.name]: e.target.value });

  return (
    <>
      <h2 className="text-lg font-semibold mt-10 mb-4 flex items-center gap-2 text-blue-400">
        <ScrollText className="w-5 h-5" /> Mentions légales & conditions
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <SelectField
          label="TVA"
          name="company_tva_option"
          value={profile.company_tva_option}
          onChange={handleChange}
          options={[
            { label: "TVA 20%", value: "20%" },
            { label: "TVA 10%", value: "10%" },
            { label: "TVA 5.5%", value: "5.5%" },
            { label: "Non applicable (art. 293B du CGI)", value: "non_applicable" },
          ]}
        />
        <SelectField
          label="Pénalités de retard"
          name="company_penalty_option"
          value={profile.company_penalty_option}
          onChange={handleChange}
          options={[
            { label: "Aucune pénalité", value: "none" },
            { label: "10% du montant TTC", value: "10%" },
            { label: "15% du montant TTC", value: "15%" },
          ]}
        />
        <SelectField
          label="Frais de recouvrement"
          name="company_recovery_fee_option"
          value={profile.company_recovery_fee_option}
          onChange={handleChange}
          options={[
            { label: "Aucun frais", value: "none" },
            { label: "40 € forfaitaire", value: "40€" },
          ]}
        />
        <SelectField
          label="Escompte pour paiement anticipé"
          name="company_escompte_option"
          value={profile.company_escompte_option}
          onChange={handleChange}
          options={[
            { label: "Néant", value: "none" },
            { label: "2% pour paiement anticipé", value: "2%" },
          ]}
        />
        <SelectField
          label="Mentions légales par défaut"
          name="company_legal_mentions_option"
          value={profile.company_legal_mentions_option}
          onChange={handleChange}
          options={[
            { label: "Standard (auto-entrepreneur)", value: "auto" },
            { label: "Entreprise (TVA applicable)", value: "tva" },
            { label: "Artisan (assurance pro)", value: "artisan" },
          ]}
        />
        <FormArea
          label="Texte libre (facultatif)"
          name="company_legal_mentions_text"
          value={profile.company_legal_mentions_text}
          onChange={handleChange}
          placeholder="Ajoutez vos mentions ou conditions spécifiques..."
        />
      </div>
    </>
  );
}

/* Champs réutilisables */
function FormField({ label, name, value, onChange, placeholder, fullWidth = false }: any) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">— Sélectionnez —</option>
        {options.map((opt: any, i: number) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
