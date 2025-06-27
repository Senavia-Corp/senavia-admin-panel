"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Edit, Upload, ImageIcon } from "lucide-react"
import { UserAvatar } from "@/components/atoms/user-avatar"
import { UserManagementService } from "@/services/user-management-service"
import type { UserProject, ProjectUpdate, ChatMessage as ChatMessageType } from "@/types/user-management"

interface NewUserProjectsTabProps {
  tabName: string
  userId: string
}

export function NewUserProjectsTab({ userId }: NewUserProjectsTabProps) {
  const [projects, setProjects] = useState<UserProject[]>([])
  const [selectedProject, setSelectedProject] = useState<UserProject | null>(null)
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    loadProjects()
  }, [userId])

  useEffect(() => {
    if (selectedProject) {
      loadProjectUpdates(selectedProject.id)
      loadChatMessages(selectedProject.id)
    }
  }, [selectedProject])

  const loadProjects = async () => {
    try {
      const projectsData = await UserManagementService.getUserProjects(userId)
      setProjects(projectsData)
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0])
      }
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

  const loadProjectUpdates = async (projectId: string) => {
    try {
      const updates = await UserManagementService.getProjectUpdates(projectId)
      setProjectUpdates(updates)
    } catch (error) {
      console.error("Error loading project updates:", error)
    }
  }

  const loadChatMessages = async (projectId: string) => {
    try {
      const messages = await UserManagementService.getChatMessages(projectId, "project")
      setChatMessages(messages)
    } catch (error) {
      console.error("Error loading chat messages:", error)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedProject) {
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
      {/* Left Column - Projects List */}
      <div className="w-1/2 p-6 border-r border-gray-200">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex-1 space-y-4 overflow-auto">
            {projects.map((project) => (
              <div
                key={project.id}
                className="relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.backgroundImage || "/placeholder.svg?height=200&width=400&query=project background"}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold">Project Name</h3>
                      <Edit className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Change Image
                    </Button>
                    <div className="flex space-x-2">
                      <Badge className="bg-blue-500 text-white">Progress</Badge>
                      <Badge className="bg-purple-500 text-white">Project Phase</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 p-0 self-center">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Right Column - Project Updates and Chat */}
      <div className="w-1/2 p-6 flex flex-col">
        {selectedProject && (
          <>
            {/* Project Updates */}
            <div className="flex-1 space-y-4 mb-6 overflow-auto">
              {projectUpdates.map((update) => (
                <div key={update.id} className="border-2 border-green-500 rounded-lg p-4">
                  <p className="text-gray-700 mb-4">{update.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      {update.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">📄 {doc.name}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <span className="text-xs">ℹ️</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Document
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">MM-DD-YY</p>
                </div>
              ))}

              <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3">
                <Plus className="h-4 w-4 mr-2" />
                Create a new update
              </Button>
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
