"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/atoms/task-card"
import { Plus } from "lucide-react"
import type { Task, TaskStatus } from "@/types/task-management"

interface TaskColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
  onAddTask: (status: TaskStatus) => void
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void
}

export function TaskColumn({ title, status, tasks, onAddTask, onTaskMove }: TaskColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Pending":
        return "bg-gray-500"
      case "Assigned":
        return "bg-blue-500"
      case "InProcess":
        return "bg-yellow-500"
      case "InReview":
        return "bg-purple-500"
      case "Finished":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const taskId = e.dataTransfer.getData("text/plain")
    if (taskId && onTaskMove) {
      onTaskMove(taskId, status)
    }
  }

  const handleTaskDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId)
  }

  return (
    <div className="flex flex-col h-full min-w-80 w-80">
      {/* Column Header */}
      <div className={`${getStatusColor(status)} text-white px-4 py-3 rounded-t-lg flex items-center justify-between`}>
        <span className="font-medium">{title}</span>
        <div className="flex items-center space-x-2">
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">{tasks.length}</span>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-6 w-6"
            onClick={() => onAddTask(status)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        className={`flex-1 bg-gray-100 p-4 rounded-b-lg min-h-96 transition-colors ${
          isDragOver ? "bg-gray-200 border-2 border-dashed border-gray-400" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} draggable onDragStart={(e) => handleTaskDragStart(e, task.id)} className="cursor-move">
              <TaskCard task={task} />
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
          onClick={() => onAddTask(status)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  )
}
