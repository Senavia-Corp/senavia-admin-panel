export type LeadStatus = "SEND" | "PROCESSING" | "ESTIMATING" | "FINISHED";

export interface Leads {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  state: LeadStatus;
  startDate: string;
  endDate: string;
  user?: {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    imageUrl: string;
    createdAt: string;
    roleId: number;
    updatedAt: string;
    address: string;
  };
  service?: {
    id: number;
    active: boolean;
    createdAt: string;
    description: string;
    name: string;
    updatedAt: string;
  };
  WorkTeam?: {
    id: number;
    name: string;
    description: string;
    state: string;
    area: string;
    createdAt: string;
    updatedAt: string;
  };
  clientAddress?: string;
}

export interface Lead {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  state: LeadStatus;
  endDate: string;
  startDate: string;
  clientAddress: string;
  workTeamId: number;
  userId: number;
  serviceId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    imageUrl: string;
    createdAt: string;
    roleId: number;
    updatedAt: string;
    address: string;
  };
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

export interface CreateLeadData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  description: string;
  state: LeadStatus;
  startDate: string;
  endDate?: string;
  workTeamId?: number;
  serviceId?: number;
  userId?: number;
}
