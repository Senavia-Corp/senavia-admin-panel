"use client";

import React from "react";
import { Contract } from "@/types/contract-management";
import { Button } from "../../ui/button";
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
interface ContractPDFViewProps {
  contract: Contract;
}

/* -------------------------------------------------- *
 *  Componente principal
 * -------------------------------------------------- */
export function ContractPDFView({ contract }: ContractPDFViewProps) {
  /* -------- PDF inline -------- */
  const PDFDoc = () => (
    <Document>
      <Page size="A4" style={pdf.page}>
        {/* Header verde con imagen */}
        <View style={pdf.header}>
          <Image src="/lambo.png" style={pdf.headerImage} />
        </View>

        {/* Contenido principal */}
        <View style={pdf.content}>
          {/* Nombre de la empresa */}
          <Text style={pdf.companyName}>Senavia Corp</Text>

          {/* Fecha de firma */}
          <Text style={pdf.signatureDate}>
            Signature requested on{" "}
            {contract.signedDate
              ? new Date(contract.signedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Not signed yet"}
          </Text>

          {/* Título principal */}
          {/*   <Text style={pdf.mainTitle}>
            Service Agreement Between Senavia Corp and
          </Text> */}
          <Text style={pdf.mainTitle}>
            {/*   {contract.lead?.clientName || contract.recipientName} */}
            {contract.title}
          </Text>

          {/* Línea separadora */}
          <View style={pdf.separator} />

          {/* Información de contacto en dos columnas */}
          <View style={pdf.contactSection}>
            <View style={pdf.contactColumn}>
              <Text style={pdf.contactTitle}>Business: Senavia Corp</Text>
              <Text style={pdf.contactInfo}>info@senaviacorp.com</Text>
              <Text style={pdf.contactInfo}>
                150 S Pine Island Rd, Office 377, FORT
              </Text>
              <Text style={pdf.contactInfo}>LAUDERDALE, FL, 33324</Text>
              <Text style={pdf.contactInfo}>(954) 706-4084</Text>
            </View>

            <View style={pdf.contactColumn}>
              <Text style={pdf.contactTitle}>
                Recipient: {contract.recipientName}
              </Text>
              <Text style={pdf.contactInfo}>{contract.companyEmail}</Text>
              {/* //TODO: Revisar si es client email que esta en lead o company email */}
              <Text style={pdf.contactInfo}>{contract.companyAdd}</Text>
              <Text style={pdf.contactInfo}>{contract.companyPhone}</Text>
            </View>
          </View>

          {/* Línea separadora */}
          <View style={pdf.separatorBottom} />

          {/* Contenido del contrato */}
          <View style={pdf.contractBody}>
            {/*    <Text style={pdf.contractText}>
              This contract is between Senavia Corp (the "Business") and{" "}
              {contract.recipientName} (the "Client") and is dated{" "}
              {new Date(contract.createdAt).toLocaleDateString("en-US")}.
            </Text>

            <Text style={pdf.contractText}>
              Senavia Corp, a company duly constituted under the laws of the
              State of Florida, in its capacity as legal representative
              hereinafter, "the Business" and{" "}
              {contract.lead?.clientName || contract.recipientName}, a company
              duly constituted under the laws of the State of Colorado, in its
              capacity as legal representative hereinafter, "the Client".
            </Text> */}

            <Text style={pdf.contractText}>{contract.content}</Text>

            {/* Sección de servicios */}
            <Text style={pdf.serviceTitle}>Service Conditions</Text>

            {/* Map de las cláusulas */}
            {contract.clauses && contract.clauses.length > 0 && (
              <>
                {contract.clauses.map((clauseLink) => (
                  <View key={clauseLink.clauseId} style={pdf.clauseSection}>
                    <Text style={pdf.clauseTitle}>
                      {clauseLink.clause.title}:
                    </Text>
                    <Text style={pdf.clauseDescription}>
                      {clauseLink.clause.description}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>
      </Page>

      {/* Página de Firmas */}
      <Page size="A4" style={pdf.page}>
        <View style={pdf.contentSignatures}>
          {/* Sección de Firmas */}
          <View style={pdf.signaturesSection}>
            <Text style={pdf.signaturesTitle}>Signatures</Text>
            <Text style={pdf.signaturesIntro}>
              This contract can be signed electronically or on paper. If signed
              in hard copy, it must be returned to the Business to be a valid
              record. Electronic signatures count as original for all purposes.
            </Text>
            <Text style={pdf.signaturesIntro}>
              By entering their names as signatures below, both parties agree to
              the terms and provisions of this agreement.
            </Text>

            {/* Firma Comercial */}
            <Text style={pdf.signatureBlockTitle}>Commercial Signature</Text>
            <View style={pdf.signatureTable}>
              <View style={pdf.signatureRow}>
                <Text style={pdf.signatureLabel}>Owner Name</Text>
                <Text style={pdf.signatureValue}>{contract.ownerName}</Text>
              </View>
              <View style={pdf.signatureRow}>
                <Text style={pdf.signatureLabel}>Owner Signature</Text>
                <Text style={pdf.signatureValue}></Text>
              </View>
              <View style={pdf.signatureRowLast}>
                <Text style={pdf.signatureLabel}>
                  Signed on Business Day Date
                </Text>
                <Text style={pdf.signatureValue}>
                  {contract.ownerSignDate
                    ? new Date(contract.ownerSignDate).toLocaleDateString(
                        "en-US"
                      )
                    : "Not signed yet"}
                </Text>
              </View>
            </View>

            {/* Firma del Destinatario */}
            <Text style={pdf.signatureBlockTitle}>Recipient Signature</Text>
            <View style={pdf.signatureTable}>
              <View style={pdf.signatureRow}>
                <Text style={pdf.signatureLabel}>Recipient Name</Text>
                <Text style={pdf.signatureValue}>{contract.recipientName}</Text>
              </View>
              <View style={pdf.signatureRow}>
                <Text style={pdf.signatureLabel}>Recipient Signature</Text>
                <Text style={pdf.signatureValue}></Text>
              </View>
              <View style={pdf.signatureRowLast}>
                <Text style={pdf.signatureLabel}>
                  Signed with Reception Date
                </Text>
                <Text style={pdf.signatureValue}>
                  {contract.recipientSignDate
                    ? new Date(contract.recipientSignDate).toLocaleDateString(
                        "en-US"
                      )
                    : "Not signed yet"}
                </Text>
              </View>
            </View>
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
        {/*  <div className="flex space-x-4">
          <h1 className="text-4xl font-medium text-[#04081E]">
            Contract Preview
          </h1>
        </div> */}
        <PDFDownloadLink
          document={<PDFDoc />}
          fileName={`contract-${contract.id}.pdf`}
          className="no-underline"
        >
          {({ loading }) => (
            <Button className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4">
              {loading ? "Generando PDF…" : "Download Contract"}
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
 *  Estilos para React-PDF
 * -------------------------------------------------- */
const pdf = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: "#FFFFFF",
    padding: 0,
  },

  /* Header verde */
  header: {
    backgroundColor: "#a7d41b",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  headerImage: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 30, // Centered vertically within the 60px header height
    left: "50%",
    marginLeft: -25, // Half of the image width (80/2 = 40)
  },

  /* Contenido principal */
  content: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    marginTop: 30,
  },

  contentSignatures: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },

  /* Nombre de la empresa */
  companyName: {
    fontSize: 14,
    fontWeight: "normal",
    textAlign: "center",
    marginBottom: 8,
    color: "#374151",
  },

  /* Fecha de firma */
  signatureDate: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 20,
    color: "#374151",
  },

  /* Título principal */
  mainTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#374151",
  },

  /* Línea separadora */
  separator: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginTop: 20,
    marginBottom: 15,
    width: "100%",
  },
  separatorBottom: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginBottom: 20,
    width: "100%",
  },

  /* Sección de contacto */
  contactSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingTop: 5,
  },
  contactColumn: {
    width: "48%",
  },
  contactTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#374151",
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 2,
    color: "#374151",
  },

  /* Cuerpo del contrato */
  contractBody: {
    marginTop: 20,
  },
  contractText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 12,
    color: "#374151",
    textAlign: "justify",
  },

  /* Títulos de servicios */
  serviceTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#374151",
  },
  serviceSubtitle: {
    fontSize: 10,
    fontWeight: "normal",
    marginBottom: 8,
    color: "#374151",
  },
  serviceItem: {
    fontSize: 10,
    fontWeight: "normal",
    marginBottom: 4,
    color: "#374151",
  },
  serviceBullet: {
    fontSize: 10,
    marginLeft: 12,
    marginBottom: 2,
    color: "#374151",
  },

  /* Cláusulas */
  clauseSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  clauseTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#374151",
  },
  clauseDescription: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#374151",
    textAlign: "justify",
  },

  /* Sección de Firmas */
  signaturesSection: {
    marginTop: 30,
    paddingTop: 20,
  },
  signaturesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 15,
    color: "#374151",
  },
  signaturesIntro: {
    fontSize: 10,
    textAlign: "justify",
    marginBottom: 10,
    color: "#374151",
    lineHeight: 1.4,
  },
  signatureBlockTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#374151",
  },
  signatureTable: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 20,
  },
  signatureRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  signatureRowLast: {
    flexDirection: "row",
  },
  signatureLabel: {
    width: "40%",
    fontSize: 10,
    fontWeight: "bold",
    padding: 8,
    color: "#374151",
    backgroundColor: "#EBECEE",
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
  },
  signatureValue: {
    width: "60%",
    fontSize: 10,
    padding: 8,
    color: "#374151",
    backgroundColor: "#FFFFFF",
  },
});
