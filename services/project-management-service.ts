import type {
  Project,
  CreateProjectData,
  Phase,
} from "@/types/project-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

function getCurrentPhaseName(phases: Phase[] | undefined): string {
  if (!phases || phases.length === 0) return "-";

  const lastPhase = [...phases].sort((a, b) => {
    const aTime = new Date(a.startDate || a.createdAt || "").getTime();
    const bTime = new Date(b.startDate || b.createdAt || "").getTime();
    return aTime - bTime;
  })[phases.length - 1];

  if (!lastPhase?.name) return "-";

  // Handle enum values properly
  const name = lastPhase.name.toString().toUpperCase();
  switch (name) {
    case "ANALYSIS":
      return "Analysis";
    case "DESIGN":
      return "Design";
    case "DEVELOPMENT":
      return "Development";
    case "DEPLOY":
      return "Deployment"; // Map DEPLOY to Deployment for consistency with UI
    default:
      // Fallback: capitalize first letter
      const pretty = lastPhase.name.toString().toLowerCase();
      return pretty.charAt(0).toUpperCase() + pretty.slice(1);
  }
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
      console.log("Fetching project by ID:", id);
      const response = await Axios.get(
        `http://localhost:3000/api/project?id=${id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("getProjectById API response:", response.data);
      console.log("Response success:", response.data.success);
      console.log("Response data:", response.data.data);
      console.log("Response data type:", typeof response.data.data);
      console.log("Response data length:", response.data.data?.length);

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching project");
      }

      const project = response.data.data[0] || response.data.data || null;
      console.log("Returning project:", project);
      return project;
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
      console.log("Creating project with data:", projectData);

      // Validar datos requeridos
      if (!projectData.name || !projectData.description) {
        throw new Error("Name and description are required");
      }

      if (!projectData.workTeam_id || !projectData.estimate_id) {
        throw new Error("WorkTeam ID and Estimate ID are required");
      }

      // Crear FormData en lugar de JSON
      const formData = new FormData();
      formData.append("name", projectData.name);
      formData.append("description", projectData.description);
      formData.append("expectedDuration", projectData.expectedDuration || "");
      formData.append("startDate", projectData.startDate);
      formData.append("endDate", projectData.endDate || "");
      formData.append("imagePreviewUrl", projectData.imagePreviewUrl || "");

      // Validar que los IDs sean números válidos
      const workTeamId = Number(projectData.workTeam_id);
      const estimateId = Number(projectData.estimate_id);

      if (isNaN(workTeamId) || workTeamId <= 0) {
        throw new Error("Valid WorkTeam ID is required");
      }
      if (isNaN(estimateId) || estimateId <= 0) {
        throw new Error("Valid Estimate ID is required");
      }

      formData.append("workTeam_id", workTeamId.toString());
      formData.append("estimate_id", estimateId.toString());

      // Agregar phases como JSON string
      console.log("Phases being sent to API:", projectData.phases);
      formData.append("phases", JSON.stringify(projectData.phases));

      const response = await fetch("http://localhost:3000/api/project", {
        method: "POST",
        // No establecer Content-Type para FormData, el browser lo hace automáticamente
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create response error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Create response:", data);

      if (data.data && data.data[0]) {
        console.log("Created project phases:", data.data[0].phases);
      }

      if (!data.success) {
        throw new Error(data.message || "Error creating project");
      }

      return data.data[0] || data.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  static async updateProject(
    id: string,
    updates: Partial<CreateProjectData>
  ): Promise<Project | null> {
    try {
      console.log("Updating project with data:", updates);

      // Crear FormData para el PATCH también
      const formData = new FormData();

      if (updates.name) formData.append("name", updates.name);
      if (updates.description)
        formData.append("description", updates.description);
      if (updates.expectedDuration)
        formData.append("expectedDuration", updates.expectedDuration);
      if (updates.startDate) formData.append("startDate", updates.startDate);
      if (updates.endDate) formData.append("endDate", updates.endDate);
      if (updates.imagePreviewUrl)
        formData.append("imagePreviewUrl", updates.imagePreviewUrl);
      if (updates.workTeam_id) {
        const workTeamId = Number(updates.workTeam_id);
        if (!isNaN(workTeamId) && workTeamId > 0) {
          formData.append("workTeam_id", workTeamId.toString());
        }
      }
      if (updates.estimate_id) {
        const estimateId = Number(updates.estimate_id);
        if (!isNaN(estimateId) && estimateId > 0) {
          formData.append("estimate_id", estimateId.toString());
        }
      }
      if (updates.phases)
        formData.append("phases", JSON.stringify(updates.phases));

      const response = await fetch(
        `http://localhost:3000/api/project?id=${id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update response error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Update response:", data);

      if (!data.success) {
        throw new Error(data.message || "Error updating project");
      }

      return data.data[0] || data.data;
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
