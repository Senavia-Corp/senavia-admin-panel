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
  // Datos mockup para costos
  const mockupCosts = [
    {
      id: 1,
      name: "Materiales de Diseño",
      type: "Material",
      value: 1500.00,
      description: "Materiales para diseño gráfico y web",
      status: "processing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Licencias Software",
      type: "Software",
      value: 2500.00,
      description: "Licencias anuales de software de diseño",
      status: "finished",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Hosting y Dominio",
      type: "Servicio",
      value: 800.00,
      description: "Hosting anual y renovación de dominio",
      status: "development",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const [billingRecords, setBillingRecords] = useState(mockupCosts)
  const [billingToDelete, setBillingToDelete] = useState<typeof mockupCosts[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showCreateBilling, setShowCreateBilling] = useState(false)
  const [selectedBillingId, setSelectedBillingId] = useState<number>()
  const [showBillingDetail, setShowBillingDetail] = useState(false)

  useEffect(() => {
    loadBillingRecords()
  }, [searchTerm, statusFilter])

  const loadBillingRecords = () => {
    // Filtrar los datos mockup según searchTerm y statusFilter
    const filteredData = mockupCosts.filter(cost => 
      cost.name ||
      cost.type
    );
    setBillingRecords(filteredData);
  }

  const handleDeleteBilling = (cost: typeof mockupCosts[0]) => {
    // Simular eliminación filtrando el costo del array
    setBillingRecords(prev => prev.filter(item => item.id !== cost.id));
    setBillingToDelete(null);
  }

  const handleViewBilling = (cost: typeof mockupCosts[0]) => {
    console.log("View cost:", cost)
    setSelectedBillingId(cost.id)
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
    onDelete: (cost: typeof mockupCosts[0]) => setBillingToDelete(cost),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
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

  

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="my-3">
            <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">Costs</h1>
            <p className="font-bold text-[#393939] text-5xl">
              Total: {formatCurrency(billingRecords.reduce((sum, cost) => sum + cost.value, 0))}
            </p>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "costs-page",
                "Add Cost",
                "Description",
                "All Costs",
                "Description",
                ["Cost ID", "Name", "Type", "Status", "Value", "Actions"],
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
