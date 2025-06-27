import type {
  Lead,
  Bill,
  Project,
  DashboardMetrics,
  TimeFilter,
  CalendarEvent,
  WeeklyActivity,
} from "@/types/dashboard"

// Mock data for demonstration
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Website Redesign",
    clientName: "Acme Corp",
    status: "Processing",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "E-commerce Platform",
    clientName: "Tech Solutions",
    status: "Estimating",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
]

const mockBills: Bill[] = [
  {
    id: "1",
    name: "Website Development",
    serviceType: "Web Development",
    status: "Invoice",
    amount: 5000,
    dueDate: new Date("2024-02-15"),
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "SEO Campaign",
    serviceType: "Digital Marketing",
    status: "InReview",
    amount: 2500,
    dueDate: new Date("2024-02-20"),
    createdAt: new Date("2024-01-10"),
  },
]

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Senavia Corp Re-Design",
    status: "Development",
    createdAt: new Date("2024-01-01"),
    dueDate: new Date("2024-03-01"),
  },
  {
    id: "2",
    name: "Client Portal",
    status: "Design",
    createdAt: new Date("2024-01-15"),
    dueDate: new Date("2024-04-01"),
  },
]

export class DashboardService {
  static async getMetrics(timeFilter: TimeFilter): Promise<DashboardMetrics> {
    // In a real application, this would fetch from an API
    return {
      leads: {
        total: 24,
        engaged: 8,
        inProgress: 6,
        percentageChange: 12.5,
      },
      bills: {
        total: 18,
        estimates: 5,
        invoices: 13,
        percentageChange: 8.3,
      },
      projects: {
        total: 15,
        analysis: 3,
        design: 4,
        development: 6,
        deploy: 2,
        percentageChange: 15.2,
      },
    }
  }

  static async getRecentLeads(limit = 6): Promise<Lead[]> {
    return mockLeads.slice(0, limit)
  }

  static async getRecentBills(limit = 6): Promise<Bill[]> {
    return mockBills.slice(0, limit)
  }

  static async getRecentProjects(limit = 6): Promise<Project[]> {
    return mockProjects.slice(0, limit)
  }

  static async getCalendarEvents(): Promise<CalendarEvent[]> {
    return [
      {
        id: "1",
        title: "Client Proposal Review - GQM",
        date: new Date("2024-01-22"),
        time: "4pm",
        type: "meeting",
      },
      {
        id: "2",
        title: "Senavia Corp Re-design Design Review",
        date: new Date("2024-01-23"),
        time: "10am",
        type: "review",
      },
    ]
  }

  static async getWeeklyActivities(): Promise<WeeklyActivity[]> {
    return [
      {
        id: "1",
        projectName: "Project Name - Duedate",
        date: new Date("2024-01-24"),
        duration: 4,
      },
    ]
  }
}
