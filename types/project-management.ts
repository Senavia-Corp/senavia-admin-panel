export type ProjectPhase = "Analysis" | "Design" | "Development" | "Deployment";

export interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  currentPhase: ProjectPhase;
  projectType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  currentPhase: ProjectPhase;
  projectType: string;
  status: string;
}
