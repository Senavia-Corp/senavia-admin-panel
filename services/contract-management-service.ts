import type {
  Contract,
  CreateContractData,
  ContractStatus,
  ContractClause,
} from "@/types/contract-management";
import Axios from "axios";
import { endpoints } from "@/lib/services/endpoints";

// Mock data
const mockContracts: Contract[] = [
  {
    id: "0001",
    title: "Website Development Contract",
    content: "This contract covers the development of a corporate website...",
    status: "SIGNED",
    clauses: [
      {
        id: 1,
        title: "Ver usuarios normales",
        description: "Permite acceder a la lista de usuarios normales.",
      },
      {
        id: 2,
        title: "Crear usuarios administrativos",
        description:
          "Habilita la creación de usuarios con permisos administrativos.",
      },
    ],
    deadlineToSign: "2024-02-15",
    //userId: 1,
    leadId: 1,
    clientEmail: "contact@acme.com",
    clientAddress: "123 Business St, City, State",
    clientPhone: "+1-555-0123",
    ownerName: "Sebastian Navia",
    ownerSignDate: "2024-01-15",
    clientName: "Acme Corporation",
    clientSignDate: "2024-01-20",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    title: "E-commerce Platform Contract",
    content:
      "This contract covers the development of an e-commerce platform...",
    status: "DRAFT",
    clauses: [
      {
        id: 3,
        title: "Gestionar proyectos",
        description: "Permite crear, editar y eliminar proyectos.",
      },
    ],
    deadlineToSign: "2024-02-20",
    userId: 2,
    leadId: 2,
    clientEmail: "info@techsolutions.com",
    clientAddress: "456 Tech Ave, City, State",
    clientPhone: "+1-555-0456",
    ownerName: "Sebastian Navia",
    ownerSignDate: "",
    clientName: "Tech Solutions Inc",
    clientSignDate: "",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
];

export class ContractManagementService {
  static async getContracts(
    search?: string,
    statusFilter?: string
  ): Promise<Contract[]> {
    let filteredContracts = [...mockContracts];

    if (search) {
      filteredContracts = filteredContracts.filter(
        (contract) =>
          contract.title.toLowerCase().includes(search.toLowerCase()) ||
          contract.clientName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filteredContracts = filteredContracts.filter(
        (contract) => contract.status === statusFilter
      );
    }

    return filteredContracts;
  }

  static async getContractById(id: string): Promise<Contract | null> {
    return mockContracts.find((contract) => contract.id === id) || null;
  }

  static async createContract(
    contractData: CreateContractData
  ): Promise<Contract> {
    // Get clauses from the API to match clause IDs with actual clause objects
    const allClauses = await this.getContractClauses();
    const selectedClauses = contractData.clauses
      .map((clauseId) => allClauses.find((clause) => clause.id === clauseId))
      .filter(Boolean) as ContractClause[];

    const newContract: Contract = {
      id: (mockContracts.length + 1).toString().padStart(4, "0"),
      title: contractData.title,
      content: contractData.content,
      status: contractData.status,
      clauses: selectedClauses,
      deadlineToSign: contractData.deadlineToSign,
      userId: contractData.userId,
      leadId: contractData.leadId,
      clientEmail: contractData.clientEmail,
      clientAddress: contractData.clientAddress,
      clientPhone: contractData.clientPhone,
      ownerName: contractData.ownerName,
      ownerSignDate: contractData.ownerSignDate,
      clientName: contractData.clientName,
      clientSignDate: contractData.clientSignDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockContracts.push(newContract);
    return newContract;
  }

  static async updateContract(
    id: string,
    updates: Partial<Contract>
  ): Promise<Contract | null> {
    const contractIndex = mockContracts.findIndex(
      (contract) => contract.id === id
    );
    if (contractIndex === -1) return null;

    mockContracts[contractIndex] = {
      ...mockContracts[contractIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return mockContracts[contractIndex];
  }

  static async deleteContract(id: string): Promise<boolean> {
    const contractIndex = mockContracts.findIndex(
      (contract) => contract.id === id
    );
    if (contractIndex === -1) return false;

    mockContracts.splice(contractIndex, 1);
    return true;
  }

  static getContractStatuses(): ContractStatus[] {
    return ["DRAFT", "SENT", "SIGNED", "ACTIVE", "EXPIRED", "TERMINATED"];
  }

  static async getContractClauses(): Promise<ContractClause[]> {
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
