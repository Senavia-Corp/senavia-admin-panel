import type { Payment } from "./payment-management";

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
  title: string
  estimatedTime: number
  description: string
  state: string
  totalValue: string
  percentagePaid: number
  remainingPercentage: number
  lead_id: number
  plan_id: number
  deadLineToPay: string
  invoiceDateCreated: string
  invoiceReference: string
  Project: any[] // TODO: Definir interfaz específica para Project
  costs: Cost[]
  payments?: Payment[] // Pagos asociados al billing
}

export interface Cost {
  id: number
  name: string
  description: string
  type: string
  value: number
  estimateId: number
  createdAt: string
  updatedAt: string
}


export interface Billings{
  id: number
  title: string
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
  title: string,
  estimatedTime: string,
  description: string,
  state: string,
  totalValue: number,
  percentagePaid: number,
  remainingPercentage: number,
  lead_id: number,
  plan_id: number,
  deadLineToPay: string,
  invoiceDateCreated: string,
  invoiceReference: string
}
