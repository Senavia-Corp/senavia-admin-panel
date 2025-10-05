import React from "react";
import type {
  Contract,
  ContractStatus,
  CreateContractFormValues,
  CreateContractData,
} from "@/types/contract-management";
import { ContractManagementService } from "@/services/contract-management-service";
import { useToast } from "@/hooks/use-toast";
import ContractForm from "@/components/organisms/contracs/contract-form";
import { UserManagementService } from "@/services/user-management-service";
import { LeadManagementService } from "@/services/lead-management-service";

interface CreateContractFormProps {
  onSuccess?: () => void;
}

export function CreateContractForm({
  onSuccess,
}: CreateContractFormProps = {}) {
  const { toast } = useToast();
  // Dropdown data will be lazy-loaded by GenericDropdown via loadOptions
  const contractStatuses = ContractManagementService.getContractStatuses();

  const initialValues: CreateContractFormValues = {
    title: "",
    content: "",
    state: undefined as unknown as ContractStatus,
    clauses: [],
    signedDate: "",
    userId: undefined as unknown as number,
    leadId: undefined as unknown as number | null,
    companyEmail: "",
    companyAdd: "",
    companyPhone: "",
    ownerName: "Sebastian Navia",
    ownerSignDate: "",
    recipientName: "",
    recipientSignDate: "",
  };

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

  const loadLeadOptions = async () => {
    const fetched = await LeadManagementService.getLeads();
    return fetched.map((l: any) => ({
      id: l.id,
      name: l.clientName,
      subtitle: l.description,
      address: l.clientAddress,
      phone: l.clientPhone,
      email: l.clientEmail,
    }));
  };

  const handleCreate = async (data: CreateContractData) => {
    try {
      await ContractManagementService.createContract(data);
      toast({
        title: "Success",
        description: "Contract created successfully!",
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating contract:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create contract. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full border-[20px] border-[#04081E] rounded-lg bg-white">
      <ContractForm
        mode="create"
        initialValues={initialValues}
        onSubmit={handleCreate}
        submitLabel="Create Contract"
        onDirtyChange={() => {}}
        userOptions={[]}
        leadOptions={[]}
        isUsersLoading={false}
        isLeadsLoading={false}
        usersError={null}
        leadsError={null}
        contractStatuses={contractStatuses}
        userLoadOptions={loadUserOptions}
        leadLoadOptions={loadLeadOptions}
      />
    </div>
  );
}
