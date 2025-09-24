"use client";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { enUS } from "date-fns/locale";
import { es } from "date-fns/locale";

interface CalendarMoleculeProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
}

//This function checks two conditions:
//1.If the date is before today (to prevent the user from selecting past days).
//2.If the date falls on a Saturday (6) or Sunday (0), to disable weekends as well.
export function Calendar_molecule({
  selectedDate,
  onDateChange,
}: CalendarMoleculeProps) {
  const isDisabled = (date: Date) => {
    const today = new Date(); //Create a Date object with the current date and time.
    today.setHours(0, 0, 0, 0); //The time is reset to midnight to perform a date-only comparison.

    const isPast = date < today; //True if the date is before today.
    const day = date.getDay(); //Gets the day of the week (0 = Sunday, 6 = Saturday).
    const isWeekend = day === 0 || day === 6;
    return isPast || isWeekend; //Disable if it's in the past or a weekend.
  };

  // Default to English locale, can be configured later if needed
  const calendarLocale = enUS;

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onDateChange}
      disabled={isDisabled}
      locale={calendarLocale}
      className="text-black rounded-sm border border-[#E4E4E7] h-[326px]"
      classNames={{
        day_today: "bg-[#04081E] text-white",
        day_selected: "bg-[#04081E] text-white",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-none [&:has([aria-selected])]:text-white",
      }}
    />
  );
}
