import React from "react";
import type { CreateLeadData } from "@/types/lead-management";
import { LeadManagementService } from "@/services/lead-management-service";
import { useToast } from "@/hooks/use-toast";
import LeadForm from "@/components/organisms/leads/lead-form";

interface CreateLeadFormProps {
  onSuccess?: () => void;
}

export function CreateLeadForm({ onSuccess }: CreateLeadFormProps = {}) {
  const { toast } = useToast();

  const initialValues: Partial<CreateLeadData> = {
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    serviceId: undefined,
    userId: undefined,
    workTeamId: undefined,
    state: "SEND",
  };

  const handleCreate = async (data: CreateLeadData) => {
    try {
      await LeadManagementService.createLead(data);
      toast({
        title: "Success",
        description: "Lead created successfully!",
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating lead:", error);
      toast({
        title: "Error",
        description:
          error?.message || "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px] bg-white `}
    >
      <LeadForm
        mode="create"
        initialValues={initialValues}
        onSubmit={handleCreate}
        submitLabel="Create Lead"
      />
    </div>
  );
}

export default CreateLeadForm;
