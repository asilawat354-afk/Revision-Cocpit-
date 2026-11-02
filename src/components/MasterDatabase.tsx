import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  FileSpreadsheet,
  Play, 
  CheckCircle2, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  X,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { DifficultyRating, LectureItem } from "../types";
import { formatHindiDate, getTodayStr } from "../utils/revisionEngine";
import { triggerHaptic } from "../utils/haptics";
import { InfoTip } from "./InfoTip";
import { 
  buildLectureRecordRows, 
  downloadCSVFile, 
  downloadExcelWorkbook, 
  ExportDatasetType 
} from "../utils/exportData";

interface MasterDatabaseProps {
  lectures: LectureItem[];
  onStartRevision: (lecture: LectureItem) => void;
  onAskGemini: (lecture: LectureItem) => void;
  onOpenAddLecture: () => void;
  onExportCSV: () => void;
  onOpenExportModal?: (dataset?: ExportDatasetType, subject?: string) => void;
  onQuickRatingChange: (lectureId: string, rating: DifficultyRating) => void;
  onOpenDirectory?: () => void;
  onMarkAsStudied?: (lectureId: string) => void;
  onResetToNotStarted?: (lectureId: string) => void;
}

export const MasterDatabase: React.FC<MasterDatabaseProps> = ({
  lectures,
  onStartRevision,
  onAskGemini,
  onOpenAddLecture,
  onExportCSV,
  onOpenExportModal,
  onQuickRatingChange,
  onOpenDirectory,
  onMarkAsStudied,
  onResetToNotStarted,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pageSize = 12;

  const todayStr = useMemo(() => getTodayStr(), []);

  // Unique subjects in database
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    lectures.forEach((l) => subs.add(l.subject));
    return Array.from(subs);
  }, [lectures]);

  // Filtered lectures
  const filteredLectures = useMemo(() => {
    return lectures.filter((lec) => {
      if (selectedSubject !== "ALL" && lec.subject !== selectedSubject) return false;
      if (selectedStatus !== "ALL") {
        if (selectedStatus === "Due" && !(lec.status === "due_today" || (lec.nextDueDate && lec.nextDueDate <= todayStr && lec.status !== "completed"))) return false;
        if (selectedStatus === "Completed" && !(lec.status === "completed" || lec.revisionCount >= 4)) return false;
        if (selectedStatus === "Not Started" && lec.status !== "not_started") return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = lec.title.toLowerCase().includes(q);
        const matchChapter = lec.chapter.toLowerCase().includes(q);
        const matchSubject = lec.subject.toLowerCase().includes(q);
        return matchTitle || matchChapter || matchSubject;
      }
      return true;
    });
  }, [lectures, selectedSubject, selectedStatus, searchTerm, todayStr]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLectures.length / pageSize) || 1;
  const paginatedLectures = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLectures.slice(start, start + pageSize);
  }, [filteredLectures, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    triggerHaptic(6);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDirectExportExcel = () => {
    triggerHaptic(8);
    const rows = buildLectureRecordRows(filteredLectures);
    const subTag = selectedSubject !== "ALL" ? `_${selectedSubject.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    downloadExcelWorkbook(
      [{ name: "Lectures_Record", rows }],
      `Smart_Revision_Records${subTag}_${todayStr}`
    );
  };

  const handleDirectExportCSV = () => {
    triggerHaptic(8);
    const rows = buildLectureRecordRows(filteredLectures);
    const subTag = selectedSubject !== "ALL" ? `_${selectedSubject.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    downloadCSVFile(rows, `Smart_Revision_Records${subTag}_${todayStr}`);
  };

  const getStatusBadge = (lec: LectureItem) => {
    if (lec.revisionCount >= 4) {
      return { bg: "bg-indigo-100 text-indigo-900 border-indigo-200", label: "कंठस्थ" };
    }
    if (lec.status === "completed") {
      return { bg: "bg-emerald-100 text-emerald-900 border-emerald-200", label: "पूर्ण" };
    }
    if (lec.nextDueDate && lec.nextDueDate < todayStr) {
      return { bg: "bg-rose-100 text-rose-900 border-rose-200", label: "अतिदेय" };
    }
    if (lec.status === "due_today" || (lec.nextDueDate && lec.nextDueDate === todayStr)) {
      return { bg: "bg-amber-100 text-amber-900 border-amber-300", label: "आज नियत" };
    }
    return { bg: "bg-stone-100 text-stone-700 border-stone-200", label: "प्रारंभ नहीं" };
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER & SEARCH / FILTER CONTROLS */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                सभी लेक्चर्स की सूची
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
                {filteredLectures.length} लेक्चर्स
              </span>
              <InfoTip
                title="मास्टर डेटाबेस"
                content="यहाँ आपके सभी पंजीकृत लेक्चर्स एक ही स्थान पर व्यवस्थित हैं। आप विषय, अध्याय या स्थिति के आधार पर खोज व रिवीज़न कर सकते हैं तथा CSV या Excel (.xlsx) में एक्सपोर्ट कर सकते हैं।"
              />
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              सभी विषयों के लेक्चर्स, रिवीज़न अंतराल व प्रगति स्थिति
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onOpenAddLecture}
              className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.8]" />
              <span>नया लेक्चर</span>
            </button>

            <button
              type="button"
              onClick={handleDirectExportExcel}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="लेक्चर रिकॉर्ड्स Excel (.xlsx) में डाउनलोड करें"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handleDirectExportCSV}
              className="py-2 px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 border border-stone-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="लेक्चर रिकॉर्ड्स CSV (.csv) में डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            {onOpenExportModal && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  onOpenExportModal("records", selectedSubject);
                }}
                className="py-2 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-900 border border-sky-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="रिकॉर्ड और सिलेबस एक्सपोर्ट विकल्प खोलें"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-sky-700" />
                <span className="hidden md:inline">एक्सपोर्ट विकल्प</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="लेक्चर, अध्याय या विषय खोजें..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="p-1 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls: Subject & Status */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: "ALL", label: "सभी" },
              { id: "Due", label: "नियत (Due)" },
              { id: "Completed", label: "पूर्ण" },
              { id: "Not Started", label: "नया" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  triggerHaptic(6);
                  setSelectedStatus(st.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedStatus === st.id
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Subject Dropdown Filter if many subjects */}
          {availableSubjects.length > 0 && (
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setCurrentPage(1);
              }}
              className="ml-auto py-1 px-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL">सभी विषय ({lectures.length})</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* 2. LECTURES LIST / CARDS VIEW */}
      <section className="space-y-2.5">
        {paginatedLectures.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 shadow-xs space-y-2">
            <p className="text-sm font-bold text-stone-700">कोई लेक्चर नहीं मिला</p>
            <p className="text-xs text-stone-400">खोज शब्द बदलें या फ़िल्टर रीसेट करें</p>
          </div>
        ) : (
          paginatedLectures.map((lec) => {
            const statusBadge = getStatusBadge(lec);
            const isExpanded = expandedId === lec.id;

            return (
              <div
                key={lec.id}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 shadow-xs hover:border-amber-300 transition-all space-y-2.5"
              >
                {/* Header Row: Subject, Chapter & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-extrabold text-[10.5px]">
                        {lec.subject}
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-500 font-medium truncate max-w-[160px] sm:max-w-xs">
                        {lec.chapter}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-stone-900 mt-1 leading-snug">
                      {lec.title}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10.5px] font-black border shrink-0 ${statusBadge.bg}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                {/* Metadata & Quick Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-2 text-stone-500 text-[11px] font-medium">
                    <span>रिवीज़न #{lec.revisionCount || 0}</span>
                    <span>•</span>
                    <span>अगला: {lec.nextDueDate ? formatHindiDate(lec.nextDueDate) : "नियत नहीं"}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Start Revision */}
                    <button
                      type="button"
                      onClick={() => onStartRevision(lec)}
                      className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-stone-950" />
                      <span>रिवीज़न</span>
                    </button>

                    {/* Quick Studied */}
                    {onMarkAsStudied && lec.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() => onMarkAsStudied(lec.id)}
                        className="py-1 px-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors cursor-pointer"
                        title="पढ़ा हुआ मार्क करें"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Reset */}
                    {onResetToNotStarted && (
                      <button
                        type="button"
                        onClick={() => onResetToNotStarted(lec.id)}
                        className="py-1 px-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="प्रारंभ नहीं पर रीसेट करें"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Gemini AI */}
                    <button
                      type="button"
                      onClick={() => onAskGemini(lec)}
                      className="py-1 px-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="AI डाउट पूछें"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* 3. PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <section className="flex items-center justify-between p-3 bg-white rounded-2xl border border-stone-200/80 text-xs font-bold text-stone-700">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>पिछला</span>
          </button>

          <span>
            पृष्ठ {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>अगला</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      )}
    </div>
  );
};
