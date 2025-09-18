"use client";

import { StatusBadge } from "@/components/atoms/status-badge";
import { ActionButton } from "@/components/atoms/action-button";
import type { Payment } from "@/types/payment-management";

interface PaymentTableRowProps {
  payment: Payment;
  onView: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

export function PaymentTableRow({
  payment,
  onView,
  onDelete,
}: PaymentTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING":
        return "bg-blue-100 text-blue-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-[#F8F8F8] h-9">
      <td className="w-1/8 p-5 text-base font-light text-[#04081E] truncate text-center">
        {payment.id}
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {payment.reference}
      </td>
      <td className="w-1/4 p-5 text-base font-light text-[#04081E] truncate text-center">
        {payment.description}
      </td>
      <td className="w-1/8 p-5 text-base font-light text-[#04081E] truncate text-center">
        {formatCurrency(payment.amount)}
      </td>
      <td className="w-1/8 p-5 text-base font-light text-[#04081E] truncate text-center">
        {payment.percentagePaid}%
      </td>
      <td className="w-1/8 p-5 text-base font-light text-[#04081E] truncate text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(
            payment.state
          )}`}
        >
          {payment.state}
        </span>
      </td>
      <td className="w-1/8 p-5 text-base font-light text-[#04081E] truncate text-center">
        {formatDate(payment.paidDate)}
      </td>
      <td className="w-1/8 p-5 text-base font-light text-[#04081E] truncate text-center">
        {payment.method || "N/A"}
      </td>
      <td className="w-1/8 p-5 text-base font-light text-[#04081E] truncate text-center">
        <div className="flex space-x-2 justify-center">
          <ActionButton type="view" onClick={() => onView(payment)} />
          <ActionButton type="delete" onClick={() => onDelete(payment)} />
        </div>
      </td>
    </tr>
  );
}
