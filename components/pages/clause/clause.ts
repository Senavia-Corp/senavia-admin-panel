export interface Clause{
    id:number;
    title:string;
    description: string;
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
export interface ClauseApiResponse {
  success: boolean;
  data: Clause[];
  message: string;
  status: number;
  errors: string[];
  page: {
    offset: number;
    itemsPerPage: number;
    total: number;
  };
}