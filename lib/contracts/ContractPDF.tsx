import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

export type ContractPDFProps = {
  contract: {
    id: string | number;
    title: string;
    signedDate?: string | null;
    recipientName: string;
    companyEmail: string;
    companyAdd: string;
    companyPhone: string;
    content: string;
    clauses?: Array<{
      clauseId: string;
      clause: {
        title: string;
        description: string;
      };
    }>;
    ownerName: string;
    ownerSignDate?: string | null;
    recipientSignDate?: string | null;
  };
};

const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: "#FFFFFF",
    padding: 0,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#a7d41b",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -50,
    position: "relative",
  },
  headerImage: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 30,
    left: "50%",
    marginLeft: -25,
  },
  content: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    marginTop: 30,
  },
  contentSignatures: {
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#374151",
  },
  signatureDate: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 20,
    color: "#374151",
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#374151",
  },
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
  serviceTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#374151",
  },
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
  signaturesSection: {
    marginTop: 10,
    marginBottom: 40,
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
  pageBreak: {
    marginBottom: 40,
    paddingBottom: 20,
  },
});

export const ContractPDF = (props: ContractPDFProps) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header verde */}
      <View style={pdfStyles.header}>
        <Image src="/contract-logo.png" style={pdfStyles.headerImage} />
      </View>

      {/* Contenido principal */}
      <View style={pdfStyles.content}>
        {/* Nombre de la empresa */}
        <Text style={pdfStyles.companyName}>Senavia Corp</Text>

        {/* Fecha de firma */}
        <Text style={pdfStyles.signatureDate}>
          Signature requested on{" "}
          {props.contract.signedDate
            ? new Date(props.contract.signedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not signed yet"}
        </Text>

        {/* Título principal */}
        <Text style={pdfStyles.mainTitle}>{props.contract.title}</Text>

        {/* Línea separadora */}
        <View style={pdfStyles.separator} />

        {/* Información de contacto en dos columnas */}
        <View style={pdfStyles.contactSection}>
          <View style={pdfStyles.contactColumn}>
            <Text style={pdfStyles.contactTitle}>Business: Senavia Corp</Text>
            <Text style={pdfStyles.contactInfo}>info@senaviacorp.com</Text>
            <Text style={pdfStyles.contactInfo}>
              150 S Pine Island Rd, Office 377, FORT
            </Text>
            <Text style={pdfStyles.contactInfo}>LAUDERDALE, FL, 33324</Text>
            <Text style={pdfStyles.contactInfo}>(954) 706-4084</Text>
          </View>

          <View style={pdfStyles.contactColumn}>
            <Text style={pdfStyles.contactTitle}>
              Recipient: {props.contract.recipientName}
            </Text>
            <Text style={pdfStyles.contactInfo}>
              {props.contract.companyEmail}
            </Text>
            <Text style={pdfStyles.contactInfo}>
              {props.contract.companyAdd}
            </Text>
            <Text style={pdfStyles.contactInfo}>
              {props.contract.companyPhone}
            </Text>
          </View>
        </View>

        {/* Línea separadora */}
        <View style={pdfStyles.separatorBottom} />

        {/* Contenido del contrato */}
        <View style={[pdfStyles.contractBody, pdfStyles.pageBreak]}>
          <Text style={pdfStyles.contractText}>{props.contract.content}</Text>

          {/* Sección de servicios */}
          <Text style={pdfStyles.serviceTitle}>Service Conditions</Text>

          {/* Map de las cláusulas */}
          {props.contract.clauses && props.contract.clauses.length > 0 && (
            <>
              {props.contract.clauses.map((clauseLink: any) => (
                <View key={clauseLink.clauseId} style={pdfStyles.clauseSection}>
                  <Text style={pdfStyles.clauseTitle}>
                    {clauseLink.clause.title}:
                  </Text>
                  <Text style={pdfStyles.clauseDescription}>
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
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.contentSignatures}>
        {/* Sección de Firmas */}
        <View style={pdfStyles.signaturesSection}>
          <Text style={pdfStyles.signaturesTitle}>Signatures</Text>
          <Text style={pdfStyles.signaturesIntro}>
            This contract can be signed electronically or on paper. If signed in
            hard copy, it must be returned to the Business to be a valid record.
            Electronic signatures count as original for all purposes.
          </Text>
          <Text style={pdfStyles.signaturesIntro}>
            By entering their names as signatures below, both parties agree to
            the terms and provisions of this agreement.
          </Text>

          {/* Firma Comercial */}
          <Text style={pdfStyles.signatureBlockTitle}>
            Commercial Signature
          </Text>
          <View style={pdfStyles.signatureTable}>
            <View style={pdfStyles.signatureRow}>
              <Text style={pdfStyles.signatureLabel}>Owner Name</Text>
              <Text style={pdfStyles.signatureValue}>
                {props.contract.ownerName}
              </Text>
            </View>
            <View style={pdfStyles.signatureRow}>
              <Text style={pdfStyles.signatureLabel}>Owner Signature</Text>
              <Text style={pdfStyles.signatureValue}></Text>
            </View>
            <View style={pdfStyles.signatureRowLast}>
              <Text style={pdfStyles.signatureLabel}>
                Signed on Business Day Date
              </Text>
              <Text style={pdfStyles.signatureValue}>
                {props.contract.ownerSignDate
                  ? new Date(props.contract.ownerSignDate).toLocaleDateString(
                      "en-US"
                    )
                  : "Not signed yet"}
              </Text>
            </View>
          </View>

          {/* Firma del Destinatario */}
          <Text style={pdfStyles.signatureBlockTitle}>Recipient Signature</Text>
          <View style={pdfStyles.signatureTable}>
            <View style={pdfStyles.signatureRow}>
              <Text style={pdfStyles.signatureLabel}>Recipient Name</Text>
              <Text style={pdfStyles.signatureValue}>
                {props.contract.recipientName}
              </Text>
            </View>
            <View style={pdfStyles.signatureRow}>
              <Text style={pdfStyles.signatureLabel}>Recipient Signature</Text>
              <Text style={pdfStyles.signatureValue}></Text>
            </View>
            <View style={pdfStyles.signatureRowLast}>
              <Text style={pdfStyles.signatureLabel}>
                Signed with Reception Date
              </Text>
              <Text style={pdfStyles.signatureValue}>
                {props.contract.recipientSignDate
                  ? new Date(
                      props.contract.recipientSignDate
                    ).toLocaleDateString("en-US")
                  : "Not signed yet"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
