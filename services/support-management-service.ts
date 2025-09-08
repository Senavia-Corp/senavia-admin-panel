import type {SupportTicket,CreateTicketData,TicketType,TicketStatus,} from "@/types/support-management";

// Mock data
const mockTickets: SupportTicket[] = [
  {
    title: "John Doe",
    type: "BUG",
    status: "INPROCESS",
    description: "soy description 1",
  },
  {
    title: "John Doe",
    type: "BUG",
    status: "INPROCESS",
    description: "soy description 1",
  },
  {
    title: "John Doe",
    type: "BUG",
    status: "INPROCESS",
    description: "soy description 1",
  },
  {
    title: "John Doe",
    type: "BUG",
    status: "INPROCESS",
    description: "soy description 1",
  },
  {
    title: "John Doe",
    type: "BUG",
    status: "INPROCESS",
    description: "soy description 1",
  },
];

export class SupportManagementService {
  static async getTickets(
    search?: string,
    typeFilter?: string,
    statusFilter?: string
  ): Promise<SupportTicket[]> {
    let filteredTickets = [...mockTickets];

    if (search) {
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(search.toLowerCase()) ||
          ticket.type.toLowerCase().includes(search.toLowerCase()) ||
          ticket.status.toLowerCase().includes(search.toLowerCase())||
            ticket.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter && typeFilter !== "all") {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.type === typeFilter
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.status === statusFilter
      );
    }

    return filteredTickets;
  }

  static async getTicketById(id: string): Promise<SupportTicket | null> {   
    /* return mockTickets.find((ticket) => ticket.id === id) || null;*/
    console.log("sin terminar");
   return null 
  }

  static async createTicket(
    
    ticketData: CreateTicketData
  ): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      id: (mockTickets.length + 1).toString().padStart(4, "0"),
      userName: ticketData.userName,
      type: ticketData.type,
      status: ticketData.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTickets.push(newTicket);
    return newTicket;
  }

  static async updateTicket(
    id: string,
    updates: Partial<SupportTicket>
  ): Promise<SupportTicket | null> {
    const ticketIndex = mockTickets.findIndex((ticket) => ticket.id === id);
    if (ticketIndex === -1) return null;

    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return mockTickets[ticketIndex];
  }

  static async deleteTicket(id: string): Promise<boolean> {
    const ticketIndex = mockTickets.findIndex((ticket) => ticket.id === id);
    if (ticketIndex === -1) return false;

    mockTickets.splice(ticketIndex, 1);
    return true;
  }

  static getTicketTypes(): TicketType[] {
    return ["Bug", "Request", "Review", "Other"];
  }

  static getTicketStatuses(): TicketStatus[] {
    return [
      "Pending",
      "Assigned",
      "InProcess",
      "UnderReview",
      "Solved",
      "Closed",
    ];
  }
}
