"use client";

import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDFDocument } from "../InvoicePDFDocument";
import { supabase } from "lib/supabaseClient";
import { FileText, Loader2, CheckCircle2, Lock, Download, Percent } from "lucide-react";
import clsx from "clsx";

// 🔗 Bouton Téléchargement PDF (avec récupération TVA, logo, décryptage)
export function DownloadInvoiceButton({ invoice }: { invoice: any }) {
  const [decryptedInvoice, setDecryptedInvoice] = useState<any>(invoice);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [userTax, setUserTax] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "premium" | "pro" | "admin">("free");
  const [error, setError] = useState<string | null>(null);

  // 🧠 Décryptage + récupération TVA + logo
  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setLoading(true);
        setError(null);

        const user_id = invoice.user_id;
        if (!user_id) throw new Error("Utilisateur introuvable pour cette facture.");

        // 🔹 Récupère les infos de l'utilisateur (plan, logo, TVA)
        const { data: userData, error: userErr } = await supabase
          .from("users")
          .select("company_logo_urls, company_tva_option, subscription_status, role")
          .eq("id", user_id)
          .single();

        if (userErr) throw userErr;

        // 🪄 Plan utilisateur
        const currentPlan =
          userData?.role === "admin"
            ? "admin"
            : (userData?.subscription_status as "free" | "premium" | "pro") || "free";
        setPlan(currentPlan);

        // 🖼️ Logo depuis Supabase
        if (userData?.company_logo_urls) {
          const urls = Array.isArray(userData.company_logo_urls)
            ? userData.company_logo_urls
            : JSON.parse(userData.company_logo_urls || "[]");
          setCompanyLogo(urls[0] || null);
        }

        // 🧾 Récupère TVA (par ex. "20%" ou "Non assujetti")
        let taxValue = 0;
        if (userData?.company_tva_option) {
          const tvaStr = userData.company_tva_option.toString().trim();
          const match = tvaStr.match(/(\d+(\.\d+)?)/);
          taxValue = match ? parseFloat(match[1]) : 0;
        }
        setUserTax(taxValue);

        // 🧩 Décryptage des champs sensibles
        const decrypt = async (field: string | null) => {
          if (!field) return null;
          const { data, error } = await supabase.rpc("decrypt_data", { encrypted: field });
          if (error) {
            console.warn("Échec du décryptage :", error);
            return "Non disponible";
          }
          return data;
        };

        const decrypted = {
          ...invoice,
          iban: await decrypt(invoice.iban_encrypted),
          bic: await decrypt(invoice.bic_encrypted),
          paypal_email: await decrypt(invoice.paypal_email_encrypted),
        };

        // 🧮 Calcul du total avec TVA dynamique
        const subtotal = decrypted.items?.length
          ? decrypted.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)
          : decrypted.amount || 0;

        const tvaAmount = (subtotal * taxValue) / 100;
        const totalTTC = subtotal + tvaAmount;

        setDecryptedInvoice({
          ...decrypted,
          company_logo: companyLogo,
          company_tva_option: `${taxValue}%`,
          tva_amount: tvaAmount,
          total_ttc: totalTTC,
        });
      } catch (err: any) {
        console.error("Erreur récupération ou décryptage :", err);
        setError(err.message || "Erreur lors de la génération du PDF.");
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [invoice]);

  // 💎 Styles selon plan
  const planStyle = {
    free: {
      text: "text-gray-400",
      border: "border-gray-700",
      hover: "hover:bg-gray-800/60",
      icon: <Lock className="w-4 h-4 text-gray-400" />,
    },
    premium: {
      text: "text-blue-400",
      border: "border-blue-700/50",
      hover: "hover:bg-blue-800/40",
      icon: <FileText className="w-4 h-4 text-blue-400" />,
    },
    pro: {
      text: "text-amber-400",
      border: "border-amber-700/50",
      hover: "hover:bg-amber-800/30",
      icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
    },
    admin: {
      text: "text-purple-400",
      border: "border-purple-700/50",
      hover: "hover:bg-purple-800/30",
      icon: <Download className="w-4 h-4 text-purple-400" />,
    },
  }[plan];

  // ⚙️ États d’attente et erreurs
  if (loading)
    return (
      <button
        disabled
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-400 text-xs sm:text-sm font-medium"
      >
        <Loader2 className="w-4 h-4 animate-spin" /> Préparation du PDF...
      </button>
    );

  if (error)
    return (
      <button
        disabled
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-700 bg-red-900/20 text-red-400 text-xs sm:text-sm font-medium"
      >
        ⚠️ Erreur : {error}
      </button>
    );

  // 📄 Bouton principal avec téléchargement
  return (
    <PDFDownloadLink
      document={
        <InvoicePDFDocument
          invoice={{
            ...decryptedInvoice,
            company_logo: companyLogo,
            company_tva_option: `${userTax}%`,
          }}
          theme={invoice.theme || "classic"}
        />
      }
      fileName={`facture_${invoice.client_name?.replace(/\s+/g, "_") || "client"}.pdf`}
    >
      {({ loading: pdfLoading }) => (
        <button
          disabled={pdfLoading}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all backdrop-blur-sm",
            planStyle.text,
            planStyle.border,
            planStyle.hover,
            pdfLoading && "opacity-60 cursor-not-allowed"
          )}
        >
          {pdfLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Génération du PDF...
            </>
          ) : (
            <>
              {planStyle.icon}
              Télécharger PDF
              {userTax > 0 && (
                <span className="ml-2 flex items-center gap-1 text-xs text-gray-400">
                  <Percent className="w-3 h-3 text-blue-400" />
                  TVA : {userTax}%
                </span>
              )}
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}
