"use client"
import React, { useState, useEffect, useCallback } from "react"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import type { BillingRecord, Billings, Billing } from "@/types/billing-management"
import { GeneralTable } from "@/components/organisms/tables/general-table"
import { BillingDetailForm } from "@/components/organisms/billing-detail-form"
import { BillingViewModel } from "./BillingViewModel"
import { BillingDetailCreateForm } from "@/components/organisms/billing-detail-form-create"
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast()

  useEffect(() => {
    getBillings()
    getLeads()
    getPlans()
  }, []) // Solo se ejecuta al montar el componente

  useEffect(() => {
    if (billings.length > 0) {
      loadBillingRecords()
    }
  }, [billings, searchTerm, statusFilter])

  const loadBillingRecords = React.useCallback(async () => {
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
    } catch (error) {
      console.error("Error loading billing records:", error)
    }
  }, [billings, searchTerm, statusFilter]) // Solo se recrea cuando estas dependencias cambien

  const handleDeleteBilling = useCallback(async (billing: Billings) => {
    try {
      const res =await deleteBilling(billing.id)
      if (res) {
        toast({
          title: "Success",
          description: "Estimate deleted successfully",
        })
        setBillingToDelete(null)
        getBillings() // Recargar datos del ViewModel
      }
      else {
        toast({
          title: "Error deleting estimate record",
          description: "Failed to delete billing record. The estimate may have projects associated with it."
        })
      }
    } catch (error) {
      console.error("Error deleting billing:", error);
    }
  }, [deleteBilling, getBillings])

  const handleViewBilling = useCallback(async (billing: Billing) => {
    await getLeadById(billing.lead_id)
    setSelectedBillingId(billing.id)
    setSelectedBilling(billing)
    setShowBillingDetail(true)
  }, [getLeadById])

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

  const handlers = React.useMemo(() => ({
    onCreate: handleCreateBilling,
    onView: handleViewBilling,
    onDelete: (billing: Billings) => setBillingToDelete(billing),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  }), [handleCreateBilling, handleViewBilling, handleFilterChange])

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
