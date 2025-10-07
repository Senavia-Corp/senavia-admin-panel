"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Paperclip, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/types/task-management";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

export function TaskCard({
  task,
  isDragging = false,
  onStatusChange,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-blue-500";
      case "Normal":
        return "bg-green-500";
      case "High":
        return "bg-yellow-500";
      case "Urgent":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "InProcess":
        return "bg-yellow-100 text-yellow-800";
      case "InReview":
        return "bg-purple-100 text-purple-800";
      case "Finished":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
    setIsEditing(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className={`p-4 mb-3 bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group ${
        isDragging ? "rotate-2 shadow-lg" : ""
      }`}
    >
      <div className="space-y-3">
        {/* Header with title and edit button */}
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">
            {task.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Status - editable or display */}
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32 h-6 text-xs">
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
          ) : (
            <Badge
              className={`text-xs px-2 py-1 ${getStatusColor(task.status)}`}
            >
              {task.status.toUpperCase()}
            </Badge>
          )}

          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getPriorityColor(
                task.priority
              )}`}
            />
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1 bg-gray-800 text-white"
            >
              {task.priority}
            </Badge>
          </div>
        </div>

        {/* Duration and dates */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {task.expectedDuration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{task.expectedDuration}h</span>
              </div>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>
              {task.startDate
                ? formatDate(task.startDate)
                : formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        {/* Assignee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-gray-100">
                {getInitials(task.assignedTo)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{task.assignedTo}</span>
          </div>

          {/* Date range if available */}
          {task.startDate && task.endDate && (
            <div className="text-xs text-gray-500">
              {formatDate(task.startDate)} - {formatDate(task.endDate)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
