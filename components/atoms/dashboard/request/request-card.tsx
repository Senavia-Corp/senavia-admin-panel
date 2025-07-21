import { cn } from "@/lib/utils";

interface RequestCardProps {
  requestName: string;
  leadStatus: string;
  className?: string;
  isSelected?: boolean;
}

export function RequestCard({ requestName, leadStatus, className, isSelected }: RequestCardProps) {
  return (
    <div
      className={cn(
        "relative p-[2px] rounded-md overflow-hidden group",
        "bg-gradient-to-r from-[#99CC33] to-[#2EBAC6]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-6 py-3 rounded-md w-full h-full transition-colors duration-200",
          !isSelected && "group-hover:bg-[#524f7d] cursor-pointer",
          isSelected ? "bg-[#10132a]/80" : "bg-[#403e5d]"
        )}
      >
        <span className="text-white font-semibold text-[18px]">{requestName}</span>
        <span className="px-4 py-1 bg-[#0B0E1C] text-white text-sm rounded-full font-medium shadow-sm">
          {leadStatus}
        </span>
      </div>
    </div>
  );
}
