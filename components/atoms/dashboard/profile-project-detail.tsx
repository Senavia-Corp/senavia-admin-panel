"use client";

import { FileText } from "lucide-react";
import { format } from "date-fns";

interface Document {
  id: string;
  name: string;
  url: string;
}

interface ProfileProjectDetailProps {
  description: string;
  documents?: Document[];
  date?: Date;
  loading?: boolean;
}

function SkeletonDetail() {
  return (
    <div className="relative p-[6px] rounded-lg bg-white/5 border border-gray-700/30">
      <div className="flex flex-row h-[170px] rounded-lg overflow-hidden w-full bg-[#181B3A] animate-pulse">
        {/* Descripción */}
        <div className="flex-1 flex flex-col justify-between p-4 border-r-[6px] border-gray-700/30 min-w-0">
          <div className="h-6 w-3/4 bg-gray-400/30 rounded mb-2" />
          <div className="h-4 w-1/4 bg-gray-400/20 rounded self-end mt-auto" /> {/* Fecha */}
        </div>
        {/* Documentos */}
        <div className="w-[160px] flex flex-col gap-2 p-3 bg-[#181B3A] overflow-y-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1 bg-gray-400/10 rounded-md">
              <div className="w-4 h-4 bg-gray-400/30 rounded mr-2" />
              <div className="h-3 w-20 bg-gray-400/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileProjectDetail({
  description,
  documents = [],
  date = new Date(),
  loading = false,
}: ProfileProjectDetailProps) {
  if (loading) return <SkeletonDetail />;
  return (
    <div className="relative p-[6px] rounded-lg bg-gradient-to-r from-[#99CC33] via-[#66CCCC] to-[#99CC33]">
      <div
        className="flex flex-row h-[170px] rounded-lg overflow-hidden w-full bg-[#100e34]"
        style={{ boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}
      >
        {/* Project description */}
        <div className="flex-1 flex flex-col justify-between p-4 border-r-[6px] border-[#99CC33] min-w-0">
          <p className="text-[16px] text-gray-300 mt-1 leading-snug line-clamp-4">{description}</p>
          <div className="text-right text-gray-400 text-xs mt-2">{format(date, "MM-dd-yy")}</div>
        </div>
        {/* Documents list */}
        <div className="w-[160px] flex flex-col gap-2 p-3 bg-[#100e34] overflow-y-auto">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-1 bg-gray-100/10 rounded-md hover:bg-gray-200/20 transition-colors"
            >
              <FileText size={15} className="text-gray-300 flex-shrink-0" />
              <span className="text-gray-200 text-xs truncate max-w-[110px]">{doc.name}</span>
            </a>
          ))}
          {documents.length === 0 && (
            <div className="text-center text-gray-400 py-2 text-xs">No documents available</div>
          )}
        </div>
      </div>
    </div>
  );
}
