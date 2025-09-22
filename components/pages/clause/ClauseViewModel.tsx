import { useEffect, useState } from "react";
import { endpoints, useFetch } from "@/lib/services/endpoints";
import { Clause, ClauseApiResponse, ApiResponse } from "./clause";

export interface ClauseViewModelParams {
  isPaginated?: boolean;
  offset?: number;
  itemsPerPage?: number;
  searchTerm?: string;
}

export const ClauseViewModel = ({
  isPaginated = false,
  offset = 0,
  itemsPerPage = 10,
  searchTerm = "",
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
        if (!clauseId) {
          setClauses((prev) => [...prev, response.data]);
          return true;
        } else {
          setClauses((prev) =>
            prev.map((p) => (p.id === response.data.id ? response.data : p))
          );
        }
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
    try {
      const params = new URLSearchParams();
      if (isPaginated) params.append("isPaginated", "true");
      if (offset) params.append("offset", offset.toString());
      if (isPaginated && itemsPerPage)
        params.append("itemsPerPage", itemsPerPage.toString());

      if (searchTerm) params.append("searchTerm", searchTerm);


      const url = `${endpoints.clause.getAll}${
        params.toString() ? `?${params.toString()}` : ""
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
    getAllClauses();
  }, [isPaginated, offset, itemsPerPage, searchTerm]);

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
  };
};
export default ClauseViewModel;
