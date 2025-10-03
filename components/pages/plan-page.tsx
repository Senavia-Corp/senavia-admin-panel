"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Clause } from "./clause/clause";
import type{Plan} from"./plan/plan";
import { PlanEditor } from "../organisms/plan-editor";
import { GeneralTable } from "@/components/organisms/tables/general-table";
//import ClauseViewModel from "./clause/ClauseViewModel";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "../molecules/Pagination-control";
import { Pagination } from "../ui/pagination";
import { ClauseTableRowSkeleton } from "../atoms/clause-table-row-skeleton";
import { PlanViewModel } from "./plan/PlanViewModel";

export function PlanPage() {
  const [clauseToDelete, setClauseToDelete] = useState<Clause | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const {
    getAllPlans,plans, loading,deletePlan
  } = PlanViewModel({ isPaginated: true, offset, itemsPerPage, searchTerm });
  
  const [entityToDelete, setEntityToDelete] = useState<Clause | null>(null);
  const [dataClauses, setDataClauses] = useState<Clause[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    setOffset(0);
  }, [searchTerm]);

  const handleView = (plan: Plan) => {
    setEditingId(plan.id);

    setShowEditor(true);
  };

  const handleCreateBlog = () => {
    setEditingId(null);
    setShowEditor(true);
  };
  const handleFilterChange = () => {};
  const handlers = {
    onCreate: handleCreateBlog,
    onView: handleView,
    onDelete: (clause: Clause) => setClauseToDelete(clause),
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };
  const handleDelete = async (id: number) => {
    try {
      const success = await deletePlan(id);
      if (success) {
        toast({ title: "Success", description: "Plan deleted successfully" });
        //setDataProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error(`❌ No se pudo eliminar el plan ${id}`);
        toast({
          title: "Error",
          description:
            "The plan could not be deleted.",
        });
      }
    } catch (error) {
      console.error("Error eliminando plan:", error);
    }
  };


  /*const PaginadoComponent = () => (
    
    <PaginationControl
      offset={offset}
      itemsPerPage={itemsPerPage}
      totalItems={pageInfo?.totalClauses || 0}
      loading={loading}
      onPrev={() => setOffset((prev) => Math.max(prev - itemsPerPage, 0))}
      onNext={() => {
        if (!pageInfo || offset + itemsPerPage < pageInfo.totalClauses) {
          setOffset((prev) => prev + itemsPerPage);
        }
      }}
    />
  );*/

  if (showEditor) {
    return (
      <div>
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            <PlanEditor
              entityId={editingId ?? undefined}
              onBack={() => {
                setShowEditor(false);
                getAllPlans();
              }}
              onSave={() => {
                {
                  setShowEditor(false);
                  getAllPlans();
                }
              }}
              onDelete={deletePlan}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="flex items-center mb-6 flex-shrink-0">
              <div className="w-1 h-[36px] bg-[#99CC33] mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Plan</h1>
            </div>

            <div className="flex-1 min-h-0">
              {GeneralTable(
                "plan-page",
                "Add Plan",
                "Description",
                "All Plans",
                "Description",
                ["Plan ID", "Name","Description","Type","price",  "Actions"],
                plans,
                handlers,
                {
                  isLoading: loading,
                  //pagination: <PaginadoComponent />,
                  skeletonComponent: ClauseTableRowSkeleton, 
                  skeletonCount: 5,
                }
              )}
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmDialog
        open={!!clauseToDelete}
        onClose={() => setClauseToDelete(null)}
        onConfirm={() => clauseToDelete && handleDelete(clauseToDelete.id)}
        title="Delete Clause"
        description={`Are you sure you want to delete "${clauseToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
