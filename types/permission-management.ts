export interface Permission {
  id: string
  name: string
  action: PermissionAction
  status: PermissionStatus
  associatedService: AssociatedService
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type PermissionAction = "View" | "Create" | "Update" | "Delete"

export type PermissionStatus = "Active" | "Inactive"

export type AssociatedService =
  | "Users"
  | "Blogs"
  | "Leads"
  | "Projects"
  | "Dashboard"
  | "Contracts"
  | "Billing"
  | "Technical Support"
  | "Manage Content"
  | "Roles"
  | "Permissions"

export interface CreatePermissionData {
  name: string
  action: PermissionAction
  status: PermissionStatus
  associatedService: AssociatedService
  description?: string
}
