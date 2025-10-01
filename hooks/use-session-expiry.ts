"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import Axios from "axios";

export function useSessionExpiry() {
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Interceptor para respuestas de Axios
    const responseInterceptor = Axios.interceptors.response.use(
      (response) => {
        // Si la respuesta es exitosa, resetear el flag
        if (response.status === 200) {
          hasShownToast.current = false;
        }
        return response;
      },
      (error) => {
        // Si es un error 401 (no autorizado) y no hemos mostrado el toast aún
        if (error.response?.status === 401 && !hasShownToast.current) {
          hasShownToast.current = true;

          toast({
            title: "Sesión Expirada",
            description:
              "El tiempo de su sesión ha terminado. Los datos no se van a cargar. Por favor, refresque la página y vuelva a iniciar sesión.",
            variant: "destructive",
            duration: 10000, // 10 segundos para que el usuario tenga tiempo de leer
          });
        }

        return Promise.reject(error);
      }
    );

    // Cleanup: remover el interceptor cuando el componente se desmonte
    return () => {
      Axios.interceptors.response.eject(responseInterceptor);
    };
  }, [toast]);

  // Función para resetear manualmente el flag (útil después de un login exitoso)
  const resetSessionExpiry = () => {
    hasShownToast.current = false;
  };

  return { resetSessionExpiry };
}
