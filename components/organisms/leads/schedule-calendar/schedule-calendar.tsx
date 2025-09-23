"use client";

import { useState } from "react";
import { Calendar_molecule } from "./calendar";
import { HourSelector } from "./hour-selector";

interface HourSelection {
  timezone: string;
  hour: string;
}

interface ScheduleData {
  date: Date;
  timezone: string;
  timeRange: string;
}

interface ScheduleCalendarProps {
  onScheduleComplete: (scheduleData: ScheduleData) => void;
  onCancel?: () => void;
}

export function ScheduleCalendar({
  onScheduleComplete,
  onCancel,
}: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hourSelection, setHourSelection] = useState<HourSelection | null>(
    null
  );

  // When both date and hour are selected, call the completion callback
  const handleHourSelection = (selection: HourSelection) => {
    setHourSelection(selection);

    if (selectedDate) {
      const scheduleData: ScheduleData = {
        date: selectedDate,
        timezone: selection.timezone,
        timeRange: selection.hour,
      };

      onScheduleComplete(scheduleData);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Show calendar if no date is selected */}
      {!selectedDate ? (
        <div className="space-y-4">
          <Calendar_molecule
            selectedDate={selectedDate}
            onDateChange={(date) => {
              console.log("Date selected:", date);
              setSelectedDate(date);
            }}
          />
          {onCancel && (
            <div className="flex justify-center">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Show hour selector once date is selected */
        <HourSelector
          onBack={() => setSelectedDate(undefined)}
          onSelectionChange={handleHourSelection}
        />
      )}
    </div>
  );
}
