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
    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-[#F8F8F8] h-9">
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">{permission.id}</td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">{permission.name}</td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] text-center">{permission.action}</td>
      <td className="w-1/6 p-5 text-center">
        <StatusBadgePermission status={permission.status} />
      </td>
      <td className="w-1/4 p-5 text-base font-light text-[#04081E] truncate text-center">{permission.associatedService}</td>
      <td className="w-1/6 p-5 text-center">
        <div className="flex justify-center space-x-2">
          <ActionButton type="view" onClick={() => onView(permission)} />
          <ActionButton
            type="delete"
            onClick={() => onDelete(permission)}
          />
        </div>
      </td>
    </tr>
  )
}
