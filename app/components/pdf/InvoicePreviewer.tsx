"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Lock, CheckCircle2, X, Star, Sparkles, Crown } from "lucide-react";
import clsx from "clsx";
import { supabase } from "@/lib/supabaseClient";
import { DownloadInvoiceButton } from "./invoicePDF"; // ✅ Nouveau système
import { InvoicePDFDocument } from "../InvoicePDFDocument"; // ✅ Pur PDF (pas de hooks)
import { PDFViewer } from "@react-pdf/renderer";

interface InvoicePreviewerProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
}

export default function InvoicePreviewer({ open, onClose, invoice }: InvoicePreviewerProps) {
  const [theme, setTheme] = useState<
    | "classic"
    | "eco"
    | "minimal"
    | "luxury"
    | "building"
    | "digital"
    | "creative"
    | "industrial"
    | "construction"
    | "legal"
    | "medical"
  >("classic");

  const [isPremium, setIsPremium] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSub = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("users")
          .select("subscription_status")
          .eq("id", user.id)
          .maybeSingle();
        setIsPremium(data?.subscription_status === "premium");
      } catch (e) {
        console.error("Erreur récupération abonnement :", e);
      } finally {
        setChecking(false);
      }
    };
    if (open) checkSub();
  }, [open]);

  const themes = [
    { key: "classic", label: "Classic 💙", sector: "Professionnels / Bureau", premium: false, color: "from-blue-600 to-blue-400" },
    { key: "eco", label: "Eco 🌿", sector: "Durable / Éthique", premium: true, color: "from-green-600 to-green-400" },
    { key: "minimal", label: "Minimal ⚫", sector: "Design / Créatif", premium: true, color: "from-gray-800 to-gray-500" },
    { key: "luxury", label: "Luxury 💎", sector: "Cabinet / Luxe", premium: true, color: "from-yellow-500 to-yellow-300" },
    { key: "building", label: "Bâtiment 🏗️", sector: "BTP / Chantier", premium: true, color: "from-amber-500 to-yellow-400" },
    { key: "digital", label: "Digital 💻", sector: "Informatique / Tech", premium: true, color: "from-sky-500 to-cyan-300" },
    { key: "creative", label: "Créatif 🎨", sector: "Studio / Graphisme", premium: true, color: "from-purple-600 to-fuchsia-400" },
    { key: "industrial", label: "Industriel ⚙️", sector: "Production / Métallurgie", premium: true, color: "from-gray-600 to-gray-400" },
    { key: "construction", label: "Construction 🧱", sector: "Travaux / Chantier", premium: true, color: "from-orange-500 to-amber-400" },
    { key: "legal", label: "Légal ⚖️", sector: "Cabinet / Juridique", premium: true, color: "from-slate-600 to-slate-400" },
    { key: "medical", label: "Médical 🩺", sector: "Santé / Clinique", premium: true, color: "from-cyan-500 to-teal-400" },
  ] as const;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Fond sombre et flou */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
        </Transition.Child>

        {/* Contenu principal */}
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-6">
          <div className="min-h-full flex items-center justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative bg-gradient-to-br from-gray-900 via-[#0e1222] to-gray-950 border border-gray-800 text-white rounded-3xl shadow-[0_0_70px_rgba(0,0,90,0.9)] w-full max-w-7xl p-8"
            >
              {/* Bouton Fermer */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition z-50"
                aria-label="Fermer la prévisualisation"
              >
                <X size={20} className="text-gray-300" />
              </button>

              {/* Titre */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-700 pb-4">
                <div>
                  <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-300" /> Prévisualisation de la facture
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Choisissez un thème adapté à votre activité et exportez un rendu professionnel.
                  </p>
                </div>
              </div>

              {/* Thèmes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
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
                        "relative flex flex-col items-center justify-center p-4 rounded-xl border text-sm font-medium transition-all shadow-md overflow-hidden backdrop-blur-sm",
                        active
                          ? "border-blue-500 bg-blue-700/30 ring-2 ring-blue-400"
                          : "border-gray-700 bg-gray-800/40 hover:bg-gray-800/70",
                        locked && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className={clsx("absolute inset-0 opacity-20 bg-gradient-to-br", t.color)} />
                      {locked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <span className="relative text-base font-semibold">{t.label}</span>
                      <p className="relative text-xs text-gray-400">{t.sector}</p>
                      {t.premium && (
                        <Crown className="absolute top-2 left-2 w-4 h-4 text-yellow-400 opacity-80" />
                      )}
                      {active && (
                        <CheckCircle2 className="absolute top-2 right-2 text-blue-400" size={18} />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Statut Premium */}
              <div className="mb-4">
                {checking ? (
                  <p className="text-gray-400 text-sm animate-pulse">Vérification de votre statut...</p>
                ) : !isPremium ? (
                  <div className="text-gray-400 text-sm flex items-center gap-2">
                    <Lock size={14} className="text-yellow-400" />
                    Certains thèmes sont réservés aux membres{" "}
                    <span className="text-blue-400 font-semibold">AutoFacture Premium</span>.
                  </div>
                ) : (
                  <div className="text-green-400 text-sm flex items-center gap-2">
                    <Star size={14} className="text-yellow-300" /> Mode Premium activé — Accès complet à tous les thèmes.
                  </div>
                )}
              </div>

              {/* 🧾 Aperçu PDF */}
              <div className="border border-gray-700 rounded-2xl overflow-hidden shadow-inner bg-gray-900 h-[70vh] flex items-center justify-center">
                <div className="w-full h-full overflow-hidden rounded-2xl">
                  <PDFViewer width="100%" height="100%">
                    <InvoicePDFDocument invoice={invoice} theme={theme} />
                  </PDFViewer>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-wrap justify-between items-center mt-8 border-t border-gray-800 pt-4 sticky bottom-0 bg-gray-950/80 backdrop-blur-md rounded-b-3xl z-10">
                <p className="text-sm text-gray-400 mb-2 sm:mb-0">
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
