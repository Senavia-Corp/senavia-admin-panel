"use client";

import { ActionButton } from "@/components/atoms/action-button";
import { StatusBadge } from "@/components/atoms/status-badge";
import type { ProjectPhaseDetail } from "@/types/phase-management";

interface PhaseTableRowProps {
  phase: ProjectPhaseDetail;
  onView: (phase: ProjectPhaseDetail) => void;
  onDelete: (phase: ProjectPhaseDetail) => void;
}

export function PhaseTableRow({ phase, onView, onDelete }: PhaseTableRowProps) {
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
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      case "Not Started":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatProgress = (progress: number) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#95C11F] h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
    );
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900 text-center">
        {phase.id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div>
          <div className="font-medium">{phase.name}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {phase.description}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            phase.status
          )}`}
        >
          {phase.status}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        {formatProgress(phase.progress)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 text-center">
        {formatDate(phase.startDate)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 text-center">
        {formatDate(phase.endDate || "")}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex space-x-2 justify-center">
          <ActionButton type="view" onClick={() => onView(phase)} />
          <ActionButton type="delete" onClick={() => onDelete(phase)} />
        </div>
      </td>
    </tr>
  );
}
