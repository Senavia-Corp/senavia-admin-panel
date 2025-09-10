import type {
  User,
  UserRole,
  UserRequest,
  UserProject,
  ProjectUpdate,
  ChatMessage,
  CreateUserData,
} from "@/types/user-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

// Mock data
const mockRoles: UserRole[] = [
  { id: "1", name: "Administrator", color: "#99CC33", permissions: ["all"] },
  { id: "2", name: "Customer", color: "#A133CC", permissions: ["view_own"] },
  {
    id: "3",
    name: "Developer",
    color: "#33CCCC",
    permissions: ["manage_projects"],
  },
  {
    id: "4",
    name: "Designer",
    color: "#F59E0B",
    permissions: ["manage_design"],
  },
];

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
  {
    id: "0003",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: mockRoles[0],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0004",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: mockRoles[0],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0005",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: mockRoles[0],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0006",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: mockRoles[0],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
];

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
];

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
];

export class UserManagementService {
  static async getUsers(search?: string, roleFilter?: string): Promise<User[]> {
    try {
      const response = await Axios.get(endpoints.user.getUsers, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching users");
      }

      let users = response.data.data;

      // Apply client-side filtering if needed
      if (search) {
        users = users.filter(
          (user: User) =>
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user.phone?.includes(search)
        );
      }

      if (roleFilter && roleFilter !== "all") {
        users = users.filter((user: User) => user.role.id === roleFilter);
      }

      return users;
    } catch (error: any) {
      console.error("Error fetching users:", error);

      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error fetching users. Please try again.");
      }
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    return mockUsers.find((user) => user.id === id) || null;
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    const newUser: User = {
      id: (mockUsers.length + 1).toString().padStart(4, "0"),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      role:
        mockRoles.find((role) => role.id === userData.roleId) || mockRoles[1],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.push(newUser);
    return newUser;
  }

  static async patchUser(
    id: string,
    userData: {
      name?: string;
      phone?: string;
      password?: string;
      imageUrl?: File;
      address?: string;
      roleId?: number;
    }
  ): Promise<User> {
    try {
      const formData = new FormData();

      // Add all provided fields to FormData
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(
            key,
            value instanceof File ? value : value.toString()
          );
        }
      });

      const response = await Axios.patch(
        `${endpoints.user.updateUser}?id=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error updating user");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Error updating user:", error);

      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error updating user. Please try again.");
      }
    }
  }

  private static normalizeUserResponse(user: any): User {
    return Array.isArray(user) ? (user[0] as User) : (user as User);
  }

  static async patchUserWithForm(
    id: string,
    values: {
      name?: string;
      address?: string;
      password?: string;
      profileImage?: File | null;
    },
    options?: {
      passwordPlaceholder?: string;
      includeName?: boolean;
      includeAddress?: boolean;
    }
  ): Promise<User> {
    const includeName = options?.includeName ?? false;
    const includeAddress = options?.includeAddress ?? false;
    const passwordPlaceholder = options?.passwordPlaceholder;

    const payload: {
      name?: string;
      address?: string;
      password?: string;
      imageUrl?: File;
    } = {};

    if (includeName && values.name !== undefined) {
      payload.name = values.name;
    }
    if (includeAddress && values.address !== undefined) {
      payload.address = values.address;
    }
    if (
      values.password !== undefined &&
      values.password !== null &&
      values.password !== "" &&
      values.password !== passwordPlaceholder
    ) {
      payload.password = values.password;
    }
    if (values.profileImage) {
      payload.imageUrl = values.profileImage;
    }

    const raw = await this.patchUser(id, payload);
    return this.normalizeUserResponse(raw);
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await Axios.delete(
        endpoints.user.deleteUser(parseInt(id)),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error deleting user");
      }

      return true;
    } catch (error: any) {
      console.error("Error deleting user:", error);

      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error deleting user. Please try again.");
      }
    }
  }

  static async getUserRoles(): Promise<UserRole[]> {
    return mockRoles;
  }

  static async getUserRequests(userId: string): Promise<UserRequest[]> {
    return mockRequests.filter((request) => request.userId === userId);
  }

  static async getUserProjects(userId: string): Promise<UserProject[]> {
    return mockProjects.filter((project) => project.userId === userId);
  }

  static async getProjectUpdates(projectId: string): Promise<ProjectUpdate[]> {
    return [
      {
        id: "1",
        projectId,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
        documents: [
          { id: "1", name: "Document1.docx", url: "#", type: "docx" },
          { id: "2", name: "Document2.docx", url: "#", type: "docx" },
        ],
        createdAt: new Date("2024-01-20"),
        createdBy: "Team Member",
      },
    ];
  }

  static async getChatMessages(
    entityId: string,
    entityType: "request" | "project"
  ): Promise<ChatMessage[]> {
    return [
      {
        id: "1",
        senderId: "admin1",
        senderName: "Admin",
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
        timestamp: new Date("2024-01-20T10:00:00"),
        isAdmin: true,
      },
      {
        id: "2",
        senderId: "user1",
        senderName: "User",
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh.",
        timestamp: new Date("2024-01-20T10:05:00"),
        isAdmin: false,
      },
    ];
  }
}
