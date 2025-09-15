import { ArrowLeft, Eye } from "lucide-react";
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
import { Card, CardHeader } from "../ui/card";
import { DocumentPreviewBilling } from "./document-preview-billing";
import { Billings, Billing } from "@/types/billing-management";
import { Leads, Lead } from "@/types/lead-management";
import { Input } from "../ui/input";
import { Plans } from "@/types/plan";
import { CostPage } from "@/components/pages/cost-page";
import { BillingViewModel } from "@/components/pages/billing/BillingViewModel";
import { BillingStatus, CreateBillingData } from "@/types/billing-management";
import { useToast } from "@/hooks/use-toast";

interface BillingDetailFormProps {
  selectedBilling: (Billings & Partial<Billing>) | null;
  billingId: number;
  leads: Leads[];
  lead: Lead[];
  plans: Plans[];
  onBack: () => void;
  onSave: () => void;
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
}: BillingDetailFormProps) {
  console.log("selectedBilling recibido:", selectedBilling);
  console.log("billingId recibido:", billingId);
  console.log("leads recibidos:", leads);
  console.log("lead recibido:", lead);
  const [showDocument, setShowDocument] = useState(false);
  const [showCosts, setShowCosts] = useState(false);
  const { PatchBilling } = BillingViewModel();
  const [estimatedTime, setEstimatedTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [associatedLead, setAssociatedLead] = useState("");
  const [service, setService] = useState("");
  const [associatedPlan, setAssociatedPlan] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [localEstimateData, setLocalEstimateData] = useState<CreateBillingData | null>(null);
  const{toast} = useToast();

  useEffect(() => {
    // Inicializar estados con selectedBilling si existe
    if (selectedBilling) {
      setEstimatedTime(selectedBilling.estimatedTime?.toString() || "");
      setDescription(selectedBilling.description || "");
      setStatus(selectedBilling.state || "");
      setAssociatedLead(selectedBilling.lead_id?.toString() || "");
      setAssociatedPlan(selectedBilling.plan_id?.toString() || "");
      setService(""); // No hay service en estos datos
    }

    setLocalEstimateData({
      totalValue: Number(selectedBilling?.totalValue) || 0, 
      estimatedTime: selectedBilling?.estimatedTime?.toString() || "",
      description: selectedBilling?.description || "",
      state: selectedBilling?.state || "",
      lead_id: selectedBilling?.lead_id || 0,
      plan_id: selectedBilling?.plan_id || 0,
      deadLineToPay: selectedBilling?.deadLineToPay || "",
      invoiceDateCreated: selectedBilling?.invoiceDateCreated || "",
      invoiceReference: selectedBilling?.invoiceReference || "",
    });
  }, []);

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
    return today.toISOString().split('T')[0]; // Retorna "YYYY-MM-DD"
  };

  const UpdateBilling = async () => {
    try {
      setIsUpdating(true);
      const ID_estimate = selectedBilling?.id || 0;
      const billingData: CreateBillingData = {
        ...localEstimateData!,
        state: status,
        totalValue: localEstimateData?.totalValue || 0,
        deadLineToPay: status === "INVOICE" ? getTodayDate() : "",
        invoiceDateCreated: status === "INVOICE" ? getTodayDate() : "",
        invoiceReference: "INV-2025-0456",
      };
      await PatchBilling(ID_estimate, billingData);
      setLocalEstimateData(billingData);
      toast({
        title: 'Billing updated successfully',
        description: 'The billing has been updated successfully.'
      });
    } catch (error) {
      console.log('An error has occured ' + error);
      toast({
        title: 'Failed to update billing',
        description: 'The billing has not been updated.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (showCosts) {
    return (
      <div className="">
      <CostPage
        costs={selectedBilling?.costs || []}
        estimateId={selectedBilling?.id || 0}
        onBack={() => setShowCosts(false)}
      />
      </div>
    );
  }

  // if (showDocument && selectedBilling) {
  //   return <DocumentPreviewBilling {...selectedBilling} onBack={() => setShowDocument(false)} />
  // }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-medium text-[#04081E]">
            Billing Details
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
            <p>ID: {selectedBilling?.id ?? "N/A"}</p>
            <hr className="border-[#EBEDF2]" />
            <p>
              Total:{" "}
              {localEstimateData?.totalValue
                ? formatCurrency(localEstimateData.totalValue)
                : "N/A"}
            </p>
            <hr className="border-[#EBEDF2]" />
            <Label className=" text-[#393939] text-base/4 font-normal block">
              Estimated Time
              <input
                id="Estimated Time"
                value={localEstimateData?.estimatedTime || ""}
                onChange={(e) => {
                  setEstimatedTime(e.target.value);
                  setLocalEstimateData(prev => prev ? {...prev, estimatedTime: e.target.value} : null);
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
                  setLocalEstimateData(prev => prev ? {...prev, description: e.target.value} : null);
                }}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                rows={6}
                maxLength={200}
                className="w-full h-28 resize-none text-xs"
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2">
                {localEstimateData?.description?.length || 0}/200
              </div>
            </div>
            <hr className="border-[#EBEDF2]" />
            <p>State</p>
            <Select value={localEstimateData?.state || ""} onValueChange={(value) => {
                  setStatus(value);
                  setLocalEstimateData(prev => prev ? {...prev, state: value} : null);
                }}>
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
            <p>
              Associated Lead
              <Select value={localEstimateData?.lead_id?.toString() || ""} onValueChange={(value) => {
                  setAssociatedLead(value);
                  setLocalEstimateData(prev => prev ? {...prev, lead_id: Number(value)} : null);
                }}>
                <SelectTrigger className="w-full h-7 mt-3">
                  <SelectValue placeholder="Dropdown here" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id.toString()}>
                      {lead.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </p>
            <hr className="border-[#EBEDF2]" />
            <p>
              Associated Plan ID
              <Select value={localEstimateData?.plan_id?.toString() || ""} onValueChange={(value) => {
                  setAssociatedPlan(value);
                  setLocalEstimateData(prev => prev ? {...prev, plan_id: Number(value)} : null);
                }}>
                <SelectTrigger className="w-full h-7 mt-3">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans?.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      Plan ID: {plan.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </p>
            <hr className="border-[#EBEDF2]" />
            <p>service</p>
            <Select
              disabled={true}
              value={servicesID(localEstimateData?.lead_id || 0)}
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
                  <p className="font-light text-base">Description</p>
                </div>
                <Button
                  onClick={() => setShowCosts(true)}
                  className="[&_svg]:size-9 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0"
                >
                  <Eye color="#04081E" />
                </Button>
              </CardHeader>
            </Card>
            <Button 
                className={'rounded-full text-3xl items-center py-2 px-4 bg-[#99CC33] text-white hover:bg-[#99CC33]/80'}
                onClick={UpdateBilling}
                disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Billing'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
