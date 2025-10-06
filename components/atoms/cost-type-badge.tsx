import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function StatusBadge({ status, variant = "secondary" }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "license":
        return "bg-blue-600 text-white";
      case "manpower":
        return "bg-orange-600 text-white";
      case "technologies":
        return "bg-purple-600 text-white";
      case "others":
        return "bg-gray-600 text-white";
      default:
        return "bg-[#99CC33] text-white";
    }
  }

  return <Badge className={`${getStatusColor(status)} font-bold justify-center text-base w-auto lg:w-36 py-1 rounded-full text-white`}>{status}</Badge>
}
