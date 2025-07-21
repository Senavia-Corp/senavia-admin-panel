"use client";

import { Button } from "@/components/ui/button";

interface SectionTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SectionTabs({
  tabs,
  activeTab,
  onTabChange,
}: SectionTabsProps) {
  return (
    <div className="flex space-x-1 bg-[#EBEDF2] rounded-[16px] p-[9px]">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "default" : "ghost"}
          className={`rounded-[6px] px-8 text-[14px] font-bold leading-[100%] tracking-normal text-center font-inter flex items-center justify-center  ${
            activeTab === tab
              ? "bg-[#D3E8A9] text-black hover:bg-[#D3E8A9]"
              : "text-black hover:bg-[#D3E8A9]"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}
