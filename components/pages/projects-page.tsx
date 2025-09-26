"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { ProjectManagementService } from "@/services/project-management-service";
import type { Project } from "@/types/project-management";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { ProjectEditor } from "@/components/organisms/project-editor";
import { toast } from "@/components/ui/use-toast";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [showEditorForm, setShowEditorForm] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [searchTerm, phaseFilter]);

  const loadProjects = async () => {
    try {
      const projectsData = await ProjectManagementService.getProjects(
        searchTerm,
        phaseFilter
      );
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateProject = () => {
    setSelectedProjectId(null);
    setShowEditorForm(true);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProjectId(project.id.toString());
    setShowEditorForm(true);
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      await ProjectManagementService.deleteProject(project.id.toString());
      setProjectToDelete(null);
      loadProjects();
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (filter: string) => {
    setPhaseFilter(filter);
  };

  const handleBackToList = () => {
    setSelectedProjectId(null);
    setShowEditorForm(false);
  };

  const handleSaveSuccess = () => {
    setSelectedProjectId(null);
    setShowEditorForm(false);
    // Add a small delay to ensure the project is fully saved
    setTimeout(() => {
      console.log("Reloading projects after save...");
      loadProjects();
    }, 1000);
  };

  const handleViewTasks = (project: Project) => {
    // TODO: Implement tasks view
    console.log("View tasks for project:", project);
    toast({
      title: "Info",
      description: "Tasks view coming soon",
    });
  };

  const handlers = {
    onCreate: handleCreateProject,
    onView: handleViewProject,
    onDelete: (project: Project) => setProjectToDelete(project),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
    onViewTasks: handleViewTasks,
  };

  // Show editor form for creating/editing project
  if (showEditorForm) {
    return (
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="p-6 h-full w-full">
            <ProjectEditor
              projectId={
                selectedProjectId ? parseInt(selectedProjectId) : undefined
              }
              onBack={handleBackToList}
              onSave={handleSaveSuccess}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="flex items-center mb-6 flex-shrink-0">
              <div className="w-1 h-[36px] bg-[#99CC33] mr-3" />
              <h1 className="font-sans font-medium text-[25px] leading-none tracking-normal align-middle text-gray-900">
                Project Management
              </h1>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "projects-page",
                "Add Project",
                "Create a new project to manage your work",
                "All Projects",
                "View and manage all your projects in the system",
                [
                  "Project ID",
                  "Name",
                  "Start Date",
                  "Current Phase",
                  "Tasks",
                  "Actions",
                ],
                projects,
                handlers
              )}
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmDialog
        open={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() =>
          projectToDelete && handleDeleteProject(projectToDelete)
        }
        title="Delete Project"
        description={`Are you sure you want to delete the project "${projectToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
