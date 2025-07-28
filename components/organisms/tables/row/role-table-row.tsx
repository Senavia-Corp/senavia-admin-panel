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
    <tr className="bg-[#F8F8F8] shadow-sm rounded-lg">
      <td className="p-5 text-base text-[#04081E] truncate text-center rounded-l-lg">{role.id}</td>
      <td className="p-5 text-base text-[#04081E] truncate text-center">{role.name}</td>
      <td className="p-5 text-center">
        <RoleStatusBadge isActive={role.isActive} />
      </td>
      <td className="p-5 text-center rounded-r-lg">
        <div className="flex justify-center space-x-2">
          <ActionButton type="view" onClick={() => onView(role)} />
          <ActionButton type="delete" onClick={() => onDelete(role)} />
        </div>
      </td>
    </tr>
  )
}
