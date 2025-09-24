"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { schedules } from "@/lib/constants/schedules";
import { ChevronLeft } from "lucide-react";
// import { useTranslations } from "next-intl";

interface HourSelection {
  timezone: string;
  hour: string;
}

interface HourSelectorProps {
  onSelectionChange: (selection: HourSelection) => void;
  onBack: () => void;
}

export function HourSelector({ onSelectionChange, onBack }: HourSelectorProps) {
  const [selection, setSelection] = useState<HourSelection>({
    timezone: "",
    hour: "",
  });
  const [displayTimes, setDisplayTimes] = useState<
    Array<{ display: string; original: string }>
  >(schedules.map((time) => ({ display: time, original: time })));

  // const t = useTranslations("Planner");

  // Auto-detectar timezone del usuario
  useEffect(() => {
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = Math.floor(offsetMinutes / -60);
    const sign = offsetHours >= 0 ? "+" : "-";
    const absoluteHours = Math.abs(offsetHours).toString().padStart(2, "0");
    const offsetString = `UTC${sign}${absoluteHours}:00`;

    // Zonas horarias disponibles (ya no hay duplicados)
    const availableTimezones = [
      "UTC-10:00",
      "UTC-09:00",
      "UTC-08:00",
      "UTC-07:00",
      "UTC-06:00",
      "UTC-05:00",
      "UTC-04:00",
      "UTC-03:00",
    ];

    if (availableTimezones.includes(offsetString)) {
      setSelection((prev) => ({ ...prev, timezone: offsetString }));
      console.log("offsetString", offsetString);
    }
  }, []);

  // Ajustar las horas en función de la zona horaria seleccionada
  useEffect(() => {
    if (selection.timezone) {
      // Extraer el offset de la zona horaria
      const offsetMatch = selection.timezone.match(/UTC([+-]\d{2}):00/);
      if (offsetMatch) {
        const selectedOffset = parseInt(offsetMatch[1]);
        // Offset base (la aplicación usa UTC-4 como base)
        const baseOffset = -4;
        // Diferencia en horas entre la zona seleccionada y la base
        const hoursDifference = selectedOffset - baseOffset;
        // Ajustar cada hora en el array de schedules
        const adjustedTimes = schedules.map((time) => {
          // Extraer la hora de inicio del formato "9:00am - 9:15am"
          const [startTime] = time.split(" - ");
          const [hourMinute, period] = startTime.split(/([APap][Mm])/);
          let [hour, minute] = hourMinute.split(":");
          // Convertir a formato 24h para hacer la matemática
          let hour24 = parseInt(hour);
          if (period.toLowerCase() === "pm" && hour24 !== 12) {
            hour24 += 12;
          } else if (period.toLowerCase() === "am" && hour24 === 12) {
            hour24 = 0;
          }
          // Ajustar por la diferencia de zona horaria
          let adjustedHour24 = hour24 + hoursDifference;
          // Manejar cambios de día
          if (adjustedHour24 < 0) {
            adjustedHour24 += 24;
          } else if (adjustedHour24 >= 24) {
            adjustedHour24 -= 24;
          }
          // Convertir de nuevo a formato 12h
          let adjustedPeriod = adjustedHour24 >= 12 ? "pm" : "am";
          let adjustedHour12 = adjustedHour24 % 12;
          if (adjustedHour12 === 0) adjustedHour12 = 12;
          // Crear la string ajustada manteniendo los minutos
          const displayStart = `${adjustedHour12}:${minute}${adjustedPeriod}`;
          // Hacer lo mismo con la hora de fin
          const [, endTime] = time.split(" - ");
          const [endHourMinute, endPeriod] = endTime.split(/([APap][Mm])/);
          let [endHour, endMinute] = endHourMinute.split(":");
          let endHour24 = parseInt(endHour);
          if (endPeriod.toLowerCase() === "pm" && endHour24 !== 12) {
            endHour24 += 12;
          } else if (endPeriod.toLowerCase() === "am" && endHour24 === 12) {
            endHour24 = 0;
          }
          let adjustedEndHour24 = endHour24 + hoursDifference;
          if (adjustedEndHour24 < 0) {
            adjustedEndHour24 += 24;
          } else if (adjustedEndHour24 >= 24) {
            adjustedEndHour24 -= 24;
          }
          let adjustedEndPeriod = adjustedEndHour24 >= 12 ? "pm" : "am";
          let adjustedEndHour12 = adjustedEndHour24 % 12;
          if (adjustedEndHour12 === 0) adjustedEndHour12 = 12;
          const displayEnd = `${adjustedEndHour12}:${endMinute}${adjustedEndPeriod}`;

          // Combinar en el formato original
          const displayTime = `${displayStart} - ${displayEnd}`;
          return {
            display: displayTime,
            original: time,
          };
        });

        setDisplayTimes(adjustedTimes);
      } else {
        // Si no se pudo extraer el offset, mostrar las horas sin ajustar
        setDisplayTimes(
          schedules.map((time) => ({ display: time, original: time }))
        );
      }
    }
  }, [selection.timezone]);

  useEffect(() => {
    if (selection.timezone !== "" && selection.hour !== "") {
      onSelectionChange(selection);
    }
  }, [selection, onSelectionChange]);

  return (
    <Card className="bg-white w-72 h-80 border-[#E4E4E7] h-[370px]">
      <CardHeader className="items-start text-center p-0">
        <Button
          type="button"
          className="bg-white hover:bg-[#8bb82e] w-3 h-6 mt-4 ml-2 text-black border border-black"
          onClick={onBack}
        >
          <ChevronLeft strokeWidth={3} />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col text-center items-center">
        <CardTitle className="font-medium text-base text-secondary mb-5 text-black">
          Select Hour
        </CardTitle>
        <div>
          <Select
            value={selection.timezone}
            onValueChange={(value) =>
              setSelection((prev) => ({ ...prev, timezone: value }))
            }
          >
            <SelectTrigger className="rounded-full bg-transparent text-[#636A9C] border-[#636A9C] h-7 w-60 mb-2">
              <SelectValue placeholder="Select Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Americas</SelectLabel>
                <SelectItem value="UTC-10:00">(UTC-10:00) Honolulu</SelectItem>
                <SelectItem value="UTC-09:00">
                  (UTC-09:00) Anchorage, Juneau
                </SelectItem>
                <SelectItem value="UTC-08:00">
                  (UTC-08:00) Los Angeles, Vancouver
                </SelectItem>
                <SelectItem value="UTC-07:00">
                  (UTC-07:00) Phoenix, Las Vegas, Denver
                </SelectItem>
                <SelectItem value="UTC-06:00">
                  (UTC-06:00) Mexico City, Guatemala City
                </SelectItem>
                <SelectItem value="UTC-05:00">
                  (UTC-05:00) New York, Bogotá
                </SelectItem>
                <SelectItem value="UTC-04:00">
                  (UTC-04:00) Caracas, Santo Domingo
                </SelectItem>
                <SelectItem value="UTC-03:00">
                  (UTC-03:00) Buenos Aires, Montevideo
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="h-64 pb-4">
          <ScrollArea className="w-full h-full">
            <div className="flex flex-col space-y-2 p-4">
              {displayTimes.map((timeObj) => (
                <Button
                  key={timeObj.original}
                  type="button"
                  variant={
                    selection.hour === timeObj.original ? "default" : "outline"
                  }
                  onClick={() =>
                    setSelection((prev) => ({
                      ...prev,
                      hour: timeObj.original,
                    }))
                  }
                  className={`rounded-full h-7 w-60 border-0 ${
                    selection.hour === timeObj.original
                      ? "bg-[#D3E8A9] text-black text-lg"
                      : "bg-[#EBEDF2] text-[#636A9C] text-lg"
                  }`}
                >
                  {timeObj.display}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
