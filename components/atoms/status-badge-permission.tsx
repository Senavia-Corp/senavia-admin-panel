import { Badge } from "@/components/ui/badge"

interface StatusBadgePermissionProps {
  status: "Active" | "Inactive"
}

export function StatusBadgePermission({ status }: StatusBadgePermissionProps) {
  return (
    <Badge
      className={`font-medium px-3 py-1 rounded-full text-white ${
        status === "Active" ? "bg-green-500" : "bg-gray-500"
      }`}
    >
      {status}
    </Badge>
  )
}
