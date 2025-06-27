"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { RoleManagementService } from "@/services/role-management-service"
import { PermissionManagementService } from "@/services/permission-management-service"
import { PermissionBadge } from "@/components/atoms/permission-badge"
import type { Role, CreateRoleData } from "@/types/role-management"
import type { Permission } from "@/types/permission-management"

interface RoleDetailFormProps {
  roleId?: string
  onBack: () => void
  onSave: () => void
}

export function RoleDetailForm({ roleId, onBack, onSave }: RoleDetailFormProps) {
  const [role, setRole] = useState<Role | null>(null)
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    permissions: [] as string[],
  })

  const isEditMode = !!roleId
  const displayId = roleId || "NEW"

  useEffect(() => {
    loadAvailablePermissions()
    if (roleId) {
      loadRole(roleId)
    }
  }, [roleId])

  const loadRole = async (id: string) => {
    try {
      const roleData = await RoleManagementService.getRoleById(id)
      if (roleData) {
        setRole(roleData)
        setFormData({
          name: roleData.name,
          description: roleData.description || "",
          isActive: roleData.isActive,
          permissions: roleData.permissions,
        })
      }
    } catch (error) {
      console.error("Error loading role:", error)
    }
  }

  const loadAvailablePermissions = async () => {
    try {
      const permissionsData = await PermissionManagementService.getPermissions()
      setAvailablePermissions(permissionsData)
    } catch (error) {
      console.error("Error loading permissions:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const roleData: CreateRoleData = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        permissions: formData.permissions,
      }

      if (isEditMode && roleId) {
        await RoleManagementService.updateRole(roleId, roleData)
      } else {
        await RoleManagementService.createRole(roleData)
      }

      onSave()
    } catch (error) {
      console.error("Error saving role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddPermission = (permissionId: string) => {
    if (!formData.permissions.includes(permissionId)) {
      handleChange("permissions", [...formData.permissions, permissionId])
    }
  }

  const handleRemovePermission = (permissionId: string) => {
    handleChange(
      "permissions",
      formData.permissions.filter((id) => id !== permissionId),
    )
  }

  const getSelectedPermissions = () => {
    return availablePermissions.filter((permission) => formData.permissions.includes(permission.id))
  }

  const getAvailablePermissionsForDropdown = () => {
    return availablePermissions.filter((permission) => !formData.permissions.includes(permission.id))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Role Details</h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1">
        <div className="bg-white rounded-lg p-12 h-full">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* ID Display */}
            <div>
              <p className="text-lg text-gray-600 mb-6">ID: {displayId}</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-8">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-lg font-medium text-gray-900 mb-3 block">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Role Name"
                  className="w-full h-12 text-base"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-lg font-medium text-gray-900 mb-3 block">
                  Description
                </Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                    rows={6}
                    maxLength={200}
                    className="w-full resize-none text-base"
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2">
                    {formData.description.length}/200
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div>
                <Label className="text-lg font-medium text-gray-900 mb-3 block">Active</Label>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange("isActive", checked as boolean)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="active" className="text-base font-medium">
                    Active
                  </Label>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <Label className="text-lg font-medium text-gray-900 mb-3 block">Permission</Label>
                <div className="space-y-4">
                  {/* Selected Permissions */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-300 rounded-lg">
                    {getSelectedPermissions().map((permission) => (
                      <PermissionBadge
                        key={permission.id}
                        permission={permission}
                        onRemove={() => handleRemovePermission(permission.id)}
                      />
                    ))}
                    {getSelectedPermissions().length === 0 && (
                      <span className="text-gray-500">No permissions selected</span>
                    )}
                  </div>

                  {/* Add Permission Dropdown */}
                  <div className="relative">
                    <Select
                      onValueChange={(value) => {
                        if (value !== "no-permissions") {
                          handleAddPermission(value)
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-12 text-base">
                        <SelectValue placeholder="Add permission..." />
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailablePermissionsForDropdown().map((permission) => (
                          <SelectItem key={permission.id} value={permission.id}>
                            {permission.name}
                          </SelectItem>
                        ))}
                        {getAvailablePermissionsForDropdown().length === 0 && (
                          <SelectItem value="no-permissions" disabled>
                            All permissions are already selected
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-8">
              <Button
                onClick={handleSave}
                disabled={isLoading || !formData.name.trim()}
                className="w-full max-w-md mx-auto flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-medium rounded-full"
              >
                {isLoading ? "Saving..." : isEditMode ? "Update Role" : "Add Role"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
