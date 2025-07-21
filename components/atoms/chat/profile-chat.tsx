"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

// This component will no longer import mockData directly for fetching history.
// That logic will be initiated by the parent.

// Type for messages displayed by this component (and managed by parent)
export interface DisplayMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
}

interface ProfileChatProps {
  entityId?: string; // Used to trigger history load via parent
  entityType?: "project" | "request"; // Used to trigger history load via parent
  messagesToDisplay: DisplayMessage[];
  onSendMessageRequest: (
    content: string,
    entityId?: string,
    entityType?: "project" | "request"
  ) => void;
  // Parent will call this when entityId/entityType changes, to load history
  onRequestHistoryLoad: (entityId: string, entityType: "project" | "request") => void;
  isLoadingHistory: boolean; // Prop to indicate if parent is loading history
}

export function ProfileChat({
  entityId,
  entityType,
  messagesToDisplay,
  onSendMessageRequest,
  onRequestHistoryLoad,
  isLoadingHistory,
}: ProfileChatProps) {
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // isTyping for bot response simulation can remain local if it's just visual feedback post-send
  const [isBotTypingIndicator, setIsBotTypingIndicator] = useState(false);

  // Internal state to track entity changes for immediate loading feedback
  const [internalLastLoadedEntityId, setInternalLastLoadedEntityId] = useState<string | undefined>(
    undefined
  );
  const [internalLastLoadedEntityType, setInternalLastLoadedEntityType] = useState<
    "project" | "request" | undefined
  >(undefined);
  const [isWaitingForParentLoad, setIsWaitingForParentLoad] = useState(false);

  // Effect to request history load when entityId/Type changes
  useEffect(() => {
    if (entityId && entityType) {
      if (entityId !== internalLastLoadedEntityId || entityType !== internalLastLoadedEntityType) {
        // Entity has changed from what this instance was last told to load/display
        setIsWaitingForParentLoad(true); // Show loading feedback immediately
      }
      onRequestHistoryLoad(entityId, entityType);
      setInternalLastLoadedEntityId(entityId);
      setInternalLastLoadedEntityType(entityType);
    } else {
      // No entity selected, clear internal tracking and waiting state
      setIsWaitingForParentLoad(false);
      setInternalLastLoadedEntityId(undefined);
      setInternalLastLoadedEntityType(undefined);
    }
  }, [
    entityId,
    entityType,
    onRequestHistoryLoad,
    internalLastLoadedEntityId,
    internalLastLoadedEntityType,
  ]);

  // Reset isWaitingForParentLoad when the parent indicates loading has finished
  useEffect(() => {
    if (!isLoadingHistory) {
      setIsWaitingForParentLoad(false);
    }
  }, [isLoadingHistory]);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messagesToDisplay, isLoadingHistory, isWaitingForParentLoad]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoadingHistory || isWaitingForParentLoad) return;

    onSendMessageRequest(input, entityId, entityType);
    setInput("");
    // Simulate bot typing indicator immediately after user sends a message, parent will handle actual bot message
    // This is a simplification; in a real app, bot typing might be controlled by backend events.
    if (entityId) {
      // Only show bot typing if we are in an active chat
      setIsBotTypingIndicator(true);
      setTimeout(() => setIsBotTypingIndicator(false), 1000); // Match typical bot response delay
    }
  };

  // Display messages passed from parent
  const messages = messagesToDisplay;
  const showLoadingIndicator = isLoadingHistory || isWaitingForParentLoad;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto min-h-0 space-y-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db transparent",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background-color: #9ca3af;
          }
        `}</style>

        {showLoadingIndicator && (
          <div className="flex flex-col h-full justify-end">
            <div className="flex flex-col gap-4 flex-1 justify-end py-4">
              {/* Mensaje asistente */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-400/30 mr-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="px-4 py-2 rounded-md bg-gray-400/30 w-40 h-6 mb-2" />
                </div>
              </div>
              {/* Mensaje usuario */}
              <div className="flex justify-end items-end">
                <div className="flex flex-col items-end">
                  <div className="px-4 py-2 rounded-md bg-gray-400/20 w-32 h-6 mb-2" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-400/30 ml-4 flex-shrink-0" />
              </div>
              {/* Mensaje asistente */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-400/30 mr-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="px-4 py-2 rounded-md bg-gray-400/30 w-28 h-6 mb-2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {!showLoadingIndicator && messages.length === 0 && entityId && (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">
              No chat history for this item. Start the conversation!
            </div>
          </div>
        )}

        {!showLoadingIndicator && messages.length === 0 && !entityId && (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">Select an item to view chat.</div>
          </div>
        )}

        {!showLoadingIndicator &&
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex mr-2 ${message.role === "user" ? "justify-end items-end" : "justify-start items-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-300 to-blue-300 mr-4 flex-shrink-0 flex items-center justify-center text-xs">
                  AI
                </div>
              )}
              <div className="relative max-w-[80%] flex flex-col">
                <div
                  className={`px-4 py-2 rounded-md text-[14px] font-medium shadow-sm transition-colors duration-200 self-end ${
                    message.role === "user"
                      ? "bg-[#13103a] md:bg-[#04081E] text-white self-end"
                      : "bg-[#739926] text-white self-start"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "assistant" && (
                  <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#739926] transform rotate-45"></div>
                )}
              </div>
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-300 to-blue-300 ml-4 flex-shrink-0 flex items-center justify-center text-white text-xs">
                  US
                </div>
              )}
            </div>
          ))}

        {isBotTypingIndicator && !showLoadingIndicator && (
          <div className="flex items-center space-x-2 text-gray-400 ml-14">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-shrink-0 w-full mt-2">
        <div className="flex items-center bg-white/10 border border-[#739926] rounded-md overflow-hidden">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              showLoadingIndicator
                ? "Loading..."
                : entityId
                  ? "Write your message..."
                  : "Select an item to chat"
            }
            className="flex-1 bg-transparent text-white placeholder:text-gray-300 px-4 py-2 focus:outline-none text-[14px] h-8"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            disabled={showLoadingIndicator || !entityId}
          />
          <button
            type="submit"
            className="p-2 rounded-full mr-1 text-black bg-[#99CC33] hover:bg-[#8ECF0A] disabled:opacity-50 transition-colors"
            aria-label="Send message"
            disabled={showLoadingIndicator || !entityId || !input.trim()}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
