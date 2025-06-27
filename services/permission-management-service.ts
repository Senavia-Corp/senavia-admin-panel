import type {
  Permission,
  CreatePermissionData,
  PermissionAction,
  PermissionStatus,
  AssociatedService,
} from "@/types/permission-management"

// Mock data
const mockPermissions: Permission[] = [
  {
    id: "0001",
    name: "View Users",
    action: "View",
    status: "Active",
    associatedService: "Users",
    description: "Permission to view user information",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    name: "Create Users",
    action: "Create",
    status: "Active",
    associatedService: "Users",
    description: "Permission to create new users",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    name: "Update Users",
    action: "Update",
    status: "Active",
    associatedService: "Users",
    description: "Permission to update user information",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    name: "Delete Users",
    action: "Delete",
    status: "Inactive",
    associatedService: "Users",
    description: "Permission to delete users",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "0005",
    name: "View Blogs",
    action: "View",
    status: "Active",
    associatedService: "Blogs",
    description: "Permission to view blog posts",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "0006",
    name: "Create Blogs",
    action: "Create",
    status: "Active",
    associatedService: "Blogs",
    description: "Permission to create new blog posts",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "0007",
    name: "View Projects",
    action: "View",
    status: "Active",
    associatedService: "Projects",
    description: "Permission to view project information",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "0008",
    name: "Update Projects",
    action: "Update",
    status: "Inactive",
    associatedService: "Projects",
    description: "Permission to update project information",
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-15"),
  },
]

export class PermissionManagementService {
  static async getPermissions(
    search?: string,
    actionFilter?: string,
    serviceFilter?: string,
    statusFilter?: string,
  ): Promise<Permission[]> {
    let filteredPermissions = [...mockPermissions]

    if (search) {
      filteredPermissions = filteredPermissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(search.toLowerCase()) ||
          permission.action.toLowerCase().includes(search.toLowerCase()) ||
          permission.associatedService.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (actionFilter && actionFilter !== "all") {
      filteredPermissions = filteredPermissions.filter((permission) => permission.action === actionFilter)
    }

    if (serviceFilter && serviceFilter !== "all") {
      filteredPermissions = filteredPermissions.filter((permission) => permission.associatedService === serviceFilter)
    }

    if (statusFilter && statusFilter !== "all") {
      filteredPermissions = filteredPermissions.filter((permission) => permission.status === statusFilter)
    }

    return filteredPermissions
  }

  static async getPermissionById(id: string): Promise<Permission | null> {
    return mockPermissions.find((permission) => permission.id === id) || null
  }

  static async createPermission(permissionData: CreatePermissionData): Promise<Permission> {
    const newPermission: Permission = {
      id: (mockPermissions.length + 1).toString().padStart(4, "0"),
      name: permissionData.name,
      action: permissionData.action,
      status: permissionData.status,
      associatedService: permissionData.associatedService,
      description: permissionData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPermissions.push(newPermission)
    return newPermission
  }

  static async updatePermission(id: string, updates: Partial<Permission>): Promise<Permission | null> {
    const permissionIndex = mockPermissions.findIndex((permission) => permission.id === id)
    if (permissionIndex === -1) return null

    mockPermissions[permissionIndex] = { ...mockPermissions[permissionIndex], ...updates, updatedAt: new Date() }
    return mockPermissions[permissionIndex]
  }

  static async deletePermission(id: string): Promise<boolean> {
    const permissionIndex = mockPermissions.findIndex((permission) => permission.id === id)
    if (permissionIndex === -1) return false

    mockPermissions.splice(permissionIndex, 1)
    return true
  }

  static getPermissionActions(): PermissionAction[] {
    return ["View", "Create", "Update", "Delete"]
  }

  static getAssociatedServices(): AssociatedService[] {
    return [
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
  }

  static getPermissionStatuses(): PermissionStatus[] {
    return ["Active", "Inactive"]
  }
}
