import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { BillingManagementService } from "@/services/billing-management-service";
import { Textarea } from "../ui/textarea";
import { BillingStatus } from "@/types/billing-management";
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

interface BillingDetailFormProps {
  selectedBilling: (Billings & Partial<Billing>) | null;
  billingId: number;
  leads: Leads[];
  lead: Lead[];
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
  onBack,
  onSave,
}: BillingDetailFormProps) {
  console.log("selectedBilling recibido:", selectedBilling);
  console.log("billingId recibido:", billingId);
  console.log("leads recibidos:", leads);
  console.log("lead recibido:", lead);
  const [showDocument, setShowDocument] = useState(false);

  // Estados para campos editables
  const [estimatedTime, setEstimatedTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [associatedLead, setAssociatedLead] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    // Inicializar estados con selectedBilling si existe
    if (selectedBilling) {
      setEstimatedTime(selectedBilling.estimatedTime?.toString() || "");
      setDescription(selectedBilling.description || "");
      setStatus(selectedBilling.state || "");
      setAssociatedLead(selectedBilling.lead_id?.toString() || "");
      setService(""); // No hay service en estos datos
    }
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
              {selectedBilling?.totalValue
                ? formatCurrency(parseFloat(selectedBilling.totalValue))
                : "N/A"}
            </p>
            <hr className="border-[#EBEDF2]" />
            <hr className="border-[#EBEDF2]" />
            <Label className=" text-[#393939] text-base/4 font-normal block">
              Estimated Time
              <input
                id="Estimated Time"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                rows={6}
                maxLength={200}
                className="w-full h-28 resize-none text-xs"
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2">
                {description.length}/200
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
            <p>
              Associated Lead
              <Select value={associatedLead} onValueChange={setAssociatedLead}>
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
            <p>service</p>
            <Select
              value={servicesID(lead[0]?.serviceId || 0)}
              onValueChange={setService}
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
                <Button className="[&_svg]:size-9 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0">
                  <Eye color="#04081E" />
                </Button>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
