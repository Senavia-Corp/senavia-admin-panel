import type { SupportTicket, CreateTicketData, TicketType, TicketStatus } from "@/types/support-management"

// Mock data
const mockTickets: SupportTicket[] = [
  {
    id: "0001",
    userName: "John Doe",
    type: "Bug",
    status: "InProcess",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    userName: "Jane Smith",
    type: "Request",
    status: "Pending",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    userName: "Mike Johnson",
    type: "Review",
    status: "Solved",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    userName: "Sarah Wilson",
    type: "Other",
    status: "Assigned",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "0005",
    userName: "David Brown",
    type: "Bug",
    status: "Closed",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21"),
  },
]

export class SupportManagementService {
  static async getTickets(search?: string, typeFilter?: string, statusFilter?: string): Promise<SupportTicket[]> {
    let filteredTickets = [...mockTickets]

    if (search) {
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          ticket.userName.toLowerCase().includes(search.toLowerCase()) ||
          ticket.type.toLowerCase().includes(search.toLowerCase()) ||
          ticket.status.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (typeFilter && typeFilter !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.type === typeFilter)
    }

    if (statusFilter && statusFilter !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === statusFilter)
    }

    return filteredTickets
  }

  static async getTicketById(id: string): Promise<SupportTicket | null> {
    return mockTickets.find((ticket) => ticket.id === id) || null
  }

  static async createTicket(ticketData: CreateTicketData): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      id: (mockTickets.length + 1).toString().padStart(4, "0"),
      userName: ticketData.userName,
      type: ticketData.type,
      status: ticketData.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockTickets.push(newTicket)
    return newTicket
  }

  static async updateTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
    const ticketIndex = mockTickets.findIndex((ticket) => ticket.id === id)
    if (ticketIndex === -1) return null

    mockTickets[ticketIndex] = { ...mockTickets[ticketIndex], ...updates, updatedAt: new Date() }
    return mockTickets[ticketIndex]
  }

  static async deleteTicket(id: string): Promise<boolean> {
    const ticketIndex = mockTickets.findIndex((ticket) => ticket.id === id)
    if (ticketIndex === -1) return false

    mockTickets.splice(ticketIndex, 1)
    return true
  }

  static getTicketTypes(): TicketType[] {
    return ["Bug", "Request", "Review", "Other"]
  }

  static getTicketStatuses(): TicketStatus[] {
    return ["Pending", "Assigned", "InProcess", "UnderReview", "Solved", "Closed"]
  }
}
