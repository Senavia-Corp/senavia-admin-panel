import type { ChatMessage } from "@/types/user-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

export interface SendMessageRequest {
  entityId: string;
  entityType: "request" | "project";
  message: string;
  userId: string;
}

export interface ChatHistoryRequest {
  entityId: string;
  entityType: "request" | "project";
  page?: number;
  limit?: number;
}

export class ChatService {
  static async getChatMessages(
    entityId: string,
    entityType: "request" | "project",
    page = 1,
    limit = 50
  ): Promise<ChatMessage[]> {
    const endpoint =
      entityType === "request"
        ? `${endpoints.userRequests}/chat/${entityId}`
        : `${endpoints.userProjects}/chat/${entityId}`;

    const response = await Axios.get(endpoint, {
      params: { page, limit },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Error fetching chat messages");
    }

    return response.data.data;
  }

  static async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    const endpoint =
      data.entityType === "request"
        ? `${endpoints.userRequests}/chat/${data.entityId}/send`
        : `${endpoints.userProjects}/chat/${data.entityId}/send`;

    const response = await Axios.post(
      endpoint,
      {
        message: data.message,
        userId: data.userId,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error sending message");
    }

    return response.data.data;
  }

  static async loadChatHistory(
    data: ChatHistoryRequest
  ): Promise<ChatMessage[]> {
    return this.getChatMessages(
      data.entityId,
      data.entityType,
      data.page,
      data.limit
    );
  }
}
