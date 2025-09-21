import type {
  UserRequest,
  UserProject,
  ProjectUpdate,
  ChatMessage,
} from "@/types/user-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

// Types específicos para el user panel
export interface UserRequestDetail extends UserRequest {
  plan?: string;
  chat?: ChatMessage[];
  estimate?: RequestEstimate;
  invoice?: RequestInvoice;
}

export interface UserProjectDetail extends UserProject {
  progress?: number;
  documents?: ProjectDocument[];
  details?: ProjectUpdate[];
  chat?: ChatMessage[];
}

export interface RequestEstimate {
  id: string;
  requestId: string;
  title: string;
  items: EstimateItem[];
  totalAmount: number;
  status: "Pending" | "Accepted" | "Declined";
  createdAt: Date;
  expiresAt?: Date;
}

export interface EstimateItem {
  id: string;
  name: string;
  description?: string;
  value: number;
  quantity?: number;
}

export interface RequestInvoice {
  id: string;
  requestId: string;
  title: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  dueDate: Date;
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  value: number;
  quantity?: number;
}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt?: Date;
}

// Chat related types moved to ChatService

export class UserPanelService {
  // ============ USER REQUESTS ============

  /**
   * Obtiene todas las solicitudes del usuario
   */
  static async getUserRequests(userId: string): Promise<UserRequest[]> {
    try {
      const response = await Axios.get(endpoints.lead.getPostsByUser(userId), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error fetching user requests"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user requests:", error);
      throw error;
    }
  }

  /**
   * Acepta una estimación
   */
  static async acceptEstimate(estimateId: string): Promise<boolean> {
    try {
      const response = await Axios.post(
        `${endpoints.userRequests}/estimate/${estimateId}/accept`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      return response.data.success;
    } catch (error) {
      console.error("Error accepting estimate:", error);
      throw error;
    }
  }

  /**
   * Rechaza una estimación
   */
  static async declineEstimate(
    estimateId: string,
    reason?: string
  ): Promise<boolean> {
    try {
      const response = await Axios.post(
        `${endpoints.userRequests}/estimate/${estimateId}/decline`,
        { reason },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      return response.data.success;
    } catch (error) {
      console.error("Error declining estimate:", error);
      throw error;
    }
  }

  // ============ USER PROJECTS ============

  /**
   * Obtiene todos los proyectos del usuario
   */
  static async getUserProjects(userId: string): Promise<UserProject[]> {
    try {
      const response = await Axios.get(
        endpoints.project.getPostsByUser(userId),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error fetching user projects"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user projects:", error);
      throw error;
    }
  }

  /**
   * Obtiene las actualizaciones de un proyecto
   */
  static async getProjectUpdates(projectId: string): Promise<ProjectUpdate[]> {
    try {
      const response = await Axios.get(
        `${endpoints.userProjects}/updates/${projectId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error fetching project updates"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching project updates:", error);
      throw error;
    }
  }

  // ============ CHAT FUNCTIONALITY MOVED TO ChatService ============

  // ============ INVOICE PAYMENTS ============

  /**
   * Procesa el pago de una factura
   */
  static async processInvoicePayment(
    invoiceId: string
  ): Promise<{ paymentUrl: string }> {
    try {
      const response = await Axios.post(
        `${endpoints.userRequests}/invoice/${invoiceId}/payment`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error processing payment");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error processing invoice payment:", error);
      throw error;
    }
  }
}
