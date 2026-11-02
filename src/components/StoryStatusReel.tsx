import React from "react";
import { 
  Flame, 
  Zap, 
  Gift, 
  Mic, 
  BookOpen, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { BigTechEcosystem } from "../utils/ecosystemTheme";
import { LectureItem } from "../types";
import { triggerHaptic } from "../utils/haptics";

interface StoryStatusReelProps {
  ecosystem: BigTechEcosystem;
  lectures: LectureItem[];
  completedTodayCount: number;
  totalScheduledToday: number;
  onOpenQuickPay: () => void;
  onOpenRewards: () => void;
  onOpenVoiceMemo: () => void;
  onFilterSubject: (subject: string) => void;
  onOpenTodayCockpit: () => void;
  activeSubjectFilter?: string | null;
}

export const StoryStatusReel: React.FC<StoryStatusReelProps> = ({
  ecosystem,
  lectures,
  completedTodayCount,
  totalScheduledToday,
  onOpenQuickPay,
  onOpenRewards,
  onOpenVoiceMemo,
  onFilterSubject,
  onOpenTodayCockpit,
  activeSubjectFilter,
}) => {
  // Extract distinct subjects with counts of active lectures
  const subjectsMap: Record<string, number> = {};
  lectures.forEach((l) => {
    if (l.status !== "archived") {
      subjectsMap[l.subject] = (subjectsMap[l.subject] || 0) + 1;
    }
  });

  const subjectEntries = Object.entries(subjectsMap).slice(0, 8);

  const getRingColor = () => {
    switch (ecosystem) {
      case "whatsapp_meta":
        return "p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-[#25d366] to-teal-400";
      case "instagram_creator":
        return "p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600";
      case "gpay_fintech":
        return "p-0.5 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400";
      case "linear_obsidian":
        return "p-0.5 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-600 to-cyan-400";
      case "duolingo_arena":
        return "p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-[#58cc02] to-amber-400";
      case "google_workspace":
        return "p-0.5 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500";
      default:
        return "p-0.5 rounded-full bg-gradient-to-tr from-stone-900 via-stone-700 to-stone-500";
    }
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-md border-b border-stone-200/70 py-2 sm:py-2.5 px-3 sm:px-4 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center space-x-3 sm:space-x-4">
        
        {/* Story 1: Today's Quota (WhatsApp / Insta Status Ring) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            onOpenTodayCockpit();
          }}
          className="flex flex-col items-center shrink-0 cursor-pointer group select-none active:scale-95 transition-transform"
        >
          <div className={`${getRingColor()} shadow-xs group-hover:scale-105 transition-transform`}>
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-amber-50 text-amber-950 flex flex-col items-center justify-center relative overflow-hidden">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="text-[10px] font-black leading-none mt-0.5">
                  {completedTodayCount}/{totalScheduledToday}
                </span>
              </div>
            </div>
          </div>
          <span className="text-[10.5px] font-bold text-stone-800 mt-1 truncate max-w-[62px]">
            आज का कोटा
          </span>
        </button>

        {/* Story 2: GPay 1-Tap Fast Pay */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            onOpenQuickPay();
          }}
          className="flex flex-col items-center shrink-0 cursor-pointer group select-none active:scale-95 transition-transform"
        >
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-emerald-400 shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-blue-600 text-white flex flex-col items-center justify-center">
                <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
              </div>
            </div>
          </div>
          <span className="text-[10.5px] font-extrabold text-blue-900 mt-1 truncate max-w-[62px]">
            1-टैप UPI
          </span>
        </button>

        {/* Story 3: Rewards / Scratch Card */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            onOpenRewards();
          }}
          className="flex flex-col items-center shrink-0 cursor-pointer group select-none active:scale-95 transition-transform"
        >
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-amber-400 text-stone-950 flex flex-col items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
            </div>
          </div>
          <span className="text-[10.5px] font-bold text-amber-900 mt-1 truncate max-w-[62px]">
            रिवॉर्ड्स
          </span>
        </button>

        {/* Story 4: WhatsApp Audio Memo */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            onOpenVoiceMemo();
          }}
          className="flex flex-col items-center shrink-0 cursor-pointer group select-none active:scale-95 transition-transform"
        >
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#128c7e] via-[#25d366] to-emerald-400 shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#128c7e] text-white flex flex-col items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
            </div>
          </div>
          <span className="text-[10.5px] font-bold text-emerald-900 mt-1 truncate max-w-[62px]">
            वॉइस मेमो
          </span>
        </button>

        <div className="h-8 w-px bg-stone-200 shrink-0 mx-1" />

        {/* Subject Filter Stories */}
        {subjectEntries.map(([subj, count]) => {
          const isActive = activeSubjectFilter === subj;
          return (
            <button
              key={subj}
              type="button"
              onClick={() => {
                triggerHaptic(6);
                onFilterSubject(subj);
              }}
              className="flex flex-col items-center shrink-0 cursor-pointer group select-none active:scale-95 transition-transform"
            >
              <div className={`p-0.5 rounded-full transition-all ${
                isActive 
                  ? "bg-stone-950 ring-2 ring-amber-400" 
                  : "bg-stone-200 group-hover:bg-stone-300"
              }`}>
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 flex items-center justify-center">
                  <div className={`w-full h-full rounded-full flex flex-col items-center justify-center px-1 text-center ${
                    isActive ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-800"
                  }`}>
                    <span className="text-[10px] font-black leading-tight line-clamp-1">
                      {subj.split("-")[0].substring(0, 5)}
                    </span>
                    <span className="text-[9px] font-bold opacity-80">
                      {count}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] mt-1 truncate max-w-[65px] ${
                isActive ? "font-black text-stone-950" : "font-medium text-stone-600"
              }`}>
                {subj.split("-")[0]}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};
