"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { ProjectManagementService } from "@/services/project-management-service";
import { EstimateManagementService } from "@/services/estimate-management-service";
import type { Project, ProjectPhase } from "@/types/project-management";
import type {
  EstimateOption,
  WorkTeamOption,
  PhaseOption,
} from "@/types/estimate-management";
import { PhaseName } from "@/types/project-management";
import { toast } from "@/components/ui/use-toast";
import { GenericDropdown } from "@/components/atoms/generic-dropdown";

interface ProjectEditorProps {
  projectId?: number;
  onBack: () => void;
  onSave: () => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  expectedDuration: string;
  currentPhase: number; // ID de la fase seleccionada
  status: string;
  startDate: string;
  endDate: string;
  imagePreviewUrl: string;
  workTeam_id: number;
  estimate_id: number;
}

export function ProjectEditor({
  projectId,
  onBack,
  onSave,
}: ProjectEditorProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    expectedDuration: "",
    currentPhase: 1, // ID de la fase por defecto (Analysis = 1)
    status: "Active",
    startDate: "",
    endDate: "",
    imagePreviewUrl: "",
    workTeam_id: 0,
    estimate_id: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [estimateOptions, setEstimateOptions] = useState<EstimateOption[]>([]);
  const [workTeamOptions, setWorkTeamOptions] = useState<WorkTeamOption[]>([]);
  const [phaseOptions, setPhaseOptions] = useState<PhaseOption[]>([]);
  const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);
  const [isLoadingWorkTeams, setIsLoadingWorkTeams] = useState(false);
  const [estimatesError, setEstimatesError] = useState<string | null>(null);
  const [workTeamsError, setWorkTeamsError] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        console.log("Loading project with ID:", projectId);
        try {
          const project = await ProjectManagementService.getProjectById(
            projectId.toString()
          );
          console.log("Loaded project data:", project);

          if (project) {
            setCurrentProject(project);
            const phaseOptions =
              EstimateManagementService.createPhaseOptions(project);
            console.log(
              "Setting phase options for existing project:",
              phaseOptions
            );
            setPhaseOptions(phaseOptions);

            const currentPhaseId =
              EstimateManagementService.getCurrentPhaseId(project);
            console.log("Determined current phase ID:", currentPhaseId);

            // Handle different possible structures for relations
            let workTeamId = 0;
            let estimateId = 0;

            // Try different possible structures for workTeam_id
            if (typeof project.workTeam_id === "number") {
              workTeamId = project.workTeam_id;
            } else if (project.workTeam_id?.id) {
              workTeamId = project.workTeam_id.id;
            } else if ((project as any).workTeamId) {
              workTeamId = (project as any).workTeamId;
            }

            // Try different possible structures for estimate_id
            if (typeof project.estimate_id === "number") {
              estimateId = project.estimate_id;
            } else if (project.estimate_id?.id) {
              estimateId = project.estimate_id.id;
            } else if ((project as any).estimateId) {
              estimateId = (project as any).estimateId;
            }

            console.log("Mapping relations:", {
              originalWorkTeam: project.workTeam_id,
              mappedWorkTeamId: workTeamId,
              originalEstimate: project.estimate_id,
              mappedEstimateId: estimateId,
            });

            const newFormData = {
              name: project.name || "",
              description: project.description || "",
              expectedDuration: project.expectedDuration || "",
              currentPhase: currentPhaseId,
              status: "Active",
              startDate: project.startDate || "",
              endDate: project.endDate || "",
              imagePreviewUrl: project.imagePreviewUrl || "",
              workTeam_id: workTeamId,
              estimate_id: estimateId,
            };

            console.log("Setting form data:", newFormData);
            setFormData(newFormData);
          } else {
            console.log("No project data received");
          }
        } catch (error) {
          console.error("Error loading project:", error);
          toast({
            title: "Error",
            description: "Failed to load project details",
            variant: "destructive",
          });
        }
      } else {
        console.log("No projectId provided, using default form data");
        // Para proyectos nuevos, crear opciones de fases por defecto
        const defaultPhaseOptions =
          EstimateManagementService.createPhaseOptions(null);
        console.log(
          "Setting phase options for new project:",
          defaultPhaseOptions
        );
        setPhaseOptions(defaultPhaseOptions);
        setCurrentProject(null);
      }
    };

    loadProject();
    loadEstimateOptions();
    loadWorkTeamOptions();
  }, [projectId]);

  const loadEstimateOptions = async () => {
    setIsLoadingEstimates(true);
    setEstimatesError(null);
    try {
      const options = await EstimateManagementService.getEstimateOptions();
      setEstimateOptions(options);
    } catch (error) {
      console.error("Error loading estimate options:", error);
      setEstimatesError("Failed to load estimates");
    } finally {
      setIsLoadingEstimates(false);
    }
  };

  const loadWorkTeamOptions = async () => {
    setIsLoadingWorkTeams(true);
    setWorkTeamsError(null);
    try {
      const options = await EstimateManagementService.getWorkTeamOptions();
      setWorkTeamOptions(options);
    } catch (error) {
      console.error("Error loading work team options:", error);
      setWorkTeamsError("Failed to load work teams");
    } finally {
      setIsLoadingWorkTeams(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validar campos requeridos
      if (!formData.name.trim()) {
        toast({
          title: "Error",
          description: "Project name is required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        toast({
          title: "Error",
          description: "Project description is required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!formData.workTeam_id || formData.workTeam_id === 0) {
        toast({
          title: "Error",
          description: "WorkTeam ID is required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!formData.estimate_id || formData.estimate_id === 0) {
        toast({
          title: "Error",
          description: "Estimate ID is required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get the selected phase information
      const selectedPhase = phaseOptions.find(
        (p) => p.id === formData.currentPhase
      );
      const selectedPhaseName = selectedPhase ? selectedPhase.name : "Analysis";

      // Map phase name to enum
      const getPhaseEnum = (phaseName: string): PhaseName => {
        switch (phaseName.toLowerCase()) {
          case "analysis":
            return PhaseName.ANALYSIS;
          case "design":
            return PhaseName.DESIGN;
          case "development":
            return PhaseName.DEVELOPMENT;
          case "deployment":
            return PhaseName.DEPLOY;
          default:
            return PhaseName.ANALYSIS;
        }
      };

      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        expectedDuration: formData.expectedDuration || "",
        startDate: formData.startDate || new Date().toISOString().split("T")[0],
        endDate: formData.endDate || "",
        imagePreviewUrl: formData.imagePreviewUrl || "",
        phases: [
          {
            name: getPhaseEnum(selectedPhaseName),
            startDate:
              formData.startDate || new Date().toISOString().split("T")[0],
            endDate: formData.endDate || "",
          },
        ],
        workTeam_id: formData.workTeam_id,
        estimate_id: formData.estimate_id,
      };

      if (projectId) {
        await ProjectManagementService.updateProject(
          projectId.toString(),
          projectData
        );
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        await ProjectManagementService.createProject(projectData);
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }
      onSave();
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debug logging for render
  console.log("ProjectEditor render state:", {
    currentPhase: formData.currentPhase,
    phaseOptions: phaseOptions,
    phaseOptionsLength: phaseOptions.length,
    projectId: projectId,
  });

  function getPhaseLabel(project: Project): ProjectPhase {
    const lastPhase = (project.phases || [])
      .slice()
      .sort((a, b) => {
        const aTime = new Date(a.startDate || "").getTime();
        const bTime = new Date(b.startDate || "").getTime();
        return aTime - bTime;
      })
      .pop();
    const name = lastPhase?.name as PhaseName | undefined;
    switch (name) {
      case "ANALYSIS":
        return "Analysis";
      case "DESIGN":
        return "Design";
      case "DEVELOPMENT":
        return "Development";
      case "DEPLOY":
        return "Deployment";
      default:
        return "Analysis";
    }
  }

  return (
    <div className="h-full w-screen max-w-none px-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="bg-white rounded-lg p-8">
          <div className="space-y-6">
            {/* Solo mostrar el campo ID cuando se está editando un proyecto existente */}
            {projectId && (
              <div>
                <Label className="text-sm font-medium text-gray-700">ID</Label>
                <Input
                  value={projectId}
                  disabled
                  placeholder="0000"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Estimate *
              </Label>
              <GenericDropdown
                value={formData.estimate_id || undefined}
                onChange={(value, option) => {
                  setFormData({
                    ...formData,
                    estimate_id: value,
                  });
                }}
                placeholder="Select an estimate..."
                className="mt-1 w-full"
                options={estimateOptions}
                isLoading={isLoadingEstimates}
                error={estimatesError}
                searchFields={["name", "subtitle"]}
                displayField="name"
                subtitleField="subtitle"
                errorLabel="estimates"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Work Team *
              </Label>
              <GenericDropdown
                value={formData.workTeam_id || undefined}
                onChange={(value, option) => {
                  setFormData({
                    ...formData,
                    workTeam_id: value,
                  });
                }}
                placeholder="Select a work team..."
                className="mt-1 w-full"
                options={workTeamOptions}
                isLoading={isLoadingWorkTeams}
                error={workTeamsError}
                searchFields={["name", "subtitle"]}
                displayField="name"
                subtitleField="subtitle"
                errorLabel="work teams"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Project name"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Briefly describe your project. "
                className="mt-1 min-h-[100px]"
                maxLength={200}
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {formData.description.length}/200
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Current Phase *
              </Label>
              <GenericDropdown
                value={formData.currentPhase}
                onChange={(value, option) => {
                  console.log("Phase selection changed:", {
                    value,
                    option,
                    currentValue: formData.currentPhase,
                    valueType: typeof value,
                  });
                  setFormData({
                    ...formData,
                    currentPhase: value,
                  });
                }}
                placeholder="Select a phase..."
                className="mt-1 w-full"
                options={phaseOptions}
                isLoading={false}
                error={null}
                searchFields={["name", "subtitle"]}
                displayField="name"
                subtitleField="subtitle"
                errorLabel="phases"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Expected Duration (in months)
              </Label>
              <Input
                type="number"
                value={formData.expectedDuration}
                onChange={(e) =>
                  setFormData({ ...formData, expectedDuration: e.target.value })
                }
                placeholder="Enter duration in months (e.g., 6)"
                className="mt-1"
                min="1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Start Date / End Date
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  placeholder="Start Date"
                />
                <span className="px-2">-</span>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  placeholder="End Date"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-[#95C11F] hover:bg-[#84AD1B] text-white py-3"
            >
              {isLoading
                ? "Saving..."
                : projectId
                ? "Update Task"
                : "Add / Update Task"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
