import type { ProjectRecord, CreateProjectData, ProjectPhase } from "@/types/project-management"

// Mock data
const mockProjects: ProjectRecord[] = [
  {
    id: "0001",
    name: "Senavia Corp Website Redesign",
    startDate: new Date("2024-01-15"),
    phase: "Development",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    name: "E-commerce Platform",
    startDate: new Date("2024-01-10"),
    phase: "Design",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    name: "Mobile Application",
    startDate: new Date("2024-01-12"),
    phase: "Analysis",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    name: "Digital Marketing Campaign",
    startDate: new Date("2024-01-08"),
    phase: "Deployment",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
]

export class ProjectManagementService {
  static async getProjects(search?: string, phaseFilter?: string): Promise<ProjectRecord[]> {
    let filteredProjects = [...mockProjects]

    if (search) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(search.toLowerCase()) ||
          project.phase.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (phaseFilter && phaseFilter !== "all") {
      filteredProjects = filteredProjects.filter((project) => project.phase === phaseFilter)
    }

    return filteredProjects
  }

  static async getProjectById(id: string): Promise<ProjectRecord | null> {
    return mockProjects.find((project) => project.id === id) || null
  }

  static async createProject(projectData: CreateProjectData): Promise<ProjectRecord> {
    const newProject: ProjectRecord = {
      id: (mockProjects.length + 1).toString().padStart(4, "0"),
      name: projectData.name,
      startDate: projectData.startDate,
      phase: projectData.phase,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockProjects.push(newProject)
    return newProject
  }

  static async updateProject(id: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
    const projectIndex = mockProjects.findIndex((project) => project.id === id)
    if (projectIndex === -1) return null

    mockProjects[projectIndex] = { ...mockProjects[projectIndex], ...updates, updatedAt: new Date() }
    return mockProjects[projectIndex]
  }

  static async deleteProject(id: string): Promise<boolean> {
    const projectIndex = mockProjects.findIndex((project) => project.id === id)
    if (projectIndex === -1) return false

    mockProjects.splice(projectIndex, 1)
    return true
  }

  static getProjectPhases(): ProjectPhase[] {
    return ["Analysis", "Design", "Development", "Deployment"]
  }
}
