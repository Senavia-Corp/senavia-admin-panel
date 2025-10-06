export interface ProjectPhaseDetail {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  progress: number; // 0-100
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhaseData {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  progress: number;
  projectId: number;
}

export interface UpdatePhaseData {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  progress: number;
}
