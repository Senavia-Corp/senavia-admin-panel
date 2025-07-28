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
import { UserTableRow } from "@/components/molecules/user-table-row";
import { Plus, Search, Filter } from "lucide-react";
import type { User, UserRole } from "@/types/user-management";

interface UsersTableProps {
  users: User[];
  roles: UserRole[];
  onAddUser: () => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSearch: (search: string) => void;
  onRoleFilter: (roleId: string) => void;
  onEditUser: (user: User) => void;
}

export function UsersTable({
  users,
  roles,
  onAddUser,
  onViewUser,
  onDeleteUser,
  onSearch,
  onRoleFilter,
  onEditUser,
}: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleRoleFilter = (roleId: string) => {
    setSelectedRole(roleId);
    onRoleFilter(roleId);
  };

  return (
    <div className="flex flex-col h-full space-y-1 w-full">
      {/* Add User Section */}
      <Card className="bg-[#04081E] text-white flex-shrink-0 w-full">
        <CardHeader className="flex flex-row items-center justify-between py-[15px] px-[20px]">
          <div>
            <h2 className="font-sans font-normal text-xl leading-none tracking-normal align-middle">
              Add User
            </h2>
            <p className="font-sans font-light text-sm leading-none tracking-normal align-middle text-gray-400">
              Description
            </p>
          </div>
          <Button
            onClick={onAddUser}
            className="bg-[#99CC33] hover:bg-green-200 text-[#04081E] rounded-full w-[40px] h-[40px] p-0 flex items-center justify-center"
          >
            <Plus className="w-8 h-8" strokeWidth={4} />
          </Button>
        </CardHeader>
      </Card>

      {/* Users Table Section - Takes remaining space */}
      <Card className="bg-[#04081E] text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-[20px] py-[20px]">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="font-sans font-normal text-xl leading-none tracking-normal align-middle">
                All Users
              </h2>
              <p className="font-sans font-light text-sm leading-none tracking-normal align-middle text-gray-400">
                Description
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <Select value={selectedRole} onValueChange={handleRoleFilter}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black font-bold"
                  strokeWidth={3}
                />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-80 bg-white border-gray-700 text-black"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 px-[20px]">
          <div className="bg-white flex-1 flex flex-col w-full min-h-0 px-[10px] py-[10px]">
            <table className="w-full table-fixed ">
              <thead className="bg-[#E1E4ED]">
                <tr>
                  <th className="w-1/6 px-6 py-4 font-sans font-semibold text-xl leading-none tracking-normal text-center align-middle border-b border-gray-200 text-[#616774]">
                    User ID
                  </th>
                  <th className="w-1/6 px-6 py-4 font-sans font-semibold text-xl leading-none tracking-normal text-center align-middle text-[#616774]">
                    Username
                  </th>
                  <th className="w-1/6 px-6 py-4 font-sans font-semibold text-xl leading-none tracking-normal text-center align-middle text-[#616774]">
                    User Type
                  </th>
                  <th className="w-1/6 px-6 py-4 font-sans font-semibold text-xl leading-none tracking-normal text-center align-middle text-[#616774]">
                    Email
                  </th>
                  <th className="w-1/6 px-6 py-4 font-sans font-semibold text-xl leading-none tracking-normal text-center align-middle text-[#616774]">
                    Phone Number
                  </th>
                  <th className="w-1/6 px-6 py-4 font-sans font-semibold text-xl leading-none tracking-normal text-center align-middle text-[#616774]">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
            <div className="flex-1 overflow-auto">
              <table className="w-full table-fixed">
                <tbody className="bg-white">
                  {users.map((user, idx) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      onView={onViewUser}
                      onDelete={onDeleteUser}
                      isLast={idx === users.length - 1}
                      isFirst={idx === 0}
                      onEdit={onEditUser}
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
