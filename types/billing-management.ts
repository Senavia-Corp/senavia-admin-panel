export interface BillingRecord {
  id: string
  estimatedTime: number // in months
  status: BillingStatus
  totalValue: number
  description: string
  associatedLead: string
  service: string
  createdAt: Date
  updatedAt: Date
}

export interface Billing {
  id: number
  estimatedTime: number
  description: string
  state: string
  totalValue: string
  lead_id: number
  plan_id: number
  deadLineToPay: string
  invoiceDateCreated: string
  invoiceReference: string
}

export interface Billings{
  id: number
  estimatedTime: number
  state: string
  totalValue: string
}

export interface apiResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  errors: string[];
}

export type BillingStatus = "CREATED" | "PROCESSING" | "IN_REVIEW" | "REJECTED" | "ACCEPTED" | "INVOICE" | "PAID"

export interface CreateBillingData {
  estimatedTime: number
  status: BillingStatus
  totalValue: number
  description: string
  associatedLead: string
  service: string
}
