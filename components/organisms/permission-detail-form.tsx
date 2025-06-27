"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { PermissionManagementService } from "@/services/permission-management-service"
import type {
  Permission,
  CreatePermissionData,
  PermissionAction,
  AssociatedService,
} from "@/types/permission-management"

interface PermissionDetailFormProps {
  permissionId?: string
  onBack: () => void
  onSave: () => void
}

export function PermissionDetailForm({ permissionId, onBack, onSave }: PermissionDetailFormProps) {
  const [permission, setPermission] = useState<Permission | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    action: "View" as PermissionAction,
    associatedService: "Users" as AssociatedService,
    status: true, // true for Active, false for Inactive
  })

  const isEditMode = !!permissionId
  const displayId = permissionId || "NEW"

  useEffect(() => {
    if (permissionId) {
      loadPermission(permissionId)
    }
  }, [permissionId])

  const loadPermission = async (id: string) => {
    try {
      const permissionData = await PermissionManagementService.getPermissionById(id)
      if (permissionData) {
        setPermission(permissionData)
        setFormData({
          name: permissionData.name,
          description: permissionData.description || "",
          action: permissionData.action,
          associatedService: permissionData.associatedService,
          status: permissionData.status === "Active",
        })
      }
    } catch (error) {
      console.error("Error loading permission:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const permissionData: CreatePermissionData = {
        name: formData.name,
        description: formData.description,
        action: formData.action,
        associatedService: formData.associatedService,
        status: formData.status ? "Active" : "Inactive",
      }

      if (isEditMode && permissionId) {
        await PermissionManagementService.updatePermission(permissionId, permissionData)
      } else {
        await PermissionManagementService.createPermission(permissionData)
      }

      onSave()
    } catch (error) {
      console.error("Error saving permission:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const actions = PermissionManagementService.getPermissionActions()
  const services = PermissionManagementService.getAssociatedServices()

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
        <h1 className="text-2xl font-bold text-gray-900">Permission Details</h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1">
        <div className="bg-white rounded-lg p-12 h-full">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* ID Display */}
            <div>
              <p className="text-lg text-gray-600 mb-6">ID: {displayId}</p>
            </div>

            {/* Form Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
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
                    placeholder="Permission Name"
                    className="w-full h-12 text-base"
                  />
                </div>

                {/* Action */}
                <div>
                  <Label htmlFor="action" className="text-lg font-medium text-gray-900 mb-3 block">
                    Action
                  </Label>
                  <Select
                    value={formData.action}
                    onValueChange={(value: PermissionAction) => handleChange("action", value)}
                  >
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Dropdown here" />
                    </SelectTrigger>
                    <SelectContent>
                      {actions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Associated Service */}
                <div>
                  <Label htmlFor="associatedService" className="text-lg font-medium text-gray-900 mb-3 block">
                    Associated Service
                  </Label>
                  <Select
                    value={formData.associatedService}
                    onValueChange={(value: AssociatedService) => handleChange("associatedService", value)}
                  >
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Dropdown here" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
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

                {/* Status */}
                <div>
                  <Label className="text-lg font-medium text-gray-900 mb-3 block">Status</Label>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) => handleChange("status", checked as boolean)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="status" className="text-base font-medium">
                      Active
                    </Label>
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
                {isLoading ? "Saving..." : isEditMode ? "Update Permission" : "Add Permission"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
