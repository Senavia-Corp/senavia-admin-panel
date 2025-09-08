export interface Project {
  id: number;
  name: string;
  description: string;
  expectedDuration: string;
  startDate: string;
  endDate?: string;
  //imagePreviewUrl?: string;
  //phases: Phase[];
  //workTeam_id?: number;
  //estimate_id?: number;
}

export interface Phase {
  id: number;
  name: string;
  description?: string;
  expectedDuration: string;
  startDate: string;
  endDate?: string;
  state: "PLANNING" | "INPROCESS" | "TESTING" | "FINISHED";
}

//Respuesta de la API de blogs simplificados
export interface ProjectApiResponse {
  success: boolean;
  data: Project[];
  message: string;
  status: number;
  errors: string[];
  page: {
    offset: number;
    itemsPerPage: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  errors: string[];
}
