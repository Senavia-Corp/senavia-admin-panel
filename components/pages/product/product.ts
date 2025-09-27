export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  siteUrl: string;
  serviceId: number;
}
export interface ProductCreateInput {
  name: string;
  description: string;
  imageUrl: string;
  siteUrl: string;
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

export interface ProductApiResponse {
  success: boolean;
  data: Product[];
  message: string;
  status: number;
  errors: string[];
  page: {
    offset: number;
    itemsPerPage: number;
    total: number;
  };
}
