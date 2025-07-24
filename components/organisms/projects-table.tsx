"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectTableRow } from "@/components/molecules/project-table-row";
import { Plus, Search, Filter } from "lucide-react";
import type { ProjectRecord, ProjectPhase } from "@/types/project-management";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectEditor } from "./project-editor";

interface ProjectsTableProps {
  projects: ProjectRecord[];
  onAddProject: () => void;
  onViewProject: (project: ProjectRecord) => void;
  onDeleteProject: (project: ProjectRecord) => void;
  onViewTasks: (project: ProjectRecord) => void;
  onSearch: (search: string) => void;
  onPhaseFilter: (phase: string) => void;
  onStatusFilter: (status: string) => void;
}

export function ProjectsTable({
  projects,
  onAddProject,
  onViewProject,
  onDeleteProject,
  onViewTasks,
  onSearch,
  onPhaseFilter,
  onStatusFilter,
}: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [showEditor, setShowEditor] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(
    null
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handlePhaseFilter = (phase: string) => {
    setSelectedPhase(phase);
    onPhaseFilter(phase);
  };

  const handleAddClick = () => {
    setSelectedProject(null);
    setShowEditor(true);
  };

  const handleEditProject = (project: ProjectRecord) => {
    setSelectedProject(project);
    setShowEditor(true);
  };

  const handleEditorBack = () => {
    setShowEditor(false);
    setSelectedProject(null);
  };

  const handleEditorSave = () => {
    setShowEditor(false);
    setSelectedProject(null);
    if (selectedProject) {
      onViewProject(selectedProject);
    } else {
      onAddProject();
    }
  };

  const phases: ProjectPhase[] = [
    "Analysis",
    "Design",
    "Development",
    "Deployment",
  ];

  if (showEditor) {
    return (
      <ProjectEditor
        projectId={selectedProject?.id}
        onBack={handleEditorBack}
        onSave={handleEditorSave}
      />
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6 w-full">
      {/* Add Project Section */}
      <Card className="bg-gray-900 text-white flex-shrink-0 w-full">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8">
          <div>
            <h2 className="text-xl font-semibold">Add Project</h2>
            <p className="text-gray-400">Create a new project</p>
          </div>
          <Button
            onClick={handleAddClick}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 p-0"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </CardHeader>
      </Card>

      {/* All Projects Section */}
      <Card className="bg-gray-900 text-white flex-1 flex flex-col min-h-0 w-full">
        <CardHeader className="flex-shrink-0 px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-semibold">All Projects</h2>
              <p className="text-gray-400">Description</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger>
                    <Filter className="h-5 w-5" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 m-0 bg-gray-800 border-gray-700">
                    <Select
                      value={selectedPhase}
                      onValueChange={handlePhaseFilter}
                    >
                      <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="all" className="text-white">
                          All Status
                        </SelectItem>
                        {phases.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-white"
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-80 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 px-8 pb-8">
          <div className="bg-white rounded-lg flex-1 flex flex-col w-full min-h-0">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project ID
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phase
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks
                  </th>
                </tr>
              </thead>
            </table>
            <div className="flex-1 overflow-auto">
              <table className="w-full table-fixed">
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <ProjectTableRow
                      key={project.id}
                      project={project}
                      onView={() => handleEditProject(project)}
                      onDelete={onDeleteProject}
                      onViewTasks={onViewTasks}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
