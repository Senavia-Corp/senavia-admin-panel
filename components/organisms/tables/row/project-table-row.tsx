"use client";

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

  // Debug logging - remove in production
  console.log(`=== PROJECT ${project.id} (${project.name}) DEBUG ===`);
  console.log("Full project data:", project);
  console.log("Phases array:", project.phases);
  console.log("Phases length:", project.phases?.length);
  console.log("First phase:", project.phases?.[0]);
  console.log("All keys:", Object.keys(project));
  console.log("=== END DEBUG ===");

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  const handleViewTasks = () => {
    router.push(`/projects/${project.id}/board`);
  };

  const getPhaseLabel = (): string => {
    // Try to get phases from different possible property names
    const phases = project.phases || (project as any).Phase || [];

    console.log("Phases found:", phases);

    if (!phases || phases.length === 0) {
      return "-";
    }

    // Get the most recent phase (last in chronological order)
    const lastPhase = [...phases]
      .sort((a, b) => {
        const aTime = new Date(a.startDate || a.createdAt || "").getTime();
        const bTime = new Date(b.startDate || b.createdAt || "").getTime();
        return aTime - bTime;
      })
      .pop();

    console.log("Last phase:", lastPhase);

    if (!lastPhase?.name) {
      return "-";
    }

    const name = lastPhase.name;
    console.log("Phase name:", name, "Type:", typeof name);

    // Handle enum values properly - match the service logic
    const nameStr = String(name).toUpperCase();
    switch (nameStr) {
      case "ANALYSIS":
        return "Analysis";
      case "DESIGN":
        return "Design";
      case "DEVELOPMENT":
        return "Development";
      case "DEPLOY":
        return "Deployment"; // Map DEPLOY to Deployment for consistency
      default:
        // Fallback: capitalize first letter
        const pretty = String(name).toLowerCase();
        return pretty.charAt(0).toUpperCase() + pretty.slice(1);
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900 truncate text-center">
        {project.id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 truncate text-center">
        {project.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 text-center">
        {formatDate(project.startDate)}
      </td>
      <td className="px-6 py-4 text-center">
        <StatusBadge status={getPhaseLabel()} />
      </td>
      <td className="px-6 py-4 text-center">
        <Button
          onClick={handleViewTasks}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2"
        >
          Tasks
        </Button>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex space-x-2 justify-center">
          <ActionButton type="view" onClick={() => onView(project)} />
          <ActionButton type="delete" onClick={() => onDelete(project)} />
        </div>
      </td>
    </tr>
  );
}
