import type {
  Lead,
  CreateLeadData,
  LeadStatus,
  Service,
  CreateScheduleData,
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

      const createData: CreateScheduleData = {
        leadId: scheduleData.leadId,
        date: scheduleData.date,
        timezone: scheduleData.timezone,
        timeStart,
        timeFinish,
        title: scheduleData.title,
        description: scheduleData.description,
      };

      const response = await fetch(endpoints.lead.createSchedule, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error creating schedule");
      }

      return data.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

  static async getSchedules(leadId: number): Promise<any[]> {
    try {
      const response = await Axios.get(endpoints.lead.getSchedules(leadId), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching schedules");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching schedules:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener schedules. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async updateSchedule(
    scheduleId: number,
    updates: Partial<ScheduleData>
  ): Promise<any> {
    try {
      let updateData: any = { ...updates };

      // If timeRange is being updated, convert it to timeStart and timeFinish
      if (updates.timeRange && updates.date) {
        const { timeStart, timeFinish } = this.convertTimeRangeToTimes(
          updates.date,
          updates.timeRange
        );
        updateData = {
          ...updateData,
          timeStart,
          timeFinish,
        };
        delete updateData.timeRange; // Remove timeRange from update data
      }

      const response = await fetch(endpoints.lead.updateSchedule(scheduleId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error updating schedule");
      }

      return data.data;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  }

  static async deleteSchedule(scheduleId: number): Promise<boolean> {
    try {
      const response = await fetch(endpoints.lead.deleteSchedule(scheduleId), {
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
        throw new Error(data.message || "Error deleting schedule");
      }

      return true;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  }
}
