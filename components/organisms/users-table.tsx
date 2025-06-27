"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserTableRow } from "@/components/molecules/user-table-row"
import { Plus, Search, Filter } from "lucide-react"
import type { User, UserRole } from "@/types/user-management"

interface UsersTableProps {
  users: User[]
  roles: UserRole[]
  onAddUser: () => void
  onViewUser: (user: User) => void
  onDeleteUser: (user: User) => void
  onSearch: (search: string) => void
  onRoleFilter: (roleId: string) => void
}

export function UsersTable({
  users,
  roles,
  onAddUser,
  onViewUser,
  onDeleteUser,
  onSearch,
  onRoleFilter,
}: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleRoleFilter = (roleId: string) => {
    setSelectedRole(roleId)
    onRoleFilter(roleId)
  }

  return (
    <div className="flex flex-col h-full space-y-6 w-full">
      {/* Add User Section */}
      <Card className="bg-gray-900 text-white flex-shrink-0 w-full">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8">
          <div>
            <h2 className="text-xl font-semibold">Add User</h2>
            <p className="text-gray-400">Description</p>
          </div>
          <Button onClick={onAddUser} className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 p-0">
            <Plus className="h-6 w-6" />
          </Button>
        </CardHeader>
      </Card>

      {/* Users Table Section - Takes remaining space */}
      <Card className="bg-gray-900 text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold">All Users</h2>
              <p className="text-gray-400">Description</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
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
                  <th className="w-24 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="w-48 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="w-40 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="flex-1 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="w-48 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
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
                  {users.map((user) => (
                    <UserTableRow key={user.id} user={user} onView={onViewUser} onDelete={onDeleteUser} />
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
