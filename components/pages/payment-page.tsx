"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { PaymentDetailForm } from "@/components/organisms/payment-detail-form";
import { PaymentDetailFormCreate } from "@/components/organisms/payment-detail-form-create";
import { PaymentManagementService } from "@/services/payment-management-service";
import { BillingViewModel } from "./billing/BillingViewModel";
import { toast } from "sonner";
import type { Payment } from "@/types/payment-management";
import { Lead } from "@/types/lead-management";

interface PaymentPageProps {
  payments: Payment[];
  estimateId: number;
  lead?: Lead[];
  onBack?: () => void;
  onRedirectToBillingDetails?: () => void;
}

export function PaymentPage({
  payments: initialPayments,
  estimateId,
  lead,
  onBack,
  onRedirectToBillingDetails,
}: PaymentPageProps) {
  const [payments, setPayments] = useState(initialPayments);
  const [filteredPayments, setFilteredPayments] = useState(initialPayments);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number>();
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const {
    deletePayment,
    getPayments,
    payments: billingPayments,
    loading,
  } = BillingViewModel();

  useEffect(() => {
    // Si no hay payments iniciales, cargar todos los payments
    if (initialPayments.length === 0) {
      loadPayments();
    }
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, statusFilter, payments]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      await getPayments();
    } catch (error) {
      console.error("Error loading payments", error);
      setHasError(true);
      toast.error("Failed to load payments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar payments cuando billingPayments cambie
  useEffect(() => {
    if (billingPayments && billingPayments.length > 0) {
      // Si hay un estimateId específico, filtrar solo los payments de ese estimate
      if (estimateId > 0) {
        const estimatePayments = billingPayments.filter(
          (p) => p.estimateId === estimateId
        );
        setPayments(estimatePayments);
        setFilteredPayments(estimatePayments);
      } else {
        // Si no hay estimateId, mostrar todos los payments
        setPayments(billingPayments);
        setFilteredPayments(billingPayments);
      }
    }
  }, [billingPayments, estimateId]);

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((payment) => payment.state === statusFilter);
    }

    setFilteredPayments(filtered);
  };

  const handleDeletePayment = async (paymentToDelete: Payment) => {
    try {
      const success = await deletePayment(paymentToDelete.id);
      if (success) {
        setPaymentToDelete(null);
        // Reload payments to refresh the table
        loadPayments();
        // El toast ya se muestra en el BillingViewModel
      }
    } catch (error) {
      console.error("Error deleting payment", error);
      toast.error("Failed to delete payment");
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPaymentId(payment.id);
    setShowPaymentDetail(true);
  };

  const handlePaymentUpdate = (updatedPayment: Payment) => {
    // Reload payments to ensure data consistency
    loadPayments();
  };

  const handlePaymentCreate = (newPayment: Payment) => {
    setShowCreatePayment(false);
    // Reload payments to refresh the table with the new payment
    loadPayments();
  };

  const handleCreatePayment = () => {
    console.log("Create new payment record");
    setShowCreatePayment(true);
  };

  const handleBackToList = () => {
    setShowPaymentDetail(false);
    setShowCreatePayment(false);
    // Reload payments to ensure fresh data when returning to list
    loadPayments();
  };

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":");
    if (type === "status") {
      setStatusFilter(value);
    }
  };

  const handlers = {
    onCreate: handleCreatePayment,
    onView: handleViewPayment,
    onDelete: (payment: Payment) => setPaymentToDelete(payment),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (showPaymentDetail && selectedPaymentId) {
    return (
      <div className="">
        <PaymentDetailForm
          paymentId={selectedPaymentId}
          payment={
            payments.find((payment) => payment.id === selectedPaymentId)!
          }
          lead={lead}
          onBack={handleBackToList}
          onUpdate={handlePaymentUpdate}
          onRedirectToBillingDetails={onRedirectToBillingDetails}
        />
      </div>
    );
  }

  if (showCreatePayment) {
    return (
      <div className="">
        <PaymentDetailFormCreate
          estimateId={estimateId}
          onBack={handleBackToList}
          onCreateSuccess={handlePaymentCreate}
          onRedirectToBillingDetails={onRedirectToBillingDetails}
        />
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="my-3 flex flex-row space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">
                Payments
              </h1>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "payments-page",
                `Add Payment | Total: ${formatCurrency(
                  filteredPayments.reduce(
                    (sum, payment) => sum + Number(payment.amount),
                    0
                  )
                )}`,
                "Create your deferred payments in a personalized way",
                "All Payments",
                "Description",
                [
                  "ID",
                  "Reference",
                  "Description",
                  "Amount",
                  "Percentage",
                  "State",
                  "Paid Date",
                  "Actions",
                ],
                filteredPayments,
                handlers,
                {
                  isLoading,
                  hasError,
                  onRetry: loadPayments,
                  emptyStateTitle: "No payments found",
                  emptyStateDescription:
                    "No payment records available to display.",
                }
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={!!paymentToDelete}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={() =>
          paymentToDelete && handleDeletePayment(paymentToDelete)
        }
        title="Delete Payment Record"
        description={`Are you sure you want to delete payment record "${paymentToDelete?.reference}"? This action cannot be undone.`}
      />
    </div>
  );
}
