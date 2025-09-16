export interface Contract {
  id: string;
  title: string;
  content: string;
  status: ContractStatus;
  clauses: ContractClause[];
  deadlineToSign: string;
  userId?: number;
  leadId: number;
  // Sign Information
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  ownerName: string;
  ownerSignDate?: string;
  clientName: string;
  clientSignDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ContractStatus =
  | "DRAFT"
  | "SENT"
  | "SIGNED"
  | "ACTIVE"
  | "EXPIRED"
  | "TERMINATED";

export interface ContractClause {
  id: number;
  title: string;
  description: string;
}

export interface CreateContractData {
  title: string;
  content: string;
  status: ContractStatus;
  clauses: number[];
  deadlineToSign: string;
  userId?: number;
  leadId: number;
  // Sign Information
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  ownerName: string;
  ownerSignDate?: string;
  clientName: string;
  clientSignDate?: string;
}

// Reuse the same shape for the form values to avoid duplication
export type CreateContractFormValues = CreateContractData;
