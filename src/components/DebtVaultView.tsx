import React, { useState, useMemo, useEffect } from "react";
import { 
  Folder, 
  FolderOpen, 
  FolderPlus,
  FolderMinus,
  ChevronDown, 
  ChevronRight, 
  RotateCcw, 
  Search, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  LayoutGrid, 
  Box, 
  FolderTree, 
  FileText, 
  Home, 
  Eye, 
  X, 
  Zap, 
  CheckCircle2, 
  Filter
} from "lucide-react";
import { LectureItem } from "../types";
import { InfoTip } from "./InfoTip";

export type DebtVaultViewMode = "folder" | "box" | "grid";

interface DebtVaultViewProps {
  lectures: LectureItem[];
  onReactivateLecture: (lectureId: string) => void;
  onOpenDebtResetModal: () => void;
  onRestoreAllArchived: () => void;
}

export const DebtVaultView: React.FC<DebtVaultViewProps> = ({
  lectures,
  onReactivateLecture,
  onOpenDebtResetModal,
  onRestoreAllArchived,
}) => {
  // View Mode: folder | box | grid
  const [viewMode, setViewMode] = useState<DebtVaultViewMode>(() => {
    const saved = localStorage.getItem("debt_vault_view_mode");
    if (saved === "box" || saved === "grid" || saved === "folder") {
      return saved;
    }
    return "folder";
  });

  const handleSetViewMode = (mode: DebtVaultViewMode) => {
    setViewMode(mode);
    localStorage.setItem("debt_vault_view_mode", mode);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [activeFilter, setActiveFilter] = useState<"all" | "doubts" | "mistakes" | "hard">("all");
  // Tracks expanded states for subjects, chapters and folders (false/undefined by default so folders are closed!)
  const [openBoxes, setOpenBoxes] = useState<Record<string, boolean>>({});
  const [showConfirmRestoreAll, setShowConfirmRestoreAll] = useState<boolean>(false);
  const [selectedLectureForDetails, setSelectedLectureForDetails] = useState<LectureItem | null>(null);
  const [recentlyReactivatedId, setRecentlyReactivatedId] = useState<string | null>(null);

  // For Folder Navigation (Subject -> Chapter -> Lectures)
  const [folderCurrentSubject, setFolderCurrentSubject] = useState<string | null>(null);
  const [folderCurrentChapter, setFolderCurrentChapter] = useState<string | null>(null);

  const archivedLectures = useMemo(() => lectures.filter((l) => l.status === "archived"), [lectures]);

  const subjects = useMemo(() => {
    return Array.from(new Set(archivedLectures.map((l) => l.subject))).filter(Boolean);
  }, [archivedLectures]);

  // Group archived lectures by Subject and Chapter with filter application
  const groupedData = useMemo(() => {
    const map: Record<string, Record<string, LectureItem[]>> = {};

    archivedLectures.forEach((item) => {
      if (selectedSubject !== "ALL" && item.subject !== selectedSubject) return;

      // Filter tabs
      if (activeFilter === "doubts" && !item.geminiDoubts) return;
      if (activeFilter === "mistakes" && !item.previousMistakes) return;
      if (activeFilter === "hard" && item.lastRating !== "Hard") return;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches = 
          item.title.toLowerCase().includes(q) ||
          item.chapter.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          (item.geminiDoubts && item.geminiDoubts.toLowerCase().includes(q)) ||
          (item.previousMistakes && item.previousMistakes.toLowerCase().includes(q));
        if (!matches) return;
      }

      if (!map[item.subject]) {
        map[item.subject] = {};
      }
      if (!map[item.subject][item.chapter]) {
        map[item.subject][item.chapter] = [];
      }
      map[item.subject][item.chapter].push(item);
    });

    return map;
  }, [archivedLectures, selectedSubject, activeFilter, searchTerm]);

  // Count visible lectures
  const visibleCount = useMemo(() => {
    let count = 0;
    Object.values(groupedData).forEach((chapters) => {
      Object.values(chapters).forEach((items) => {
        count += items.length;
      });
    });
    return count;
  }, [groupedData]);

  // List of all visible chapter keys in current filter/subject
  const allVisibleChapterKeys = useMemo(() => {
    const keys: string[] = [];
    Object.entries(groupedData).forEach(([subj, chaps]) => {
      Object.keys(chaps).forEach((chap) => {
        keys.push(`${subj}:::${chap}`);
      });
    });
    return keys;
  }, [groupedData]);

  // Are all visible chapters currently expanded?
  const areAllVisibleExpanded = useMemo(() => {
    if (allVisibleChapterKeys.length === 0) return false;
    return allVisibleChapterKeys.every((key) => !!openBoxes[key]);
  }, [allVisibleChapterKeys, openBoxes]);

  // 1-Touch Master Toggle: Touch once to open all, touch again to close all at once!
  const handleToggleAllFolders = () => {
    if (areAllVisibleExpanded) {
      // Close all chapter folders
      setOpenBoxes((prev) => {
        const next = { ...prev };
        allVisibleChapterKeys.forEach((key) => {
          next[key] = false;
        });
        return next;
      });
    } else {
      // Open all visible subject containers and chapter folders
      setOpenBoxes((prev) => {
        const next = { ...prev };
        Object.keys(groupedData).forEach((subj) => {
          next[`subj:::${subj}`] = true;
        });
        allVisibleChapterKeys.forEach((key) => {
          next[key] = true;
        });
        return next;
      });
    }
  };

  // Check if a specific subject's chapters are all expanded
  const isSubjectExpanded = (subjectName: string) => {
    const chaps = Object.keys(groupedData[subjectName] || {});
    if (chaps.length === 0) return false;
    return chaps.every((chap) => !!openBoxes[`${subjectName}:::${chap}`]);
  };

  // Toggle a single subject's chapters (Open all / Close all for that subject in 1 touch)
  const handleToggleSubjectFolders = (subjectName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const chaps = Object.keys(groupedData[subjectName] || {});
    const currentlyExpanded = isSubjectExpanded(subjectName);
    setOpenBoxes((prev) => {
      const next = { ...prev };
      next[`subj:::${subjectName}`] = true; // keep subject box open
      chaps.forEach((chap) => {
        next[`${subjectName}:::${chap}`] = !currentlyExpanded;
      });
      return next;
    });
  };

  // Toggle single container / box
  const toggleBox = (key: string) => {
    setOpenBoxes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleReactivateWithFeedback = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecentlyReactivatedId(id);
    onReactivateLecture(id);
    setTimeout(() => {
      setRecentlyReactivatedId((curr) => (curr === id ? null : curr));
    }, 2500);
  };

  const handleRestoreChapter = (items: LectureItem[], e: React.MouseEvent) => {
    e.stopPropagation();
    items.forEach((item) => {
      onReactivateLecture(item.id);
    });
  };

  const handleRestoreSubject = (subjectName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const subjectChapters = groupedData[subjectName] || {};
    Object.values(subjectChapters).forEach((items) => {
      items.forEach((item) => onReactivateLecture(item.id));
    });
  };

  // If search changes and user is typing query, expand matching boxes
  useEffect(() => {
    if (searchTerm.trim()) {
      const all: Record<string, boolean> = {};
      Object.entries(groupedData).forEach(([subj, chaps]) => {
        all[`subj:::${subj}`] = true;
        Object.keys(chaps).forEach((ch) => {
          all[`${subj}:::${ch}`] = true;
        });
      });
      setOpenBoxes(all);
    }
  }, [searchTerm, groupedData]);

  return (
    <div className="space-y-4">
      {/* 1. App Header & View Mode Switcher */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/80 shadow-md glass-specular">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
                <FolderOpen className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                सुरक्षित लेक्चर्स
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {archivedLectures.length} लेक्चर्स सुरक्षित
              </span>
              <InfoTip
                title="सुरक्षित लेक्चर्स (वॉल्ट)"
                content="यहाँ वे लेक्चर्स संग्रहीत हैं जो मुख्य अध्ययन कतार को साफ़ रखने के लिए वॉल्ट में डाले गए थे। इन्हें आप कभी भी एक क्लिक में मुख्य कॉकपिट में वापस सक्रिय कर सकते हैं।"
              />
            </div>
            <p className="text-xs text-stone-500">
              ऐप-स्टाइल नेविगेशन: 1-टच में सारे फोल्डर खोलें या बंद करें। किसी भी समय लेक्चर्स सक्रिय या विवरण देखें।
            </p>
          </div>

          {/* View Modes and Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 3 View Mode Switcher: Folder | Box | Grid */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200 shadow-2xs">
              <button
                id="btn-view-folder"
                onClick={() => handleSetViewMode("folder")}
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === "folder"
                    ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                title="फ़ोल्डर व्यू: विषय > अध्याय > लेक्चर्स"
                aria-label="फ़ोल्डर व्यू"
              >
                <FolderTree className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="hidden sm:inline">फ़ोल्डर (Folder)</span>
              </button>

              <button
                id="btn-view-box"
                onClick={() => handleSetViewMode("box")}
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === "box"
                    ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                title="बॉक्स व्यू: नेस्टेड कार्ड्स व कंटेनर्स"
                aria-label="बॉक्स व्यू"
              >
                <Box className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="hidden sm:inline">बॉक्स (Box)</span>
              </button>

              <button
                id="btn-view-grid"
                onClick={() => handleSetViewMode("grid")}
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                title="ग्रिड व्यू: मल्टी-कॉलम मैट्रिक्स कार्ड्स"
                aria-label="ग्रिड व्यू"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">ग्रिड (Grid)</span>
              </button>
            </div>

            {/* 1-Touch Master Toggle: All Folders Expand / Collapse */}
            <button
              id="btn-toggle-all-folders"
              onClick={handleToggleAllFolders}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs border ${
                areAllVisibleExpanded
                  ? "bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200"
                  : "bg-stone-900 text-white border-stone-900 hover:bg-stone-800"
              }`}
              title="एक टच में सारे फोल्डर खोलें या बंद करें"
              aria-label={areAllVisibleExpanded ? "सारे फोल्डर बंद करें" : "सारे फोल्डर खोलें"}
            >
              {areAllVisibleExpanded ? (
                <>
                  <FolderMinus className="w-4 h-4 text-amber-900 shrink-0" />
                  <span className="hidden sm:inline">सारे फोल्डर बंद करें</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">सारे फोल्डर खोलें</span>
                </>
              )}
            </button>

            {/* Quick Actions */}
            <button
              id="btn-open-triage"
              onClick={onOpenDebtResetModal}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center space-x-1.5 transition-all shadow-2xs shrink-0"
              title="रणनीतिक छंटाई व सक्रिय चुनाव"
              aria-label="सक्रिय चुनाव"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">सक्रिय चुनाव</span>
            </button>

            {archivedLectures.length > 0 && (
              <button
                id="btn-restore-all-archived"
                onClick={() => setShowConfirmRestoreAll(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center space-x-1.5 transition-colors shrink-0"
                title="सभी लेक्चर्स वापस सक्रिय करें"
                aria-label="सभी रीस्टोर करें"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="hidden sm:inline">सभी रीस्टोर करें</span>
              </button>
            )}
          </div>
        </div>

        {/* Restore All Confirm Banner */}
        {showConfirmRestoreAll && (
          <div className="mt-3.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-950 animate-in fade-in">
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                क्या आप सभी <strong>{archivedLectures.length} लेक्चर्स</strong> को मुख्य अध्ययन कतार में वापस लाना चाहते हैं?
              </span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setShowConfirmRestoreAll(false)}
                className="px-3 py-1 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-200/60"
              >
                रद्द करें
              </button>
              <button
                onClick={() => {
                  onRestoreAllArchived();
                  setShowConfirmRestoreAll(false);
                }}
                className="px-3.5 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                हाँ, सभी वापस लाएं
              </button>
            </div>
          </div>
        )}

        {/* Search & Subject Bar */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="लेक्चर, चैप्टर या विषय खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Feature Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === "all"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              सभी ({archivedLectures.length})
            </button>

            <button
              onClick={() => setActiveFilter("doubts")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                activeFilter === "doubts"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60"
              }`}
            >
              <span>🎯 कठिन डाउट्स</span>
            </button>

            <button
              onClick={() => setActiveFilter("mistakes")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                activeFilter === "mistakes"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
              }`}
            >
              <span>⚠️ पिछली गलतियाँ</span>
            </button>

            <button
              onClick={() => setActiveFilter("hard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                activeFilter === "hard"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60"
              }`}
            >
              <span>⚡ हार्ड रेटेड</span>
            </button>
          </div>
        </div>

        {/* Subject Selection Row with 1-Touch Toggle Feedback */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-stone-400 text-[11px] font-semibold flex items-center space-x-1 mr-1">
              <Filter className="w-3 h-3" />
              <span>विषय चुनें:</span>
            </span>
            <button
              onClick={() => {
                setSelectedSubject("ALL");
                setFolderCurrentSubject(null);
                setFolderCurrentChapter(null);
                // Keep folders closed so user is not overwhelmed
                setOpenBoxes({});
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedSubject === "ALL" && !folderCurrentSubject
                  ? "bg-stone-900 text-white font-bold shadow-2xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              सभी विषय
            </button>
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubject(sub);
                  setFolderCurrentSubject(sub);
                  setFolderCurrentChapter(null);
                  // Closed by default so folders aren't open when subject is selected!
                  setOpenBoxes({ [`subj:::${sub}`]: true });
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedSubject === sub
                    ? "bg-stone-900 text-white font-bold shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Quick 1-Touch toggle for currently selected subject */}
          {selectedSubject !== "ALL" && (
            <button
              onClick={(e) => handleToggleSubjectFolders(selectedSubject, e)}
              className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              {isSubjectExpanded(selectedSubject) ? (
                <>
                  <FolderMinus className="w-3.5 h-3.5 text-amber-800" />
                  <span>{selectedSubject} के सारे फोल्डर बंद करें</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-3.5 h-3.5 text-amber-700" />
                  <span>{selectedSubject} के सारे फोल्डर खोलें</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Reactivation Success Toast */}
      {recentlyReactivatedId && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>लेक्चर सफलतापूर्वक मुख्य अध्ययन कॉकपिट में सक्रिय कर दिया गया है!</span>
          </div>
          <button
            onClick={() => setRecentlyReactivatedId(null)}
            className="text-emerald-100 hover:text-white text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {visibleCount === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <Folder className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">
            {archivedLectures.length === 0
              ? "वॉल्ट में कोई बैकलॉग नहीं है!"
              : "फ़िल्टर के अनुसार कोई लेक्चर्स नहीं मिले"}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {archivedLectures.length === 0
              ? "सभी लेक्चर्स मुख्य स्टडी कॉकपिट में सक्रिय हैं।"
              : "कृपया सर्च या फ़िल्टर बदलकर देखें।"}
          </p>
          {(searchTerm || activeFilter !== "all" || selectedSubject !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
                setSelectedSubject("ALL");
              }}
              className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              सभी फ़िल्टर साफ़ करें
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ========================================================
              MODE 1: FOLDER VIEW (विषय फ़ोल्डर > अध्याय फ़ोल्डर > लेक्चर्स)
              ======================================================== */}
          {viewMode === "folder" && (
            <div className="space-y-4">
              {/* App Breadcrumb Bar with 1-Touch Toggle */}
              <div className="bg-white rounded-xl p-3 border border-stone-200 shadow-2xs flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center space-x-1.5 text-stone-600 flex-wrap">
                  <button
                    onClick={() => {
                      setFolderCurrentSubject(null);
                      setFolderCurrentChapter(null);
                      setSelectedSubject("ALL");
                    }}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      !folderCurrentSubject
                        ? "bg-amber-100 text-amber-950 font-bold"
                        : "hover:bg-stone-100 text-stone-700"
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-amber-700" />
                    <span>सभी विषय ({Object.keys(groupedData).length})</span>
                  </button>

                  {folderCurrentSubject && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                      <button
                        onClick={() => setFolderCurrentChapter(null)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                          !folderCurrentChapter
                            ? "bg-amber-100 text-amber-950 font-bold"
                            : "hover:bg-stone-100 text-stone-700"
                        }`}
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>{folderCurrentSubject}</span>
                      </button>
                    </>
                  )}

                  {folderCurrentChapter && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                      <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-900 text-white font-bold">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>{folderCurrentChapter}</span>
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {folderCurrentSubject && !folderCurrentChapter && (
                    <button
                      onClick={(e) => handleToggleSubjectFolders(folderCurrentSubject, e)}
                      className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                    >
                      {isSubjectExpanded(folderCurrentSubject) ? (
                        <>
                          <FolderMinus className="w-3.5 h-3.5 text-stone-600" />
                          <span>सारे अध्याय समेटें</span>
                        </>
                      ) : (
                        <>
                          <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                          <span>सारे अध्याय खोलें</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Back button */}
                  {folderCurrentSubject && (
                    <button
                      onClick={() => {
                        if (folderCurrentChapter) {
                          setFolderCurrentChapter(null);
                        } else {
                          setFolderCurrentSubject(null);
                          setSelectedSubject("ALL");
                        }
                      }}
                      className="flex items-center space-x-1 text-stone-600 hover:text-stone-900 font-bold text-xs px-2.5 py-1 rounded-lg hover:bg-stone-100"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>पीछे जाएं</span>
                    </button>
                  )}
                </div>
              </div>

              {/* LEVEL 1: SUBJECT FOLDER CARDS (When no subject is chosen) */}
              {!folderCurrentSubject && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(groupedData).map(([subjectName, chaptersMap]) => {
                    const chapterCount = Object.keys(chaptersMap).length;
                    const lectureItems = Object.values(chaptersMap).flat();
                    const lectureCount = lectureItems.length;
                    const totalEstimatedMins = lectureItems.reduce(
                      (acc, i) => acc + (i.avgTimeMinutes || 20),
                      0
                    );

                    return (
                      <div
                        key={subjectName}
                        onClick={() => {
                          setFolderCurrentSubject(subjectName);
                          setSelectedSubject(subjectName);
                          setFolderCurrentChapter(null);
                          setOpenBoxes({ [`subj:::${subjectName}`]: true });
                        }}
                        className="bg-white rounded-2xl p-5 border border-stone-200/90 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-3.5">
                          {/* Top Row */}
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200/80 transition-colors">
                              <Folder className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                              {lectureCount} लेक्चर्स
                            </span>
                          </div>

                          {/* Info */}
                          <div>
                            <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                              {subjectName}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-stone-500 mt-1">
                              <span>{chapterCount} अध्याय फ़ोल्डर्स</span>
                              <span>•</span>
                              <span>~{totalEstimatedMins} मिनट</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions in Card */}
                        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-700 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                            <span>अध्याय खोलें</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>

                          <button
                            onClick={(e) => handleRestoreSubject(subjectName, e)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1 transition-colors"
                            title="इस पूरे विषय के सभी लेक्चर्स सक्रिय करें"
                          >
                            <RotateCcw className="w-3 h-3 text-emerald-600" />
                            <span>पूरा विषय सक्रिय</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* LEVEL 2: CHAPTER FOLDERS (Inside a selected subject) */}
              {folderCurrentSubject && !folderCurrentChapter && (
                <div className="space-y-3.5">
                  {/* Subject Summary Banner */}
                  <div className="bg-gradient-to-r from-amber-50/90 to-stone-50 p-4 rounded-2xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300/60">
                        <BookOpen className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-stone-900">
                          {folderCurrentSubject} के अध्याय फ़ोल्डर्स
                        </h3>
                        <p className="text-xs text-stone-600">
                          टच करके किसी अध्याय के लेक्चर्स देखें या 'सारे अध्याय खोलें' बटन से एक बार में सारे फोल्डर खोलें।
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={(e) => handleToggleSubjectFolders(folderCurrentSubject, e)}
                        className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs shrink-0"
                      >
                        {isSubjectExpanded(folderCurrentSubject) ? (
                          <>
                            <FolderMinus className="w-4 h-4 text-amber-300" />
                            <span>📁 सारे अध्याय बंद करें</span>
                          </>
                        ) : (
                          <>
                            <FolderPlus className="w-4 h-4 text-amber-400" />
                            <span>📂 सारे अध्याय एक साथ खोलें</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => handleRestoreSubject(folderCurrentSubject, e)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>पूरा विषय सक्रिय करें</span>
                      </button>
                    </div>
                  </div>

                  {/* Chapter Cards Grid (Can be viewed as compact folder cards OR expanded inline) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {Object.entries(groupedData[folderCurrentSubject] || {}).map(([chapterName, items]) => {
                      const doubtsCount = items.filter((i) => i.geminiDoubts).length;
                      const mistakesCount = items.filter((i) => i.previousMistakes).length;
                      const chapKey = `${folderCurrentSubject}:::${chapterName}`;
                      const isChapterExpanded = !!openBoxes[chapKey];

                      return (
                        <div
                          key={chapterName}
                          className={`bg-white rounded-2xl border transition-all flex flex-col justify-between ${
                            isChapterExpanded
                              ? "border-amber-400 shadow-sm col-span-1 sm:col-span-2 lg:col-span-3"
                              : "border-stone-200 hover:border-amber-300 shadow-2xs"
                          }`}
                        >
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div
                                onClick={() => toggleBox(chapKey)}
                                className="flex items-center space-x-2.5 cursor-pointer"
                              >
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
                                  {isChapterExpanded ? (
                                    <FolderOpen className="w-5 h-5 text-amber-600" />
                                  ) : (
                                    <Folder className="w-5 h-5 text-amber-600" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-stone-900 hover:text-amber-800 transition-colors">
                                    {chapterName}
                                  </h4>
                                  <span className="text-[11px] text-stone-500">
                                    {items.length} लेक्चर्स
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => toggleBox(chapKey)}
                                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center space-x-1"
                                >
                                  {isChapterExpanded ? (
                                    <>
                                      <span>समेटें</span>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </>
                                  ) : (
                                    <>
                                      <span>खोलें</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                              {doubtsCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  🎯 {doubtsCount} डाउट्स
                                </span>
                              )}
                              {mistakesCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  ⚠️ {mistakesCount} गलतियां
                                </span>
                              )}
                            </div>
                          </div>

                          {/* If expanded inline, show lecture cards */}
                          {isChapterExpanded && (
                            <div className="p-4 border-t border-stone-100 bg-stone-50/50 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in">
                              {items.map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs space-y-2 flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                        L-{String(item.lectureNumber).padStart(2, "0")}
                                      </span>
                                      <span className="text-[10px] text-stone-500 font-semibold">
                                        रिवीज़न: {item.revisionCount}x
                                      </span>
                                    </div>
                                    <h5 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">
                                      {item.title}
                                    </h5>
                                    {item.geminiDoubts && (
                                      <p className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded mt-1 truncate border border-rose-200">
                                        🎯 {item.geminiDoubts}
                                      </p>
                                    )}
                                  </div>

                                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                    <button
                                      onClick={() => setSelectedLectureForDetails(item)}
                                      className="text-[11px] font-bold text-stone-600 hover:text-stone-900 flex items-center space-x-1"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>विवरण</span>
                                    </button>
                                    <button
                                      onClick={() => handleReactivateWithFeedback(item.id)}
                                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1 shadow-2xs"
                                    >
                                      <Zap className="w-3 h-3 text-emerald-200" />
                                      <span>सक्रिय करें</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="p-3 border-t border-stone-100 bg-stone-50/30 flex items-center justify-between text-xs">
                            <button
                              onClick={() => setFolderCurrentChapter(chapterName)}
                              className="font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1"
                            >
                              <span>अध्याय अलग पेज पर खोलें</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleRestoreChapter(items, e)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1 transition-colors"
                              title="इस अध्याय के सभी लेक्चर्स सक्रिय करें"
                            >
                              <RotateCcw className="w-3 h-3 text-emerald-600" />
                              <span>सक्रिय करें</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEVEL 3: LECTURE CARDS DECK (Inside a chosen chapter) */}
              {folderCurrentSubject && folderCurrentChapter && (
                <div className="space-y-3.5">
                  {/* Chapter Header Card */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
                        <FolderOpen className="w-6 h-6 text-amber-700" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                            {folderCurrentSubject}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-xs font-semibold text-stone-500">
                            {(groupedData[folderCurrentSubject]?.[folderCurrentChapter] || []).length} लेक्चर्स
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-stone-900">
                          {folderCurrentChapter}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={(e) =>
                        handleRestoreChapter(
                          groupedData[folderCurrentSubject]?.[folderCurrentChapter] || [],
                          e
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs shrink-0"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>पूरा अध्याय कॉकपिट में सक्रिय करें</span>
                    </button>
                  </div>

                  {/* App-grade Lecture Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {(groupedData[folderCurrentSubject]?.[folderCurrentChapter] || []).map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                      >
                        {/* Card Header: Badge & Status */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                L-{String(item.lectureNumber).padStart(2, "0")}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-600">
                                रिवीज़न: {item.revisionCount}x
                              </span>
                            </div>

                            {item.lastRating && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.lastRating === "Hard"
                                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                                    : item.lastRating === "Medium"
                                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}
                              >
                                {item.lastRating === "Hard"
                                  ? "कठिन (Hard)"
                                  : item.lastRating === "Medium"
                                  ? "मध्यम (Med)"
                                  : "सरल (Easy)"}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="text-sm font-bold text-stone-900 mt-2.5 leading-snug">
                            {item.title}
                          </h4>

                          {/* Feature Callouts (Doubts / Traps / Mistakes) */}
                          <div className="space-y-1.5 mt-2.5">
                            {item.geminiDoubts && (
                              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs flex items-start space-x-2">
                                <span className="shrink-0 text-rose-600 font-bold">🎯 डाउट:</span>
                                <span className="line-clamp-2">{item.geminiDoubts}</span>
                              </div>
                            )}

                            {item.previousMistakes && (
                              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs flex items-start space-x-2">
                                <span className="shrink-0 text-amber-700 font-bold">⚠️ गलती:</span>
                                <span className="line-clamp-2">{item.previousMistakes}</span>
                              </div>
                            )}

                            {item.calculationTricks && (
                              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-950 text-xs flex items-start space-x-2">
                                <span className="shrink-0 text-blue-700 font-bold">💡 ट्रिक:</span>
                                <span className="line-clamp-1">{item.calculationTricks}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive App Action Buttons */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedLectureForDetails(item)}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-stone-500" />
                            <span>विवरण व नोट्स</span>
                          </button>

                          <button
                            onClick={() => handleReactivateWithFeedback(item.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
                          >
                            <Zap className="w-3.5 h-3.5 text-emerald-200" />
                            <span>कॉकपिट में लाएं</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              MODE 2: BOX VIEW (नेस्टेड कार्ड्स व कंटेनर बॉक्सेस)
              ======================================================== */}
          {viewMode === "box" && (
            <div className="space-y-4">
              {Object.entries(groupedData).map(([subjectName, chaptersMap]) => {
                const chapterEntries = Object.entries(chaptersMap);
                if (chapterEntries.length === 0) return null;
                const subjKey = `subj:::${subjectName}`;
                // Subject container is open if in openBoxes or if search is active
                const isSubjOpen = openBoxes[subjKey] !== false;
                const totalSubjLectures = chapterEntries.reduce((acc, [, items]) => acc + items.length, 0);

                return (
                  <div
                    key={subjectName}
                    className="bg-white rounded-2xl border-2 border-stone-200/90 shadow-xs overflow-hidden"
                  >
                    {/* Subject Box Header */}
                    <div
                      onClick={() => toggleBox(subjKey)}
                      className="p-4 bg-stone-50/90 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-stone-100/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-stone-400">
                          {isSubjOpen ? <ChevronDown className="w-4 h-4 text-stone-700" /> : <ChevronRight className="w-4 h-4" />}
                        </span>
                        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-300/50">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-stone-900">
                            {subjectName}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-stone-500">
                            <span>{chapterEntries.length} अध्याय</span>
                            <span>•</span>
                            <span className="font-semibold text-stone-700">{totalSubjLectures} कुल लेक्चर्स</span>
                          </div>
                        </div>
                      </div>

                      {/* 1-Touch Subject Folders Toggle & Restore */}
                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        <button
                          onClick={(e) => handleToggleSubjectFolders(subjectName, e)}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
                          title="इस विषय के सारे फोल्डर एक साथ खोलें या बंद करें"
                        >
                          {isSubjectExpanded(subjectName) ? (
                            <>
                              <FolderMinus className="w-3.5 h-3.5 text-stone-600" />
                              <span>सारे अध्याय समेटें</span>
                            </>
                          ) : (
                            <>
                              <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                              <span>सारे अध्याय खोलें</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => handleRestoreSubject(subjectName, e)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">पूरा विषय सक्रिय</span>
                        </button>
                      </div>
                    </div>

                    {/* Subject Box Inner Content (Chapters - CLOSED by default!) */}
                    {isSubjOpen && (
                      <div className="p-3 sm:p-4 space-y-3 bg-stone-50/30">
                        {chapterEntries.map(([chapterName, items]) => {
                          const chapKey = `${subjectName}:::${chapterName}`;
                          // Closed by default so user is not overwhelmed when selecting a subject!
                          const isChapOpen = !!openBoxes[chapKey];

                          return (
                            <div
                              key={chapKey}
                              className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden"
                            >
                              {/* Chapter Sub-Box Header */}
                              <div
                                onClick={() => toggleBox(chapKey)}
                                className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-stone-50/80 transition-colors"
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <span className="text-stone-400">
                                    {isChapOpen ? <ChevronDown className="w-3.5 h-3.5 text-stone-700" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                  </span>
                                  {isChapOpen ? (
                                    <FolderOpen className="w-4 h-4 text-amber-600 shrink-0" />
                                  ) : (
                                    <Folder className="w-4 h-4 text-amber-600 shrink-0" />
                                  )}
                                  <span className="text-xs sm:text-sm font-bold text-stone-800 truncate">
                                    {chapterName}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 shrink-0">
                                    {items.length} लेक्चर्स
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                  <span className="text-[11px] font-bold text-stone-500">
                                    {isChapOpen ? "समेटें" : "खोलें"}
                                  </span>
                                  <button
                                    onClick={(e) => handleRestoreChapter(items, e)}
                                    className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1 transition-colors"
                                  >
                                    <RotateCcw className="w-3 h-3 text-emerald-600" />
                                    <span>अध्याय सक्रिय</span>
                                  </button>
                                </div>
                              </div>

                              {/* Chapter Lecture Cards - Shown ONLY when opened */}
                              {isChapOpen && (
                                <div className="border-t border-stone-100 bg-stone-50/40 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in">
                                  {items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-300 shadow-2xs transition-all flex flex-col justify-between space-y-2"
                                    >
                                      <div>
                                        <div className="flex items-center justify-between">
                                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                            L-{String(item.lectureNumber).padStart(2, "0")}
                                          </span>
                                          <span className="text-[10px] text-stone-500 font-medium">
                                            रिवीज़न: {item.revisionCount}x
                                          </span>
                                        </div>

                                        <p className="text-xs font-bold text-stone-900 mt-1.5 line-clamp-1">
                                          {item.title}
                                        </p>

                                        {item.geminiDoubts && (
                                          <p className="text-[10px] text-rose-700 bg-rose-50 px-2 py-1 rounded-md mt-1.5 truncate border border-rose-200">
                                            🎯 {item.geminiDoubts}
                                          </p>
                                        )}
                                      </div>

                                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                        <button
                                          onClick={() => setSelectedLectureForDetails(item)}
                                          className="text-[11px] font-bold text-stone-600 hover:text-stone-900 flex items-center space-x-1"
                                        >
                                          <Eye className="w-3 h-3" />
                                          <span>विवरण</span>
                                        </button>

                                        <button
                                          onClick={() => handleReactivateWithFeedback(item.id)}
                                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1 shadow-2xs"
                                        >
                                          <Zap className="w-3 h-3 text-emerald-200" />
                                          <span>सक्रिय करें</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================
              MODE 3: GRID VIEW (मल्टी-कॉलम मैट्रिक्स कार्ड्स)
              ======================================================== */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {Object.entries(groupedData).flatMap(([subjectName, chaptersMap]) =>
                Object.entries(chaptersMap).map(([chapterName, items]) => {
                  const gridKey = `${subjectName}:::${chapterName}`;
                  // Closed by default unless toggled or search active
                  const isExpanded = !!openBoxes[gridKey];

                  return (
                    <div
                      key={gridKey}
                      className="bg-white rounded-2xl border border-stone-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden"
                    >
                      {/* Grid Card Top */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                            {subjectName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            {items.length} लेक्चर्स
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-stone-900 line-clamp-1">
                            {chapterName}
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {items.map((i) => `L${i.lectureNumber}`).slice(0, 4).join(", ")}
                            {items.length > 4 ? ` +${items.length - 4} और` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Expandable Lectures List in Grid Card - Shown when expanded */}
                      {isExpanded && (
                        <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/50 max-h-56 overflow-y-auto space-y-2 animate-in fade-in">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs gap-2"
                            >
                              <div className="truncate flex-1 min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-[10px] font-mono font-bold text-amber-800">
                                    L{item.lectureNumber}
                                  </span>
                                  <span className="truncate font-bold text-stone-800 text-[11px]">
                                    {item.title}
                                  </span>
                                </div>
                                {item.geminiDoubts && (
                                  <p className="text-[10px] text-rose-600 truncate mt-0.5">
                                    🎯 {item.geminiDoubts}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center space-x-1 shrink-0">
                                <button
                                  onClick={() => setSelectedLectureForDetails(item)}
                                  className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                                  title="विवरण देखें"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleReactivateWithFeedback(item.id)}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                                >
                                  सक्रिय
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Grid Card Footer */}
                      <div className="p-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                        <button
                          onClick={() => toggleBox(gridKey)}
                          className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 flex items-center space-x-1"
                        >
                          <span>{isExpanded ? "समेटें" : "लेक्चर्स देखें"}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => handleRestoreChapter(items, e)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 shadow-2xs"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>पूरा सक्रिय ({items.length})</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {/* ========================================================
          LECTURE DETAILS APP MODAL (विवरण व माइक्रो-नोट्स)
          ======================================================== */}
      {selectedLectureForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    L-{String(selectedLectureForDetails.lectureNumber).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {selectedLectureForDetails.subject} • {selectedLectureForDetails.chapter}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  {selectedLectureForDetails.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLectureForDetails(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-[10px] text-stone-500 font-semibold">रिवीज़न संख्या</p>
                <p className="text-sm font-bold text-stone-900">
                  {selectedLectureForDetails.revisionCount} बार
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-[10px] text-stone-500 font-semibold">औसत समय</p>
                <p className="text-sm font-bold text-stone-900">
                  {selectedLectureForDetails.avgTimeMinutes || 20}m
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-[10px] text-stone-500 font-semibold">कठिनता</p>
                <p className="text-sm font-bold text-stone-900">
                  {selectedLectureForDetails.lastRating || "सामान्य"}
                </p>
              </div>
            </div>

            {/* Micro Notes & Doubts */}
            <div className="space-y-3">
              {selectedLectureForDetails.geminiDoubts && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                  <span className="font-bold text-rose-800 flex items-center space-x-1">
                    <span>🎯 कठिन कॉन्सेप्ट व डाउट्स</span>
                  </span>
                  <p className="text-rose-950 font-medium leading-relaxed">
                    {selectedLectureForDetails.geminiDoubts}
                  </p>
                </div>
              )}

              {selectedLectureForDetails.previousMistakes && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                  <span className="font-bold text-amber-800 flex items-center space-x-1">
                    <span>⚠️ पिछली बार हुई गलतियाँ</span>
                  </span>
                  <p className="text-amber-950 font-medium leading-relaxed">
                    {selectedLectureForDetails.previousMistakes}
                  </p>
                </div>
              )}

              {selectedLectureForDetails.calculationTricks && (
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                  <span className="font-bold text-blue-800 flex items-center space-x-1">
                    <span>💡 शॉर्टकट ट्रिक्स व याद रखने के बिंदु</span>
                  </span>
                  <p className="text-blue-950 font-medium leading-relaxed">
                    {selectedLectureForDetails.calculationTricks}
                  </p>
                </div>
              )}

              {selectedLectureForDetails.formulaNotes && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                  <span className="font-bold text-emerald-800 flex items-center space-x-1">
                    <span>📝 मुख्य सूत्र व फॉर्मूला</span>
                  </span>
                  <p className="text-emerald-950 font-medium leading-relaxed">
                    {selectedLectureForDetails.formulaNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedLectureForDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                बंद करें
              </button>

              <button
                onClick={() => {
                  handleReactivateWithFeedback(selectedLectureForDetails.id);
                  setSelectedLectureForDetails(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
              >
                <Zap className="w-4 h-4 text-emerald-200" />
                <span>मुख्य कॉकपिट में सक्रिय करें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
