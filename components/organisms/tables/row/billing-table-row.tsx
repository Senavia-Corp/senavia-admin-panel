"use client"

import { StatusBadge } from "@/components/atoms/status-badge"
import { ActionButton } from "@/components/atoms/action-button"
import type { BillingRecord } from "@/types/billing-management"

interface BillingTableRowProps {
  billing: BillingRecord
  onView: (billing: BillingRecord) => void
  onDelete: (billing: BillingRecord) => void
}

export function BillingTableRow({ billing, onView, onDelete }: BillingTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-[#F8F8F8] h-9">
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">{billing.id}</td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">{billing.estimatedTime} months</td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        <StatusBadge status={billing.status} />
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
