import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import type { Leads } from "@/types/lead-management";

interface MultiSelectBillingProps {
  value: number[];
  onChange: (value: number[]) => void;
  leads: Leads[];
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelectBilling({
  value,
  onChange,
  leads,
  placeholder = "Select leads...",
  disabled = false,
}: MultiSelectBillingProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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

  const filteredLeads = leads.filter(
    (lead) =>
      !value.includes(lead.id) &&
      lead.clientName.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex flex-wrap items-center gap-2 border rounded px-3 py-2 bg-white ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-text"
        }`}
        onClick={() => {
          if (disabled) return;
          setOpen(true);
        }}
      >
        <input
          className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-gray-700 text-sm"
          placeholder={value.length > 0 ? leads.find(l => l.id === value[0])?.clientName || "" : placeholder}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (disabled) return;
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
          {filteredLeads.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {inputValue ? "No leads match your search" : "No leads available"}
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={() => {
                  onChange([lead.id]); // Solo permitimos un lead seleccionado
                  setInputValue("");
                  setOpen(false);
                }}
              >
                <div className="font-medium">{lead.clientName}</div>
                {lead.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {lead.description}
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
