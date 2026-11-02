import React from "react";
import { Home, BookOpen, CalendarDays, Database, Menu } from "lucide-react";
import { triggerHaptic } from "../utils/haptics";
import { ActiveTab } from "./Navbar";

interface AppBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeTodayCount?: number;
  archivedCount?: number;
  hidden?: boolean;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeTodayCount = 0,
  archivedCount = 0,
  hidden = false,
}) => {
  if (hidden) return null;

  const navItems: Array<{
    id: ActiveTab;
    name: string;
    icon: (isActive: boolean) => React.ReactNode;
    badge?: number;
  }> = [
    {
      id: "home",
      name: "होम",
      icon: (isActive) => (
        <Home
          className={`w-5 h-5 shrink-0 transition-transform ${
            isActive ? "text-stone-950 stroke-[2.6] scale-110" : "text-stone-600 stroke-[2]"
          }`}
        />
      ),
    },
    {
      id: "cockpit",
      name: "रिवीज़न",
      icon: (isActive) => (
        <BookOpen
          className={`w-5 h-5 shrink-0 transition-transform ${
            isActive ? "text-stone-950 stroke-[2.6] scale-110" : "text-stone-600 stroke-[2]"
          }`}
        />
      ),
      badge: activeTodayCount > 0 ? activeTodayCount : undefined,
    },
    {
      id: "heatmap",
      name: "कैलेंडर",
      icon: (isActive) => (
        <CalendarDays
          className={`w-5 h-5 shrink-0 transition-transform ${
            isActive ? "text-stone-950 stroke-[2.6] scale-110" : "text-stone-600 stroke-[2]"
          }`}
        />
      ),
    },
    {
      id: "master_db",
      name: "डेटाबेस",
      icon: (isActive) => (
        <Database
          className={`w-5 h-5 shrink-0 transition-transform ${
            isActive ? "text-stone-950 stroke-[2.6] scale-110" : "text-stone-600 stroke-[2]"
          }`}
        />
      ),
    },
    {
      id: "more",
      name: "अधिक",
      icon: (isActive) => (
        <Menu
          className={`w-5 h-5 shrink-0 transition-transform ${
            isActive ? "text-stone-950 stroke-[2.6] scale-110" : "text-stone-600 stroke-[2]"
          }`}
        />
      ),
      badge: archivedCount > 0 ? archivedCount : undefined,
    },
  ];

  return (
    <nav
      aria-label="मुख्य नेविगेशन"
      className="fixed bottom-3 sm:bottom-4 inset-x-0 z-40 flex justify-center px-3 pointer-events-none transition-all duration-200"
    >
      <div className="pointer-events-auto inline-flex items-center gap-1 p-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-stone-900/5 max-w-full overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerHaptic(8);
                onSelectTab(item.id);
              }}
              title={item.name}
              aria-label={item.name}
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 relative select-none ${
                isActive
                  ? "bg-amber-500 text-stone-950 shadow-md font-black scale-105 ring-1 ring-amber-600/30"
                  : "text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:scale-95"
              }`}
            >
              {/* Icon */}
              {item.icon(isActive)}

              {/* Hindi Label: Mobile (<640px) hidden, Desktop (≥640px) visible */}
              <span className="hidden sm:inline-block text-xs font-bold leading-none select-none">
                {item.name}
              </span>

              {/* Badge for Today's revision / Backlog count */}
              {item.badge !== undefined && (
                <span
                  className={`text-[9.5px] px-1.5 min-w-[16px] h-4 rounded-full font-black flex items-center justify-center leading-none ${
                    isActive ? "bg-stone-950 text-amber-300" : "bg-rose-500 text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
