import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";
import type {
  Estimate,
  WorkTeam,
  EstimateOption,
  WorkTeamOption,
  PhaseOption,
} from "@/types/estimate-management";
import type { Project, Phase, PhaseName } from "@/types/project-management";

export class EstimateManagementService {
  static async getEstimates(): Promise<Estimate[]> {
    try {
      const response = await Axios.get(endpoints.estimate.getEstimates, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching estimates");
      }

      return response.data.data || [];
    } catch (error: any) {
      console.error("Error fetching estimates:", error);
      throw new Error(
        "Error al obtener estimados. Por favor, intente nuevamente."
      );
    }
  }

  static async getEstimateOptions(): Promise<EstimateOption[]> {
    try {
      const estimates = await this.getEstimates();

      return estimates.map((estimate) => ({
        id: estimate.id,
        name: `Estimate #${estimate.id} - ${estimate.title}`,
        subtitle: `${estimate.clientName || "N/A"} - ${
          estimate.description?.substring(0, 50) || "No description"
        }${
          estimate.description && estimate.description.length > 50 ? "..." : ""
        }`,
      }));
    } catch (error) {
      console.error("Error getting estimate options:", error);
      return [];
    }
  }

  static async getWorkTeams(): Promise<WorkTeam[]> {
    try {
      // Nota: Asumiendo que existe un endpoint para workteams
      // Si no existe, necesitaremos crearlo en el backend
      const response = await Axios.get("http://localhost:3000/api/workteam", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching work teams");
      }

      return response.data.data || [];
    } catch (error: any) {
      console.error("Error fetching work teams:", error);
      // Si el endpoint no existe, retornamos datos mock por ahora
      return this.getMockWorkTeams();
    }
  }

  static async getWorkTeamOptions(): Promise<WorkTeamOption[]> {
    try {
      const workTeams = await this.getWorkTeams();

      return workTeams.map((team) => ({
        id: team.id,
        name: team.name,
        subtitle: `${team.area} - ${team.state}`,
      }));
    } catch (error) {
      console.error("Error getting work team options:", error);
      return [];
    }
  }

  // Datos mock mientras se implementa el endpoint
  private static getMockWorkTeams(): WorkTeam[] {
    return [
      {
        id: 1,
        name: "Frontend Team",
        description: "Equipo especializado en desarrollo frontend",
        state: "Available",
        area: "Development",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Backend Team",
        description: "Equipo especializado en desarrollo backend",
        state: "Busy",
        area: "Development",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Design Team",
        description: "Equipo de diseño UX/UI",
        state: "Available",
        area: "Design",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Marketing Team",
        description: "Equipo de marketing digital",
        state: "Active",
        area: "Marketing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  static createPhaseOptions(project: Project | null): PhaseOption[] {
    if (!project || !project.phases || project.phases.length === 0) {
      // Si no hay fases, crear opciones por defecto
      // IMPORTANTE: Empezar desde ID 1, no 0, para evitar problemas con valores falsy
      return [
        {
          id: 1,
          name: "Analysis",
          subtitle: "Initial phase - Not started",
        },
        {
          id: 2,
          name: "Design",
          subtitle: "Design phase - Not started",
        },
        {
          id: 3,
          name: "Development",
          subtitle: "Development phase - Not started",
        },
        {
          id: 4,
          name: "Deployment",
          subtitle: "Final phase - Not started",
        },
      ];
    }

    // Crear opciones basadas en las fases reales del proyecto
    return project.phases.map((phase) => {
      const phaseName = this.getPhaseDisplayName(phase.name);
      const startDate = phase.startDate
        ? new Date(phase.startDate).toLocaleDateString("es-ES")
        : "No date";
      const endDate = phase.endDate
        ? new Date(phase.endDate).toLocaleDateString("es-ES")
        : "Ongoing";

      return {
        id: phase.id,
        name: phaseName,
        subtitle: `${startDate} - ${endDate}`,
      };
    });
  }

  static getPhaseDisplayName(phaseName: any): string {
    const nameStr = String(phaseName).toUpperCase();
    switch (nameStr) {
      case "ANALYSIS":
        return "Analysis";
      case "DESIGN":
        return "Design";
      case "DEVELOPMENT":
        return "Development";
      case "DEPLOY":
        return "Deployment";
      default:
        return String(phaseName);
    }
  }

  static getCurrentPhaseId(project: Project): number {
    if (!project.phases || project.phases.length === 0) {
      return 1; // Default to Analysis ID (changed from 0 to 1)
    }

    // Get the most recent phase (last in chronological order)
    const lastPhase = [...project.phases]
      .sort((a, b) => {
        const aTime = new Date(a.startDate || a.createdAt || "").getTime();
        const bTime = new Date(b.startDate || b.createdAt || "").getTime();
        return aTime - bTime;
      })
      .pop();

    return lastPhase?.id || 0;
  }
}
