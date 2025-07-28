export interface SupportTicket {  
  id:number
  title: string
  type: string
  status: string
  description:string
}

export type TicketType = "BUG" | "REQUEST" | "REVIEW" | "OTHER"

export type TicketStatus = "PENDING" | "ASSIGNED" | "INPROCESS" | "UNDERREVIEW" | "SOLVED" | "CLOSED"

export interface CreateTicketData {
  title: string
  type: TicketType
  status: TicketStatus
  description:string
}
