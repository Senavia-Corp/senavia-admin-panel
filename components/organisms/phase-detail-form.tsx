"use client";

import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { PhaseManagementService } from "@/services/phase-management-service";
import { UpdatePhaseData } from "@/types/phase-management";
import { ProjectPhaseDetail } from "@/types/phase-management";
import { useToast } from "@/hooks/use-toast";

export function PhaseDetailForm({
  projectId,
  phaseId,
  phase,
  onBack,
  onUpdate,
}: {
  projectId: number;
  phaseId: number;
  phase: ProjectPhaseDetail;
  onBack?: () => void;
  onUpdate?: (updatedPhase: ProjectPhaseDetail) => void;
}) {
  const [loadingPost, setLoadingPost] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Not Started" as const,
    progress: 0,
  });

  // Cargar datos de la fase al montar el componente
  useEffect(() => {
    if (phase) {
      setFormData({
        name: phase.name,
        description: phase.description,
        startDate: phase.startDate,
        endDate: phase.endDate || "",
        status: phase.status,
        progress: phase.progress,
      });
    }
  }, [phase]);

  const handleUpdatePhase = async () => {
    try {
      // Validaciones
      if (!formData.name.trim()) {
        toast({
          title: "Error",
          description: "Phase name is required",
          variant: "destructive",
        });
        return;
      }

      if (!formData.description.trim()) {
        toast({
          title: "Error",
          description: "Phase description is required",
          variant: "destructive",
        });
        return;
      }

      if (!formData.startDate) {
        toast({
          title: "Error",
          description: "Start date is required",
          variant: "destructive",
        });
        return;
      }

      // Validar que la fecha de fin sea posterior a la de inicio
      if (formData.endDate && formData.startDate > formData.endDate) {
        toast({
          title: "Error",
          description: "End date must be after start date",
          variant: "destructive",
        });
        return;
      }

      setLoadingPost(true);

      const updateData: UpdatePhaseData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        status: formData.status,
        progress: formData.progress,
      };

      const updatedPhase = await PhaseManagementService.updatePhase(phaseId, {
        ...updateData,
        projectId,
      });

      toast({
        title: "Success",
        description: `Phase "${updatedPhase.name}" updated successfully`,
      });

      if (onUpdate) {
        onUpdate(updatedPhase);
      }

      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error("Error updating phase:", error);
      toast({
        title: "Error",
        description: "Failed to update phase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPost(false);
    }
  };

  const phaseStatuses = PhaseManagementService.getPhaseStatuses();

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
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Phase - {phase.name}
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="bg-white rounded-lg p-8">
          <div className="space-y-6">
            {/* Phase ID (read-only) */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Phase ID
              </Label>
              <Input value={phase.id} disabled className="mt-1 bg-gray-100" />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Phase Name *
              </Label>
              <Select
                value={formData.name}
                onValueChange={(value) =>
                  setFormData({ ...formData, name: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select phase name" />
                </SelectTrigger>
                <SelectContent>
                  {PhaseManagementService.getPhaseNames().map((phaseName) => (
                    <SelectItem key={phaseName} value={phaseName}>
                      {phaseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Description *
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what will be accomplished in this phase"
                className="mt-1 min-h-[100px]"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {formData.description.length}/500
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Start Date *
                </Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  End Date
                </Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {phaseStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Progress (%)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progress: Math.min(
                        100,
                        Math.max(0, parseInt(e.target.value) || 0)
                      ),
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Created At
                </Label>
                <Input
                  value={new Date(phase.createdAt).toLocaleString("es-ES")}
                  disabled
                  className="mt-1 bg-gray-100"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Last Updated
                </Label>
                <Input
                  value={new Date(phase.updatedAt).toLocaleString("es-ES")}
                  disabled
                  className="mt-1 bg-gray-100"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <Button
                onClick={handleUpdatePhase}
                disabled={loadingPost}
                className="flex-1 bg-[#95C11F] hover:bg-[#84AD1B] text-white py-3"
              >
                {loadingPost ? "Updating..." : "Update Phase"}
              </Button>

              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 py-3"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
