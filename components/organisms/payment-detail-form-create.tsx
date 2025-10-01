import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
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
  const { createPayment } = BillingViewModel();

  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<PaymentState>("PENDING");
  const [amount, setAmount] = useState(0);
  const [percentagePaid, setPercentagePaid] = useState(0);
  const [paidDate, setPaidDate] = useState("");
  const [method, setMethod] = useState("");

  const handleCreatePayment = async () => {
    try {
      setLoadingPost(true);
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

        // Redirigir a la tabla de billing details después de crear un payment
        if (onRedirectToBillingDetails) {
          onRedirectToBillingDetails();
        } else if (!firstPayment) {
          // Fallback: solo ejecutar onBack si NO es el primer pago y no hay callback de redirección
          onBack?.();
        }
      } else {
        throw new Error(response.message || "Failed to create payment");
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
              type="number"
              min="0"
              max="100"
              value={percentagePaid}
              onChange={(e) => setPercentagePaid(Number(e.target.value))}
            />
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
              className="w-full rounded-full bg-[#95C11F] hover:bg-[#84AD1B] text-white font-bold text-lg"
              onClick={handleCreatePayment}
              disabled={
                loadingPost || !reference || !description || amount <= 0
              }
            >
              {loadingPost ? "Creating..." : "Add Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
