"use client"

import { StatusBadge } from "@/components/atoms/status-badge"
import { ActionButton } from "@/components/atoms/action-button"

interface Cost {
  id: number
  name: string
  type: string
  value: number
  description: string
  status: string
  createdAt: string
  updatedAt: string
}

interface CostTableRowProps {
  cost: Cost
  onView: (cost: Cost) => void
  onDelete: (cost: Cost) => void
}

export function CostTableRow({ cost, onView, onDelete }: CostTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-[#F8F8F8] h-9">
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {cost.id}
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {cost.name}
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {cost.type}
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        <StatusBadge status={cost.status} />
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {formatCurrency(cost.value)}
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        <div className="flex space-x-2 justify-center">
          <ActionButton type="view" onClick={() => onView(cost)} />
          <ActionButton type="delete" onClick={() => onDelete(cost)} />
        </div>
      </td>
    </tr>
  )
}
