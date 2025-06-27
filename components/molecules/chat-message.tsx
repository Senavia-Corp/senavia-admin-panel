import { UserAvatar } from "@/components/atoms/user-avatar"
import type { ChatMessage as ChatMessageType } from "@/types/user-management"

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${message.isAdmin ? "justify-start" : "justify-end"}`}>
      {message.isAdmin && <UserAvatar name={message.senderName} src={message.senderAvatar} size="sm" />}
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.isAdmin ? "bg-green-100 text-gray-800" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p className="text-sm">{message.message}</p>
      </div>
      {!message.isAdmin && <UserAvatar name={message.senderName} src={message.senderAvatar} size="sm" />}
    </div>
  )
}
