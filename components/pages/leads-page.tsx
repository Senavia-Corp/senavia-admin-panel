"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { LeadManagementService } from "@/services/lead-management-service";
import type { Lead } from "@/types/lead-management";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { useToast } from "@/hooks/use-toast";
import { CreateLeadForm } from "@/components/organisms/leads/create-lead-form";
import { EditLeadForm } from "@/components/organisms/leads/edit-lead-form";
import { DetailTabs } from "@/components/molecules/detail-tabs";
import { TableRowSkeleton } from "@/components/atoms/table-row-skeleton";

export function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showEditorForm, setShowEditorForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Campos de búsqueda para leads
  const SEARCHABLE_FIELDS = ["clientName", "clientEmail", "state"] as const;

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const leadsData = await LeadManagementService.getLeads();
      setLeads(leadsData);
      setFilteredLeads(leadsData);
    } catch (error) {
      console.error("Error loading leads:", error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to load leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLead = () => {
    setSelectedLead(null);
    setShowEditorForm(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditorForm(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditorForm(true);
  };

  const handleDeleteLead = async (lead: Lead) => {
    try {
      await LeadManagementService.deleteLead(lead.id);
      setLeadToDelete(null);
      loadLeads();
      toast({ title: "Success", description: "Lead deleted successfully" });
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
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
    setSelectedLead(null);
    setShowEditorForm(false);
  };

  const handleSaveSuccess = () => {
    setSelectedLead(null);
    setShowEditorForm(false);
    loadLeads();
  };

  const handlers = {
    onCreate: handleCreateLead,
    onView: handleViewLead,
    onEdit: handleEditLead,
    onDelete: (lead: Lead) => setLeadToDelete(lead),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  // Local filtering like contracts page
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = leads.filter((lead) => {
      const matchesSearch = !searchTerm
        ? true
        : SEARCHABLE_FIELDS.some((field) =>
            String(lead[field] ?? "")
              .toLowerCase()
              .includes(lowerSearch)
          );
      const matchesStatus = !statusFilter || lead.state === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter]);

  // Show create form
  if (showEditorForm && !selectedLead) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="Create Lead"
            onBack={() => setShowEditorForm(false)}
          >
            <CreateLeadForm onSuccess={handleSaveSuccess} />
          </DetailTabs>
        </div>
      </div>
    );
  }

  // Show edit form
  if (showEditorForm && selectedLead) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs title="Edit Lead" onBack={handleBackToList}>
            <EditLeadForm lead={selectedLead} onSuccess={handleSaveSuccess} />
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
                Lead Management
              </h1>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "leads-page",
                "Add Lead",
                "Create a new lead for potential business opportunity",
                "All Leads",
                "View and manage all lead opportunities in the system",
                ["Lead ID", "Client Name", "Start Date", "Status", "Actions"],
                filteredLeads,
                handlers,
                {
                  isLoading,
                  hasError,
                  onRetry: loadLeads,
                  emptyStateTitle: "No leads found",
                  emptyStateDescription:
                    searchTerm || statusFilter
                      ? "No leads match your current filters. Try adjusting your search criteria."
                      : "No leads have been created yet. Click the '+' button to create the first lead.",
                  skeletonComponent: () => (
                    <TableRowSkeleton columns={4} actions={2} />
                  ),
                  skeletonCount: 5,
                }
              )}
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmDialog
        open={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={() => leadToDelete && handleDeleteLead(leadToDelete)}
        title="Delete Lead"
        description={`Are you sure you want to delete the lead for "${leadToDelete?.clientName}"? This action cannot be undone.`}
      />
    </div>
  );
}
