# Schedule Calendar Component

Este componente permite agendar reuniones/citas para leads utilizando un calendario interactivo y selector de horarios.

## Archivos Creados

### 1. `schedule-calendar.tsx`

Componente principal que combina el calendario y selector de horarios.

**Props:**

- `onScheduleComplete: (scheduleData: ScheduleData) => void` - Callback cuando se completa la selección
- `onCancel?: () => void` - Callback opcional para cancelar

**Interfaz ScheduleData:**

```typescript
interface ScheduleData {
  date: Date;
  timezone: string;
  timeRange: string;
}
```

### 2. Integración en `lead-form.tsx`

El calendario está integrado directamente en el formulario de leads como un campo más, apareciendo solo en modo edición.

### 3. Servicio de Leads Extendido

Se agregaron los siguientes métodos al `LeadManagementService`:

- `createSchedule(scheduleData: ScheduleData)` - Crear un nuevo schedule
- `getSchedules(leadId: number)` - Obtener schedules de un lead
- `updateSchedule(scheduleId: number, updates: Partial<ScheduleData>)` - Actualizar schedule
- `deleteSchedule(scheduleId: number)` - Eliminar schedule

### 4. Tipos Agregados

En `types/lead-management.ts`:

```typescript
export interface ScheduleData {
  leadId: number;
  date: string;
  timezone: string;
  timeRange: string;
  title?: string;
  description?: string;
}

export interface CreateScheduleData {
  leadId: number;
  date: string;
  timezone: string;
  timeStart: string;
  timeFinish: string;
  title?: string;
  description?: string;
}
```

### 5. Endpoints Agregados

En `lib/services/endpoints.ts`:

```typescript
lead: {
  // ... endpoints existentes
  createSchedule: `${API}/lead/schedule`,
  getSchedules: (leadId: number) => `${API}/lead/${leadId}/schedules`,
  updateSchedule: (scheduleId: number) => `${API}/lead/schedule?id=${scheduleId}`,
  deleteSchedule: (scheduleId: number) => `${API}/lead/schedule?id=${scheduleId}`,
}
```

### 6. Constantes de Horarios

En `lib/constants/schedules.ts` - Array con los horarios disponibles de 9:00am a 5:00pm en intervalos de 15 minutos.

## Uso

### Integrado en Edit Lead Form (Automático)

El calendario aparece automáticamente cuando editas un lead:

1. Ve a `/leads`
2. Haz clic en "Edit" en cualquier lead
3. El calendario aparece como el último campo del formulario ("Schedule Lead")
4. Selecciona fecha y hora para crear el schedule automáticamente

### Uso Manual del Componente

```tsx
import { ScheduleCalendar } from "@/components/leads/schedule-calendar";

function MyComponent() {
  const handleScheduleComplete = async (scheduleData) => {
    // Implementar lógica de creación de schedule
    console.log("Schedule created:", scheduleData);
  };

  return (
    <ScheduleCalendar
      onScheduleComplete={handleScheduleComplete}
      onCancel={() => console.log("Cancelled")}
    />
  );
}
```

## Características

- **Calendario interactivo**: No permite seleccionar fechas pasadas ni fines de semana
- **Selector de zona horaria**: Auto-detecta la zona horaria del usuario
- **Horarios disponibles**: 9:00am - 5:00pm en intervalos de 15 minutos
- **Ajuste automático de horarios**: Los horarios se ajustan según la zona horaria seleccionada
- **Integración con servicio**: Conversión automática de timeRange a timeStart/timeFinish para el backend

## Dependencias

- `@/components/ui/calendar` - Componente de calendario base
- `@/components/ui/button` - Botones de la interfaz
- `@/components/ui/select` - Selector de zona horaria
- `@/components/ui/scroll-area` - Área de scroll para horarios
- `lucide-react` - Íconos (ChevronLeft)
