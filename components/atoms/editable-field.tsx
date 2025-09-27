import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface EditableFieldProps {
  fieldName:
    | "email"
    | "password"
    | "name"
    | "phone"
    | "address"
    | "profileImage";
  label: string;
  type?: string;
  isLoading?: boolean;
  isEditing?: boolean; // optional: controlled mode if provided
  onToggle?: () => void; // optional: controlled mode if provided
}

export default function EditableField({
  fieldName,
  label,
  type = "text",
  isLoading = false,
  isEditing,
  onToggle,
}: EditableFieldProps) {
  const { register, watch, formState, resetField } = useFormContext();
  const [internalEditing, setInternalEditing] = useState(false);
  const editing = isEditing !== undefined ? isEditing : internalEditing;
  const currentValue = watch(fieldName);
  const displayValue =
    fieldName === "profileImage"
      ? currentValue
        ? "Image selected"
        : "No image"
      : (currentValue as string);

  // Close edit mode automatically after successful submit (only in uncontrolled mode)
  useEffect(() => {
    if (!isEditing && formState.isSubmitSuccessful) {
      setInternalEditing(false);
    }
  }, [formState.isSubmitSuccessful, isEditing]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
      return;
    }
    setInternalEditing((prev) => {
      const next = !prev;
      if (!next) {
        // cancelling edit → revert field value
        resetField(fieldName as any);
      }
      return next;
    });
  };

  return (
    <div
      className={`bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 mb-1">{label}</p>
        {isEditing ? (
          <input
            {...register(fieldName)}
            type={type}
            disabled={isLoading}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#abd45a] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoFocus
          />
        ) : (
          <p className="text-sm text-gray-500">{displayValue}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isLoading}
          className={`rounded-full border-0 px-5 py-1 font-bold text-[14px] h-8 transition-all flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
            editing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-[#abd45a] hover:bg-[#9bc04e] text-white hover:shadow-[0_0_15px_rgba(171,212,90,0.7)]"
          }`}
        >
          {editing ? "Cancel" : "Change"}
        </button>
      </div>
    </div>
  );
}
