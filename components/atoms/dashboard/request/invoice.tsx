"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserPanelService } from "@/services/user-panel/user-panel-service";

// Define the structure for each item in the invoice
interface InvoiceItem {
  name: string;
  value: number;
}

// Define the structure for an invoice group
interface InvoiceGroup {
  id?: string | number;
  title: string;
  items: InvoiceItem[];
  invoiceNumber?: string;
  dueDate?: string | Date;
}

// Define the props for the Invoice component
interface InvoiceProps {
  invoices: InvoiceGroup[];
  currencySymbol?: string;
  onGoToPayment?: (invoiceIndex: number) => void; // Optional external handler
  status?: string;
  // Estado controlado opcional
  openStates?: boolean[];
  setOpenStates?: (v: boolean[]) => void;
  loading?: boolean;
}

// Helper function to format currency
const formatCurrency = (value: number, symbol: string = "$") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace("USD", symbol);
};

function SkeletonInvoice() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 1 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-700 shadow-[0_2px_8px_0_rgba(0,0,0,0.10)] bg-[#0b0e1c] animate-pulse"
        >
          <div className="w-full h-full bg-[#0b0e1c] rounded-lg p-3 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-1/3 bg-gray-700/60 rounded" />
              <div className="h-4 w-20 bg-gray-700/40 rounded" />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="h-5 w-1/4 bg-gray-700/60 rounded" />
              <div className="h-4 w-16 bg-gray-700/40 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Invoice({
  invoices,
  currencySymbol = "$",
  onGoToPayment,
  status,
  openStates: controlledOpenStates,
  setOpenStates: setControlledOpenStates,
  loading = false,
}: InvoiceProps) {
  if (loading) return <SkeletonInvoice />;

  // Si no se pasan props, usa estado interno
  const [internalOpenStates, internalSetOpenStates] = useState<boolean[]>(
    new Array(invoices.length).fill(false)
  );
  useEffect(() => {
    if (!controlledOpenStates)
      internalSetOpenStates(new Array(invoices.length).fill(false));
  }, [invoices]);
  const openStates = controlledOpenStates ?? internalOpenStates;
  const setOpenStates = setControlledOpenStates ?? internalSetOpenStates;

  // --- Render Logic ---
  return (
    <div className="space-y-4">
      {invoices.map((invoice, index) => {
        // Calculate the total value for this invoice
        const totalValue = invoice.items.reduce(
          (sum, item) => sum + item.value,
          0
        );

        const isOpen = openStates[index];

        // Handlers for this specific invoice
        const handleToggle = () => {
          const newOpenStates = [...openStates];
          newOpenStates[index] = !newOpenStates[index];
          setOpenStates(newOpenStates);
        };

        return (
          <div
            key={index}
            className={cn(
              "rounded-lg transition-all duration-300 ease-in-out overflow-hidden relative",
              isOpen
                ? "p-[3px] bg-gradient-to-r from-[#99CC33] to-[#33CCCC]"
                : "border border-gray-200 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)]"
            )}
          >
            <div
              className={cn(
                "w-full h-full bg-[#0b0e1c] rounded-lg",
                isOpen ? "p-4" : ""
              )}
            >
              {/* Header (Always Visible, Clickable) */}
              <div
                className={cn(
                  "flex justify-between items-center",
                  isOpen ? "mb-4" : "p-3",
                  "cursor-pointer"
                )}
                onClick={handleToggle}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-gray-100">
                    {invoice.title}
                  </span>
                  {invoice.invoiceNumber && (
                    <span className="text-sm text-gray-400">
                      Invoice #{invoice.invoiceNumber}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-lg text-gray-100">
                    {formatCurrency(totalValue, currencySymbol)}
                  </span>
                  {invoice.dueDate && (
                    <span className="text-sm text-gray-400">
                      Due:{" "}
                      {typeof invoice.dueDate === "string"
                        ? invoice.dueDate
                        : invoice.dueDate.toISOString().split("T")[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Content Section */}
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden",
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {/* Item List */}
                <ul className="mb-4 space-y-1 text-gray-200">
                  {invoice.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex justify-between items-center text-sm ml-4"
                    >
                      <span>• {item.name}</span>
                      <span>{formatCurrency(item.value, currencySymbol)}</span>
                    </li>
                  ))}
                </ul>

                {/* Total Row */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                  <span className="font-semibold text-gray-100">Total</span>
                  <span className="font-bold text-gray-100">
                    {formatCurrency(totalValue, currencySymbol)}
                  </span>
                </div>

                {/* Go to Payment Button */}
                <div className="flex justify-end mt-5">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (onGoToPayment) {
                        onGoToPayment(index);
                      } else if (invoices[index]?.id) {
                        try {
                          const { paymentUrl } =
                            await UserPanelService.processInvoicePayment(
                              invoices[index].id as string
                            );
                          if (typeof window !== "undefined") {
                            window.open(paymentUrl, "_blank");
                          }
                        } catch (err) {
                          // noop
                        }
                      }
                    }}
                    className="px-5 py-1 bg-[#99CC33] text-[#13103A] rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Go to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
