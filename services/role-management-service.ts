import type { Role, CreateRoleData } from "@/types/role-management"

// Mock data
const mockRoles: Role[] = [
  {
    id: "0001",
    name: "Administrator",
    description: "Full access to all system features and settings",
    isActive: true,
    permissions: ["0001", "0002", "0003", "0004", "0005", "0006", "0007", "0008"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    name: "Customer",
    description: "Limited access for customer users",
    isActive: true,
    permissions: ["0001", "0005"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    name: "Developer",
    description: "Access to development and project management features",
    isActive: true,
    permissions: ["0001", "0005", "0007"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    name: "Designer",
    description: "Access to design and content management features",
    isActive: false,
    permissions: ["0001", "0005", "0006"],
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "0005",
    name: "Content Manager",
    description: "Access to content creation and management",
    isActive: true,
    permissions: ["0005", "0006"],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "0006",
    name: "Support Agent",
    description: "Access to customer support features",
    isActive: true,
    permissions: ["0001", "0007"],
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-17"),
  },
]

export class RoleManagementService {
  static async getRoles(search?: string, statusFilter?: string): Promise<Role[]> {
    let filteredRoles = [...mockRoles]

    if (search) {
      filteredRoles = filteredRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(search.toLowerCase()) ||
          (role.description && role.description.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "Active"
      filteredRoles = filteredRoles.filter((role) => role.isActive === isActive)
    }

    return filteredRoles
  }

  static async getRoleById(id: string): Promise<Role | null> {
    return mockRoles.find((role) => role.id === id) || null
  }

  static async createRole(roleData: CreateRoleData): Promise<Role> {
    const newRole: Role = {
      id: (mockRoles.length + 1).toString().padStart(4, "0"),
      name: roleData.name,
      description: roleData.description,
      isActive: roleData.isActive,
      permissions: roleData.permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRoles.push(newRole)
    return newRole
  }

  static async updateRole(id: string, updates: Partial<Role>): Promise<Role | null> {
    const roleIndex = mockRoles.findIndex((role) => role.id === id)
    if (roleIndex === -1) return null

    mockRoles[roleIndex] = { ...mockRoles[roleIndex], ...updates, updatedAt: new Date() }
    return mockRoles[roleIndex]
  }

  static async deleteRole(id: string): Promise<boolean> {
    const roleIndex = mockRoles.findIndex((role) => role.id === id)
    if (roleIndex === -1) return false

    mockRoles.splice(roleIndex, 1)
    return true
  }
}
