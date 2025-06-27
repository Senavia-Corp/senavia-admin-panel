"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TaskStatus, TaskPriority, ProjectPhase, CreateTaskData } from "@/types/task-management"

interface CreateTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (taskData: CreateTaskData) => void
  initialStatus?: TaskStatus
  projectId: string
  phase: ProjectPhase
}

export function CreateTaskDialog({
  isOpen,
  onClose,
  onCreateTask,
  initialStatus = "Pending",
  projectId,
  phase,
}: CreateTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    status: initialStatus,
    priority: "Normal" as TaskPriority,
    assignedTo: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.assignedTo.trim()) {
      return
    }

    const taskData: CreateTaskData = {
      title: formData.title.trim(),
      status: formData.status,
      priority: formData.priority,
      assignedTo: formData.assignedTo.trim(),
      projectId,
      phase,
    }

    onCreateTask(taskData)

    // Reset form
    setFormData({
      title: "",
      status: initialStatus,
      priority: "Normal",
      assignedTo: "",
    })

    onClose()
  }

  const handleClose = () => {
    setFormData({
      title: "",
      status: initialStatus,
      priority: "Normal",
      assignedTo: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="Enter assignee name..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="InProcess">In Process</SelectItem>
                  <SelectItem value="InReview">In Review</SelectItem>
                  <SelectItem value="Finished">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
