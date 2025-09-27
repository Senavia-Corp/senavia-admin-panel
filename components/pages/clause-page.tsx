"use client";

import { useState, useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Clause } from "./clause/clause";
import { ClauseEditor } from "../organisms/clause-editor";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import ClauseViewModel from "./clause/ClauseViewModel";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "../molecules/Pagination-control";
import { Pagination } from "../ui/pagination";
import { ContractTableRowSkeleton } from "../atoms/contract-table-row-skeleton";
import { ClauseTableRowSkeleton } from "../atoms/clause-table-row-skeleton";

export function ClausePage() {
  const [clauseToDelete, setClauseToDelete] = useState<Clause | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingClauseId, setEditingClauseId] = useState<number | null>(null);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const {
    clauses,
    loading,
    pageInfo,
    getAllClauses,
    getClauseById,
    deleteClause,
  } = ClauseViewModel({ isPaginated: true, offset, itemsPerPage, searchTerm });
  const clauseVM = ClauseViewModel();
  const [entityToDelete, setEntityToDelete] = useState<Clause | null>(null);
  const [dataClauses, setDataClauses] = useState<Clause[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    setOffset(0);
  }, [searchTerm]);

  const handleView = (clause: Clause) => {
    setEditingClauseId(clause.id);

    setShowEditor(true);
  };

  const handleCreateBlog = () => {
    setEditingClauseId(null);
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
      const success = await deleteClause(id);
      if (success) {
        toast({ title: "Success", description: "Clause deleted successfully" });
        //setDataProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error(`❌ No se pudo eliminar el producto ${id}`);
      }
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };
  const PaginadoComponent = () => (
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
  );

  if (showEditor) {
    return (
      <div>
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            <ClauseEditor
              entityId={editingClauseId ?? undefined}
              onBack={() => {
                setShowEditor(false);
                getAllClauses();
              }}
              onSave={() => {
                {
                  setShowEditor(false);
                  getAllClauses();
                }
              }}
              onDelete={deleteClause}
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex-shrink-0">
              Clause{" "}
            </h1>

            <div className="flex-1 min-h-0">
              {GeneralTable(
                "clause-page",
                "Add clause",
                "Description",
                "All Clauses",
                "Description",
                ["Clause ID", "Title", "Description", "Actions"],
                clauses,
                handlers,
                {
                  isLoading: loading,
                  pagination: <PaginadoComponent />,
                  skeletonComponent: ClauseTableRowSkeleton, // 👈 tu componente de fila de skeleton
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
