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

export function CostPage() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([])
  const [billingToDelete, setBillingToDelete] = useState<BillingRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showCreateBilling, setShowCreateBilling] = useState(false)
  const [selectedBillingId, setSelectedBillingId] = useState<string | undefined>()
  const [showBillingDetail, setShowBillingDetail] = useState(false)

  useEffect(() => {
    loadBillingRecords()
  }, [searchTerm, statusFilter])

  const loadBillingRecords = async () => {
    try {
      const billingData = await BillingManagementService.getBillingRecords(searchTerm, statusFilter)
      setBillingRecords(billingData)
    } catch (error) {
      console.error("Error loading billing records:", error)
    }
  }

  const handleDeleteBilling = async (billing: BillingRecord) => {
    try {
      await BillingManagementService.deleteBillingRecord(billing.id)
      setBillingToDelete(null)
      loadBillingRecords()
    } catch (error) {
      console.error("Error deleting billing record:", error)
    }
  }

  const handleViewBilling = (billing: BillingRecord) => {
    console.log("View billing:", billing)
    setSelectedBillingId(billing.id)
    setShowBillingDetail(true)
    // TODO: Implement billing detail view
  }

  const handleCreateBilling = () => {
    console.log("Create new billing record")
    setShowCreateBilling(true)
  }

  const handleBackToList = () => {
    setShowBillingDetail(false)
    setShowCreateBilling(false)
  }

  const handleSaveSuccess = () => {
    setShowBillingDetail(false)
    setShowCreateBilling(false)
    loadBillingRecords()
  }

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":")
    if (type === "status") {
      setStatusFilter(value)
    }
  }

  const handlers = {
    onCreate: handleCreateBilling,
    onView: handleViewBilling,
    onDelete: (billing: BillingRecord) => setBillingToDelete(billing),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (showBillingDetail || showCreateBilling) {
    return (
      <div className="">
        <main className="">
          <div className="px-6 py-6 h-full">
            <BillingDetailForm
              billingId={selectedBillingId}
              onBack={handleBackToList}
              onSave={handleSaveSuccess}
            />
          </div>
        </main>
      </div>
    )
  }

  

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="my-3 space-y-5">
              <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">Costs</h1>
              <p className="font-bold text-[#393939] text-5xl">{formatCurrency(billingRecords[0].totalValue)}</p>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "billing-page",
                "Add Cost",
                "Description",
                "All Costs",
                "Description",
                ["Billing ID", "Estimated Time", "State", "Total", "Actions"],
                billingRecords,
                handlers
              )}
            </div>
          </div>
        </div>
      </main>

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
