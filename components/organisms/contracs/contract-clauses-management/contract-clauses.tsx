"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Clause } from "@/types/contract-management";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { useToast } from "@/hooks/use-toast";
import { TableRowSkeleton } from "@/components/atoms/table-row-skeleton";
import { DetailTabs } from "@/components/molecules/detail-tabs";
import { ContractClausesForm } from "@/components/organisms/contracs/contract-clauses-management/contract-clauses-form";

export function ContractClauses() {
  const { toast } = useToast();
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [filteredClauses, setFilteredClauses] = useState<Clause[]>([]);
  const [clauseToDelete, setClauseToDelete] = useState<Clause | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [showEditorForm, setShowEditorForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Campos de búsqueda para clauses
  const SEARCHABLE_FIELDS = ["title", "description"] as const;

  useEffect(() => {
    loadClauses();
  }, []);

  const loadClauses = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      // TODO: Replace with actual service call
      // const clausesData = await ClauseManagementService.getClauses();
      // setClauses(clausesData);
      // setFilteredClauses(clausesData);

      // Temporary mock data
      setClauses([]);
      setFilteredClauses([]);
    } catch (error) {
      console.error("Error loading clauses:", error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to load clauses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    try {
      // TODO: Replace with actual service call
      // await ClauseManagementService.deleteClause(clause.id);
      setClauseToDelete(null);
      loadClauses();
      toast({ title: "Success", description: "Clause deleted successfully" });
    } catch (error) {
      console.error("Error deleting clause:", error);
      toast({
        title: "Error",
        description: "Failed to delete clause. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":");
    if (type === "status") {
      setStatusFilter(value === "all" ? "" : value);
    }
  };

  const handleBackToList = () => {
    setSelectedClause(null);
    setShowEditorForm(false);
  };

  const handleSaveSuccess = () => {
    setSelectedClause(null);
    setShowEditorForm(false);
    loadClauses();
  };

  const handlers = {
    onCreate: handleCreateClause,
    onView: handleViewClause,
    onEdit: handleEditClause,
    onDelete: (clause: Clause) => setClauseToDelete(clause),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  // Local filtering like contracts page
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = clauses.filter((clause) => {
      const matchesSearch = !searchTerm
        ? true
        : SEARCHABLE_FIELDS.some((field) =>
            String(clause[field] ?? "")
              .toLowerCase()
              .includes(lowerSearch)
          );
      const matchesStatus = !statusFilter || clause.state === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredClauses(filtered);
  }, [clauses, searchTerm, statusFilter]);

  // Show create form
  if (showEditorForm && !selectedClause) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="Create Clause"
            onBack={() => setShowEditorForm(false)}
          >
            <ContractClausesForm onSuccess={handleSaveSuccess} />
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
            <div className="flex items-center mb-6 flex-shrink-0">
              <div className="w-1 h-[36px] bg-[#99CC33] mr-3" />
              <h1 className="font-sans font-medium text-[25px] leading-none tracking-normal align-middle text-gray-900">
                Contract Clauses Management
              </h1>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "contract-clauses-page",
                "Add Clause",
                "Create new contract clauses and terms",
                "All Clauses",
                "View and manage all contract clauses in the system",
                ["Clause ID", "Title", "Description", "Actions"],
                filteredClauses,
                handlers,
                {
                  isLoading,
                  hasError,
                  onRetry: loadClauses,
                  emptyStateTitle: "No clauses found",
                  emptyStateDescription:
                    searchTerm || statusFilter
                      ? "No clauses match your current filters. Try adjusting your search criteria."
                      : "No clauses have been created yet. Click the '+' button to create the first clause.",
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
        title="Delete Clause"
        description={`Are you sure you want to delete "${clauseToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
