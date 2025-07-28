import { useEffect, useState } from "react";
import { useFetch } from "@/lib/services/endpoints";
import { endpoints } from "@/lib/services/endpoints";
import {
  Lead,
  LeadApiResponse,
} from "./lead"; // Asegúrate de ajustar este path si es necesario

export interface LeadViewModelParams {
  simpleLead?: boolean;
  offset?: number;
  simpleLeadsPerPage?: number;
}

export const LeadViewModel = ({
  simpleLead = false,
  offset = 0,
  simpleLeadsPerPage = 10,
}: LeadViewModelParams = {}) => {
  const { fetchData } = useFetch();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<LeadApiResponse["page"] | null>(null);

  useEffect(() => {
    getAllLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleLead, offset, simpleLeadsPerPage]);

  const getAllLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (simpleLead) params.append("simpleLead", "true");
      if (offset) params.append("offset", offset.toString());
      if (simpleLead && simpleLeadsPerPage)
        params.append("simpleLeadsPerPage", simpleLeadsPerPage.toString());

      const url = `${endpoints.lead.getPosts}${params.toString() ? `?${params.toString()}` : ""}`;

      const { response, status, errorLogs } = await fetchData<LeadApiResponse>(url, "get");

      if (status === 200 && response && response.success) {
        setLeads(response.data);
        setPageInfo(response.page ?? null);
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to fetch leads (Status: ${status})`;

        setError(errorMessage);
        setLeads([]);
        setPageInfo(null);
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "An unexpected error occurred while fetching leads.";
      setError(errorMessage);
      setLeads([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    leads,
    loading,
    error,
    pageInfo,
  };
};

export default LeadViewModel;
