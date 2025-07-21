import React from "react";
import { ProfileProjectCard } from "../../atoms/dashboard/profile-project-card";

export type ProjectListProps = {
  projects: {
    id: string;
    name: string;
    status: string;
    progress?: number;
    phase?: string;
    imageUrl?: string;
  }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  loading?: boolean;
};

function SkeletonList({ count = 5, height = 120 }: { count?: number; height?: number }) {
  return (
    <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/5 rounded-md px-4 py-3 flex flex-col justify-between animate-pulse border border-gray-700/30"
          style={{ minHeight: height, height }}
        >
          {/* Título */}
          <div className="h-6 w-2/3 bg-gray-400/30 rounded mb-2 mt-1" />
          <div className="flex-1" />
          {/* Chips abajo alineados a la derecha */}
          <div className="flex gap-2 mt-auto mb-1 justify-end">
            <div className="h-6 w-14 bg-gray-400/30 rounded-full" />
            <div className="h-6 w-20 bg-gray-400/30 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectList({
  projects,
  selectedId,
  onSelect,
  className = "",
  loading = false,
}: ProjectListProps) {
  if (loading) return <SkeletonList count={5} height={120} />;
  return (
    <div className={`flex flex-col gap-2 ${className} flex-1 overflow-y-auto min-h-0`}>
      <h2 className="font-semibold text-lg mb-2 md:hidden">My Projects</h2>
      {projects.map((project) => (
        <button key={project.id} className="text-left" onClick={() => onSelect(project.id)}>
          <ProfileProjectCard
            projectName={project.name}
            progress={project.progress || 0}
            phase={project.status}
            imageUrl={project.imageUrl}
            isSelected={project.id === selectedId}
          />
        </button>
      ))}
    </div>
  );
}
