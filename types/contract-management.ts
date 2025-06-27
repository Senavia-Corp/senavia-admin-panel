export interface Contract {
  id: string
  title: string
  clientName: string
  status: ContractStatus
  totalValue: number
  createdAt: Date
  updatedAt: Date
}

export type ContractStatus = "Signed" | "Not Signed"

export interface CreateContractData {
  title: string
  clientName: string
  status: ContractStatus
  totalValue: number
}
