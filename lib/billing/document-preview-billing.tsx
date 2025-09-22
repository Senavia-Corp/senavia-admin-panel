"use client";

import React from "react";
import { Billing, Cost } from "@/types/billing-management";
import { Lead } from "@/types/lead-management";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  Font
} from "@react-pdf/renderer";


/* -------------------------------------------------- *
 *  Props
 * -------------------------------------------------- */
import { Plans } from "@/types/plan";

interface DocumentPreviewBillingProps {
  lead: Lead[];
  billing: Billing;
  onBack: () => void;
  costs?: Cost[];
  plans?: Plans[];
}

/* -------------------------------------------------- *
 *  Componente principal
 * -------------------------------------------------- */
export function DocumentPreviewBilling(props: DocumentPreviewBillingProps) {
  const { onBack, lead, billing, plans } = props;
  Font.register({
   family: "Inter",
    src: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  });

  /* -------- PDF inline -------- */
  const PDFDoc = () => {
    const formatCurrency = (amount: string | number) => {
      const value = typeof amount === 'string' ? parseFloat(amount) : amount;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    };

    return (
      <Document>
        <Page size="A4" style={pdf.page}>
          <View style={[pdf.bannerBase, pdf.topBanner]} fixed />
          <View style={[pdf.bannerBase, pdf.bottomBanner]} fixed />
          <View style={pdf.inner}>
            {/* Marca */}
              <Text style={pdf.brandTitle}>Senavia Corp</Text>

            {/* Servicios */}
            <View style={pdf.serviceSection}>
              <Text style={pdf.serviceText}>
                {plans?.find(p => p.id === billing.plan_id)?.service?.name || "No service selected"}
              </Text>
            </View>
            <Text style={pdf.paragraph}>{billing.description}</Text>
            <View style={pdf.cardGrid}>
              <CardPDF title="Customer" lines={[
                lead[0].clientName,
                lead[0].clientEmail || 'email@example.com',
                lead[0].clientPhone || '(000) 000-0000'
              ]} />
              <CardPDF title="Invoice Details" lines={[
                `Creation Date: ${new Date(billing.createdAt).toLocaleDateString()}`,
                formatCurrency(billing.totalValue),
                `Service Date: ${new Date(billing.deadLineToPay).toLocaleDateString()}`
              ]} />
              <CardPDF title="Payment" lines={[
                `Payment Date: ${new Date(billing.deadLineToPay).toLocaleDateString()}`,
                formatCurrency(billing.totalValue)
              ]} />
            </View>

            <View style={pdf.summaryContainer}>
              <Text style={pdf.sectionTitle}>Invoice summary</Text>
              <View style={pdf.tableWrapper}>
                <View style={[pdf.tableRow, pdf.tableHead]}>
                  <Text style={pdf.th}>Items</Text>
                  <Text style={pdf.th}>Price</Text>
                  <Text style={pdf.th}>Amount</Text>
                </View>

                {(billing.costs || []).map((cost) => (
                  <View key={cost.id} style={pdf.tableRow}>
                    <Text style={pdf.td}>{cost.name}</Text>
                    <Text style={pdf.td}>{formatCurrency(cost.value)}</Text>
                    <Text style={pdf.td}>{formatCurrency(cost.value)}</Text>
                  </View>
                ))}
              </View>

              <View style={pdf.subtotalRow}>
                <Text style={pdf.subLabel}>Subtotal</Text>
                <Text style={pdf.subVal}>{formatCurrency(billing.totalValue)}</Text>
              </View>
              <View style={pdf.totalRow}>
                <Text style={pdf.totalLabel}>Total Paid</Text>
                <Text style={pdf.totalVal}>{formatCurrency(billing.totalValue)}</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

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
    backgroundColor: "white",
    paddingTop: 100,
    paddingBottom: 100,
  },

  /* Banners */
  bannerBase: { height: 80, width: "100%", backgroundColor: "#99CC33" },
  topBanner: { position: "absolute", top: 0, left: 0 },
  bottomBanner: { position: "absolute", bottom: 0, left: 0 },

  /* Logo */
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
  },
  logo: {
    width: 150,
    height: 60,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#04081E",
    marginBottom: 20,
  },

  /* Contenido con padding para no solapar banners */
  inner: {
    paddingHorizontal: 40,
    paddingTop: 0,
    paddingBottom: 0,
  },

  /* Texto principal */
  paragraph: { 
    fontSize: 14, 
    marginBottom: 16,
    color: "black",
    lineHeight: 1.6
  },
  /* Sección de servicios */
  serviceSection: {
    paddingLeft: 4,
  },
  serviceText: {
    fontSize: 26,
    color: "black",
    fontWeight: "semibold",
    lineHeight: 1.6,
  },

  /* Tarjetas */
  cardGrid: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 20,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    borderColor: "#99CC33",
  },
  cardTitle: { 
    fontWeight: "bold", 
    marginBottom: 8,
    fontSize: 12,
    color: "#04081E"
  },
  line: { 
    fontSize: 10,
    color: "#393939",
    marginBottom: 4
  },

  /* Contenedor principal del resumen */
  summaryContainer: {
    borderWidth: 1,
    borderColor: "#EBEDF2",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "white",
    marginBottom: 24,
  },

  /* Tabla */
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 16,
    color: "#04081E"
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: "#EBEDF2",
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: "white",
  },
  tableRow: { 
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEDF2",
  },
  tableHead: { 
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEDF2",
  },
  th: { 
    flex: 1, 
    padding: 12, 
    fontWeight: "bold",
    color: "#04081E",
    fontSize: 11,
  },
  td: {
    flex: 1,
    padding: 12,
    color: "#393939",
    fontSize: 10,
  },

  /* Totales */
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
    paddingRight: 8,
  },
  subLabel: { 
    fontSize: 12, 
    marginRight: 16,
    color: "#393939"
  },
  subVal: { 
    fontSize: 12,
    color: "#393939"
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EBEDF2",
  },
  totalLabel: { 
    fontSize: 16, 
    fontWeight: "bold",
    color: "#04081E"
  },
  totalVal: { 
    fontSize: 16, 
    fontWeight: "bold",
    color: "#04081E"
  },
});
