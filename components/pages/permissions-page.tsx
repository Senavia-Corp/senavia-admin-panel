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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center space-x-2">
                <img src="/images/senavia-logo.png" alt="Senavia Logo" className="w-8 h-8 object-contain" />
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
        <main className="flex-1 overflow-hidden">
          <div className="px-6 py-6 h-full w-screen max-w-none">
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center space-x-2">
                <img src="/images/senavia-logo.png" alt="Senavia Logo" className="w-8 h-8 object-contain" />
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
        <main className="flex-1 overflow-hidden">
          <div className="px-6 py-6 h-full w-screen max-w-none">
            <PermissionDetailForm onBack={handleBackToList} onSave={handleSaveSuccess} />
          </div>
        </main>
      </div>
    )
  }

  // Show permissions table
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center space-x-2">
              <img src="/images/senavia-logo.png" alt="Senavia Logo" className="w-8 h-8 object-contain" />
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">Permission Management</h1>

            <div className="flex-1 min-h-0">
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
