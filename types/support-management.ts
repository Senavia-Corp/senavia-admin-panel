export interface SupportTicket {
  id: string
  userName: string
  type: TicketType
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
}

export type TicketType = "Bug" | "Request" | "Review" | "Other"

export type TicketStatus = "Pending" | "Assigned" | "InProcess" | "UnderReview" | "Solved" | "Closed"

export interface CreateTicketData {
  userName: string
  type: TicketType
  status: TicketStatus
}
