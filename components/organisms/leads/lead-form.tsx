"use client";

import { useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { GenericDropdown } from "@/components/atoms/generic-dropdown";
import { LeadManagementService } from "@/services/lead-management-service";
import type { LeadStatus } from "@/types/lead-management";
import { leadFormSchema, type LeadFormValues } from "./schemas";
import { ScheduleCalendar } from "@/components/organisms/leads/schedule-calendar/schedule-calendar";

type LeadFormMode = "create" | "edit";

interface LeadFormProps {
  mode?: LeadFormMode;
  initialValues?: Partial<LeadFormValues>;
  submitLabel?: string;
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
  onDirtyChange?: (isDirty: boolean) => void;
  leadId?: number;
  // Dropdown data provided by wrappers
  userOptions: Array<{
    id: number;
    name: string;
    subtitle?: string;
    address?: string;
    phone?: string;
  }>;
  isUsersLoading?: boolean;
  usersError?: string | null;
  serviceOptions: Array<{
    id: number;
    name: string;
    subtitle?: string;
  }>;
  isServicesLoading?: boolean;
  servicesError?: string | null;
  // Optional lazy loaders
  userLoadOptions?: () => Promise<
    {
      id: number;
      name: string;
      subtitle?: string;
      address?: string;
      phone?: string;
    }[]
  >;
  serviceLoadOptions?: () => Promise<
    {
      id: number;
      name: string;
      subtitle?: string;
    }[]
  >;
}

export function LeadForm({
  mode = "create",
  initialValues,
  submitLabel,
  onSubmit,
  onDirtyChange,
  userOptions,
  isUsersLoading,
  usersError,
  serviceOptions,
  isServicesLoading,
  servicesError,
  userLoadOptions,
  serviceLoadOptions,
}: LeadFormProps) {
  const formMethods = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      id: initialValues?.id,
      clientName: initialValues?.clientName ?? "",
      clientEmail: initialValues?.clientEmail ?? "",
      clientPhone: initialValues?.clientPhone ?? "",
      clientAddress: initialValues?.clientAddress ?? "",
      description: initialValues?.description ?? "",
      startDate:
        initialValues?.startDate ?? new Date().toISOString().split("T")[0],
      endDate: initialValues?.endDate ?? "",
      serviceId: initialValues?.serviceId,
      userId: initialValues?.userId,
      state: (initialValues?.state as LeadStatus) ?? "SEND",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = formMethods;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmitInternal = async (values: LeadFormValues) => {
    await onSubmit(values);
  };

  const leadStatuses = LeadManagementService.getLeadStatuses();

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmitInternal)}
        className={`w-full mx-auto p-8 bg-white rounded-lg shadow-none ${
          isSubmitting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column - IDs and Client Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Lead Information
            </h3>

            {mode === "edit" && (
              <label className="block text-sm font-medium mb-2 mt-4">
                Lead ID : {initialValues?.id}
              </label>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Service *
            </label>
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
                  className={`w-full ${
                    errors.serviceId ? "border-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                  options={serviceOptions}
                  isLoading={isServicesLoading}
                  error={servicesError}
                  loadOptions={serviceLoadOptions}
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

            <label className="block text-sm font-medium mb-2 mt-4">User</label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <GenericDropdown
                  value={(field.value ?? undefined) as number | undefined}
                  onChange={(value, selectedOption) => {
                    field.onChange(value);
                    if (selectedOption) {
                      setValue("clientEmail", selectedOption.subtitle || "");
                      setValue("clientName", selectedOption.name || "");
                      setValue("clientAddress", selectedOption.address || "");
                      setValue("clientPhone", selectedOption.phone || "");
                    }
                  }}
                  placeholder="Select a user..."
                  className={`w-full ${errors.userId ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                  options={userOptions}
                  isLoading={isUsersLoading}
                  error={usersError}
                  loadOptions={userLoadOptions}
                  hasError={Boolean(errors.userId)}
                  searchFields={["name", "subtitle"]}
                  displayField="name"
                  subtitleField="subtitle"
                  errorLabel="users"
                />
              )}
            />
            {errors.userId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.userId.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Name *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.clientName ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Client Name"
              disabled={isSubmitting}
              {...register("clientName")}
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientName.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client E-mail *
            </label>
            <input
              type="email"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.clientEmail ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="e-mail@client.com"
              disabled={isSubmitting}
              {...register("clientEmail")}
            />
            {errors.clientEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientEmail.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Phone *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.clientPhone ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="000-000-0000"
              disabled={isSubmitting}
              {...register("clientPhone")}
            />
            {errors.clientPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientPhone.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Address *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.clientAddress ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Client Address"
              disabled={isSubmitting}
              {...register("clientAddress")}
            />
            {errors.clientAddress && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientAddress.message as string}
              </p>
            )}
          </div>

          {/* Right Column - Status, Time, Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Status & Timing
            </h3>

            <label className="block text-sm font-medium mb-2 mt-4">
              Status *
            </label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <select
                  className={`w-full h-10 border rounded-md px-3 py-2 text-sm ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={isSubmitting}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value as LeadStatus)}
                >
                  <option value="">Select status...</option>
                  {leadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">
                {errors.state.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Estimated Time *
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="date"
                className={`w-full h-10 border rounded-md px-3 py-2 text-sm ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
                {...register("startDate")}
              />
              <span className="px-2">-</span>
              <input
                type="date"
                className={`w-full h-10 border rounded-md px-3 py-2 text-sm border-gray-300 ${
                  isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
                {...register("endDate")}
              />
            </div>
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.startDate.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Description *
            </label>
            <textarea
              className={`w-full border rounded-md px-3 py-2 text-sm min-h-[100px] resize-y ${
                errors.description ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter lead description..."
              rows={4}
              disabled={isSubmitting}
              {...register("description")}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {(formMethods.watch("description") || "").length}/1000
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message as string}
              </p>
            )}

            {/* Schedule Calendar - Only show in edit mode */}
            {mode === "edit" && (
              <>
                <label className="block text-sm font-medium mb-2 mt-4">
                  Schedule Lead
                </label>
                <div className="p-4 ">
                  <ScheduleCalendar onScheduleComplete={() => null} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={isSubmitting || (mode === "edit" && !isDirty)}
            className="w-full md:w-2/3 bg-[#99CC33] hover:bg-[#8bb82e] text-white py-3 px-6 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {mode === "edit" ? "Saving..." : "Creating..."}
              </>
            ) : (
              submitLabel ?? (mode === "edit" ? "Save Changes" : "Create Lead")
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default LeadForm;
