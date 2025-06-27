"use client"

import { StatusBadge } from "@/components/atoms/status-badge"
import { ActionButton } from "@/components/atoms/action-button"
import type { LeadRecord } from "@/types/lead-management"

interface LeadTableRowProps {
  lead: LeadRecord
  onView: (lead: LeadRecord) => void
  onDelete: (lead: LeadRecord) => void
}

export function LeadTableRow({ lead, onView, onDelete }: LeadTableRowProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-32 px-6 py-4 text-sm text-gray-900 truncate">{lead.id}</td>
      <td className="flex-1 px-6 py-4 text-sm text-gray-900 truncate">{lead.customerName}</td>
      <td className="w-32 px-6 py-4 text-sm text-gray-900">{formatDate(lead.createdAt)}</td>
      <td className="w-32 px-6 py-4">
        <StatusBadge status={lead.status} />
      </td>
      <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(lead)} className="text-gray-700 hover:text-gray-900" />
          <ActionButton type="delete" onClick={() => onDelete(lead)} className="text-gray-700 hover:text-gray-900" />
        </div>
      </td>
    </tr>
  )
}
