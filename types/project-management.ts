export type ProjectPhase = "Analysis" | "Design" | "Development" | "Deployment";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  currentPhase: ProjectPhase;
  estimateId: string;
  workTeamId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData { 
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  currentPhase: ProjectPhase;
  estimateId?: string;
  workTeamId?: string;
  status: string;
}
