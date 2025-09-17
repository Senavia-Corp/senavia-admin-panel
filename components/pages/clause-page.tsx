"use client";

import { useState, useEffect } from "react";
import { CreateBlogDialog } from "@/components/organisms/create-blog-dialog";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { BlogManagementService } from "@/services/blog-management-service";
import type { Clause } from "./clause/clause";
//import { BlogEditor } from "@/components/organisms/blog-editor"
import { ClauseEditor } from "../organisms/clause-editor";

import { GeneralTable } from "@/components/organisms/tables/general-table";

import ClauseViewModel from "./clause/ClauseViewModel";

export function ClausePage() {
  const [clauseToDelete, setClauseToDelete] = useState<Clause | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingClauseId, setEditingClauseId] = useState<number | null>(null);
  const [simpleBlogsPerPage, setSimpleBlogsPerPage] = useState(10);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const { clauses, loading, pageInfo, getAllClauses, getClauseById,deleteClause } =
    ClauseViewModel({ isPaginated: true, offset, itemsPerPage });
  const [entityToDelete, setEntityToDelete] = useState<Clause | null>(null);
const [dataClauses, setDataClauses] = useState<Clause[]>([]);  

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
  const handleDelete=async(id:number)=>{
    console.log("deberia funcionar: " +id)
    try {
      const success = await deleteClause(id);
      if (success) {
        console.log(`✅ Clause ${id} eliminado correctamente`);
        //setDataProducts((prev) => prev.filter((p) => p.id !== id));

      } else {
        console.error(`❌ No se pudo eliminar el producto ${id}`);
      }
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  }


  if (showEditor) {
    return (
      <div>
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            <ClauseEditor
              entityId={editingClauseId ?? undefined}
              onBack={() => setShowEditor(false)}
              onSave={() => {
                setShowEditor(false);
                //loadBlogs()
              }}
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
                handlers
              )}
            </div>
          </div>
        </div>
      </main>
      {/*
      <CreateBlogDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={loadBlog}
        themes={themes}
      />*/}
      
      <DeleteConfirmDialog
        open={!!clauseToDelete}
        onClose={() => setClauseToDelete(null)}
        onConfirm={() => clauseToDelete && handleDelete(clauseToDelete.id)}
        title="Delete Clause"
        description={`Are you sure you want to delete "${clauseToDelete?.title}"? This action cannot be undone.`}
      />
      {/* Controles de paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() =>
            setOffset((prev) => Math.max(prev - simpleBlogsPerPage, 0))
          }
          disabled={offset === 0 || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ⬅️ Anterior
        </button>

        <span>Página {Math.floor(offset / simpleBlogsPerPage) + 1}</span>

        <button
          onClick={() => {
            if (
              !pageInfo ||
              offset + simpleBlogsPerPage < pageInfo.totalBlogs
            ) {
              const lastBlogId = clauses[clauses.length - 1].id;
              setOffset(lastBlogId);
            }
          }}
          disabled={
            loading ||
            (pageInfo && offset + simpleBlogsPerPage >= pageInfo.totalBlogs)
          }
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
}
