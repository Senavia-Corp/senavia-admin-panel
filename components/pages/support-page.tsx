"use client";

import { useState, useEffect } from "react";
import { SupportTable } from "@/components/organisms/support-table";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { SupportManagementService } from "@/services/support-management-service";
import type { SupportTicket } from "@/types/support-management";

import { TicketEditor } from "../organisms/ticket-editor";

export function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showEditor, setShowEditor] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<number | null>(null);

  useEffect(() => {
    loadTickets();
  }, [searchTerm, typeFilter, statusFilter]);

  const loadTickets = async () => {
    try {
      const ticketsData = await SupportManagementService.getTickets(
        searchTerm,
        typeFilter,
        statusFilter
      );
      setTickets(ticketsData);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  const handleDeleteTicket = async (ticket: SupportTicket) => {
   /* try {
      await SupportManagementService.deleteTicket(ticket.id);
      setTicketToDelete(null);
      loadTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }*/
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    console.log("View ticket:", ticket);
    setEditingTicketId(ticket.id)
    setShowEditor(true)
  };

  const handleCreateTicket = () => {
    setEditingTicketId(null);
    setShowEditor(true);
  };
  
  if(showEditor){
    return (<div className="flex-1 flex flex-col h-screen overflow-hidden">
      <div className="p-6 h-full"> 
        <TicketEditor
        ticketId={editingTicketId??undefined}
        onBack={()=>setShowEditor(false)}
        onSave={()=>{
          setShowEditor(false)
          loadTickets()
        }}/>
      </div>
    </div>)
  }

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
              Technical Support
            </h1>

            <div className="flex-1 min-h-0">
              <SupportTable
                tickets={tickets}
                onAddTicket={handleCreateTicket}
                onViewTicket={handleViewTicket}
                onDeleteTicket={setTicketToDelete}
                onSearch={setSearchTerm}
                onTypeFilter={setTypeFilter}
                onStatusFilter={setStatusFilter}
              />
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmDialog
        open={!!ticketToDelete}
        onClose={() => setTicketToDelete(null)}
        onConfirm={() => ticketToDelete && handleDeleteTicket(ticketToDelete)}
        title="Delete Ticket"
        description={`Are you sure you want to delete ticket "${ticketToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
