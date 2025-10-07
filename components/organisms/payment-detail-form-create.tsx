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
  CreatePaymentData,
  Payment,
  PaymentState,
} from "@/types/payment-management";
import { useToast } from "@/hooks/use-toast";
import { PaymentManagementService } from "@/services/payment-management-service";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";

export function PaymentDetailFormCreate({
  estimateId,
  onBack,
  onCreateSuccess,
  onRedirectToBillingDetails,
  firstPayment,
}: {
  estimateId: number;
  onBack?: () => void;
  onCreateSuccess?: (newPayment: Payment) => void;
  onRedirectToBillingDetails?: () => void;
  firstPayment?: boolean;
}) {
  const [loadingPost, setLoadingPost] = useState(false);
  const { toast } = useToast();
  const {
    createPayment,
    getPayments,
    payments,
    getBilling,
    billing,
    PatchBilling,
  } = BillingViewModel();
  const [existingPayments, setExistingPayments] = useState<Payment[]>([]);
  const [billingTotalValue, setBillingTotalValue] = useState<number>(0);

  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<PaymentState>("PENDING");
  const [amount, setAmount] = useState(0);
  const [percentagePaid, setPercentagePaid] = useState(0);
  const [paidDate, setPaidDate] = useState("");
  const [method, setMethod] = useState("");

  // Cargar billing data para obtener el valor total
  useEffect(() => {
    const loadBillingData = async () => {
      try {
        await getBilling(estimateId);
      } catch (error) {
        console.error("Error loading billing data:", error);
      }
    };

    loadBillingData();
  }, [estimateId, getBilling]);

  // Actualizar billingTotalValue cuando cambie el billing
  useEffect(() => {
    if (billing && billing.length > 0) {
      const currentBilling = billing.find((b: any) => b.id === estimateId);
      if (currentBilling) {
        setBillingTotalValue(Number(currentBilling.totalValue) || 0);
      }
    }
  }, [billing, estimateId]);

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
  }, [estimateId, getPayments]);

  // Actualizar existingPayments cuando cambien los payments del BillingViewModel
  useEffect(() => {
    console.log("All payments from BillingViewModel:", payments);
    console.log("Current estimateId:", estimateId);

    if (payments && payments.length > 0) {
      const paymentsForEstimate = payments.filter(
        (payment: Payment) => payment.estimateId === estimateId
      );
      console.log("Filtered payments for estimate:", paymentsForEstimate);
      setExistingPayments(paymentsForEstimate);
    } else {
      console.log("No payments found or payments array is empty");
      setExistingPayments([]);
    }
  }, [payments, estimateId]);

  // Función para calcular el porcentaje total actual
  const getCurrentTotalPercentage = () => {
    const total = existingPayments.reduce((total, payment) => {
      const percentage = Number(payment.percentagePaid);
      console.log(
        `Payment ${payment.id}: ${payment.percentagePaid} -> ${percentage}`
      );
      return total + percentage;
    }, 0);
    console.log("Existing payments:", existingPayments);
    console.log("Current total percentage:", total);
    return isNaN(total) ? 0 : total;
  };

  // Función para validar si se puede agregar el nuevo porcentaje
  const validatePercentage = (newPercentage: number) => {
    const currentTotal = getCurrentTotalPercentage();
    return currentTotal + newPercentage <= 100;
  };

  // Función para verificar si ya se completó el 100%
  const isFullyPaid = () => {
    return getCurrentTotalPercentage() >= 100;
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
      const freshPayments = await PaymentManagementService.getPaymentsByEstimateId(estimateId);
      console.log("Fresh payments from service:", freshPayments);

      const totalPercentagePaid = freshPayments.reduce(
        (total: number, payment: Payment) => {
          const percentage = Number(payment.percentagePaid) || 0;
          console.log(`Payment ${payment.id}: ${percentage}%`);
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
      await PatchBilling(estimateId, {
        percentagePaid: totalPercentagePaid,
        remainingPercentage: remainingPercentage,
      });

      console.log("Billing updated successfully with new percentages");
      
      // Recargar el billing para refrescar la UI
      await getBilling(estimateId);
    } catch (error) {
      console.error("Error updating billing percentages:", error);
    }
  };

  const handleCreatePayment = async () => {
    try {
      setLoadingPost(true);

      // Verificar si ya se completó el 100%
      if (isFullyPaid()) {
        toast({
          title: "Cannot create payment",
          description: `Payment creation blocked. Total percentage is already at 100%. No additional payments can be created for this estimate.`,
          variant: "destructive",
        });
        return;
      }

      // Validar que el porcentaje no exceda el 100%
      const currentTotal = getCurrentTotalPercentage();
      const newTotal = currentTotal + percentagePaid;
      console.log("Validation check:", {
        currentTotal,
        percentagePaid,
        newTotal,
        isValid: newTotal <= 100,
      });

      if (!validatePercentage(percentagePaid)) {
        const maxAllowed = 100 - currentTotal;
        toast({
          title: "Percentage limit exceeded",
          description: `Cannot create payment. Current total: ${currentTotal}%. Maximum allowed for new payment: ${maxAllowed}%`,
          variant: "destructive",
        });
        return;
      }

      const paymentData: CreatePaymentData = {
        reference,
        description,
        amount,
        percentagePaid,
        state,
        paidDate: paidDate || undefined,
        method: method || undefined,
        attachments: [],
        estimateId: estimateId,
      };

      const response = await createPayment(paymentData);

      if (response.success && response.data.length > 0) {
        const newPayment = response.data[0];

        toast({
          title: "Payment created successfully",
          description: "The payment has been created successfully.",
        });

        // Notificar al componente padre
        onCreateSuccess?.(newPayment);

        // Actualizar los porcentajes del billing
        await updateBillingPercentages();

        // Redirigir a la tabla de billing details después de crear un payment
        if (onRedirectToBillingDetails) {
          onRedirectToBillingDetails();
        } else if (!firstPayment) {
          // Fallback: solo ejecutar onBack si NO es el primer pago y no hay callback de redirección
          onBack?.();
        }
      } else {
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "Failed to create payment",
        description:
          error instanceof Error
            ? error.message
            : "The payment has not been created.",
      });
    } finally {
      setLoadingPost(false);
    }
  };

  const disableBackButton = () => {
    return firstPayment || false;
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
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
            onClick={onBack}
            disabled={disableBackButton()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-medium text-[#04081E]">
            Create Payment
          </h1>
        </div>
      </div>
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto">
          <div className="max-w-7xl space-y-3 text-[#393939] text-base/4 mx-52">
            {firstPayment && (
              <p className="text-red-500 text-sm">
                Please enter at least one payment
              </p>
            )}

            <p>Reference</p>
            <Input
              placeholder="PAY-2025-001"
              className="w-full h-7"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              type="text"
            />
            <hr className="border-[#EBEDF2]" />

            <p>Description</p>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the description of the Payment"
              rows={6}
              maxLength={10000}
              className="w-full h-28 resize-none text-xs"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {description.length}/10000
            </div>
            <hr className="border-[#EBEDF2]" />

            <p>Amount</p>
            <Input
              placeholder="$0"
              className="w-full h-7"
              type="text"
              value={
                amount
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(amount)
                  : ""
              }
              onChange={(e) => {
                // Eliminar todo excepto números y punto decimal
                const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                if (rawValue === "") {
                  setAmount(0);
                  return;
                }
                const numericValue = parseFloat(rawValue);
                if (!isNaN(numericValue)) {
                  setAmount(numericValue);
                }
              }}
            />
            <hr className="border-[#EBEDF2]" />

            <p>Percentage Paid</p>
            <Input
              placeholder="0"
              className="w-full h-7"
              type="text"
              value={percentagePaid === 0 ? "" : percentagePaid.toString()}
              onChange={(e) => {
                // Eliminar todo excepto números y punto decimal
                const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                if (rawValue === "") {
                  setPercentagePaid(0);
                  setAmount(0);
                  return;
                }
                const numericValue = parseFloat(rawValue);
                if (
                  !isNaN(numericValue) &&
                  numericValue >= 0 &&
                  numericValue <= 100
                ) {
                  setPercentagePaid(numericValue);
                  // Calcular automáticamente el amount basado en el porcentaje
                  const calculatedAmount =
                    calculateAmountFromPercentage(numericValue);
                  setAmount(Math.round(calculatedAmount * 100) / 100); // Redondear a 2 decimales
                }
              }}
            />
            <div className="text-xs text-right mt-1">
              {isFullyPaid() ? (
                <span className="text-green-600 font-semibold">
                  ✅ Payment plan completed: 100%
                </span>
              ) : (
                <div className="space-y-1">
                  <div className="text-gray-500">
                    Current total: {Math.round(getCurrentTotalPercentage())}% |
                    Available: {Math.round(100 - getCurrentTotalPercentage())}%
                  </div>
                  {billingTotalValue > 0 && (
                    <div className="text-blue-600 font-medium">
                      Billing Total: ${billingTotalValue.toLocaleString()} |
                      {percentagePaid > 0 &&
                        ` ${percentagePaid}% = $${calculateAmountFromPercentage(
                          percentagePaid
                        ).toLocaleString()}`}
                    </div>
                  )}
                </div>
              )}
            </div>
            <hr className="border-[#EBEDF2]" />

            <p>State</p>
            <Select
              value={state}
              onValueChange={(value) => setState(value as PaymentState)}
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
            <Select value={method} onValueChange={setMethod}>
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
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
              max={getTodayDate()}
            />
            <hr className="border-[#EBEDF2]" />

            <Button
              className="w-full rounded-full bg-[#95C11F] hover:bg-[#84AD1B] text-white font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleCreatePayment}
              disabled={
                loadingPost ||
                !reference ||
                !description ||
                amount <= 0 ||
                isFullyPaid()
              }
            >
              {loadingPost
                ? "Creating..."
                : isFullyPaid()
                ? "Payment Plan Completed"
                : "Add Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
