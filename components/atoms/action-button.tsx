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
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className="[&_svg]:size-8 h-8 w-8 p-0 hover:bg-gray-100 text-black hover:text-gray-800"
    >
      <Icon className="h-8 w-8" />
    </Button>
  )
}
