"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"
import type { UserRequest } from "@/types/user-management"

interface RequestItemProps {
  request: UserRequest
  isSelected?: boolean
  onEdit?: () => void
  onClick?: () => void
}

export function RequestItem({ request, isSelected, onEdit, onClick }: RequestItemProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${isSelected ? "border-green-500 bg-green-50" : "hover:bg-gray-50"}`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="font-medium text-gray-900">{request.name}</h4>
          {onEdit && (
            <Edit
              className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            />
          )}
        </div>
        <Badge variant="secondary" className="bg-gray-800 text-white">
          {request.status}
        </Badge>
      </CardContent>
    </Card>
  )
}
