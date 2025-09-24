"use client"

interface PaginationControlsProps {
  offset: number;
  itemsPerPage: number;
  totalItems: number;
  loading?: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControl({offset,itemsPerPage,totalItems,loading,onPrev,onNext}:PaginationControlsProps){
     return (
    <div className="flex items-center justify-between mb-4">
      {/* Rango de ítems */}
      <span className="text-sm text-gray-700">
        {offset + 1}–
        {Math.min(offset + itemsPerPage, totalItems)} of {totalItems}
      </span>

      {/* Flechas */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrev}
          disabled={offset === 0 || loading}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {"<"}
        </button>

        <button
          onClick={onNext}
          disabled={loading || offset + itemsPerPage >= totalItems}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}