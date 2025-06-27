"use client"

import { RoleBadge } from "@/components/atoms/role-badge"
import { ActionButton } from "@/components/atoms/action-button"
import type { User } from "@/types/user-management"

interface UserTableRowProps {
  user: User
  onView: (user: User) => void
  onDelete: (user: User) => void
}

export function UserTableRow({ user, onView, onDelete }: UserTableRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-24 px-6 py-4 text-sm text-gray-900 truncate">{user.id}</td>
      <td className="w-48 px-6 py-4 text-sm text-gray-900 truncate">{user.name}</td>
      <td className="w-40 px-6 py-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="flex-1 px-6 py-4 text-sm text-gray-900 truncate">{user.email}</td>
      <td className="w-48 px-6 py-4 text-sm text-gray-900 truncate">{user.phone}</td>
      <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(user)} className="text-gray-700 hover:text-gray-900" />
          <ActionButton type="delete" onClick={() => onDelete(user)} className="text-gray-700 hover:text-gray-900" />
        </div>
      </td>
    </tr>
  )
}
