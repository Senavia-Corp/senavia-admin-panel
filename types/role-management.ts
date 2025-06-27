export interface Role {
  id: string
  name: string
  description?: string
  isActive: boolean
  permissions: string[] // Array of permission IDs
  createdAt: Date
  updatedAt: Date
}

export interface CreateRoleData {
  name: string
  description?: string
  isActive: boolean
  permissions: string[]
}

export type RoleStatus = "Active" | "Inactive"
