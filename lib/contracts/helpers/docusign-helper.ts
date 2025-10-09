import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

/** Convierte Blob PDF a base64 (sin prefijo data:) */
export async function pdfToBase64(pdfBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64 = base64String.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(pdfBlob);
  });
}

/**
 * Envía el contrato a DocuSign.
 * Por defecto `mode: "email"` => DocuSign envía correos a TODOS los firmantes.
 * Si quieres embedded para alguno, pasa embeddedOwner / embeddedClient = true.
 */
export async function sendContractToDocuSign(opts: {
  pdfBlob: Blob;
  recipientEmail: string;
  recipientName: string;
  contractTitle: string;
  contractId: string | number;

  /** Opcionales; mejor evitar enviarlos desde el cliente si están en env del server */
  ownerEmail?: string;
  ownerName?: string;

  mode?: "email" | "embedded";
  embeddedOwner?: boolean;
  embeddedClient?: boolean;
  returnUrl?: string;
}): Promise<{
  success: boolean;
  envelopeId?: string;
  ownerSigningUrl?: string;
  clientSigningUrl?: string;
  error?: string;
}> {
  try {
    const {
      pdfBlob,
      recipientEmail,
      recipientName,
      contractTitle,
      contractId,
      ownerEmail,
      ownerName,
      mode = "email",
      embeddedOwner,
      embeddedClient,
      returnUrl,
    } = opts;

    const pdfBase64 = await pdfToBase64(pdfBlob);

    const body = {
      pdfBase64,
      recipientEmail,
      recipientName,
      contractTitle,
      contractId,
      // Solo manda owner si REALMENTE no los tienes como env en el server
      ...(ownerEmail ? { ownerEmail } : {}),
      ...(ownerName ? { ownerName } : {}),
      mode,              // "email" => DocuSign manda correos
      embeddedOwner,     // opcional
      embeddedClient,    // opcional
      returnUrl,         // opcional para embedded
    };

    const res = await Axios.post(
      endpoints.docusign.createEnvelope,   // <- usa tu router centralizado
      body,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,             // cookies si aplica
      }
    );

    return {
      success: true,
      envelopeId: res.data?.envelopeId,
      ownerSigningUrl: res.data?.ownerSigningUrl,
      clientSigningUrl: res.data?.clientSigningUrl,
    };
  } catch (err: any) {
    console.error("[DocuSign Helper Error]", err?.response?.data || err?.message);
    return {
      success: false,
      error: err?.response?.data?.error || err?.message || "Unknown error",
    };
  }
}
