"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { SupportManagementService } from "@/services/support-management-service";
import type { SupportTicket } from "@/types/support-management";
import { TicketEditor } from "../organisms/ticket-editor";
import { GeneralTable } from "../organisms/tables/general-table";
import TicketViewModel from "./ticket/TicketViewModel";

export function SupportPage() {
  
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showEditor, setShowEditor] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<number | null>(null);

  //paginado
  const[ticketsPerPage,setTicketsPerPage]=useState(10)
  const [offset, setOffset] = useState(0);  
  const[allTickets,setAllTickets]=useState<any[]>([])
  const {tickets,loading,pageInfo}=TicketViewModel({paginacionTicket:true,offset,ticketsPerPage})

  useEffect(() => {
    loadTickets();     
  }, [searchTerm, typeFilter, statusFilter]);

  useEffect(() => {
  console.log("Tickets actualizados:", tickets);
}, [tickets]);


  const loadTickets = async () => {
    try {
      const ticketsData = await SupportManagementService.getTickets(
        searchTerm,
        typeFilter,
        statusFilter
      );
      //setTickets(ticketsData);
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
   const handleFilterChange=()=>{
    
  }
  const handlers = {
      onCreate: handleCreateTicket,
      onView: handleViewTicket,
      onDelete: (ticket: SupportTicket) => setTicketToDelete(ticket),
      onSearch: setSearchTerm,
      onFilter: handleFilterChange,
    }
  
  
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
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">
              Tickets
            </h1>
{GeneralTable(
  "tickets-page",
  "Add Ticket",
  "Description",
  "All Tickets",
  "Description",
  ["Ticket ID","Title","Assignee", "Type","Status","Project","Actions"],
tickets, handlers
  )}
            {/*<div className="flex-1 min-h-0">
              <SupportTable
                tickets={tickets}
                onAddTicket={handleCreateTicket}
                onViewTicket={handleViewTicket}
                onDeleteTicket={setTicketToDelete}
                onSearch={setSearchTerm}
                onTypeFilter={setTypeFilter}
                onStatusFilter={setStatusFilter}
              />
            </div>*/}
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
         {/* Controles de paginación */}
<div className="flex justify-between items-center mt-4">
  <button
    onClick={() => setOffset((prev) => Math.max(prev - ticketsPerPage, 0))}
    disabled={offset === 0 || loading}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    ⬅️ Anterior
  </button>

  <span>
    Página {Math.floor(offset / ticketsPerPage) + 1}
  </span>

  <button
    onClick={() => {
      if (!pageInfo || offset + ticketsPerPage < pageInfo.totalTickets) {                
        const lastTicketId = tickets[tickets.length - 1].id;
        setOffset(lastTicketId);        
      }     
      console.log("soy el total: "+pageInfo.totalTickets)
    }}
    disabled={loading || (pageInfo && offset + ticketsPerPage >= pageInfo.totalTickets)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Siguiente ➡️
  </button>
</div>

    </div>
  );
}
