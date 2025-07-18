"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileProjectCardProps {
  projectName: string;
  progress: number;
  phase: string;
  imageUrl?: string;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function ProfileProjectCard({
  projectName,
  progress,
  phase,
  imageUrl = "https://picsum.photos/455/230",
  className,
  onClick,
  isSelected = false,
}: ProfileProjectCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden group cursor-pointer mb-4",
        isSelected ? "p-[2px] bg-gradient-to-r from-[#99CC33] to-[#2EBAC6]" : "",
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "relative h-[200px] w-full flex flex-col justify-between rounded-md transition-colors duration-200",
          isSelected ? "bg-[#10132a]/80" : "bg-[#403e5d] group-hover:bg-[#524f7d]"
        )}
        style={{ padding: isSelected ? 0 : 0 }}
      >
        <div className="relative w-full h-full rounded-md overflow-hidden">
          <Image
            src={imageUrl}
            alt={projectName}
            fill
            className="object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/70 rounded-md pointer-events-none" />
        </div>
        <div className="absolute top-4 left-4 text-white font-semibold text-xl">{projectName}</div>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <div className="bg-[#8ECF0A]/90 text-white px-3 py-1 rounded-full text-sm">
            {progress}%
          </div>
          <div className="bg-[#2A3B56]/90 text-white px-3 py-1 rounded-full text-sm">{phase}</div>
        </div>
      </div>
    </div>
  );
}
