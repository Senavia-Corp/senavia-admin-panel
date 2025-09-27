export enum PhaseName {
  ANALYSIS = "ANALYSIS",
  DESIGN = "DESIGN",
  DEVELOPMENT = "DEVELOPMENT",
  DEPLOY = "DEPLOY",
}

// UI-friendly phase labels
export type ProjectPhase = "Analysis" | "Design" | "Development" | "Deployment";

export interface Phase {
  id: number;
  name: PhaseName;
  description?: string;
  startDate: string;
  endDate?: string;
  project_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  expectedDuration?: string;
  startDate: string;
  endDate?: string;
  imagePreviewUrl?: string;
  phases: Phase[];
  workTeam_id?: {
    id: number;
    name: string;
  };
  estimate_id?: {
    id: number;
    description: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProjectData {
  name: string;
  description: string;
  expectedDuration?: string;
  startDate: string;
  endDate?: string;
  imagePreviewUrl?: string;
  phases: {
    name: PhaseName;
    description?: string;
    startDate?: string;
    endDate?: string;
  }[];
  workTeam_id: number;
  estimate_id: number;
}
