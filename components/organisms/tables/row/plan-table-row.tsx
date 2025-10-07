"use client"

import { StatusBadge } from "@/components/atoms/cost-type-badge"
import { ActionButton } from "@/components/atoms/action-button"


import { Plan } from "@/components/pages/plan/plan"

interface PlanTableRowProps {
  plan: Plan
  onView: (plan: Plan) => void
  onDelete: (plan: Plan) => void
}

export function PlanTableRow({ plan, onView, onDelete }: PlanTableRowProps) {  
    const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 bg-[#F8F8F8] h-9">
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {plan.id}        
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {plan.name}
      </td>
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {plan.description}
      </td>      
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {plan.type}
      </td>  
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        {plan.price}
      </td>      
      <td className="w-1/6 p-5 text-base font-light text-[#04081E] truncate text-center">
        <div className="flex space-x-2 justify-center">
          <ActionButton type="view" onClick={() => onView(plan)} />
          <ActionButton type="delete" onClick={() => onDelete(plan)} />
        </div>
      </td>
    </tr>
  )
}
