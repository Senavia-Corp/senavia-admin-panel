"use client"

import { StatusBadge } from "@/components/atoms/status-badge"
import { ActionButton } from "@/components/atoms/action-button"
import type { SupportTicket } from "@/types/support-management"

interface SupportTableRowProps {
  ticket: SupportTicket
  onView: (ticket: SupportTicket) => void
  onDelete: (ticket: SupportTicket) => void
}

export function SupportTableRow({ ticket, onView, onDelete }: SupportTableRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-32 px-6 py-4 text-sm text-gray-900 truncate">{ticket.id}</td>
      <td className="w-48 px-6 py-4 text-sm text-gray-900 truncate">{ticket.userName}</td>
      <td className="w-32 px-6 py-4 text-sm text-gray-900">{ticket.type}</td>
      <td className="flex-1 px-6 py-4">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(ticket)}  />
          <ActionButton type="delete" onClick={() => onDelete(ticket)}  />
        </div>
      </td>
    </tr>
  )
}
