import { expose } from "comlink";

let log = console.log;

const renderPDFInWorker = async ({
  componentName,
  props,
}: {
  componentName: string;
  props: any;
}) => {
  console.log("🚀 Worker iniciado:", Date.now());
  console.log("📋 Componente PDF:", componentName);
  console.log("📋 Props recibidas:", props);

  try {
    console.log("📦 Importando renderPDF...");
    const { renderPDF } = await import("../lib/renderPDF");
    console.log("✅ renderPDF importado exitosamente");

    console.log("📦 Importando componente PDF...");
    let PDFComponent;

    switch (componentName) {
      case "ContractPDF":
        const { ContractPDF } = await import("../lib/contracts/ContractPDF");
        PDFComponent = ContractPDF;
        break;
      default:
        throw new Error(`Componente PDF no encontrado: ${componentName}`);
    }

    console.log("✅ Componente PDF importado exitosamente");

    console.log("🔄 Generando PDF...");
    const blob = await renderPDF(PDFComponent, props);
    console.log("✅ PDF generado exitosamente, tamaño:", blob.size, "bytes");

    const url = URL.createObjectURL(blob);
    console.log("🔗 URL del blob creada:", url);
    console.log("🏁 Worker completado exitosamente");

    return url;
  } catch (error) {
    console.error("❌ Error en worker:", error);
    console.error("❌ Stack trace:", (error as Error).stack);
    log(error);
    throw error;
  }
};

// for debugging purposes - will override the log method to the callback
const onProgress = (cb: typeof console.info) => (log = cb);

// easier way to expose function from workers using comlink
expose({ renderPDFInWorker, onProgress });

export type WorkerType = {
  renderPDFInWorker: typeof renderPDFInWorker;
  onProgress: typeof onProgress;
};
