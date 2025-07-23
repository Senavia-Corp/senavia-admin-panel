"use client";

import { MetricCard } from "@/components/atoms/metric-card";
import { RecentItemsSlider } from "@/components/molecules/recent-items-slider";
import { ChartSection } from "@/components/molecules/chart-section";
import { WeeklyCalendar } from "@/components/molecules/weekly-calendar";
import type {
  Project,
  DashboardMetrics,
  WeeklyActivity,
} from "@/types/dashboard";

interface ProjectsSectionProps {
  metrics: DashboardMetrics["projects"];
  recentProjects: Project[];
  weeklyActivities: WeeklyActivity[];
}

export function ProjectsSection({
  metrics,
  recentProjects,
  weeklyActivities,
}: ProjectsSectionProps) {
  const chartData = [
    { name: "May", value: 8 },
    { name: "June", value: 12 },
    { name: "July", value: 6 },
    { name: "August", value: 15 },
  ];

  const statusData = [
    { name: "Analysis", value: metrics.analysis },
    { name: "Design", value: metrics.design },
    { name: "Development", value: metrics.development },
    { name: "Deploy", value: metrics.deploy },
  ];

  const recentItemsData = recentProjects.map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    subtitle: project.createdAt.toLocaleDateString(),
  }));

  return (
    <div className="space-y-8">
      {/* Metrics Cards - Two rows layout */}
      <div className="space-y-4">
        {/* First row - Total Projects card spanning full width */}
        <div className="w-full">
          <MetricCard
            title="Total Projects"
            value={metrics.total}
            percentageChange={metrics.percentageChange}
            variant="success"
          />
        </div>

        {/* Second row - 4 phase cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Analysis Phase"
            value={metrics.analysis}
            percentageChange={0}
            variant="default"
            className="bg-[#A9D943] text-black"
          />
          <MetricCard
            title="Design Phase"
            value={metrics.design}
            percentageChange={0}
            variant="default"
            className="bg-[#A9D943] text-black"
          />
          <MetricCard
            title="Development Phase"
            value={metrics.development}
            percentageChange={0}
            variant="default"
            className="bg-[#A9D943] text-black"
          />
          <MetricCard
            title="Deploy Phase"
            value={metrics.deploy}
            percentageChange={0}
            variant="default"
            className="bg-[#A9D943] text-black"
          />
        </div>
      </div>

      {/* Recent Projects - Full width first row */}
      <div className="w-full">
        <RecentItemsSlider title="Recent Projects" items={recentItemsData} />
      </div>

      {/* Weekly Calendar - Full width second row */}
      <div className="w-full">
        <WeeklyCalendar activities={weeklyActivities} />
      </div>

      {/* Charts - Better layout for wider screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="w-full">
          <ChartSection
            title="Total Projects"
            data={chartData}
            type="bar"
            barColors={["#0B114B", "#A7D941"]}
            barRadius={5}
            hideYAxisTicks={true}
            hideGrid={true}
            customCardClassName="bg-[#EFF1F7] rounded-2xl  border-0 shadow-none"
            customTitleClassName="text-xl font-semibold text-[#0D1440]"
            barSize={28}
            barCategoryGap={60}
            customContentClassName="p-0 pb-4 "
          />
        </div>

        <div className="w-full">
          <ChartSection
            title="Project Status Distribution"
            data={statusData}
            type="pie"
            customCardClassName="bg-[#EFF1F7] rounded-2xl border-0 shadow-none"
            customTitleClassName="text-xl font-semibold text-[#0D1440]"
            customContentClassName="p-0 pb-16 pt-8 md:pb-4 md:pt-0"
            pieColors={["#0B114B", "#A7D941", "#0B114B", "#32D9C8"]}
          />
        </div>
      </div>
    </div>
  );
}
