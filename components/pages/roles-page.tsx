"use client"

import { useState, useEffect } from "react"
import { RolesTable } from "@/components/organisms/roles-table"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell } from "lucide-react"
import { RoleManagementService } from "@/services/role-management-service"
import type { Role } from "@/types/role-management"
import { RoleDetailForm } from "@/components/organisms/role-detail-form"
import { GeneralTable } from "@/components/organisms/tables/general-table"

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showDetailForm, setShowDetailForm] = useState(false)

  useEffect(() => {
    loadRoles()
  }, [searchTerm, statusFilter])

  const loadRoles = async () => {
    try {
      const rolesData = await RoleManagementService.getRoles(searchTerm, statusFilter)
      setRoles(rolesData)
    } catch (error) {
      console.error("Error loading roles:", error)
    }
  }

  const handleDeleteRole = async (role: Role) => {
    try {
      await RoleManagementService.deleteRole(role.id)
      setRoleToDelete(null)
      loadRoles()
    } catch (error) {
      console.error("Error deleting role:", error)
    }
  }

  const handleViewRole = (role: Role) => {
    setSelectedRoleId(role.id)
    setShowDetailForm(true)
  }

  const handleCreateRole = () => {
    setSelectedRoleId(null)
    setShowDetailForm(true)
  }

  const handleBackToList = () => {
    setSelectedRoleId(null)
    setShowDetailForm(false)
  }

  const handleSaveSuccess = () => {
    setSelectedRoleId(null)
    setShowDetailForm(false)
    loadRoles()
  }

  // Show detail form for editing existing role or creating new role
  if (showDetailForm) {
    return (
      <div className="">
        {/* Main Content */}
        <main className="">
          <div className="px-6 py-6 ">
            <RoleDetailForm roleId={selectedRoleId ?? undefined} onBack={handleBackToList} onSave={handleSaveSuccess} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Main Content */}
      <main className="flex-1  overflow-auto">
        <div className="px-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="my-3">
              <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">Role Management</h1>
            </div>

            <div className="flex-1 min-h-0">
              {GeneralTable("Add Role","Description","All Roles","Description",["Team ID","Role Name","Active","Actions"])}
            </div>
          </div>
        </div>
      </main> 

      <DeleteConfirmDialog
        open={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={() => roleToDelete && handleDeleteRole(roleToDelete)}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${roleToDelete?.name}"? This action cannot be undone and will affect all users assigned to this role.`}
      />
    </div>
  )
}
