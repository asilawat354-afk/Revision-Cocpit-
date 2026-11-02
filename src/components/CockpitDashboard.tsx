import React, { useState, useMemo } from "react";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronRight, 
  Calendar, 
  AlertCircle, 
  Flame, 
  Check, 
  Filter,
  Plus,
  Minus,
  RotateCcw
} from "lucide-react";
import { LectureItem, CockpitConfig, DifficultyRating } from "../types";
import { getTodayStr, addDays } from "../utils/revisionEngine";
import { triggerHaptic } from "../utils/haptics";
import { InfoTip } from "./InfoTip";

interface CockpitDashboardProps {
  lectures: LectureItem[];
  config: CockpitConfig;
  onUpdateConfig: (newConfig: Partial<CockpitConfig>) => void;
  onStartRevision: (lecture: LectureItem) => void;
  onQuickComplete: (lectureId: string, rating: DifficultyRating, minutesSpent?: number) => void;
  onAskGemini: (lecture: LectureItem) => void;
  onOpenDebtModal: () => void;
  onToggleVacation: () => void;
  archivedDebtCount: number;
  onOpenCustomRevision: () => void;
  onViewTopicDetail: (lecture: LectureItem) => void;
}

export const CockpitDashboard: React.FC<CockpitDashboardProps> = ({
  lectures,
  config,
  onUpdateConfig,
  onStartRevision,
  onQuickComplete,
  onAskGemini,
  onOpenDebtModal,
  onToggleVacation,
  archivedDebtCount,
  onOpenCustomRevision,
  onViewTopicDetail,
}) => {
  const todayStr = useMemo(() => getTodayStr(), []);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [quickRatingLectureId, setQuickRatingLectureId] = useState<string | null>(null);

  // Active un-archived lectures
  const activeLectures = useMemo(() => {
    return lectures.filter((l) => l.status !== "archived");
  }, [lectures]);

  // Today's Due Lectures
  const todayDueLectures = useMemo(() => {
    return activeLectures
      .filter((l) => {
        if (l.status === "not_started" || l.status === "archived") return false;
        if (l.status === "completed" && l.lastRevisionDate === todayStr) {
          return false;
        }
        return (
          l.status === "due_today" ||
          (l.nextDueDate && l.nextDueDate <= todayStr)
        );
      })
      .sort((a, b) => {
        const aOverdue = a.nextDueDate < todayStr;
        const bOverdue = b.nextDueDate < todayStr;
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        return a.nextDueDate.localeCompare(b.nextDueDate);
      });
  }, [activeLectures, todayStr]);

  // Today's Completed Lectures
  const todayCompletedLectures = useMemo(() => {
    return activeLectures.filter(
      (l) => l.status === "completed" && l.lastRevisionDate === todayStr
    );
  }, [activeLectures, todayStr]);

  // Mastered count (revisionCount >= 4 or completed)
  const masteredCount = useMemo(() => {
    return activeLectures.filter((l) => l.revisionCount >= 4 || l.status === "completed").length;
  }, [activeLectures]);

  // Daily quota
  const currentQuota = config.dailyQuota || 5;

  const handleStepQuota = (delta: number) => {
    triggerHaptic(8);
    const next = Math.max(1, Math.min(20, currentQuota + delta));
    onUpdateConfig({ dailyQuota: next });
  };

  // Filtered queue
  const filteredQueue = useMemo(() => {
    if (selectedSubjectFilter === "all") return todayDueLectures;
    return todayDueLectures.filter((l) => l.subject === selectedSubjectFilter);
  }, [todayDueLectures, selectedSubjectFilter]);

  // Unique subjects with pending revisions
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    todayDueLectures.forEach((l) => subs.add(l.subject));
    return Array.from(subs);
  }, [todayDueLectures]);

  // Upcoming tomorrow & day after
  const tomorrowStr = useMemo(() => addDays(todayStr, 1), [todayStr]);
  const tomorrowCount = useMemo(() => {
    return activeLectures.filter((l) => l.nextDueDate === tomorrowStr && l.status !== "completed").length;
  }, [activeLectures, tomorrowStr]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* 1. DAILY REVISION GOAL CARD (Prominent Stepper + Contextual Info) */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight">
              दैनिक रिवीज़न लक्ष्य
            </h2>
            <InfoTip
              title="दैनिक रिवीज़न लक्ष्य"
              content="रोज़ केवल 5–8 लेक्चर्स का लक्ष्य रखें। इससे पढ़ाई का दबाव कम रहता है और निरंतरता बनी रहती है। आज का लक्ष्य पूरा होने पर शेष लेक्चर्स शांत कतार में सुरक्षित रहते हैं।"
            />
          </div>

          {/* Stepper [ − ] 5 लेक्चर [ + ] */}
          <div className="inline-flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200/80 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleStepQuota(-1)}
              disabled={currentQuota <= 1}
              className="w-8 h-8 rounded-xl bg-white disabled:opacity-40 text-stone-800 hover:text-stone-950 font-bold flex items-center justify-center shadow-2xs active:scale-90 transition-all cursor-pointer"
              aria-label="लक्ष्य कम करें"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>

            <span className="px-3.5 py-1 text-sm font-black text-amber-950 min-w-[90px] text-center select-none">
              {currentQuota} लेक्चर
            </span>

            <button
              type="button"
              onClick={() => handleStepQuota(1)}
              disabled={currentQuota >= 20}
              className="w-8 h-8 rounded-xl bg-white disabled:opacity-40 text-stone-800 hover:text-stone-950 font-bold flex items-center justify-center shadow-2xs active:scale-90 transition-all cursor-pointer"
              aria-label="लक्ष्य बढ़ाएं"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Progress Bar towards daily goal */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>आज की प्रगति</span>
            <span className="text-stone-900 font-extrabold">
              {todayCompletedLectures.length} / {currentQuota} पूर्ण
            </span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((todayCompletedLectures.length / currentQuota) * 100))}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. TODAY'S REVISION STATUS CARDS (3 Clean Tiles) */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Due Today */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-stone-500">आज बाकी</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-600">
              {todayDueLectures.length}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">कार्य</span>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-stone-500">आज पूर्ण</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">
              {todayCompletedLectures.length}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">लेक्चर</span>
          </div>
        </div>

        {/* Mastered */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-stone-500">कंठस्थ</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-indigo-600">
              {masteredCount}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">लेक्चर</span>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S REVISION ACTION QUEUE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              आज का रिवीज़न शेड्यूल
            </h3>
            {todayDueLectures.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                {filteredQueue.length}
              </span>
            )}
          </div>

          {/* Custom Revision Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              onOpenCustomRevision();
            }}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
          >
            + अतिरिक्त अभ्यास
          </button>
        </div>

        {/* Subject Filter Chips (If multiple subjects due) */}
        {availableSubjects.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedSubjectFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSubjectFilter === "all"
                  ? "bg-stone-900 text-white shadow-2xs"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              सभी विषय ({todayDueLectures.length})
            </button>
            {availableSubjects.map((sub) => {
              const count = todayDueLectures.filter((l) => l.subject === sub).length;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubjectFilter(sub)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedSubjectFilter === sub
                      ? "bg-amber-500 text-stone-950 font-black shadow-2xs"
                      : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {sub} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Queue Content List */}
        {filteredQueue.length === 0 ? (
          /* EMPTY STATE (Clean & Motivational) */
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>
            <div>
              <h4 className="text-base font-extrabold text-stone-900">
                शानदार! आज का रिवीज़न पूरा हो गया
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                आज के सभी नियत लेक्चर्स का रिवीज़न हो चुका है। आप नया विषय जोड़ सकते हैं या अतिरिक्त अभ्यास कर सकते हैं।
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={onOpenCustomRevision}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs transition-colors cursor-pointer shadow-xs"
              >
                अतिरिक्त अभ्यास चुनें
              </button>
            </div>
          </div>
        ) : (
          /* LIST OF LECTURE CARDS */
          <div className="space-y-2.5">
            {filteredQueue.map((lecture) => {
              const isOverdue = lecture.nextDueDate < todayStr;
              const isQuickOpen = quickRatingLectureId === lecture.id;

              return (
                <div
                  key={lecture.id}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 shadow-xs hover:border-amber-300 transition-all space-y-3"
                >
                  {/* Card Header: Subject Tag, Chapter, Title */}
                  <div
                    onClick={() => onViewTopicDetail(lecture)}
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-extrabold text-[11px]">
                        {lecture.subject}
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-500 font-medium truncate max-w-[200px]">
                        {lecture.chapter}
                      </span>
                      {isOverdue && (
                        <span className="ml-auto px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black">
                          अतिदेय (Overdue)
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors mt-1.5 leading-snug">
                      {lecture.title}
                    </h4>

                    {/* Progress & Rating metadata */}
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-500 font-medium">
                      <span>रिवीज़न संख्या: #{lecture.revisionCount || 0}</span>
                      {lecture.lastRating && (
                        <>
                          <span>•</span>
                          <span
                            className={`font-bold ${
                              lecture.lastRating === "Hard"
                                ? "text-rose-600"
                                : lecture.lastRating === "Easy"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            पिछला: {lecture.lastRating}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Primary & Secondary Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                    {/* Primary Study / Revision Action */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(8);
                        onStartRevision(lecture);
                      }}
                      className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Play className="w-4 h-4 fill-stone-950" />
                      <span>रिवीज़न शुरू करें</span>
                    </button>

                    {/* Quick Complete / Rating Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setQuickRatingLectureId(isQuickOpen ? null : lecture.id);
                      }}
                      className="py-2 sm:py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="त्वरित पूर्ण करें"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">त्वरित पूर्ण</span>
                    </button>

                    {/* AI Doubt Shortcut */}
                    <button
                      type="button"
                      onClick={() => onAskGemini(lecture)}
                      className="p-2 sm:p-2.5 rounded-xl text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="इस टॉपिक पर डाउट पूछें"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Inline Quick Rating Selector when toggled */}
                  {isQuickOpen && (
                    <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 animate-in fade-in duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          onQuickComplete(lecture.id, "Hard", 10);
                          setQuickRatingLectureId(null);
                        }}
                        className="py-2 px-2 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs font-bold text-center cursor-pointer transition-colors border border-rose-200"
                      >
                        कठिन (Hard)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onQuickComplete(lecture.id, "Medium", 15);
                          setQuickRatingLectureId(null);
                        }}
                        className="py-2 px-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold text-center cursor-pointer transition-colors border border-amber-200"
                      >
                        मध्यम (Medium)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onQuickComplete(lecture.id, "Easy", 10);
                          setQuickRatingLectureId(null);
                        }}
                        className="py-2 px-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold text-center cursor-pointer transition-colors border border-emerald-200"
                      >
                        सरल (Easy)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. UPCOMING REVISION PREVIEW (Tomorrow's Forecast) */}
      <section className="bg-stone-100/80 rounded-2xl p-3.5 sm:p-4 border border-stone-200/70 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-500" />
          <span className="font-bold text-stone-700">कल आने वाला रिवीज़न:</span>
          <span className="font-black text-stone-900 bg-white px-2 py-0.5 rounded-lg border border-stone-200">
            {tomorrowCount} लेक्चर
          </span>
        </div>

        {archivedDebtCount > 0 && (
          <button
            type="button"
            onClick={onOpenDebtModal}
            className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
          >
            छूटा हुआ अभ्यास ({archivedDebtCount})
          </button>
        )}
      </section>
    </div>
  );
};
