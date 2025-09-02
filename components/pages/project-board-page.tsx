"use client";

import { useState, useEffect } from "react";
import { ProjectPhasesSidebar } from "@/components/organisms/project-phases-sidebar";
import { TaskBoard } from "@/components/organisms/task-board";
import { TopNavbar } from "@/components/organisms/top-navbar";
import { ProjectManagementService } from "@/services/project-management-service";
import type { ProjectPhase } from "@/types/task-management";
import type { Project } from "@/types/project-management";

interface ProjectBoardPageProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectBoardPage({ projectId, onBack }: ProjectBoardPageProps) {
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase>("analysis");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const projectData = await ProjectManagementService.getProjectById(
          projectId
        );
        setProject(projectData);
      } catch (error) {
        console.error("Error loading project data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handlePhaseChange = async (phase: ProjectPhase) => {
    setSelectedPhase(phase);
  };

  if (loading && !project) {
    return (
      <div className="flex h-screen">
        <TopNavbar
          showBackButton
          onBack={onBack}
          title="Project Board"
          subtitle="Loading..."
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNavbar
        showBackButton
        onBack={onBack}
        title="Project Board"
        subtitle={project?.name || "Loading..."}
      />

      <div className="flex flex-1 overflow-hidden">
        <ProjectPhasesSidebar
          selectedPhase={selectedPhase}
          onPhaseChange={handlePhaseChange}
          projectPhase={project?.phase || "analysis"}
        />

        <div className="flex-1 overflow-hidden">
          <TaskBoard
            projectId={projectId}
            projectName={project?.name || ""}
            selectedPhase={selectedPhase}
            onBack={onBack}
          />
        </div>
      </div>
    </div>
  );
}
