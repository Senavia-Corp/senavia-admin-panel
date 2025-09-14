import { useEffect, useState } from "react";
import { endpoints, useFetch } from "@/lib/services/endpoints";

import { Service,ApiResponse, ServiceApiResponse } from "./service"; // tu interface Service

export interface ServiceViewModelParams {
  isPaginated?: boolean;
  offset?: number;
  itemsPerPage?: number;
}

export const ServiceViewModel = ({
  isPaginated = false,
  offset = 0,
  itemsPerPage = 10,
}: ServiceViewModelParams = {}) => {
  const { fetchData } = useFetch();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [serviceId, setServiceId] = useState<Service | null>(null);

  useEffect(() => {
    getAllServices();
  }, [isPaginated, offset, itemsPerPage]);

  const getAllServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (isPaginated) params.append("isPaginated", "true");
      if (offset) params.append("offset", offset.toString());
      if (isPaginated && itemsPerPage)
        params.append("itemsPerPage", itemsPerPage.toString());

      const url = `${endpoints.service.getAll}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const { response, status, errorLogs } = await fetchData<
        ApiResponse<Service>
      >(url, "get");

      if (status === 200 && response?.success) {
        setServices(response.data);
        console.log("services: "+response.data)
        if ("page" in response) setPageInfo(response.page);
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to fetch Services (Status: ${status})`;
        setError(errorMessage);
        setServices([]);
        setPageInfo(null);
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        "An unexpected error occurred while fetching Services.";
      setError(errorMessage);
      setServices([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  };
/*
  const getServiceById = async (id: number): Promise<Service | null> => {
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.service.getById(id);
      const { response, status, errorLogs } = await fetchData<
        ApiResponse<Service>
      >(url, "get");

      if (status === 200 && response?.success) {
        const service = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setServiceId(service);
        return service;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to fetch Service with ID ${id} (Status: ${status})`;
        setError(errorMessage);
        setServiceId(null);
        return null;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        `An unexpected error occurred while fetching Service with ID ${id}.`;
      setError(errorMessage);
      setServiceId(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
*/
  /*const deleteService = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const url = endpoints.service.delete(id);
      const { response, status, errorLogs } = await fetchData<
        ApiResponse<null>
      >(url, "delete");

      if (status === 200 && response?.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        return true;
      } else {
        const errorMessage =
          errorLogs?.message ||
          response?.message ||
          `Failed to delete Service with ID ${id} (Status: ${status})`;
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.errorMessage ||
        `An unexpected error occurred while deleting Service with ID ${id}.`;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  */

  return {
    services,
    loading,
    error,
    pageInfo,
    serviceId,
    getAllServices,
    /*getServiceById,
    deleteService,*/
  };
};
export default ServiceViewModel;
