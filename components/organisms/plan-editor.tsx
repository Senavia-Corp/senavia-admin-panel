"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { PlanViewModel } from "../pages/plan/PlanViewModel";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { GenericDropdown } from "@/components/atoms/generic-dropdown";
import { LeadManagementService } from "@/services/lead-management-service";

interface EditorProps {
  entityId?: number;
  onBack: () => void;
  onSave: () => void;
  onDelete: (id: number) => Promise<boolean>;
}

type PlanFormData = {
  name: string;
  description: string;
  type: string;
  price: number;
  serviceId: number;
};

export function PlanEditor({
  entityId,
  onBack,
  onSave,
  onDelete,
}: EditorProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      description: "",
      type: "",
      price: 0,
      serviceId: 0,
    },
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el dropdown de servicios
  const [serviceOptions, setServiceOptions] = useState<
    Array<{
      id: number;
      name: string;
      subtitle?: string;
    }>
  >([]);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const { getPlanById, savePlan } = PlanViewModel();
  const { toast } = useToast();
  const descriptionValue = watch("description", "");

  // Función para cargar servicios
  const loadServiceOptions = async () => {
    try {
      setIsServicesLoading(true);
      setServicesError(null);
      const fetched = await LeadManagementService.getServices();
      const mappedServices = fetched.map((s: any) => ({
        id: s.id,
        name: s.name,
        subtitle: s.description,
      }));
      setServiceOptions(mappedServices);
      return mappedServices;
    } catch (error) {
      console.error("Error loading services:", error);
      setServicesError("Error loading services");
      toast({
        title: "Error",
        description: "Couldn't load services. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsServicesLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      handleView(entityId);
    }
  }, [entityId]);

  const handleView = async (id: number) => {
    const res = await getPlanById(id);
    if (res) {
      setValue("name", res.name);
      setValue("description", res.description);
      setValue("price", res.price);
      setValue("serviceId", res.serviceId);
      setValue("type", res.type);
    }
  };

  const onSubmit = async (data: PlanFormData) => {
    try {
      setIsLoading(true);
      const success = await savePlan(data, entityId ?? undefined);
      if (success) {
        toast({
          title: "Success",
          description: entityId
            ? "Plan updated successfully!"
            : "Plan created successfully!",
        });

        console.log("✅ Plan guardada correctamente");
        onSave?.();
      } else {
        console.error("❌ Error guardando plan");
      }
    } catch (err: any) {
      console.error("💥 Error inesperado en handleSave:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (entityId) {
        const success = await onDelete(entityId);
        if (success) {
          console.log(`✅ Plan ${entityId} eliminado correctamente`);
          toast({
            title: "Success",
            description: "Plan deleted successfully",
          });
          onBack?.();
        } else {
          console.error(`❌ No se pudo eliminar el Plan ${entityId}`);
        }
      }
    } catch (error) {
      console.error("Error eliminando Plan:", error);
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 rounded-lg p-6 flex-1 flex w-full"
      >
        {/* Left Column - Content Editor */}
        <div className="flex-1 bg-white rounded-lg p-8 mr-6 max-w-none">
          {/* Title */}
          <CardTitle className="block text-base font-medium mb-2 mt-4">Name *</CardTitle>
          <div className="mb-6">
            <Input
              {...register("name", { required: "Title is required" })}
              placeholder="Enter the Plan title"
              disabled={isLoading}
              className={` ${
                errors.name
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500"
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* Description */}
          <CardHeader className="p-0">
            <CardTitle className="block text-base font-medium mb-2 mt-4">Description *</CardTitle>
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
            {/* Fin Description */}
            <label className="block text-base font-medium mb-2 mt-4">
              Type *
            </label>

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select type...</option>
                  {["MONTHLY", "SINGLEPAYMENT"].map((type) => (
                    <option key={type} value={type}>
                     {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              )}
            />
            {/* Price */}
            <CardTitle className="block text-base font-medium mb-2 mt-4">Price *</CardTitle>
            <div className="mb-6">
              <Input
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
                placeholder="Enter the price"
                disabled={isLoading}
                className={` ${
                  errors.price
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "focus-visible:ring-blue-500"
                } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </CardContent>
          {/* Service */}
          <CardTitle className="block text-base font-medium mb-2 mt-4">Service *</CardTitle>
          {/*Service*/}
          <Controller
            name="serviceId"
            control={control}
            render={({ field }) => (
              <GenericDropdown
                value={(field.value ?? undefined) as number | undefined}
                onChange={(value) => {
                  field.onChange(value);
                }}
                placeholder="Select a service..."
                className={`w-full ${errors.serviceId ? "border-red-500" : ""}`}
                disabled={isLoading}
                options={serviceOptions}
                isLoading={isServicesLoading}
                error={servicesError}
                loadOptions={loadServiceOptions}
                hasError={Boolean(errors.serviceId)}
                searchFields={["name", "subtitle"]}
                displayField="name"
                subtitleField="subtitle"
                errorLabel="services"
              />
            )}
          />
          {errors.serviceId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.serviceId.message as string}
            </p>
          )}
          {/* Fin Service*/}
          <div className="flex justify-center my-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4"
            >
              {entityId
                ? isLoading
                  ? "Updating..."
                  : "Update Plan"
                : isLoading
                ? "Saving..."
                : "Publish Plan"}
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
                Delete Plan
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
        title="Delete Plan"
        description={`Are you sure you want to delete this Plan? This action cannot be undone.`}
      />
    </div>
  );
}
