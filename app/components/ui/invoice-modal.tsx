"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./button";
import { toast } from "sonner";
import {
  FileText,
  Building2,
  Phone,
  Loader2,
  CreditCard,
  Upload,
  CheckCircle2,
  EyeOff,
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
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    company_address: "",
    company_status: "",
    company_siret: "",
    company_tva: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    amount: "",
    description: "",
    status: "En cours",
    payment_method: "",
    iban_encrypted: "",
    bic_encrypted: "",
    paypal_email_encrypted: "",
    hide_payment_info: false,
    save_client: false,
  });
  const [logoPreviews, setLogoPreviews] = useState<string[]>([]);

  // 🧠 Charger infos depuis Supabase
  useEffect(() => {
    const loadCompany = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data, error } = await supabase
        .from("users")
        .select(`
          company_name,
          company_status,
          company_siret,
          company_tva,
          company_address,
          company_logo_urls,
          subscription_status,
          iban_encrypted,
          bic_encrypted,
          paypal_email_encrypted
        `)
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Erreur lors du chargement de votre profil.");
        console.error(error);
        return;
      }

      if (data) {
        setPlan(data.subscription_status === "premium" ? "premium" : "free");
        setForm((prev) => ({
          ...prev,
          company_name: data.company_name ?? "",
          company_address: data.company_address ?? "",
          company_status: data.company_status ?? "",
          company_siret: data.company_siret ?? "",
          company_tva: data.company_tva ?? "",
          iban_encrypted: data.iban_encrypted ?? "",
          bic_encrypted: data.bic_encrypted ?? "",
          paypal_email_encrypted: data.paypal_email_encrypted ?? "",
        }));
        if (data.company_logo_urls) {
          const logos = Array.isArray(data.company_logo_urls)
            ? data.company_logo_urls
            : [data.company_logo_urls];
          setLogoPreviews(logos.slice(0, plan === "premium" ? 3 : 1));
        }
      }
    };
    if (open) loadCompany();
  }, [open]);

  // 📝 Gestion des champs
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // 💾 Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Session expirée, reconnectez-vous.");
    if (!form.client_name || !form.amount || !form.company_name) {
      return toast.error("Veuillez remplir tous les champs requis.");
    }

    setLoading(true);
    const { error } = await supabase.from("invoices").insert([
      {
        user_id: user.id,
        client_name: form.client_name,
        client_email: form.client_email,
        client_phone: form.client_phone,
        amount: Number(form.amount),
        description: form.description,
        status: form.status,
        company_name: form.company_name,
        company_status: form.company_status,
        company_siret: form.company_siret,
        company_tva: form.company_tva,
        company_address: form.company_address,
        company_logo_urls: logoPreviews,
        payment_method: form.payment_method,
        iban_encrypted: form.hide_payment_info ? null : form.iban_encrypted,
        bic_encrypted: form.hide_payment_info ? null : form.bic_encrypted,
        paypal_email_encrypted: form.hide_payment_info ? null : form.paypal_email_encrypted,
      },
    ]);

    if (error) {
      toast.error("Erreur lors de la création de la facture.");
      console.error(error);
      setLoading(false);
      return;
    }

    toast.success("✅ Facture créée avec succès !");
    setLoading(false);
    onCreated?.();
    onClose();
  };

  // 💳 Logos de paiement
  const paymentLogos = {
    virement: "/icons/virementlogo.webp",
    liquide: "/icons/espece.png",
    paypal: "/icons/logopaypal.png",
    carte: "/icons/logocb.jpg",
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-lg" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-4 py-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-4xl rounded-3xl bg-gradient-to-br from-gray-900 via-[#0a0f1b] to-gray-950 border border-gray-800 shadow-[0_0_60px_rgba(0,0,60,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="flex justify-between items-center p-8 border-b border-gray-800 bg-gray-950/30">
              <div>
                <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                  <FileText className="w-7 h-7" /> Nouvelle facture
                </h2>
                <p className="text-gray-400 text-sm mt-1">Créez votre facture facilement et rapidement.</p>
              </div>
              {logoPreviews.length > 0 && (
                <div className="flex gap-3">
                  {logoPreviews.map((url, i) => (
                    <div key={i} className="w-[65px] h-[65px] border border-gray-700 rounded-xl bg-white/10 p-1.5">
                      <Image src={url} alt="logo" width={55} height={55} className="object-contain rounded-lg" unoptimized />
                    </div>
                  ))}
                </div>
              )}
            </header>

            {/* Contenu principal */}
            <main className="overflow-y-auto px-8 py-6 space-y-8 max-h-[75vh]">
              <Section icon={<Building2 />} title="Informations de l’entreprise">
                <FieldGrid>
                  <Field label="Nom de l’entreprise" name="company_name" value={form.company_name} onChange={handleChange} />
                  <Field label="Statut juridique" name="company_status" value={form.company_status} onChange={handleChange} />
                  <Field label="SIRET / SIREN" name="company_siret" value={form.company_siret} onChange={handleChange} />
                  <Field label="N° TVA" name="company_tva" value={form.company_tva} onChange={handleChange} />
                  <Field label="Adresse complète" name="company_address" value={form.company_address} onChange={handleChange} full />
                </FieldGrid>
              </Section>

              <Section icon={<Phone />} title="Informations du client">
                <FieldGrid>
                  <Field label="Nom complet" name="client_name" value={form.client_name} onChange={handleChange} required />
                  <Field label="Email" name="client_email" value={form.client_email} onChange={handleChange} />
                  <Field label="Téléphone" name="client_phone" value={form.client_phone} onChange={handleChange} full />
                </FieldGrid>
              </Section>

              <Section icon={<CreditCard />} title="Détails et paiement">
                <FieldGrid>
                  <Field label="Montant HT (€)" name="amount" type="number" value={form.amount} onChange={handleChange} />
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 text-black bg-white border border-gray-300 rounded-lg"
                  >
                    <option value="Validée">✅ Validée</option>
                    <option value="En cours">🕓 En cours</option>
                    <option value="Non valide">❌ Non valide</option>
                  </select>
                </FieldGrid>

                {/* Méthodes de paiement */}
                <div className="mt-6">
                  <h4 className="text-blue-400 font-medium mb-3">Méthode de paiement :</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(paymentLogos).map(([key, url]) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={key}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, payment_method: key }))}
                        className={clsx(
                          "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all shadow-md",
                          form.payment_method === key
                            ? "border-blue-500 bg-blue-600/10 text-blue-400"
                            : "border-gray-700 bg-gray-900/50 hover:bg-gray-800/70"
                        )}
                      >
                        <Image src={url} alt={key} width={40} height={40} unoptimized />
                        <span className="text-xs capitalize">{key}</span>
                        {form.payment_method === key && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400 absolute top-2 right-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Infos dynamiques */}
                  <AnimatePresence>
                    {form.payment_method === "virement" && (
                      <PaymentDetails
                        title="Informations bancaires"
                        hideLabel="Ne pas révéler mes coordonnées bancaires"
                        hide={form.hide_payment_info}
                        onChange={handleChange}
                      >
                        <Field label="IBAN" name="iban_encrypted" value={form.iban_encrypted} onChange={handleChange} />
                        <Field label="BIC / SWIFT" name="bic_encrypted" value={form.bic_encrypted} onChange={handleChange} />
                      </PaymentDetails>
                    )}
                    {form.payment_method === "paypal" && (
                      <PaymentDetails
                        title="Paiement via PayPal"
                        hideLabel="Ne pas révéler mon adresse PayPal"
                        hide={form.hide_payment_info}
                        onChange={handleChange}
                      >
                        <Field
                          label="Adresse PayPal"
                          name="paypal_email_encrypted"
                          value={form.paypal_email_encrypted}
                          onChange={handleChange}
                          full
                        />
                      </PaymentDetails>
                    )}
                  </AnimatePresence>
                </div>
              </Section>
            </main>

            {/* Footer */}
            <footer className="sticky bottom-0 bg-gray-950/90 backdrop-blur-lg border-t border-gray-800 p-6 flex justify-end gap-4">
              <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-400 hover:bg-gray-800">
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
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

/* ========== Sous-composants ========== */
function Section({ icon, title, children }: any) {
  return (
    <section className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 shadow-inner backdrop-blur-sm hover:border-blue-600/40 transition-all">
      <h3 className="text-lg font-semibold text-blue-400 mb-5 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, name, type = "text", value, onChange, required = false, full = false }: any) {
  return (
    <div className={clsx("flex flex-col gap-1", full && "md:col-span-2")}>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        className="w-full text-sm text-black bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2 outline-none"
      />
    </div>
  );
}

function FieldGrid({ children }: any) {
  return <div className="grid md:grid-cols-2 gap-5">{children}</div>;
}

function PaymentDetails({ title, hideLabel, hide, onChange, children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-6 bg-gray-900/40 border border-gray-700 rounded-xl p-5 space-y-4"
    >
      <h4 className="text-blue-400 font-medium">{title}</h4>
      <label className="flex items-center gap-2 text-gray-400 text-sm">
        <input
          type="checkbox"
          name="hide_payment_info"
          checked={hide}
          onChange={onChange}
          className="accent-blue-600 w-4 h-4"
        />
        <EyeOff className="w-4 h-4" /> {hideLabel}
      </label>
      {!hide && <div className="grid md:grid-cols-2 gap-4">{children}</div>}
    </motion.div>
  );
}
