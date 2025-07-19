"use client";

import { useState, useEffect } from "react";
import { LeadsTable } from "@/components/organisms/leads-table";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { LeadManagementService } from "@/services/lead-management-service";
import type { Lead } from "@/types/lead-management";
import { toast } from "@/components/ui/use-toast";

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center space-x-2">
              <img
                src="/images/senavia-logo.png"
                alt="Senavia Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">U</span>
              </div>
              <span className="text-sm font-medium">Username</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">
              Lead Management
            </h1>

            <div className="flex-1 min-h-0">
              <LeadsTable
                leads={leads}
                onAddLead={() => loadLeads()}
                onViewLead={() => loadLeads()}
                onDeleteLead={setLeadToDelete}
                onSearch={setSearchTerm}
                onStatusFilter={setStatusFilter}
              />
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
