// app/api/service/service.ts

export interface Service {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Respuesta de la API de services
export interface ServiceApiResponse {
  success: boolean;
  data: Service[];
  message: string;
  status: number;
  errors: string[];
  page: {
    offset: number;
    itemsPerPage: number;
    total: number;
  };
}

// Genérico para reutilizar
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  errors: string[];
}
