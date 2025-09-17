import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { ContractManagementService } from "@/services/contract-management-service";
import { useToast } from "@/hooks/use-toast";
// Clause type from API response
type Clause = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

interface ClauseMultiSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ClauseMultiSelect({
  value,
  onChange,
  placeholder = "Select clauses...",
  disabled = false,
}: ClauseMultiSelectProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Función para cargar cláusulas desde el servicio de contratos
  const loadClauses = useCallback(async () => {
    if (hasLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedClauses =
        await ContractManagementService.getContractClauses();
      setClauses(fetchedClauses);
      setHasLoaded(true);
    } catch (err) {
      setError("Error loading clauses");
      console.error("Error fetching clauses:", err);
      toast({
        title: "Error",
        description: "Couldn't load data for clauses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [hasLoaded, isLoading]);

  // Load clauses immediately if we have values
  useEffect(() => {
    // Auto-load once if there are preselected values
    if (!autoLoaded && value && value.length > 0 && !hasLoaded && !isLoading) {
      setAutoLoaded(true);
      void loadClauses();
    }
  }, [autoLoaded, value, hasLoaded, isLoading, loadClauses]);

  // Cierra el dropdown si se hace click fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClauses = clauses.filter(
    (clause) =>
      !value.includes(clause.id) &&
      clause.title?.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex flex-wrap items-center gap-2 border rounded px-3 py-2 bg-white ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-text"
        }`}
        onClick={() => {
          if (disabled) return;
          if (!open) {
            void loadClauses();
          }
          setOpen(true);
        }}
      >
        {value.map((clauseId) => {
          const clause = clauses.find((c) => c.id === clauseId);
          return (
            <span
              key={clauseId}
              className="flex items-center bg-[#A6B3CC] text-white rounded-full px-3 py-1 text-sm mr-1 mb-1"
            >
              {clause?.title || `ID: ${clauseId}`}
              <div className="ml-2 text-white flex items-center border border-white px-1 rounded-full hover:bg-red-500 text-black">
                <button
                  type="button"
                  className="text-xs"
                  disabled={disabled}
                  onClick={(e) => {
                    if (disabled) return;
                    e.stopPropagation();
                    onChange(value.filter((v) => v !== clauseId));
                  }}
                >
                  ×
                </button>
              </div>
            </span>
          );
        })}
        <input
          className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-gray-700 text-sm"
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (disabled) return;
            if (!open) {
              void loadClauses();
            }
            setOpen(true);
          }}
        />
        <button
          type="button"
          className="ml-2 text-gray-400 hover:text-gray-700 flex items-center"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setOpen((o) => !o);
          }}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      {open && !disabled && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-10 max-h-40 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Loading clauses...</span>
            </div>
          ) : error ? (
            <div className="px-4 py-2 text-sm text-red-600">{error}</div>
          ) : filteredClauses.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {inputValue
                ? "No clauses match your search"
                : "No clauses available"}
            </div>
          ) : (
            filteredClauses.map((clause) => (
              <div
                key={clause.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={() => {
                  onChange([...value, clause.id]);
                  setInputValue("");
                  setOpen(false);
                }}
              >
                <div className="font-medium">
                  {clause.title || `Clause ${clause.id}`}
                </div>
                {clause.description && (
                  <div
                    key={`desc-${clause.id}`}
                    className="text-xs text-gray-500 mt-1"
                  >
                    {clause.description}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
