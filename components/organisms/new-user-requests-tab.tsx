"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Edit } from "lucide-react"
import { UserAvatar } from "@/components/atoms/user-avatar"
import { UserManagementService } from "@/services/user-management-service"
import type { UserRequest, ChatMessage as ChatMessageType } from "@/types/user-management"

interface NewUserRequestsTabProps {
  tabName: string
  userId: string
}

export function NewUserRequestsTab({ userId }: NewUserRequestsTabProps) {
  const [requests, setRequests] = useState<UserRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    loadRequests()
  }, [userId])

  useEffect(() => {
    if (selectedRequest) {
      loadChatMessages(selectedRequest.id)
    }
  }, [selectedRequest])

  const loadRequests = async () => {
    try {
      const requestsData = await UserManagementService.getUserRequests(userId)
      setRequests(requestsData)
      if (requestsData.length > 0 && !selectedRequest) {
        setSelectedRequest(requestsData[0])
      }
    } catch (error) {
      console.error("Error loading requests:", error)
    }
  }

  const loadChatMessages = async (requestId: string) => {
    try {
      const messages = await UserManagementService.getChatMessages(requestId, "request")
      setChatMessages(messages)
    } catch (error) {
      console.error("Error loading chat messages:", error)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedRequest) {
      const message: ChatMessageType = {
        id: Date.now().toString(),
        senderId: "admin1",
        senderName: "Admin",
        message: newMessage,
        timestamp: new Date(),
        isAdmin: true,
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")
    }
  }

  return (
    <div className="h-full flex">
      {/* Left Column - Requests List */}
      <div className="w-1/2 p-6 border-r border-gray-200">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex-1 space-y-3 overflow-auto">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedRequest?.id === request.id
                    ? "border-green-500 bg-green-50"
                    : "border-green-300 hover:border-green-400"
                }`}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">Request Name</h4>
                    <Edit className="h-4 w-4 text-gray-500" />
                  </div>
                  <Badge className="bg-gray-800 text-white">Request Status</Badge>
                </div>
              </div>
            ))}
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 p-0 self-center">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Right Column - Request Details and Chat */}
      <div className="w-1/2 p-6 flex flex-col">
        {selectedRequest && (
          <>
            {/* Request Details */}
            <div className="border-2 border-green-500 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Request Name</h3>
                <Edit className="h-5 w-5 text-gray-500" />
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700">Associated service</p>
                <p className="text-gray-700">Company plan</p>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum
                  dapibus arcu, id hendrerit odio consectetur vitae.
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge className="bg-gray-800 text-white">Request Status</Badge>
                <Badge className="bg-gray-800 text-white">Workteam ID</Badge>
              </div>
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col">
              <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg">
                <h4 className="font-medium">Chat</h4>
              </div>

              <div className="flex-1 bg-gray-50 p-4 space-y-4 overflow-auto">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.isAdmin ? "justify-start" : "justify-end"}`}>
                    {message.isAdmin && <UserAvatar name={message.senderName} size="sm" />}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.isAdmin ? "bg-green-200 text-gray-800" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    {!message.isAdmin && <UserAvatar name={message.senderName} size="sm" />}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Write your message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full w-10 h-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
