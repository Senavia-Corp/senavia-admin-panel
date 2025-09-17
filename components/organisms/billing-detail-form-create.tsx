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
import { useToast } from "@/hooks/use-toast";
import { CostDetailFormCreate } from "./cost-detail-form-create";

interface BillingDetailCreateFormProps {
  selectedBilling: (Billings & Partial<Billing>) | null;
  leads: Leads[];
  lead: Lead[];
  plans: Plans[];
  onBack: () => void;
  onSave: (billingData: CreateBillingData) => void;
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
  // Movemos los console.log dentro de un useEffect para que solo se ejecuten una vez al montar el componente
  useEffect(() => {
    console.log("selectedBilling recibido:", selectedBilling);
    console.log("leads recibidos:", leads);
    console.log("lead recibido:", lead);
  }, []);
  const [showDocument, setShowDocument] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ type: '', message: '' });
  const { createBilling, error, successMessage } = BillingViewModel();

  // Estados para campos editables
  const [totalValue, setTotalValue] = useState(selectedBilling?.totalValue?.toString() || "");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [deadlineToPay, setDeadlineToPay] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [associatedLeads, setAssociatedLeads] = useState<number[]>([]);
  const [service, setService] = useState("");
  const [associatedPlan, setAssociatedPlan] = useState("");
  const [showCosts, setShowCosts] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  type ApiResponse = {
    success: boolean;
    data: Billing[];
  } | {
    success: boolean;
    error: string;
  };
  const [newEstimate, setNewEstimate] = useState<Billing | null>(null);
  const [createFisrtCost, setCreateFisrtCost] = useState(false);

  useEffect(() => {
    // Inicializar estados con selectedBilling si existe
    if (selectedBilling) {
      setEstimatedTime(selectedBilling.estimatedTime?.toString() || "");
      setDescription(selectedBilling.description || "");
      setStatus(selectedBilling.state || "");
      setAssociatedLeads(selectedBilling.lead_id ? [selectedBilling.lead_id] : []);
      setService(""); // No hay service en estos datos
    }
  }, [selectedBilling]); // Agregar selectedBilling como dependencia


  const handleDocumentPreview = () => {
    setShowDocument(true);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Retorna "YYYY-MM-DD"
  };

  const isFormValid = () => {
    return (
      estimatedTime !== "" &&
      description !== "" &&
      status !== "" &&
      associatedLeads.length > 0 &&
      associatedPlan !== "" &&
      deadlineToPay !== ""
    );
  };

    const handleCreateBilling = async () => {
      setIsCreating(true);
      try {
        const billingData: CreateBillingData = {
          totalValue: 0,
          estimatedTime: estimatedTime,
          description: description,
          state: status,
          lead_id: associatedLeads[0] || 0,
          plan_id: Number(associatedPlan),
          deadLineToPay: deadlineToPay,
          invoiceDateCreated: status === "INVOICE" ? getTodayDate() : "",
          invoiceReference: invoiceReference
        };
        const response = await createBilling(billingData) as ApiResponse;
        
        if (response.success && 'data' in response && response.data.length > 0) {
          const newBilling = response.data[0];
          setNewEstimate(newBilling);
          toast({
            title: 'Billing created successfully',
            description: 'The billing has been created successfully.'
          });
          if (newBilling && newBilling.id) {
            setCreateFisrtCost(true);
            console.log('Created billing with ID:', newBilling.id);
          }
        } else if ('error' in response) {
          toast({
            title: 'Failed to create billing',
            description: response.error || 'The billing has not been created.'
          });
        }
      } catch (error) {
        console.error('An error has occurred:', error);
        toast({
          title: 'Failed to create billing',
          description: error instanceof Error ? error.message : 'The billing has not been created.'
        });
      } finally {
        setIsCreating(false);
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

  if (createFisrtCost) {
    return (
      <div className="">
          <CostDetailFormCreate 
            estimateId={newEstimate?.id || 0} 
            onBack={() => setCreateFisrtCost(false)} 
            onCreateSuccess={() => { setCreateFisrtCost(false); onBack?.(); }} 
            fisrtCost={true} 
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
              <p>
                Estimated Time:
              </p>
              <Input
                type="text"
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
            </div>
            <hr className="border-[#EBEDF2]" />
            <p>
              Associated Plan ID
              <Select value={associatedPlan} onValueChange={setAssociatedPlan}>
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
                disabled={!isFormValid() || isCreating}>
              {isCreating ? 'Creating...' : 'Create Billing'}
            </Button>
          </div>
        </div>
      </div>
      <CardMokcup
        type={popupMessage.type === 'success' ? 'success' : 'error'}
        message={popupMessage.message}
        isOpen={showPopup}
      />
    </div>
  );
}
