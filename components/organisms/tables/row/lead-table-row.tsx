"use client";

import { format } from "date-fns";
import { StatusBadge } from "@/components/atoms/status-badge";
import { ActionButton } from "@/components/atoms/action-button";
import type { Lead } from "@/types/lead-management";

interface LeadTableRowProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadTableRow({
  lead,
  onView,
  onEdit,
  onDelete,
}: LeadTableRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-1/5 px-6 py-4 text-sm text-gray-900 text-center">
        {lead.id}
      </td>
      <td className="w-1/5 px-6 py-4 text-sm text-gray-900 text-center">
        {lead.clientName}
      </td>
      <td className="w-1/5 px-6 py-4 text-sm text-gray-900 text-center">
        {format(new Date(lead.startDate), "MMM dd, yyyy")}
      </td>
      <td className="w-1/5 px-6 py-4 text-center align-middle">
        <StatusBadge status={lead.state} />
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <div className="flex justify-center items-center h-full space-x-2">
          {onEdit && <ActionButton type="edit" onClick={() => onEdit(lead)} />}
          <ActionButton type="delete" onClick={() => onDelete(lead)} />
        </div>
      </td>
    </tr>
  );
}
