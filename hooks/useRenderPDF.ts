import { useEffect, useState, useCallback, useRef } from "react";
import { proxy, wrap } from "comlink";
import type { WorkerType } from "../workers/pdf.worker";

// Create worker instance
const worker = new Worker(
  new URL("../workers/pdf.worker.ts", import.meta.url),
  {
    type: "module",
  }
);

export const pdfWorker = wrap<WorkerType>(worker);

// hook up the debugging inside the main thread
pdfWorker.onProgress(proxy((info: any) => console.log(info)));

export const useRenderPDF = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const isMountedRef = useRef(true);

  // No limpiar URLs - dejar que el navegador las maneje
  // Los blobs se liberarán automáticamente cuando se cierre el navegador

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      console.log("🧹 Componente desmontado, marcando como no montado");
      // Solo marcar como desmontado si no hay generación en progreso
      if (!isGenerating && !loading) {
        isMountedRef.current = false;
      } else {
        console.log("⏳ Generación en progreso, esperando a completar...");
        // Marcar como desmontado después de un delay para permitir que termine
        setTimeout(() => {
          isMountedRef.current = false;
          console.log("🏁 Marcado como desmontado después del delay");
        }, 1000);
      }
    };
  }, [isGenerating, loading]);

  const generatePDF = useCallback(
    async (componentName: string, props: any) => {
      if (isGenerating || loading) {
        console.log("🚫 Generación ya en progreso, ignorando...");
        return;
      }

      console.log("🎯 Iniciando generación PDF...");
      setIsGenerating(true);
      setLoading(true);
      setError(null);
      setUrl(null);

      try {
        const workerProps = { componentName, props };
        console.log("📤 Enviando datos al worker...");
        const result = await pdfWorker.renderPDFInWorker(workerProps);
        console.log("📥 Respuesta recibida del worker:", result);

        // Verificar si el componente sigue montado
        if (!isMountedRef.current) {
          console.log("🚫 Componente desmontado, pero permitiendo mostrar PDF");
          // Aún así mostrar el PDF aunque el componente esté "desmontado"
          // ya que el usuario hizo clic en generar
        }

        setUrl(result);
      } catch (err) {
        console.error("❌ Error en generación:", err);

        // Solo mostrar error si el componente sigue montado
        if (isMountedRef.current) {
          setError(err as Error);
        }
      } finally {
        console.log("🏁 Generación completada");

        // Siempre actualizar estado para limpiar el loading
        setLoading(false);
        setIsGenerating(false);
      }
    },
    [isGenerating, loading]
  );

  const downloadPDF = useCallback(() => {
    if (url) {
      console.log("⬇️ Iniciando descarga...");
      const link = document.createElement("a");
      link.href = url;
      link.download = `contract-${String(url.split("/").pop())}.pdf`;
      link.target = "_blank";
      link.click();
      console.log("✅ Descarga iniciada");
    }
  }, [url]);

  const showPDF = useCallback(() => {
    if (url) {
      console.log("🔗 Abriendo PDF en nueva pestaña...");
      window.open(url, "_blank");
      console.log("✅ PDF abierto en nueva pestaña");
    }
  }, [url]);

  return {
    url,
    loading: loading || isGenerating,
    error,
    generatePDF,
    downloadPDF,
    showPDF,
    isGenerating,
  };
};
