"use client";

import React from "react";
import { Billing, Cost } from "@/types/billing-management";
import { Lead } from "@/types/lead-management";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";
import { InvoicePDFDocument } from "./invoice-pdf-document";
import { Plans } from "@/types/plan";

/* -------------------------------------------------- *
| *  Props
| * -------------------------------------------------- */
interface DocumentPreviewBillingProps {
  lead: Lead[];
  billing: Billing;
  onBack: () => void;
  costs?: Cost[];
  plans?: Plans[];
}

/* -------------------------------------------------- *
| *  Componente principal
| * -------------------------------------------------- */
export function DocumentPreviewBilling(props: DocumentPreviewBillingProps) {
  const { onBack, lead, billing, plans } = props;

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
          document={<InvoicePDFDocument lead={lead} billing={billing} plans={plans} />}
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
            <InvoicePDFDocument lead={lead} billing={billing} plans={plans} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}