import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  AlertTriangle, 
  Play, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ShieldAlert,
  X
} from "lucide-react";
import { DifficultyRating, LectureItem } from "../types";
import { formatHindiDate } from "../utils/revisionEngine";
import { triggerHaptic } from "../utils/haptics";

interface MistakesQueueViewProps {
  lectures: LectureItem[];
  onGoBack: () => void;
  onStartRevision: (lecture: LectureItem) => void;
  onQuickComplete?: (lectureId: string, rating?: DifficultyRating) => void;
  onViewLecture?: (lecture: LectureItem) => void;
  backTitle?: string;
}

export const MistakesQueueView: React.FC<MistakesQueueViewProps> = ({
  lectures,
  onGoBack,
  onStartRevision,
  onViewLecture,
  backTitle = "वापस",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "hard" | "with_notes">("all");

  // Filter lectures that are marked Hard or have mistake notes recorded
  const mistakeLectures = useMemo(() => {
    return lectures.filter((l) => {
      if (l.status === "archived") return false;
      const isHard = l.lastRating === "Hard";
      const hasMistakeNote = Boolean(l.previousMistakes && l.previousMistakes.trim().length > 0);
      const hasLogsWithMistake = Boolean(
        l.revisionLogs?.some(
          (log) => log.difficultyRating === "Hard" || (log.mistakes && log.mistakes.trim().length > 0)
        )
      );
      return isHard || hasMistakeNote || hasLogsWithMistake;
    });
  }, [lectures]);

  const filtered = useMemo(() => {
    return mistakeLectures.filter((l) => {
      if (filterType === "hard" && l.lastRating !== "Hard") return false;
      if (filterType === "with_notes" && !l.previousMistakes) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = l.title.toLowerCase().includes(q);
        const matchSubject = l.subject.toLowerCase().includes(q);
        const matchMistake = (l.previousMistakes || "").toLowerCase().includes(q);
        return matchTitle || matchSubject || matchMistake;
      }
      return true;
    });
  }, [mistakeLectures, filterType, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* 1. HEADER & SEARCH */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoBack}
              className="p-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
              aria-label="वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                कमज़ोर टॉपिक्स व गलतियाँ
              </h2>
              <p className="text-xs text-stone-500">
                वे टॉपिक्स जिनमें गलती हुई या जो पिछले रिवीज़न में कठिन लगे
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black shrink-0">
            {filtered.length} चिन्हित
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="कमज़ोर टॉपिक या विषय खोजें..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === "all"
                ? "bg-rose-600 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            सभी ({mistakeLectures.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("hard")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === "hard"
                ? "bg-rose-600 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            कठिन रेटिंग वाले
          </button>
          <button
            type="button"
            onClick={() => setFilterType("with_notes")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === "with_notes"
                ? "bg-rose-600 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            गलती नोट्स सहित
          </button>
        </div>
      </section>

      {/* 2. ACTION-ORIENTED CARDS LIST */}
      <section className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              कोई कमज़ोर टॉपिक या दर्ज गलती नहीं है
            </h4>
            <p className="text-xs text-stone-500">
              रिवीज़न के दौरान जब आप किसी टॉपिक को 'कठिन' मार्क करेंगे या नोट्स लिखेंगे, तो वे यहाँ समीक्षा के लिए दिखेंगे।
            </p>
          </div>
        ) : (
          filtered.map((lec) => {
            return (
              <div
                key={lec.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/90 shadow-xs space-y-3"
              >
                {/* 1. कमज़ोर विषय व टॉपिक */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-800 font-extrabold text-[11px] border border-rose-200">
                      {lec.subject}
                    </span>
                    <span className="text-xs font-bold text-rose-600">
                      रेटिंग: {lec.lastRating || "कठिन"}
                    </span>
                  </div>

                  <h3
                    onClick={() => onViewLecture?.(lec)}
                    className="text-sm sm:text-base font-bold text-stone-900 hover:text-amber-800 cursor-pointer transition-colors pt-0.5 leading-snug"
                  >
                    {lec.title}
                  </h3>
                  <p className="text-xs text-stone-500 truncate">
                    अध्याय: {lec.chapter}
                  </p>
                </div>

                {/* 2. क्यों कमज़ोर है / दर्ज गलती */}
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-xs space-y-1">
                  <span className="font-extrabold text-rose-900 block">
                    दर्ज की गई कठिनाई / गलती:
                  </span>
                  <p className="text-rose-800 leading-relaxed">
                    {lec.previousMistakes || "पिछले रिवीज़न में यह टॉपिक समझने में कठिन रहा था। अवधारणा को दोबारा दोहराना आवश्यक है।"}
                  </p>
                </div>

                {/* 3. Primary Action: [अभी रिवीज़न करें] */}
                <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onStartRevision(lec);
                    }}
                    className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-stone-950" />
                    <span>अभी रिवीज़न करें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewLecture?.(lec)}
                    className="py-2 sm:py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    विवरण देखें
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
