import { Badge } from "@/components/ui/badge"

interface RoleStatusBadgeProps {
  isActive: boolean
}

export function RoleStatusBadge({ isActive }: RoleStatusBadgeProps) {
  return (
    <Badge className={`font-medium px-4 py-2 rounded-full text-white ${isActive ? "bg-green-500" : "bg-gray-500"}`}>
      {isActive ? "Yes" : "No"}
    </Badge>
  )
}
