import type { Lead, CreateLeadData, LeadStatus } from "@/types/lead-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

export class LeadManagementService {
  static async getLeads(
    search?: string,
    statusFilter?: string
  ): Promise<Lead[]> {
    try {
      const response = await Axios.get(endpoints.lead.getPosts, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching leads");
      }

      let leads = response.data.data;

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
    } catch (error: any) {
      console.error("Error fetching leads:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener leads. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async getLeadById(id: string | number): Promise<Lead | null> {
    try {
      const leadId = typeof id === "string" ? Number(id) : id;
      const response = await Axios.get(endpoints.lead.getPost(leadId), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching lead");
      }

      return response.data.data[0] || null;
    } catch (error: any) {
      console.error("Error fetching lead:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener el lead. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async createLead(leadData: CreateLeadData): Promise<Lead> {
    try {
      const response = await fetch(endpoints.lead.createPost, {
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
    id: string | number,
    updates: Partial<Lead>
  ): Promise<Lead | null> {
    try {
      const leadId = typeof id === "string" ? Number(id) : id;
      const response = await fetch(endpoints.lead.updatePost(leadId), {
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

  static async deleteLead(id: string | number): Promise<boolean> {
    try {
      const leadId = typeof id === "string" ? Number(id) : id;
      const response = await fetch(endpoints.lead.deleteLead(leadId), {
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

  static async getLeadsByUser(
    userId: string | number,
    search?: string,
    statusFilter?: string
  ): Promise<Lead[]> {
    try {
      // First try server-side filtering by adding userId as query parameter
      const response = await Axios.get(endpoints.lead.getPostsByUser(userId), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching user leads");
      }

      let leads = response.data.data;

      // If server doesn't support userId filtering, filter client-side
      if (Array.isArray(leads) && leads.length > 0) {
        // Check if server already filtered by userId
        const hasUserIdFilter = leads.every(
          (lead: Lead) => lead.userId === Number(userId)
        );

        // If server didn't filter, do client-side filtering
        if (!hasUserIdFilter) {
          leads = leads.filter((lead: Lead) => lead.userId === Number(userId));
        }
      }

      // Apply additional client-side filtering if needed
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
    } catch (error: any) {
      console.error("Error fetching user leads:", error);

      // Fallback: get all leads and filter client-side
      try {
        console.log("Falling back to client-side filtering...");
        const allLeads = await this.getLeads(search, statusFilter);
        return allLeads.filter((lead: Lead) => lead.userId === Number(userId));
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);

        if (error.response?.status === 401) {
          throw new Error(
            "No autorizado. Por favor, inicie sesión nuevamente."
          );
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error(
            "Error al obtener leads del usuario. Por favor, intente nuevamente."
          );
        }
      }
    }
  }

  static getLeadStatuses(): LeadStatus[] {
    return ["SEND", "PROCESSING", "ESTIMATING", "FINISHED"];
  }
}
