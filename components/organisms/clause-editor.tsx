"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import ClauseViewModel from "../pages/clause/ClauseViewModel";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface EditorProps {
  entityId?: number;
  onBack: () => void;
  onSave: () => void;
  onDelete: (id: number) => Promise<boolean>;
}

type ClauseFormData = {
  title: string;
  description: string;
};

export function ClauseEditor({ entityId, onBack, onSave,onDelete }: EditorProps) {
  const {
    register,
    handleSubmit,
    setValue, 
    watch,
    formState: { errors },
  } = useForm<ClauseFormData>({
    defaultValues: { title: "", description: "" }, 
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getClauseById, saveClause } = ClauseViewModel();
  const { toast } = useToast();
  const descriptionValue = watch("description", "");

  useEffect(() => {
    if (entityId) {
      handleView(entityId);
    }
  }, [entityId]);

  const handleView = async (id: number) => {
    const res = await getClauseById(id);
    if (res) {
      // ⬅️ en vez de setJsonData, ahora uso setValue de RHF
      setValue("title", res.title);
      setValue("description", res.description);
    }
  };

  // ⬅️ ahora uso `onSubmit` en vez de handleSave + jsonData
  const onSubmit = async (data: ClauseFormData) => {
    try {
      setIsLoading(true);
      const success = await saveClause(data, entityId ?? undefined);
      if (success) {
        toast({
          title: "Success",
          description: entityId
            ? "Clause updated successfully!"
            : "Clause created successfully!",
        });

        console.log("✅ Cláusula guardada correctamente");
        onSave?.();
      } else {
        console.error("❌ Error guardando cláusula");
      }
    } catch (err: any) {
      console.error("💥 Error inesperado en handleSave:", err);
      toast({
        title: "Error",
        description:
          err.message || "Failed to create clause. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log("deberia funcionar");
    try {
      if (entityId) {
        const success = await onDelete(entityId);
        if (success) {
          console.log(`✅ Clause ${entityId} eliminado correctamente`);
          toast({
            title: "Success",
            description: "Clause deleted successfully",
          });
          onBack?.();
        } else {
          console.error(`❌ No se pudo eliminar el Clause ${entityId}`);
        }
      }
    } catch (error) {
      console.error("Error eliminando Clause:", error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {entityId ? "Plan Editor" : "Plan Create"}
        </h1>
      </div>

      {/* Main Content */}
      {/* ⬅️ ahora todo está dentro de un <form> que usa handleSubmit */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 rounded-lg p-6 flex-1 flex w-full"
      >
        {/* Left Column - Content Editor */}
        <div className="flex-1 bg-white rounded-lg p-8 mr-6 max-w-none">
          {/* Title */}
          <CardTitle className="text-lg">Title *</CardTitle>
          <div className="mb-6">
            {/* ⬅️ antes usabas value/jsonData, ahora usamos register */}
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter the clause title"
              disabled={isLoading}
              className={` ${
                errors.title
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500"
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}

          <CardHeader className="p-0">
            <CardTitle className="text-lg">Description *</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 10000,
                  message: "Max 10000 characters",
                },
              })}
              placeholder="Lorem ipsum dolor sit amet..."
              rows={7}
              maxLength={10000}
              className={`${
                errors.description
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500"
              }`}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
                        {descriptionValue.length}/10000
                      </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </CardContent>
          <div className="flex justify-center my-4">
            
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4"
            >
              {entityId
                ? isLoading
                  ? "Updating..."
                  : "Update Clause"
                : isLoading
                ? "Saving..."
                : "Publish Clause"}
            </Button>
          </div>

          {entityId && (
            <div className="flex justify-end my-4">
              <Button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="rounded-full bg-[#C61417] text-white font-bold text-base items-center py-2 px-4"
              >
                Delete Clause
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Metadata */}
      </form>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Clause"
        description={`Are you sure you want to delete this clause? This action cannot be undone.`}
      />
    </div>
  );
}
