"use client";

import React from "react";
import { Billing } from "@/types/billing-management";
import { Lead } from "@/types/lead-management";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";

/* -------------------------------------------------- *
 *  Props
 * -------------------------------------------------- */
interface DocumentPreviewBillingProps {
  lead: Lead[];
  billing: Billing;
  onBack: () => void;
}

/* -------------------------------------------------- *
 *  Componente principal
 * -------------------------------------------------- */
export function DocumentPreviewBilling(props: DocumentPreviewBillingProps) {
  const { onBack, lead, billing } = props;

  /* -------- PDF inline -------- */
  const PDFDoc = () => (
    <Document>
      <Page size="A4" style={pdf.page}>
        {/* Banners absolutos */}
        <View style={[pdf.bannerBase, pdf.topBanner]} />
        <View style={[pdf.bannerBase, pdf.bottomBanner]} />

        {/* Contenido desplazado */}
        <View style={pdf.inner}>
          {/* Logo / título / descripción */}
          <Image src="/senavia-logo.svg" style={pdf.logo} />
          <Text style={pdf.bigTitle}>Service 1 + Service 2 + …</Text>
          <Text style={pdf.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            aliquet odio ut lorem scelerisque auctor. Aenean posuere vehicula
            ligula eu posuere. Integer iaculis nisl quis ipsum condimentum
            consequat.
          </Text>

          {/* Cuatro tarjetas */}
          <View style={pdf.cardGrid}>
            <CardPDF title="Customer" lines={[
              lead[0].clientName,
              `ID: ${billing.id}`,
              `(000) 000-0000`,
            ]} />
            <CardPDF title="Invoice Details" lines={[
              `Creation Date: ${new Date(billing.invoiceDateCreated).toLocaleDateString()}`,
              `€${billing.totalValue}`,
              `Service Date: ${new Date(billing.deadLineToPay).toLocaleDateString()}`,
            ]} />
            <CardPDF title="Payment" lines={[
              `Payment Date`,
              `€${billing.totalValue}`,
            ]} />
            <CardPDF title="Recurring" lines={[
              `Recurring Date`,
              `Recurring Intensity`,
            ]} />
          </View>

          {/* Tabla resumen */}
          <Text style={pdf.sectionTitle}>Invoice summary</Text>
          <View style={pdf.tableWrapper}>
            <View style={[pdf.tableRow, pdf.tableHead]}>
              <Text style={pdf.th}>Items</Text>
              <Text style={pdf.th}>Price</Text>
              <Text style={pdf.th}>Amount</Text>
            </View>

            {/* Ejemplo de 3 filas; ajusta a tus items */}
            {["Service 1", "Service 2", "Service 3"].map((srv) => (
              <View key={srv} style={pdf.tableRow}>
                <Text style={pdf.td}>{srv}</Text>
                <Text style={pdf.td}>€00.00</Text>
                <Text style={pdf.td}>€00.00</Text>
              </View>
            ))}
          </View>

          {/* Subtotal / total */}
          <View style={pdf.subtotalRow}>
            <Text style={pdf.subLabel}>Subtotal</Text>
            <Text style={pdf.subVal}>€00.00</Text>
          </View>
          <View style={pdf.totalRow}>
            <Text style={pdf.totalLabel}>Total Paid</Text>
            <Text style={pdf.totalVal}>
              €{billing.totalValue}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  /* -------- Render web -------- */
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-medium text-[#04081E]">
            Document Preview
          </h1>
        </div>
        <PDFDownloadLink
          document={<PDFDoc />}
          fileName={`invoice-${billing.id}.pdf`}
          className="no-underline"
        >
          {({ loading }) => (
            <Button className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4">
              {loading ? "Generando PDF…" : "Download Document"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Contenedor estético + PDFViewer */}
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1 h-screen">
        <div className="flex flex-col h-screen">
          <PDFViewer className="w-full flex-1 rounded-md border">
            <PDFDoc />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- *
 *  Tarjeta reutilizable dentro del PDF
 * -------------------------------------------------- */
const CardPDF = ({ title, lines }: { title: string; lines: string[] }) => (
  <View
    style={[
      pdf.card,
      { borderColor: "#A6D243" /* borde verde claro */ },
    ]}
  >
    <Text style={pdf.cardTitle}>{title}</Text>
    {lines.map((l) => (
      <Text key={l} style={pdf.line}>
        {l}
      </Text>
    ))}
  </View>
);

/* -------------------------------------------------- *
 *  Estilos para React-PDF
 * -------------------------------------------------- */
const pdf = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    position: "relative",
  },

  /* Banners */
  bannerBase: { height: 50, width: "100%", backgroundColor: "#A1CF37" },
  topBanner: { position: "absolute", top: 0, left: 0 },
  bottomBanner: { position: "absolute", bottom: 0, left: 0 },

  /* Contenido con padding para no solapar banners */
  inner: {
    paddingHorizontal: 32,
    paddingTop: 60, // 50 px banner + 10 px respiro
    paddingBottom: 60,
  },

  /* Logo y texto principal */
  logo: { width: 120, height: 28, marginBottom: 18 },
  bigTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  paragraph: { fontSize: 9, marginBottom: 24 },

  /* Tarjetas */
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 3,
    padding: 8,
    marginBottom: 12,
  },
  cardTitle: { fontWeight: "bold", marginBottom: 4 },
  line: { fontSize: 9 },

  /* Tabla */
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  tableWrapper: {
    borderWidth: 5,
    borderColor: "#000421",
    borderRadius: 3,
    marginBottom: 16,
  },
  tableRow: { flexDirection: "row" },
  tableHead: { backgroundColor: "#E9EAEE" },
  th: { flex: 1, padding: 6, fontWeight: "bold" },
  td: {
    flex: 1,
    padding: 6,
    borderTopWidth: 1,
    borderTopColor: "#F5F6F7",
    backgroundColor: "#FBFBFB",
  },

  /* Totales */
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  subLabel: { fontSize: 10, marginRight: 8 },
  subVal: { fontSize: 10 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 14, fontWeight: "bold" },
  totalVal: { fontSize: 14, fontWeight: "bold" },
});
