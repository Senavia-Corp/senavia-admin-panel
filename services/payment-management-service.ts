import type {
  Payment,
  CreatePaymentData,
  PatchPaymentData,
  PaymentState,
  ApiResponse,
} from "@/types/payment-management";

// Mock data para desarrollo - usando IDs más comunes que podrían existir en billing
const mockPayments: Payment[] = [
  {
    id: 1,
    reference: "PAY-2025-001",
    description: "Initial payment for web development project",
    amount: 5000,
    percentagePaid: 50,
    state: "PAID",
    paidDate: "2025-01-15",
    method: "Bank Transfer",
    attachments: [],
    estimateId: 1,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    reference: "PAY-2025-002",
    description: "Second payment milestone",
    amount: 3000,
    percentagePaid: 30,
    state: "PENDING",
    paidDate: undefined,
    method: undefined,
    attachments: [],
    estimateId: 1,
    createdAt: "2025-01-16T09:00:00Z",
    updatedAt: "2025-01-16T09:00:00Z",
  },
  {
    id: 3,
    reference: "PAY-2025-003",
    description: "Final payment for project completion",
    amount: 2000,
    percentagePaid: 20,
    state: "PENDING",
    paidDate: "2025-01-18",
    method: "Credit Card",
    attachments: ["receipt_001.pdf"],
    estimateId: 2,
    createdAt: "2025-01-18T14:30:00Z",
    updatedAt: "2025-01-18T15:00:00Z",
  },
  // Agregamos más pagos para diferentes billings
  {
    id: 4,
    reference: "PAY-2025-004",
    description: "Marketing campaign payment",
    amount: 1500,
    percentagePaid: 100,
    state: "PAID",
    paidDate: "2025-01-10",
    method: "Wire Transfer",
    attachments: [],
    estimateId: 3,
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
  {
    id: 5,
    reference: "PAY-2025-005",
    description: "Design services payment",
    amount: 2500,
    percentagePaid: 75,
    state: "PAID",
    paidDate: "2025-01-12",
    method: "Credit Card",
    attachments: [],
    estimateId: 4,
    createdAt: "2025-01-12T10:00:00Z",
    updatedAt: "2025-01-12T10:00:00Z",
  },
  {
    id: 6,
    reference: "PAY-2025-006",
    description: "Development milestone 1",
    amount: 4000,
    percentagePaid: 40,
    state: "PENDING",
    paidDate: undefined,
    method: undefined,
    attachments: [],
    estimateId: 5,
    createdAt: "2025-01-14T10:00:00Z",
    updatedAt: "2025-01-14T10:00:00Z",
  },
];

export class PaymentManagementService {
  /**
   * Obtiene todos los pagos con filtros opcionales
   */
  static async getPayments(
    search?: string,
    stateFilter?: string
  ): Promise<Payment[]> {
    let filteredPayments = [...mockPayments];

    if (search) {
      filteredPayments = filteredPayments.filter(
        (payment) =>
          payment.reference.toLowerCase().includes(search.toLowerCase()) ||
          payment.description.toLowerCase().includes(search.toLowerCase()) ||
          payment.method?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stateFilter && stateFilter !== "all") {
      filteredPayments = filteredPayments.filter(
        (payment) => payment.state === stateFilter
      );
    }

    return filteredPayments;
  }

  /**
   * Obtiene pagos por ID de estimado
   */
  static async getPaymentsByEstimateId(estimateId: number): Promise<Payment[]> {
    return mockPayments.filter((payment) => payment.estimateId === estimateId);
  }

  /**
   * Obtiene un pago por ID
   */
  static async getPaymentById(id: number): Promise<Payment | null> {
    return mockPayments.find((payment) => payment.id === id) || null;
  }

  /**
   * Crea un nuevo pago
   */
  static async createPayment(
    paymentData: CreatePaymentData
  ): Promise<ApiResponse<Payment>> {
    try {
      const newPayment: Payment = {
        id: Math.max(...mockPayments.map((p) => p.id), 0) + 1,
        ...paymentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockPayments.push(newPayment);

      return {
        success: true,
        data: [newPayment],
        message: "Payment created successfully",
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: "Failed to create payment",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Actualiza un pago existente
   */
  static async updatePayment(
    id: number,
    updates: PatchPaymentData
  ): Promise<ApiResponse<Payment>> {
    try {
      const paymentIndex = mockPayments.findIndex(
        (payment) => payment.id === id
      );
      if (paymentIndex === -1) {
        return {
          success: false,
          data: [],
          message: "Payment not found",
          errors: ["Payment with specified ID does not exist"],
        };
      }

      mockPayments[paymentIndex] = {
        ...mockPayments[paymentIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: [mockPayments[paymentIndex]],
        message: "Payment updated successfully",
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: "Failed to update payment",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Elimina un pago
   */
  static async deletePayment(id: number): Promise<boolean> {
    const paymentIndex = mockPayments.findIndex((payment) => payment.id === id);
    if (paymentIndex === -1) return false;

    mockPayments.splice(paymentIndex, 1);
    return true;
  }

  /**
   * Obtiene los estados de pago disponibles
   */
  static getPaymentStates(): PaymentState[] {
    return ["PENDING", "PAID"];
  }

  /**
   * Obtiene los métodos de pago disponibles
   */
  static getPaymentMethods(): string[] {
    return [
      "Bank Transfer",
      "Credit Card",
      "Debit Card",
      "PayPal",
      "Cash",
      "Check",
      "Wire Transfer",
    ];
  }
}
