import React, { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractFormSchema } from "@/components/organisms/contracs/schemas";
import { Loader2 } from "lucide-react";
import { GenericDropdown } from "@/components/atoms/generic-dropdown";
import { Card, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { Eye } from "lucide-react";
import { ContractClauses } from "./contract-clauses-management/contract-clauses";
import { useToast } from "@/hooks/use-toast";
import { pdf } from "@react-pdf/renderer";
import { ContractPDF } from "@/lib/contracts/ContractPDF";
import { sendContractToDocuSign } from "@/lib/contracts/helpers/docusign-helper";
import { sendContractToDocuSeal } from "@/lib/contracts/helpers/docuseal-helper";

import type {
  Contract,
  CreateContractFormValues,
  ContractStatus,
} from "@/types/contract-management";

type ContractFormMode = "create" | "edit";

interface ContractFormProps {
  contract: Contract,
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
  contract,
}: ContractFormProps) {
  const [showClauses, setShowClauses] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
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

  const MAX_CONTENT_LENGTH = 10000;
  const contentValue = formMethods.watch("content") || "";

  const { toast } = useToast();

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);

      // 1) Obtén los valores actuales del formulario
      const vals = formMethods.getValues();
      const emailForOwner = process.env.NEXT_PUBLIC_OWNER_EMAIL || "sebastian@senaviacorp.com";

      // Validaciones mínimas
      if (!vals.title || !vals.companyEmail || !vals.recipientName) {
        toast({
          title: "Faltan datos",
          description: "Título, email y nombre del cliente son obligatorios.",
          variant: "destructive",
        });
        return;
      }

      // 2) Construye el objeto para el PDF (usa lo que ya tienes en el form)
      const contractForPdf = {
        id: vals.id ?? initialValues.id ?? "N/A",
        title: vals.title,
        signedDate: vals.signedDate ?? null,
        recipientName: vals.recipientName,
        companyEmail: vals.companyEmail,
        companyAdd: vals.companyAdd ?? "",
        companyPhone: vals.companyPhone ?? "",
        content: vals.content ?? "",
        // Si tienes cláusulas en otro estado, pásalas aquí. De momento vacío o toma initialValues
        clauses: (initialValues as any)?.clauses ?? [],
        ownerName: vals.ownerName ?? "",
        ownerSignDate: vals.ownerSignDate ?? null,
        recipientSignDate: vals.recipientSignDate ?? null,
      };

      // 3) Genera el PDF desde tu componente React-PDF
      const pdfDoc = pdf(<ContractPDF contract={contract} />);
      const pdfBlob = await pdfDoc.toBlob();

      // 4) Llama al helper de DocuSign (modo email => DocuSign envía correos)
      const result = await sendContractToDocuSeal({
        pdfBlob,
        recipientEmail: contractForPdf.companyEmail, // cliente
        recipientName: contractForPdf.recipientName,
        contractTitle: contractForPdf.title,
        contractId: contractForPdf.id,
        ownerEmail: emailForOwner,  // o desde form/env
        ownerName: contractForPdf.ownerName || "Senavia Corp",
      })

      if (!result.success) {
        throw new Error(result.error || "No se pudo crear el paquete");
      }

      const { ownerSigningUrl, clientSigningUrl } = result;

      const clientResponse = await fetch(
        "https://damddev.app.n8n.cloud/webhook/70363524-d32d-43e8-99b5-99035a79daa8",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contractForPdf.recipientName || "Cliente",
            email: contractForPdf.companyEmail || "client@example.com",
            paymentsignUrl: clientSigningUrl,
          }),
        }
      );

      const ownerResponse = await fetch(
        "https://damddev.app.n8n.cloud/webhook/70363524-d32d-43e8-99b5-99035a79daa8",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contractForPdf.ownerName || "Cliente",
            email: emailForOwner,
            paymentsignUrl: ownerSigningUrl,
          }),
        }
      );

      if (!clientResponse.ok || !ownerResponse.ok) {
        throw new Error("Error sending email via webhook");
      } else {
        toast({
          title: "Links de firma generados ✅",
          description: `Se enviaron por los enlaces a Owner y Cliente.`,
        });
      }
    } catch (err: any) {
      console.error("[ContractForm] Send email error:", err);
      toast({
        title: "Error al enviar",
        description: err?.message || "No se pudo enviar el contrato",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleShowClauses = () => {
    setShowClauses(true);
  };

  if (showClauses) {
    return (
      <div className="min-h-screen w-full">
        {/* initialValues.id existe en modo "edit" */}
        <ContractClauses
          contractId={Number(initialValues.id)}
          onBackToContract={() => setShowClauses(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-[60px] lg:p-[111px]">
      <FormProvider {...formMethods}>
        {/* Header with email button */}
        <div className="flex items-center justify-end mb-6">
          <button
            className="rounded-full bg-[#99CC33] text-white font-bold text-base py-2 px-4"
            onClick={handleSendEmail}
            disabled={sendingEmail}
          >
            {sendingEmail ? "Sending..." : "Send Contract by Email"}
          </button>
        </div>

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
                maxLength={MAX_CONTENT_LENGTH}
                {...register("content")}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {contentValue.length}/{MAX_CONTENT_LENGTH}
              </div>
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

              <label className="block text-sm font-medium mb-2 mt-4">
                User
              </label>
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
                    className={`w-full ${errors.userId ? "border-red-500" : ""
                      }`}
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
                Lead
              </label>
              <Controller
                name="leadId"
                control={control}
                render={({ field }) => (
                  <GenericDropdown
                    value={field.value || undefined}
                    onChange={(value, selectedOption) => {
                      field.onChange(value);
                      if (selectedOption) {
                        setValue("companyEmail", selectedOption.email || "");
                        setValue("recipientName", selectedOption.name || "");
                        setValue("companyAdd", selectedOption.address || "");
                        setValue("companyPhone", selectedOption.phone || "");
                      }
                    }}
                    placeholder="Select a lead..."
                    className={`w-full ${errors.leadId ? "border-red-500" : ""
                      }`}
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
                Client Address
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

          {mode === "edit" && (
            <Card className="bg-[#04081E] text-white flex-shrink-0 h-24 w-full items-center mt-8 ">
              <CardHeader className="flex flex-row items-center justify-between py-5 px-5 h-full">
                <div>
                  <h2 className="text-2xl font-normal">Clause Details</h2>
                  <p className="font-light text-base">
                    Use this interface to create clauses for this contract
                  </p>
                </div>
                <Button
                  onClick={handleShowClauses}
                  className="[&_svg]:size-9 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0"
                >
                  <Eye color="#04081E" />
                </Button>
              </CardHeader>
            </Card>
          )}
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
    </div>
  );
}

export default ContractForm;
