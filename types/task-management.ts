export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo: string
  createdAt: Date
  updatedAt: Date
  projectId: string
  phase: ProjectPhase
}

export type TaskStatus = "Pending" | "Assigned" | "InProcess" | "InReview" | "Finished"

export type TaskPriority = "Low" | "Normal" | "High" | "Urgent"

export type ProjectPhase = "Analysis" | "Design" | "Development" | "Deployment"

export interface CreateTaskData {
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo: string
  projectId: string
  phase: ProjectPhase
}

export interface TaskBoard {
  projectId: string
  phase: ProjectPhase
  tasks: Task[]
}

export interface DragResult {
  draggableId: string
  type: string
  source: {
    droppableId: string
    index: number
  }
  destination?: {
    droppableId: string
    index: number
  } | null
}
