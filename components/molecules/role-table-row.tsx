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
    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-[#F8F8F8] h-9">
      <td className="p-5 text-base text-[#04081E] truncate text-center">{role.id}</td>
      <td className="p-5 text-base text-[#04081E] truncate text-center">{role.name}</td>
      <td className="p-5 text-center">
        <RoleStatusBadge isActive={role.isActive} />
      </td>
      <td className=" p-5 text-center">
        <div className="flex justify-center space-x-2">
          <ActionButton type="view" onClick={() => onView(role)} />
          <ActionButton type="delete" onClick={() => onDelete(role)} />
        </div>
      </td>
    </tr>
  )
}
