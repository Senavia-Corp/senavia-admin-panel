import type {
  Project,
  CreateProjectData,
  Phase,
} from "@/types/project-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

function getCurrentPhaseName(phases: Phase[] | undefined): string {
  if (!phases || phases.length === 0) return "-";
  const last = [...phases].sort((a, b) => {
    const aTime = new Date(a.startDate || a.createdAt || "").getTime();
    const bTime = new Date(b.startDate || b.createdAt || "").getTime();
    return aTime - bTime;
  })[phases.length - 1];

  // Names come as enum uppercase: ANALYSIS, DESIGN, DEVELOPMENT, DEPLOY
  const pretty = last.name?.toString().toLowerCase();
  if (!pretty) return "-";
  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
}

export class ProjectManagementService {
  static async getProjects(
    search?: string,
    phaseFilter?: string
  ): Promise<Project[]> {
    try {
      const response = await Axios.get("http://localhost:3000/api/project", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching projects");
      }

      let projects: Project[] = response.data.data;

      if (search) {
        projects = projects.filter((project: Project) => {
          const currentPhase = getCurrentPhaseName(project.phases);
          return (
            project.name.toLowerCase().includes(search.toLowerCase()) ||
            currentPhase.toLowerCase().includes(search.toLowerCase())
          );
        });
      }

      if (phaseFilter && phaseFilter !== "all") {
        projects = projects.filter((project: Project) => {
          const currentPhase = getCurrentPhaseName(project.phases);
          return currentPhase.toLowerCase() === phaseFilter.toLowerCase();
        });
      }

      return projects;
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener proyectos. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async getProjectById(id: string): Promise<Project | null> {
    try {
      const response = await Axios.get(
        `http://localhost:3000/api/project?id=${id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching project");
      }

      return response.data.data[0] || null;
    } catch (error: any) {
      console.error("Error fetching project:", error);
      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener el proyecto. Por favor, intente nuevamente."
        );
      }
    }
  }

  static async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const response = await fetch("http://localhost:3000/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error creating project");
      }

      return data.data[0];
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  static async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<Project | null> {
    try {
      const response = await fetch(
        `http://localhost:3000/api/project?id=${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error updating project");
      }

      return data.data[0];
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  static async deleteProject(id: string): Promise<boolean> {
    try {
      const response = await fetch(
        `http://localhost:3000/api/project?id=${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error deleting project");
      }

      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }

/*  static getProjectPhases(): ProjectPhase[] {
    return ["Analysis", "Design", "Development", "Deployment"];
  }*/
 
  static async getProjectsByUser(
    userId: string | number,
    search?: string,
    phaseFilter?: string
  ): Promise<Project[]> {
    try {
      const response = await Axios.get(
        endpoints.project.getPostsByUser(userId),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error fetching user projects"
        );
      }

      let projects: Project[] = response.data.data;

      if (search) {
        projects = projects.filter((project: Project) => {
          const currentPhase = getCurrentPhaseName(project.phases);
          return (
            project.name.toLowerCase().includes(search.toLowerCase()) ||
            currentPhase.toLowerCase().includes(search.toLowerCase())
          );
        });
      }

      if (phaseFilter && phaseFilter !== "all") {
        projects = projects.filter((project: Project) => {
          const currentPhase = getCurrentPhaseName(project.phases);
          return currentPhase.toLowerCase() === phaseFilter.toLowerCase();
        });
      }

      return projects;
    } catch (error: any) {
      console.error("Error fetching user projects:", error);
      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener proyectos del usuario. Por favor, intente nuevamente."
        );
      }
    }
  }
}
