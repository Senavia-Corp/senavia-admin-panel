import type {
  ProjectRecord,
  CreateProjectData,
  
} from "@/types/project-management";

// Mock data
const mockProjects: ProjectRecord[] = [
  {
    id: "0001",
    name: "Senavia Corp Website Redesign",
    description: "Complete redesign of corporate website with modern UI/UX",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    currentPhase: "Development",
    projectType: "Web",
    workTeamId: "1",
    estimateId: "1",
    attendant: "John Doe",
    status: "In Progress",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    name: "E-commerce Platform",
    description: "New e-commerce platform with integrated payment system",
    startDate: "2022-06-10",
    endDate: "2024-07-10",
    currentPhase: "Design",
    projectType: "Web",
    workTeamId: "1",
    estimateId: "1",
    attendant: "John Doe",
    status: "On Hold",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    name: "Mobile Application",
    description: "Cross-platform mobile app for customer service",
    startDate: "2025-01-12",
    endDate: "2021-02-26",
    currentPhase: "Analysis",
    projectType: "Mobile",
    workTeamId: "1",
    estimateId: "1",
    attendant: "John Doe",
    status: "Active",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    name: "Digital Marketing Campaign",
    description: "Q1 2024 digital marketing campaign",
    startDate: "2026-06-04",
    endDate: "2024-03-08",
    currentPhase: "Deployment",
    projectType: "Marketing",
    workTeamId: "1",
    estimateId: "1",
    attendant: "John Doe",
    status: "Completed",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
];

export class ProjectManagementService {
  static async getProjects(
    search?: string,
    phaseFilter?: string
  ): Promise<ProjectRecord[]> {
    let filteredProjects = [...mockProjects];

    if (search) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(search.toLowerCase()) ||
          project.currentPhase.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (phaseFilter && phaseFilter !== "all") {
      filteredProjects = filteredProjects.filter(
        (project) => project.currentPhase === phaseFilter
      );
    }

    return filteredProjects;
  }

  static async getProjectById(id: string): Promise<ProjectRecord | null> {
    return mockProjects.find((project) => project.id === id) || null;
  }

  static async createProject(
    projectData: CreateProjectData
  ): Promise<ProjectRecord> {
    const newProject: ProjectRecord = {
      id: (mockProjects.length + 1).toString().padStart(4, "0"),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjects.push(newProject);
    return newProject;
  }

  static async updateProject(
    id: string,
    updates: Partial<ProjectRecord>
  ): Promise<ProjectRecord | null> {
    const projectIndex = mockProjects.findIndex((project) => project.id === id);
    if (projectIndex === -1) return null;

    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return mockProjects[projectIndex];
  }

  static async deleteProject(id: string): Promise<boolean> {
    const projectIndex = mockProjects.findIndex((project) => project.id === id);
    if (projectIndex === -1) return false;

    mockProjects.splice(projectIndex, 1);
    return true;
  }

  static getProjectPhases(): ProjectPhase[] {
    return ["Analysis", "Design", "Development", "Deployment"];
  }
}
