"use client";

import { useState, useEffect } from "react";
import { ProjectsTable } from "@/components/organisms/projects-table";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { ProjectManagementService } from "@/services/project-management-service";
import type { ProjectRecord } from "@/types/project-management";
import { toast } from "@/components/ui/use-toast";

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<ProjectRecord | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");

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

  const handleDeleteProject = async (project: ProjectRecord) => {
    try {
      await ProjectManagementService.deleteProject(project.id);
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

  const handleViewTasks = (project: ProjectRecord) => {
    // Implementar vista de tareas
    console.log("View tasks for project:", project);
    toast({
      title: "Info",
      description: "Tasks view coming soon",
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center space-x-2">
              <img
                src="/images/senavia-logo.png"
                alt="Senavia Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">U</span>
              </div>
              <span className="text-sm font-medium">Username</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">
              Project Management
            </h1>

            <div className="flex-1 min-h-0">
              <ProjectsTable
                projects={projects}
                onAddProject={() => loadProjects()}
                onViewProject={() => loadProjects()}
                onDeleteProject={setProjectToDelete}
                onViewTasks={handleViewTasks}
                onSearch={setSearchTerm}
                onPhaseFilter={setPhaseFilter}
                onStatusFilter={setPhaseFilter}
              />
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
