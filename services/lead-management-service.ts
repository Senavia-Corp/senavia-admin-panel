import type { Lead, CreateLeadData, LeadStatus } from "@/types/lead-management";

// Mock data
const mockLeads: Lead[] = [
  {
    id: "0001",
    clientName: "Acme Corporation",
    startDate: "MM/DD/AA ",
    status: "Processing",
    workteamId: "0001",
    serviceId: "0001",
    userId: "0001",
    clientEmail: "acme@example.com",
    clientPhone: "1234567890",
    clientAddress: "123 Main St, Anytown, USA",
    estimatedStartDate: "MM/DD/AA",
    endDate: "MM/DD/AA",
    description: "This is a test description",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    clientName: "Tech Solutions Inc",
    startDate: "MM/DD/AA ",
    status: "Estimating",
    workteamId: "0001",
    serviceId: "0001",
    userId: "0001",
    clientEmail: "tech@example.com",
    clientPhone: "1234567890",
    clientAddress: "123 Main St, Anytown, USA",
    estimatedStartDate: "MM/DD/AA",
    endDate: "MM/DD/AA",
    description: "This is a test description",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    clientName: "StartupXYZ",
    startDate: "MM/DD/AA ",
    status: "Finished",
    workteamId: "0001",
    serviceId: "0001",
    userId: "0001",
    clientEmail: "startup@example.com",
    clientPhone: "1234567890",
    clientAddress: "123 Main St, Anytown, USA",
    estimatedStartDate: "MM/DD/AA",
    endDate: "MM/DD/AA",
    description: "This is a test description",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    clientName: "Local Business",
    startDate: "MM/DD/AA ",
    status: "Send",
    workteamId: "0001",
    serviceId: "0001",
    userId: "0001",
    clientEmail: "local@example.com",
    clientPhone: "1234567890",
    clientAddress: "123 Main St, Anytown, USA",
    estimatedStartDate: "MM/DD/AA",
    endDate: "MM/DD/AA",
    description: "This is a test description",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "0005",
    clientName: "Global Enterprise",
    startDate: "MM/DD/AA ",
    status: "Processing",
    workteamId: "0001",
    serviceId: "0001",
    userId: "0001",
    clientEmail: "global@example.com",
    clientPhone: "1234567890",
    clientAddress: "123 Main St, Anytown, USA",
    estimatedStartDate: "MM/DD/AA",
    endDate: "MM/DD/AA",
    description: "This is a test description",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21"),
  },
];

export class LeadManagementService {
  static async getLeads(
    search?: string,
    statusFilter?: string
  ): Promise<Lead[]> {
    let filteredLeads = [...mockLeads];

    if (search) {
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.clientName?.toLowerCase().includes(search.toLowerCase()) ||
          lead.status.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.status === statusFilter
      );
    }

    return filteredLeads;
  }

  static async getLeadById(id: string): Promise<Lead | null> {
    return mockLeads.find((lead) => lead.id === id) || null;
  }

  static async createLead(leadData: CreateLeadData): Promise<Lead> {
    const newLead: Lead = {
      id: (mockLeads.length + 1).toString().padStart(4, "0"),
      clientName: leadData.clientName,
      clientEmail: leadData.clientEmail,
      clientPhone: leadData.clientPhone,
      clientAddress: leadData.clientAddress,
      estimatedStartDate: leadData.estimatedStartDate,
      endDate: leadData.endDate,
      description: leadData.description,
      workteamId: leadData.workteamId,
      serviceId: leadData.serviceId,
      userId: leadData.userId,
      startDate: leadData.startDate,
      status: leadData.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockLeads.push(newLead);
    return newLead;
  }

  static async updateLead(
    id: string,
    updates: Partial<Lead>
  ): Promise<Lead | null> {
    const leadIndex = mockLeads.findIndex((lead) => lead.id === id);
    if (leadIndex === -1) return null;

    // Create a new lead object with the updates
    const updatedLead: Lead = {
      ...mockLeads[leadIndex],
      ...updates,
      updatedAt: new Date(),
    };

    // Replace the old lead with the updated one
    mockLeads[leadIndex] = updatedLead;

    return updatedLead;
  }

  static async deleteLead(id: string): Promise<boolean> {
    const leadIndex = mockLeads.findIndex((lead) => lead.id === id);
    if (leadIndex === -1) return false;

    mockLeads.splice(leadIndex, 1);
    return true;
  }

  static getLeadStatuses(): LeadStatus[] {
    return ["Send", "Processing", "Estimating", "Finished"];
  }
}
