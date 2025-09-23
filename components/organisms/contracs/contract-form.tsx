import React, { useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractFormSchema } from "@/components/organisms/contracs/schemas";
import { Loader2 } from "lucide-react";
import { ClauseMultiSelect } from "@/components/atoms/clause-multiselect";
import { GenericDropdown } from "@/components/atoms/generic-dropdown";
import { endpoints, useFetch } from "@/lib/services/endpoints";
import type {
  CreateContractFormValues,
  ContractStatus,
} from "@/types/contract-management";

type ContractFormMode = "create" | "edit";
const { fetchData } = useFetch();

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

  const handleSendEmail = () => {
    fetch('https://damddev.app.n8n.cloud/webhook-test/29008715-57c9-40c4-abac-6bad9a0d6f9e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: initialValues.companyEmail, signUrl: 'https://example.com/sign' })
    })
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full mx-auto p-8 bg-white rounded-lg shadow-none ${isSubmitting ? "opacity-50 pointer-events-none" : ""
          }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* General Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              General Information
            </h3>

            {mode === "edit" && (
              <label className="block text-sm font-medium mb-2 mt-4">
                Contract ID : {initialValues.id}
              </label>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Title *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${errors.title ? "border-red-500" : "border-input"
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
              className={`w-full border rounded-md px-3 py-2 text-sm min-h-[100px] resize-y ${errors.content ? "border-red-500" : "border-gray-300"
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
              name="state"
              control={control}
              render={({ field }) => (
                <select
                  className={`w-full h-10 border rounded-md px-3 py-2 text-sm ${errors.state ? "border-red-500" : "border-gray-300"
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
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">
                {errors.state.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Clauses *
            </label>
            <div
              className={`${errors.clauses ? "border border-red-500 rounded-md" : ""
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
              className={`w-full h-10 border rounded-md px-3 py-2 text-sm ${errors.signedDate ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              disabled={isSubmitting}
              {...register("signedDate")}
            />
            {errors.signedDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.signedDate.message as string}
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
                      setValue("companyEmail", selectedOption.subtitle || "");
                      setValue("recipientName", selectedOption.name || "");
                      setValue("companyAdd", selectedOption.address || "");
                      setValue("companyPhone", selectedOption.phone || "");
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
                  hasError={Boolean(errors.leadId)}
                  searchFields={["name", "subtitle"]}
                  displayField="name"
                  subtitleField="subtitle"
                  errorLabel="leads"
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
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${errors.companyEmail ? "border-red-500" : "border-input"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter client email"
              disabled={isSubmitting}
              {...register("companyEmail")}
            />
            {errors.companyEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyEmail.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Address *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${errors.companyAdd ? "border-red-500" : "border-input"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter client address"
              disabled={isSubmitting}
              {...register("companyAdd")}
            />
            {errors.companyAdd && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyAdd.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Phone *
            </label>
            <input
              type="tel"
              inputMode="tel"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${errors.companyPhone ? "border-red-500" : "border-input"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter client phone"
              disabled={isSubmitting}
              {...register("companyPhone")}
            />
            {errors.companyPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyPhone.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Owner Name *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${errors.ownerName ? "border-red-500" : "border-input"
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
              className={`w-full h-10 border rounded-md px-3 py-2 text-sm border-gray-300 ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              disabled={isSubmitting}
              {...register("ownerSignDate")}
            />

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Name *
            </label>
            <input
              type="text"
              className={`w-full h-10 rounded-md border px-3 py-2 text-sm md:text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${errors.recipientName ? "border-red-500" : "border-input"
                } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Enter client name"
              disabled={isSubmitting}
              {...register("recipientName")}
            />
            {errors.recipientName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.recipientName.message as string}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              Client Sign Date
            </label>
            <input
              type="date"
              className={`w-full h-10 border rounded-md px-3 py-2 text-sm border-gray-300 ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              disabled={isSubmitting}
              {...register("recipientSignDate")}
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
      <div className="flex justify-center mt-8">
        <button className="w-full md:w-2/3 bg-[#99CC33] hover:bg-[#8bb82e] text-white py-3 px-6 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
          onClick={() => {
            handleSendEmail()
          }}>
          Send Contract by Email
        </button>
      </div>
    </FormProvider>

  );
}

export default ContractForm;
