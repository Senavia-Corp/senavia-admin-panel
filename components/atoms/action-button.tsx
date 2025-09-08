"use client";

import { Button } from "@/components/ui/button";
import { Eye, Trash2, Pencil } from "lucide-react";

interface ActionButtonProps {
  type: "view" | "delete" | "edit";
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "lg";
}

export function ActionButton({
  type,
  onClick,
  disabled,
  size = "sm",
}: ActionButtonProps) {
  const Icon = type === "view" ? Eye : type === "edit" ? Pencil : Trash2;
  const btnSize = size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const iconSize = "!h-5 !w-5";
  return (
    <Button
      variant="ghost"
      size={size === "lg" ? undefined : "sm"}
      onClick={onClick}
      disabled={disabled}
      className={`${btnSize} p-0 hover:bg-gray-100 text-black hover:text-gray-800`}
    >
      <Icon className={iconSize} />
    </Button>
  );
}
