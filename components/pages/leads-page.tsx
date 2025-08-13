"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { LeadManagementService } from "@/services/lead-management-service";
import type { Lead } from "@/types/lead-management";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { LeadEditor } from "@/components/organisms/lead-editor";
import { toast } from "@/components/ui/use-toast";

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showEditorForm, setShowEditorForm] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [searchTerm, statusFilter]);

  const loadLeads = async () => {
    try {
      const leadsData = await LeadManagementService.getLeads(
        searchTerm,
        statusFilter
      );
      setLeads(leadsData);
    } catch (error) {
      console.error("Error loading leads:", error);
      toast({
        title: "Error",
        description: "Failed to load leads. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateLead = () => {
    setSelectedLeadId(null);
    setShowEditorForm(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setShowEditorForm(true);
  };

  const handleDeleteLead = async (lead: Lead) => {
    try {
      await LeadManagementService.deleteLead(lead.id);
      setLeadToDelete(null);
      loadLeads();
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
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
    setStatusFilter(filter);
  };

  const handleBackToList = () => {
    setSelectedLeadId(null);
    setShowEditorForm(false);
  };

  const handleSaveSuccess = () => {
    setSelectedLeadId(null);
    setShowEditorForm(false);
    loadLeads();
  };

  const handlers = {
    onCreate: handleCreateLead,
    onView: handleViewLead,
    onDelete: (lead: Lead) => setLeadToDelete(lead),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  // Show editor form for creating/editing lead
  if (showEditorForm) {
    return (
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="p-6 h-full w-full">
            <LeadEditor
              leadId={selectedLeadId}
              onBack={handleBackToList}
              onSave={handleSaveSuccess}
            />
          </div>
        </main>
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
                ["ID", "Client Name", "Start Date", "Status", "Actions"],
                leads,
                handlers
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
