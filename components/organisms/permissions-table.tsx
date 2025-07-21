"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PermissionTableRow } from "@/components/molecules/permission-table-row"
import { Plus, Search, Filter } from "lucide-react"
import type { Permission, PermissionAction, AssociatedService, PermissionStatus } from "@/types/permission-management"
import { Popover, PopoverTrigger, PopoverContent} from "@radix-ui/react-popover"

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
  const [showFilters, setShowFilters] = useState(false)


  const toggleFilters = () => {
    if (showFilters) {
      setShowFilters(false)
    } else {
      setShowFilters(true)
    }
  }

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
  const statuses: PermissionStatus[] = ["Active", "Inactive"]

  return (
    <div className="flex flex-col h-full space-y-1 w-full">
      {/* Add Permission Section */}
      <Card className="bg-[#04081E] text-white flex-shrink-0 h-24 w-full items-center">
        <CardHeader className="flex flex-row items-center justify-between py-5 px-5">
          <div>
            <h2 className="text-2xl font-normal">Add Permission</h2>
            <p className="">Description</p>
          </div>
          <Button
            onClick={onAddPermission}
            className="[&_svg]:size-7 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0"
          >
            <Plus color="#04081E" strokeWidth={3} />
          </Button>
        </CardHeader>
      </Card>

      {/* All Permissions Section - Takes remaining space */}
      <Card className="bg-[#04081E] text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-5 py-5">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-2xl font-normal">All Permissions</h2>
              <p className="">Description</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={toggleFilters} className="[&_svg]:size-7">
                  <Filter className="h-5 w-5" />
                </Button>
                {showFilters && (
                  <>
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
                  </>
                )}
              </div>
              <div className="relative">
                <Search
                  color="#04081E"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                />
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 xl:w-80 bg-white border-gray-700 text-black rounded-md"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 px-5 pb-5">
          <div className="bg-white rounded-lg flex-1 overflow-auto flex flex-col w-full min-h-0 p-0 lg:p-5">
            <table className="w-full min-w-[700px] border-separate border-spacing-y-2.5">
              <thead className="bg-[#E1E4ED] sticky top-0 z-10 text-base lg:text-2xl">
                <tr>
                  <th className="font-semibold  w-1/6 p-5 text-center text-[#616774]">
                    Permission ID
                  </th>
                  <th className="font-semibold  w-1/6 p-5 text-center text-[#616774]">
                    Name
                  </th>
                  <th className="font-semibold  w-1/6 p-5 text-center text-[#616774]">
                    Action
                  </th>
                  <th className="font-semibold  w-1/6 p-5 text-center text-[#616774]">
                    Status
                  </th>
                  <th className="font-semibold  w-1/4 p-5 text-center text-[#616774]">
                    Associated To
                  </th>
                  <th className="font-semibold  w-1/6 p-5 text-center text-[#616774]">
                    Actions
                  </th>
                </tr>
              </thead>
                <tbody className="bg-white">
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
        </CardContent>
      </Card>
    </div>
  );
}
