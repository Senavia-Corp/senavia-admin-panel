"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UserInfoCardProps {
  label: string
  value: string
  onEdit?: () => void
  isPassword?: boolean
}

export function UserInfoCard({ label, value, onEdit, isPassword }: UserInfoCardProps) {
  const displayValue = isPassword ? "••••••••••••" : value

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-600">{displayValue}</p>
        </div>
        {onEdit && (
          <Button variant="default" size="sm" onClick={onEdit} className="bg-green-500 hover:bg-green-600 text-white">
            Change
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
