export interface ProjectRecord {
  id: string
  name: string
  startDate: Date
  phase: ProjectPhase
  createdAt: Date
  updatedAt: Date
}

export type ProjectPhase = "Analysis" | "Design" | "Development" | "Deployment"

export interface CreateProjectData {
  name: string
  startDate: Date
  phase: ProjectPhase
}
