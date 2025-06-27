"use client"

import { MetricCard } from "@/components/atoms/metric-card"
import { RecentItemsSlider } from "@/components/molecules/recent-items-slider"
import { ChartSection } from "@/components/molecules/chart-section"
import type { Lead, DashboardMetrics } from "@/types/dashboard"

interface LeadsSectionProps {
  metrics: DashboardMetrics["leads"]
  recentLeads: Lead[]
}

export function LeadsSection({ metrics, recentLeads }: LeadsSectionProps) {
  const chartData = [
    { name: "May", value: 12 },
    { name: "June", value: 18 },
    { name: "July", value: 8 },
    { name: "August", value: 24 },
  ]

  const statusData = [
    { name: "Send", value: 40 },
    { name: "Processing", value: 30 },
    { name: "Estimated", value: 20 },
    { name: "Finished", value: 10 },
  ]

  const recentItemsData = recentLeads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    status: lead.status,
    subtitle: lead.clientName,
  }))

  return (
    <div className="space-y-8">
      {/* Metrics Cards - Full width with better spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Leads"
          value={metrics.total}
          percentageChange={metrics.percentageChange}
          variant="success"
        />
        <MetricCard
          title="Leads Engaged"
          value={metrics.engaged}
          percentageChange={metrics.percentageChange}
          variant="success"
        />
        <MetricCard
          title="Leads In Progress"
          value={metrics.inProgress}
          percentageChange={metrics.percentageChange}
          variant="success"
        />
      </div>

      {/* Recent Items - Expanded to show more items */}
      <div className="w-full">
        <RecentItemsSlider title="Recent Leads" items={recentItemsData} />
      </div>

      {/* Charts - Better layout for wider screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="w-full">
          <ChartSection title="Total Leads" data={chartData} type="bar" />
        </div>
        <div className="w-full">
          <ChartSection title="Leads Status Distribution" data={statusData} type="pie" />
        </div>
      </div>
    </div>
  )
}
