import type {
  User,
  UserRole,
  UserRequest,
  UserProject,
  ProjectUpdate,
  ChatMessage,
  CreateUserData,
} from "@/types/user-management"

// Mock data
const mockRoles: UserRole[] = [
  { id: "1", name: "Administrator", color: "#A7DB3F", permissions: ["all"] },
  { id: "2", name: "Customer", color: "#8B5CF6", permissions: ["view_own"] },
  { id: "3", name: "Developer", color: "#33CCCC", permissions: ["manage_projects"] },
  { id: "4", name: "Designer", color: "#F59E0B", permissions: ["manage_design"] },
]

const mockUsers: User[] = [
  {
    id: "0001",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: mockRoles[0],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, City, State",
    role: mockRoles[1],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
]

const mockRequests: UserRequest[] = [
  {
    id: "1",
    userId: "0002",
    name: "Website Redesign",
    service: "Web Design",
    companyPlan: "Premium",
    description: "Complete website redesign with modern UI/UX",
    status: "Processing",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
]

const mockProjects: UserProject[] = [
  {
    id: "1",
    userId: "0002",
    name: "E-commerce Platform",
    backgroundImage: "/placeholder.svg?height=200&width=300",
    status: "In Progress",
    phase: "Development",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
  },
]

export class UserManagementService {
  static async getUsers(search?: string, roleFilter?: string): Promise<User[]> {
    let filteredUsers = [...mockUsers]

    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (roleFilter) {
      filteredUsers = filteredUsers.filter((user) => user.role.id === roleFilter)
    }

    return filteredUsers
  }

  static async getUserById(id: string): Promise<User | null> {
    return mockUsers.find((user) => user.id === id) || null
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    const newUser: User = {
      id: (mockUsers.length + 1).toString().padStart(4, "0"),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      role: mockRoles.find((role) => role.id === userData.roleId) || mockRoles[1],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUsers.push(newUser)
    return newUser
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updatedAt: new Date() }
    return mockUsers[userIndex]
  }

  static async deleteUser(id: string): Promise<boolean> {
    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) return false

    mockUsers.splice(userIndex, 1)
    return true
  }

  static async getUserRoles(): Promise<UserRole[]> {
    return mockRoles
  }

  static async getUserRequests(userId: string): Promise<UserRequest[]> {
    return mockRequests.filter((request) => request.userId === userId)
  }

  static async getUserProjects(userId: string): Promise<UserProject[]> {
    return mockProjects.filter((project) => project.userId === userId)
  }

  static async getProjectUpdates(projectId: string): Promise<ProjectUpdate[]> {
    return [
      {
        id: "1",
        projectId,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
        documents: [
          { id: "1", name: "Document1.docx", url: "#", type: "docx" },
          { id: "2", name: "Document2.docx", url: "#", type: "docx" },
        ],
        createdAt: new Date("2024-01-20"),
        createdBy: "Team Member",
      },
    ]
  }

  static async getChatMessages(entityId: string, entityType: "request" | "project"): Promise<ChatMessage[]> {
    return [
      {
        id: "1",
        senderId: "admin1",
        senderName: "Admin",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
        timestamp: new Date("2024-01-20T10:00:00"),
        isAdmin: true,
      },
      {
        id: "2",
        senderId: "user1",
        senderName: "User",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
        timestamp: new Date("2024-01-20T10:05:00"),
        isAdmin: false,
      },
    ]
  }
}
