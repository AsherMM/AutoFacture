"use client";

import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDFDocument } from "../InvoicePDFDocument";
import { supabase } from "@/lib/supabaseClient";

// 🔗 Bouton Téléchargement PDF (client-side uniquement)
export function DownloadInvoiceButton({ invoice }: { invoice: any }) {
  const [decryptedInvoice, setDecryptedInvoice] = useState(invoice);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndDecrypt = async () => {
      try {
        const user_id = invoice.user_id;

        if (user_id) {
          const { data } = await supabase
            .from("users")
            .select("company_logo_urls")
            .eq("id", user_id)
            .single();

          if (data?.company_logo_urls) {
            const urls = Array.isArray(data.company_logo_urls)
              ? data.company_logo_urls
              : JSON.parse(data.company_logo_urls || "[]");
            setCompanyLogo(urls[0] || null);
          }
        }

        const decrypt = async (field: string | null) => {
          if (!field) return null;
          const { data } = await supabase.rpc("decrypt_data", { encrypted: field });
          return data;
        };

        const decrypted = {
          ...invoice,
          iban: await decrypt(invoice.iban_encrypted),
          bic: await decrypt(invoice.bic_encrypted),
          paypal_email: await decrypt(invoice.paypal_email_encrypted),
        };

        setDecryptedInvoice(decrypted);
      } catch (err) {
        console.error("Erreur récupération ou décryptage :", err);
      }
    };

    fetchAndDecrypt();
  }, [invoice]);

  return (
    <PDFDownloadLink
      document={
        <InvoicePDFDocument
          invoice={{ ...decryptedInvoice, company_logo: companyLogo }}
          theme="classic"
        />
      }
      fileName={`facture_${invoice.client_name?.replace(/\s+/g, "_") || "client"}.pdf`}
    >
      {({ loading }) => (
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-700 text-blue-500 hover:bg-blue-900/20 hover:text-blue-300 text-xs sm:text-sm font-medium transition">
          {loading ? "Génération..." : "📄 Télécharger PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
