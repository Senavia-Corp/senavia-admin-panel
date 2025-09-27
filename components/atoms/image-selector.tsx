import React, { useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";

interface ImageSelectorProps {
  /** Current selected image file */
  value?: File | null;
  /** Callback when image is selected or removed */
  onChange?: (file: File | null) => void;
  /** Placeholder text when no image is selected */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Preview image size */
  previewSize?: "small" | "medium" | "large";
  /** Accept file types */
  accept?: string;
  /** Show upload button */
  showUploadButton?: boolean;
  /** Upload button text */
  uploadButtonText?: string;
  /** Show remove button */
  showRemoveButton?: boolean;
  /** Show preview */
  showPreview?: boolean;
  /** Show file name input */
  showFileName?: boolean;
}

const sizeClasses = {
  small: "w-20 h-20",
  medium: "w-32 h-32",
  large: "w-48 h-48",
};

export function ImageSelector({
  value = null,
  onChange,
  placeholder = "No image selected",
  className = "",
  disabled = false,
  previewSize = "medium",
  accept = "image/*",
  showUploadButton = true,
  uploadButtonText = "Upload image",
  showRemoveButton = true,
  showPreview = true,
  showFileName = true,
}: ImageSelectorProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview URL when value changes
  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onChange) {
      onChange(file);
    }
  };

  const handleRemoveImage = () => {
    if (onChange) {
      onChange(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* File name display */}
      {showFileName && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            className={`flex-1 border rounded px-3 py-2 text-sm bg-gray-50 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            value={value?.name || placeholder}
            readOnly
            disabled={disabled}
          />
          {showRemoveButton && previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled}
              className={`p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Remove image"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}

      {/* Image preview */}
      {showPreview && (
        <div className="flex justify-start">
          {previewUrl ? (
            <div
              className={`${sizeClasses[previewSize]} border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50`}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className={`${
                sizeClasses[previewSize]
              } border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleUploadClick}
            >
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-gray-400 text-sm text-center px-2">
                Click to upload
              </span>
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      {showUploadButton && (
        <button
          type="button"
          className={`px-4 py-2 bg-[#181B29] text-white rounded-full text-sm hover:bg-[#252938] transition-colors flex items-center gap-2 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleUploadClick}
          disabled={disabled}
        >
          <Upload size={16} />
          {uploadButtonText}
        </button>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
        disabled={disabled}
      />
    </div>
  );
}
