import React from "react";
import { ProfileProjectCard } from "../../atoms/dashboard/profile-project-card";

type ProjectPhase = {
  id: number;
  name: string;
  description?: string;
  expectedDuration?: string;
  startDate?: string;
  endDate?: string;
  project_id?: number;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ProjectEstimate = {
  id: number;
  estimatedTime?: string;
  description?: string;
  state?: string;
  totalValue?: string;
  deadLineToPay?: string;
  invoiceDateCreated?: string;
  invoiceReference?: string;
  lead_id?: number;
  plan_id?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectFromApi = {
  id: number | string;
  name: string;
  description?: string;
  expectedDuration?: string;
  startDate?: string;
  endDate?: string;
  imagePreviewUrl?: string;
  workTeam_id?: number | null;
  estimate_id?: number;
  userId?: number | string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: unknown | null;
  workTeam?: unknown | null;
  estimate?: ProjectEstimate | null;
  Phase?: ProjectPhase[];
  progress?: number;
  imageUrl?: string;
  backgroundImage?: string;
  status?: string;
  phase?: string;
};

export type ProjectListProps = {
  projects: ProjectFromApi[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  loading?: boolean;
};

function SkeletonList({
  count = 5,
  height = 120,
}: {
  count?: number;
  height?: number;
}) {
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
    <div
      className={`flex flex-col gap-2 ${className} flex-1 overflow-y-auto min-h-0`}
    >
      <h2 className="font-semibold text-lg mb-2 md:hidden">My Projects</h2>
      {projects.map((project: ProjectFromApi) => {
        const id = project?.id != null ? String(project.id) : "";
        const name = project?.name ?? "";
        const imageUrl = project?.imagePreviewUrl ?? "";
        const phaseFromArray =
          Array.isArray(project?.Phase) && project.Phase.length > 0
            ? project.Phase[0]?.name
            : undefined;
        const phase =
          phaseFromArray ?? project?.phase ?? project?.estimate?.state ?? "";
        const progress =
          typeof project?.progress === "number" ? project.progress : 0;
        return (
          <button key={id} className="text-left" onClick={() => onSelect(id)}>
            <ProfileProjectCard
              projectName={name}
              progress={progress}
              phase={phase}
              imageUrl={imageUrl}
              isSelected={id === selectedId}
            />
          </button>
        );
      })}
    </div>
  );
}
