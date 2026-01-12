"use client";

import { useEffect, useState } from "react";
import { supabase } from "lib/supabaseClient";
import LayoutDashboard from "../../components/ui/layout-dashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Euro,
  Eye,
  Trash2,
  Search,
  Sparkles,
  Layers,
  Loader2,
  ArrowUpRight,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { DownloadInvoiceButton } from "../../components/pdf/invoicePDF";
import InvoicePreviewer from "../../components/pdf/InvoicePreviewer";
import clsx from "clsx";

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // 📥 Chargement des factures et du profil
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [{ data: userData }, { data: invoicesData, error }] = await Promise.all([
          supabase.from("users").select("subscription_status").eq("id", user.id).maybeSingle(),
          supabase
            .from("invoices")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (error) throw error;
        setInvoices(invoicesData || []);
        setIsPremium(userData?.subscription_status === "premium" || userData?.subscription_status === "pro");
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔎 Filtrage dynamique
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.client_email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || (invoice.status || "Brouillon").toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  // 🗑️ Suppression
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement cette facture ?")) return;
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (!error) {
      setInvoices(invoices.filter((f) => f.id !== id));
    }
  };

  return (
    <LayoutDashboard>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
              Mes Factures
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Consultez, filtrez et exportez vos factures facilement.
            </p>
          </div>

          {/* 🔍 Barre de recherche et filtres */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-600/40"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="py-2 px-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-600/40"
            >
              <option value="all">Tous les statuts</option>
              <option value="validée">Validée</option>
              <option value="en cours">En cours</option>
              <option value="non valide">Non valide</option>
            </select>
          </div>
        </div>

        {/* BANDE PREMIUM */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={clsx(
            "flex items-center justify-between p-4 rounded-2xl shadow-inner backdrop-blur-md border transition-all",
            isPremium
              ? "border-yellow-400/30 bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 text-yellow-200"
              : "border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-indigo-900/10 text-blue-200"
          )}
        >
          <p className="text-sm flex items-center gap-2">
            {isPremium ? (
              <>
                <Crown className="text-yellow-400" />
                <span>
                  <strong>Premium activé</strong> — vous profitez de toutes les fonctionnalités 💎
                </span>
              </>
            ) : (
              <>
                <Layers className="text-blue-400" />
                <span>
                  Passez en <strong>Premium</strong> pour débloquer les thèmes et l’export PDF avancé.
                </span>
              </>
            )}
          </p>
          {!isPremium && (
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-sm flex items-center gap-2">
              Devenir Premium <ArrowUpRight className="w-4 h-4" />
            </Button>
          )}
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        )}

        {/* AUCUNE FACTURE */}
        {!loading && filteredInvoices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FileText className="w-10 h-10 mx-auto mb-2 text-gray-600" />
            <p className="text-gray-400 text-sm">
              Aucune facture trouvée. Créez votre première facture pour commencer.
            </p>
          </motion.div>
        )}

        {/* 🧾 LISTE DES FACTURES */}
        {!loading && filteredInvoices.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filteredInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  layout
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  className="group relative bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/20 transition-all hover:border-blue-700/40"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Facture #{String(index + 1).padStart(2, "0")}
                    </h3>
                    <p
                      className={clsx(
                        "text-xs px-2 py-1 rounded-full border font-medium capitalize transition-colors",
                        invoice.status === "validée"
                          ? "text-green-400 border-green-500/40 bg-green-500/10"
                          : invoice.status === "en cours"
                          ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
                          : "text-red-400 border-red-500/40 bg-red-500/10"
                      )}
                    >
                      {invoice.status || "Brouillon"}
                    </p>
                  </div>

                  {/* CONTENU */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">{invoice.client_name}</span>
                      <br />
                      <span className="text-xs text-gray-500">{invoice.client_email}</span>
                    </p>
                    <p className="flex items-center text-sm text-gray-400 gap-1">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      {new Date(invoice.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="flex items-center text-green-400 font-semibold text-lg gap-1">
                      <Euro className="w-4 h-4" />
                      {invoice.amount ? invoice.amount.toLocaleString("fr-FR") : "0"} €
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-800">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setPreviewOpen(true);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs flex items-center gap-1 px-2 py-1 shadow-md"
                      >
                        <Eye className="w-4 h-4" /> Voir
                      </Button>
                      <DownloadInvoiceButton invoice={invoice} />
                      <Button
                        onClick={() => handleDelete(invoice.id)}
                        className="bg-red-600/10 hover:bg-red-700/20 border border-red-700 text-red-400 text-xs px-2 py-1 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Suppr.
                      </Button>
                    </div>
                    {invoice.theme && (
                      <span className="text-[10px] text-gray-500 italic">
                        Thème : {invoice.theme}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* PREVIEW MODAL */}
        {selectedInvoice && (
          <InvoicePreviewer
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            invoice={selectedInvoice}
          />
        )}
      </motion.div>
    </LayoutDashboard>
  );
}
