"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "lib/supabaseClient";
import { Button } from "./button";
import { toast } from "sonner";
import {
  FileText,
  Building2,
  Phone,
  Loader2,
  CreditCard,
  CheckCircle2,
  UserPlus,
  Sparkles,
  Crown,
  Lock,
  ScrollText,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function InvoiceModal({ open, onClose, onCreated }: InvoiceModalProps) {
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<"free" | "premium" | "pro" | "admin">("free");
  const [loading, setLoading] = useState(false);
  const [logoPreviews, setLogoPreviews] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    client_address: "",
    amount: "",
    due_date: "", // ✅ Nouvelle propriété date d’échéance
    description: "",
    status: "En cours",
    payment_method: "",
    save_client: false,
  });

  /* ============================================================
     🧠 Chargement du profil + settings
  ============================================================ */
  useEffect(() => {
    const loadCompany = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const [{ data: company }, { data: appSettings }] = await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("settings").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      if (!company) return toast.error("Profil entreprise introuvable.");

      setProfile(company);
      setSettings(appSettings);
      setPlan(
        company.role === "admin"
          ? "admin"
          : (company.subscription_status as "free" | "premium" | "pro") || "free"
      );

      try {
        const logos = Array.isArray(company.company_logo_urls)
          ? company.company_logo_urls
          : JSON.parse(company.company_logo_urls || "[]");
        setLogoPreviews(logos.slice(0, plan === "pro" || plan === "admin" ? 3 : 1));
      } catch {
        setLogoPreviews([]);
      }
    };
    if (open) void loadCompany();
  }, [open, plan]);

  /* ============================================================
     💾 Création de la facture
  ============================================================ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Session expirée, reconnectez-vous.");
    if (!form.client_name || !form.amount)
      return toast.error("Veuillez remplir les champs requis.");

    try {
      setLoading(true);

      const invoiceData = {
        user_id: user.id,
        client_name: form.client_name,
        client_email: form.client_email,
        client_phone: form.client_phone,
        client_address: form.client_address,
        amount: Number(form.amount),
        description: form.description,
        status: form.status,
        payment_method: form.payment_method,
        due_date: form.due_date, // ✅ Ajout date d’échéance

        // Données entreprise
        company_name: profile?.company_name,
        company_status: profile?.company_status,
        company_address: profile?.company_address,
        company_city: profile?.company_city,
        company_siret: profile?.company_siret,
        company_rcs_rm: profile?.company_rcs_rm,
        company_tva: profile?.company_tva,
        penalty_rate: profile?.penalty_rate || settings?.penalty_rate,
        recovery_fee: profile?.recovery_fee || settings?.recovery_fee,
        escompte: profile?.escompte || settings?.escompte,
        legal_mentions: profile?.legal_mentions || settings?.legal_mentions,
        clause_penale: profile?.clause_penale || settings?.clause_penale,
        company_logo_urls: logoPreviews,
      };

      const { error } = await supabase.from("invoices").insert([invoiceData]);
      if (error) throw error;

      if (form.save_client && (plan === "pro" || plan === "admin")) {
        await supabase.from("clients").insert([
          {
            user_id: user.id,
            name: form.client_name,
            email: form.client_email,
            phone: form.client_phone,
            address: form.client_address,
          },
        ]);
      }

      toast.success("✅ Facture créée avec succès !");
      onCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de la facture.");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🎨 Thèmes dynamiques
  ============================================================ */
  const theme =
    {
      free: {
        border: "border-gray-800",
        gradient: "from-gray-950 to-gray-900",
        title: "text-gray-300",
        accent: "text-gray-400",
      },
      premium: {
        border: "border-blue-700/40",
        gradient: "from-blue-950 via-gray-950 to-indigo-950/20",
        title: "text-blue-400",
        accent: "text-blue-300",
      },
      pro: {
        border: "border-amber-700/40",
        gradient: "from-amber-950 via-gray-950 to-yellow-950/20",
        title: "text-amber-400",
        accent: "text-amber-300",
      },
      admin: {
        border: "border-purple-700/40",
        gradient: "from-purple-950 via-gray-950 to-indigo-950/20",
        title: "text-purple-400",
        accent: "text-purple-300",
      },
    }[plan];

  /* ============================================================
     🧭 Interface
  ============================================================ */
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-4 py-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={clsx(
              "relative w-full max-w-5xl rounded-3xl flex flex-col overflow-hidden shadow-[0_0_80px_rgba(0,0,60,0.6)] border",
              theme.border,
              "bg-gradient-to-br",
              theme.gradient
            )}
          >
            {/* HEADER */}
            <header className="flex justify-between items-center p-8 border-b border-gray-800 bg-gray-950/30">
              <div>
                <h2 className={clsx("text-3xl font-bold flex items-center gap-2", theme.title)}>
                  {plan === "pro" && <Crown className="w-6 h-6 text-amber-400" />}
                  {plan === "premium" && <Sparkles className="w-6 h-6 text-blue-400" />}
                  {plan === "free" && <Lock className="w-6 h-6 text-gray-400" />}
                  <FileText className="w-7 h-7" /> Nouvelle facture
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Créez une facture professionnelle complète en quelques secondes.
                </p>
              </div>
              {logoPreviews?.length > 0 && (
                <div className="flex gap-3">
                  {logoPreviews.map((url, i) => (
                    <div
                      key={i}
                      className="w-[60px] h-[60px] border border-gray-700 rounded-xl bg-white/10 p-1.5"
                    >
                      <Image
                        src={url}
                        alt="logo"
                        width={55}
                        height={55}
                        className="object-contain rounded-lg"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
            </header>

            {/* CONTENU */}
            <main className="overflow-y-auto px-8 py-6 space-y-10 max-h-[75vh]">
              {/* ENTREPRISE */}
              <Section icon={<Building2 />} title="Entreprise" accent={theme.accent}>
                <div className="grid md:grid-cols-2 gap-5 text-sm text-gray-300">
                  <InfoLine label="Nom" value={profile?.company_name} />
                  <InfoLine label="Statut" value={profile?.company_status} />
                  <InfoLine label="SIRET/SIREN" value={profile?.company_siret} />
                  <InfoLine label="RCS / RM" value={profile?.company_rcs_rm} />
                  <InfoLine label="Ville" value={profile?.company_city} />
                  <InfoLine label="Adresse complète" value={profile?.company_address} full />
                </div>
              </Section>

              {/* CLIENT */}
              <Section icon={<Phone />} title="Client" accent={theme.accent}>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Nom complet" name="client_name" value={form.client_name} onChange={handleChange(setForm)} />
                  <Field label="Email" name="client_email" value={form.client_email} onChange={handleChange(setForm)} />
                  <Field label="Téléphone" name="client_phone" value={form.client_phone} onChange={handleChange(setForm)} />
                  <Field label="Adresse complète" name="client_address" value={form.client_address} onChange={handleChange(setForm)} full />
                </div>
                {(plan === "pro" || plan === "admin") && (
                  <CheckboxField
                    name="save_client"
                    checked={form.save_client}
                    label="Sauvegarder ce client"
                    icon={<UserPlus className="w-4 h-4 text-amber-400" />}
                    onChange={handleChange(setForm)}
                  />
                )}
              </Section>

              {/* PAIEMENT */}
              <Section icon={<CreditCard />} title="Paiement" accent={theme.accent}>
                <div className="grid md:grid-cols-3 gap-5">
                  <Field label="Montant HT (€)" name="amount" type="number" value={form.amount} onChange={handleChange(setForm)} />
                  <Field label="Date d’échéance" name="due_date" type="date" value={form.due_date} onChange={handleChange(setForm)} />
                  <SelectField
                    label="Statut"
                    name="status"
                    value={form.status}
                    onChange={handleChange(setForm)}
                    options={[
                      { label: "Validée ✅", value: "Validée" },
                      { label: "En cours 🕓", value: "En cours" },
                      { label: "Non valide ❌", value: "Non valide" },
                    ]}
                  />
                </div>

                {/* Choix de paiement stylé */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <PaymentOption
                    label="Virement bancaire"
                    icon="icons/virementlogo.webp"
                    selected={form.payment_method === "virement"}
                    onClick={() => setForm((f: any) => ({ ...f, payment_method: "virement" }))}
                  />
                  <PaymentOption
                    label="PayPal"
                    icon="icons/logopaypal.png"
                    selected={form.payment_method === "paypal"}
                    onClick={() => setForm((f: any) => ({ ...f, payment_method: "paypal" }))}
                  />
                  <PaymentOption
                    label="Carte bancaire"
                    icon="icons/logocb.jpg"
                    selected={form.payment_method === "carte"}
                    onClick={() => setForm((f: any) => ({ ...f, payment_method: "carte" }))}
                  />
                </div>
              </Section>

              {/* MENTIONS */}
              <Section icon={<ScrollText />} title="Mentions & Conditions" accent={theme.accent}>
                <div className="grid md:grid-cols-2 gap-5 text-sm text-gray-300">
                  <InfoLine label="TVA" value={profile?.company_tva} />
                  <InfoLine label="Pénalités de retard" value={profile?.penalty_rate || settings?.penalty_rate} />
                  <InfoLine label="Frais de recouvrement" value={profile?.recovery_fee || settings?.recovery_fee} />
                  <InfoLine label="Escompte" value={profile?.escompte || settings?.escompte} />
                  <InfoLine label="Mentions légales" value={profile?.legal_mentions || settings?.legal_mentions} />
                  <div className="md:col-span-2 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 whitespace-pre-line leading-relaxed text-sm">
                      {profile?.clause_penale || settings?.clause_penale || "Aucune clause pénale définie."}
                    </p>
                  </div>
                </div>
              </Section>
            </main>

            {/* FOOTER */}
            <footer className="sticky bottom-0 bg-gray-950/90 backdrop-blur-lg border-t border-gray-800 p-6 flex justify-end gap-4">
              <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-400 hover:bg-gray-800">
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 flex items-center gap-2 text-white"
              >
                {loading && <Loader2 className="animate-spin w-4 h-4" />}
                {loading ? "Création..." : "Créer la facture"}
              </Button>
            </footer>
          </motion.div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* ============================================================
   🧩 Sous-composants
============================================================ */
function Section({ icon, title, accent, children }: any) {
  return (
    <section className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 shadow-inner backdrop-blur-sm hover:border-gray-600/50 transition-all">
      <h3 className={clsx("text-lg font-semibold mb-5 flex items-center gap-2", accent)}>
        {icon} {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, name, type = "text", value, onChange, full = false }: any) {
  return (
    <div className={clsx("flex flex-col gap-1", full && "md:col-span-2")}>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e)}
        className="w-full text-sm text-black bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2 outline-none"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400">{label}</label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        className="w-full text-sm px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {options.map((opt: any, i: number) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({ name, checked, label, onChange, icon }: any) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-400 mt-4 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e)}
        className="accent-blue-500 w-4 h-4"
      />
      {icon}
      {label}
    </label>
  );
}

function InfoLine({ label, value, full = false }: any) {
  return (
    <div className={clsx("flex items-start gap-2", full && "md:col-span-2")}>
      <p className="text-gray-400 text-sm">
        <span className="font-medium text-gray-300">{label} :</span>{" "}
        <span className="text-gray-200">{value || "—"}</span>
      </p>
    </div>
  );
}

function PaymentOption({ label, icon, selected, onClick }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onClick}
      className={clsx(
        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all shadow-md",
        selected
          ? "border-blue-500 bg-blue-600/10 text-blue-400"
          : "border-gray-700 bg-gray-900/50 hover:bg-gray-800/70"
      )}
    >
      <Image src={icon} alt={label} width={40} height={40} unoptimized />
      <span className="text-xs">{label}</span>
      {selected && <CheckCircle2 className="w-4 h-4 text-blue-400 absolute top-2 right-2" />}
    </motion.button>
  );
}

const handleChange =
  (setForm: any) =>
  (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
