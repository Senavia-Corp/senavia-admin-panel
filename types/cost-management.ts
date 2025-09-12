export interface Cost {
    id: number
    name: string
    description: string
    type: string
    value: number
    estimateId: number
    createdAt: string
    updatedAt: string
  }

  export interface CreateCostData {
    name: string
    description: string 
    type: string
    value: number
    estimateId: number
  }