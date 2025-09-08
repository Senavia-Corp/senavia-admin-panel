"use client";

import { useState, useEffect } from "react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { ContractManagementService } from "@/services/contract-management-service";
import type { Contract } from "@/types/contract-management";
import { DetailTabs } from "../molecules/detail-tabs";
import { ContractDetails } from "../organisms/contracs/contract-details";

export function ContractsPage() {
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

  useEffect(() => {
    loadContracts();
  }, [searchTerm, statusFilter]);

  const loadContracts = async () => {
    try {
      const contractsData = await ContractManagementService.getContracts(
        searchTerm,
        statusFilter
      );
      setContracts(contractsData);
    } catch (error) {
      console.error("Error loading contracts:", error);
    }
  };

  const handleDeleteContract = async (contract: Contract) => {
    try {
      await ContractManagementService.deleteContract(contract.id);
      setContractToDelete(null);
      loadContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleCreateContract = () => {
    console.log("Create new contract");
    // TODO: Implement contract creation
  };

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":");
    if (type === "status") {
      setStatusFilter(value === "all" ? "" : value);
    }
  };

  if (selectedContract) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="Contract Details"
            onBack={() => setSelectedContract(null)}
          >
            <ContractDetails />
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
            onBack={() => setShowEditPage(false)}
          >
            <ContractDetails />
          </DetailTabs>
        </div>
      </div>
    );
  }

  // Handlers for GeneralTable
  const handlers = {
    onCreate: handleCreateContract,
    onView: handleViewContract,
    onEdit: () => setShowEditPage(true),
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
                [
                  "Contract ID",
                  "Title",
                  "Client",
                  "Status",
                  "Value",
                  "Actions",
                ],
                contracts,
                handlers
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
