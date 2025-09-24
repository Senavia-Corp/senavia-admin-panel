import type {
  Lead,
  CreateLeadData,
  LeadStatus,
  Service,
  ScheduleData,
} from "@/types/lead-management";
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

  static getLeadStatuses(): LeadStatus[] {
    return ["SEND", "PROCESSING", "ESTIMATING", "FINISHED"];
  }

  static async getServices(): Promise<Service[]> {
    try {
      const response = await Axios.get(endpoints.service.getAll, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching services");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching services:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener servicios. Por favor, intente nuevamente."
        );
      }
    }
  }

  ///////////////////////Nuevos servicios///////////////////////

  // Helper function to convert time range to start and end times
  private static convertTimeRangeToTimes(date: string, timeRange: string) {
    // Extract date portion from ISO string (e.g., "2025-05-16" from "2025-05-16T05:00:00.000Z")
    const datePortion = date.split("T")[0];

    // Split time range into start and end times
    const [startTime, endTime] = timeRange.split(" - ");

    // Convert 12-hour format to 24-hour format
    const convertTo24Hour = (time12h: string) => {
      const [time, modifier] = time12h.split(/([APap][Mm])/);
      let [hours, minutes] = time.split(":");

      // Convert to 24-hour format
      if (hours === "12") {
        hours = modifier.toLowerCase() === "am" ? "00" : "12";
      } else if (modifier.toLowerCase() === "pm") {
        hours = (parseInt(hours, 10) + 12).toString();
      }

      // Ensure 2-digit format
      hours = hours.padStart(2, "0");
      if (!minutes) minutes = "00";

      return `${hours}:${minutes}:00`;
    };

    // Convert both times to 24h format
    const startTime24h = convertTo24Hour(startTime);
    const endTime24h = convertTo24Hour(endTime);

    // Create ISO strings with timezone offset
    const timeStart = `${datePortion}T${startTime24h}`;
    const timeFinish = `${datePortion}T${endTime24h}`;

    return { timeStart, timeFinish };
  }

  static async createSchedule(scheduleData: ScheduleData): Promise<any> {
    try {
      // Convert time range to start and end times
      const { timeStart, timeFinish } = this.convertTimeRangeToTimes(
        scheduleData.date,
        scheduleData.timeRange
      );

      // Prepare payload for calendar event endpoint
      const payload = {
        name: (scheduleData as any).clientName || "",
        phone: (scheduleData as any).clientPhone || "",
        email: (scheduleData as any).clientEmail || "",
        address: (scheduleData as any).clientAddress || "",
        service: (scheduleData as any).serviceId || "", // Use selected service or default
        about: scheduleData.description || "Scheduled meeting with client", //No lo tengo
        timeStart,
        timeFinish,
        isLoggedIn: true, // Since this is from admin panel
        reminder: true, // Enable reminder by default
      };

      const response = await fetch(endpoints.lead.creatCalendarEvent, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const status = response.status;

      // Handle successful responses
      if (status === 200 || status === 201) {
        return {
          success: true,
          message: "Schedule created successfully",
          status: status,
        };
      }

      // Handle time conflict
      if (status === 409) {
        throw new Error("The selected time is already booked");
      }

      // Handle other errors
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Error ${status}: Could not create schedule`
      );
    } catch (error: any) {
      console.error("Error creating schedule:", error);

      // Re-throw with appropriate message
      if (error.message.includes("already booked")) {
        throw new Error(
          "The selected time is already booked. Please choose a different time."
        );
      }

      throw new Error(
        error.message || "Failed to create schedule. Please try again."
      );
    }
  }
}
