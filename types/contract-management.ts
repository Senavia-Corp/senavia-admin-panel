export type ContractStatus =
  | "DRAFT"
  | "SENT"
  | "SIGNED"
  | "ACTIVE"
  | "EXPIRED"
  | "TERMINATED";

export interface ContractClauseLink {
  contractId: number;
  clauseId: number;
  clause: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface LeadSummary {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  state: string;
  endDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  serviceId: number;
  startDate: string;
  workTeamId: number;
  clientAddress: string;
}

export interface Contract {
  id: number;
  title: string;
  state: ContractStatus;
  signedDate: string | null;
  companyEmail: string;
  companyAdd: string;
  companyPhone: string;
  content: string;
  ownerName: string;
  ownerSignDate: string | null;
  recipientName: string;
  recipientSignDate: string | null;
  contractUrl?: string | null;
  userId: number | null;
  leadId: number;
  createdAt: string;
  updatedAt: string;
  user: any | null;
  lead: LeadSummary | null;
  clauses: ContractClauseLink[];
}

export interface CreateContractData {
  title: string;
  content: string;
  state: ContractStatus;
  clauses: number[];
  signedDate: string; // UI label: Deadline to Sign
  userId?: number | null;
  leadId: number;
  companyEmail: string;
  companyAdd: string;
  companyPhone: string;
  ownerName: string;
  ownerSignDate?: string | null;
  recipientName: string;
  recipientSignDate?: string | null;
}

export type CreateContractFormValues = CreateContractData;
