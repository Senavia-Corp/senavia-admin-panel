import { useEffect, useState } from "react";
import { endpoints, useFetch } from "@/lib/services/endpoints";
import { Plan, PlanApiResponse, ApiResponse } from "./plan";

export interface PlanViewModelParams {
  isPaginated?: boolean;
  offset?: number;
  itemsPerPage?: number;
  searchTerm?: string;
}
export const PlanViewModel = ({
  isPaginated = false,
  offset = 0,
  itemsPerPage = 10,
  searchTerm = "",
}: PlanViewModelParams = {}) => {
  const { fetchData } = useFetch();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [planId, setPlanId] = useState<Plan | null>(null);


const savePlan = async (
    data: { name: string; description: string; type: string; price:number; serviceId:number;  },
    planId?: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const url = planId
        ? endpoints.plan.update(planId)
        : endpoints.plan.create;
      console.log("📦 Payload enviado 2: ", data);
      const { response, status, errorLogs } = await fetchData<any>(
        url,
        planId ? "patch" : "post",
        data,
        "json"
      );

      if (status === 201 || status === 200) {
        await getAllPlans();
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
          `Failed to save Plan (Status: ${status})`;
        setError(errorMessage);

        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage || "An unexpected error occurred while saving Plan.";
      setError(errorMessage);

      return false;
    } finally {
      setLoading(false);
    }
  };


  const getAllPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (isPaginated) params.append("isPaginated", "true");
      if (offset) params.append("offset", offset.toString());
      if (isPaginated && itemsPerPage)
        params.append("itemsPerPage", itemsPerPage.toString());

      if (searchTerm) params.append("searchTerm", searchTerm);
      const url = `${endpoints.plan.getPlans}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      if (isPaginated) {
        const { response, status, errorLogs } =
          await fetchData<PlanApiResponse>(url, "get");
        if (status === 200 && response && response?.success) {
          setPlans(response.data);
          setPageInfo(response.page);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch Clause  (Status: ${status})`;
          setError(errorMessage);
          setPlans([]);
          setPageInfo(null);
        }
      } else {
        const { response, status, errorLogs } = await fetchData<
          ApiResponse<Plan>
        >(url, "get");
        if (status === 200 && response && response.success) {
          setPlans(response.data);
        } else {
          const errorMessage =
            errorLogs?.message ||
            response?.message ||
            `Failed to fetch Clause (Status: ${status})`;
          setError(errorMessage);
          setPlans([]);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        "An unexpected error occurred while fetching Clause.";
      setError(errorMessage);
      setPlans([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllPlans();
  }, [isPaginated, offset, itemsPerPage, searchTerm]);

  const deletePlan = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.plan.delete(id);
      const { response, status, errorLogs } = await fetchData<
        ApiResponse<null>
      >(url, "delete");
      if (status === 200 && response?.success) {
        // Eliminar el producto de la lista local
        setPlans((prev) => prev.filter((p) => p.id !== id));
        return true;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to delete Plan with ID ${id} (Status: ${status})`;
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        `An unexpected error occurred while deleting Plan with ID ${id}.`;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const getPlanById = async (id: number): Promise<Plan | null> => {
    console.log("deberia funcionar.");
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.plan.getById(id);
      console.log("Soy url:", url);
      const { response, status, errorLogs } = await fetchData<
        ApiResponse<Plan>
      >(url, "get");
      console.log("Respuesta completa: ", response);

      if (status === 200 && response?.success) {
        const plan = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setPlanId(plan);
        return plan;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to fetch Plan with ID ${id} (Status: ${status})`;

        setError(errorMessage);
        setPlanId(null);
        return null;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        `An unexpected error occurred while fetching Plan with ID ${id}.`;

      setError(errorMessage);
      setPlanId(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return {
    plans,
    getAllPlans,
    loading,
    deletePlan,
    getPlanById,savePlan
  };
};
