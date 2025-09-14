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
import type {
  Project,
  ProjectPhase,
  PhaseName,
} from "@/types/project-management";
import { toast } from "@/components/ui/use-toast";

interface ProjectEditorProps {
  projectId?: number;
  onBack: () => void;
  onSave: () => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  expectedDuration: string;
  currentPhase: ProjectPhase;
  status: string;
  startDate: string;
  endDate: string;
  imagePreviewUrl: string;
  workTeam_id: number;
  estimate_id: number;
}

export function ProjectEditor({projectId,onBack,onSave,
}: ProjectEditorProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    expectedDuration: "",
    currentPhase: "Analysis",
    status: "Active",
    startDate: "",
    endDate: "",
    imagePreviewUrl: "",
    workTeam_id: 0,
    estimate_id: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        try {
          //const project = await ProjectManagementService.getProjectById(projectId);
          const project=""
          /*if (project) {
            setFormData({
              name: project.name,
              description: project.description,
              currentPhase: currentPhase as ProjectPhase,
              status: "Active",
              startDate: project.startDate,
              endDate: project.endDate,
              imagePreviewUrl: project.imagePreviewUrl || "",
              workTeam_id: project.workTeam_id?.id || 0,
              estimate_id: project.estimate_id?.id || 0,
            });
          }*/
        } catch (error) {
          console.error("Error loading project:", error);
          toast({
            title: "Error",
            description: "Failed to load project details",
            variant: "destructive",
          });
        }
      }
    };

    loadProject();
  }, [projectId]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Create payload similar to backend expectations
      const phaseEnum: Record<ProjectPhase, PhaseName> = {
        Analysis: "ANALYSIS",
        Design: "DESIGN",
        Development: "DEVELOPMENT",
        Deployment: "DEPLOY",
      };
      const projectData = {
        name: formData.name,
        description: formData.description,
        expectedDuration: formData.expectedDuration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        imagePreviewUrl: formData.imagePreviewUrl,
        phases: [
          {
            name: phaseEnum[formData.currentPhase],
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
        ],
        workTeam_id: formData.workTeam_id,
        estimate_id: formData.estimate_id,
      };

      if (projectId) {
        //await ProjectManagementService.updateProject(projectId, projectData);
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

  //const phases: ProjectPhase[] = ProjectManagementService.getProjectPhases();
  const phases: ProjectPhase[] = [
    "Analysis",
    "Design",
    "Development",
    "Deployment",
  ];

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
            <div>
              <Label className="text-sm font-medium text-gray-700">ID</Label>
              <Input
                value={projectId || "0000"}
                disabled
                placeholder="0000"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Estimated Id
              </Label>
              <Input
                value={formData.estimate_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimate_id: parseInt(e.target.value),
                  })
                }
                placeholder="estimate_Id"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                WorkTeam Id
              </Label>
              <Input
                value={formData.workTeam_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workTeam_id: parseInt(e.target.value),
                  })
                }
                placeholder="work_team_Id"
                className="mt-1"
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
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sodales nibh. Fusce fermentum dapibus arcu, id hendrerit odio consectetur vitae."
                className="mt-1 min-h-[100px]"
                maxLength={200}
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {formData.description.length}/200
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Current Phase
              </Label>
              <Select
                value={formData.currentPhase}
                onValueChange={(value: ProjectPhase) =>
                  setFormData({ ...formData, currentPhase: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Dropdown here" />
                </SelectTrigger>
                <SelectContent>
                  {/*phases.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))*/}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Expected Duration
              </Label>
              <Input
                value={formData.expectedDuration}
                onChange={(e) =>
                  setFormData({ ...formData, expectedDuration: e.target.value })
                }
                placeholder="Attendant"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Expected Duration
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
