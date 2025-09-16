import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { ContractManagementService } from "@/services/contract-management-service";
import { ClauseMultiSelect } from "@/components/atoms/clause-multiselect";
import { GenericDropdown } from "@/components/atoms/generic-dropdown";
import {
  useUserDropdownData,
  useLeadDropdownData,
} from "@/hooks/use-dropdown-data";

import type {
  CreateContractData,
  Contract,
  ContractStatus,
  CreateContractFormValues,
} from "@/types/contract-management";
import { useToast } from "@/hooks/use-toast";

const contractFormSchema = z.object({
  title: z.string().min(3, "Contract title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(
    ["DRAFT", "SENT", "SIGNED", "ACTIVE", "EXPIRED", "TERMINATED"] as const,
    {
      required_error: "Please select a status for the contract.",
    }
  ),
  clauses: z.array(z.number()).min(1, "Please select at least one clause."),
  deadlineToSign: z.string().min(1, "Deadline to sign is required"),
  userId: z.number({ required_error: "Please select a user." }),
  leadId: z.number({ required_error: "Please select a lead." }),
  // Sign Information
  clientEmail: z.string().email("Invalid email address"),
  clientAddress: z.string().min(5, "Address must be at least 5 characters"),
  clientPhone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/i, "Invalid phone number format"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerSignDate: z.string().optional(),
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientSignDate: z.string().optional(),
});

interface CreateContractFormProps {
  onContractCreated?: (contract: Contract) => void;
  onSuccess?: () => void;
}

export function CreateContractForm({
  onContractCreated,
  onSuccess,
}: CreateContractFormProps = {}) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      title: "",
      content: "",
      status: undefined as unknown as ContractStatus,
      clauses: [],
      deadlineToSign: "",
      userId: undefined as unknown as number,
      leadId: undefined as unknown as number,
      clientEmail: "",
      clientAddress: "",
      clientPhone: "",
      ownerName: "",
      ownerSignDate: "",
      clientName: "",
      clientSignDate: "",
    },
  });

  // Controlled fields handled via Controller; no local state needed
  const contractStatuses = ContractManagementService.getContractStatuses();
  // Use custom hooks for dropdown data
  const userDropdownData = useUserDropdownData();
  const leadDropdownData = useLeadDropdownData();

  const onSubmit = async (data: CreateContractFormValues) => {
    try {
      const createContractData: CreateContractData = {
        title: data.title,
        content: data.content,
        status: data.status,
        clauses: data.clauses,
        deadlineToSign: data.deadlineToSign,
        userId: data.userId,
        leadId: data.leadId,
        clientEmail: data.clientEmail,
        clientAddress: data.clientAddress,
        clientPhone: data.clientPhone,
        ownerName: data.ownerName,
        ownerSignDate: data.ownerSignDate,
        clientName: data.clientName,
        clientSignDate: data.clientSignDate,
      };

      const backendResponse = await ContractManagementService.createContract(
        createContractData
      );
      console.log("New contract created:", backendResponse);

      // Call the callback to update parent component
      if (onContractCreated) {
        onContractCreated(backendResponse);
      }

      // Reset form after successful creation
      reset();

      toast({
        title: "Success",
        description: "Contract created successfully!",
      });

      // Call success callback to navigate back
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating contract:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create contract. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px] bg-white `}
    >
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
                {errors.title.message}
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
                {errors.content.message}
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
                {errors.status.message}
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
                {errors.clauses.message}
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
                {errors.deadlineToSign.message}
              </p>
            )}

            <label className="block text-sm font-medium mb-2 mt-4">
              User *
            </label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <GenericDropdown
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    const selectedUser = userDropdownData.options.find(
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
                  options={userDropdownData.options}
                  isLoading={userDropdownData.isLoading}
                  error={userDropdownData.error}
                  searchFields={["name", "subtitle"]}
                  displayField="name"
                  subtitleField="subtitle"
                />
              )}
            />
            {errors.userId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.userId.message}
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
                  options={leadDropdownData.options}
                  isLoading={leadDropdownData.isLoading}
                  error={leadDropdownData.error}
                  searchFields={["name", "subtitle"]}
                  displayField="name"
                  subtitleField="subtitle"
                />
              )}
            />
            {errors.leadId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.leadId.message}
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
                {errors.clientEmail.message}
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
                {errors.clientAddress.message}
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
              onKeyDown={(e) => {
                if (
                  !/[0-9+\-() ]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              {...register("clientPhone")}
            />
            {errors.clientPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientPhone.message}
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
                {errors.ownerName.message}
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
                {errors.clientName.message}
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
            disabled={isSubmitting}
            className="w-full md:w-2/3 bg-[#99CC33] hover:bg-[#8bb82e] text-white py-3 px-6 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Creating contract...
              </>
            ) : (
              "Create Contract"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
