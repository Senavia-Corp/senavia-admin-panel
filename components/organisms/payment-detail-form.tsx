import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Payment,
  PatchPaymentData,
  PaymentState,
} from "@/types/payment-management";
import { useToast } from "@/hooks/use-toast";
import { PaymentManagementService } from "@/services/payment-management-service";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import { Lead } from "@/types/lead-management";
import axios from "axios";

interface PaymentDetailFormProps {
  paymentId: number;
  payment: Payment;
  lead?: Lead[];
  onBack?: () => void;
  onUpdate?: (updatedPayment: Payment) => void;
  onRedirectToBillingDetails?: () => void;
}

export function PaymentDetailForm({
  paymentId,
  payment,
  lead,
  onBack,
  onUpdate,
  onRedirectToBillingDetails,
}: PaymentDetailFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localPayment, setLocalPayment] = useState(payment);
  const { toast } = useToast();
  const {
    updatePayment,
    createStripeSession,
    getPayments,
    payments,
    getBilling,
    billing,
    PatchBilling,
  } = BillingViewModel();
  const [existingPayments, setExistingPayments] = useState<Payment[]>([]);
  const [billingTotalValue, setBillingTotalValue] = useState<number>(0);

  // Cargar billing data para obtener el valor total
  useEffect(() => {
    const loadBillingData = async () => {
      try {
        await getBilling(payment.estimateId);
      } catch (error) {
        console.error("Error loading billing data:", error);
      }
    };

    loadBillingData();
  }, [payment.estimateId, getBilling]);

  // Actualizar billingTotalValue cuando cambie el billing
  useEffect(() => {
    if (billing && billing.length > 0) {
      const currentBilling = billing.find(
        (b: any) => b.id === payment.estimateId
      );
      if (currentBilling) {
        setBillingTotalValue(Number(currentBilling.totalValue) || 0);
      }
    }
  }, [billing, payment.estimateId]);

  // Cargar payments existentes para validar porcentaje
  useEffect(() => {
    const loadExistingPayments = async () => {
      try {
        await getPayments(); // Esto actualiza el estado en BillingViewModel
      } catch (error) {
        console.error("Error loading existing payments:", error);
      }
    };

    loadExistingPayments();
  }, [payment.estimateId, getPayments]);

  // Actualizar existingPayments cuando cambien los payments del BillingViewModel
  useEffect(() => {
    if (payments && payments.length > 0) {
      const paymentsForEstimate = payments.filter(
        (p: Payment) => p.estimateId === payment.estimateId
      );
      setExistingPayments(paymentsForEstimate);
    }
  }, [payments, payment.estimateId]);

  // Función para calcular el porcentaje total actual (excluyendo el payment actual)
  const getCurrentTotalPercentage = () => {
    return existingPayments
      .filter((p) => p.id !== payment.id) // Excluir el payment actual
      .reduce((total, p) => total + p.percentagePaid, 0);
  };

  // Función para validar si se puede actualizar el porcentaje
  const validatePercentage = (newPercentage: number) => {
    const currentTotal = getCurrentTotalPercentage();
    return currentTotal + newPercentage <= 100;
  };

  // Función para calcular automáticamente el amount basado en el porcentaje
  const calculateAmountFromPercentage = (percentage: number) => {
    if (billingTotalValue > 0 && percentage > 0) {
      return (billingTotalValue * percentage) / 100;
    }
    return 0;
  };

  // Función para actualizar el billing con los nuevos porcentajes
  const updateBillingPercentages = async () => {
    try {
      console.log("Starting billing percentage update...");

      // Obtener payments frescos directamente del servicio
      const freshPayments =
        await PaymentManagementService.getPaymentsByEstimateId(
          payment.estimateId
        );
      console.log("Fresh payments from service:", freshPayments);

      const totalPercentagePaid = freshPayments.reduce(
        (total: number, p: Payment) => {
          const percentage = Number(p.percentagePaid) || 0;
          console.log(`Payment ${p.id}: ${percentage}%`);
          return total + percentage;
        },
        0
      );

      const remainingPercentage = Math.max(0, 100 - totalPercentagePaid);

      console.log("Calculated percentages:", {
        totalPercentagePaid,
        remainingPercentage,
        paymentsCount: freshPayments.length,
      });

      // Actualizar el billing con los nuevos porcentajes
      await PatchBilling(payment.estimateId, {
        percentagePaid: totalPercentagePaid,
        remainingPercentage: remainingPercentage,
      });

      console.log("Billing updated successfully with new percentages");

      // Recargar el billing para refrescar la UI
      await getBilling(payment.estimateId);
    } catch (error) {
      console.error("Error updating billing percentages:", error);
    }
  };

  const handleUpdatePayment = async () => {
    try {
      setIsUpdating(true);

      // Solo validar porcentaje si ha cambiado respecto al valor original
      // Esto permite actualizar otros campos (reference, description, amount, etc.) sin restricciones
      const percentageChanged =
        localPayment.percentagePaid !== payment.percentagePaid;

      if (
        percentageChanged &&
        !validatePercentage(localPayment.percentagePaid)
      ) {
        const currentTotal = getCurrentTotalPercentage();
        const maxAllowed = 100 - currentTotal;
        toast({
          title: "Percentage limit exceeded",
          description: `Cannot update payment. Current total (excluding this payment): ${currentTotal}%. Maximum allowed: ${maxAllowed}%`,
          variant: "destructive",
        });
        return;
      }

      const paymentData: PatchPaymentData = {
        reference: localPayment.reference,
        description: localPayment.description,
        amount: localPayment.amount,
        percentagePaid: localPayment.percentagePaid,
        state: localPayment.state,
        paidDate: localPayment.paidDate,
        method: localPayment.method,
        attachments: localPayment.attachments,
      };

      // Intentar actualizar en el servidor primero
      const response = await updatePayment(paymentId, paymentData);

      if (response.success && response.data.length > 0) {
        const updatedPayment = response.data[0];

        // Actualizar estado local y notificar al padre
        setLocalPayment(updatedPayment);
        onUpdate?.(updatedPayment);

        toast({
          title: "Payment updated successfully",
          description: `The payment "${paymentData.reference}" has been updated.`,
        });

        // Actualizar los porcentajes del billing
        await updateBillingPercentages();

        // Redirigir a la tabla de billing details después de actualizar
        if (onRedirectToBillingDetails) {
          onRedirectToBillingDetails();
        }
      } else {
        throw new Error("Failed to update payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      // En caso de error, revertimos los cambios locales
      setLocalPayment(payment);
      toast({
        title: "Failed to update payment",
        description:
          error instanceof Error
            ? error.message
            : "The payment has not been updated.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFieldChange = (field: keyof typeof localPayment, value: any) => {
    setLocalPayment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendEmail = async () => {
    try {
      //Usar localPayment para obtener los datos necesarios
      const realAmount = localPayment.amount * 100;
      const response = await createStripeSession(
        localPayment.reference,
        realAmount,
        localPayment.id
      );

      if (response) {
        const emailResponse = await fetch(
          "https://damddev.app.n8n.cloud/webhook/70363524-d32d-43e8-99b5-99035a79daa8",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: lead?.[0]?.clientName || "Cliente",
              email: lead?.[0]?.clientEmail || "client@example.com",
              paymentsignUrl: response,
            }),
          }
        );

        if (emailResponse.ok) {
          toast({
            title: "Successful submission",
            description:
              "The payment notification has been sent to the client successfully.",
          });
        } else {
          throw new Error(`HTTP error! status: ${emailResponse.status}`);
        }
      } else {
        throw new Error("Error creating checkout session");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error sending email",
        description:
          "There was an error sending the payment notification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const paymentStates = PaymentManagementService.getPaymentStates();
  const paymentMethods = PaymentManagementService.getPaymentMethods();

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Retorna "YYYY-MM-DD"
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-medium text-[#04081E]">Edit Payment</h1>
        </div>
        <Button
          className="rounded-full bg-[#95C11F] hover:bg-[#84AD1B] text-white font-semibold text-sm px-4 py-2"
          onClick={handleSendEmail}
        >
          Send Payment by Email
        </Button>
      </div>
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto">
          <div className="max-w-7xl space-y-3 text-[#393939] text-base/4 mx-52">
            <p>Reference</p>
            <Input
              placeholder="PAY-2025-001"
              className="w-full h-7"
              value={localPayment.reference}
              onChange={(e) => handleFieldChange("reference", e.target.value)}
              type="text"
            />
            <hr className="border-[#EBEDF2]" />

            <p>Description</p>
            <Textarea
              id="description"
              value={localPayment.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Enter the description of the Payment"
              rows={6}
              maxLength={10000}
              className="w-full h-28 resize-none text-xs"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {localPayment.description.length}/10000
            </div>
            <hr className="border-[#EBEDF2]" />

            <p>Amount</p>
            <Input
              placeholder="$0"
              className="w-full h-7"
              type="text"
              value={
                localPayment.amount
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(localPayment.amount)
                  : ""
              }
              onChange={(e) => {
                // Eliminar todo excepto números y punto decimal
                const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                if (rawValue === "") {
                  handleFieldChange("amount", 0);
                  return;
                }
                const numericValue = parseFloat(rawValue);
                if (!isNaN(numericValue)) {
                  handleFieldChange("amount", numericValue);
                }
              }}
            />
            <hr className="border-[#EBEDF2]" />

            <p>Percentage Paid</p>
            <Input
              placeholder="0"
              className="w-full h-7"
              type="text"
              value={
                localPayment.percentagePaid === 0
                  ? ""
                  : localPayment.percentagePaid.toString()
              }
              onChange={(e) => {
                // Eliminar todo excepto números y punto decimal
                const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                if (rawValue === "") {
                  handleFieldChange("percentagePaid", 0);
                  handleFieldChange("amount", 0);
                  return;
                }
                const numericValue = parseFloat(rawValue);
                if (
                  !isNaN(numericValue) &&
                  numericValue >= 0 &&
                  numericValue <= 100
                ) {
                  handleFieldChange("percentagePaid", numericValue);
                  // Calcular automáticamente el amount basado en el porcentaje
                  const calculatedAmount =
                    calculateAmountFromPercentage(numericValue);
                  handleFieldChange(
                    "amount",
                    Math.round(calculatedAmount * 100) / 100
                  );
                }
              }}
            />
            <div className="text-xs text-right mt-1">
              <div className="space-y-1">
                <div className="text-gray-500">
                  Current total (excluding this): {getCurrentTotalPercentage()}%
                  | Available: {100 - getCurrentTotalPercentage()}%
                </div>
                {billingTotalValue > 0 && (
                  <div className="text-blue-600 font-medium">
                    Billing Total: ${billingTotalValue.toLocaleString()} |
                    {localPayment.percentagePaid > 0 &&
                      ` ${
                        localPayment.percentagePaid
                      }% = $${calculateAmountFromPercentage(
                        localPayment.percentagePaid
                      ).toLocaleString()}`}
                  </div>
                )}
              </div>
            </div>
            <hr className="border-[#EBEDF2]" />

            <p>State</p>
            <Select
              value={localPayment.state}
              onValueChange={(value) =>
                handleFieldChange("state", value as PaymentState)
              }
            >
              <SelectTrigger className="w-full h-7">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {paymentStates.map((stateOption) => (
                  <SelectItem key={stateOption} value={stateOption}>
                    {stateOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <hr className="border-[#EBEDF2]" />

            <p>Payment Method</p>
            <Select
              value={localPayment.method || ""}
              onValueChange={(value) => handleFieldChange("method", value)}
            >
              <SelectTrigger className="w-full h-7">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((methodOption) => (
                  <SelectItem key={methodOption} value={methodOption}>
                    {methodOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <hr className="border-[#EBEDF2]" />

            <p>Paid Date (optional)</p>
            <Input
              className="w-full h-7"
              type="date"
              value={
                localPayment.paidDate ? localPayment.paidDate.split("T")[0] : ""
              }
              onChange={(e) => handleFieldChange("paidDate", e.target.value)}
              max={getTodayDate()}
            />
            <hr className="border-[#EBEDF2]" />

            <Button
              className="w-full rounded-full bg-[#95C11F] hover:bg-[#84AD1B] text-white font-bold text-lg"
              onClick={handleUpdatePayment}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
