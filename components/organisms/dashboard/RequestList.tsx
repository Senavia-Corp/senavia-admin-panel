import React from "react";
import { RequestCard } from "../../atoms/dashboard/request/request-card";

export type RequestListProps = {
  requests: { id: string; name: string; status: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  loading?: boolean;
};

function SkeletonList({ count = 5, height = 56 }: { count?: number; height?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/5 rounded-md px-4 py-3 flex items-center gap-4 animate-pulse border border-gray-700/30"
          style={{ minHeight: height }}
        >
          <div className="flex-1">
            <div className="h-6 w-2/3 bg-gray-400/30 rounded mb-2" />
          </div>
          <div className="h-6 w-16 bg-gray-400/30 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function RequestList({
  requests,
  selectedId,
  onSelect,
  className = "",
  loading = false,
}: RequestListProps) {
  if (loading) return <SkeletonList count={5} height={56} />;
  return (
    <div className={`flex flex-col gap-2 ${className} flex-1 overflow-y-auto min-h-0`}>
      <h2 className="font-semibold text-lg mb-2 md:hidden">My Requests</h2>
      {requests.map((req) => (
        <button key={req.id} className="text-left" onClick={() => onSelect(req.id)}>
          <RequestCard
            requestName={req.name}
            leadStatus={req.status}
            isSelected={req.id === selectedId}
          />
        </button>
      ))}
    </div>
  );
}
