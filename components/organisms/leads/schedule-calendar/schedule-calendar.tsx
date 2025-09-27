"use client";

import { useState, useEffect } from "react";
import { Calendar_molecule } from "./calendar";
import { HourSelector } from "./hour-selector";
import { GuestManager } from "./guest-manager";
import { Loader2, Users } from "lucide-react";
import { LeadManagementService } from "@/services/lead-management-service";
import { useToast } from "@/hooks/use-toast";
import { Guest } from "@/types/lead-management";

interface HourSelection {
  timezone: string;
  hour: string;
}
interface ScheduleCalendarProps {
  onCancel?: () => void;
  disabled?: boolean;
  // Lead data for creating complete calendar events (includes leadId)
  leadData?: {
    id?: number;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    description?: string;
    serviceId?: number;
  };
}

export function ScheduleCalendar({
  onCancel,
  disabled = false,
  leadData,
}: ScheduleCalendarProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hourSelection, setHourSelection] = useState<HourSelection | null>(
    null
  );
  const [isScheduling, setIsScheduling] = useState(false);
  const [isMultiGuestMode, setIsMultiGuestMode] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);

  console.log("render por cambio de leadData");

  // Auto-agregar el cliente principal como invitado si existe y está en modo multi-guest
  useEffect(() => {
    if (
      isMultiGuestMode &&
      leadData?.clientName &&
      leadData?.clientEmail &&
      guests.length === 0
    ) {
      setGuests([
        {
          name: leadData.clientName,
          email: leadData.clientEmail,
          phone: leadData.clientPhone,
          role: "Client",
        },
      ]);
    }
  }, [
    isMultiGuestMode,
    leadData?.clientName,
    leadData?.clientEmail,
    leadData?.clientPhone,
    guests.length,
  ]);

  const handleScheduleClick = async () => {
    if (selectedDate && hourSelection) {
      setIsScheduling(true);

      try {
        const scheduleData = {
          date: selectedDate.toISOString(),
          //timezone: hourSelection.timezone,
          timeRange: hourSelection.hour,
          description: leadData?.description || "Scheduled meeting with client", //No lo tengo
          // Additional client data for the calendar event
          clientName: leadData?.clientName || "",
          clientEmail: leadData?.clientEmail || "",
          clientPhone: leadData?.clientPhone || "",
          clientAddress: leadData?.clientAddress || "",
          serviceId: leadData?.serviceId || "",
        };

        await LeadManagementService.createSchedule(scheduleData);

        toast({
          title: "Schedule Created",
          description: "Meeting has been successfully scheduled!",
        });

        // Reset the calendar after successful scheduling
        setSelectedDate(undefined);
        setHourSelection(null);
      } catch (error) {
        console.error("Error creating schedule:", error);
        toast({
          title: "Error",
          description: "Failed to create schedule. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsScheduling(false);
      }
    }
  };

  const handleMultiGuestScheduleClick = async () => {
    if (selectedDate && hourSelection && guests.length > 0) {
      setIsScheduling(true);

      try {
        const scheduleData = {
          date: selectedDate.toISOString(),
          timeRange: hourSelection.hour,
          description:
            leadData?.description || "Scheduled meeting with multiple guests",
          // Additional client data for the calendar event
          clientName: leadData?.clientName || "",
          clientEmail: leadData?.clientEmail || "",
          clientPhone: leadData?.clientPhone || "",
          clientAddress: leadData?.clientAddress || "",
          serviceId: leadData?.serviceId || "",
          guests: guests,
        };

        await LeadManagementService.createMultiGuestSchedule(scheduleData);

        toast({
          title: "Multi-Guest Schedule Created",
          description: `Meeting scheduled successfully with ${guests.length} guest(s)!`,
        });

        // Reset the calendar after successful scheduling
        setSelectedDate(undefined);
        setHourSelection(null);
        setGuests([]);
        setIsMultiGuestMode(false);
      } catch (error) {
        console.error("Error creating multi-guest schedule:", error);
        toast({
          title: "Error",
          description:
            "Failed to create multi-guest schedule. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsScheduling(false);
      }
    }
  };

  const isReadyToSchedule = selectedDate && hourSelection;
  const isReadyToScheduleMultiGuest =
    selectedDate && hourSelection && guests.length > 0;

  return (
    <div
      className={`relative ${
        disabled || isScheduling ? "pointer-events-none" : ""
      }`}
    >
      {/* Overlay when scheduling */}
      {(disabled || isScheduling) && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 z-10 rounded-md" />
      )}

      <div className="space-y-6">
        {/* Calendar Section */}
        <div className="w-full">
          {!selectedDate ? (
            <div className="flex justify-center">
              <Calendar_molecule
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  console.log("Date selected:", date);
                  setSelectedDate(date);
                  setHourSelection(null); // Reset hour selection when date changes
                }}
              />
            </div>
          ) : (
            /* Show hour selector once date is selected */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">
                  Selected: {selectedDate.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-center">
                <HourSelector
                  onBack={() => setSelectedDate(undefined)}
                  onSelectionChange={setHourSelection}
                />
              </div>
            </div>
          )}
        </div>

        {/* Multi-Guest Toggle Button */}
        {selectedDate && hourSelection && (
          <div className="w-full flex justify-center mb-4">
            <button
              type="button"
              onClick={() => {
                setIsMultiGuestMode(!isMultiGuestMode);
                if (
                  !isMultiGuestMode &&
                  leadData?.clientName &&
                  leadData?.clientEmail
                ) {
                  setGuests([
                    {
                      name: leadData.clientName,
                      email: leadData.clientEmail,
                      phone: leadData.clientPhone,
                      role: "Client",
                    },
                  ]);
                } else if (isMultiGuestMode) {
                  setGuests([]);
                }
              }}
              disabled={disabled || isScheduling}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 ${
                isMultiGuestMode
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              <Users className="h-4 w-4" />
              {isMultiGuestMode
                ? "Modo Multi-Invitados (ON)"
                : "Activar Multi-Invitados"}
            </button>
          </div>
        )}

        {/* Guest Management Section - Show when multi-guest mode is enabled */}
        {isMultiGuestMode && selectedDate && hourSelection && (
          <div className="w-full">
            <GuestManager
              guests={guests}
              onGuestsChange={setGuests}
              disabled={disabled || isScheduling}
            />
          </div>
        )}

        {/* Schedule Button Section - Always at bottom, responsive */}
        <div className="w-full flex justify-center gap-3">
          {/* Regular Schedule Button - Only show when not in multi-guest mode */}
          {!isMultiGuestMode && isReadyToSchedule && (
            <button
              type="button"
              onClick={handleScheduleClick}
              disabled={disabled || isScheduling}
              className="w-full sm:w-auto px-6 py-3 bg-[#99CC33] hover:bg-[#8bb82e] text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScheduling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Scheduling Lead...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Schedule Lead</span>
                </>
              )}
            </button>
          )}

          {/* Multi-Guest Schedule Button - Only show when in multi-guest mode */}
          {isMultiGuestMode && isReadyToScheduleMultiGuest && (
            <button
              type="button"
              onClick={handleMultiGuestScheduleClick}
              disabled={disabled || isScheduling}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScheduling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Scheduling Multi-Guest...</span>
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  <span>
                    Schedule with {guests.length} Guest
                    {guests.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Disabled State Buttons */}
          {!isReadyToSchedule && !isMultiGuestMode && (
            <button
              type="button"
              disabled={true}
              className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-500 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                />
              </svg>
              <span>
                {!selectedDate
                  ? "Select Date"
                  : !hourSelection
                  ? "Select Time"
                  : "Schedule Lead"}
              </span>
            </button>
          )}

          {isMultiGuestMode && !isReadyToScheduleMultiGuest && (
            <button
              type="button"
              disabled={true}
              className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-500 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Users className="w-5 h-5" />
              <span>
                {!selectedDate
                  ? "Select Date"
                  : !hourSelection
                  ? "Select Time"
                  : guests.length === 0
                  ? "Add Guests"
                  : "Schedule Multi-Guest"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
