"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadTableRow } from "@/components/molecules/lead-table-row";
import { Plus, Search, Filter } from "lucide-react";
import { Lead, LeadStatus } from "@/types/lead-management";

interface LeadsTableProps {
  leads: Lead[];
  onAddLead: () => void;
  onViewLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
}

export function LeadsTable({
  leads,
  onAddLead,
  onViewLead,
  onDeleteLead,
  onSearch,
  onStatusFilter,
}: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    onStatusFilter(status);
  };

  const statuses: LeadStatus[] = [
    "Send",
    "Processing",
    "Estimating",
    "Finished",
  ];

  return (
    <div className="flex flex-col h-full space-y-6 w-full">
      {/* Add Lead Section */}
      <Card className="bg-gray-900 text-white flex-shrink-0 w-full">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8">
          <div>
            <h2 className="text-xl font-semibold">Add Lead</h2>
            <p className="text-gray-400">Description</p>
          </div>
          <Button
            onClick={onAddLead}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 p-0"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </CardHeader>
      </Card>

      {/* All Leads Section */}
      <Card className="bg-gray-900 text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold">All Leads</h2>
              <p className="text-gray-400">Description</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Filter by status" />
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
                  placeholder="Search leads..."
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
              <thead className="bg-gray-50">
                <tr>
                <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead ID
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
            <div className="flex-1 overflow-auto">
              <table className="w-full table-fixed">
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <LeadTableRow
                      key={lead.id}
                      lead={lead}
                      onView={onViewLead}
                      onDelete={onDeleteLead}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
