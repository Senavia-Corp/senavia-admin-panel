"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "lucide-react"
import type { Task } from "@/types/task-management"

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-blue-500"
      case "Normal":
        return "bg-green-500"
      case "High":
        return "bg-yellow-500"
      case "Urgent":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card
      className={`p-4 mb-3 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${
        isDragging ? "rotate-2 shadow-lg" : ""
      }`}
    >
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-800 text-white">
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{task.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-gray-100">{getInitials(task.assignedTo)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{task.assignedTo}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
