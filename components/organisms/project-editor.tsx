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
import type { ProjectPhase } from "@/types/project-management";
import { toast } from "@/components/ui/use-toast";

interface ProjectEditorProps {
  projectId?: string;
  onBack: () => void;
  onSave: () => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  currentPhase: ProjectPhase;
  projectType: string;
  status: string;
  startDate: string;
  endDate: string;
}

export function ProjectEditor({
  projectId,
  onBack,
  onSave,
}: ProjectEditorProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    currentPhase: "Analysis",
    projectType: "",
    status: "Active",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        try {
          const project = await ProjectManagementService.getProjectById(
            projectId
          );
          if (project) {
            setFormData({
              name: project.name,
              description: project.description,
              currentPhase: project.currentPhase,
              projectType: project.projectType,
              status: project.status,
              startDate: project.startDate,
              endDate: project.endDate,
            });
          }
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
      if (projectId) {
        await ProjectManagementService.updateProject(projectId, formData);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        await ProjectManagementService.createProject(formData);
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

  const phases: ProjectPhase[] = ProjectManagementService.getProjectPhases();

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
                placeholder="Enter description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
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
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {phase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Project Type
                </Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectType: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Project Duration
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
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-[#95C11F] hover:bg-[#84AD1B] text-white py-3"
            >
              {isLoading
                ? "Saving..."
                : projectId
                ? "Update Project"
                : "Create Project"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
