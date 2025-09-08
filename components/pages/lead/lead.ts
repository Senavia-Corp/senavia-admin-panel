export interface User {
  name: string;
  email: string;
  imageUrl: string;
}

export interface WorkTeam {
  name: string;
  description: string;
  state: string;
  area: string;
}

export interface Service {
  active: boolean;
  name: string;
  description: string;
}

export enum LeadStatusEnum {
  SEND = "SEND",
  PROCESSING = "PROCESSING",
  ESTIMATING = "ESTIMATING",
  FINISHED = "FINISHED",
}

export interface Lead {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  state: LeadStatusEnum;
  User: User;
  WorkTeam: WorkTeam;
  Service: Service;
  createdAt: string;
  updatedAt: string;
}

// Si necesitas una versión simplificada para ciertas vistas
export interface SimpleLead {
  id: number;
  clientName: string;
  startDate: string;
  state: LeadStatusEnum;
  createdAt: string;
}

// Para respuesta con paginación
export interface LeadApiResponse {
  success: boolean;
  data: Lead[];
  page?: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
  message?: string;
}

// Respuesta genérica sin paginación
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
}
