import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { BillingRecord } from "@/types/billing-management";
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

interface BillingDetailFormProps {
  billingId?: string;
  onBack: () => void;
  onSave: () => void;
}

export function BillingDetailForm({
  billingId,
  onBack,
  onSave,
}: BillingDetailFormProps) {
  const [billing, setBilling] = useState<BillingRecord | null>(null);
  const [totalLeads, setTotalLeads] = useState<string[]>([]);
  const [showDocument, setShowDocument] = useState(false);
  
  // Estados para campos editables
  const [estimatedTime, setEstimatedTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [associatedLead, setAssociatedLead] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    if (billingId) {
      loadBilling(billingId);
    }
    loadLeads();
  }, [billingId]);

  const loadLeads = async () => {
    try {
      const records = await BillingManagementService.getBillingRecords();
      const leads = records.map(record => record.associatedLead);
      setTotalLeads(leads);
    } catch (error) {
      console.error("Error loading leads:", error);
    }
  };

  const loadBilling = async (id: string) => {
    try {
      const billingData = await BillingManagementService.getBillingRecordById(
        id
      );
      setBilling(billingData);
      // Inicializar estados con los datos cargados
      if (billingData) {
        setEstimatedTime(billingData.estimatedTime.toString());
        setDescription(billingData.description);
        setStatus(billingData.status);
        setAssociatedLead(billingData.associatedLead);
        setService(billingData.service);
      }
    } catch (error) {
      console.error("Error loading billing record:", error);
      setBilling(null);
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
  }

  const statuses: BillingStatus[] = [
    "Created",
    "Processing",
    "InReview",
    "Rejected",
    "Accepted",
    "Invoice",
    "Paid",
  ];

  const services: string[] = ["Web Development", "Graphic Design", "Web Design"];

  if (showDocument && billing) {
    return <DocumentPreviewBilling {...billing} onBack={() => setShowDocument(false)} />
  }

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
          <h1 className="text-4xl font-medium text-[#04081E]">Billing Details</h1>
        </div>
        <Button className="rounded-full bg-[#99CC33] text-white font-bold text-base items-center py-2 px-4" onClick={handleDocumentPreview}>Document Preview</Button>
      </div>
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto">
          <div className="max-w-7xl mx-auto  space-y-3 text-[#393939] text-base/4">
            <p>ID: {billing?.id ?? "N/A"}</p>
            <hr className="border-[#EBEDF2]" />
            <p>
              Total:{" "}
              {billing?.totalValue ? formatCurrency(billing.totalValue) : "N/A"}
            </p>
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
                   {totalLeads.map((lead) => (
                     <SelectItem key={lead} value={lead}>
                       {lead}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </p>
             <hr className="border-[#EBEDF2]" />
             <p>service</p>
             <Select value={service} onValueChange={setService}>
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
                  className="[&_svg]:size-9 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0"
                >
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
