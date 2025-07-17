"use client"

import { Button } from "@/components/ui/button"

interface SectionTabsProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SectionTabs({ tabs, activeTab, onTabChange }: SectionTabsProps) {
  return (
    <div className="flex space-x-1 bg-[#F0F0F2] rounded-lg p-1">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "default" : "ghost"}
          className={`rounded-md px-8 py-2 text-sm font-medium  ${
            activeTab === tab ? "bg-[#E5F2B3] text-[#35400C] hover:bg-[#E5F2B3]" : "text-[#35400C] hover:bg-[#E5F2B3]"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  )
}
