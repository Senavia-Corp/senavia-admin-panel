import type {
  User,
  UserRole,
  UserRequest,
  UserProject,
  ProjectUpdate,
  ChatMessage,
  CreateUserData,
  Permission,
} from "@/types/user-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

// Mock data
const defaultRole: UserRole = {
  id: 1,
  name: "User",
  description: "Default user role",
  active: true,
  color: "#A133CC",
};

const mockUsers: User[] = [
  {
    id: "0001",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: defaultRole,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, City, State",
    role: defaultRole,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: defaultRole,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0004",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: defaultRole,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0005",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: defaultRole,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0006",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State",
    role: defaultRole,
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
        users = users.filter(
          (user: User) => user.role.id === parseInt(roleFilter)
        );
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
    try {
      const formData = new FormData();

      // Agregar todos los campos requeridos al FormData
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("roleId", userData.roleId.toString());

      // Agregar imagen si existe
      if (userData.imageUrl) {
        formData.append("imageUrl", userData.imageUrl);
      }

      // Agregar permisos si existen
      if (userData.permissions && userData.permissions.length > 0) {
        formData.append("permissions", userData.permissions.join(","));
      }

      const response = await Axios.post(endpoints.auth.register, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error creating user");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Error creating user:", error);

      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error creating user. Please try again.");
      }
    }
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
    try {
      const response = await Axios.get(endpoints.user.getRoles, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching roles");
      }

      // Usar directamente la respuesta del backend y agregar colores
      const userRoles: UserRole[] = response.data.data
        .filter((role: UserRole) => role.active) // Solo roles activos
        .map((role: UserRole) => ({
          ...role,
          color: this.getDefaultRoleColor(role.name), // TODO: No tan necesario
        }));

      return userRoles;
    } catch (error: any) {
      console.error("Error fetching roles:", error);

      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error fetching roles. Please try again.");
      }
    }
  }

  static async getPermissions(): Promise<Permission[]> {
    try {
      const response = await Axios.get(endpoints.user.getPermissions, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching permissions");
      }

      // Filtrar solo permisos activos
      const permissions: Permission[] = response.data.data.filter(
        (permission: Permission) => permission.active
      );

      return permissions;
    } catch (error: any) {
      console.error("Error fetching permissions:", error);

      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error fetching permissions. Please try again.");
      }
    }
  }

  // Método para obtener un rol por ID
  static async getRoleById(roleId: number): Promise<UserRole> {
    // TODO: Remove this
    const roles = await this.getUserRoles();
    const role = roles.find((r) => r.id === roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    return role;
  }

  // Método auxiliar para asignar colores por defecto a los roles
  private static getDefaultRoleColor(roleName: string): string {
    const colorMap: Record<string, string> = {
      Administrador: "#99CC33",
      SUPERADMINISTRAITOR: "#FF6B6B",
      User: "#A133CC",
      Client: "#33CCCC",
      GORDO: "#F59E0B",
      STAKEOLDER: "#8B5CF6",
      STAKEOLDERTHEENTERPRISE: "#10B981",
    };

    return colorMap[roleName] || "#6B7280"; // Color gris por defecto
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
