import { ArrowLeft, Eye } from "lucide-react";
import { MultiSelectBilling } from "@/components/atoms/multiselect-billing";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { BillingStatus, CreateBillingData } from "@/types/billing-management";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardMokcup } from "@/components/atoms/card_mokcup";
import { Billings, Billing } from "@/types/billing-management";
import { Leads, Lead } from "@/types/lead-management";
import { Input } from "../ui/input";
import { Plans } from "@/types/plan";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import { CostPage } from "@/components/pages/cost-page";
import { PaymentPage } from "@/components/pages/payment-page";
import { PaymentManagementService } from "@/services/payment-management-service";
import { useToast } from "@/hooks/use-toast";
import { CostDetailFormCreate } from "./cost-detail-form-create";
import { MultiSelectPlan } from "../atoms/multiselect-plan";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface BillingDetailCreateFormProps {
  selectedBilling: (Billings & Partial<Billing>) | null;
  leads: Leads[];
  lead: Lead[];
  plans: Plans[];
  onBack: () => void;
  onSave: () => void;
}

// Mover la función fuera del componente para evitar recreaciones
const servicesID = (service_ID: number) => {
  if (service_ID === 1) {
    return "Digital Marketing Service";
  } else if (service_ID === 2) {
    return "Web Design";
  } else if (service_ID === 3) {
    return "Web Development Service";
  } else {
    return "Service not found";
  }
};

// Constantes fuera del componente
const statuses: BillingStatus[] = [
  "CREATED",
  "PROCESSING",
  "IN_REVIEW",
  "REJECTED",
  "ACCEPTED",
  "INVOICE",
  "PAID",
];

const services: string[] = [
  "Digital Marketing Service",
  "Web Design",
  "Web Development Service",
  "Service not found",
];

const invoiceReference = "INV-2025-0456";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function BillingDetailCreateForm({
  selectedBilling,
  leads,
  lead,
  plans,
  onBack,
  onSave,
}: BillingDetailCreateFormProps) {
  const [showDocument, setShowDocument] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ type: "", message: "" });
  const { createBilling, error, successMessage } = BillingViewModel();

  // Estados para campos editables
  const [title, setTitle] = useState("");
  const [totalValue, setTotalValue] = useState(
    selectedBilling?.totalValue?.toString() || ""
  );
  const [estimatedTime, setEstimatedTime] = useState("");
  const [deadlineToPay, setDeadlineToPay] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [associatedLeads, setAssociatedLeads] = useState<number[]>([]);
  const [service, setService] = useState("");
  const [associatedPlan, setAssociatedPlan] = useState<number[]>([]);
  const [showCosts, setShowCosts] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  type ApiResponse =
    | {
        success: boolean;
        data: Billing[];
      }
    | {
        success: boolean;
        error: string;
      };
  const [newEstimate, setNewEstimate] = useState<Billing | null>(null);

  useEffect(() => {
    // Inicializar estados con selectedBilling si existe
    if (selectedBilling) {
      setEstimatedTime(selectedBilling.estimatedTime?.toString() || "");
      setDescription(selectedBilling.description || "");
      setStatus(selectedBilling.state || "");
      setAssociatedLeads(
        selectedBilling.lead_id ? [selectedBilling.lead_id] : []
      );
      setService(""); // No hay service en estos datos
    }
  }, [selectedBilling]); // Agregar selectedBilling como dependencia

  const handleDocumentPreview = () => {
    setShowDocument(true);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Retorna "YYYY-MM-DD"
  };

  const isFormValid = () => {
    return (
      title !== "" &&
      estimatedTime !== "" &&
      description !== "" &&
      status !== "" &&
      associatedLeads.length > 0 &&
      deadlineToPay !== ""
    );
  };

  const handleCreateBilling = async () => {
    setIsCreating(true);
    try {
      const billingData: CreateBillingData = {
        title: title,
        totalValue: associatedPlan.length > 0 
          ? Number(plans.find((plan) => plan.id === associatedPlan[0])?.price ?? 0)
          : 0,
        estimatedTime: estimatedTime,
        description: description,
        state: status,
        lead_id: associatedLeads[0] || 0,
        plan_id: associatedPlan.length > 0 ? associatedPlan[0] : undefined,
        deadLineToPay: deadlineToPay,
        invoiceDateCreated: status === "INVOICE" ? getTodayDate() : "",
        invoiceReference: invoiceReference,
        percentagePaid: 0,
        remainingPercentage: 100,
      };
      const response = (await createBilling(billingData)) as ApiResponse;

      if (response.success && "data" in response && response.data.length > 0) {
        const newBilling = response.data[0];
        setNewEstimate(newBilling);
        toast({
          title: "Billing created successfully",
          description: "The billing has been created successfully.",
          duration: 3000,
        });
      } else if ("error" in response) {
        toast({
          title: "Failed to create billing",
          description: response.error || "The billing has not been created.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("An error has occurred:", error);
      toast({
        title: "Failed to create billing",
        description:
          error instanceof Error
            ? error.message
            : "The billing has not been created.",
          duration: 3000,
      });
    } finally {
      setIsCreating(false);
      onSave();
    }
  };

  if (showPayments) {
    return (
      <div className="">
        <PaymentPage
          payments={selectedBilling?.payments || []}
          estimateId={selectedBilling?.id || 0}
          onBack={() => setShowPayments(false)}
          onRedirectToBillingDetails={() => setShowPayments(false)}
        />
      </div>
    );
  }


  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-medium text-[#04081E]">
            Create Billing
          </h1>
        </div>
        <Button
          className="rounded-full bg-[#99CC33] text-white font-bold text-base items-center py-2 px-4"
          onClick={handleDocumentPreview}
        >
          Document Preview
        </Button>
      </div>
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto">
          <div className="max-w-7xl mx-auto  space-y-3 text-[#393939] text-base/4">
            <p>Title</p>
            <Input
              type="text"
              className="w-full h-7"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
            <p>Estimated Time:</p>
            <Input
              type="number"
              className="w-full h-7"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="Enter estimated time in months"
            />
            <hr className="border-[#EBEDF2]" />
            <Label
              htmlFor="description"
              className="text-[#393939] text-base/4 font-normal block"
            >
              Description
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the description of the Estimate"
                rows={6}
                maxLength={10000}
                className="w-full h-28 resize-none text-xs"
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2">
                {description.length}/10000
              </div>
            </div>
            <hr className="border-[#EBEDF2]" />
            <p>State</p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-7 ">
                <SelectValue placeholder="Dropdown here" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {statusOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <hr className="border-[#EBEDF2]" />
            <div className="space-y-2">
              <Label>Associated Lead</Label>
              <MultiSelectBilling
                value={associatedLeads}
                onChange={(value) => {
                  setAssociatedLeads(value);
                }}
                leads={leads}
                placeholder="Select a lead..."
                disabled={false}
              />
              {associatedLeads.length > 0 ? (
                <Card className="w-auto text-base">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {
                        leads.find((lead) => lead.id === associatedLeads[0])
                          ?.clientName
                      }
                    </CardTitle>
                    <CardDescription>
                      <p className="font-bold">
                        {
                          leads.find((lead) => lead.id === associatedLeads[0])
                            ?.service?.name
                        }
                      </p>
                      <p>
                        {
                          leads.find((lead) => lead.id === associatedLeads[0])
                            ?.description
                        }
                      </p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <Card className="w-auto text-base">
                  <CardHeader>
                    <CardTitle className="text-base">Select a lead</CardTitle>
                  </CardHeader>
                </Card>
              )}
            </div>
            <hr className="border-[#EBEDF2]" />
            <div className="space-y-2">
              <label>Associated Plan ID (Optional)</label>
              <MultiSelectPlan
                plans={plans}
                value={associatedPlan}
                onChange={(value) => {
                  setAssociatedPlan(value);
                }}
              />
              {associatedPlan.length > 0 ? (
                <Card className="w-auto text-base">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {
                        plans.find((plan) => plan.id === associatedPlan[0])
                          ?.name
                      }
                    </CardTitle>
                    <CardDescription>
                      <p>
                        {plans.find((plan) => plan.id === associatedPlan[0])
                          ?.price
                          ? formatCurrency(
                              plans.find(
                                (plan) => plan.id === associatedPlan[0]
                              )?.price!
                            )
                          : "No price"}
                      </p>
                      <p>
                        {plans.find((plan) => plan.id === associatedPlan[0])
                          ?.description || "No description"}
                      </p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <Card className="w-auto">
                  <CardHeader>
                    <CardTitle className="text-base">Select a plan</CardTitle>
                  </CardHeader>
                </Card>
              )}
            </div>
            <hr className="border-[#EBEDF2]" />
            <p>Deadline to pay</p>
            <Input
              type="date"
              className="w-4/5 h-7"
              value={deadlineToPay}
              onChange={(e) => setDeadlineToPay(e.target.value)}
            />
            <Button
              className={`rounded-full text-3xl items-center py-2 px-4 ${
                isFormValid() && !isCreating
                  ? "bg-[#99CC33] text-white hover:bg-[#99CC33]/80"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleCreateBilling}
              disabled={!isFormValid() || isCreating}
            >
              {isCreating ? "Creating..." : "Create Billing"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
