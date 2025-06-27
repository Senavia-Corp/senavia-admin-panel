"use client"

import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"

interface ActionButtonProps {
  type: "view" | "delete"
  onClick: () => void
  disabled?: boolean
}

export function ActionButton({ type, onClick, disabled }: ActionButtonProps) {
  const Icon = type === "view" ? Eye : Trash2

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 p-0 hover:bg-gray-100 text-black hover:text-gray-800"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
