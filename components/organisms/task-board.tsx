"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TaskColumn } from "@/components/molecules/task-column";
import { CreateTaskDialog } from "@/components/organisms/create-task-dialog";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { TaskManagementService } from "@/services/task-management-service";
import type {
  Task,
  TaskStatus,
  ProjectPhase,
  CreateTaskData,
} from "@/types/task-management";

interface TaskBoardProps {
  projectId: string;
  projectName: string;
  selectedPhase: ProjectPhase;
  onBack: () => void;
}

export function TaskBoard({
  projectId,
  projectName,
  selectedPhase,
  onBack,
}: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("Pending");
  const [loading, setLoading] = useState(true);

  const taskStatuses: { status: TaskStatus; title: string }[] = [
    { status: "Pending", title: "Pending" },
    { status: "Assigned", title: "Assigned" },
    { status: "InProcess", title: "In Progress" },
    { status: "InReview", title: "Under Review" },
    { status: "Finished", title: "Finished" },
  ];

  useEffect(() => {
    loadTasks();
  }, [projectId, selectedPhase]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const projectTasks = await TaskManagementService.getTasksByProject(
        projectId,
        selectedPhase
      );
      setTasks(projectTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedStatus(status);
    setIsCreateDialogOpen(true);
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      const newTask = await TaskManagementService.createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const updatedTask = await TaskManagementService.updateTaskStatus(
        taskId,
        newStatus
      );
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Project Board
            </h1>
            <p className="text-sm text-gray-500">
              {projectName} - {selectedPhase} Phase
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-2" onClick={onBack}>
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Task Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex space-x-6 h-full min-w-max">
          {taskStatuses.map(({ status, title }) => (
            <TaskColumn
              key={status}
              title={title}
              status={status}
              tasks={getTasksByStatus(status)}
              onAddTask={handleAddTask}
              onTaskMove={handleTaskMove}
            />
          ))}
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTask={handleCreateTask}
        initialStatus={selectedStatus}
        projectId={projectId}
        phase={selectedPhase}
      />
    </div>
  );
}
