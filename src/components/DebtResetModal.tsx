import React, { useState, useMemo } from "react";
import { 
  ShieldAlert, 
  Archive, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Layers, 
  ArrowRight,
  RotateCcw,
  Check,
  Filter,
  CheckSquare,
  Square,
  Flame,
  BookOpen
} from "lucide-react";
import { LectureItem } from "../types";
import { getShortChapterName, getLectureDisplayName } from "../utils/formatters";
import { InfoTip } from "./InfoTip";
import { SUBJECT_CHAPTER_CATALOG, getChaptersForSubject } from "../data/subjectChapterCatalog";

interface DebtResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectures: LectureItem[];
  onExecuteReset: (selectedKeepActiveIds: string[]) => void;
  onRestoreAll: () => void;
  archivedCount: number;
}

export const DebtResetModal: React.FC<DebtResetModalProps> = ({
  isOpen,
  onClose,
  lectures,
  onExecuteReset,
  onRestoreAll,
  archivedCount,
}) => {
  // All active/queued/due or syllabus lectures available for selection (excluding already archived ones unless marked as legacy debt)
  const candidateLectures = useMemo(() => {
    return lectures.filter((l) => l.status !== "archived" || l.isOverdueLegacyDebt);
  }, [lectures]);

  // Active candidate count that were in active study rotation
  const activeDebtCount = useMemo(() => {
    return lectures.filter(
      (l) => (l.status !== "archived" && l.status !== "not_started") || l.isOverdueLegacyDebt
    ).length;
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

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExecute = () => {
    onExecuteReset(selectedIds);
    onClose();
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

  // Bulk actions for visible filtered list
  const visibleIds = filteredCandidates.map((l) => l.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      // Deselect all visible
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      // Select all visible
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Preset filter 1: Select only Hard / Doubts in current view
  const selectHardAndDoubts = () => {
    const hardIds = filteredCandidates
      .filter((l) => l.lastRating === "Hard" || l.geminiDoubts || l.conceptNotes)
      .map((l) => l.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...hardIds])));
  };

  // Preset filter 2: Select low revision (< 2 revisions)
  const selectLowRevisions = () => {
    const lowRevIds = filteredCandidates
      .filter((l) => l.revisionCount <= 1)
      .map((l) => l.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...lowRevIds])));
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xl backdrop-saturate-150 animate-in fade-in duration-150">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[92vh] glass-specular">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  सक्रिय लेक्चर्स एवं बैकलॉग चुनाव (Strategic Triage)
                </h2>
                <InfoTip
                  title="सक्रिय लेक्चर्स चुनाव"
                  content="यहाँ आप विषय (Subject), अध्याय (Chapter), या व्यक्तिगत लेक्चर्स चुन सकते हैं जिन्हें सक्रिय रखना है। शेष सभी लेक्चर्स सुरक्षित रूप से आर्काइव वॉल्ट में चले जाएँगे।"
                />
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                विषय, अध्याय या व्यक्तिगत स्तर पर चुनें कि कौन-से लेक्चर्स सक्रिय रहेंगे।
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-3 overflow-y-auto space-y-3.5 flex-1 pr-1">
          
          {/* Comparison Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                  वर्तमान कुल लेक्चर्स
                </span>
                <div className="text-lg font-extrabold text-rose-900 mt-0.5">
                  {candidateLectures.length} लेक्चर्स कतार में
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-100 text-rose-800">
                🔴 भारी लोड
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  आपके द्वारा चुने गए (सक्रिय रहेंगे)
                </span>
                <div className="text-lg font-extrabold text-emerald-900 mt-0.5">
                  {selectedIds.length} सक्रिय लेक्चर्स
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                🟢 हल्का व शांत
              </span>
            </div>
          </div>

          {/* Multilevel Filters (Subject, Chapter, Search) */}
          <div className="bg-stone-50 rounded-xl p-3 sm:p-3.5 border border-stone-200 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/70 pb-2">
              <div className="flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-stone-800">
                  चुनाव स्तर (3-स्तरीय फ़िल्टर):
                </span>
              </div>

              {/* Presets buttons */}
              <div className="flex items-center flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={toggleSelectAllVisible}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 flex items-center gap-1 shadow-2xs"
                >
                  {allVisibleSelected ? <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> : <Square className="w-3.5 h-3.5 text-stone-400" />}
                  <span>{allVisibleSelected ? "दिख रहे सभी हटाएं" : "दिख रहे सभी चुनें"}</span>
                </button>

                <button
                  type="button"
                  onClick={selectHardAndDoubts}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 flex items-center gap-1 shadow-2xs"
                >
                  <Flame className="w-3 h-3 text-rose-600" />
                  <span>केवल कठिन (Hard/Doubts)</span>
                </button>

                <button
                  type="button"
                  onClick={selectLowRevisions}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>कम रिवीज़न वाले (&le;1)</span>
                </button>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllSelections}
                    className="px-2 py-1 rounded-lg text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-200/60"
                  >
                    साफ़ करें (Clear)
                  </button>
                )}
              </div>
            </div>

            {/* Level 1: Subject, Level 2: Chapter, Level 3: Search */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Level 1: Subject */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>1. विषय (Subject)</span>
                  {filterSubject !== "ALL" && (
                    <span className="text-[10px] text-amber-700 font-semibold cursor-pointer" onClick={() => { setFilterSubject("ALL"); setFilterChapter("ALL"); }}>
                      रीसेट
                    </span>
                  )}
                </label>
                <select
                  value={filterSubject}
                  onChange={(e) => {
                    setFilterSubject(e.target.value);
                    setFilterChapter("ALL"); // Reset chapter filter when subject changes
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="ALL">सभी विषय ({subjects.length})</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Level 2: Chapter */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>2. अध्याय (Chapter)</span>
                  {filterChapter !== "ALL" && (
                    <span className="text-[10px] text-amber-700 font-semibold cursor-pointer" onClick={() => setFilterChapter("ALL")}>
                      रीसेट
                    </span>
                  )}
                </label>
                <select
                  value={filterChapter}
                  onChange={(e) => setFilterChapter(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="ALL">सभी अध्याय ({chapters.length})</option>
                  {chapters.map((ch) => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  3. सर्च (Lec #, नाम या विषय)
                </label>
                <input
                  type="text"
                  placeholder="जैसे: Lec 1, Ratio, Profit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-1 focus:ring-amber-500 focus:outline-hidden placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Informative chapter/subject quick select banner */}
            {(filterSubject !== "ALL" || filterChapter !== "ALL") && (
              <div className="flex items-center justify-between text-xs bg-amber-50/80 border border-amber-200/80 rounded-lg px-2.5 py-1.5 text-amber-900">
                <span>
                  फ़िल्टर में <strong>{filteredCandidates.length}</strong> लेक्चर्स उपलब्ध हैं।
                </span>
                <button
                  type="button"
                  onClick={toggleSelectAllVisible}
                  className="font-bold underline text-amber-950 hover:text-amber-800 ml-2"
                >
                  {allVisibleSelected ? "इस फ़िल्टर के सभी हटाएं" : "इस फ़िल्टर के सभी चुनें"}
                </button>
              </div>
            )}
          </div>

          {/* Level 3: Individual Lecture Selection List */}
          <div className="space-y-1.5 max-h-64 sm:max-h-72 overflow-y-auto border border-stone-200 rounded-xl p-2 bg-white">
            {filteredCandidates.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                कोई लेक्चर नहीं मिला। कृपया फ़िल्टर बदलें।
              </div>
            ) : (
              filteredCandidates.map((lec) => {
                const isSelected = selectedIds.includes(lec.id);
                return (
                  <div
                    key={lec.id}
                    onClick={() => toggleSelect(lec.id)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all text-xs ${
                      isSelected
                        ? "bg-amber-50/90 border-amber-300 ring-1 ring-amber-400/40 text-stone-900 font-medium"
                        : "bg-white hover:bg-stone-50 border-stone-200 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? "bg-stone-900 text-amber-400" : "border border-stone-300 bg-stone-100 text-stone-400"
                      }`}>
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-stone-900">
                          {getLectureDisplayName(lec.lectureNumber, lec.title)}
                        </span>
                        <span 
                          title={lec.chapter}
                          className="text-amber-900 font-bold ml-2 px-1.5 py-0.5 rounded bg-amber-100/70 text-[11px]"
                        >
                          {getShortChapterName(lec.chapter)}
                        </span>
                        <span className="text-stone-500 text-[11px] ml-1.5 hidden sm:inline">
                          • {lec.subject}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 ml-2">
                      {lec.geminiDoubts && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          🎯 {lec.geminiDoubts}
                        </span>
                      )}
                      {lec.lastRating && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          lec.lastRating === "Hard"
                            ? "bg-rose-100 text-rose-800"
                            : lec.lastRating === "Easy"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-700"
                        }`}>
                          {lec.lastRating}
                        </span>
                      )}
                      <span className="text-[11px] text-stone-400 hidden xs:inline">
                        Rev: {lec.revisionCount}
                      </span>
                      <span className="text-stone-400 text-[11px]">~{lec.avgTimeMinutes || 20}m</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {archivedCount > 0 ? (
            <button
              type="button"
              onClick={() => {
                onRestoreAll();
                onClose();
              }}
              className="text-xs text-rose-700 hover:text-rose-900 underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>सभी {archivedCount} लेक्चर्स वापस लाएं (Restore All)</span>
            </button>
          ) : (
            <div className="text-xs text-stone-400 font-medium">
              सुरक्षित आर्काइव: जो नहीं चुने जाएँगे वे वॉल्ट में रहेंगे, डिलीट नहीं होंगे।
            </div>
          )}

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              रद्द करें
            </button>

            <button
              type="button"
              onClick={handleExecute}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center space-x-1.5 shadow-xs transition-all"
            >
              <Archive className="w-4 h-4 text-amber-400" />
              <span>लागू करें ({selectedIds.length} सक्रिय रहेंगे)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
