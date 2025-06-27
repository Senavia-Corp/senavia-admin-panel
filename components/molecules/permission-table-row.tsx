"use client"

import { StatusBadgePermission } from "@/components/atoms/status-badge-permission"
import { ActionButton } from "@/components/atoms/action-button"
import type { Permission } from "@/types/permission-management"

interface PermissionTableRowProps {
  permission: Permission
  onView: (permission: Permission) => void
  onDelete: (permission: Permission) => void
}

export function PermissionTableRow({ permission, onView, onDelete }: PermissionTableRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-32 px-6 py-4 text-sm text-gray-900 truncate">{permission.id}</td>
      <td className="flex-1 px-6 py-4 text-sm text-gray-900 truncate">{permission.name}</td>
      <td className="w-32 px-6 py-4 text-sm text-gray-900">{permission.action}</td>
      <td className="w-32 px-6 py-4">
        <StatusBadgePermission status={permission.status} />
      </td>
      <td className="w-48 px-6 py-4 text-sm text-gray-900 truncate">{permission.associatedService}</td>
      <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(permission)} className="text-gray-700 hover:text-gray-900" />
          <ActionButton
            type="delete"
            onClick={() => onDelete(permission)}
            className="text-gray-700 hover:text-gray-900"
          />
        </div>
      </td>
    </tr>
  )
}
