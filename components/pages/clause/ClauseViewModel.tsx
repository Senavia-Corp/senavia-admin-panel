import { useEffect, useState } from "react";
import { endpoints, useFetch } from "@/lib/services/endpoints";
import { Clause, ClauseApiResponse, ApiResponse } from "./clause";

export interface ClauseViewModelParams {
  isPaginated?: boolean;
  offset?: number;
  itemsPerPage?: number;
  searchTerm?: string;
  autoFetch?: boolean;
}

export const ClauseViewModel = ({
  isPaginated = false,
  offset = 0,
  itemsPerPage = 10,
  searchTerm = "",
  autoFetch = true,
}: ClauseViewModelParams = {}) => {
  const { fetchData } = useFetch();
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [clauseId, setClauseId] = useState<Clause | null>(null);

  const saveClause = async (
    data: { title: string; description: string },
    clauseId?: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const url = clauseId
        ? endpoints.clause.update(clauseId)
        : endpoints.clause.create;
      console.log("📦 Payload enviado 2: ", data);
      const { response, status, errorLogs } = await fetchData<any>(
        url,
        clauseId ? "patch" : "post",
        data,
        "json"
      );

      if (status === 201 || status === 200) {
        await getAllClauses();
        /*if (!clauseId) {
          setClauses((prev) => [...prev, response.data]);
          return true;
        } else {
          setClauses((prev) =>
            prev.map((p) => (p.id === response.data.id ? response.data : p))
          );
        }*/
        return true;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to save Clause (Status: ${status})`;
        setError(errorMessage);

        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage || "An unexpected error occurred while saving Clause.";
      setError(errorMessage);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAllClauses = async () => {
    setLoading(true);
    setError(null);
    setClauses([]);
    try {
      const params = new URLSearchParams();
      if (isPaginated) params.append("isPaginated", "true");
      if (offset) params.append("offset", offset.toString());
      if (isPaginated && itemsPerPage)
        params.append("itemsPerPage", itemsPerPage.toString());

      if (searchTerm) params.append("searchTerm", searchTerm);


      const url = `${endpoints.clause.getAll}${params.toString() ? `?${params.toString()}` : ""
        }`;
      if (isPaginated) {
        const { response, status, errorLogs } =
          await fetchData<ClauseApiResponse>(url, "get");
        if (status === 200 && response && response?.success) {
          setClauses(response.data);
          setPageInfo(response.page);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch Clause  (Status: ${status})`;
          setError(errorMessage);
          setClauses([]);
          setPageInfo(null);
        }
      } else {
        const { response, status, errorLogs } = await fetchData<
          ApiResponse<Clause>
        >(url, "get");
        if (status === 200 && response && response.success) {
          setClauses(response.data);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch Clause (Status: ${status})`;
          setError(errorMessage);
          setClauses([]);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        "An unexpected error occurred while fetching Clause.";
      setError(errorMessage);
      setClauses([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (autoFetch) getAllClauses();
  }, [autoFetch, isPaginated, offset, itemsPerPage, searchTerm]);

  const getClauseById = async (id: number): Promise<Clause | null> => {
    console.log("deberia funcionar.");
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.clause.getById(id);
      console.log("Soy url:", url);
      const { response, status, errorLogs } = await fetchData<
        ApiResponse<Clause>
      >(url, "get");
      console.log("Respuesta completa: ", response);

      if (status === 200 && response?.success) {
        const clause = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setClauseId(clause);
        return clause;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to fetch Clause with ID ${id} (Status: ${status})`;

        setError(errorMessage);
        setClauseId(null);
        return null;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        `An unexpected error occurred while fetching Clause with ID ${id}.`;

      setError(errorMessage);
      setClauseId(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const deleteClause = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.clause.delete(id);
      const { response, status, errorLogs } = await fetchData<
        ApiResponse<null>
      >(url, "delete");
      if (status === 200 && response?.success) {
        // Eliminar el producto de la lista local
        setClauses((prev) => prev.filter((p) => p.id !== id));
        return true;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to delete Clause with ID ${id} (Status: ${status})`;
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        `An unexpected error occurred while deleting Clause with ID ${id}.`;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getClausesByContract = async (contractId: number) => {
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.contractClause.getByContract(contractId);
      const { response, status, errorLogs } = await fetchData<ApiResponse<Clause>>(url, "get");
      if (status === 200 && response?.success) {
        setClauses(response.data);
      } else {
        const errorMessage =
          errorLogs?.message || response?.message || `Failed to fetch contract clauses (Status: ${status})`;
        setError(errorMessage);
        setClauses([]);
      }
    } catch (err: any) {
      setError(err?.message || "Unexpected error while fetching contract clauses.");
      setClauses([]);
    } finally {
      setLoading(false);
    }
  };

  const saveClauseForContract = async (
    contractId: number,
    data: { title: string; description: string }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { response, status, errorLogs } = await fetchData<ApiResponse<Clause>>(
        endpoints.contractClause.createAndAttach,
        "post",
        { contractId, ...data },
        "json"
      );
      if (status === 201 || (status === 200 && response?.success)) {
        return true;
      }
      const errorMessage =
        errorLogs?.message || response?.message || `Failed to create and attach clause (Status: ${status})`;
      setError(errorMessage);
      return false;
    } catch (err: any) {
      setError(err?.message || "Unexpected error while creating and attaching clause.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unlinkClauseFromContract = async (contractId: number, clauseId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { response, status, errorLogs } = await fetchData<ApiResponse<null>>(
        endpoints.contractClause.unlink(contractId, clauseId),
        "delete"
      );
      if (status === 200 && response?.success) return true;
      const errorMessage =
        errorLogs?.message || response?.message || `Failed to unlink clause (Status: ${status})`;
      setError(errorMessage);
      return false;
    } catch (err: any) {
      setError(err?.message || "Unexpected error while unlinking clause.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const linkExistingClauseToContract = async (contractId: number, clauseId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { response, status, errorLogs } = await fetchData<ApiResponse<Clause>>(
        endpoints.contractClause.link,
        "post",
        { contractId, clauseId },
        "json"
      );
      if ((status === 200 || status === 201) && response?.success) return true;
      const errorMessage =
        errorLogs?.message || response?.message || `Failed to link clause (Status: ${status})`;
      setError(errorMessage);
      return false;
    } catch (err: any) {
      setError(err?.message || "Unexpected error while linking clause.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    clauses,
    loading,
    error,
    pageInfo,
    clauseId,
    getClauseById,
    deleteClause,
    saveClause,
    getAllClauses,
    getClausesByContract,
    saveClauseForContract,
    unlinkClauseFromContract,
    linkExistingClauseToContract,
  };
};
export default ClauseViewModel;
