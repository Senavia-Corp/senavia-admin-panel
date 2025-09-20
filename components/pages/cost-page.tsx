"use client";

import { useState, useEffect } from "react";
import { BillingTable } from "@/components/organisms/billing-table";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bell } from "lucide-react";
import { BillingManagementService } from "@/services/billing-management-service";
import type { BillingRecord } from "@/types/billing-management";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { BillingDetailForm } from "@/components/organisms/billing-detail-form";
import { CostDetailFormCreate } from "@/components/organisms/cost-detail-form-create";
import { BillingViewModel } from "./billing/BillingViewModel";
import { toast } from "sonner";
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
  const [filteredCosts, setFilteredCosts] = useState(initialCosts);
  const [billingToDelete, setBillingToDelete] = useState<
    (typeof costs)[0] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateCost, setShowCreateCost] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState<number>();
  const [showCostDetail, setShowCostDetail] = useState(false);
  const { deleteCost } = BillingViewModel();

  useEffect(() => {
    filterCosts();
  }, [searchTerm, statusFilter, costs]);

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
      await deleteCost(costToDelete.id);
      setCosts((prevCosts) =>
        prevCosts.filter((cost) => cost.id !== costToDelete.id)
      );
      toast.success("Cost deleted successfully");
    } catch (error) {
      console.error("Error deleting cost", error);
      toast.error("Failed to delete cost");
    }
  };

  const handleViewCost = (cost: (typeof costs)[0]) => {
    setSelectedBillingId(cost.id);
    setShowCostDetail(true);
  };

  const handleCostUpdate = (updatedCost: Cost) => {
    setCosts((prevCosts) =>
      prevCosts.map((cost) => (cost.id === updatedCost.id ? updatedCost : cost))
    );
  };

  const handleCostCreate = (newCost: Cost) => {
    setCosts((prevCosts) => [...prevCosts, newCost]);
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
          totalValue={totalValue}
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
          totalValue={totalValue}
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
            <div className="my-3 flex flex-row space-x-1">
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
              {GeneralTable(
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
