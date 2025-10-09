"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Clause } from "@/types/contract-management";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { useToast } from "@/hooks/use-toast";
import { TableRowSkeleton } from "@/components/atoms/table-row-skeleton";
import { DetailTabs } from "@/components/molecules/detail-tabs";
import { ContractClausesForm } from "@/components/organisms/contracs/contract-clauses-management/contract-clauses-form";
import ClauseViewModel from "@/components/pages/clause/ClauseViewModel";

interface ContractClausesProps {
  contractId: number;
  onBackToContract?: () => void;
}

export function ContractClauses({ contractId, onBackToContract }: ContractClausesProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clauseToDelete, setClauseToDelete] = useState<Clause | null>(null);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [showEditorForm, setShowEditorForm] = useState(false);
  // ViewModel (sin paginación en esta vista)
  const { clauses, loading, getClausesByContract, unlinkClauseFromContract } = ClauseViewModel({
    isPaginated: false, autoFetch: false
  });

  // Campos de búsqueda para clauses (coinciden con clause-page)
  const SEARCHABLE_FIELDS = ["title", "description"] as const;

  useEffect(() => {
    getClausesByContract(contractId);
  }, [contractId]);

  const handleCreateClause = () => {
    setSelectedClause(null);
    setShowEditorForm(true);
  };

  const handleViewClause = (clause: Clause) => {
    setSelectedClause(clause);
    setShowEditorForm(true);
  };

  const handleEditClause = (clause: Clause) => {
    setSelectedClause(clause);
    setShowEditorForm(true);
  };

  const handleDeleteClause = async (clause: Clause) => {
    const ok = await unlinkClauseFromContract(contractId, clause.id);
    if (ok) {
      setClauseToDelete(null);
      toast({ title: "Success", description: "Clause removed from contract" });
      await getClausesByContract(contractId);
    } else {
      toast({
        title: "Error",
        description:
          "The clause could not be removed from this contract.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = () => { };

  const handleBackToList = () => {
    setSelectedClause(null);
    setShowEditorForm(false);
  };

  const handleSaveSuccess = () => {
    setSelectedClause(null);
    setShowEditorForm(false);
    getClausesByContract(contractId);
  };

  const handlers = {
    onCreate: handleCreateClause,
    onView: handleViewClause,
    onEdit: handleEditClause,
    onDelete: (clause: Clause) => setClauseToDelete(clause),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  // Filtrado local (sin estado adicional para evitar bucles)
  const filteredClauses = clauses.filter((clause) => {
    const lowerSearch = searchTerm.toLowerCase();
    if (!searchTerm) return true;
    return SEARCHABLE_FIELDS.some((field) =>
      String((clause as any)[field] ?? "")
        .toLowerCase()
        .includes(lowerSearch)
    );
  });

  // Show create form
  if (showEditorForm && !selectedClause) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="Create Clause"
            onBack={() => setShowEditorForm(false)}
          >
            <ContractClausesForm contractId={contractId} onSuccess={handleSaveSuccess} />
          </DetailTabs>
        </div>
      </div>
    );
  }

  // Show edit form
  if (showEditorForm && selectedClause) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs title="Edit Clause" onBack={handleBackToList}>
            <ContractClausesForm
              clause={selectedClause}
              onSuccess={handleSaveSuccess}
            />
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
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center">
                <div className="w-1 h-[36px] bg-[#99CC33] mr-3" />
                <h1 className="font-sans font-medium text-[25px] leading-none tracking-normal align-middle text-gray-900">
                  Contract Clauses Management
                </h1>
              </div>
              {onBackToContract && (
                <button
                  onClick={onBackToContract}
                  className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4 hover:bg-[#8bb82e] transition-colors"
                >
                  Back to Contract
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "clause-page",
                "Add Clause",
                "Create new contract clauses and terms",
                "Contract Clauses",
                "View and manage clauses linked to this contract",
                ["Clause ID", "Title", "Description", "Actions"],
                filteredClauses,
                handlers,
                {
                  isLoading: loading,
                  skeletonComponent: () => (
                    <TableRowSkeleton columns={3} actions={3} />
                  ),
                  skeletonCount: 5,
                }
              )}
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmDialog
        open={!!clauseToDelete}
        onClose={() => setClauseToDelete(null)}
        onConfirm={() => clauseToDelete && handleDeleteClause(clauseToDelete)}
        title="Remove Clause from Contract"
        description={`Are you sure you want to remove "${clauseToDelete?.title}" from this contract?`}
      />
    </div>
  );
}
