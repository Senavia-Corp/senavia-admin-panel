"use client";
//Auqi iban los datos de ejemplo ahora se cambiaron por las rutas de la base de datos
import { StatusBadge } from "@/components/atoms/status-badge";
import { ActionButton } from "@/components/atoms/action-button";
import { Button } from "@/components/ui/button";
import type { Project, PhaseName } from "@/types/project-management";
import { useRouter } from "next/navigation";

interface ProjectTableRowProps {
  project: Project;
  onView: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewTasks: (project: Project) => void;
}

export function ProjectTableRow({
  project,
  onView,
  onDelete,
  onViewTasks,
}: ProjectTableRowProps) {
  const router = useRouter();

  const handleViewTasks = () => {
    router.push(`/projects/${project.id}/board`);
  };

  const getPhaseLabel = (): string => {
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
        return "Deploy";
      default:
        return "-";
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">
        {project.id}
      </td>
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">
        {project.name}
      </td>
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">
        {project.startDate}
      </td>
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">
        <StatusBadge status={getPhaseLabel()} />
      </td>

      <td className="w-1/4 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(project)} />
          <ActionButton type="delete" onClick={() => onDelete(project)} />
        </div>
      </td>
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">
        <Button
          onClick={handleViewTasks}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2"
        >
          Tasks
        </Button>
      </td>
    </tr>
  );
}
