export interface LeadRecord {
  id: string
  customerName: string
  status: LeadStatus
  createdAt: Date
  updatedAt: Date
}

export type LeadStatus = "Send" | "Processing" | "Estimating" | "Finished"

export interface CreateLeadData {
  customerName: string
  status: LeadStatus
}
