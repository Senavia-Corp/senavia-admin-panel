import React from "react";
import type { Lead, CreateLeadData } from "@/types/lead-management";
import { LeadManagementService } from "@/services/lead-management-service";
import { UserManagementService } from "@/services/user-management-service";
import { useToast } from "@/hooks/use-toast";
import LeadForm from "@/components/organisms/leads/lead-form";
import type { LeadFormValues } from "@/components/organisms/leads/schemas";

interface EditLeadFormProps {
  lead: Lead;
  onSuccess?: () => void;
}

export function EditLeadForm({ lead, onSuccess }: EditLeadFormProps) {
  const { toast } = useToast();

  const loadUserOptions = async () => {
    const fetched = await UserManagementService.getUsers();
    return fetched.map((u: any) => ({
      id: parseInt(u.id),
      name: u.name,
      subtitle: u.email,
      phone: u.phone,
      address: u.address,
    }));
  };

  const loadServiceOptions = async () => {
    const fetched = await LeadManagementService.getServices();
    return fetched.map((s: any) => ({
      id: s.id,
      name: s.name,
      subtitle: s.description,
    }));
  };

  const initialValues = {
    id: lead.id,
    clientName: lead.clientName || "",
    clientEmail: lead.clientEmail || "",
    clientPhone: lead.clientPhone || "",
    clientAddress: lead.clientAddress || "",
    description: lead.description || "",
    startDate: lead.startDate || new Date().toISOString().split("T")[0],
    endDate: lead.endDate || "",
    serviceId: lead.service?.id,
    userId: lead.user?.id,
    state: lead.state,
  };

  const handleUpdate = async (values: LeadFormValues) => {
    try {
      const cleanData: CreateLeadData = {
        clientName: values.clientName.trim(),
        clientEmail: values.clientEmail.trim(),
        clientPhone: values.clientPhone.trim(),
        clientAddress: values.clientAddress.trim(),
        description: values.description.trim(),
        startDate: values.startDate.trim(),
        endDate: values.endDate?.trim() || "",
        serviceId: values.serviceId,
        userId: values.userId,
        state: values.state,
      };

      await LeadManagementService.updateLead(lead.id, cleanData);
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

  console.log(initialValues);

  return (
    <div
      className={`w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px] bg-white `}
    >
      <LeadForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
        onDirtyChange={() => {}}
        userOptions={[]}
        isUsersLoading={false}
        usersError={null}
        serviceOptions={[]}
        isServicesLoading={false}
        servicesError={null}
        userLoadOptions={loadUserOptions}
        serviceLoadOptions={loadServiceOptions}
      />
    </div>
  );
}

export default EditLeadForm;
