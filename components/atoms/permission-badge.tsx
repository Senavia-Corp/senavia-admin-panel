"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PermissionBadgeProps {
  permission: {
    id: string;
    name: string;
  };
  onRemove?: () => void;
  removable?: boolean;
}

export function PermissionBadge({
  permission,
  onRemove,
  removable = true,
}: PermissionBadgeProps) {
  return (
    <Badge className="bg-[#A2ADC5] text-white px-3 py-1 rounded-full flex items-center space-x-2">
      <span>{permission.name}</span>
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="border border-current text-current bg-transparent
             hover:bg-blue-600 hover:text-white rounded-full p-1
             transition-colors"
        >
          <X className="h-4 w-4" strokeWidth={3} />
        </button>
      )}
    </Badge>
  );
}
