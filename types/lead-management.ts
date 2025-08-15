export type LeadStatus = "SEND" | "PROCESSING" | "ESTIMATING" | "FINISHED";

export interface Lead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  description: string;
  state: LeadStatus;
  startDate: string;
  endDate: string;
  workTeamId?: string;
  serviceId?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    id: number;
    name: string;
  };
  service?: {
    id: number;
    name: string;
  };
  WorkTeam?: {
    id: number;
    name: string;
  };
}

export interface CreateLeadData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  description: string;
  state: LeadStatus;
  startDate: string;
  endDate?: string;
  workTeamId?: string;
  serviceId?: string;
  userId?: string;
}
