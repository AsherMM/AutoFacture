import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// 🎨 Tous les thèmes sectoriels (identiques à ceux du Previewer)
const THEMES = {
  classic: { primary: "#1E3A8A", accent: "#2563EB", bg: "#FFFFFF", text: "#111827", subtle: "#F3F4F6" },
  eco: { primary: "#047857", accent: "#10B981", bg: "#ECFDF5", text: "#065F46", subtle: "#D1FAE5" },
  minimal: { primary: "#111111", accent: "#555555", bg: "#FFFFFF", text: "#111111", subtle: "#F9FAFB" },
  luxury: { primary: "#D4AF37", accent: "#F5C518", bg: "#0B0B0B", text: "#F3F4F6", subtle: "#1A1A1A" },
  building: { primary: "#F59E0B", accent: "#FBBF24", bg: "#FFFFFF", text: "#1F2937", subtle: "#F9FAFB" },
  digital: { primary: "#0EA5E9", accent: "#38BDF8", bg: "#F0F9FF", text: "#0C4A6E", subtle: "#E0F2FE" },
  creative: { primary: "#7C3AED", accent: "#C084FC", bg: "#F5F3FF", text: "#4C1D95", subtle: "#EDE9FE" },
  industrial: { primary: "#374151", accent: "#6B7280", bg: "#F3F4F6", text: "#111827", subtle: "#E5E7EB" },
  construction: { primary: "#D97706", accent: "#F59E0B", bg: "#FFF7ED", text: "#78350F", subtle: "#FEF3C7" },
  legal: { primary: "#334155", accent: "#475569", bg: "#F8FAFC", text: "#0F172A", subtle: "#E2E8F0" },
  medical: { primary: "#0891B2", accent: "#06B6D4", bg: "#ECFEFF", text: "#0E7490", subtle: "#CFFAFE" },
} as const;

interface InvoicePDFDocumentProps {
  invoice: any;
  theme?: keyof typeof THEMES;
}

export function InvoicePDFDocument({
  invoice,
  theme = "classic",
}: InvoicePDFDocumentProps) {
  // 🛠️ Fallback automatique si le thème n’existe pas
  const c = THEMES[theme] || THEMES.classic;

  // 💅 Styles dynamiques selon le thème
  const s = StyleSheet.create({
    page: {
      backgroundColor: c.bg,
      color: c.text,
      padding: 40,
      fontFamily: "Helvetica",
      fontSize: 10.5,
      lineHeight: 1.5,
      position: "relative",
    },
    watermark: {
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%) rotate(-25deg)",
      opacity: 0.06,
      fontSize: invoice.company_name?.length > 15 ? 60 : 80,
      color: c.accent,
      textTransform: "uppercase",
      fontWeight: "bold",
    },
    logo: { width: 90, height: 90, objectFit: "contain", marginBottom: 5 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    invoiceTitle: { fontSize: 28, fontWeight: "bold", color: c.primary },
    metaLabel: { fontSize: 10, opacity: 0.7 },
    metaValue: { fontSize: 11, fontWeight: "bold" },
    infoBox: {
      width: "48%",
      borderWidth: 1,
      borderColor: c.accent,
      borderRadius: 6,
      padding: 10,
      backgroundColor: c.subtle,
    },
    boxTitle: { fontSize: 11, fontWeight: "bold", color: c.primary, marginBottom: 5 },
    boxLine: { fontSize: 10, marginBottom: 2 },
    table: {
      width: "100%",
      borderWidth: 1,
      borderColor: c.accent,
      borderRadius: 6,
      overflow: "hidden",
      marginTop: 15,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: c.accent + "22",
      borderBottomWidth: 1,
      padding: 6,
    },
    headerCell: { fontWeight: "bold", fontSize: 10, color: c.primary, flex: 1 },
    row: { flexDirection: "row", borderBottomWidth: 0.5, borderColor: c.accent + "33", padding: 6 },
    cell: { flex: 1, fontSize: 10 },
    footer: {
      position: "absolute",
      bottom: 25,
      left: 40,
      right: 40,
      textAlign: "center",
      fontSize: 9,
      borderTopWidth: 1,
      borderTopColor: c.accent,
      paddingTop: 6,
    },
  });

  // 💶 Format monétaire corrigé
  const format = (n: number) => {
    if (isNaN(n)) return "0,00";
    const [intPart, decPart] = n.toFixed(2).split(".");
    return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ,${decPart}`;
  };

  // 🧾 Données dynamiques
  const items = invoice.items?.length
    ? invoice.items
    : [{ description: invoice.description || "Prestation", price: invoice.amount || 0, quantity: 1 }];

  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const tva = subtotal * 0.2;
  const total = subtotal + tva;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* 💧 Filigrane professionnel */}
        <Text style={s.watermark}>{invoice.company_name || "FACTURE"}</Text>

        {/* HEADER */}
        <View style={s.headerRow}>
          <View>
            {invoice.company_logo && <Image src={invoice.company_logo} style={s.logo} />}
            <Text style={s.invoiceTitle}>FACTURE</Text>
          </View>
          <View>
            <Text style={s.metaLabel}>Référence :</Text>
            <Text style={s.metaValue}>F-{invoice.id?.slice(0, 6) || "000000"}</Text>
            <Text style={s.metaLabel}>Date :</Text>
            <Text style={s.metaValue}>
              {invoice.created_at
                ? new Date(invoice.created_at).toLocaleDateString("fr-FR")
                : ""}
            </Text>
          </View>
        </View>

        {/* ENTREPRISE / CLIENT */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 20,
          }}
        >
          <View style={s.infoBox}>
            <Text style={s.boxTitle}>Entreprise</Text>
            <Text style={s.boxLine}>{invoice.company_name}</Text>
            <Text style={s.boxLine}>{invoice.company_address}</Text>
            <Text style={s.boxLine}>{invoice.company_status}</Text>
          </View>
          <View style={s.infoBox}>
            <Text style={s.boxTitle}>Client</Text>
            <Text style={s.boxLine}>{invoice.client_name}</Text>
            <Text style={s.boxLine}>{invoice.client_address}</Text>
            <Text style={s.boxLine}>{invoice.client_email}</Text>
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

        {/* TOTALS */}
        <View style={{ marginTop: 25, alignItems: "flex-end" }}>
          <Text>Total HT : {format(subtotal)} €</Text>
          <Text>TVA (20%) : {format(tva)} €</Text>
          <Text style={{ fontWeight: "bold", color: c.primary }}>
            Total TTC : {format(total)} €
          </Text>
        </View>

        {/* FOOTER */}
        <Text style={s.footer}>
          {invoice.company_name} — {invoice.company_status}{"\n"}
          © {new Date().getFullYear()} AutoFacture — Tous droits réservés.
        </Text>
      </Page>
    </Document>
  );
}
