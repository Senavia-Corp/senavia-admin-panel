import { pdf } from "@react-pdf/renderer";

/**
 * Función genérica para renderizar cualquier componente PDF a Blob
 * @param PDFComponent - Componente React que representa el PDF
 * @param props - Props que se pasan al componente PDF
 * @returns Promise<Blob> - Blob del PDF generado
 */
export const renderPDF = async (
  PDFComponent: React.ComponentType<any>,
  props: any
) => {
  return pdf(<PDFComponent {...props} />).toBlob();
};
