"use client";

import { ThemeBadge } from "@/components/atoms/theme-badge";
import { ActionButton } from "@/components/atoms/action-button";
import type { Project } from "@/components/pages/project/project";
import type { Product } from "@/components/pages/product/product";

interface PortfolioTableRowProps {
  product: Product;
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function PortfolioTableRow({
  product,
  onView,
  onDelete,
}: PortfolioTableRowProps) {
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-24 px-6 py-4 text-sm text-gray-900 truncate">
        {product.id} 
      </td>
      <td className="flex-1 px-6 py-4 text-sm text-gray-900 truncate">
        {product.name} 
      </td>

      <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(product)} />
          <ActionButton type="delete" onClick={() => onDelete(product)} />
        </div>
      </td>
    </tr>
  );
}
