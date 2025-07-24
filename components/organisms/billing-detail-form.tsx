import { ArrowLeft } from "lucide-react";
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

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
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
      <div className="bg-black rounded-lg p-5 sm:p-6 flex-1">
        <div className="bg-white rounded-lg p-6 sm:p-10 lg:p-12 mx-auto">
          <div className="max-w-4xl mx-auto  space-y-3 text-[#393939] text-base/4">
            <p>ID: {billing?.id ?? "N/A"}</p>
            <hr className="border-[#EBEDF2]" />
            <p>
              Total:{" "}
              {billing?.totalValue ? formatCurrency(billing.totalValue) : "N/A"}
            </p>
            <hr className="border-[#EBEDF2]" />
            <Label className=" font-normal block">
              Estimated Time
              <input
                id="Estimated Time"
                value={billing?.estimatedTime}
                placeholder={billing?.estimatedTime.toString()}
                className="w-full h-7 pl-2 text-[#A2ADC5] border rounded-md"
              />
            </Label>
            <hr className="border-[#EBEDF2]" />
            <Label htmlFor="description" className=" font-normal mb-3 block">
              Description
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                value={billing?.description ?? "N/A"}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                rows={6}
                maxLength={200}
                className="w-full h-28 resize-none "
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2">
                {billing?.description.length}/200
              </div>
            </div>
            <hr className="border-[#EBEDF2]" />
            <p>State</p>
            <Select value={billing?.status}>
              <SelectTrigger className="w-full h-7 ">
                <SelectValue placeholder="Dropdown here" />
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
            <hr className="border-[#EBEDF2]" />
            <p>Associated Lead
              <Select value={billing?.associatedLead}>
                <SelectTrigger className="w-full h-7 ">
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
            <Select value={billing?.service}>
              <SelectTrigger className="w-full h-7 ">
                <SelectValue placeholder="Dropdown here" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
