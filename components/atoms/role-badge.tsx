import { Badge } from "@/components/ui/badge"

interface RoleBadgeProps {
  role: {
    name: string
    color: string
  }
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <Badge className="text-white font-medium px-3 py-1 rounded-full" style={{ backgroundColor: role.color }}>
      {role.name}
    </Badge>
  )
}
