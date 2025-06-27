"use client"

import { RoleStatusBadge } from "@/components/atoms/role-status-badge"
import { ActionButton } from "@/components/atoms/action-button"
import type { Role } from "@/types/role-management"

interface RoleTableRowProps {
  role: Role
  onView: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleTableRow({ role, onView, onDelete }: RoleTableRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">{role.id}</td>
      <td className="w-1/4 px-6 py-4 text-sm text-gray-900 truncate">{role.name}</td>
      <td className="w-1/4 px-6 py-4">
        <RoleStatusBadge isActive={role.isActive} />
      </td>
      <td className="w-1/4 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(role)} className="text-gray-700 hover:text-gray-900" />
          <ActionButton type="delete" onClick={() => onDelete(role)} className="text-gray-700 hover:text-gray-900" />
        </div>
      </td>
    </tr>
  )
}
