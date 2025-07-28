"use client";

import { useState, useEffect } from "react";
import { ContractsTable } from "@/components/organisms/contracts-table";
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

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">
              Contract Management
            </h1>

            <div className="flex-1 min-h-0">
              <ContractsTable
                contracts={contracts}
                onAddContract={handleCreateContract}
                onViewContract={handleViewContract}
                onDeleteContract={setContractToDelete}
                onSearch={setSearchTerm}
                onStatusFilter={setStatusFilter}
              />
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
