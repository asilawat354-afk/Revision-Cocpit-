import React, { useState, useMemo } from "react";
import { 
  X, 
  Play, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Layers,
  Sparkles,
  SlidersHorizontal
} from "lucide-react";
import { LectureItem } from "../types";
import { TODAY_STR } from "../data/initialData";
import { triggerHaptic } from "../utils/haptics";

interface CustomRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectures: LectureItem[];
  onStartSession: (selectedLectures: LectureItem[]) => void;
}

export const CustomRevisionModal: React.FC<CustomRevisionModalProps> = ({
  isOpen,
  onClose,
  lectures,
  onStartSession,
}) => {
  const [includeDue, setIncludeDue] = useState(true);
  const [includeOverdue, setIncludeOverdue] = useState(true);
  const [includeHardOnly, setIncludeHardOnly] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [maxCount, setMaxCount] = useState<number>(10);

  const availableSubjects = useMemo(() => {
    return Array.from(new Set(lectures.map((l) => l.subject))).filter(Boolean);
  }, [lectures]);

  // Compute matched lectures
  const matchedLectures = useMemo(() => {
    return lectures.filter((l) => {
      if (l.status === "archived") return false;

      const isDueToday = l.nextDueDate === TODAY_STR;
      const isOverdue = l.nextDueDate < TODAY_STR;
      const isHard = l.lastRating === "Hard" || Boolean(l.previousMistakes);

      if (selectedSubject !== "ALL" && l.subject !== selectedSubject) return false;
      if (includeHardOnly && !isHard) return false;

      if (includeDue && isDueToday) return true;
      if (includeOverdue && isOverdue) return true;
      if (!includeDue && !includeOverdue) return true; // if user wants custom general session

      return false;
    }).slice(0, maxCount);
  }, [lectures, includeDue, includeOverdue, includeHardOnly, selectedSubject, maxCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-stone-900">कस्टम रिवीज़न सत्र तैयार करें</h2>
              <p className="text-xs text-stone-500">अपनी ज़रूरत अनुसार फ़ोकस्ड सत्र बनाएं</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Target Types */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">सत्र में शामिल करें:</label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer text-xs font-bold transition-all ${
                includeDue ? "bg-amber-50 border-amber-400 text-amber-950" : "bg-stone-50 border-stone-200 text-stone-700"
              }`}>
                <input
                  type="checkbox"
                  checked={includeDue}
                  onChange={(e) => setIncludeDue(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>आज देय (Due Today)</span>
              </label>

              <label className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer text-xs font-bold transition-all ${
                includeOverdue ? "bg-rose-50 border-rose-400 text-rose-950" : "bg-stone-50 border-stone-200 text-stone-700"
              }`}>
                <input
                  type="checkbox"
                  checked={includeOverdue}
                  onChange={(e) => setIncludeOverdue(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>पुराने बकाया (Overdue)</span>
              </label>
            </div>

            <label className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer text-xs font-bold transition-all ${
              includeHardOnly ? "bg-purple-50 border-purple-400 text-purple-950" : "bg-stone-50 border-stone-200 text-stone-700"
            }`}>
              <input
                type="checkbox"
                checked={includeHardOnly}
                onChange={(e) => setIncludeHardOnly(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>केवल कठिन / संशय वाले टॉपिक्स (Mistakes Only)</span>
            </label>
          </div>

          {/* Subject Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">विषय चुनें:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 bg-white outline-none focus:border-amber-500"
            >
              <option value="ALL">सभी विषय (All Subjects)</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Max count slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-stone-700">
              <span>अधिकतम टॉपिक्स:</span>
              <span className="text-amber-800">{maxCount} टॉपिक्स</span>
            </div>
            <input
              type="range"
              min={3}
              max={30}
              value={maxCount}
              onChange={(e) => setMaxCount(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Live Preview Count Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs text-amber-900 font-bold block">
              सत्र के लिए {matchedLectures.length} टॉपिक्स चयनित हुए हैं
            </span>
            <span className="text-[11px] text-amber-700">
              अनुमानित समय: ~{matchedLectures.length * 15} से {matchedLectures.length * 25} मिनट
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            रद्द करें
          </button>

          <button
            type="button"
            disabled={matchedLectures.length === 0}
            onClick={() => {
              triggerHaptic(12);
              onStartSession(matchedLectures);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>सत्र शुरू करें ({matchedLectures.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
