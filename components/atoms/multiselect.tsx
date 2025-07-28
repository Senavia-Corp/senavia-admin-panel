import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select permissions...",
}: MultiSelectProps) {
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

  const filteredOptions = options.filter(
    (opt) =>
      !value.includes(opt) &&
      opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex flex-wrap items-center gap-2 border rounded px-3 py-2 bg-white cursor-text "
        onClick={() => setOpen(true)}
      >
        {value.map((perm) => (
          <span
            key={perm}
            className="flex items-center bg-[#A6B3CC] text-white rounded-full px-3 py-1 text-sm mr-1 mb-1"
          >
            {perm}
            <div className="ml-2 text-white flex items-center  border  border-white px-1 rounded-full hover:bg-red-500 text-black">
              <button
                type="button"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value.filter((v) => v !== perm));
                }}
              >
                ×
              </button>
            </div>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-gray-700 text-sm"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button
          type="button"
          className="ml-2 text-gray-400 hover:text-gray-700 flex items-center"
          tabIndex={-1}
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      {open && filteredOptions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-10 max-h-40 overflow-auto">
          {filteredOptions.map((opt) => (
            <div
              key={opt}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              onClick={() => {
                onChange([...value, opt]);
                setInputValue("");
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
