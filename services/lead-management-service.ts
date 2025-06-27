import type { LeadRecord, CreateLeadData, LeadStatus } from "@/types/lead-management"

// Mock data
const mockLeads: LeadRecord[] = [
  {
    id: "0001",
    customerName: "Acme Corporation",
    status: "Processing",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    customerName: "Tech Solutions Inc",
    status: "Estimating",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    customerName: "StartupXYZ",
    status: "Finished",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    customerName: "Local Business",
    status: "Send",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "0005",
    customerName: "Global Enterprise",
    status: "Processing",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21"),
  },
]

export class LeadManagementService {
  static async getLeads(search?: string, statusFilter?: string): Promise<LeadRecord[]> {
    let filteredLeads = [...mockLeads]

    if (search) {
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
          lead.status.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (statusFilter && statusFilter !== "all") {
      filteredLeads = filteredLeads.filter((lead) => lead.status === statusFilter)
    }

    return filteredLeads
  }

  static async getLeadById(id: string): Promise<LeadRecord | null> {
    return mockLeads.find((lead) => lead.id === id) || null
  }

  static async createLead(leadData: CreateLeadData): Promise<LeadRecord> {
    const newLead: LeadRecord = {
      id: (mockLeads.length + 1).toString().padStart(4, "0"),
      customerName: leadData.customerName,
      status: leadData.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockLeads.push(newLead)
    return newLead
  }

  static async updateLead(id: string, updates: Partial<LeadRecord>): Promise<LeadRecord | null> {
    const leadIndex = mockLeads.findIndex((lead) => lead.id === id)
    if (leadIndex === -1) return null

    mockLeads[leadIndex] = { ...mockLeads[leadIndex], ...updates, updatedAt: new Date() }
    return mockLeads[leadIndex]
  }

  static async deleteLead(id: string): Promise<boolean> {
    const leadIndex = mockLeads.findIndex((lead) => lead.id === id)
    if (leadIndex === -1) return false

    mockLeads.splice(leadIndex, 1)
    return true
  }

  static getLeadStatuses(): LeadStatus[] {
    return ["Send", "Processing", "Estimating", "Finished"]
  }
}
