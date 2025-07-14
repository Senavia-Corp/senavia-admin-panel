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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RoleTableRow } from "@/components/molecules/role-table-row";
import { Plus, Search, Filter } from "lucide-react";
import type { Role } from "@/types/role-management";

interface RolesTableProps {
  roles: Role[];
  onAddRole: () => void;
  onViewRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
}

export function RolesTable({
  roles,
  onAddRole,
  onViewRole,
  onDeleteRole,
  onSearch,
  onStatusFilter,
}: RolesTableProps) {
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

  const statuses = ["Active", "Inactive"];

  return (
    <div className="flex flex-col h-full space-y-6 w-full">
      {/* Add Role Section */}
      <Card className="bg-gray-900 text-white flex-shrink-0 w-full">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8">
          <div>
            <h2 className="text-2xl font-normal">Add Role</h2>
            <p className="">Description</p>
          </div>
          <Button
            onClick={onAddRole}
            className="[&_svg]:size-7 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0"
          >
            <Plus color="#04081E" strokeWidth={3} />
          </Button>
        </CardHeader>
      </Card>

      {/* All Roles Section - Takes remaining space */}
      <Card className="bg-gray-900 text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-2xl font-normal">All Roles</h2>
              <p className="">Description</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger>
                    <Filter className="h-5 w-5" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 m-0 bg-gray-800 border-gray-700">
                    <Select
                      value={selectedStatus}
                      onValueChange={handleStatusFilter}
                    >
                      <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="all" className="text-white">All Status</SelectItem>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status} className="text-white">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>

                {/* Original Select | Comentado para evitar duplicidad y por si se usara luego */}
                {/* <Select
                  value={selectedStatus}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
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
                </Select> */}

              </div>
              <div className="relative">
                <Search color="black" className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-80 bg-white border-gray-700 text-black"
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
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team ID
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
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
                  {roles.map((role) => (
                    <RoleTableRow
                      key={role.id}
                      role={role}
                      onView={onViewRole}
                      onDelete={onDeleteRole}
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
