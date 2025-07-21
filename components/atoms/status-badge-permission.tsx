import { Badge } from "@/components/ui/badge"

interface StatusBadgePermissionProps {
  status: "Active" | "Inactive"
}

export function StatusBadgePermission({ status }: StatusBadgePermissionProps) {
  return (
    <Badge
      className={`font-bold justify-center text-base w-auto lg:w-36 py-1 rounded-full text-white ${
        status === "Active" ? "bg-[#99CC33]" : "bg-gray-500"
      }`}
    >
      {status}
    </Badge>
  )
}
