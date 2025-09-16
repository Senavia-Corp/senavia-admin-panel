import React, { useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractFormSchema } from "@/components/organisms/contracs/schemas";
import { Loader2 } from "lucide-react";
import { ClauseMultiSelect } from "@/components/atoms/clause-multiselect";
import { GenericDropdown } from "@/components/atoms/generic-dropdown";
import type {
  CreateContractFormValues,
  ContractStatus,
} from "@/types/contract-management";

type ContractFormMode = "create" | "edit";

interface ContractFormProps {
  mode: ContractFormMode;
  initialValues: CreateContractFormValues;
  submitLabel?: string;
  onSubmit: (values: CreateContractFormValues) => Promise<void> | void;
  onDirtyChange?: (isDirty: boolean) => void;
  // Dropdown data provided by wrappers
  userOptions: Array<{
    id: number;
    name: string;
    subtitle?: string;
    address?: string;
    phone?: string;
  }>;
  leadOptions: Array<{ id: number; name: string; subtitle?: string }>;
  isUsersLoading?: boolean;
  isLeadsLoading?: boolean;
  usersError?: string | null;
  leadsError?: string | null;
  contractStatuses: ContractStatus[];
  // Optional lazy loaders to mirror ClauseMultiSelect behavior
  userLoadOptions?: () => Promise<
    {
      id: number;
      name: string;
      subtitle?: string;
      address?: string;
      phone?: string;
    }[]
  >;
  leadLoadOptions?: () => Promise<
    {
      id: number;
      name: string;
      subtitle?: string;
    }[]
  >;
}

export function ContractForm({
  mode,
  initialValues,
  submitLabel,
  onSubmit,
  onDirtyChange,
  userOptions,
  leadOptions,
  isUsersLoading,
  isLeadsLoading,
  usersError,
  leadsError,
  contractStatuses,
  userLoadOptions,
  leadLoadOptions,
}: ContractFormProps) {
  const formMethods = useForm<CreateContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: initialValues,
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

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full mx-auto p-8 bg-white rounded-lg shadow-none ${
          isSubmitting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* General Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              General Information
            </h3>

            <label className="block text-sm font-medium mb-2 mt-4">
              Title *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.title ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Contract Title"
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Content *
            </label>
            <textarea
              className={`w-full border rounded-md px-3 py-2 text-sm min-h-[100px] resize-y ${
                errors.content ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter contract content..."
              rows={4}
              disabled={isSubmitting}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">
                {errors.content.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              State *
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  className={`w-full h-10 border rounded-md px-3 py-2 text-sm ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={isSubmitting}
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(e.target.value as ContractStatus)
                  }
                >
                  <option value="">Select contract status...</option>
                  {contractStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">
                {errors.status.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Clauses *
            </label>
            <div
              className={`${
                errors.clauses ? "border border-red-500 rounded-md" : ""
              }`}
            >
              <Controller
                name="clauses"
                control={control}
                render={({ field }) => (
                  <ClauseMultiSelect
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select clauses..."
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
            {errors.clauses && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clauses.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Deadline to Sign *
            </label>
            <input
              type="date"
              className={`w-full h-10 border rounded-md px-3 py-2 text-sm ${
                errors.deadlineToSign ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              disabled={isSubmitting}
              {...register("deadlineToSign")}
            />
            {errors.deadlineToSign && (
              <p className="text-red-500 text-xs mt-1">
                {errors.deadlineToSign.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">User</label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <GenericDropdown
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    const selectedUser = userOptions.find(
                      (u) => u.id === value
                    );
                    if (selectedUser) {
                      setValue("clientEmail", selectedUser.subtitle || "");
                      setValue("clientName", selectedUser.name || "");
                      setValue("clientAddress", selectedUser.address || "");
                      setValue("clientPhone", selectedUser.phone || "");
                    }
                  }}
                  placeholder="Select a user..."
                  className={`w-full ${errors.userId ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                  options={userOptions}
                  isLoading={isUsersLoading}
                  error={usersError}
                  loadOptions={userLoadOptions}
                  searchFields={["name", "subtitle"]}
                  displayField="name"
                  subtitleField="subtitle"
                />
              )}
            />
            {errors.userId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.userId.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Lead *
            </label>
            <Controller
              name="leadId"
              control={control}
              render={({ field }) => (
                <GenericDropdown
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a lead..."
                  className={`w-full ${errors.leadId ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                  options={leadOptions}
                  isLoading={isLeadsLoading}
                  error={leadsError}
                  loadOptions={leadLoadOptions}
                  searchFields={["name", "subtitle"]}
                  displayField="name"
                  subtitleField="subtitle"
                />
              )}
            />
            {errors.leadId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.leadId.message as string}
              </p>
            )}
          </div>

          {/* Sign Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sign Information
            </h3>

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Email *
            </label>
            <input
              type="email"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.clientEmail ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter client email"
              disabled={isSubmitting}
              {...register("clientEmail")}
            />
            {errors.clientEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientEmail.message as string}
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
              placeholder="Enter client address"
              disabled={isSubmitting}
              {...register("clientAddress")}
            />
            {errors.clientAddress && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientAddress.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Phone *
            </label>
            <input
              type="tel"
              inputMode="tel"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.clientPhone ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter client phone"
              disabled={isSubmitting}
              {...register("clientPhone")}
            />
            {errors.clientPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientPhone.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Owner Name *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.ownerName ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Owner Name"
              disabled={isSubmitting}
              {...register("ownerName")}
            />
            {errors.ownerName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ownerName.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Owner Sign Date
            </label>
            <input
              type="date"
              className={`w-full h-10 border rounded-md px-3 py-2 text-sm border-gray-300 ${
                isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
              {...register("ownerSignDate")}
            />

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Name *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.clientName ? "border-red-500" : "border-input"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter client name"
              disabled={isSubmitting}
              {...register("clientName")}
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientName.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Sign Date
            </label>
            <input
              type="date"
              className={`w-full h-10 border rounded-md px-3 py-2 text-sm border-gray-300 ${
                isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
              {...register("clientSignDate")}
            />
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
              submitLabel ??
              (mode === "edit" ? "Save Changes" : "Create Contract")
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default ContractForm;
