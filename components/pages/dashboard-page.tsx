"use client";

import { useState, useEffect } from "react";
import { SectionTabs } from "@/components/atoms/section-tabs";
import { LeadsSection } from "@/components/organisms/leads-section";
import { BillsSection } from "@/components/organisms/bills-section";
import { ProjectsSection } from "@/components/organisms/projects-section";
import { CalendarSidebar } from "@/components/organisms/calendar-sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { DashboardService } from "@/services/dashboard-service";
import type {
  DashboardMetrics,
  Lead,
  Bill,
  Project,
  CalendarEvent,
  WeeklyActivity,
  TimeFilter,
} from "@/types/dashboard";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Leads");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("lastMonth");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [weeklyActivities, setWeeklyActivities] = useState<WeeklyActivity[]>(
    []
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          metricsData,
          leadsData,
          billsData,
          projectsData,
          eventsData,
          activitiesData,
        ] = await Promise.all([
          DashboardService.getMetrics(timeFilter),
          DashboardService.getRecentLeads(),
          DashboardService.getRecentBills(),
          DashboardService.getRecentProjects(),
          DashboardService.getCalendarEvents(),
          DashboardService.getWeeklyActivities(),
        ]);

        setMetrics(metricsData);
        setRecentLeads(leadsData);
        setRecentBills(billsData);
        setRecentProjects(projectsData);
        setCalendarEvents(eventsData);
        setWeeklyActivities(activitiesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadDashboardData();
  }, [timeFilter]);

  const tabs = ["Leads", "Bills", "Projects"];

  const renderActiveSection = () => {
    if (!metrics) return <div>Loading...</div>;

    switch (activeTab) {
      case "Leads":
        return (
          <LeadsSection metrics={metrics.leads} recentLeads={recentLeads} />
        );
      case "Bills":
        return (
          <BillsSection metrics={metrics.bills} recentBills={recentBills} />
        );
      case "Projects":
        return (
          <ProjectsSection
            metrics={metrics.projects}
            recentProjects={recentProjects}
            weeklyActivities={weeklyActivities}
          />
        );
      default:
        return (
          <LeadsSection metrics={metrics.leads} recentLeads={recentLeads} />
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <main
        className={`flex-1 overflow-auto
           transition-all duration-200 ${isCalendarOpen ? "mr-80" : "mr-0"}`}
      >
        <div className="p-6 space-y-6 max-w-full">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <SectionTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <Select
              value={timeFilter}
              onValueChange={(value: TimeFilter) => setTimeFilter(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last3weeks">Last 3 Weeks</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="last3months">Last 3 Months</SelectItem>
                <SelectItem value="last6months">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Section */}
          <div className="w-full">{renderActiveSection()}</div>
        </div>
      </main>

      {/* Calendar Sidebar */}
      <CalendarSidebar
        events={calendarEvents}
        isOpen={isCalendarOpen}
        onToggle={() => setIsCalendarOpen(!isCalendarOpen)}
      />
    </div>
  );
}
