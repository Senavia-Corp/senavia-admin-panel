"use client";

import { StatusBadge } from "@/components/atoms/status-badge";
import { ActionButton } from "@/components/atoms/action-button";
import type { LeadRecord } from "@/types/lead-management";

interface LeadTableRowProps {
  lead: LeadRecord;
  onView: (lead: LeadRecord) => void;
  onDelete: (lead: LeadRecord) => void;
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
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-32 py-3 text-sm text-gray-900">{lead.id}</td>
      <td className="w-1/3 py-3 text-sm text-gray-900">{lead.clientName}</td>
      <td className="w-32 py-3 text-sm text-gray-900">{lead.startDate}</td>
      <td className="w-32 py-3">
        <StatusBadge status={lead.status} />
      </td>
      <td className="w-32 py-3">
        <div className="flex items-center space-x-3">
          <ActionButton type="view" onClick={() => onView(lead)} />
          <ActionButton type="delete" onClick={() => onDelete(lead)} />
        </div>
      </td>
    </tr>
  );
}
