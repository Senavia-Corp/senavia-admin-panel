"use client";

import { StatusBadge } from "@/components/atoms/status-badge";
import { ActionButton } from "@/components/atoms/action-button";
import type { Contract } from "@/types/contract-management";

interface ContractTableRowProps {
  contract: Contract;
  onView: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
}

export function ContractTableRow({
  contract,
  onView,
  onDelete,
  onEdit,
}: ContractTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <tr className="bg-[#F8F8F8]">
      <td className="w-1/6 px-6 py-[10px] font-sans font-light text-sm leading-none tracking-normal text-center align-middle text-gray-900 truncate">
        {contract.id}
      </td>
      <td className="w-1/6 px-6 py-[10px] font-sans font-light text-sm leading-none tracking-normal text-center align-middle text-gray-900 truncate">
        {contract.title}
      </td>
      <td className="w-1/6 px-6 py-[10px] font-sans font-light text-sm leading-none tracking-normal text-center align-middle text-gray-900 truncate">
        {contract.clientName}
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <StatusBadge status={contract.status} />
      </td>
      <td className="w-1/6 px-6 py-[10px] font-sans font-light text-sm leading-none tracking-normal text-center align-middle text-gray-900">
        {formatCurrency(contract.totalValue)}
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <div className="flex justify-center items-center h-full space-x-2">
          <ActionButton type="view" onClick={() => onView(contract)} />
          {onEdit && (
            <ActionButton type="edit" onClick={() => onEdit(contract)} />
          )}
          <ActionButton type="delete" onClick={() => onDelete(contract)} />
        </div>
      </td>
    </tr>
  );
}
