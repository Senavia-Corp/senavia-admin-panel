# User Panel Services

Este directorio contiene los servicios y hooks necesarios para el panel de usuario (user-panel), que maneja las solicitudes (requests) y proyectos (projects) desde la perspectiva del cliente.

## Archivos

### `user-panel-service.ts`

Servicio principal que maneja todas las llamadas a la API para:

- **User Requests**: Obtener, crear y gestionar solicitudes de usuario
- **User Projects**: Obtener y gestionar proyectos de usuario
- **Chat**: Mensajería entre usuario y administrador
- **ChatService**: Servicio dedicado para chat (mensajes e historial)
- **Estimates**: Gestión de estimaciones (aceptar/rechazar)
- **Invoices**: Gestión de facturas y pagos

## Uso

### En componentes

```typescript
import { UserPanelService } from "@/services/user-panel/user-panel-service";

function UserPanelComponent() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async (userId: string) => {
    setLoading(true);
    try {
      const data = await UserPanelService.getUserRequests(userId);
      setRequests(data);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Usar los métodos del servicio directamente
}
```

### Servicios directos

```typescript
import { UserPanelService } from "@/services/user-panel/user-panel-service";
import { ChatService } from "@/services/user-panel/chat-service";

// Obtener requests de usuario
const requests = await UserPanelService.getUserRequests(userId);

// Enviar mensaje
await ChatService.sendMessage({
  entityId: "request-123",
  entityType: "request",
  message: "Hola!",
  userId: "user-123",
});

// Aceptar estimación
await UserPanelService.acceptEstimate("estimate-456");
```

## Endpoints Requeridos

Los siguientes endpoints deben estar implementados en el backend:

### User Requests

- `GET /api/user/requests/{userId}` - Obtener requests del usuario
- `GET /api/user/requests/detail/{requestId}` - Detalle de request
- `GET /api/user/requests/estimate/{requestId}` - Estimación de request
- `GET /api/user/requests/invoice/{requestId}` - Factura de request
- `POST /api/user/requests/estimate/{estimateId}/accept` - Aceptar estimación
- `POST /api/user/requests/estimate/{estimateId}/decline` - Rechazar estimación
- `POST /api/user/requests/invoice/{invoiceId}/payment` - Procesar pago

### User Projects

- `GET /api/user/projects/{userId}` - Obtener proyectos del usuario
- `GET /api/user/projects/detail/{projectId}` - Detalle de proyecto
- `GET /api/user/projects/updates/{projectId}` - Actualizaciones de proyecto

### Chat

- `GET /api/user/requests/chat/{requestId}` - Mensajes de request
- `GET /api/user/projects/chat/{projectId}` - Mensajes de proyecto
- `POST /api/user/requests/chat/{requestId}/send` - Enviar mensaje a request
- `POST /api/user/projects/chat/{projectId}/send` - Enviar mensaje a proyecto

## Uso del UserPanel Component

El componente `UserPanel` ha sido actualizado para usar directamente el `UserPanelService`. Ejemplo de uso:

```typescript
import UserPanel from "@/components/pages/dashboard/user-panel";

function DashboardPage() {
  const userId = getCurrentUserId(); // Obtener del contexto de auth

  return (
    <div>
      <UserPanel userId={userId} />
    </div>
  );
}
```

El componente maneja internamente:

- Estados de carga para todas las operaciones
- Gestión de datos de requests y projects
- Chat en tiempo real
- Estados para estimates e invoices
- Navegación entre tabs y selecciones

## Tipos

Los tipos están definidos en:

- `/types/user-management.ts` - Tipos base
- `/services/user-panel/user-panel-service.ts` - Tipos específicos del panel
- `/services/user-panel/chat-service.ts` - Tipos y métodos de chat

## Notas

- Todos los servicios manejan errores automáticamente
- El componente UserPanel usa directamente el UserPanelService sin hooks intermedios
- Incluye funcionalidades completas: aceptar/rechazar estimates, procesar pagos, chat en tiempo real
- Manejo completo de chat, requests, projects, estimates e invoices
- Interfaz responsive que se adapta a diferentes tamaños de pantalla
