import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Plans } from "@/types/plan";

interface MultiSelectPlanProps {
  value: number[];
  onChange: (value: number[]) => void;
  plans: Plans[];
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelectPlan({
  value,
  onChange,
  plans,
  placeholder = "Select plans...",
  disabled = false,
}: MultiSelectPlanProps) {
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

  const filteredPlans = plans.filter(
    (plan) =>
      !value.includes(plan.id) &&
      plan.name.toLowerCase().includes(inputValue.toLowerCase())
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
          placeholder={value.length > 0 ? plans.find(p => p.id === value[0])?.name || "" : placeholder}
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
          {filteredPlans.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {inputValue ? "No plans match your search" : "No plans available"}
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={() => {
                  onChange([plan.id]); // Solo permitimos un plan seleccionado
                  setInputValue("");
                  setOpen(false);
                }}
              >
                <div className="font-medium">{plan.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {plan.price ? `$${plan.price}` : "No price"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
