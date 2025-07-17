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
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="w-[12%] px-6 py-4 text-sm text-gray-900">{lead.id}</td>
      <td className="w-[30%] px-6 py-4 text-sm text-gray-900">
        {lead.clientName}
      </td>
      <td className="w-[20%] px-6 py-4 text-sm text-gray-900">
        {lead.startDate}
      </td>
      <td className="w-[20%] px-6 py-4">
        <StatusBadge status={lead.status} />
      </td>
      <td className="w-[18%] px-6 py-4">
        <div className="flex items-center justify-end space-x-3">
          <ActionButton type="view" onClick={() => onView(lead)} />
          <ActionButton type="delete" onClick={() => onDelete(lead)} />
        </div>
      </td>
    </tr>
  );
}
