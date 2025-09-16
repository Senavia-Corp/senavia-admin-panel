import React, { useState } from "react";
import type {
  Contract,
  CreateContractFormValues,
  CreateContractData,
} from "@/types/contract-management";
import { ContractManagementService } from "@/services/contract-management-service";
import { useToast } from "@/hooks/use-toast";
import ContractForm from "@/components/organisms/contracs/contract-form";
import { UserManagementService } from "@/services/user-management-service";
import { LeadManagementService } from "@/services/lead-management-service";

interface EditContractFormProps {
  contract: Contract;
  onUpdated?: (contract: Contract) => void;
}

export function EditContractForm({
  contract,
  onUpdated,
}: EditContractFormProps) {
  const { toast } = useToast();
  // Dropdown data will be lazy-loaded by GenericDropdown via loadOptions
  const contractStatuses = ContractManagementService.getContractStatuses();
  const [isDirty, setIsDirty] = useState(false);

  const initialValues: CreateContractFormValues = {
    title: contract.title,
    content: contract.content,
    status: contract.status,
    clauses: contract.clauses?.map((c) => c.id) ?? [],
    deadlineToSign: contract.deadlineToSign,
    userId: contract.userId,
    leadId: contract.leadId,
    clientEmail: contract.clientEmail,
    clientAddress: contract.clientAddress,
    clientPhone: contract.clientPhone,
    ownerName: contract.ownerName,
    ownerSignDate: contract.ownerSignDate,
    clientName: contract.clientName,
    clientSignDate: contract.clientSignDate,
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
    }));
  };

  const handleUpdate = async (values: CreateContractData) => {
    try {
      // Map back to Partial<Contract>; clauses will be mapped by service if needed
      const updated = await ContractManagementService.updateContract(
        contract.id,
        values as unknown as Partial<Contract>
      );
      if (!updated) throw new Error("Contract not found");
      onUpdated?.(updated);
      toast({
        title: "Success",
        description: "Contract updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update contract",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px] bg-white `}
    >
      <ContractForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitLabel={isDirty ? "Save Changes" : "Save Changes"}
        onDirtyChange={setIsDirty}
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

export default EditContractForm;
