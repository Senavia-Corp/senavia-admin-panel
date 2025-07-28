"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/lead-management";
import { Eye, Trash2 } from "lucide-react";

interface LeadTableRowProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  isLoading?: boolean;
}

export function LeadTableRow({
  lead,
  onView,
  onDelete,
  isLoading,
}: LeadTableRowProps) {
  const getStatusColor = (state: Lead["state"]) => {
    switch (state) {
      case "SEND":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "ESTIMATING":
        return "bg-purple-100 text-purple-800";
      case "FINISHED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr>
      <td className="w-1/6 px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{lead.id}</div>
      </td>
      <td className="w-1/6 px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{lead.clientName}</div>
      </td>
      <td className="w-1/6 px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{lead.clientEmail}</div>
      </td>
      <td className="w-1/6 px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {format(new Date(lead.startDate), "MMM dd, yyyy")}
        </div>
      </td>
      <td className="w-1/6 px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
            lead.state
          )}`}
        >
          {lead.state}
        </span>
      </td>
      <td className="w-1/6 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(lead)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(lead)}
            disabled={isLoading}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
