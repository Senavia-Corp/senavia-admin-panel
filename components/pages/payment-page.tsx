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

interface PaymentPageProps {
  payments: Payment[];
  estimateId: number;
  onBack?: () => void;
  onRedirectToBillingDetails?: () => void;
}

export function PaymentPage({
  payments: initialPayments,
  estimateId,
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
      await getPayments();
    } catch (error) {
      console.error("Error loading payments", error);
      toast.error("Failed to load payments");
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
        const updatedPayments = payments.filter(
          (payment) => payment.id !== paymentToDelete.id
        );
        setPayments(updatedPayments);
        setFilteredPayments(updatedPayments);
        setPaymentToDelete(null);
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
    // El BillingViewModel ya actualiza su estado interno
    // Solo necesitamos forzar una re-renderización si es necesario
    // Los cambios se reflejarán automáticamente a través del efecto que sincroniza billingPayments
  };

  const handlePaymentCreate = (newPayment: Payment) => {
    // El BillingViewModel ya actualiza su estado interno cuando se crea un payment
    // Los cambios se reflejarán automáticamente a través del efecto que sincroniza billingPayments
    setShowCreatePayment(false);
  };

  const handleCreatePayment = () => {
    console.log("Create new payment record");
    setShowCreatePayment(true);
  };

  const handleBackToList = () => {
    setShowPaymentDetail(false);
    setShowCreatePayment(false);
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
          onBack={handleBackToList}
          onUpdate={handlePaymentUpdate}
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

  if (loading) {
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
                    (sum, payment) => sum + payment.amount,
                    0
                  )
                )}`,
                "Description",
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
                handlers
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
