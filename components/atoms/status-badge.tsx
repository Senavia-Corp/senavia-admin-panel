import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function StatusBadge({ status, variant = "secondary" }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
      case "development":
        return "bg-[#32D9C8] text-white"
      case "estimating":
      case "design":
        return "bg-yellow-500 text-white"
      case "finished":
      case "deploy":
        return "bg-green-500 text-white"
      case "analysis":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return <Badge className={`${getStatusColor(status)} rounded-full px-3 py-1 text-xs font-medium`}>{status}</Badge>
}
