import type {
  ProjectPhaseDetail,
  CreatePhaseData,
  UpdatePhaseData,
} from "@/types/phase-management";

export class PhaseManagementService {
  static async getPhasesByProject(
    projectId: number
  ): Promise<ProjectPhaseDetail[]> {
    try {
      // Por ahora retornamos datos mock, pero esto debería conectar con el API
      return this.getMockPhases(projectId);
    } catch (error: any) {
      console.error("Error fetching phases:", error);
      throw new Error("Error al obtener fases. Por favor, intente nuevamente.");
    }
  }

  static async createPhase(
    phaseData: CreatePhaseData
  ): Promise<ProjectPhaseDetail> {
    try {
      // Mock implementation - en producción esto debería llamar al API
      const newPhase: ProjectPhaseDetail = {
        id: Math.floor(Math.random() * 10000),
        ...phaseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Created phase:", newPhase);
      return newPhase;
    } catch (error: any) {
      console.error("Error creating phase:", error);
      throw new Error("Error al crear fase. Por favor, intente nuevamente.");
    }
  }

  static async updatePhase(
    phaseId: number,
    updates: UpdatePhaseData
  ): Promise<ProjectPhaseDetail> {
    try {
      // Mock implementation
      const updatedPhase: ProjectPhaseDetail = {
        id: phaseId,
        ...updates,
        projectId: updates.projectId || 0, // This should come from the existing phase
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Updated phase:", updatedPhase);
      return updatedPhase;
    } catch (error: any) {
      console.error("Error updating phase:", error);
      throw new Error(
        "Error al actualizar fase. Por favor, intente nuevamente."
      );
    }
  }

  static async deletePhase(phaseId: number): Promise<boolean> {
    try {
      // Mock implementation
      console.log("Deleted phase:", phaseId);
      return true;
    } catch (error: any) {
      console.error("Error deleting phase:", error);
      throw new Error("Error al eliminar fase. Por favor, intente nuevamente.");
    }
  }

  static getPhaseStatuses() {
    return ["Not Started", "In Progress", "Completed", "On Hold"] as const;
  }

  static getPhaseNames() {
    return ["Analysis", "Design", "Development", "Deployment"] as const;
  }

  // Datos mock para desarrollo
  private static getMockPhases(projectId: number): ProjectPhaseDetail[] {
    return [
      {
        id: 1,
        name: "Analysis",
        description: "Initial project analysis and requirements gathering",
        startDate: "2024-01-15",
        endDate: "2024-01-30",
        status: "Completed",
        progress: 100,
        projectId,
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-01-30T00:00:00Z",
      },
      {
        id: 2,
        name: "Design",
        description: "UI/UX design and system architecture",
        startDate: "2024-02-01",
        endDate: "2024-02-20",
        status: "In Progress",
        progress: 75,
        projectId,
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-15T00:00:00Z",
      },
      {
        id: 3,
        name: "Development",
        description: "Core development and implementation",
        startDate: "2024-02-21",
        endDate: "2024-04-30",
        status: "Not Started",
        progress: 0,
        projectId,
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-01T00:00:00Z",
      },
      {
        id: 4,
        name: "Testing & Deployment",
        description: "Quality assurance, testing, and deployment",
        startDate: "2024-05-01",
        endDate: "2024-05-15",
        status: "Not Started",
        progress: 0,
        projectId,
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-01T00:00:00Z",
      },
    ];
  }
}
