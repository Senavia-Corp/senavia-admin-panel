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

export function BillingPage() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([])
  const [billingToDelete, setBillingToDelete] = useState<BillingRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

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
    // TODO: Implement billing detail view
  }

  const handleCreateBilling = () => {
    console.log("Create new billing record")
    // TODO: Implement billing creation
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center space-x-2">
              <img src="/images/senavia-logo.png" alt="Senavia Logo" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">U</span>
              </div>
              <span className="text-sm font-medium">Username</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">Billing Management</h1>

            <div className="flex-1 min-h-0">
              <BillingTable
                billingRecords={billingRecords}
                onAddBilling={handleCreateBilling}
                onViewBilling={handleViewBilling}
                onDeleteBilling={setBillingToDelete}
                onSearch={setSearchTerm}
                onStatusFilter={setStatusFilter}
              />
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
