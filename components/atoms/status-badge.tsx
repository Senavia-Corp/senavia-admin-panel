import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function StatusBadge({
  status,
  variant = "secondary",
}: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-500 text-white";
    switch (status.toLowerCase()) {
      // Contract states
      case "draft":
        return "bg-yellow-500 text-white";
      case "sent":
        return "bg-blue-500 text-white";
      case "signed":
        return "bg-green-500 text-white";
      case "active":
        return "bg-[#99CC33] text-white";
      case "expired":
        return "bg-red-500 text-white";
      case "terminated":
        return "bg-gray-600 text-white";
      // Legacy project states (keep for backward compatibility)
      case "processing":
        return "bg-[#32D9C8] text-white";
      case "development":
        return "bg-[#32D9C8] text-white";
      case "estimating":
        return "bg-[#32D9C8] text-white";
      case "design":
        return "bg-yellow-500 text-white";
      case "finished":
        return "bg-[#32D9C8] text-white";
      case "deploy":
        return "bg-green-500 text-white";
      case "analysis":
        return "bg-purple-500 text-white";
      case "type":
        return "bg-[#99CC33] text-white";
      // Billing states
      case "created":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      case "in_review":
        return "bg-orange-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "accepted":
        return "bg-green-500 text-white";
      case "invoice":
        return "bg-purple-500 text-white";
      case "paid":
        return "bg-[#99CC33] text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Badge
      className={`${getStatusColor(
        status
      )} font-bold justify-center text-base w-auto lg:w-36 py-1 rounded-full text-white`}
    >
      {status}
    </Badge>
  );
}
