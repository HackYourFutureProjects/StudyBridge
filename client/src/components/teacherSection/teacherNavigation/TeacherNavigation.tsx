import { useState } from "react";

type TabType = "about" | "subjects" | "schedule";

interface TeacherNavigationProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const TeacherNavigation = ({
  activeTab: externalActiveTab,
  onTabChange,
}: TeacherNavigationProps) => {
  const [internalActiveTab, setInternalActiveTab] =
    useState<TabType>("subjects");

  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  const tabs = [
    { id: "subjects", label: "Subjects" },
    { id: "about", label: "About tutor" },
    { id: "schedule", label: "Schedule" },
  ] as const;

  return (
    <nav className="flex justify-center items-center p-2 border border-white/15 rounded-full max-w-[1139px] mx-auto overflow-x-auto scrollbar-hide">
      <div className="flex gap-1 sm:gap-2 min-w-max px-2 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 sm:px-6 lg:px-10 py-2 sm:py-3 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
              activeTab === tab.id
                ? "text-[#BC7DBF]"
                : "text-white/70 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
