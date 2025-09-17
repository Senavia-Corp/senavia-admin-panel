import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DropdownOption {
  id: number;
  name: string;
  subtitle?: string;
  [key: string]: any;
}

interface GenericDropdownProps {
  value?: number;
  onChange: (value: number, option?: DropdownOption) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  options?: DropdownOption[];
  isLoading?: boolean;
  error?: string | null;
  searchFields?: string[]; // Fields to search in (default: ['name'])
  displayField?: string; // Field to display as main text (default: 'name')
  subtitleField?: string; // Field to display as subtitle (default: 'subtitle')
  loadOptions?: () => Promise<DropdownOption[]>; // Lazy loader, similar a ClauseMultiSelect
  hasError?: boolean; // highlight input when form error
  errorLabel?: string; // Label used in error toast (e.g., "users", "leads")
}

export function GenericDropdown({
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  className = "",
  options = [],
  isLoading = false,
  error = null,
  searchFields = ["name"],
  displayField = "name",
  subtitleField = "subtitle",
  loadOptions,
  hasError = false,
  errorLabel = "",
}: GenericDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalOptions, setInternalOptions] = useState<DropdownOption[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const effectiveOptions = loadOptions ? internalOptions : options;
  const effectiveLoading = loadOptions ? internalLoading : isLoading;
  const effectiveError = loadOptions ? internalError : error;

  const tryLoadOptions = async () => {
    if (!loadOptions) return;
    if (internalLoading) return;
    setInternalLoading(true);
    setInternalError(null);
    try {
      const fetched = await loadOptions();
      setInternalOptions(fetched || []);
      setHasLoaded(true);
    } catch (e) {
      setInternalError("Error loading options");
      // Show toast on load error (in English)
      toast({
        title: "Error",
        description: `Couldn't load data for ${errorLabel}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setInternalLoading(false);
    }
  };

  // Auto-flag when there is a preselected value; do not fetch here to avoid unwanted retries
  useEffect(() => {
    if (!autoLoaded && value && !hasLoaded) {
      setAutoLoaded(true);
      if (loadOptions) {
        void tryLoadOptions();
      }
    }
  }, [autoLoaded, value, hasLoaded, loadOptions]);

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(effectiveOptions);
    } else {
      const filtered = effectiveOptions.filter((option) =>
        searchFields.some((field) =>
          option[field]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, effectiveOptions, searchFields]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm(""); // Clear search when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the selected option
  const selectedOption = effectiveOptions.find((option) => option.id === value);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
      if (loadOptions) {
        if (!hasLoaded || internalError) {
          void tryLoadOptions();
        }
      }
    }
  };

  // Get the value to display in the input
  const getInputValue = () => {
    if (isOpen || searchTerm) {
      return searchTerm;
    }
    return selectedOption ? selectedOption[displayField] : "";
  };

  const handleSelectOption = (selectedOption: DropdownOption) => {
    onChange(selectedOption.id, selectedOption);
    setIsOpen(false);
    setSearchTerm(""); // Clear search when selecting
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
            w-full h-10 border rounded-md px-3 py-2 pr-10 text-sm bg-white
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "hover:border-gray-400"
            }
            ${
              hasError
                ? "border-red-500 ring-1 ring-red-500"
                : isOpen
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
          {effectiveLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Loading options...</span>
            </div>
          ) : effectiveError ? (
            <div className="px-3 py-2 text-sm text-red-600">
              {effectiveError}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              {searchTerm
                ? "No options match your search"
                : "No options available"}
            </div>
          ) : (
            <div className="py-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`
                    w-full text-left px-3 py-2 text-sm hover:bg-gray-100
                    flex items-center justify-between
                    ${
                      value === option.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-900"
                    }
                  `}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{option[displayField]}</span>
                    {option[subtitleField] && (
                      <span className="text-xs text-gray-500">
                        {option[subtitleField]}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
