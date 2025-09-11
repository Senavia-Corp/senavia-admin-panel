import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { UserManagementService } from "@/services/user-management-service";
import type { UserRole } from "@/types/user-management";

interface RoleDropdownProps {
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function RoleDropdown({
  value,
  onChange,
  placeholder = "Select a role...",
  disabled = false,
  className = "",
}: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<UserRole[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para cargar los roles desde el backend
  const loadRoles = async () => {
    if (hasLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedRoles = await UserManagementService.getUserRoles();
      setRoles(fetchedRoles);
      setFilteredRoles(fetchedRoles);
      setHasLoaded(true);
    } catch (err) {
      setError("Error loading roles");
      console.error("Error fetching roles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar roles basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  }, [searchTerm, roles]);

  // Manejar click fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm(""); // Limpiar búsqueda al cerrar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Encontrar el rol seleccionado
  const selectedRole = roles.find((role) => role.id === value);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    if (!isOpen) {
      setIsOpen(true);
      loadRoles();
    }
  };

  // Manejar focus en el input
  const handleInputFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
      loadRoles();
    }
  };

  // Obtener el valor a mostrar en el input
  const getInputValue = () => {
    if (isOpen || searchTerm) {
      return searchTerm;
    }
    return selectedRole ? selectedRole.name : "";
  };

  const handleSelectRole = (roleId: number) => {
    onChange(roleId);
    setIsOpen(false);
    setSearchTerm(""); // Limpiar búsqueda al seleccionar
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={getInputValue()}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full border rounded px-3 py-2 pr-10 text-sm bg-white
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "hover:border-gray-400"
            }
            ${
              isOpen
                ? "border-blue-500 ring-1 ring-blue-500"
                : "border-gray-300"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          `}
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-transform pointer-events-none ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Loading roles...</span>
            </div>
          ) : error ? (
            <div className="px-3 py-2 text-sm text-red-600">{error}</div>
          ) : filteredRoles.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              {searchTerm ? "No roles match your search" : "No roles available"}
            </div>
          ) : (
            <div className="py-1">
              {filteredRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role.id)}
                  className={`
                    w-full text-left px-3 py-2 text-sm hover:bg-gray-100
                    flex items-center justify-between
                    ${
                      value === role.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-900"
                    }
                  `}
                >
                  <span>{role.name}</span>
                  {role.color && (
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: role.color }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
