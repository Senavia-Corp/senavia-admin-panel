"use client"

import { useState, useEffect } from "react"
import { PermissionsTable } from "@/components/organisms/permissions-table"
import { PermissionDetailForm } from "@/components/organisms/permission-detail-form"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell } from "lucide-react"
import { PermissionManagementService } from "@/services/permission-management-service"
import type { Permission } from "@/types/permission-management"

export function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissionId, setSelectedPermissionId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [serviceFilter, setServiceFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    loadPermissions()
  }, [searchTerm, actionFilter, serviceFilter, statusFilter])

  const loadPermissions = async () => {
    try {
      const permissionsData = await PermissionManagementService.getPermissions(
        searchTerm,
        actionFilter,
        serviceFilter,
        statusFilter,
      )
      setPermissions(permissionsData)
    } catch (error) {
      console.error("Error loading permissions:", error)
    }
  }

  const handleDeletePermission = async (permission: Permission) => {
    try {
      await PermissionManagementService.deletePermission(permission.id)
      setPermissionToDelete(null)
      loadPermissions()
    } catch (error) {
      console.error("Error deleting permission:", error)
    }
  }

  const handleViewPermission = (permission: Permission) => {
    setSelectedPermissionId(permission.id)
  }

  const handleCreatePermission = () => {
    setShowCreateForm(true)
  }

  const handleBackToList = () => {
    setSelectedPermissionId(null)
    setShowCreateForm(false)
  }

  const handleSaveSuccess = () => {
    setSelectedPermissionId(null)
    setShowCreateForm(false)
    loadPermissions()
  }

  // Show detail form for editing existing permission
  if (selectedPermissionId) {
    return (
      <div className="">
        {/* Main Content */}
        <main className="">
          <div className="px-6 py-6 ">
            <PermissionDetailForm
              permissionId={selectedPermissionId}
              onBack={handleBackToList}
              onSave={handleSaveSuccess}
            />
          </div>
        </main>
      </div>
    )
  }

  // Show detail form for creating new permission
  if (showCreateForm) {
    return (
      <div className="">  
        {/* Main Content */}
        <main className="">
          <div className="px-6 py-6">
            <PermissionDetailForm onBack={handleBackToList} onSave={handleSaveSuccess} />
          </div>
        </main>
      </div>
    )
  }
  // Show permissions table
  return (
    <div className="md:flex-1 flex flex-col md:h-screen md:overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">Permission Management</h1>
            <div className="flex-1 min-h-0 mt-3">
              <PermissionsTable
                permissions={permissions}
                onAddPermission={handleCreatePermission}
                onViewPermission={handleViewPermission}
                onDeletePermission={setPermissionToDelete}
                onSearch={setSearchTerm}
                onActionFilter={setActionFilter}
                onServiceFilter={setServiceFilter}
                onStatusFilter={setStatusFilter}
              />
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmDialog
        open={!!permissionToDelete}
        onClose={() => setPermissionToDelete(null)}
        onConfirm={() => permissionToDelete && handleDeletePermission(permissionToDelete)}
        title="Delete Permission"
        description={`Are you sure you want to delete the permission "${permissionToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
