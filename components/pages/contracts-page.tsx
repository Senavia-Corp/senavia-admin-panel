"use client";

import { useState, useEffect } from "react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { ContractManagementService } from "@/services/contract-management-service";
import type { Contract } from "@/types/contract-management";
import { DetailTabs } from "../molecules/detail-tabs";
import { ContractDetails } from "../organisms/contracs/contract-details";
import EditContractForm from "../organisms/contracs/edit-contract-form";
import { CreateContractForm } from "../organisms/contracs/create-contract-form";
import { useToast } from "@/hooks/use-toast";
import { ContractTableRowSkeleton } from "../atoms/contract-table-row-skeleton";

export function ContractsPage() {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [showEditPage, setShowEditPage] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadContracts();
  }, [searchTerm, statusFilter]);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const contractsData = await ContractManagementService.getContracts();
      setContracts(contractsData);
    } catch (error) {
      console.error("Error loading contracts:", error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to load contracts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContract = async (contract: Contract) => {
    try {
      await ContractManagementService.deleteContract(String(contract.id));
      setContractToDelete(null);
      loadContracts();
      toast({ title: "Success", description: "Contract deleted successfully" });
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast({
        title: "Error",
        description: "Failed to delete contract. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleCreateContract = () => {
    setShowCreatePage(true);
  };

  const handleFormSuccess = () => {
    // Navigate back to the contracts list
    setShowCreatePage(false);
    setShowEditPage(false);
    setSelectedContract(null);
    // Reload contracts to ensure data is up to date
    loadContracts();
  };

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":");
    if (type === "status") {
      setStatusFilter(value === "all" ? "" : value);
    }
  };

  if (showCreatePage) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="Create Contract"
            onBack={() => setShowCreatePage(false)}
          >
            <CreateContractForm onSuccess={handleFormSuccess} />
          </DetailTabs>
        </div>
      </div>
    );
  }

  if (selectedContract && !showEditPage) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="Contract Details"
            onBack={() => setSelectedContract(null)}
          >
            <ContractDetails contract={selectedContract} />
          </DetailTabs>
        </div>
      </div>
    );
  }

  if (showEditPage) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="Edit Contract"
            onBack={() => {
              setShowEditPage(false);
              setSelectedContract(null);
            }}
          >
            {selectedContract && (
              <EditContractForm
                contract={selectedContract}
                onSuccess={handleFormSuccess}
              />
            )}
          </DetailTabs>
        </div>
      </div>
    );
  }

  // Handlers for GeneralTable
  const handlers = {
    onCreate: handleCreateContract,
    onView: handleViewContract,
    onEdit: (contract: Contract) => {
      setSelectedContract(contract);
      setShowEditPage(true);
    },
    onDelete: setContractToDelete,
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="flex items-center mb-6 flex-shrink-0">
              <div className="w-1 h-[36px] bg-[#99CC33] mr-3" />
              <h1 className="font-sans font-medium text-[25px] leading-none tracking-normal align-middle text-gray-900">
                Contract Management
              </h1>
            </div>

            <div className="flex-1 min-h-0">
              {GeneralTable(
                "contracts-page",
                "Add Contract",
                "Create new contracts and agreements with clients",
                "All Contracts",
                "View and manage all contracts in the system",
                ["Contract ID", "Title", "Client", "Status", "Actions"],
                contracts,
                handlers,
                {
                  isLoading,
                  hasError,
                  onRetry: loadContracts,
                  emptyStateTitle: "No contracts registered",
                  emptyStateDescription:
                    "No contracts have been created in the system yet. Click the '+' button to create the first contract.",
                  skeletonComponent: ContractTableRowSkeleton,
                  skeletonCount: 5,
                }
              )}
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmDialog
        open={!!contractToDelete}
        onClose={() => setContractToDelete(null)}
        onConfirm={() =>
          contractToDelete && handleDeleteContract(contractToDelete)
        }
        title="Delete Contract"
        description={`Are you sure you want to delete the contract "${contractToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
