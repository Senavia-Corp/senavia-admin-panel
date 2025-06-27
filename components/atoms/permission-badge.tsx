"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface PermissionBadgeProps {
  permission: {
    id: string
    name: string
  }
  onRemove?: () => void
  removable?: boolean
}

export function PermissionBadge({ permission, onRemove, removable = true }: PermissionBadgeProps) {
  return (
    <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-2">
      <span>{permission.name}</span>
      {removable && onRemove && (
        <button onClick={onRemove} className="hover:bg-blue-600 rounded-full p-1">
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  )
}
