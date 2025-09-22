"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatService } from "@/services/user-panel/chat-service";
import type { ChatMessage } from "@/types/user-management";
import type { DisplayMessage } from "@/components/atoms/chat/profile-chat";

type EntityType = "request" | "project";

function mapToDisplayMessage(message: ChatMessage): DisplayMessage {
  return {
    id: message.id,
    content: message.message,
    role: message.isAdmin ? "assistant" : "user",
    createdAt: message.timestamp,
  };
}

export function useEntityChat(
  entityId?: string,
  entityType?: EntityType,
  userId?: string
) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track latest request to avoid race conditions
  const requestIdRef = useRef<number>(0);

  const canChat = useMemo(
    () => Boolean(entityId && entityType),
    [entityId, entityType]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Reset when entity changes to avoid showing stale messages
    reset();
  }, [entityId, entityType, reset]);

  const loadHistory = useCallback(async () => {
    if (!entityId || !entityType) return;
    const localRequestId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      const history = await ChatService.getChatMessages(
        entityId,
        entityType,
        1,
        50
      );
      // Ignore out-of-order responses
      if (localRequestId !== requestIdRef.current) return;
      setMessages(history.map(mapToDisplayMessage));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error loading chat history:", error);
    } finally {
      if (localRequestId === requestIdRef.current) setIsLoading(false);
    }
  }, [entityId, entityType]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!entityId || !entityType || !userId || !content.trim()) return;
      try {
        const newMessage = await ChatService.sendMessage({
          entityId,
          entityType,
          message: content,
          userId,
        });
        const display = mapToDisplayMessage(newMessage);
        setMessages((prev) => [...prev, display]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error sending message:", error);
      }
    },
    [entityId, entityType, userId]
  );

  return {
    messages,
    isLoading,
    canChat,
    loadHistory,
    sendMessage,
    reset,
  };
}
