"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Clause } from "@/types/contract-management";

// Schema para el formulario de clauses
const clauseFormSchema = z.object({
  title: z.string().min(3, "Clause title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ClauseFormValues = z.infer<typeof clauseFormSchema>;

interface ContractClausesFormProps {
  clause?: Clause;
  onSuccess?: () => void;
}

export function ContractClausesForm({
  clause,
  onSuccess,
}: ContractClausesFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formMethods = useForm<ClauseFormValues>({
    resolver: zodResolver(clauseFormSchema),
    defaultValues: {
      title: clause?.title || "",
      description: clause?.description || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (values: ClauseFormValues) => {
    try {
      setIsSubmitting(true);

      if (clause) {
        // TODO: Replace with actual service call for update
        // await ClauseManagementService.updateClause(clause.id, values);
        console.log("Updating clause:", values);
      } else {
        // TODO: Replace with actual service call for create
        // await ClauseManagementService.createClause(values);
        console.log("Creating clause:", values);
      }

      toast({
        title: "Success",
        description: clause
          ? "Clause updated successfully!"
          : "Clause created successfully!",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Error saving clause:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to save clause. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px] bg-white">
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`w-full mx-auto ${
            isSubmitting ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                className={`w-full h-10 rounded-md border px-3 py-2 text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.title ? "border-red-500" : "border-input"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="Enter clause title"
                disabled={isSubmitting}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                className={`w-full border rounded-md px-3 py-2 text-sm min-h-[120px] resize-y ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="Enter clause description..."
                rows={5}
                disabled={isSubmitting}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-2/3 bg-[#99CC33] hover:bg-[#8bb82e] text-white py-3 px-6 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {clause ? "Updating..." : "Creating..."}
                </>
              ) : clause ? (
                "Update Clause"
              ) : (
                "Create Clause"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
