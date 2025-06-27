import type { Contract, CreateContractData, ContractStatus } from "@/types/contract-management"

// Mock data
const mockContracts: Contract[] = [
  {
    id: "0001",
    title: "Website Development Contract",
    clientName: "Acme Corporation",
    status: "Signed",
    totalValue: 15000,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    title: "E-commerce Platform Contract",
    clientName: "Tech Solutions Inc",
    status: "Not Signed",
    totalValue: 25000,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    title: "Mobile App Development",
    clientName: "StartupXYZ",
    status: "Signed",
    totalValue: 18000,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    title: "Digital Marketing Campaign",
    clientName: "Local Business",
    status: "Not Signed",
    totalValue: 8000,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
]

export class ContractManagementService {
  static async getContracts(search?: string, statusFilter?: string): Promise<Contract[]> {
    let filteredContracts = [...mockContracts]

    if (search) {
      filteredContracts = filteredContracts.filter(
        (contract) =>
          contract.title.toLowerCase().includes(search.toLowerCase()) ||
          contract.clientName.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (statusFilter && statusFilter !== "all") {
      filteredContracts = filteredContracts.filter((contract) => contract.status === statusFilter)
    }

    return filteredContracts
  }

  static async getContractById(id: string): Promise<Contract | null> {
    return mockContracts.find((contract) => contract.id === id) || null
  }

  static async createContract(contractData: CreateContractData): Promise<Contract> {
    const newContract: Contract = {
      id: (mockContracts.length + 1).toString().padStart(4, "0"),
      title: contractData.title,
      clientName: contractData.clientName,
      status: contractData.status,
      totalValue: contractData.totalValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockContracts.push(newContract)
    return newContract
  }

  static async updateContract(id: string, updates: Partial<Contract>): Promise<Contract | null> {
    const contractIndex = mockContracts.findIndex((contract) => contract.id === id)
    if (contractIndex === -1) return null

    mockContracts[contractIndex] = { ...mockContracts[contractIndex], ...updates, updatedAt: new Date() }
    return mockContracts[contractIndex]
  }

  static async deleteContract(id: string): Promise<boolean> {
    const contractIndex = mockContracts.findIndex((contract) => contract.id === id)
    if (contractIndex === -1) return false

    mockContracts.splice(contractIndex, 1)
    return true
  }

  static getContractStatuses(): ContractStatus[] {
    return ["Signed", "Not Signed"]
  }
}
