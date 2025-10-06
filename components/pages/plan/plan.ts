export interface Plan {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  serviceId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  errors: string[];
}
export interface SingleApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: string[];
}
export interface PlanApiResponse {
  success: boolean;
  data: Plan[];
  message: string;
  status: number;
  errors: string[];
  page: {
    offset: number;
    itemsPerPage: number;
    total: number;
  };
}