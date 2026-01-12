"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

/* ============================================================
   🎨 Thèmes graphiques professionnels
============================================================ */
const THEMES = {
  classic: { primary: "#1E3A8A", accent: "#2563EB", bg: "#FFFFFF", text: "#111827", subtle: "#F9FAFB", border: "#E5E7EB" },
  modern: { primary: "#0F172A", accent: "#3B82F6", bg: "#FFFFFF", text: "#0F172A", subtle: "#F3F4F6", border: "#E5E7EB" },
  minimal: { primary: "#000000", accent: "#6B7280", bg: "#FFFFFF", text: "#111111", subtle: "#FAFAFA", border: "#E5E7EB" },
  luxury: { primary: "#D4AF37", accent: "#FACC15", bg: "#0B0B0B", text: "#F3F4F6", subtle: "#1A1A1A", border: "#2D2D2D" },
  digital: { primary: "#0284C7", accent: "#38BDF8", bg: "#F0F9FF", text: "#0C4A6E", subtle: "#E0F2FE", border: "#BAE6FD" },
  creative: { primary: "#7C3AED", accent: "#C084FC", bg: "#F5F3FF", text: "#4C1D95", subtle: "#EDE9FE", border: "#DDD6FE" },
  elegant: { primary: "#1F2937", accent: "#4B5563", bg: "#FAFAFA", text: "#1F2937", subtle: "#F3F4F6", border: "#D1D5DB" },
  contrast: { primary: "#111827", accent: "#F59E0B", bg: "#FFFFFF", text: "#111827", subtle: "#FEF3C7", border: "#FCD34D" },
  serene: { primary: "#0EA5E9", accent: "#67E8F9", bg: "#F0FDFA", text: "#083344", subtle: "#CCFBF1", border: "#99F6E4" },
  nature: { primary: "#047857", accent: "#10B981", bg: "#ECFDF5", text: "#064E3B", subtle: "#D1FAE5", border: "#A7F3D0" },
} as const;

interface InvoicePDFDocumentProps {
  invoice: any;
  theme?: keyof typeof THEMES;
}

/* ============================================================
   📄 Composant principal
============================================================ */
export function InvoicePDFDocument({ invoice, theme = "classic" }: InvoicePDFDocumentProps) {
  const c = THEMES[theme] || THEMES.classic;

  // 💶 Format montant
  const format = (n: number) => {
    if (isNaN(n)) return "0,00";
    const [intPart, decPart] = n.toFixed(2).split(".");
    return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ,${decPart}`;
  };

  // 🧾 Données produits
  const items = invoice.items?.length
    ? invoice.items
    : [{ description: invoice.description || "Prestation", price: invoice.amount || 0, quantity: 1 }];

  // 📊 Calcul TVA
  const subtotal = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
  const tvaRate = (() => {
    if (!invoice.company_tva_option) return 0;
    const text = invoice.company_tva_option.toString().toLowerCase();
    if (text.includes("non") || text.includes("0")) return 0;
    const match = text.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  })();
  const tvaAmount = (subtotal * tvaRate) / 100;
  const total = subtotal + tvaAmount;
  const tvaMention = tvaRate === 0 ? "TVA non applicable, article 293 B du CGI" : `TVA ${tvaRate}%`;

  // 🖼️ Logo
  const logoUrl =
    invoice.company_logo_urls?.[0] ||
    (invoice.company_logo?.startsWith("https://") ? invoice.company_logo : null);

  /* ============================================================
     💅 Styles professionnels
  ============================================================ */
  const s = StyleSheet.create({
    page: {
      backgroundColor: c.bg,
      color: c.text,
      padding: 40,
      fontFamily: "Helvetica",
      fontSize: 10.5,
      lineHeight: 1.5,
    },
    accentBar: {
      height: 6,
      width: "100%",
      backgroundColor: c.accent,
      borderRadius: 3,
      marginBottom: 15,
    },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 25 },
    logo: { width: 85, height: 85, objectFit: "contain", marginBottom: 8 },
    titleBlock: { flexDirection: "column", alignItems: "flex-start" },
    invoiceTitle: { fontSize: 30, fontWeight: "bold", color: c.primary, marginTop: 10, letterSpacing: 1 },
    metaBox: { alignItems: "flex-end" },
    metaLabel: { fontSize: 9, color: "#6B7280" },
    metaValue: { fontSize: 11, fontWeight: "bold", color: c.text },

    // 🔹 Bloc informations
    infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
    infoBox: {
      width: "48%",
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 6,
      padding: 10,
      backgroundColor: c.subtle,
    },
    boxTitle: { fontSize: 11, fontWeight: "bold", color: c.primary, marginBottom: 6, textTransform: "uppercase" },
    boxLine: { fontSize: 10, marginBottom: 2 },
    clientLine: { fontSize: 9.5, marginBottom: 2, color: c.text, opacity: 0.9 },

    // 🧾 Tableau
    table: { width: "100%", borderRadius: 8, borderWidth: 1, borderColor: c.border, marginTop: 10, overflow: "hidden" },
    tableHeader: { flexDirection: "row", backgroundColor: c.accent + "33", borderBottomWidth: 1, padding: 6 },
    headerCell: { fontWeight: "bold", fontSize: 10, color: c.primary, flex: 1 },
    row: { flexDirection: "row", borderBottomWidth: 0.5, borderColor: c.border, padding: 6 },
    cell: { flex: 1, fontSize: 10 },

    // 💰 Totaux
    totalsBox: {
      marginTop: 25,
      alignItems: "flex-end",
      padding: 10,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 8,
      backgroundColor: c.subtle,
      width: "45%",
      alignSelf: "flex-end",
    },
    totalLine: { fontSize: 10.5, marginBottom: 2 },
    totalHighlight: { fontSize: 12, fontWeight: "bold", color: c.primary },

    // 📄 Sections
    sectionTitle: { fontSize: 11, fontWeight: "bold", color: c.primary, marginTop: 25, marginBottom: 6 },
    smallText: { fontSize: 9, color: c.text, opacity: 0.85, lineHeight: 1.4 },
    legalBox: {
      backgroundColor: c.subtle,
      padding: 10,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: c.border,
    },

    // 🦶 Footer
    footer: {
      position: "absolute",
      bottom: 25,
      left: 40,
      right: 40,
      textAlign: "center",
      fontSize: 9,
      borderTopWidth: 1,
      borderTopColor: c.border,
      paddingTop: 8,
      lineHeight: 1.6,
      opacity: 0.9,
    },
  });

  /* ============================================================
     🧾 Rendu du document
  ============================================================ */
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Ligne d'accent */}
        <View style={s.accentBar} />

        {/* HEADER */}
        <View style={s.header}>
          <View style={s.titleBlock}>
            {logoUrl && <Image src={logoUrl} style={s.logo} />}
            <Text style={s.invoiceTitle}>FACTURE</Text>
          </View>
          <View style={s.metaBox}>
            <Text style={s.metaLabel}>Référence</Text>
            <Text style={s.metaValue}>F-{invoice.id?.slice(0, 6) || "000000"}</Text>
            <Text style={s.metaLabel}>Date</Text>
            <Text style={s.metaValue}>
              {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString("fr-FR") : ""}
            </Text>
            {invoice.due_date && (
              <>
                <Text style={s.metaLabel}>Échéance</Text>
                <Text style={s.metaValue}>
                  {new Date(invoice.due_date).toLocaleDateString("fr-FR")}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* ENTREPRISE / CLIENT */}
        <View style={s.infoRow}>
          <View style={s.infoBox}>
            <Text style={s.boxTitle}>Entreprise</Text>
            <Text style={s.boxLine}>{invoice.company_name}</Text>
            {invoice.company_status && <Text style={s.boxLine}>{invoice.company_status}</Text>}
            {invoice.company_address && <Text style={s.boxLine}>{invoice.company_address}</Text>}
            {invoice.company_city && <Text style={s.boxLine}>{invoice.company_city}</Text>}
          </View>

          <View style={s.infoBox}>
            <Text style={s.boxTitle}>Client</Text>
            <Text style={[s.boxLine, { fontWeight: "bold" }]}>{invoice.client_name}</Text>
            {invoice.client_address && <Text style={s.clientLine}>{invoice.client_address}</Text>}
            {invoice.client_phone && <Text style={s.clientLine}>{invoice.client_phone}</Text>}
            {invoice.client_email && <Text style={s.clientLine}>{invoice.client_email}</Text>}
          </View>
        </View>

        {/* TABLE PRODUITS */}
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.headerCell, { flex: 2 }]}>Description</Text>
            <Text style={s.headerCell}>Prix HT</Text>
            <Text style={s.headerCell}>Qté</Text>
            <Text style={s.headerCell}>Total</Text>
          </View>
          {items.map((item: any, idx: number) => (
            <View key={idx} style={s.row}>
              <Text style={[s.cell, { flex: 2 }]}>{item.description}</Text>
              <Text style={s.cell}>{format(item.price)}</Text>
              <Text style={s.cell}>{item.quantity}</Text>
              <Text style={s.cell}>{format(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* RÉCAP TOTAL */}
        <View style={s.totalsBox}>
          <Text style={s.totalLine}>Sous-total HT : {format(subtotal)} €</Text>
          <Text style={s.totalLine}>{tvaMention} : {format(tvaAmount)} €</Text>
          <Text style={s.totalHighlight}>Total TTC : {format(total)} €</Text>
        </View>

        {/* CONDITIONS DE PAIEMENT */}
        <Text style={s.sectionTitle}>Conditions de paiement</Text>
        <View style={s.legalBox}>
          {invoice.due_date && (
            <Text style={s.smallText}>
              - Paiement avant le {new Date(invoice.due_date).toLocaleDateString("fr-FR")}.
            </Text>
          )}
          <Text style={s.smallText}>
            - Pénalités de retard : taux légal + 10 points dès le lendemain de la date d’échéance.
          </Text>
          <Text style={s.smallText}>
            - Indemnité forfaitaire pour frais de recouvrement : 40 € (article L441-10 du Code de commerce).
          </Text>
        </View>

        {/* MENTIONS LÉGALES */}
        {(invoice.legal_mentions || invoice.clause_penale) && (
          <>
            <Text style={s.sectionTitle}>Mentions légales</Text>
            <View style={s.legalBox}>
              {invoice.legal_mentions && <Text style={s.smallText}>{invoice.legal_mentions}</Text>}
              {invoice.clause_penale && <Text style={s.smallText}>{invoice.clause_penale}</Text>}
            </View>
          </>
        )}

        {/* FOOTER */}
        <Text style={s.footer}>
          {invoice.company_name}
          {invoice.company_address ? ` — ${invoice.company_address}` : ""}
          {invoice.company_city ? `, ${invoice.company_city}` : ""}
          {"\n"}
          {invoice.company_siret ? `SIRET : ${invoice.company_siret}` : ""}{" "}
          {invoice.company_rcs_rm ? `• RCS / RM :  ${invoice.company_rcs_rm}` : ""}
          {"\n"}
          © {new Date().getFullYear()} AutoFacture • Généré automatiquement avec soin
        </Text>
      </Page>
    </Document>
  );
}
