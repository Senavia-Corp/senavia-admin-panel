import type { Task, CreateTaskData, TaskStatus, TaskPriority, ProjectPhase } from "@/types/task-management"

// Mock data
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Create wireframes for homepage",
    status: "Pending",
    priority: "High",
    assignedTo: "John Doe",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    projectId: "0001",
    phase: "Design",
  },
  {
    id: "task-2",
    title: "Setup development environment",
    status: "Assigned",
    priority: "Normal",
    assignedTo: "Jane Smith",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    projectId: "0001",
    phase: "Development",
  },
  {
    id: "task-3",
    title: "Conduct user research",
    status: "InProcess",
    priority: "Urgent",
    assignedTo: "Mike Johnson",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-17"),
    projectId: "0001",
    phase: "Analysis",
  },
  {
    id: "task-4",
    title: "Review design mockups",
    status: "InReview",
    priority: "Normal",
    assignedTo: "Sarah Wilson",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-18"),
    projectId: "0001",
    phase: "Design",
  },
  {
    id: "task-5",
    title: "Deploy to staging",
    status: "Finished",
    priority: "Low",
    assignedTo: "Tom Brown",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
    projectId: "0001",
    phase: "Deployment",
  },
]

export class TaskManagementService {
  static async getTasksByProject(projectId: string, phase?: ProjectPhase): Promise<Task[]> {
    let filteredTasks = mockTasks.filter((task) => task.projectId === projectId)

    if (phase) {
      filteredTasks = filteredTasks.filter((task) => task.phase === phase)
    }

    return filteredTasks
  }

  static async getTaskById(id: string): Promise<Task | null> {
    return mockTasks.find((task) => task.id === id) || null
  }

  static async createTask(taskData: CreateTaskData): Promise<Task> {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      assignedTo: taskData.assignedTo,
      expectedDuration: taskData.expectedDuration,
      startDate: taskData.startDate,
      endDate: taskData.endDate,
      attachments: taskData.attachments ? taskData.attachments.map(file => file.name) : undefined,
      projectId: taskData.projectId,
      phase: taskData.phase,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockTasks.push(newTask)
    return newTask
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const taskIndex = mockTasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return null

    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates, updatedAt: new Date() }
    return mockTasks[taskIndex]
  }

  static async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return this.updateTask(id, { status })
  }

  static async deleteTask(id: string): Promise<boolean> {
    const taskIndex = mockTasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return false

    mockTasks.splice(taskIndex, 1)
    return true
  }

  static getTaskStatuses(): TaskStatus[] {
    return ["Pending", "Assigned", "InProcess", "InReview", "Finished"]
  }

  static getTaskPriorities(): TaskPriority[] {
    return ["Low", "Normal", "High", "Urgent"]
  }

  static getProjectPhases(): ProjectPhase[] {
    return ["Analysis", "Design", "Development", "Deployment"]
  }
}
