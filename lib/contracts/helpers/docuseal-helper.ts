import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

export async function pdfToBase64(pdfBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(pdfBlob);
  });
}

export async function sendContractToDocuSeal(opts: {
  pdfBlob: Blob;
  recipientEmail: string;
  recipientName: string;
  ownerEmail: string;
  ownerName: string;
  contractTitle: string;
  contractId: string | number;
}): Promise<{
  success: boolean;
  ownerSigningUrl?: string;
  clientSigningUrl?: string;
  error?: string;
}> {
  try {
    const {
      pdfBlob,
      recipientEmail,
      recipientName,
      ownerEmail,
      ownerName,
      contractTitle,
      contractId,
    } = opts;

    const pdfBase64 = await pdfToBase64(pdfBlob);

    const res = await Axios.post(
      endpoints.docuseal.createLinks,
      {
        pdfBase64,
        recipientEmail,
        recipientName,
        ownerEmail,
        ownerName,
        contractTitle,
        contractId,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return {
      success: true,
      ownerSigningUrl: res.data?.ownerSigningUrl,
      clientSigningUrl: res.data?.clientSigningUrl,
    };
  } catch (err: any) {
    console.error("[DocuSeal Helper Error]", err?.response?.data || err?.message);
    return {
      success: false,
      error: err?.response?.data?.error || err?.message || "Unknown error",
    };
  }
}
