import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { UserManagementService } from "@/services/user-management-service";
import type { Permission } from "@/types/user-management";

interface MultiSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect({
  value,
  onChange,
  placeholder = "Select permissions...",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Función para cargar permisos desde el backend
  const loadPermissions = async () => {
    if (hasLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedPermissions = await UserManagementService.getPermissions();
      setPermissions(fetchedPermissions);
      setHasLoaded(true);
    } catch (err) {
      setError("Error loading permissions");
      console.error("Error fetching permissions:", err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const filteredPermissions = permissions.filter(
    (permission) =>
      !value.includes(permission.id) &&
      permission.name.toLowerCase().includes(inputValue.toLowerCase())
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
            loadPermissions();
          }
          setOpen(true);
        }}
      >
        {value.map((permId) => {
          const permission = permissions.find((p) => p.id === permId);
          return (
            <span
              key={permId}
              className="flex items-center bg-[#A6B3CC] text-white rounded-full px-3 py-1 text-sm mr-1 mb-1"
            >
              {permission?.name || `ID: ${permId}`}
              <div className="ml-2 text-white flex items-center  border  border-white px-1 rounded-full hover:bg-red-500 text-black">
                <button
                  type="button"
                  className="text-xs"
                  disabled={disabled}
                  onClick={(e) => {
                    if (disabled) return;
                    e.stopPropagation();
                    onChange(value.filter((v) => v !== permId));
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
              loadPermissions();
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
              <span className="text-sm text-gray-500">
                Loading permissions...
              </span>
            </div>
          ) : error ? (
            <div className="px-4 py-2 text-sm text-red-600">{error}</div>
          ) : filteredPermissions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {inputValue
                ? "No permissions match your search"
                : "No permissions available"}
            </div>
          ) : (
            filteredPermissions.map((permission) => (
              <div
                key={permission.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={() => {
                  onChange([...value, permission.id]);
                  setInputValue("");
                  setOpen(false);
                }}
              >
                <div className="font-medium">{permission.name}</div>
                {permission.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {permission.description}
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
