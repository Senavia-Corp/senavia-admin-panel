"use client";

import { useState, useEffect } from "react";
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
import { Plan } from "@/types/plan";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";



/* -------------------------------------------------- *
| *  Props
| * -------------------------------------------------- */
interface DocumentPreviewBillingProps {
  BillingID: number;
  onBack: () => void;
}

/* -------------------------------------------------- *
| *  Componente principal
| * -------------------------------------------------- */
export function DocumentPreviewBilling(props: DocumentPreviewBillingProps) {
  const { onBack, BillingID } = props;
  const { getLeadById, getBilling, getPlanById, billing, lead, plan } = BillingViewModel();
  const [No_Billing, setNo_Billing] = useState<boolean>(false);
  const isLoading = !billing || billing.length === 0 || !lead || lead.length === 0 || !plan || plan.length === 0;

  // cargar billing al cambiar BillingID
  useEffect(() => {
    if (!BillingID) return;
    getBilling(BillingID);
  }, []);

  // cuando billing cambie, cargar lead y plan
  useEffect(() => {
    console.log("billing recibido:", billing);
    if (!billing || billing.length === 0) return;
    const current = billing[0];
    console.log("current recibido:", current);
    if (current.lead_id) getLeadById(current.lead_id);
    if (current.plan_id) getPlanById(current.plan_id);
  }, [billing]);
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
        {billing && lead && plan && billing.length > 0 && lead.length > 0 && plan.length > 0 ? (
          <PDFDownloadLink
            document={
                <InvoicePDFDocument lead={lead[0]} billing={billing[0]} plans={plan[0]} />
            }
            fileName={`invoice-${billing[0]?.id ?? "preview"}.pdf`}
            className="no-underline"
          >
          </PDFDownloadLink>
        ) : null}
      </div>

      {/* Contenedor estético + PDFViewer */}
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1 h-screen">
        <div className="flex flex-col h-screen">
            {isLoading ? (
              <div className="flex-1 w-full rounded-md border bg-white p-6 animate-pulse">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-72 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-64 bg-gray-200 rounded mb-6" />
                <div className="h-[70vh] w-full bg-gray-100 rounded" />
              </div>
            ) : (
              <PDFViewer className="w-full flex-1 rounded-md border">
                <InvoicePDFDocument lead={lead[0]} billing={billing[0]} plans={plan[0]} />
              </PDFViewer>
            )}
        </div>
      </div>
    </div>
  );
}