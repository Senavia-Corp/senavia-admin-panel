import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function StatusBadge({ status, variant = "secondary" }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "type":
        return "bg-[#99CC33] text-white"
      default:
        return "bg-[#99CC33] text-white"
    }
  }

  return <Badge className={`${getStatusColor(status)} font-bold justify-center text-base w-auto lg:w-36 py-1 rounded-full text-white`}>{status}</Badge>
}
