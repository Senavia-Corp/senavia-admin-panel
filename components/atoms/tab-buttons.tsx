interface TabButtonsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabButtons({ tabs, activeTab, onTabChange }: TabButtonsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-3 py-1 rounded-full font-bold border-2 transition-colors text-[14px] h-8 ${
            activeTab === tab
              ? "bg-[#99CC33] text-white border-[#99CC33]"
              : "bg-transparent text-[#99CC33] border-[#99CC33]"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
