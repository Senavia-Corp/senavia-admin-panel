"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PermissionTableRow } from "@/components/molecules/permission-table-row"
import { Plus, Search, Filter } from "lucide-react"
import type { Permission, PermissionAction, AssociatedService, PermissionStatus } from "@/types/permission-management"

interface PermissionsTableProps {
  permissions: Permission[]
  onAddPermission: () => void
  onViewPermission: (permission: Permission) => void
  onDeletePermission: (permission: Permission) => void
  onSearch: (search: string) => void
  onActionFilter: (action: string) => void
  onServiceFilter: (service: string) => void
  onStatusFilter: (status: string) => void
}

export function PermissionsTable({
  permissions,
  onAddPermission,
  onViewPermission,
  onDeletePermission,
  onSearch,
  onActionFilter,
  onServiceFilter,
  onStatusFilter,
}: PermissionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [selectedService, setSelectedService] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleActionFilter = (action: string) => {
    setSelectedAction(action)
    onActionFilter(action)
  }

  const handleServiceFilter = (service: string) => {
    setSelectedService(service)
    onServiceFilter(service)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    onStatusFilter(status)
  }

  const actions: PermissionAction[] = ["View", "Create", "Update", "Delete"]
  const services: AssociatedService[] = [
    "Users",
    "Blogs",
    "Leads",
    "Projects",
    "Dashboard",
    "Contracts",
    "Billing",
    "Technical Support",
    "Manage Content",
    "Roles",
    "Permissions",
  ]
  const statuses: PermissionStatus[] = ["Active", "Not Active"]

  return (
    <div className="flex flex-col h-full space-y-6 w-full">
      {/* Add Permission Section */}
      <Card className="bg-gray-900 text-white flex-shrink-0 w-full">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8">
          <div>
            <h2 className="text-xl font-semibold">Add Permission</h2>
            <p className="text-gray-400">Description</p>
          </div>
          <Button
            onClick={onAddPermission}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 p-0"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </CardHeader>
      </Card>

      {/* All Permissions Section - Takes remaining space */}
      <Card className="bg-gray-900 text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold">All Permissions</h2>
              <p className="text-gray-400">Description</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <Select value={selectedAction} onValueChange={handleActionFilter}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {actions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedService} onValueChange={handleServiceFilter}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={handleStatusFilter}>
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
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search permissions..."
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
                    Permission ID
                  </th>
                  <th className="flex-1 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-48 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Associated To
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
                  {permissions.map((permission) => (
                    <PermissionTableRow
                      key={permission.id}
                      permission={permission}
                      onView={onViewPermission}
                      onDelete={onDeletePermission}
                    />
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
