"use client";

import { MetricCard } from "@/components/atoms/metric-card";
import { RecentItemsSlider } from "@/components/molecules/recent-items-slider";
import { ChartSection } from "@/components/molecules/chart-section";
import type { Bill, DashboardMetrics } from "@/types/dashboard";

interface BillsSectionProps {
  metrics: DashboardMetrics["bills"];
  recentBills: Bill[];
}

export function BillsSection({ metrics, recentBills }: BillsSectionProps) {
  const billsChartData = [
    { name: "May", value: 8 },
    { name: "June", value: 15 },
    { name: "July", value: 10 },
    { name: "August", value: 18 },
  ];

  const invoicesChartData = [
    { name: "May", value: 5 },
    { name: "June", value: 12 },
    { name: "July", value: 8 },
    { name: "August", value: 15 },
  ];

  const statusData = [
    { name: "Send", value: 25 },
    { name: "Processing", value: 20 },
    { name: "Estimated", value: 30 },
    { name: "Finished", value: 25 },
  ];

  const recentItemsData = recentBills.map((bill) => ({
    id: bill.id,
    name: bill.name,
    status: bill.serviceType,
    subtitle: bill.dueDate.toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Bills"
          value={metrics.total}
          percentageChange={metrics.percentageChange}
          variant="success"
        />
        <MetricCard
          title="In Review"
          value={metrics.estimates}
          percentageChange={metrics.percentageChange}
          variant="success"
        />
        <MetricCard
          title="Total Invoices"
          value={metrics.invoices}
          variant="success"
        />
      </div>

      <RecentItemsSlider title="Section Title" items={recentItemsData} />

      {/* Charts - Better layout for wider screens */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="w-full">
          <ChartSection
            title="Total Bills"
            data={billsChartData}
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
            title="Total Invoices"
            data={invoicesChartData}
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
            title="Bills Status Distribution"
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
