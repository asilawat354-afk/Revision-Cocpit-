import React from "react";
import { ArrowLeft, Menu, Search, Plus, Sparkles, PauseCircle } from "lucide-react";
import { triggerHaptic } from "../utils/haptics";

interface AppHeaderProps {
  title: string;
  canGoBack: boolean;
  onGoBack?: () => void;
  onOpenDrawer?: () => void;
  onOpenSearch?: () => void;
  onOpenAddLecture?: () => void;
  onOpenGemini?: () => void;
  isVacationActive?: boolean;
  onToggleVacation?: () => void;
  streakCount?: number;
}

/**
 * Modern, Clean, Distraction-Free Header
 * - Sub-page: Prominent [←] Back button + Title + [🔍] Search
 * - Root Tab: [☰] Menu + Title + [🔍] Search + [+] Add quick action
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  canGoBack,
  onGoBack,
  onOpenDrawer,
  onOpenSearch,
  onOpenAddLecture,
  onOpenGemini,
  isVacationActive = false,
  onToggleVacation,
  streakCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-stone-200/80 shadow-2xs transition-all duration-200">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left Side: Back Button OR Menu + Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {canGoBack ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(6);
                onGoBack?.();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer shrink-0 font-bold text-xs sm:text-sm"
              aria-label="वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5 text-stone-900 stroke-[2.4]" />
              <span className="hidden sm:inline">वापस</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(6);
                onOpenDrawer?.();
              }}
              className="p-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="मेन्यू खोलें"
            >
              <Menu className="w-5 h-5 text-stone-900 stroke-[2.2]" />
            </button>
          )}

          {/* Title */}
          <div className="min-w-0 flex items-center gap-2 truncate">
            <h1 className="text-base sm:text-lg font-black text-stone-900 tracking-tight truncate select-none">
              {title}
            </h1>
            {!canGoBack && streakCount > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black shrink-0">
                🔥 {streakCount} दिन
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Vacation Mode Indicator */}
          {isVacationActive && onToggleVacation && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(6);
                onToggleVacation();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 animate-pulse cursor-pointer"
              title="छुट्टी मोड चालू है (बंद करने के लिए टैप करें)"
            >
              <PauseCircle className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">छुट्टी</span>
            </button>
          )}

          {/* Search Button (Always Available) */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(6);
                onOpenSearch();
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              aria-label="खोजें"
              title="खोजें (Ctrl+K)"
            >
              <Search className="w-4.5 h-4.5 stroke-[2.2]" />
              <span className="hidden sm:inline text-xs font-bold">खोजें</span>
            </button>
          )}

          {/* On Root Tabs: AI Doubt & Quick Add */}
          {!canGoBack && (
            <>
              {onOpenGemini && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(6);
                    onOpenGemini();
                  }}
                  className="p-2 rounded-xl text-amber-700 hover:text-amber-900 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
                  title="Gemini AI डाउट सॉल्वर"
                  aria-label="AI डाउट सॉल्वर"
                >
                  <Sparkles className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>
              )}

              {onOpenAddLecture && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(6);
                    onOpenAddLecture();
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                  aria-label="नया लेक्चर जोड़ें"
                >
                  <Plus className="w-4 h-4 stroke-[2.8]" />
                  <span className="hidden sm:inline">जोड़ें</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
