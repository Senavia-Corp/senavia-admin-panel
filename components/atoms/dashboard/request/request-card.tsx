import { cn } from "@/lib/utils";

interface RequestCardProps {
  requestName: string;
  leadStatus: string;
  className?: string;
  isSelected?: boolean;
}

export function RequestCard({
  requestName,
  leadStatus,
  className,
  isSelected,
}: RequestCardProps) {
  return (
    <div
      className={cn(
        "relative p-[3px] rounded-md overflow-hidden group",
        "bg-gradient-to-r from-[#99CC33] to-[#2EBAC6]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-6 py-3 rounded-md w-full h-full transition-colors duration-200",
          isSelected ? "bg-[rgba(255,255,255,0.8)]" : "bg-user-container",
          !isSelected &&
            "group-hover:bg-gradient-to-r from-[rgba(153,204,51,0.2)] to-[rgba(46,186,198,0.2)] cursor-pointer"
        )}
      >
        <span className="text-secondary-text font-semibold text-[18px]">
          {requestName}
        </span>
        <span className="px-4 py-1 bg-secondary-text text-white text-sm rounded-full font-medium shadow-sm">
          {leadStatus}
        </span>
      </div>
    </div>
  );
}
