import React from "react";
import { Contract } from "@/types/contract-management";
import { ContractPDFView } from "./contract-pdf-view";

interface ContractDetailsProps {
  contract: Contract;
}

export function ContractDetails({ contract }: ContractDetailsProps) {
  return <ContractPDFView contract={contract} />;
}
