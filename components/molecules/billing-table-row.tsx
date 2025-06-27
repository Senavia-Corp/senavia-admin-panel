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
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-32 px-6 py-4 text-sm text-gray-900 truncate">{billing.id}</td>
      <td className="w-40 px-6 py-4 text-sm text-gray-900">{billing.estimatedTime} months</td>
      <td className="flex-1 px-6 py-4">
        <StatusBadge status={billing.status} />
      </td>
      <td className="w-32 px-6 py-4 text-sm text-gray-900">{formatCurrency(billing.totalValue)}</td>
      <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(billing)} className="text-gray-700 hover:text-gray-900" />
          <ActionButton type="delete" onClick={() => onDelete(billing)} className="text-gray-700 hover:text-gray-900" />
        </div>
      </td>
    </tr>
  )
}
