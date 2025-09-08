"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

// Define the structure for each item in the estimate
interface EstimatedItem {
  name: string;
  value: number;
}

// Define the structure for an estimate group
interface EstimateGroup {
  title: string;
  items: EstimatedItem[];
}

// Define the props for the EstimatedValue component
interface EstimatedValueProps {
  estimates: EstimateGroup[]; // Now accepts an array of estimate groups
  currencySymbol?: string; // Optional currency symbol, defaults to $
  onAccept?: (estimateIndex: number) => void; // Modified to include which estimate was accepted
  onDecline?: (estimateIndex: number, reason?: string) => void; // Modified to include which estimate was declined
  status?: string;
  // Estado controlado opcional
  openStates?: boolean[];
  setOpenStates?: (v: boolean[]) => void;
  showDeclineReasons?: boolean[];
  setShowDeclineReasons?: (v: boolean[]) => void;
  declineMessages?: string[];
  setDeclineMessages?: (v: string[]) => void;
  loading?: boolean;
}

// Helper function to format currency
const formatCurrency = (value: number, symbol: string = "$") => {
  // Using Intl.NumberFormat for better localization and formatting
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Adjust currency code if needed
    currencyDisplay: "symbol", // Use symbol like $
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace("USD", symbol); // Replace default code if symbol provided
};

function SkeletonEstimate() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 1 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-700 shadow-[0_2px_8px_0_rgba(0,0,0,0.10)] bg-[#0b0e1c] animate-pulse"
        >
          <div className="w-full h-full bg-[#0b0e1c] rounded-lg p-3 flex justify-between items-center">
            <div className="h-5 w-1/3 bg-gray-700/60 rounded" />
            <div className="h-5 w-1/4 bg-gray-700/60 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EstimatedValue({
  estimates,
  currencySymbol = "$",
  onAccept,
  onDecline,
  status,
  openStates: controlledOpenStates,
  setOpenStates: setControlledOpenStates,
  showDeclineReasons: controlledShowDeclineReasons,
  setShowDeclineReasons: setControlledShowDeclineReasons,
  declineMessages: controlledDeclineMessages,
  setDeclineMessages: setControlledDeclineMessages,
  loading = false,
}: EstimatedValueProps) {
  if (loading) return <SkeletonEstimate />;

  // Si no se pasan props, usa estado interno
  const [internalOpenStates, internalSetOpenStates] = useState<boolean[]>(
    new Array(estimates.length).fill(false)
  );
  const [internalShowDeclineReasons, internalSetShowDeclineReasons] = useState<boolean[]>(
    new Array(estimates.length).fill(false)
  );
  const [internalDeclineMessages, internalSetDeclineMessages] = useState<string[]>(
    new Array(estimates.length).fill("")
  );
  useEffect(() => {
    if (!controlledOpenStates) internalSetOpenStates(new Array(estimates.length).fill(false));
    if (!controlledShowDeclineReasons)
      internalSetShowDeclineReasons(new Array(estimates.length).fill(false));
    if (!controlledDeclineMessages)
      internalSetDeclineMessages(new Array(estimates.length).fill(""));
  }, [estimates]);
  const openStates = controlledOpenStates ?? internalOpenStates;
  const setOpenStates = setControlledOpenStates ?? internalSetOpenStates;
  const showDeclineReasons = controlledShowDeclineReasons ?? internalShowDeclineReasons;
  const setShowDeclineReasons = setControlledShowDeclineReasons ?? internalSetShowDeclineReasons;
  const declineMessages = controlledDeclineMessages ?? internalDeclineMessages;
  const setDeclineMessages = setControlledDeclineMessages ?? internalSetDeclineMessages;

  // --- Render Logic ---

  return (
    <div className="space-y-4">
      {estimates.map((estimate, index) => {
        // Calculate the total value for this estimate
        const totalValue = estimate.items.reduce((sum, item) => sum + item.value, 0);

        const isOpen = openStates[index];
        const showDeclineReason = showDeclineReasons[index];

        // Handlers for this specific estimate
        const handleToggle = () => {
          if (showDeclineReason) return;
          const newOpenStates = [...openStates];
          newOpenStates[index] = !newOpenStates[index];
          setOpenStates(newOpenStates);
        };

        const handleInitiateDecline = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          const newShowDeclineReasons = [...showDeclineReasons];
          newShowDeclineReasons[index] = true;
          setShowDeclineReasons(newShowDeclineReasons);
        };

        const handleCancelDecline = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          const newShowDeclineReasons = [...showDeclineReasons];
          newShowDeclineReasons[index] = false;
          setShowDeclineReasons(newShowDeclineReasons);

          const newDeclineMessages = [...declineMessages];
          newDeclineMessages[index] = "";
          setDeclineMessages(newDeclineMessages);
        };

        const handleConfirmDecline = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          if (onDecline) {
            onDecline(index, declineMessages[index]);
          }

          const newShowDeclineReasons = [...showDeclineReasons];
          newShowDeclineReasons[index] = false;
          setShowDeclineReasons(newShowDeclineReasons);

          const newOpenStates = [...openStates];
          newOpenStates[index] = false;
          setOpenStates(newOpenStates);

          const newDeclineMessages = [...declineMessages];
          newDeclineMessages[index] = "";
          setDeclineMessages(newDeclineMessages);
        };

        const handleDeclineMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const newDeclineMessages = [...declineMessages];
          newDeclineMessages[index] = e.target.value;
          setDeclineMessages(newDeclineMessages);
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
            <div className={cn("w-full h-full bg-[#0b0e1c] rounded-lg", isOpen ? "p-4" : "")}>
              {/* Header (Always Visible, Clickable) */}
              <div
                className={cn(
                  "flex justify-between items-center",
                  isOpen ? "mb-4" : "p-3", // Add padding only when closed
                  "cursor-pointer" // Always clickable
                )}
                onClick={handleToggle}
              >
                <span className="font-bold text-lg text-gray-100">{estimate.title}</span>
                <span className="font-semibold text-lg text-gray-100">
                  {formatCurrency(totalValue, currencySymbol)}
                </span>
              </div>

              {/* Main Content Section */}
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden",
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
                  showDeclineReason ? "invisible" : "visible" // Hide when decline reason is showing
                )}
              >
                {/* Item List */}
                <ul className="mb-4 space-y-1 text-gray-200">
                  {estimate.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex justify-between items-center text-sm ml-4">
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

                {/* Action Buttons */}
                {(onAccept || onDecline) && (
                  <div className="flex justify-end gap-3 mt-5">
                    {onDecline && (
                      <button
                        onClick={handleInitiateDecline}
                        className="px-5 py-1 bg-[#99CC33] text-[#13103A] rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors"
                      >
                        Decline
                      </button>
                    )}
                    {onAccept && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAccept) onAccept(index);

                          const newOpenStates = [...openStates];
                          newOpenStates[index] = false;
                          setOpenStates(newOpenStates);
                        }}
                        className="px-5 py-1 bg-[#99CC33] text-[#13103A] rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Decline Reason Section (Overlay) */}
            <div
              className={cn(
                "absolute top-[3px] left-[3px] right-[3px] bottom-[3px] bg-[#0b0e1c] p-4 flex flex-col rounded-lg",
                "transition-all duration-300 ease-in-out",
                showDeclineReason
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-full pointer-events-none"
              )}
            >
              <h3 className="font-bold text-lg text-gray-100 mb-2">Decline Reason</h3>
              <textarea
                value={declineMessages[index]}
                onChange={handleDeclineMessageChange}
                placeholder="Type your message here."
                className="w-full p-2 border border-gray-700 rounded-md resize-none text-sm text-gray-200 placeholder-gray-400 flex-grow bg-[#0b0e1c] outline-none focus:outline-none focus:border-gray-500"
                rows={6}
              />
              <div className="flex justify-end gap-3 mt-auto pt-3">
                <button
                  onClick={handleCancelDecline}
                  className="px-5 py-1 bg-transparent text-[#99CC33] border border-[#99CC33] rounded-full text-sm font-semibold hover:bg-gray-900 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmDecline}
                  className="px-5 py-1 bg-[#99CC33] text-[#13103A] rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors"
                  disabled={!(declineMessages[index] || "").trim()}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
