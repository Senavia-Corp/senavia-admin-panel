"use client";

import React from "react";
import { Contract } from "@/types/contract-management";
import { Button } from "../../ui/button";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { ContractPDF } from "@/lib/contracts/ContractPDF";

interface ContractDetailsProps {
  contract: Contract;
}

export function ContractDetails({ contract }: ContractDetailsProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header with download button */}

      <div className="flex items-center justify-end mb-6">
        <PDFDownloadLink
          document={<ContractPDF contract={contract} />}
          fileName={`contract-${contract.id}.pdf`}
          className="no-underline"
        >
          {({ loading }) => (
            <Button className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4">
              {loading ? "Generating PDF…" : "Download Document"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* PDF Preview Container */}
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1 h-screen">
        <div className="flex flex-col h-screen">
          <PDFViewer className="w-full flex-1 rounded-md border">
            <ContractPDF contract={contract} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
