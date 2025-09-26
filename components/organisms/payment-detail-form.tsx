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
  Payment,
  PatchPaymentData,
  PaymentState,
} from "@/types/payment-management";
import { useToast } from "@/hooks/use-toast";
import { PaymentManagementService } from "@/services/payment-management-service";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import axios from "axios";

interface PaymentDetailFormProps {
  paymentId: number;
  payment: Payment;
  onBack?: () => void;
  onUpdate?: (updatedPayment: Payment) => void;
}

export function PaymentDetailForm({
  paymentId,
  payment,
  onBack,
  onUpdate,
}: PaymentDetailFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localPayment, setLocalPayment] = useState(payment);
  const { toast } = useToast();
  const { updatePayment, createStripeSession } = BillingViewModel();

  const handleUpdatePayment = async () => {
    try {
      setIsUpdating(true);
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
      } else {
        throw new Error(response.message || "Failed to update payment");
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
    //Usar localPayment para obtener los datos necesarios
    const realAmount = localPayment.amount * 100;
    const response = await createStripeSession(localPayment.reference, realAmount, localPayment.id);
    if (response) {
      fetch(
        "https://damddev.app.n8n.cloud/webhook/70363524-d32d-43e8-99b5-99035a79daa8",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Juan Jose Jimenez",
            email: "juan@senaviacorp.com", // TODO: Get client email from billing/lead data
            paymentsignUrl: response,
          }),
        }
      );
    } else {
      console.error("Error creating checkout session");
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
        <div className="flex space-x-4">
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
              maxLength={1000}
              className="w-full h-28 resize-none text-xs"
            />
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
                // Eliminar todo excepto números
                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                if (rawValue === "") {
                  handleFieldChange("amount", 0);
                  return;
                }
                handleFieldChange("amount", parseInt(rawValue));
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
              value={localPayment.percentagePaid}
              onChange={(e) =>
                handleFieldChange("percentagePaid", Number(e.target.value))
              }
            />
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

            <button
              className="w-full rounded-full bg-[#95C11F] hover:bg-[#84AD1B] text-white font-bold text-lg"
              onClick={() => {
                handleSendEmail();
              }}
            >
              Send Payment by Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
