export type LeadStatus = "Send" | "Processing" | "Estimating" | "Finished";

export interface Lead {
  id: string;
  clientName?: string;
  // clientEmail?: string;
  // clientPhone?: string;
  // clientAddress?: string;
  // estimatedStartDate?: string;
  // description?: string;
  // workteamId: string;
  // serviceId?: string;
  // userId?: string;
  startDate: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadData {
  clientName: string;
  startDate: string;
  status: LeadStatus;
}
