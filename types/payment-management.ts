export interface Payment {
  id: number;
  reference: string;
  description: string;
  amount: number;
  percentagePaid: number;
  state: PaymentState;
  paidDate?: string;
  method?: string;
  attachments: string[];
  estimateId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  reference: string;
  description: string;
  amount: number;
  percentagePaid: number;
  state: PaymentState;
  paidDate?: string;
  method?: string;
  attachments: string[];
  estimateId: number;
}

export interface PatchPaymentData {
  reference?: string;
  description?: string;
  amount?: number;
  percentagePaid?: number;
  state?: PaymentState;
  paidDate?: string;
  method?: string;
  attachments?: string[];
}

export type PaymentState =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface PaymentRecord {
  id: string;
  reference: string;
  amount: number;
  state: PaymentState;
  paidDate?: string;
  method?: string;
  associatedEstimate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  errors: string[];
}
