import React from "react";
import type { CreateLeadData } from "@/types/lead-management";
import { LeadManagementService } from "@/services/lead-management-service";
import { UserManagementService } from "@/services/user-management-service";
import { useToast } from "@/hooks/use-toast";
import LeadForm from "@/components/organisms/leads/lead-form";
import type { LeadFormValues } from "@/components/organisms/leads/schemas";

interface CreateLeadFormProps {
  onSuccess?: () => void;
}

export function CreateLeadForm({ onSuccess }: CreateLeadFormProps = {}) {
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
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    state: "SEND" as const,
  };

  const handleCreate = async (values: LeadFormValues) => {
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

      await LeadManagementService.createLead(cleanData);
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

export default CreateLeadForm;
