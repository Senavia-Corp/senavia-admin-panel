"use client"

import { Button } from "@/components/ui/button"

interface SectionTabsProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SectionTabs({ tabs, activeTab, onTabChange }: SectionTabsProps) {
  return (
    <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "default" : "ghost"}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            activeTab === tab ? "bg-green-500 text-white hover:bg-green-600" : "text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  )
}
