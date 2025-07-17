"use client";

import { StatusBadge } from "@/components/atoms/status-badge";
import { ActionButton } from "@/components/atoms/action-button";
import type { Lead } from "@/types/lead-management";

interface LeadTableRowProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadTableRow({ lead, onView, onDelete }: LeadTableRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">{lead.id}</td>
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">
        {lead.clientName}
      </td>
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">
        {lead.startDate}
      </td>
      <td className="w-1/4 px-6 py-4">
        <StatusBadge status={lead.status} />
      </td>
      <td className="w-1/4 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(lead)}className="text-gray-700 hover:text-gray-900" />
          <ActionButton type="delete" onClick={() => onDelete(lead)}className="text-gray-700 hover:text-gray-900" />
        </div>
      </td>
    </tr>
  );
}
