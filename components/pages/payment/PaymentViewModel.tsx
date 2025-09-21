"use client";

import { useState } from "react";
import { PaymentManagementService } from "@/services/payment-management-service";
import type {
  Payment,
  CreatePaymentData,
  PatchPaymentData,
  ApiResponse,
} from "@/types/payment-management";

export function PaymentViewModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createPayment = async (
    paymentData: CreatePaymentData
  ): Promise<ApiResponse<Payment>> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await PaymentManagementService.createPayment(
        paymentData
      );
      if (response.success) {
        setSuccessMessage("Payment created successfully");
      } else {
        setError(response.message || "Failed to create payment");
      }
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        data: [],
        message: errorMessage,
        errors: [errorMessage],
      };
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (
    paymentId: number,
    paymentData: PatchPaymentData
  ): Promise<ApiResponse<Payment>> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await PaymentManagementService.updatePayment(
        paymentId,
        paymentData
      );
      if (response.success) {
        setSuccessMessage("Payment updated successfully");
      } else {
        setError(response.message || "Failed to update payment");
      }
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        data: [],
        message: errorMessage,
        errors: [errorMessage],
      };
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const success = await PaymentManagementService.deletePayment(paymentId);
      if (success) {
        setSuccessMessage("Payment deleted successfully");
      } else {
        setError("Failed to delete payment");
      }
      return success;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPayment = async (paymentId: number): Promise<Payment | null> => {
    setLoading(true);
    setError(null);

    try {
      const payment = await PaymentManagementService.getPaymentById(paymentId);
      return payment;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPayments = async (
    search?: string,
    stateFilter?: string
  ): Promise<Payment[]> => {
    setLoading(true);
    setError(null);

    try {
      const payments = await PaymentManagementService.getPayments(
        search,
        stateFilter
      );
      return payments;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getPaymentsByEstimate = async (
    estimateId: number
  ): Promise<Payment[]> => {
    setLoading(true);
    setError(null);

    try {
      const payments = await PaymentManagementService.getPaymentsByEstimateId(
        estimateId
      );
      return payments;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    // State
    loading,
    error,
    successMessage,

    // Actions
    createPayment,
    updatePayment,
    deletePayment,
    getPayment,
    getPayments,
    getPaymentsByEstimate,
    clearMessages,
  };
}
