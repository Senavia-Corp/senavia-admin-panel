import type {
  Contract,
  CreateContractData,
  ContractStatus,
} from "@/types/contract-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

// Clause type from API response
type Clause = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

// Service returns API-shaped Contract directly (normalized to backend model)

export class ContractManagementService {
  static async getContracts(): Promise<Contract[]> {
    try {
      const response = await Axios.get(endpoints.contract.getAllContracts, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Error fetching contracts");
      }

      return response.data.data || [];
    } catch (error: any) {
      console.error("Error fetching contracts:", error);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please sign in again.");
      }
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch contracts. Please try again."
      );
    }
  }

  static async createContract(
    contractData: CreateContractData
  ): Promise<Contract> {
    // Not implemented against backend yet
    throw new Error("createContract not implemented against the backend yet.");
  }

  static async updateContract(
    id: string,
    updates: Partial<Contract>
  ): Promise<Contract | null> {
    // Not implemented against backend yet
    throw new Error("updateContract not implemented against the backend yet.");
  }

  static async deleteContract(id: string): Promise<boolean> {
    // Not implemented against backend yet
    throw new Error("deleteContract not implemented against the backend yet.");
  }

  static getContractStatuses(): ContractStatus[] {
    return ["DRAFT", "SENT", "SIGNED", "ACTIVE", "EXPIRED", "TERMINATED"];
  }

  static async getContractClauses(): Promise<Clause[]> {
    //Esto no deberia ir aqui deberia ir en el servicio de clauses
    //Ademas me permite traer las clauses sin estar logueado, revisar eso
    try {
      const response = await Axios.get(endpoints.clause.getClauses, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching clauses");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching clauses:", error);

      if (error.response?.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión nuevamente.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Error al obtener cláusulas. Por favor, intente nuevamente."
        );
      }
    }
  }
}
