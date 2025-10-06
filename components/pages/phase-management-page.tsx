"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { PhaseDetailFormCreate } from "@/components/organisms/phase-detail-form-create";
import { PhaseDetailForm } from "@/components/organisms/phase-detail-form";
import { PhaseManagementService } from "@/services/phase-management-service";
import { useToast } from "@/hooks/use-toast";
import type { ProjectPhaseDetail } from "@/types/phase-management";

interface PhaseManagementPageProps {
  phases: ProjectPhaseDetail[];
  projectId: number;
  projectName: string;
  onBack?: () => void;
}

export function PhaseManagementPage({
  phases: initialPhases,
  projectId,
  projectName,
  onBack,
}: PhaseManagementPageProps) {
  const [phases, setPhases] = useState(initialPhases);
  const [filteredPhases, setFilteredPhases] = useState(initialPhases);
  const [phaseToDelete, setPhaseToDelete] = useState<ProjectPhaseDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreatePhase, setShowCreatePhase] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>();
  const [showPhaseDetail, setShowPhaseDetail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    filterPhases();
  }, [searchTerm, statusFilter, phases]);

  const filterPhases = () => {
    let filtered = phases;

    if (searchTerm) {
      filtered = filtered.filter(
        (phase) =>
          phase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          phase.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((phase) => phase.status === statusFilter);
    }

    setFilteredPhases(filtered);
  };

  const handleDeletePhase = async (phaseToDelete: ProjectPhaseDetail) => {
    try {
      await PhaseManagementService.deletePhase(phaseToDelete.id);
      
      setPhases((prevPhases) =>
        prevPhases.filter((phase) => phase.id !== phaseToDelete.id)
      );
      
      toast({
        title: "Phase deleted successfully",
        description: `Phase "${phaseToDelete.name}" has been removed from the project.`,
      });
    } catch (error) {
      console.error("Error deleting phase", error);
      toast({
        title: "Failed to delete phase",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleViewPhase = (phase: ProjectPhaseDetail) => {
    setSelectedPhaseId(phase.id);
    setShowPhaseDetail(true);
  };

  const handlePhaseUpdate = (updatedPhase: ProjectPhaseDetail) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) => (phase.id === updatedPhase.id ? updatedPhase : phase))
    );
  };

  const handlePhaseCreate = (newPhase: ProjectPhaseDetail) => {
    setPhases((prevPhases) => [...prevPhases, newPhase]);
  };

  const handleCreatePhase = () => {
    setShowCreatePhase(true);
  };

  const handleBackToList = () => {
    setShowPhaseDetail(false);
    setShowCreatePhase(false);
  };

  const handleSaveSuccess = () => {
    setShowPhaseDetail(false);
    setShowCreatePhase(false);
    filterPhases();
  };

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":");
    if (type === "status") {
      setStatusFilter(value);
    }
  };

  const handlers = {
    onCreate: handleCreatePhase,
    onView: handleViewPhase,
    onDelete: (phase: ProjectPhaseDetail) => setPhaseToDelete(phase),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  const formatProgress = (progress: number) => {
    return `${progress}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (showPhaseDetail && selectedPhaseId) {
    return (
      <div className="">
        <PhaseDetailForm
          projectId={projectId}
          phaseId={selectedPhaseId}
          phase={phases.find((phase) => phase.id === selectedPhaseId)!}
          onBack={handleBackToList}
          onUpdate={handlePhaseUpdate}
        />
      </div>
    );
  }

  if (showCreatePhase) {
    return (
      <div className="">
        <PhaseDetailFormCreate
          projectId={projectId}
          onBack={handleBackToList}
          onCreateSuccess={handlePhaseCreate}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="my-3 flex flex-row space-x-1 items-center">
              <Button
                variant="ghost"
                size="sm"
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">
                Project Phases - {projectName}
              </h1>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "phases-page",
                `Add Phase | Total: ${filteredPhases.length} phases`,
                "Manage project phases and track progress",
                "All Phases",
                "View and manage project phases",
                ["Phase ID", "Name", "Status", "Progress", "Start Date", "End Date", "Actions"],
                filteredPhases,
                handlers
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={!!phaseToDelete}
        onClose={() => setPhaseToDelete(null)}
        onConfirm={() =>
          phaseToDelete && handleDeletePhase(phaseToDelete)
        }
        title="Delete Phase"
        description={`Are you sure you want to delete phase "${phaseToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
