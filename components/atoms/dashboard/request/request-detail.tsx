import { cn } from "@/lib/utils";

interface RequestDetailProps {
  requestName: string;
  associatedService: string;
  companyPlan: string;
  description: string;
  leadStatus: string;
  className?: string;
  loading?: boolean;
}

function SkeletonDetail() {
  return (
    <div className="relative p-[6px] rounded-lg bg-[#181B29] animate-pulse">
      <div className="flex flex-col justify-between gap-y-2 p-4 rounded-md bg-[#100e34] h-[200px]">
        <div className="space-y-2">
          <div className="h-7 w-2/3 bg-gray-400/30 rounded mb-1" /> {/* Título */}
          <div className="h-5 w-1/3 bg-gray-400/20 rounded mb-1" /> {/* Servicio */}
          <div className="h-5 w-1/4 bg-gray-400/20 rounded mb-1" /> {/* Plan */}
          <div className="h-4 w-full bg-gray-400/10 rounded mt-2" /> {/* Descripción */}
          <div className="h-4 w-3/4 bg-gray-400/10 rounded" />
        </div>
        <div className="mt-2 flex justify-start">
          <div className="h-6 w-20 bg-gray-400/30 rounded-full" /> {/* Lead status */}
        </div>
      </div>
    </div>
  );
}

export function RequestDetail({
  requestName,
  associatedService,
  companyPlan,
  description,
  leadStatus,
  className,
  loading = false,
}: RequestDetailProps) {
  if (loading) return <SkeletonDetail />;
  return (
    // Outer container for gradient border
    <div
      className={cn(
        "relative p-[6px] rounded-lg",
        "bg-gradient-to-r from-[#99CC33] via-[#66CCCC] to-[#99CC33]",
        className
      )}
    >
      {/* Inner Content Container */}
      <div className={cn("flex flex-col justify-between p-4 rounded-md", "bg-[#100e34]")}>
        {/* Top section with text details */}
        <div className="space-y-1">
          <h2 className="text-[30px] font-semibold text-white" style={{ fontWeight: 600 }}>
            {requestName}
          </h2>
          <p className="text-[20px] text-gray-200">{associatedService}</p>
          <p className="text-[20px] text-gray-200">{companyPlan}</p>
          <p className="text-[16px] text-gray-300 mt-1">{description}</p>
        </div>

        {/* Bottom section with lead status */}
        <div className="mt-2">
          <span className="px-4 py-1 bg-[#04081e] text-gray-100 text-sm rounded-full inline-block shadow-sm">
            {leadStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
