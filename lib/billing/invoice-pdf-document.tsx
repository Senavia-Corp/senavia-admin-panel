"use client";

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Billing } from "@/types/billing-management";
import { Lead } from "@/types/lead-management";
import { Plan } from "@/types/plan";

/* -------------------------------------------------- *
| *  Props interface
| * -------------------------------------------------- */
interface InvoicePDFDocumentProps {
  lead: Lead;
  billing: Billing;
  plans?: Plan;
}

/* -------------------------------------------------- *
| *  Función utilitaria
| * -------------------------------------------------- */
function truncateText(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}

/* -------------------------------------------------- *
| *  Componente PDF puro para generación de archivo
| * -------------------------------------------------- */
export const InvoicePDFDocument = ({
  lead,
  billing,
  plans,
}: InvoicePDFDocumentProps) => {
  // Registrar fuente
  Font.register({
    family: "Inter",
    src: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  });

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Banner superior - solo al inicio */}
        <View style={[styles.bannerBase, styles.topBanner]} />
        <View style={styles.infoHeader}>
          <View style={{ paddingLeft: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Senavia Corp</Text>
            <Text>
              {
                "150 S Pine Island Rd Office \n FORT LAUDERDALE  FL 33324 United States"
              }
            </Text>
            <Text>(954) 706-4084</Text>
          </View>
          <View
            style={{
              paddingLeft: 70,
              alignSelf: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ marginBottom: 10 }}>
              {`Estimate # 100_${billing.id}`}
            </Text>
            <Text style={{ fontWeight: "bold" }}>Issued Date</Text>
            <Text>{billing.deadLineToPay || "No value found"}</Text>
          </View>
        </View>

        <Image src="/senaviaLogo.png" style={styles.headerImage} />

        <View style={styles.inner}>
          {/* Servicios */}
          <View style={styles.serviceSection}>
            <Text style={styles.serviceText}>{billing.title}</Text>
          </View>
          <Text style={styles.paragraph}>{billing.description}</Text>

          {/* Tarjetas de información */}
          <View style={styles.cardGrid}>
            <CardPDF
              title="Customer"
              lines={[
                lead.clientName,
                lead.clientEmail || "email@example.com",
                lead.clientPhone || "(000) 000-0000",
              ]}
            />
            <CardPDF
              title="Invoice Details"
              lines={[
                `Creation Date: ${new Date(
                  billing.createdAt
                ).toLocaleDateString()}`,
                formatCurrency(billing.totalValue),
                `Service Date: ${new Date(
                  billing.deadLineToPay
                ).toLocaleDateString()}`,
              ]}
            />
            <CardPDF
              title="Payment"
              lines={[
                `Payment Date: ${billing.deadLineToPay}`,
                formatCurrency(billing.totalValue),
              ]}
            />
          </View>

          {/* Información del plan */}
          <View style={styles.summaryContainer}>
            {plans ? (
              <>
                <Text style={styles.sectionTitle}>
                  {plans.name || "No name detected"}
                </Text>
                <Text style={[styles.paragraph, { marginBottom: 10 }]}>
                  {formatCurrency(Number(plans.price)) || "No price detected"}
                </Text>
                <Text style={[styles.paragraph, { fontSize: 10 }]}>
                  {plans.description || "No description"}
                </Text>
              </>
            ) : (
              <Text></Text>
            )}
            {(billing.costs || []).map((cost) => (
              <View key={cost.id}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { fontSize: 12, marginBottom: 8 },
                  ]}
                >
                  {cost.name}
                </Text>
                <Text
                  style={[styles.paragraph, { fontSize: 10, marginBottom: 4 }]}
                >
                  {formatCurrency(cost.value)}
                </Text>
                <Text
                  style={[styles.paragraph, { fontSize: 10, marginBottom: 4 }]}
                >
                  {cost.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Resumen de factura */}
          <View style={styles.summaryContainer} break>
            <Text style={styles.sectionTitle}>Invoice summary</Text>
            <View style={styles.tableWrapper}>
              <View style={[styles.tableRow, styles.tableHead]}>
                <Text style={[styles.th, { flex: 1.5 }]}>Items</Text>
                <Text style={[styles.th, { flex: 1 }]}>Price</Text>
                <Text style={[styles.th, { flex: 0.7 }]}>Amount</Text>
              </View>

              {/* Plan como primer elemento */}
              {plans && (
                <View style={styles.tableRow}>
                  <Text style={[styles.td, { flex: 1.5 }]}>
                    {plans.name || "Plan"}
                  </Text>
                  <Text style={[styles.td, { flex: 1 }]}>
                    {formatCurrency(Number(plans.price) || 0)}
                  </Text>
                  <Text style={[styles.td, { flex: 0.7 }]}>1</Text>
                </View>
              )}

              {/* Costos adicionales */}
              {(billing.costs || []).map((cost) => (
                <View key={cost.id} style={styles.tableRow}>
                  <Text style={[styles.td, { flex: 1.5 }]}>{cost.name}</Text>
                  <Text style={[styles.td, { flex: 1 }]}>
                    {formatCurrency(cost.value)}
                  </Text>
                  <Text style={[styles.td, { flex: 0.7 }]}>1</Text>
                </View>
              ))}
            </View>

            {/* Totales */}
            <View style={styles.subtotalRow}>
              <Text style={styles.subLabel}>Subtotal</Text>
              <Text style={styles.subVal}>
                {formatCurrency(billing.totalValue)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalVal}>
                {formatCurrency(billing.totalValue)}
              </Text>
            </View>
          </View>
        </View>

        <Image src="/senaviaLogo.png" style={styles.footerImage} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            (954) 706-4084 | info@senaviacorp.com
          </Text>
          <Text style={styles.footerText}>
            150 S Pine Island Rd Office FORT LAUDERDALE FL 33324
          </Text>
        </View>

        {/* Banner inferior fijo al final de la página */}
        <View style={[styles.bannerBase, styles.bottomBanner]} />
      </Page>
    </Document>
  );
};

/* -------------------------------------------------- *
| *  Tarjeta reutilizable dentro del PDF
| * -------------------------------------------------- */
const CardPDF = ({ title, lines }: { title: string; lines: string[] }) => (
  <View style={[styles.card, { borderColor: "#A6D243" }]}>
    <Text style={styles.cardTitle}>{title}</Text>
    {lines.map((l) => (
      <Text key={l} style={styles.line}>
        {l}
      </Text>
    ))}
  </View>
);

/* -------------------------------------------------- *
| *  Estilos para React-PDF
| * -------------------------------------------------- */
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: "white",
    position: "relative",
    paddingBottom: 50,
    paddingTop: 50,
  },

  /* Banners */
  bannerBase: { height: 80, width: "100%", backgroundColor: "#010d2b" },
  topBanner: { marginBottom: 50, marginTop: -50 },
  bottomBanner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 10,
  },

  /* Contenido con padding para no solapar banners */
  inner: {
    paddingHorizontal: 40,
    paddingTop: 0,
    paddingBottom: 0,
  },

  brandTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#04081E",
    marginBottom: 1,
    textAlign: "center",
  },

  /* Texto principal */
  paragraph: {
    fontSize: 14,
    marginBottom: 16,
    color: "black",
    lineHeight: 1.6,
  },

  /* Sección de servicios */
  serviceSection: {
    paddingBottom: 8,
  },
  serviceText: {
    fontSize: 24,
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
    color: "#04081E",
  },
  line: {
    fontSize: 10,
    color: "#393939",
    marginBottom: 4,
  },

  /* Contenedor principal del resumen */
  summaryContainer: {
    borderWidth: 1,
    borderColor: "#EBEDF2",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "white",
    marginTop: 24,
    marginBottom: 24,
  },

  /* Tabla */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#04081E",
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
    color: "#393939",
  },
  subVal: {
    fontSize: 12,
    color: "#393939",
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
    color: "#04081E",
  },
  totalVal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#04081E",
  },
  infoHeader: {
    color: "white",
    position: "absolute",
    top: 10,
    left: 220,
    width: 350,
    flexDirection: "row",
    gap: "10",
    fontSize: 8,
    paddingTop: 5,
  },
  footer: {
    flexDirection: "column",
    position: "absolute",
    bottom: 5,
    left: 20,
    width: 500,
  },
  footerText: {
    color: "white",
    marginBottom: 2,
    lineHeight: 1.3,
  },
  headerImage: {
    position: "absolute",
    top: 25,
    left: 20,
    width: 200,
    height: 30,
  },
  footerImage: {
    position: "absolute",
    bottom: 25,
    right: 60,
    width: 200,
    height: 30,
  },
});
