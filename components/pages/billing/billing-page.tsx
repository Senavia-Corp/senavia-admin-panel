"use client"
import React, { useState, useEffect, useCallback } from "react"
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog"
import type { Billings, Billing } from "@/types/billing-management"
import { GeneralTable } from "@/components/organisms/tables/general-table"
import { BillingDetailForm } from "@/components/organisms/billing-detail-form"
import { BillingViewModel } from "./BillingViewModel"
import { BillingDetailCreateForm } from "@/components/organisms/billing-detail-form-create"
import { useToast } from "@/hooks/use-toast";
import { TableRowSkeleton } from "@/components/atoms/table-row-skeleton";

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast()

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      setIsInitialLoad(true)
      try {
        await getBillings()
        await getLeads()
        await getPlans()
      } finally {
        setIsInitialLoad(false)
      }
    }
    initializeData()
  }, []) // Solo se ejecuta al montar el componente

  useEffect(() => {
    if (!isInitialLoad) {
      loadBillingRecords()
    }
  }, [billings, searchTerm, statusFilter, isInitialLoad])

  const loadBillingRecords = React.useCallback(async () => {
    try {
      setIsLoading(true)
      let filteredData = [...billings]
      
      // Aplicar filtro de búsqueda por ID y título
      if (searchTerm) {
        filteredData = filteredData.filter(billing => 
          billing.id.toString().includes(searchTerm) ||
          billing.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Aplicar filtro de estado
      if (statusFilter && statusFilter !== "all") {
        filteredData = filteredData.filter(billing => 
          billing.state.toLowerCase() === statusFilter.toLowerCase()
        )
      }
      // Ordenar por ID de menor a mayor
      const sortedData = filteredData.sort((a, b) => a.id - b.id);
      setBillingRecords(sortedData)
    } catch (error) {
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to load billing records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }, [billings, searchTerm, statusFilter]) // Solo se recrea cuando estas dependencias cambien

  const handleDeleteBilling = useCallback(async (billing: Billings) => {
    try {
      setIsLoading(true)
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
    } finally {
      loadBillingRecords()
      setIsLoading(false)
    }
  }, [deleteBilling, getBillings])

  const handleViewBilling = useCallback(async (billing: Billing) => {
    await getLeadById(billing.lead_id)
    setSelectedBillingId(billing.id)
    setSelectedBilling(billing)
    setShowBillingDetail(true)
  }, [getLeadById])

  const handleCreateBilling = useCallback(async () => {
    console.log("Create new billing record")
    setShowCreateBilling(true)
  }, [])

  const handleBackToList = () => {
    setShowBillingDetail(false)
    setShowCreateBilling(false)
  }

  const handleSaveSuccess = async () => {
    setShowBillingDetail(false)
    setShowCreateBilling(false)
    setIsLoading(true)
    try {
      await getBillings()
    } catch (error) {
      setHasError(true)
      toast({
        title: "Error",
        description: "Failed to refresh billings. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
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
              onBackRefresh={async () => {
                await getBillings();
              }}
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
              <h1 className="text-2xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">Billing Management</h1>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "billing-page",
                "Add Billing",
                "Create estimates, invoices, and payments for client projects.",
                "All Billing",
                "Description",
                ["Billing ID","Title", "Estimated Time", "State", "Total", "Actions"],
                billingRecords,
                handlers,
                {
                  isLoading: isLoading || isInitialLoad,
                  hasError,
                  onRetry: loadBillingRecords,
                  emptyStateTitle: "No billing records found",
                  emptyStateDescription:
                    searchTerm || statusFilter
                      ? "No billing records match your current filters. Try adjusting your search criteria."
                      : "No billing records have been created yet. Click the '+' button to create the first billing record.",
                  skeletonComponent: () => (
                    <TableRowSkeleton columns={4} actions={2} />
                  ),
                  skeletonCount: 5,
                  searchPlaceholder: "Search by ID or title...",
                }
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
