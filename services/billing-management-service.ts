import type { BillingRecord, CreateBillingData, BillingStatus } from "@/types/billing-management"

// Mock data
const mockBillingRecords: BillingRecord[] = [
  {
    id: "0001",
    estimatedTime: 6,
    status: "Invoice",
    totalValue: 15000,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "0002",
    estimatedTime: 12,
    status: "Processing",
    totalValue: 25000,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "0003",
    estimatedTime: 8,
    status: "Accepted",
    totalValue: 18000,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "0004",
    estimatedTime: 3,
    status: "InReview",
    totalValue: 8000,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "0005",
    estimatedTime: 9,
    status: "Paid",
    totalValue: 22000,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21"),
  },
]

export class BillingManagementService {
  static async getBillingRecords(search?: string, statusFilter?: string): Promise<BillingRecord[]> {
    let filteredRecords = [...mockBillingRecords]

    if (search) {
      filteredRecords = filteredRecords.filter(
        (record) =>
          record.id.toLowerCase().includes(search.toLowerCase()) ||
          record.status.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (statusFilter && statusFilter !== "all") {
      filteredRecords = filteredRecords.filter((record) => record.status === statusFilter)
    }

    return filteredRecords
  }

  static async getBillingRecordById(id: string): Promise<BillingRecord | null> {
    return mockBillingRecords.find((record) => record.id === id) || null
  }

  static async createBillingRecord(recordData: CreateBillingData): Promise<BillingRecord> {
    const newRecord: BillingRecord = {
      id: (mockBillingRecords.length + 1).toString().padStart(4, "0"),
      estimatedTime: recordData.estimatedTime,
      status: recordData.status,
      totalValue: recordData.totalValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockBillingRecords.push(newRecord)
    return newRecord
  }

  static async updateBillingRecord(id: string, updates: Partial<BillingRecord>): Promise<BillingRecord | null> {
    const recordIndex = mockBillingRecords.findIndex((record) => record.id === id)
    if (recordIndex === -1) return null

    mockBillingRecords[recordIndex] = { ...mockBillingRecords[recordIndex], ...updates, updatedAt: new Date() }
    return mockBillingRecords[recordIndex]
  }

  static async deleteBillingRecord(id: string): Promise<boolean> {
    const recordIndex = mockBillingRecords.findIndex((record) => record.id === id)
    if (recordIndex === -1) return false

    mockBillingRecords.splice(recordIndex, 1)
    return true
  }

  static getBillingStatuses(): BillingStatus[] {
    return ["Created", "Processing", "InReview", "Rejected", "Accepted", "Invoice", "Paid"]
  }
}
