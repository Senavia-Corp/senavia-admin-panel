"use client"

import { StatusBadge } from "@/components/atoms/cost-type-badge"
import { ActionButton } from "@/components/atoms/action-button"

import { Clause } from "@/components/pages/clause/clause"

interface ClauseTableRowProps {
  clause: Clause
  onView: (clause: Clause) => void
  onDelete: (clause: Clause) => void
}

export function ClauseTableRow({ clause, onView, onDelete }: ClauseTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-[#F8F8F8] h-9">
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {clause.id}.        
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {clause.title}
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {clause.description}
      </td>      
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        <div className="flex space-x-2 justify-center">
          <ActionButton type="view" onClick={() => onView(clause)} />
          <ActionButton type="delete" onClick={() => onDelete(clause)} />
        </div>
      </td>
    </tr>
  )
}
