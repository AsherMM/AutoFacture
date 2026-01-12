"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  Lock,
  CheckCircle2,
  X,
  Star,
  Sparkles,
  Crown,
  Loader2,
  ArrowUpRight,
  Percent,
} from "lucide-react";
import clsx from "clsx";
import { supabase } from "lib/supabaseClient";
import { DownloadInvoiceButton } from "./invoicePDF";
import { InvoicePDFDocument } from "../InvoicePDFDocument";
import { PDFViewer } from "@react-pdf/renderer";

/* ============================================================
   🧱 Types
============================================================ */
type ThemeKey =
  | "classic"
  | "modern"
  | "minimal"
  | "luxury"
  | "nature"
  | "digital"
  | "creative"
  | "elegant"
  | "contrast"
  | "serene";

type PlanType = "free" | "premium" | "pro" | "admin";

interface InvoicePreviewerProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
}

/* ============================================================
   🧾 Composant principal
============================================================ */
export default function InvoicePreviewer({ open, onClose, invoice }: InvoicePreviewerProps) {
  const [theme, setTheme] = useState<ThemeKey>("classic");
  const [plan, setPlan] = useState<PlanType>("free");
  const [checking, setChecking] = useState(true);
  const [userTax, setUserTax] = useState<number>(0);

  /* ============================================================
     🧠 Vérification du statut utilisateur + TVA
  ============================================================ */
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("users")
          .select("subscription_status, role, company_tva_option")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        const status: PlanType =
          data?.role === "admin"
            ? "admin"
            : (data?.subscription_status as PlanType) || "free";
        setPlan(status);

        // 🔢 Extraction du taux de TVA (ex: "20%" ou "Non assujetti")
        let taxValue = 0;
        if (data?.company_tva_option) {
          const tvaString = data.company_tva_option.toString().trim();
          const match = tvaString.match(/(\d+(\.\d+)?)/);
          taxValue = match ? parseFloat(match[1]) : 0;
        }
        setUserTax(taxValue);
      } catch (e) {
        console.error("Erreur récupération abonnement / TVA :", e);
      } finally {
        setChecking(false);
      }
    };
    if (open) checkUserStatus();
  }, [open]);

  const isPremium = ["premium", "pro", "admin"].includes(plan);

  /* ============================================================
     🎨 Thèmes graphiques modernes
  ============================================================ */
  const themes: {
    key: ThemeKey;
    label: string;
    description: string;
    premium: boolean;
    color: string;
  }[] = [
    { key: "classic", label: "Classique 💼", description: "Épuré et professionnel", premium: false, color: "from-blue-600 to-blue-400" },
    { key: "modern", label: "Moderne 🧊", description: "Contrastes doux et lisibilité", premium: true, color: "from-slate-600 to-slate-400" },
    { key: "minimal", label: "Minimal ⚫", description: "Design sobre et clair", premium: true, color: "from-gray-800 to-gray-500" },
    { key: "luxury", label: "Luxe 💎", description: "Doré, prestige et élégance", premium: true, color: "from-yellow-500 to-amber-300" },
    { key: "nature", label: "Nature 🌿", description: "Tons verts doux et frais", premium: true, color: "from-emerald-600 to-green-400" },
    { key: "digital", label: "Digital 💻", description: "Bleu cyan & haute lisibilité", premium: true, color: "from-sky-500 to-cyan-300" },
    { key: "creative", label: "Créatif 🎨", description: "Violet expressif et moderne", premium: true, color: "from-purple-600 to-fuchsia-400" },
    { key: "elegant", label: "Élégant ✨", description: "Noir & blanc contrasté", premium: true, color: "from-zinc-800 to-gray-600" },
    { key: "contrast", label: "Contrasté ⚡", description: "Accent fort et lisibilité", premium: true, color: "from-orange-500 to-amber-400" },
    { key: "serene", label: "Serein 💧", description: "Bleu doux et apaisant", premium: true, color: "from-cyan-400 to-blue-300" },
  ];

  /* ============================================================
     🖥️ Interface principale
  ============================================================ */
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[80]" onClose={onClose}>
        {/* BACKGROUND */}
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
        </Transition.Child>

        {/* CONTAINER */}
        <div className="fixed inset-0 flex items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-7xl flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative w-full rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-950 via-[#0e1220] to-gray-900 text-white shadow-[0_0_90px_rgba(59,130,246,0.25)] overflow-hidden"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                aria-label="Fermer la fenêtre de prévisualisation"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>

              {/* HEADER */}
              <div className="px-8 py-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-300" />
                    Prévisualisation de la facture
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Choisissez un thème graphique professionnel et téléchargez votre facture.
                  </p>
                </div>
                {plan === "admin" && (
                  <span className="bg-purple-600/20 text-purple-300 text-xs px-3 py-1 rounded-lg border border-purple-500/30 font-semibold shadow-md">
                    Mode Administrateur
                  </span>
                )}
              </div>

              {/* THEMES GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6 border-b border-gray-800 bg-gray-900/40">
                {themes.map((t) => {
                  const locked = t.premium && !isPremium;
                  const active = theme === t.key;
                  return (
                    <motion.button
                      key={t.key}
                      whileHover={{ scale: locked ? 1 : 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => !locked && setTheme(t.key)}
                      disabled={locked}
                      className={clsx(
                        "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all shadow-md overflow-hidden text-sm font-medium backdrop-blur-sm select-none",
                        active
                          ? "border-blue-500 bg-blue-700/20 ring-2 ring-blue-500/50"
                          : "border-gray-700 bg-gray-800/50 hover:bg-gray-800/70",
                        locked && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className={clsx("absolute inset-0 opacity-20 bg-gradient-to-br", t.color)} />
                      {locked && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      {t.premium && (
                        <Crown className="absolute top-2 left-2 w-4 h-4 text-yellow-400 opacity-80" />
                      )}
                      <span className="relative text-base font-semibold">{t.label}</span>
                      <p className="relative text-xs text-gray-400">{t.description}</p>
                      {active && (
                        <CheckCircle2 className="absolute top-2 right-2 text-blue-400" size={18} />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* USER STATUS & TVA */}
              <div className="px-8 py-3 bg-gray-950/60 border-b border-gray-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                {checking ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    Vérification de votre statut...
                  </div>
                ) : !isPremium ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Lock className="w-4 h-4 text-yellow-400" />
                    Certains thèmes sont réservés aux membres{" "}
                    <span className="text-blue-400 font-semibold">Premium</span>.
                    <Button
                      onClick={() => (window.location.href = "/dashboard/abo")}
                      className="ml-2 bg-blue-600 hover:bg-blue-700 text-xs text-white flex items-center gap-1"
                    >
                      Passer Premium <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Star className="w-4 h-4 text-yellow-300" />
                    Mode Premium actif — accès complet à tous les thèmes.
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Percent className="w-4 h-4 text-blue-400" />
                  <span>
                    TVA actuelle :{" "}
                    <span className="text-blue-400 font-semibold">
                      {userTax > 0 ? `${userTax}%` : "0% (Non assujetti)"}
                    </span>
                  </span>
                </div>
              </div>

              {/* PDF PREVIEW */}
              <div className="h-[70vh] bg-gray-900/80 border-b border-gray-800 flex items-center justify-center overflow-hidden">
                <PDFViewer width="100%" height="100%">
                  <InvoicePDFDocument
                    invoice={{ ...invoice, company_tva_option: `${userTax}%` }}
                    theme={theme}
                  />
                </PDFViewer>
              </div>

              {/* FOOTER */}
              <div className="flex flex-wrap justify-between items-center px-8 py-4 bg-gray-950/90 backdrop-blur-lg border-t border-gray-800 rounded-b-3xl">
                <p className="text-sm text-gray-400">
                  Thème sélectionné :{" "}
                  <span className="text-blue-400 font-semibold capitalize">{theme}</span>
                </p>
                <DownloadInvoiceButton invoice={invoice} />
              </div>
            </motion.div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
