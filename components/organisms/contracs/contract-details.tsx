"use client";

import React from "react";
import { Contract } from "@/types/contract-management";
import { Button } from "../../ui/button";
import { useRenderPDF } from "@/hooks/useRenderPDF";

interface ContractDetailsProps {
  contract: Contract;
}

export function ContractDetails({ contract }: ContractDetailsProps) {
  const { url, loading, error, generatePDF, downloadPDF, showPDF } =
    useRenderPDF();

  const handleGeneratePDF = () => {
    generatePDF("ContractPDF", { contract });
  };

  // Auto-open PDF when it's ready
  React.useEffect(() => {
    if (url) {
      showPDF();
    }
  }, [url, showPDF]);

  const handleDownloadPDF = () => {
    downloadPDF();
  };

  const handleShowPDF = () => {
    showPDF();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview del contrato */}
      <div className="flex-1 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Información básica del contrato */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">
              Contract Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">ID:</span> {contract.id}
              </p>
              <p>
                <span className="font-medium">Title:</span> {contract.title}
              </p>
              <p>
                <span className="font-medium">State:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    contract.state === "SIGNED"
                      ? "bg-green-100 text-green-800"
                      : contract.state === "ACTIVE"
                      ? "bg-blue-100 text-blue-800"
                      : contract.state === "DRAFT"
                      ? "bg-yellow-100 text-yellow-800"
                      : contract.state === "SENT"
                      ? "bg-purple-100 text-purple-800"
                      : contract.state === "EXPIRED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {contract.state}
                </span>
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(contract.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Updated:</span>{" "}
                {new Date(contract.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Información de la empresa */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">
              Company Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Recipient:</span>{" "}
                {contract.recipientName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {contract.companyEmail}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {contract.companyPhone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {contract.companyAdd}
              </p>
              <p>
                <span className="font-medium">Lead ID:</span> {contract.leadId}
              </p>
            </div>
          </div>

          {/* Información de firmas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">Signatures</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Owner:</span> {contract.ownerName}
              </p>
              <p>
                <span className="font-medium">Owner Signed:</span>{" "}
                {contract.ownerSignDate
                  ? new Date(contract.ownerSignDate).toLocaleDateString()
                  : "Not signed"}
              </p>
              <p>
                <span className="font-medium">Recipient Signed:</span>{" "}
                {contract.recipientSignDate
                  ? new Date(contract.recipientSignDate).toLocaleDateString()
                  : "Not signed"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {contract.signedDate ? "Signed" : "Pending"}
              </p>
              <p>
                <span className="font-medium">Signed Date:</span>{" "}
                {contract.signedDate
                  ? new Date(contract.signedDate).toLocaleDateString()
                  : "Not signed"}
              </p>
            </div>
          </div>

          {/* Cláusulas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">Clauses</h3>
            <div className="space-y-2 text-sm">
              {contract.clauses && contract.clauses.length > 0 ? (
                contract.clauses.map((clauseLink: any, index: number) => (
                  <p key={clauseLink.clauseId || index}>
                    <span className="font-medium">{index + 1}.</span>{" "}
                    {clauseLink.clause?.title || "Untitled Clause"}
                  </p>
                ))
              ) : (
                <p className="text-gray-500">No clauses defined</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botones abajo en horizontal */}
      <div className="flex flex-col space-y-2">
        {!url && (
          <Button
            onClick={handleGeneratePDF}
            disabled={loading}
            className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4"
          >
            {loading ? "Generating PDF..." : "Generate and View"}
          </Button>
        )}

        {url && (
          <div className="flex space-x-3">
            <Button
              onClick={handleShowPDF}
              className="rounded-full bg-blue-500 text-white font-bold text-sm py-2 px-4"
            >
              View PDF
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="rounded-full bg-gray-500 text-white font-bold text-sm py-2 px-4"
            >
              Download PDF
            </Button>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>
        )}
      </div>
    </div>
  );
}
