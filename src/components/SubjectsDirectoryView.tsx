import React, { useState, useMemo, useEffect } from "react";
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  ChevronRight, 
  Plus, 
  Layers,
  CheckCircle2,
  X,
  Play,
  Clock,
  Sparkles,
  FileText,
  AlertTriangle,
  FolderOpen,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { SUBJECT_CHAPTER_CATALOG, SubjectCatalogItem } from "../data/subjectChapterCatalog";
import { triggerHaptic } from "../utils/haptics";
import { LectureItem } from "../types";
import { formatHindiDate, getTodayStr } from "../utils/revisionEngine";
import { 
  executeDataExport, 
  ExportDatasetType 
} from "../utils/exportData";

interface SubjectsDirectoryViewProps {
  lectures: LectureItem[];
  onGoBack: () => void;
  backTitle?: string;
  onStartRevision: (lecture: LectureItem) => void;
  onAskGemini: (lecture: LectureItem) => void;
  onViewTopicDetail: (lecture: LectureItem) => void;
  onOpenAddLecture: (subject?: string, chapter?: string) => void;
  onOpenExportModal?: (dataset?: ExportDatasetType, subject?: string) => void;
  initialSubjectName?: string;
  initialChapterName?: string;
}

export const SubjectsDirectoryView: React.FC<SubjectsDirectoryViewProps> = ({
  lectures,
  onGoBack,
  backTitle = "वापस",
  onStartRevision,
  onAskGemini,
  onViewTopicDetail,
  onOpenAddLecture,
  onOpenExportModal,
  initialSubjectName,
  initialChapterName,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectCatalogItem | null>(() => {
    if (initialSubjectName) {
      return SUBJECT_CHAPTER_CATALOG.find((s) => s.name === initialSubjectName) || null;
    }
    return null;
  });
  const [selectedChapter, setSelectedChapter] = useState<string | null>(initialChapterName || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const todayStr = useMemo(() => getTodayStr(), []);

  // Sync when initial subject or chapter changes externally
  useEffect(() => {
    if (initialSubjectName) {
      const found = SUBJECT_CHAPTER_CATALOG.find((s) => s.name === initialSubjectName);
      if (found) {
        setSelectedSubject(found);
        if (initialChapterName) {
          setSelectedChapter(initialChapterName);
        }
      }
    }
  }, [initialSubjectName, initialChapterName]);

  // Handle hardware / browser back navigation recursively
  useEffect(() => {
    const handlePopState = () => {
      if (selectedChapter) {
        setSelectedChapter(null);
      } else if (selectedSubject) {
        setSelectedSubject(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedSubject, selectedChapter]);

  const categories = [
    { id: "ALL", label: "सभी 21 विषय" },
    { id: "Maths", label: "गणित" },
    { id: "Reasoning", label: "तर्कशक्ति" },
    { id: "General Studies", label: "सामान्य अध्ययन (GS)" },
    { id: "Science", label: "विज्ञान" },
    { id: "Computer", label: "कंप्यूटर" },
    { id: "Special / Other", label: "अन्य विषय" },
  ];

  const filteredSubjects = useMemo(() => {
    return SUBJECT_CHAPTER_CATALOG.filter((sub) => {
      if (selectedCategory !== "ALL" && sub.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = sub.name.toLowerCase().includes(q);
        const matchChapters = sub.chapters.some((c) => c.toLowerCase().includes(q));
        return matchSubject || matchChapters;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const totalSyllabusChapters = useMemo(() => {
    return SUBJECT_CHAPTER_CATALOG.reduce((acc, s) => acc + s.chapters.length, 0);
  }, []);

  // Lectures grouped by subject & chapter
  const getSubjectLectures = (subjectName: string) => {
    return lectures.filter((l) => l.subject === subjectName);
  };

  const getChapterLectures = (subjectName: string, chapterName: string) => {
    return lectures.filter(
      (l) => l.subject === subjectName && l.chapter.toLowerCase().trim() === chapterName.toLowerCase().trim()
    );
  };

  // Back handler based on current recursive level
  const handleInternalBack = () => {
    triggerHaptic(6);
    if (selectedChapter) {
      setSelectedChapter(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    } else {
      onGoBack();
    }
  };

  /* =========================================================================
     LEVEL 3: CHAPTER'S LECTURES & CONTENT VIEW
     ========================================================================= */
  if (selectedSubject && selectedChapter) {
    const chapterLectures = getChapterLectures(selectedSubject.name, selectedChapter);
    const dueCount = chapterLectures.filter(
      (l) => l.status === "due_today" || (l.nextDueDate && l.nextDueDate <= todayStr && l.status !== "completed")
    ).length;
    const masteredCount = chapterLectures.filter((l) => l.revisionCount >= 4 || l.status === "completed").length;
    const hardCount = chapterLectures.filter((l) => l.lastRating === "Hard").length;

    return (
      <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
        {/* Navigation & Header */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={handleInternalBack}
                className="p-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer shrink-0"
                aria-label="वापस जाएं"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium truncate">
                  <span 
                    onClick={() => {
                      setSelectedChapter(null);
                      setSelectedSubject(null);
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    निर्देशिका
                  </span>
                  <span>/</span>
                  <span 
                    onClick={() => setSelectedChapter(null)}
                    className="hover:underline cursor-pointer truncate max-w-[120px]"
                  >
                    {selectedSubject.name}
                  </span>
                  <span>/</span>
                  <span className="text-stone-900 font-bold truncate max-w-[150px]">
                    {selectedChapter}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-black text-stone-900 tracking-tight mt-0.5 truncate">
                  {selectedChapter}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                onOpenAddLecture(selectedSubject.name, selectedChapter);
              }}
              className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.8]" />
              <span>नया लेक्चर</span>
            </button>
          </div>

          {/* Chapter Quick Stats */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-100">
            <div className="bg-stone-50 rounded-xl p-2.5 text-center">
              <span className="text-[10.5px] font-bold text-stone-500 block">कुल लेक्चर्स</span>
              <span className="text-base sm:text-lg font-black text-stone-900">{chapterLectures.length}</span>
            </div>
            <div className="bg-amber-50 rounded-xl p-2.5 text-center">
              <span className="text-[10.5px] font-bold text-amber-800 block">आज नियत</span>
              <span className="text-base sm:text-lg font-black text-amber-600">{dueCount}</span>
            </div>
            <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
              <span className="text-[10.5px] font-bold text-emerald-800 block">पक्के</span>
              <span className="text-base sm:text-lg font-black text-emerald-600">{masteredCount}</span>
            </div>
            <div className="bg-rose-50 rounded-xl p-2.5 text-center">
              <span className="text-[10.5px] font-bold text-rose-800 block">कठिन</span>
              <span className="text-base sm:text-lg font-black text-rose-600">{hardCount}</span>
            </div>
          </div>
        </section>

        {/* Lectures List for this Chapter */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-stone-900">
              इस अध्याय के लेक्चर्स ({chapterLectures.length})
            </h3>
            <span className="text-xs text-stone-500">
              {selectedSubject.name}
            </span>
          </div>

          {chapterLectures.length === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-stone-200/90 shadow-xs space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-stone-900">
                  इस अध्याय में अभी कोई लेक्चर नहीं है
                </h4>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                  इस अध्याय का पहला लेक्चर जोड़ें और वैज्ञानिक Spaced Repetition के साथ पढ़ाई शुरू करें।
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  onOpenAddLecture(selectedSubject.name, selectedChapter);
                }}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 stroke-[2.8]" />
                <span>पहला लेक्चर जोड़ें</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {chapterLectures.map((lecture) => {
                const isDue = lecture.status === "due_today" || (lecture.nextDueDate && lecture.nextDueDate <= todayStr && lecture.status !== "completed");
                const isMastered = lecture.revisionCount >= 4 || lecture.status === "completed";

                return (
                  <div
                    key={lecture.id}
                    className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 shadow-xs hover:border-amber-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <span className="font-extrabold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md text-[10.5px]">
                            Lec #{lecture.lectureNumber}
                          </span>
                          <span>•</span>
                          <span>रिवीज़न #{lecture.revisionCount || 0}</span>
                          {lecture.lastRating && (
                            <>
                              <span>•</span>
                              <span className={`font-bold ${
                                lecture.lastRating === "Hard" ? "text-rose-600" :
                                lecture.lastRating === "Easy" ? "text-emerald-600" : "text-amber-600"
                              }`}>
                                {lecture.lastRating}
                              </span>
                            </>
                          )}
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-stone-900 mt-1 leading-snug">
                          {lecture.title}
                        </h4>
                      </div>

                      {/* Status Tag */}
                      <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-black shrink-0 ${
                        isDue ? "bg-amber-100 text-amber-900" :
                        isMastered ? "bg-emerald-100 text-emerald-900" : "bg-stone-100 text-stone-700"
                      }`}>
                        {isDue ? "आज नियत" : isMastered ? "कंठस्थ" : "प्रगति पर"}
                      </span>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          onStartRevision(lecture);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-stone-950" />
                        <span>रिवीज़न करें</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(6);
                          onViewTopicDetail(lecture);
                        }}
                        className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>विवरण</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(6);
                          onAskGemini(lecture);
                        }}
                        className="p-2 rounded-xl text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="AI संशय समाधान"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  /* =========================================================================
     LEVEL 2: SELECTED SUBJECT'S CHAPTERS VIEW
     ========================================================================= */
  if (selectedSubject) {
    const subjectLectures = getSubjectLectures(selectedSubject.name);
    const completedSubjectLec = subjectLectures.filter((l) => l.revisionCount >= 4 || l.status === "completed").length;

    const chapters = selectedSubject.chapters.filter((ch) => {
      if (searchQuery.trim()) {
        return ch.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });

    return (
      <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
        {/* Top Header */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={handleInternalBack}
                className="p-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer shrink-0"
                aria-label="सभी विषय देखें"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
              </button>
              <div className="min-w-0">
                <span className="text-xs text-stone-500 font-semibold">
                  {selectedSubject.category}
                </span>
                <h2 className="text-base sm:text-xl font-black text-stone-900 tracking-tight leading-tight truncate">
                  {selectedSubject.name}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  executeDataExport({
                    lectures,
                    dataset: "syllabus",
                    format: "xlsx",
                    subjectFilter: selectedSubject.name,
                  });
                }}
                className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                title="इस विषय का सिलेबस Excel (.xlsx) में डाउनलोड करें"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  executeDataExport({
                    lectures,
                    dataset: "syllabus",
                    format: "csv",
                    subjectFilter: selectedSubject.name,
                  });
                }}
                className="py-2 px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 border border-stone-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="इस विषय का सिलेबस CSV में डाउनलोड करें"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  onOpenAddLecture(selectedSubject.name);
                }}
                className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.8]" />
                <span>नया लेक्चर</span>
              </button>
            </div>
          </div>

          {/* Quick Subject Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
            <div className="bg-stone-50 rounded-xl p-2 text-center">
              <span className="text-[10px] text-stone-500 font-bold block">कुल अध्याय</span>
              <span className="text-sm sm:text-base font-black text-stone-900">{selectedSubject.chapters.length}</span>
            </div>
            <div className="bg-stone-50 rounded-xl p-2 text-center">
              <span className="text-[10px] text-stone-500 font-bold block">दर्ज लेक्चर्स</span>
              <span className="text-sm sm:text-base font-black text-amber-700">{subjectLectures.length}</span>
            </div>
            <div className="bg-stone-50 rounded-xl p-2 text-center">
              <span className="text-[10px] text-stone-500 font-bold block">कंठस्थ लेक्चर्स</span>
              <span className="text-sm sm:text-base font-black text-emerald-700">{completedSubjectLec}</span>
            </div>
          </div>

          {/* Search Chapter in Subject */}
          <div className="relative pt-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none mt-0.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="इस विषय का अध्याय खोजें..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Chapters List */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1 text-xs font-bold text-stone-600">
            <span>अध्याय सूची ({chapters.length})</span>
            <span className="text-[11px] text-stone-400">टैप करके लेक्चर्स देखें</span>
          </div>

          <div className="space-y-2">
            {chapters.map((chapterName, idx) => {
              const chapterLectures = getChapterLectures(selectedSubject.name, chapterName);
              const dueInChapter = chapterLectures.filter(
                (l) => l.status === "due_today" || (l.nextDueDate && l.nextDueDate <= todayStr && l.status !== "completed")
              ).length;

              return (
                <div
                  key={chapterName}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-amber-400 transition-all p-3 sm:p-3.5 flex items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => {
                      triggerHaptic(6);
                      setSelectedChapter(chapterName);
                      window.history.pushState({ chapter: chapterName }, "");
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-600 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors truncate">
                        {chapterName}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500 font-medium">
                        <span>{chapterLectures.length} लेक्चर्स</span>
                        {dueInChapter > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-amber-700 font-bold">{dueInChapter} आज नियत</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(8);
                        onOpenAddLecture(selectedSubject.name, chapterName);
                      }}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-900 transition-colors cursor-pointer"
                      title="इस अध्याय में नया लेक्चर जोड़ें"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setSelectedChapter(chapterName);
                        window.history.pushState({ chapter: chapterName }, "");
                      }}
                      className="p-1.5 rounded-lg text-stone-400 group-hover:text-stone-800 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  /* =========================================================================
     LEVEL 1: ALL 21 SUBJECTS DIRECTORY ROOT
     ========================================================================= */
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER & SEARCH BAR */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInternalBack}
              className="p-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
              aria-label="वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                विषय एवं अध्याय निर्देशिका
              </h2>
              <p className="text-xs text-stone-500">
                21 आधिकारिक विषय • {totalSyllabusChapters}+ अध्यायों का सम्पूर्ण पाठ्यक्रम
              </p>
            </div>
          </div>

          {/* Syllabus Export Buttons (Excel & CSV) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                executeDataExport({
                  lectures,
                  dataset: "syllabus",
                  format: "xlsx",
                });
              }}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="संपूर्ण सिलेबस Excel (.xlsx) में डाउनलोड करें"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>सिलेबस Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                executeDataExport({
                  lectures,
                  dataset: "syllabus",
                  format: "csv",
                });
              }}
              className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 border border-stone-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="संपूर्ण सिलेबस CSV (.csv) में डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5" />
              <span>सिलेबस CSV</span>
            </button>

            {onOpenExportModal && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  onOpenExportModal("syllabus", "ALL");
                }}
                className="py-2 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="कस्टम एक्सपोर्ट विकल्प खोलें"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden md:inline">रिकॉर्ड + सिलेबस</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="विषय या अध्याय का नाम खोजें..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
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

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic(6);
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-stone-950 font-black shadow-2xs"
                  : "bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. SUBJECTS LIST */}
      <section className="space-y-3">
        {filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 shadow-xs space-y-2">
            <p className="text-sm font-bold text-stone-700">कोई विषय नहीं मिला</p>
            <p className="text-xs text-stone-400">कृपया दूसरा नाम लिखकर खोजें</p>
          </div>
        ) : (
          filteredSubjects.map((subject) => {
            const subjectLectures = getSubjectLectures(subject.name);
            const masteredSubjectCount = subjectLectures.filter(
              (l) => l.revisionCount >= 4 || l.status === "completed"
            ).length;
            const completionPct = subjectLectures.length > 0
              ? Math.round((masteredSubjectCount / subjectLectures.length) * 100)
              : 0;

            return (
              <div
                key={subject.id}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden transition-all hover:border-amber-400 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    onClick={() => {
                      triggerHaptic(8);
                      setSelectedSubject(subject);
                      window.history.pushState({ subject: subject.name }, "");
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      <BookOpen className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                        {subject.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[11px]">
                          {subject.chapters.length} अध्याय
                        </span>
                        <span>•</span>
                        <span>{subjectLectures.length} लेक्चर्स</span>
                        <span>•</span>
                        <span className="truncate">{subject.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(8);
                        onOpenAddLecture(subject.name);
                      }}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="इस विषय में नया लेक्चर जोड़ें"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span className="hidden sm:inline">लेक्चर जोड़ें</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(8);
                        setSelectedSubject(subject);
                        window.history.pushState({ subject: subject.name }, "");
                      }}
                      className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                      aria-label="अध्याय देखें"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar if user has lectures in this subject */}
                {subjectLectures.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-stone-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                      <span>कंठस्थ प्रगति</span>
                      <span>{masteredSubjectCount} / {subjectLectures.length} ({completionPct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
