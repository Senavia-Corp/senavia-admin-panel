import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import { MultiSelectBilling } from "../atoms/multiselect-billing";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { DocumentPreviewBilling } from "../../lib/billing/document-preview-billing";
import { Billings, Billing } from "@/types/billing-management";
import { Leads, Lead } from "@/types/lead-management";
import { Input } from "../ui/input";
import { Plans, Plan } from "@/types/plan";
import { CostPage } from "@/components/pages/cost-page";
import { PaymentPage } from "@/components/pages/payment-page";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import { BillingStatus, CreateBillingData, BillingPDF } from "@/types/billing-management";
import { useToast } from "@/hooks/use-toast";
import { MultiSelectPlan } from "../atoms/multiselect-plan";
import { Progress } from "../ui/progress";
import { pdf as pdfRenderer } from "@react-pdf/renderer";
import { InvoicePDFDocument } from "@/lib/billing/invoice-pdf-document";

interface BillingDetailFormProps {
  selectedBilling: (Billings & Partial<Billing>) | null;
  billingId: number;
  leads: Leads[];
  lead: Lead[];
  plans: Plans[];
  onBack: () => void;
  onSave: () => void;
  onBackRefresh?: () => Promise<void> | void;
}

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
export function BillingDetailForm({
  selectedBilling,
  billingId,
  leads,
  lead,
  plans,
  onBack,
  onSave,
  onBackRefresh,
}: BillingDetailFormProps) {
  const [showDocument, setShowDocument] = useState(false);
  const [showCosts, setShowCosts] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const { PatchBilling, sendToClient, getBilling, billing, getLeadById, getPlanById, plan, lead: vmLead } = BillingViewModel();
  const [estimatedTime, setEstimatedTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [associatedLeads, setAssociatedLeads] = useState<number[]>([]);
  const [service, setService] = useState("");
  const [associatedPlan, setAssociatedPlan] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localEstimateData, setLocalEstimateData] = useState<CreateBillingData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Inicializar estados con selectedBilling si existe
    if (selectedBilling) {
      setEstimatedTime(selectedBilling.estimatedTime?.toString() || "");
      setDescription(selectedBilling.description || "");
      setStatus(selectedBilling.state || "");
      setAssociatedLeads(
        selectedBilling.lead_id ? [selectedBilling.lead_id] : []
      );
      setAssociatedPlan(
        selectedBilling.plan_id ? [selectedBilling.plan_id] : []
      );
      setService(""); // No hay service en estos datos
    }

    setLocalEstimateData({
      title: selectedBilling?.title || "",
      totalValue: Number(selectedBilling?.totalValue) || 0,
      estimatedTime: selectedBilling?.estimatedTime?.toString() || "",
      description: selectedBilling?.description || "",
      state: selectedBilling?.state || "",
      lead_id: selectedBilling?.lead_id || 0,
      plan_id: selectedBilling?.plan_id || 0,
      deadLineToPay: selectedBilling?.deadLineToPay || "",
      invoiceDateCreated: selectedBilling?.invoiceDateCreated || "",
      invoiceReference: selectedBilling?.invoiceReference || "",
      percentagePaid: selectedBilling?.percentagePaid || 0,
      remainingPercentage: selectedBilling?.remainingPercentage || 0,
    });
  }, []);

  // Sincronizar datos locales cuando llegue el billing desde backend
  useEffect(() => {
    if (billing && Array.isArray(billing) && billing.length > 0) {
      const b = billing[0] as unknown as Billing;
      setLocalEstimateData({
        title: b.title || "",
        totalValue: Number(b.totalValue) || 0,
        estimatedTime: b.estimatedTime?.toString() || "",
        description: b.description || "",
        state: b.state || "",
        lead_id: b.lead_id || 0,
        plan_id: b.plan_id || 0,
        deadLineToPay: b.deadLineToPay || "",
        invoiceDateCreated: b.invoiceDateCreated || "",
        invoiceReference: b.invoiceReference || "",
        percentagePaid: b.percentagePaid || 0,
        remainingPercentage: b.remainingPercentage || 0,
      });
    }
  }, [billing]);

  const refreshFromBackend = async () => {
    try {
      setIsRefreshing(true);
      await getBilling(billingId);
      const refreshedLeadId = (localEstimateData?.lead_id || selectedBilling?.lead_id || 0);
      const refreshedPlanId = (localEstimateData?.plan_id || selectedBilling?.plan_id || 0);
      if (refreshedLeadId) await getLeadById(refreshedLeadId);
      if (refreshedPlanId) await getPlanById(refreshedPlanId);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDocumentPreview = () => {
    setShowDocument(true);
  };

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

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Retorna "YYYY-MM-DD"
  };

  const openCosts = async () => {
    try {
      setIsRefreshing(true);
      await refreshFromBackend();
      setShowCosts(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const UpdateBilling = async () => {
    try {
      setIsUpdating(true);
      const ID_estimate = selectedBilling?.id || 0;

      const planPrice =
        Number(plans.find((plan) => plan.id === associatedPlan[0])?.price) ||
        Number(localEstimateData?.totalValue) ||
        0;
      const costsTotal =
        selectedBilling?.costs?.reduce(
          (sum, cost) => sum + Number(cost.value),
          0
        ) || 0;

      const billingData: CreateBillingData = {
        ...localEstimateData!,
        state: status,
        totalValue: planPrice + costsTotal,
        deadLineToPay: status === "INVOICE" ? getTodayDate() : "",
        invoiceDateCreated: status === "INVOICE" ? getTodayDate() : "",
        invoiceReference: "INV-2025-0456",
      };
      await PatchBilling(ID_estimate, billingData);
      setLocalEstimateData(billingData);
      // Recargar del backend para reflejar datos actualizados
      await refreshFromBackend();
      toast({
        title: "Billing updated successfully",
        description: "The billing has been updated successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to update billing",
        description: "The billing has not been updated.",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);

    }
  };
  const handleSendToClient = async () => {
    try {
      // Asegurar datos frescos
      await refreshFromBackend();
      const latestBilling = billing && Array.isArray(billing) && billing.length > 0 ? (billing[0] as unknown as Billing) : (selectedBilling as Billing | null);
      const selectedLead = leads.find((l) => l.id === associatedLeads[0]);
      const selectedPlan = plans.find((p) => p.id === associatedPlan[0]);
      const backendLead = vmLead && vmLead.length > 0 ? (vmLead[0] as unknown as Lead) : undefined;
      const backendPlan = plan && plan.length > 0 ? (plan[0] as unknown as Plans) : undefined;
      const effectiveLead = backendLead ?? selectedLead;
      const effectivePlan = backendPlan ?? selectedPlan;
      if (!effectiveLead || !effectivePlan || !latestBilling) {
        throw new Error("Missing lead/plan/billing for PDF generation");
      }
      // Adaptar tipos: Leads -> Lead (asegurar clientAddress) y Plans -> Plan (agregar serviceId/fechas)
      const leadForPdf: Lead = {
        ...effectiveLead,
        clientAddress: effectiveLead.clientAddress || "",
      } as Lead;

      const planForPdf: Plan = {
        id: effectivePlan.id,
        name: effectivePlan.name,
        description: effectivePlan.description,
        type: effectivePlan.type,
        price: effectivePlan.price,
        serviceId: effectivePlan.service.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        service: effectivePlan.service,
      } as Plan;
      const pdfBlob = await pdfRenderer(
        <InvoicePDFDocument
          lead={leadForPdf}
          billing={{
            ...(latestBilling as Billing),
            description: (latestBilling as Billing)?.description || "",
            totalValue: (latestBilling as Billing)?.totalValue || "0",
          } as Billing}
          plans={planForPdf}
        />
      ).toBlob();

      const arrayBuffer = await pdfBlob.arrayBuffer();
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      await sendToClient({
        name: effectiveLead?.clientName || "",
        title: localEstimateData?.title || (latestBilling?.title ?? ""),
        description: localEstimateData?.description || (latestBilling?.description ?? ""),
        email: effectiveLead?.clientEmail || "",
        document: base64String,
      });

      toast({
        title: "Billing sent to client successfully",
        description: "The billing has been sent to the client.",
      });
    } catch (error) {
      console.error("Error sending to client:", error);
      toast({
        title: "Failed to send to client",
        description: "The billing has not been sent to the client.",
      });
    }
  };

  if (showCosts) {
    // Usar datos más recientes del backend si están disponibles
    const latestFromVm = billing && Array.isArray(billing) && billing.length > 0 ? (billing[0] as unknown as Billing) : null;
    const latestCosts = latestFromVm?.costs ?? selectedBilling?.costs ?? [];
    const latestTotalValue = latestFromVm?.totalValue ? Number(latestFromVm.totalValue) : Number(selectedBilling?.totalValue || 0);

    return (
      <div className="">
        <CostPage
          costs={latestCosts}
          totalValue={latestTotalValue}
          estimateId={selectedBilling?.id || 0}
          onBack={async () => {
            await refreshFromBackend();
            setShowCosts(false);
          }}
        />
      </div>
    );
  }

  if (showPayments) {
    return (
      <div className="">
        <PaymentPage
          payments={selectedBilling?.payments || []}
          lead={lead}
          estimateId={selectedBilling?.id || 0}
          onBack={() => setShowPayments(false)}
          onRedirectToBillingDetails={() => setShowPayments(false)}
        />
      </div>
    );
  }

  if (showDocument && selectedBilling) {
    return (
      <DocumentPreviewBilling
        BillingID={billingId || 0}
        onBack={() => setShowDocument(false)}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="flex space-x-4 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (onBackRefresh) {
                await onBackRefresh();
              }
              onBack();
            }}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-medium text-[#04081E]">
            Billing Details
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-end gap-3 ml-auto">
          <Button
            className="rounded-full bg-[#99CC33] text-white font-bold text-base items-center py-2 px-3 md:py-2 md:px-4"
            onClick={handleDocumentPreview}
          >
            Document Preview
          </Button>
          <Button
            className="rounded-full bg-[#99CC33] text-white font-bold text-base items-center py-2 px-3 md:py-2 md:px-4"
            onClick={handleSendToClient}
          >
            Send To Client
          </Button>
        </div>
      </div>
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto">
          <div className="max-w-7xl mx-auto  space-y-3 text-[#393939] text-base/4">
            <p>ID: {selectedBilling?.id ?? "N/A"}</p>
            <hr className="border-[#EBEDF2]" />
            <p>
              Total:{" "}
              {localEstimateData?.totalValue
                ? formatCurrency(localEstimateData.totalValue)
                : "N/A"}
            </p>
            <hr className="border-[#EBEDF2]" />
            <p>Title</p>
            <Input
              value={localEstimateData?.title || ""}
              onChange={(e) => {
                setLocalEstimateData((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                );
              }}
              placeholder="Enter title"
            />
            <hr className="border-[#EBEDF2]" />
            <Label className=" text-[#393939] text-base/4 font-normal block">
              Estimated Time
              <input
                id="Estimated Time"
                value={localEstimateData?.estimatedTime || ""}
                onChange={(e) => {
                  setEstimatedTime(e.target.value);
                  setLocalEstimateData((prev) =>
                    prev ? { ...prev, estimatedTime: e.target.value } : null
                  );
                }}
                placeholder="Enter estimated time"
                className="w-full h-7 pl-2 text-[#A2ADC5] border rounded-md mt-3"
              />
            </Label>
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
                value={localEstimateData?.description || ""}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setLocalEstimateData((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  );
                }}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                rows={6}
                maxLength={10000}
                className="w-full h-28 resize-none text-xs"
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2">
                {localEstimateData?.description?.length || 0}/10000
              </div>
            </div>
            <hr className="border-[#EBEDF2]" />
            <p>State</p>
            <Select
              value={localEstimateData?.state || ""}
              onValueChange={(value) => {
                setStatus(value);
                setLocalEstimateData((prev) =>
                  prev ? { ...prev, state: value } : null
                );
              }}
            >
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
            <p>Percentage Paid: {localEstimateData?.percentagePaid || 0}%</p>
            <Progress value={localEstimateData?.percentagePaid || 0} />
            <hr className="border-[#EBEDF2]" />
            <p>
              Remaining Percentage for paid:{" "}
              {localEstimateData?.remainingPercentage || 0}%
            </p>
            <Progress value={localEstimateData?.remainingPercentage || 0} />
            <hr className="border-[#EBEDF2]" />
            <div className="space-y-2">
              <Label>Associated Lead</Label>
              <MultiSelectBilling
                value={associatedLeads}
                onChange={(value) => {
                  setAssociatedLeads(value);
                  // Tomamos el primer lead seleccionado como el lead principal
                  const primaryLeadId = value[0];
                  setLocalEstimateData((prev) =>
                    prev ? { ...prev, lead_id: primaryLeadId || 0 } : null
                  );
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
                <Card className="w-auto text-center text-base">
                  <CardHeader>
                    <CardTitle className="text-base">Select a lead</CardTitle>
                  </CardHeader>
                </Card>
              )}
            </div>
            <hr className="border-[#EBEDF2]" />
            <div className="space-y-2">
              <Label>Associated Plan</Label>
              <MultiSelectPlan
                plans={plans}
                value={associatedPlan}
                onChange={(value) => {
                  setAssociatedPlan(value);
                  setLocalEstimateData((prev) =>
                    prev ? { ...prev, plan_id: value[0] || 0 } : null
                  );
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
            <p>Service</p>
            <Select
              disabled={true}
              value={servicesID(
                lead.find((lead) => lead.id === associatedLeads[0])?.service
                  ?.id || 0
              )}
            >
              <SelectTrigger className="w-full h-7">
                <SelectValue placeholder="Dropdown here" />
              </SelectTrigger>
              <SelectContent>
                {services.map((serviceOption) => (
                  <SelectItem key={serviceOption} value={serviceOption}>
                    {serviceOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Card className="bg-[#04081E] text-white flex-shrink-0 h-24 w-full items-center ">
              <CardHeader className="flex flex-row items-center justify-between py-5 px-5 h-full">
                <div>
                  <h2 className="text-2xl font-normal">Costs Details</h2>
                  <p className="font-light text-base">
                    Creates extra costs for customer estimates
                  </p>
                </div>
                <Button
                  onClick={openCosts}
                  disabled={isRefreshing || isUpdating}
                  className="[&_svg]:size-9 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0"
                >
                  {isRefreshing ? (
                    <Loader2 className="animate-spin" color="#04081E" />
                  ) : (
                    <Eye color="#04081E" />
                  )}
                </Button>
              </CardHeader>
            </Card>

            {/* Payments Details */}
            {localEstimateData?.state === "ACCEPTED" ||
            localEstimateData?.state === "INVOICE" ||
            localEstimateData?.state === "PAID" ? (
              <Card className="bg-[#04081E] text-white flex-shrink-0 h-24 w-full items-center ">
                <CardHeader className="flex flex-row items-center justify-between py-5 px-5 h-full">
                  <div>
                    <h2 className="text-2xl font-normal">Payments Details</h2>
                    <p className="font-light text-base">Description</p>
                  </div>
                  <Button
                    onClick={() => setShowPayments(true)}
                    className="[&_svg]:size-9 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0"
                  >
                    <Eye color="#04081E" />
                  </Button>
                </CardHeader>
              </Card>
            ) : (
              <></>
            )}
            <Button
              className={
                "rounded-full bg-[#99CC33] text-white font-bold text-base items-center py-2 px-3 md:py-2 md:px-4"
              }
              onClick={UpdateBilling}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Billing"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
