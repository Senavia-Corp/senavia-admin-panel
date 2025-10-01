"use client";

import { useSessionExpiry } from "@/hooks/use-session-expiry";

interface SessionExpiryProviderProps {
  children: React.ReactNode;
}

export function SessionExpiryProvider({
  children,
}: SessionExpiryProviderProps) {
  // Inicializar el hook para detectar expiración de sesión
  useSessionExpiry();

  return <>{children}</>;
}
