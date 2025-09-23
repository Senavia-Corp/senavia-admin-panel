import React from "react";
import type { Lead, CreateLeadData } from "@/types/lead-management";
import { LeadManagementService } from "@/services/lead-management-service";
import { useToast } from "@/hooks/use-toast";
import LeadForm from "@/components/organisms/leads/lead-form";

interface EditLeadFormProps {
  lead: Lead;
  onSuccess?: () => void;
}

export function EditLeadForm({ lead, onSuccess }: EditLeadFormProps) {
  const { toast } = useToast();

  const initialValues = {
    clientName: lead.clientName || "",
    clientEmail: lead.clientEmail || "",
    clientPhone: lead.clientPhone || "",
    clientAddress: lead.clientAddress || "",
    description: lead.description || "",
    startDate: lead.startDate || new Date().toISOString().split("T")[0],
    endDate: lead.endDate || "",
    serviceId: lead.serviceId,
    userId: lead.userId,
    workTeamId: lead.workTeamId,
    state: lead.state,
  } as const;

  const handleUpdate = async (values: CreateLeadData) => {
    try {
      await LeadManagementService.updateLead(lead.id, values);
      toast({
        title: "Success",
        description: "Lead updated successfully!",
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px] bg-white `}
    >
      <LeadForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />
    </div>
  );
}

export default EditLeadForm;
