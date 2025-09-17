"use client"
import { useState, useEffect } from "react"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import type { BillingRecord, Billings, Billing } from "@/types/billing-management"
import { GeneralTable } from "@/components/organisms/tables/general-table"
import { BillingDetailForm } from "@/components/organisms/billing-detail-form"
import { BillingViewModel } from "./BillingViewModel"
import { BillingDetailCreateForm } from "@/components/organisms/billing-detail-form-create"

export function BillingPage() {
  const [billingRecords, setBillingRecords] = useState<Billings[]>([])
  const [billingToDelete, setBillingToDelete] = useState<Billings | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showCreateBilling, setShowCreateBilling] = useState(false)
  const [selectedBillingId, setSelectedBillingId] = useState<number>()
  const [showBillingDetail, setShowBillingDetail] = useState(false)
  const { billings, getBillings, getLeads, leads, getLeadById, lead, deleteBilling, getPlans, plans } = BillingViewModel()
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null)

  useEffect(() => {
    getBillings()
    getLeads()
    getPlans()
  }, [searchTerm, statusFilter])

  useEffect(() => {
    if (billings.length > 0) {
      loadBillingRecords()
    }
  }, [billings, searchTerm, statusFilter])

  const loadBillingRecords = async () => {
    try {
      let filteredData = [...billings]
      
      // Aplicar filtro de búsqueda
      if (searchTerm) {
        filteredData = filteredData.filter(billing => 
          billing.id.toString().includes(searchTerm)
        )
      }

      // Aplicar filtro de estado
      if (statusFilter && statusFilter !== "all") {
        filteredData = filteredData.filter(billing => 
          billing.state.toLowerCase() === statusFilter.toLowerCase()
        )
      }

      setBillingRecords(filteredData)
      console.log("Filtered billing records:", filteredData)
    } catch (error) {
      console.error("Error loading billing records:", error)
    }
  }

  const handleDeleteBilling = async (billing: Billings) => {
    try {
      await deleteBilling(billing.id)
      setBillingToDelete(null)
      getBillings() // Recargar datos del ViewModel
    } catch (error) {
      console.error("Error deleting billing record:", error)
    }
  }

  

  const handleViewBilling = (billing: Billing) => {
    getLeadById(billing.lead_id)
    console.log("Lead:", lead)
    console.log("View billing:", billing)
    setSelectedBillingId(billing.id)
    setSelectedBilling(billing)
    setShowBillingDetail(true)
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
    onDelete: (billing: Billings) => setBillingToDelete(billing),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  }

  if (showBillingDetail) {
    return (
      <div className="">
        <main className="">
          <div className="px-6 py-6 h-full">
            <BillingDetailForm
              selectedBilling={selectedBilling!}
              billingId={selectedBillingId!}
              leads={leads}
              lead={lead}
              plans={plans}
              onBack={handleBackToList}
              onSave={handleSaveSuccess}
            />
          </div>
        </main>
      </div>
    )
  }

  if (showCreateBilling) {
    return (
      <div className="">
        <main className="">
          <div className="px-6 py-6 h-full">
            <BillingDetailCreateForm
              selectedBilling={null}
              leads={leads} 
              lead={lead}
              plans={plans}
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
            <div className="my-3">
              <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">Billing Management</h1>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "billing-page",
                "Add Billing",
                "Description",
                "All Billing",
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
