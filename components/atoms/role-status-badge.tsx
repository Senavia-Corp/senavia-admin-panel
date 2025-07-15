import { Badge } from "@/components/ui/badge"

interface RoleStatusBadgeProps {
  isActive: boolean
}

export function RoleStatusBadge({ isActive }: RoleStatusBadgeProps) {
  return (
    <Badge className={`justify-center font-bold text-base w-auto lg:w-36  py-1 rounded-full text-white ${isActive ? "bg-[#99CC33]" : "bg-gray-500"}`}>
      {isActive ? "Yes" : "No"}
    </Badge>
  )
}
