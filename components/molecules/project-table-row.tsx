"use client";

import { StatusBadge } from "@/components/atoms/status-badge";
import { ActionButton } from "@/components/atoms/action-button";
import { Button } from "@/components/ui/button";
import type { ProjectRecord } from "@/types/project-management";
import { useRouter } from "next/navigation";

interface ProjectTableRowProps {
  project: ProjectRecord;
  onView: (project: ProjectRecord) => void;
  onDelete: (project: ProjectRecord) => void;
  onViewTasks: (project: ProjectRecord) => void;
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
        <StatusBadge status={project.currentPhase} />
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
