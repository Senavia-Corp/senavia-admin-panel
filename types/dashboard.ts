export interface Lead {
  id: string
  name: string
  clientName: string
  status: "Send" | "Processing" | "Estimating" | "Finished"
  createdAt: Date
  updatedAt: Date
}

export interface Bill {
  id: string
  name: string
  serviceType: "Web Design" | "Web Development" | "Digital Marketing"
  status: "Created" | "Processing" | "InReview" | "Rejected" | "Accepted" | "Invoice" | "Paid"
  amount: number
  dueDate: Date
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  status: "Analysis" | "Design" | "Development" | "Deploy"
  createdAt: Date
  dueDate: Date
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  type: "meeting" | "deadline" | "review"
}

export interface WeeklyActivity {
  id: string
  projectName: string
  date: Date
  duration: number
}

export type TimeFilter = "last3weeks" | "lastMonth" | "last3months" | "last6months"

export interface DashboardMetrics {
  leads: {
    total: number
    engaged: number
    inProgress: number
    percentageChange: number
  }
  bills: {
    total: number
    estimates: number
    invoices: number
    percentageChange: number
  }
  projects: {
    total: number
    analysis: number
    design: number
    development: number
    deploy: number
    percentageChange: number
  }
}
