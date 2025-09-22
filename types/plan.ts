export interface Plans {
    id: number;
    name: string;
    description: string;
    type: "SINGLEPAYMENT";
    price: number;
    service: {
      id: number;
      active: boolean;
      createdAt: string;
      description: string;
      name: string;
      updatedAt: string;
    };
}

export interface Plan {
    id: number;
    name: string;
    description: string;
    type: "SINGLEPAYMENT";
    price: number;
    serviceId: number;
    createdAt: string;
    updatedAt: string;
    service: {
      id: number;
      active: boolean;
      createdAt: string;
      description: string;
      name: string;
      updatedAt: string;
    };
}

export interface apiResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  errors: string[];
}