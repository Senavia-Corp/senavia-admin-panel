"use client"

import { useState, useEffect } from "react"
import { BillingTable } from "@/components/organisms/billing-table"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell } from "lucide-react"
import { BillingManagementService } from "@/services/billing-management-service"
import type { BillingRecord } from "@/types/billing-management"
import { GeneralTable } from "@/components/organisms/tables/general-table"
import { BillingDetailForm } from "@/components/organisms/billing-detail-form"
import { Cost } from "@/types/billing-management"
import { CostDetailFormCreate } from "@/components/organisms/cost-detail-form-create"

interface CostPageProps {
  costs: Cost[];
  estimateId: number;
  onBack?: () => void;
}

export function CostPage({ costs, estimateId, onBack }: CostPageProps) {
  const [billingRecords, setBillingRecords] = useState(costs)
  const [billingToDelete, setBillingToDelete] = useState<typeof costs[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showCreateCost, setShowCreateCost] = useState(false)
  const [selectedBillingId, setSelectedBillingId] = useState<number>()
  const [showCostDetail, setShowCostDetail] = useState(false)

  useEffect(() => {
    loadBillingRecords()
  }, [searchTerm, statusFilter])

  const loadBillingRecords = () => {
    // Filtrar los datos mockup según searchTerm y statusFilter
    const filteredData = costs.filter(cost => 
      cost.name ||
      cost.type
    );
    setBillingRecords(filteredData);
  }

  const handleDeleteBilling = (cost: typeof costs[0]) => {
    // Simular eliminación filtrando el costo del array
    setBillingRecords(prev => prev.filter(item => item.id !== cost.id));
    setBillingToDelete(null);
  } 

  const handleViewCost = (cost: typeof costs[0]) => {
    console.log("View cost:", cost)
    setSelectedBillingId(cost.id)
    setShowCostDetail(true)
  }

  const handleCreateCost = () => {
    console.log("Create new billing record")
    setShowCreateCost(true)
  }

  const handleBackToList = () => {
    setShowCostDetail(false)
    setShowCreateCost(false)
  }

  const handleSaveSuccess = () => {
    setShowCostDetail(false)
    setShowCreateCost(false)
    loadBillingRecords()
  }

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":")
    if (type === "status") {
      setStatusFilter(value)
    }
  }

  const handlers = {
    onCreate: handleCreateCost,
    onView: handleViewCost,
    onDelete: (cost: typeof costs[0]) => setBillingToDelete(cost),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // if (showCostDetail) {
  //   return (
  //     <div className="">
  //       <CostDetailFormCreate />
  //     </div>
  //   )
  // }

  if (showCreateCost) {
    return (
      <div className="">
        <CostDetailFormCreate estimateId={estimateId} />
      </div>
    )
  }

  // if (showBillingDetail) {
  //   return (
  //     <div className="">
  //       <main className="">
  //         <div className="px-6 py-6 h-full">
  //           <BillingDetailForm
  //             billingId={selectedBillingId || 0}
  //             selectedBilling={mockupCosts.find(c => c.id === selectedBillingId) || null}
  //             leads={[]}
  //             lead={[]}
  //             onBack={handleBackToList}
  //             onSave={handleSaveSuccess}
  //           />
  //         </div>
  //       </main>
  //     </div>
  //   )
  // }

  // if (showCreateBilling) {
  //   return (
  //     <div className="">
  //       <main className="">
  //         <div className="px-6 py-6 h-full">
  //           <BillingDetailForm
  //             billingId={0}
  //             selectedBilling={null}
  //             leads={[]}
  //             lead={[]}
  //             onBack={handleBackToList}
  //             onSave={handleSaveSuccess}
  //           />
  //         </div>
  //       </main>
  //     </div>
  //   )
  // }

  ""

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="my-3">
            <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">Costs</h1>
            <p className="font-bold text-[#393939] text-5xl">
            </p>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "costs-page",
                `Add Cost | Total: ${formatCurrency(billingRecords.reduce((sum, cost) => sum + cost.value, 0))}`,
                "Description",
                "All Costs",
                "Description",
                ["Cost ID", "Name", "Type", "Value", "Actions"],
                billingRecords,
                handlers
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={!!billingToDelete}
        onClose={() => setBillingToDelete(null)}
        onConfirm={() => billingToDelete && handleDeleteBilling(billingToDelete)}
        title="Delete Billing Record"
        description={`Are you sure you want to delete billing record "${billingToDelete?.id}"? This action cannot be undone.`}
      />
    </div>
  )
}
