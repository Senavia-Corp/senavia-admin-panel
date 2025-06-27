export interface BillingRecord {
  id: string
  estimatedTime: number // in months
  status: BillingStatus
  totalValue: number
  createdAt: Date
  updatedAt: Date
}

export type BillingStatus = "Created" | "Processing" | "InReview" | "Rejected" | "Accepted" | "Invoice" | "Paid"

export interface CreateBillingData {
  estimatedTime: number
  status: BillingStatus
  totalValue: number
}
