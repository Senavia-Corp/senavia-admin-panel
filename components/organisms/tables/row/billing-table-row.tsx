"use client"

import { StatusBadge } from "@/components/atoms/status-badge"
import { ActionButton } from "@/components/atoms/action-button"
import type { Billings } from "@/types/billing-management"

interface BillingTableRowProps {
  billing: Billings
  onView: (billing: Billings) => void
  onDelete: (billing: Billings) => void
}

export function BillingTableRow({ billing, onView, onDelete }: BillingTableRowProps) {
  const formatCurrency = (amount: string) => {
    const numericAmount = parseFloat(amount)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numericAmount)
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-[#F8F8F8] h-9">
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">{billing.id}</td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">{billing.title || "No title"}</td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">{billing.estimatedTime} months</td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        <StatusBadge status={billing.state} />
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">{formatCurrency(billing.totalValue)}</td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        <div className="flex space-x-2 justify-center
        ">
          <ActionButton type="view" onClick={() => onView(billing)} />
          <ActionButton type="delete" onClick={() => onDelete(billing)} />
        </div>
      </td>
    </tr>
  )
}
