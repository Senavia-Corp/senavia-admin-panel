"use client"

import { useState, useEffect } from "react"
import { ProjectPhasesSidebar } from "@/components/organisms/project-phases-sidebar"
import { TaskBoard } from "@/components/organisms/task-board"
import { TopNavbar } from "@/components/organisms/top-navbar"
import { TaskManagementService } from "@/services/task-management-service"
import { ProjectManagementService } from "@/services/project-management-service"
import type { ProjectPhase, Task } from "@/types/task-management"
import type { Project } from "@/types/project-management"

interface ProjectBoardPageProps {
  projectId: string
  onBack: () => void
}

export function ProjectBoardPage({ projectId, onBack }: ProjectBoardPageProps) {
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase>("analysis")
  const [tasks, setTasks] = useState<Task[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [projectData, tasksData] = await Promise.all([
          ProjectManagementService.getProjectById(projectId),
          TaskManagementService.getTasksByProject(projectId, selectedPhase),
        ])
        setProject(projectData)
        setTasks(tasksData)
      } catch (error) {
        console.error("Error loading project data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [projectId, selectedPhase])

  const handlePhaseChange = async (phase: ProjectPhase) => {
    setSelectedPhase(phase)
    setLoading(true)
    try {
      const tasksData = await TaskManagementService.getTasksByProject(projectId, phase)
      setTasks(tasksData)
    } catch (error) {
      console.error("Error loading tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskMove = async (taskId: string, newStatus: Task["status"]) => {
    try {
      await TaskManagementService.updateTaskStatus(taskId, newStatus)
      const updatedTasks = await TaskManagementService.getTasksByProject(projectId, selectedPhase)
      setTasks(updatedTasks)
    } catch (error) {
      console.error("Error moving task:", error)
    }
  }

  const handleTaskCreate = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      await TaskManagementService.createTask({
        ...taskData,
        projectId,
        phase: selectedPhase,
      })
      const updatedTasks = await TaskManagementService.getTasksByProject(projectId, selectedPhase)
      setTasks(updatedTasks)
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  if (loading && !project) {
    return (
      <div className="flex h-screen">
        <TopNavbar showBackButton onBack={onBack} title="Project Board" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNavbar showBackButton onBack={onBack} title="Project Board" subtitle={project?.name || "Loading..."} />

      <div className="flex flex-1 overflow-hidden">
        <ProjectPhasesSidebar
          selectedPhase={selectedPhase}
          onPhaseChange={handlePhaseChange}
          projectPhase={project?.phase || "analysis"}
        />

        <div className="flex-1 overflow-hidden">
          <TaskBoard
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onTaskCreate={handleTaskCreate}
            loading={loading}
            selectedPhase={selectedPhase}
          />
        </div>
      </div>
    </div>
  )
}
