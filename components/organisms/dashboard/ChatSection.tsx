"use client";

import React, { useEffect } from "react";
import { ProfileChat } from "@/components/atoms/chat/profile-chat";
import { useEntityChat } from "@/hooks/use-entity-chat";

interface ChatSectionProps {
  entityId?: string;
  entityType: "request" | "project";
  userId?: string;
}

export function ChatSection({
  entityId,
  entityType,
  userId,
}: ChatSectionProps) {
  const { messages, isLoading, loadHistory, sendMessage } = useEntityChat(
    entityId,
    entityType,
    userId
  );

  useEffect(() => {
    if (entityId) {
      loadHistory();
    }
  }, [entityId, entityType, loadHistory]);

  return (
    <ProfileChat
      entityId={entityId}
      entityType={entityType}
      messagesToDisplay={messages}
      onSendMessageRequest={(content) => sendMessage(content)}
      onRequestHistoryLoad={() => loadHistory()}
      isLoadingHistory={isLoading}
    />
  );
}
