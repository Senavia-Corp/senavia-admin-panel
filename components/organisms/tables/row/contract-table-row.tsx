"use client"

import { StatusBadge } from "@/components/atoms/status-badge"
import { ActionButton } from "@/components/atoms/action-button"
import type { Contract } from "@/types/contract-management"

interface ContractTableRowProps {
  contract: Contract
  onView: (contract: Contract) => void
  onDelete: (contract: Contract) => void
}

export function ContractTableRow({ contract, onView, onDelete }: ContractTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-32 px-6 py-4 text-sm text-gray-900 truncate">{contract.id}</td>
      <td className="flex-1 px-6 py-4 text-sm text-gray-900 truncate">{contract.title}</td>
      <td className="w-48 px-6 py-4 text-sm text-gray-900 truncate">{contract.clientName}</td>
      <td className="w-32 px-6 py-4">
        <StatusBadge status={contract.status} />
      </td>
      <td className="w-32 px-6 py-4 text-sm text-gray-900">{formatCurrency(contract.totalValue)}</td>
      <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(contract)} />
          <ActionButton
            type="delete"
            onClick={() => onDelete(contract)}

          />
        </div>
      </td>
    </tr>
  )
}
