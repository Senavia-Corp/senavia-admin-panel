"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SupportTableRow } from "@/components/molecules/ticket-table-row"
import { Plus, Search, Filter } from "lucide-react"

import type { SupportTicket, TicketType, TicketStatus } from "@/types/support-management"
import TicketViewModel from "@/types/ViewsModels/TicketViewModel"
import { useEffect } from "react"; // Asegúrate que esté importado

interface SupportTableProps {
  tickets: SupportTicket[]
  onAddTicket: () => void
  onViewTicket: (ticket: SupportTicket) => void
  onDeleteTicket: (ticket: SupportTicket) => void
  onSearch: (search: string) => void
  onTypeFilter: (type: string) => void
  onStatusFilter: (status: string) => void
}

export function SupportTable({tickets,onAddTicket,onViewTicket,onDeleteTicket, onSearch,onTypeFilter,onStatusFilter,}: SupportTableProps) {
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  //------------------------------- get Tickets --------------------------------
  const [ticketsPerPage, setTicketsPerPage] = useState(3)
  const [offset,setOffset] = useState(0)
  
  const[allTickets,setAllTickets] = useState<any[]>([])
  const {_tickets,loading,pageInfo}=TicketViewModel({simpleTicket:true,offset,ticketsPerPage,})

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type)
    onTypeFilter(type)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    onStatusFilter(status)
  }

  useEffect(()=>{
    if(_tickets && _tickets.length > 0){
      if(offset === 0){
      setAllTickets(_tickets)
    }else{
      setAllTickets((pre)=>{
        const existingIds = new Set(pre.map(ticket=>ticket.id))
        const newTickets = tickets.filter(ticket=>!existingIds.has(ticket.id))
        return [...pre,...newTickets]
      })
    }}
  },[tickets,offset])

  const types: TicketType[] = ["BUG", "REQUEST", "REVIEW", "OTHER"]
  const statuses: TicketStatus[] = ["PENDING", "ASSIGNED", "INPROCESS", "UNDERREVIEW", "SOLVED", "CLOSED"]

  return (
    <div className="flex flex-col h-full space-y-6 w-full">
      {/* Add Ticket Section */}
      <Card className="bg-gray-900 text-white flex-shrink-0 w-full">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8">
          <div>
            <h2 className="text-xl font-semibold">Add Ticket</h2>
            <p className="text-gray-400">Description</p>
          </div>
          <Button
            onClick={onAddTicket}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 p-0"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </CardHeader>
      </Card>

      {/* All Tickets Section */}
      <Card className="bg-gray-900 text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold">All Tickets</h2>
              <p className="text-gray-400">Description</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <Select value={selectedType} onValueChange={handleTypeFilter}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-80 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 px-8 pb-8">
          <div className="bg-white rounded-lg flex-1 flex flex-col w-full min-h-0">
            <table className="w-full table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="w-48 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="flex-1 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
            <div className="flex-1 overflow-auto">
              <table className="w-full table-fixed">
                <tbody className="bg-white divide-y divide-gray-200">
                  {_tickets.map((ticket) => (
                    <SupportTableRow key={ticket.id} ticket={ticket} onView={onViewTicket} onDelete={onDeleteTicket} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
