import React, { useState, useMemo } from "react";
import { 
  CalendarDays, 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { CockpitConfig, DayForecast, LectureItem } from "../types";
import { generate30DayForecast, formatHindiDate } from "../utils/revisionEngine";
import { triggerHaptic } from "../utils/haptics";
import { InfoTip } from "./InfoTip";

interface HeatmapForecastProps {
  lectures: LectureItem[];
  config: CockpitConfig;
  onAutoLevel: () => void;
  onRescheduleLecture: (lectureId: string, newDate: string) => void;
}

export const HeatmapForecast: React.FC<HeatmapForecastProps> = ({
  lectures,
  config,
  onAutoLevel,
  onRescheduleLecture,
}) => {
  const forecast = useMemo(() => generate30DayForecast(lectures, config), [lectures, config]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(forecast[0]?.date || "");

  const selectedDay = useMemo(() => {
    return forecast.find((d) => d.date === selectedDateStr) || forecast[0];
  }, [forecast, selectedDateStr]);

  const selectedLectures = useMemo(() => {
    if (!selectedDay) return [];
    return lectures.filter((l) => selectedDay.lectureIds.includes(l.id));
  }, [lectures, selectedDay]);

  const totalUpcomingScheduled = useMemo(() => {
    return forecast.reduce((acc, curr) => acc + curr.count, 0);
  }, [forecast]);

  const overloadedDaysCount = useMemo(() => {
    return forecast.filter((d) => d.count > (config.dailyQuota || 5)).length;
  }, [forecast, config.dailyQuota]);

  const getDayStatusStyle = (count: number, quota: number) => {
    if (count === 0) {
      return "bg-stone-100 text-stone-400 border-stone-200/60";
    }
    if (count <= Math.ceil(quota * 0.7)) {
      return "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold";
    }
    if (count <= quota) {
      return "bg-amber-100 text-amber-900 border-amber-400 font-extrabold";
    }
    return "bg-rose-100 text-rose-950 border-rose-400 font-black";
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* 1. OVERVIEW & AUTO-LEVEL BANNER */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              आने वाले 30 दिन का भार
            </h2>
            <InfoTip
              title="30-दिन रिवीज़न कैलेंडर"
              content="स्पैस्ड रिपीटिशन के अनुसार अगले 30 दिनों में किस दिन कितने लेक्चर्स का रिवीज़न होना है, उसका यह स्पष्ट कैलेंडर है। यदि किसी दिन बहुत ज्यादा भार हो तो 'लोड संतुलित करें' दबाकर उसे आगे-पीछे कर सकते हैं।"
            />
          </div>
          <p className="text-xs text-stone-500">
            कुल {totalUpcomingScheduled} रिवीज़न शेड्यूल हैं • दैनिक कोटा: {config.dailyQuota || 5} लेक्चर
          </p>
        </div>

        {/* Auto-level Balance Action Button */}
        {overloadedDaysCount > 0 && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic(8);
              onAutoLevel();
            }}
            className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>लोड संतुलित करें ({overloadedDaysCount} दिन भारी)</span>
          </button>
        )}
      </section>

      {/* 2. 30-DAY INTERACTIVE CALENDAR GRID */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-700">
          <span>तारीख चुनें (किसी भी दिन टैप करें):</span>
          {/* Legend */}
          <div className="flex items-center gap-2 text-[10px] text-stone-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-stone-100 border border-stone-300" /> 0
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-400" /> 1-3
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-200 border border-amber-400" /> 4-5
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-200 border border-rose-400" /> &gt;5
            </span>
          </div>
        </div>

        {/* Calendar 30-day Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 sm:gap-2">
          {forecast.map((day) => {
            const isSelected = selectedDay?.date === day.date;
            const quota = config.dailyQuota || 5;

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => {
                  triggerHaptic(6);
                  setSelectedDateStr(day.date);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center justify-between min-h-[58px] transition-all cursor-pointer relative select-none ${
                  isSelected
                    ? "ring-2 ring-stone-950 ring-offset-2 scale-105 shadow-xs z-10"
                    : "hover:scale-102"
                } ${getDayStatusStyle(day.count, quota)}`}
              >
                <span className="text-[10px] opacity-80 leading-none">
                  {day.dayOfWeek}
                </span>
                <span className="text-xs font-black">
                  {day.date.split("-")[2]}
                </span>
                <span className="text-[10px] font-bold">
                  {day.count} कार्य
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. SELECTED DAY REVISION DETAILS (What is scheduled on this day) */}
      {selectedDay && (
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-amber-600" />
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                  {formatHindiDate(selectedDay.date)} ({selectedDay.dayOfWeek})
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedLectures.length} लेक्चर्स का रिवीज़न नियत है
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-black">
              {selectedLectures.length} कार्य
            </span>
          </div>

          {selectedLectures.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400">
              इस दिन के लिए कोई रिवीज़न शेड्यूल नहीं है।
            </div>
          ) : (
            <div className="space-y-2">
              {selectedLectures.map((lec) => (
                <div
                  key={lec.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 font-bold text-[10.5px]">
                        {lec.subject}
                      </span>
                      <span className="text-stone-400 truncate max-w-[150px]">
                        {lec.chapter}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 mt-1 truncate">
                      {lec.title}
                    </h4>
                  </div>

                  <span className="text-[11px] font-bold text-stone-500 shrink-0">
                    रिवीज़न #{lec.revisionCount || 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
