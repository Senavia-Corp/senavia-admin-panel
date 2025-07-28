import type { Lead, CreateLeadData, LeadStatus } from "@/types/lead-management";

export class LeadManagementService {
  static async getLeads(
    search?: string,
    statusFilter?: string
  ): Promise<Lead[]> {
    try {
      const response = await fetch("http://localhost:3000/api/lead", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error fetching leads");
      }

      let leads = data.data;

      // Apply client-side filtering if needed
      if (search) {
        leads = leads.filter(
          (lead: Lead) =>
            lead.clientName?.toLowerCase().includes(search.toLowerCase()) ||
            lead.state.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (statusFilter && statusFilter !== "all") {
        leads = leads.filter((lead: Lead) => lead.state === statusFilter);
      }

      return leads;
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
  }

  static async getLeadById(id: string): Promise<Lead | null> {
    try {
      const response = await fetch(`http://localhost:3000/api/lead?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error fetching lead");
      }

      return data.data[0] || null;
    } catch (error) {
      console.error("Error fetching lead:", error);
      throw error;
    }
  }

  static async createLead(leadData: CreateLeadData): Promise<Lead> {
    try {
      const response = await fetch("http://localhost:3000/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error creating lead");
      }

      return data.data[0];
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  }

  static async updateLead(
    id: string,
    updates: Partial<Lead>
  ): Promise<Lead | null> {
    try {
      const response = await fetch(`http://localhost:3000/api/lead?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error updating lead");
      }

      return data.data[0];
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  }

  static async deleteLead(id: string): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:3000/api/lead?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error deleting lead");
      }

      return true;
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  }

  static getLeadStatuses(): LeadStatus[] {
    return ["SEND", "PROCESSING", "ESTIMATING", "FINISHED"];
  }
}
