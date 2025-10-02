"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { CostDetailFormCreate } from "@/components/organisms/cost-detail-form-create";
import { BillingViewModel, } from "./billing/BillingViewModel";
import { useToast } from "@/hooks/use-toast";
import type { Cost } from "@/types/cost-management";
import { CostDetailForm } from "../organisms/cost-detail-form";


interface CostPageProps {
  costs: Cost[];
  totalValue: number;
  estimateId: number;
  onBack?: () => void;
}

export function CostPage({
  costs: initialCosts,
  totalValue,
  estimateId,
  onBack,
}: CostPageProps) {
  const [costs, setCosts] = useState(initialCosts);
  const [currentTotalValue, setCurrentTotalValue] = useState(totalValue);
  const [filteredCosts, setFilteredCosts] = useState(initialCosts);
  const [billingToDelete, setBillingToDelete] = useState<
    (typeof costs)[0] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateCost, setShowCreateCost] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState<number>();
  const [showCostDetail, setShowCostDetail] = useState(false);
  const vm = BillingViewModel();
  const { deleteCost, PatchBilling, getBilling, billing } = vm;
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    filterCosts();
  }, [searchTerm, statusFilter, costs]);

  // Refrescar desde backend por estimateId
  useEffect(() => {
    refreshFromBackend();
  }, [estimateId]);

  const refreshFromBackend = async () => {
    try {
      setIsRefreshing(true);
      await getBilling(estimateId);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Cuando llegue billing del VM, sincronizar costos/total
  useEffect(() => {
    if (billing && Array.isArray(billing) && billing.length > 0) {
      const latest = billing[0] as unknown as { costs?: Cost[]; totalValue?: number };
      const latestCosts = latest.costs || [];
      const latestTotal = typeof latest.totalValue === "number" ? latest.totalValue : totalValue;
      setCosts(latestCosts);
      setFilteredCosts(latestCosts);
      setCurrentTotalValue(latestTotal);
    }
  }, [billing]);

  // Sincronizar cuando cambien los props (por ejemplo, tras refrescar desde el padre)
  useEffect(() => {
    setCosts(initialCosts);
    setFilteredCosts(initialCosts);
    setCurrentTotalValue(totalValue);
  }, [initialCosts, totalValue]);

  const filterCosts = () => {
    let filtered = costs;

    if (searchTerm) {
      filtered = filtered.filter(
        (cost) =>
          cost.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cost.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((cost) => cost.type === statusFilter);
    }

    setFilteredCosts(filtered);
  };

  const handleDeleteBilling = async (costToDelete: Cost) => {
    try {
      setIsRefreshing(true);
      await deleteCost(costToDelete.id);
      
      // Calcular el nuevo totalValue restando el valor del costo eliminado
      const newTotalValue = currentTotalValue - costToDelete.value;
      
      setCosts((prevCosts) =>
        prevCosts.filter((cost) => cost.id !== costToDelete.id)
      );
      setCurrentTotalValue(newTotalValue);
      
      await PatchBilling(estimateId, {
        totalValue: newTotalValue
      });
      await refreshFromBackend();
      toast({
        title: "Cost deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting cost", error);
      toast({
        title: "Failed to delete cost",
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewCost = (cost: (typeof costs)[0]) => {
    setSelectedBillingId(cost.id);
    setShowCostDetail(true);
  };

  const handleCostUpdate = async (updatedCost: Cost) => {
    setCosts((prevCosts) => {
      const oldCost = prevCosts.find((cost) => cost.id === updatedCost.id);
      if (oldCost) {
        const valueDifference = updatedCost.value - oldCost.value;
        setCurrentTotalValue((prevTotal) => prevTotal + valueDifference);
      }
      return prevCosts.map((cost) => (cost.id === updatedCost.id ? updatedCost : cost));
    });
    await refreshFromBackend();
  };

  const handleCostCreate = async (newCost: Cost) => {
    setCosts((prevCosts) => [...prevCosts, newCost]);
    setCurrentTotalValue((prevTotal) => prevTotal + newCost.value);
    await refreshFromBackend();
  };

  const handleCreateCost = () => {
    console.log("Create new billing record");
    setShowCreateCost(true);
  };

  const handleBackToList = () => {
    setShowCostDetail(false);
    setShowCreateCost(false);
  };

  const handleSaveSuccess = () => {
    setShowCostDetail(false);
    setShowCreateCost(false);
    filterCosts();
  };

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":");
    if (type === "status") {
      setStatusFilter(value);
    }
  };

  const handlers = {
    onCreate: handleCreateCost,
    onView: handleViewCost,
    onDelete: (cost: (typeof costs)[0]) => setBillingToDelete(cost),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (showCostDetail && selectedBillingId) {
    return (
      <div className="">
        <CostDetailForm
          billingId={estimateId}
          costId={selectedBillingId}
          totalValue={currentTotalValue}
          cost={costs.find((cost) => cost.id === selectedBillingId)!}
          onBack={handleBackToList}
          onUpdate={handleCostUpdate}
        />
      </div>
    );
  }

  if (showCreateCost) {
    return (
      <div className="">
        <CostDetailFormCreate
          estimateId={estimateId}
          totalValue={currentTotalValue}
          onBack={handleBackToList}
          onCreateSuccess={handleCostCreate}
        />
      </div>
    );
  }

  ("");

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="my-3 flex flex-row space-x-1 items-center">
              <Button
                variant="ghost"
                size="sm"
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-4xl font-medium text-gray-900 border-l-4 border-[#99CC33] pl-4">
                Costs
              </h1>
              <p className="font-bold text-[#393939] text-5xl"></p>
            </div>
            <div className="flex-1 min-h-0">
              {isRefreshing ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 w-1/3 bg-gray-200 rounded" />
                    <div className="h-10 w-full bg-gray-100 rounded" />
                    <div className="h-10 w-full bg-gray-100 rounded" />
                    <div className="h-10 w-full bg-gray-100 rounded" />
                    <div className="h-10 w-full bg-gray-100 rounded" />
                  </div>
                </div>
              ) : (
                GeneralTable(
                  "costs-page",
                  `Add Cost | Total: ${formatCurrency(
                    filteredCosts.reduce((sum, cost) => sum + cost.value, 0)
                  )}`,
                  "Description",
                  "All Costs",
                  "Description",
                  ["Cost ID", "Name", "Type", "Value", "Actions"],
                  filteredCosts,
                  handlers
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={!!billingToDelete}
        onClose={() => setBillingToDelete(null)}
        onConfirm={() =>
          billingToDelete && handleDeleteBilling(billingToDelete)
        }
        title="Delete Billing Record"
        description={`Are you sure you want to delete billing record "${billingToDelete?.id}"? This action cannot be undone.`}
      />
    </div>
  );
}
