"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type {
  TaskStatus,
  TaskPriority,
  ProjectPhase,
  CreateTaskData,
} from "@/types/task-management";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (taskData: CreateTaskData) => void;
  initialStatus?: TaskStatus;
  projectId: string;
  phase: ProjectPhase;
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
    description: "",
    status: initialStatus,
    priority: "Normal" as TaskPriority,
    assignedTo: "",
    expectedDuration: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    attachments: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.assignedTo.trim()) {
      return;
    }

    const taskData: CreateTaskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      assignedTo: formData.assignedTo.trim(),
      expectedDuration: formData.expectedDuration
        ? Number(formData.expectedDuration)
        : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      attachments:
        formData.attachments.length > 0 ? formData.attachments : undefined,
      projectId,
      phase,
    };

    onCreateTask(taskData);

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: initialStatus,
      priority: "Normal",
      assignedTo: "",
      expectedDuration: "",
      startDate: undefined,
      endDate: undefined,
      attachments: [],
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files],
    });
  };

  const removeAttachment = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row: Name and Assigned To */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter task name..."
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned to</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                placeholder="Enter assignee name..."
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Second Row: Description and Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter task description..."
                className="min-h-[120px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">PENDING</SelectItem>
                  <SelectItem value="Assigned">ASSIGNED</SelectItem>
                  <SelectItem value="InProcess">IN PROCESS</SelectItem>
                  <SelectItem value="InReview">IN REVIEW</SelectItem>
                  <SelectItem value="Finished">FINISHED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Third Row: Expected Duration and Priority */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="expectedDuration">
                Expected Duration (En horas)
              </Label>
              <Input
                id="expectedDuration"
                type="number"
                min="0"
                step="0.5"
                value={formData.expectedDuration}
                onChange={(e) =>
                  setFormData({ ...formData, expectedDuration: e.target.value })
                }
                placeholder="Enter duration in hours..."
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">LOW</SelectItem>
                  <SelectItem value="Normal">NORMAL</SelectItem>
                  <SelectItem value="High">HIGH</SelectItem>
                  <SelectItem value="Urgent">URGENT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fourth Row: Start Date and End Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate
                      ? format(formData.startDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) =>
                      setFormData({ ...formData, startDate: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate
                      ? format(formData.endDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) =>
                      setFormData({ ...formData, endDate: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Fifth Row: Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="space-y-3">
              {/* File List */}
              <div className="border rounded-md p-3 min-h-[80px] bg-gray-50">
                {formData.attachments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No files selected
                  </p>
                ) : (
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded border"
                      >
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Upload Button */}
              <div className="flex justify-start">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="relative"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
