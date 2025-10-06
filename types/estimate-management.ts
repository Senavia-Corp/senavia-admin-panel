export interface Estimate {
  id: number;
  title: string;
  description: string;
  totalAmount: number;
  status: "Pending" | "Accepted" | "Declined" | "Draft";
  clientId?: number;
  clientName?: string;
  leadId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkTeam {
  id: number;
  name: string;
  description: string;
  state: "Active" | "Inactive" | "Busy" | "Available";
  area: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EstimateOption {
  id: number;
  name: string;
  subtitle: string; // Cliente + parte de descripción
}

export interface WorkTeamOption {
  id: number;
  name: string;
  subtitle: string; // Estado del equipo
}

export interface PhaseOption {
  id: number;
  name: string;
  subtitle: string; // Fecha de inicio y estado de la fase
}
