import React, { useState, useMemo } from "react";
import { 
  ArrowLeft,
  ShieldAlert, 
  Archive, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Layers, 
  RotateCcw,
  Check,
  Filter,
  CheckSquare,
  Square,
  Flame,
  BookOpen,
  Search
} from "lucide-react";
import { LectureItem } from "../types";
import { getShortChapterName, getLectureDisplayName } from "../utils/formatters";
import { InfoTip } from "./InfoTip";
import { SUBJECT_CHAPTER_CATALOG, getChaptersForSubject } from "../data/subjectChapterCatalog";

interface DebtResetViewProps {
  onGoBack: () => void;
  lectures: LectureItem[];
  onExecuteReset: (selectedKeepActiveIds: string[]) => void;
  onRestoreAll: () => void;
  archivedCount: number;
  backTitle?: string;
}

export const DebtResetView: React.FC<DebtResetViewProps> = ({
  onGoBack,
  lectures,
  onExecuteReset,
  onRestoreAll,
  archivedCount,
  backTitle = "वापस"
}) => {
  // All active/queued/due or syllabus lectures available for selection (excluding already archived ones unless marked as legacy debt)
  const candidateLectures = useMemo(() => {
    return lectures.filter((l) => l.status !== "archived" || l.isOverdueLegacyDebt);
  }, [lectures]);

  const defaultTriageSelection = useMemo(() => {
    return candidateLectures
      .filter((l) => (l.status !== "not_started" && l.status !== "archived") && (l.geminiDoubts || l.conceptNotes || l.lastRating === "Hard" || l.lectureNumber === 1))
      .slice(0, 12)
      .map((l) => l.id);
  }, [candidateLectures]);

  const [selectedIds, setSelectedIds] = useState<string[]>(defaultTriageSelection);
  const [filterSubject, setFilterSubject] = useState<string>("ALL");
  const [filterChapter, setFilterChapter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // All distinct subjects from catalog + any custom subjects present in lectures
  const subjects = useMemo(() => {
    const fromCatalog = SUBJECT_CHAPTER_CATALOG.map((s) => s.name);
    const fromLectures = Array.from(new Set(candidateLectures.map((l) => l.subject))).filter(Boolean);
    return Array.from(new Set([...fromCatalog, ...fromLectures]));
  }, [candidateLectures]);

  // Distinct chapters based on currently selected subject
  const chapters = useMemo(() => {
    if (filterSubject === "ALL") {
      return Array.from(new Set(candidateLectures.map((l) => l.chapter))).filter(Boolean);
    }
    const catalogChaps = getChaptersForSubject(filterSubject);
    const lecChaps = candidateLectures
      .filter((l) => l.subject === filterSubject)
      .map((l) => l.chapter);
    return Array.from(new Set([...catalogChaps, ...lecChaps])).filter(Boolean);
  }, [candidateLectures, filterSubject]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExecute = () => {
    onExecuteReset(selectedIds);
    onGoBack();
  };

  // Filtered candidate list based on Subject, Chapter and Search
  const filteredCandidates = candidateLectures.filter((l) => {
    if (filterSubject !== "ALL" && l.subject !== filterSubject) return false;
    if (filterChapter !== "ALL" && l.chapter !== filterChapter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (l.title || "").toLowerCase().includes(q);
      const matchChapter = (l.chapter || "").toLowerCase().includes(q);
      const matchSubject = (l.subject || "").toLowerCase().includes(q);
      const matchLecNum = `lec ${l.lectureNumber}`.includes(q) || `${l.lectureNumber}` === q;
      if (!matchTitle && !matchChapter && !matchSubject && !matchLecNum) return false;
    }
    return true;
  });

  const visibleIds = filteredCandidates.map((l) => l.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const selectHardAndDoubts = () => {
    const hardIds = filteredCandidates
      .filter((l) => l.lastRating === "Hard" || l.geminiDoubts || l.conceptNotes)
      .map((l) => l.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...hardIds])));
  };

  const selectLowRevisions = () => {
    const lowRevIds = filteredCandidates
      .filter((l) => l.revisionCount <= 1)
      .map((l) => l.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...lowRevIds])));
  };

  const clearAllSelections = () => {
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onGoBack}
            aria-label="वापस जाएं"
            className="h-8 w-8 sm:w-auto px-0 sm:px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-stone-200 cursor-pointer shadow-2xs shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">{backTitle}</span>
          </button>

          <div className="h-4 w-px bg-stone-200 hidden sm:block" />

          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-stone-900 tracking-tight leading-tight truncate">
                सक्रिय चुनाव एवं बैकलॉग छंटाई (Strategic Triage)
              </h2>
              <p className="text-[11px] text-stone-500 truncate">
                चुने हुए लेक्चर्स सक्रिय रहेंगे, शेष शांति से आर्काइव वॉल्ट में सुरक्षित रहेंगे
              </p>
            </div>
          </div>
        </div>

        {archivedCount > 0 && (
          <button
            type="button"
            onClick={onRestoreAll}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 transition-colors self-end sm:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>सभी {archivedCount} रीस्टोर करें</span>
          </button>
        )}
      </div>

      {/* Comparison Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
              वर्तमान कुल लेक्चर्स
            </span>
            <div className="text-xl sm:text-2xl font-black text-rose-950 mt-0.5">
              {candidateLectures.length} लेक्चर्स कतार में
            </div>
            <p className="text-xs text-rose-700 mt-1">बैकलॉग का मानसिक तनाव और अव्यवस्था</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-200 text-rose-900 shrink-0">
            🔴 भारी लोड
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              आपके द्वारा चुने गए (सक्रिय रहेंगे)
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-0.5">
              {selectedIds.length} सक्रिय लेक्चर्स
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              {candidateLectures.length - selectedIds.length} लेक्चर्स वॉल्ट में सुरक्षित होंगे
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 shrink-0">
            🟢 हल्का व शांत
          </span>
        </div>
      </div>

      {/* Filters & Batch Selection Tools */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-stone-900">
              त्वरित चुनाव प्रीसेट्स:
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-1.5">
            <button
              type="button"
              onClick={toggleSelectAllVisible}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              {allVisibleSelected ? <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> : <Square className="w-3.5 h-3.5 text-stone-400" />}
              <span>{allVisibleSelected ? "दिख रहे सभी हटाएं" : "दिख रहे सभी चुनें"}</span>
            </button>

            <button
              type="button"
              onClick={selectHardAndDoubts}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 flex items-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>कठिन / संशय (Hard/Doubts)</span>
            </button>

            <button
              type="button"
              onClick={selectLowRevisions}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 flex items-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>कम रिवीज़न (&le;1)</span>
            </button>

            <button
              type="button"
              onClick={clearAllSelections}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all active:scale-95 cursor-pointer"
            >
              सभी हटाएं
            </button>
          </div>
        </div>

        {/* 3-Level Filter: Subject, Chapter, Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">
              1. विषय (Subject)
            </label>
            <select
              value={filterSubject}
              onChange={(e) => {
                setFilterSubject(e.target.value);
                setFilterChapter("ALL");
              }}
              className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-800 focus:bg-white"
            >
              <option value="ALL">सभी विषय ({subjects.length})</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">
              2. अध्याय (Chapter)
            </label>
            <select
              value={filterChapter}
              onChange={(e) => setFilterChapter(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-800 focus:bg-white"
            >
              <option value="ALL">सभी अध्याय ({chapters.length})</option>
              {chapters.map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">
              3. खोज (Search)
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="शीर्षक या लेक्चर नंबर..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-800 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lectures List with Triage Checkbox */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-stone-700">
            लेक्चर्स सूची ({filteredCandidates.length} दिखाई दे रहे हैं):
          </span>
          <span className="text-xs font-extrabold text-amber-700">
            {selectedIds.length} सक्रिय चुने गए
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredCandidates.map((lec) => {
            const isSelected = selectedIds.includes(lec.id);
            return (
              <div
                key={lec.id}
                onClick={() => toggleSelect(lec.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                  isSelected
                    ? "bg-emerald-50/70 border-emerald-400/90 shadow-2xs"
                    : "bg-stone-50/60 border-stone-200/80 hover:bg-stone-100"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md border border-stone-300 bg-white" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-800">
                      Lec {lec.lectureNumber}
                    </span>
                    <span className="text-xs font-bold text-stone-900 truncate">
                      {lec.chapter}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      ({lec.subject})
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 truncate mt-0.5 font-medium">
                    {lec.title}
                  </p>

                  <div className="flex items-center space-x-2 mt-1 text-[10px] text-stone-500">
                    <span>रिवीज़न: {lec.revisionCount} बार</span>
                    {lec.lastRating && (
                      <span className={`font-bold ${lec.lastRating === "Hard" ? "text-rose-600" : "text-emerald-700"}`}>
                        रेटिंग: {lec.lastRating}
                      </span>
                    )}
                    {lec.geminiDoubts && (
                      <span className="text-sky-700 font-bold">
                        AI नोट्स उपलब्ध
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-600"
                  }`}>
                    {isSelected ? "सक्रिय रहेगा" : "वॉल्ट में जाएगा"}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredCandidates.length === 0 && (
            <div className="col-span-2 text-center py-12 text-stone-400 text-xs">
              कोई लेक्चर नहीं मिला। फ़िल्टर बदलें।
            </div>
          )}
        </div>
      </div>

      {/* Floating / Sticky Bottom Execution Bar */}
      <div className="sticky bottom-3 z-30 bg-stone-900/90 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs sm:text-sm">
          <span>चुने गए: <strong className="text-amber-400 font-black">{selectedIds.length} लेक्चर्स सक्रिय</strong> रहेंगे।</span>
          <span className="text-stone-400 ml-2 hidden sm:inline">शेष {candidateLectures.length - selectedIds.length} डेब्ट वॉल्ट में सुरक्षित रहेंगे।</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onGoBack}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            रद्द करें
          </button>

          <button
            type="button"
            onClick={handleExecute}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-stone-950" />
            <span>सक्रिय चुनाव लागू करें (Apply & Vault Rest)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
