import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  StickyNote, 
  Star, 
  CornerDownRight, 
  History, 
  CornerDownLeft, 
  ChevronRight,
  Layers,
  Settings,
  FileSpreadsheet,
  FileText,
  ShieldAlert,
  FolderOpen,
  Plus,
  PauseCircle,
  HelpCircle
} from "lucide-react";
import { LectureItem } from "../types";
import { SUBJECT_CHAPTER_CATALOG } from "../data/subjectChapterCatalog";
import { getTodayStr } from "../utils/revisionEngine";
import { triggerHaptic } from "../utils/haptics";
import { AppScreenId, OverlayId } from "../utils/navigationStack";

export type SearchDisplayType = "fullscreen" | "spotlight" | "bottom_sheet";

export type SearchResultType = "lecture" | "subject_chapter" | "tool";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  lecture?: LectureItem;
  subjectName?: string;
  chapterName?: string;
  screenTarget?: AppScreenId;
  overlayTarget?: OverlayId;
  snippet?: {
    source: string;
    text: string;
  };
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  lectures: LectureItem[];
  onSelectLecture: (lecture: LectureItem) => void;
  onNavigateToScreen: (screenId: AppScreenId, params?: Record<string, any>) => void;
  onOpenOverlay?: (overlayId: OverlayId, payload?: any) => void;
  displayType?: SearchDisplayType;
}

const RECENT_SEARCHES_KEY = "sm_recent_searches_universal";

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  lectures,
  onSelectLecture,
  onNavigateToScreen,
  onOpenOverlay,
  displayType = "fullscreen",
}) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "lectures" | "catalog" | "tools">("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const todayStr = useMemo(() => getTodayStr(), []);

  // Load recent searches on open
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) {
          setRecentSearches(JSON.parse(saved).slice(0, 5));
        }
      } catch {
        // ignore
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Lock body scroll when search is open
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((s) => s !== termToRemove);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  // 1. APP TOOLS CATALOG FOR SEARCH
  const appTools: Array<{
    id: string;
    title: string;
    subtitle: string;
    keywords: string[];
    icon: React.ReactNode;
    screenTarget?: AppScreenId;
    overlayTarget?: OverlayId;
  }> = [
    {
      id: "tool-add-lecture",
      title: "नया लेक्चर जोड़ें (+ Add Lecture)",
      subtitle: "किसी भी विषय में नया लेक्चर दर्ज करें",
      keywords: ["add", "new", "lecture", "नया", "लेक्चर", "जोड़ें", "plus"],
      icon: <Plus className="w-4 h-4 text-amber-700" />,
      overlayTarget: "add_lecture",
    },
    {
      id: "tool-focus-timer",
      title: "पढ़ाई का टाइमर (Focus Timer)",
      subtitle: "पोमोडोरो (25m), डीप वर्क (50m) व स्टॉपवॉच",
      keywords: ["timer", "pomodoro", "stopwatch", "टाइम", "टाइमर", "पोमोडोरो", "घड़ी"],
      icon: <Clock className="w-4 h-4 text-indigo-700" />,
      screenTarget: "focus_timer",
    },
    {
      id: "tool-notes-editor",
      title: "स्टडी नोट्स व सूत्र बैंक (Notes Bank)",
      subtitle: "त्वरित सूत्र, शॉर्ट नोट्स व रिवीजन सारांश",
      keywords: ["notes", "formula", "bank", "सूत्र", "नोट्स", "फॉर्मूला", "सूत्र बैंक"],
      icon: <FileText className="w-4 h-4 text-teal-700" />,
      screenTarget: "notes_editor",
    },
    {
      id: "tool-mistakes-queue",
      title: "कमज़ोर टॉपिक्स व गलतियाँ (Mistakes Queue)",
      subtitle: "कठिन चिन्हित टॉपिक्स व दर्ज गलतियाँ",
      keywords: ["mistake", "weak", "hard", "गलती", "गलतियाँ", "कठिन", "कमज़ोर"],
      icon: <ShieldAlert className="w-4 h-4 text-rose-700" />,
      screenTarget: "mistake_queue",
    },
    {
      id: "tool-debt-vault",
      title: "बैकलॉग वॉल्ट (Backlog Vault)",
      subtitle: "सुरक्षित संग्रहीत पुराने लेक्चर्स व रीसेट",
      keywords: ["vault", "debt", "backlog", "वॉल्ट", "बैकलॉग", "संग्रह", "छंटाई"],
      icon: <FolderOpen className="w-4 h-4 text-amber-800" />,
      screenTarget: "debt_vault",
    },
    {
      id: "tool-heatmap",
      title: "आने वाले 30 दिन का भार (Calendar Load)",
      subtitle: "30-दिवसीय लोड कैलेंडर व रीशेड्यूलिंग",
      keywords: ["calendar", "load", "heatmap", "कैलेंडर", "भार", "तारीख", "पूर्वानुमान"],
      icon: <Clock className="w-4 h-4 text-indigo-700" />,
      screenTarget: "heatmap",
    },
    {
      id: "tool-apps-script",
      title: "ऑनलाइन शीट से जोड़ें (Google Sheets Sync)",
      subtitle: "2-way Google Sheets लाइव डेटा सिंक",
      keywords: ["sheet", "sync", "google", "sheets", "एक्सेल", "शीट", "सिंक"],
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-700" />,
      screenTarget: "apps_script",
    },
    {
      id: "tool-settings",
      title: "सेटिंग्स (Settings & Quota)",
      subtitle: "दैनिक लक्ष्य, थीम्स व डेटा प्रबंधन",
      keywords: ["settings", "quota", "theme", "सेटिंग्स", "लक्ष्य", "प्राथमिकता"],
      icon: <Settings className="w-4 h-4 text-stone-700" />,
      screenTarget: "settings",
    },
    {
      id: "tool-gemini-ai",
      title: "Gemini AI डाउट सॉल्वर",
      subtitle: "AI स्टडी असिस्टेंट, सवाल व ट्रिक्स",
      keywords: ["ai", "gemini", "doubt", "सवाल", "संशय", "जेमिनी"],
      icon: <Sparkles className="w-4 h-4 text-purple-700" />,
      overlayTarget: "gemini_doubt",
    },
    {
      id: "tool-export-data",
      title: "रिकॉर्ड व सिलेबस एक्सपोर्ट (CSV / Excel .xlsx)",
      subtitle: "लेक्चर रिकॉर्ड्स और 21 विषयों के सिलेबस को Excel या CSV में डाउनलोड करें",
      keywords: ["export", "csv", "excel", "xlsx", "xls", "syllabus", "record", "download", "एक्सपोर्ट", "सिलेबस", "रिकॉर्ड", "डाउनलोड"],
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-700" />,
      overlayTarget: "export_data",
    },
    {
      id: "tool-vacation-mode",
      title: "छुट्टी मोड (Vacation Mode)",
      subtitle: "बैकलॉग फ्रीज़ व रिवीज़न शेड्यूल पॉज़ करें",
      keywords: ["vacation", "holiday", "pause", "छुट्टी", "पॉज़"],
      icon: <PauseCircle className="w-4 h-4 text-amber-700" />,
      overlayTarget: "vacation",
    },
  ];

  // 2. SEARCH MATCHING LOGIC
  const searchResults: SearchResultItem[] = useMemo(() => {
    const rawTrimmed = query.trim().toLowerCase();
    const tokens = rawTrimmed.split(/\s+/).filter(Boolean);

    const results: SearchResultItem[] = [];

    // A. Match Tools / Actions
    if (activeTab === "all" || activeTab === "tools") {
      appTools.forEach((tool) => {
        const pool = [tool.title, tool.subtitle, ...tool.keywords].join(" ").toLowerCase();
        const matches = tokens.length === 0 || tokens.every((t) => pool.includes(t));
        if (matches) {
          results.push({
            id: tool.id,
            type: "tool",
            title: tool.title,
            subtitle: tool.subtitle,
            badge: "टूल",
            badgeColor: "bg-indigo-100 text-indigo-900 border border-indigo-200",
            icon: tool.icon,
            screenTarget: tool.screenTarget,
            overlayTarget: tool.overlayTarget,
          });
        }
      });
    }

    // B. Match Subjects & Chapters from Catalog
    if (activeTab === "all" || activeTab === "catalog") {
      SUBJECT_CHAPTER_CATALOG.forEach((sub) => {
        // Match subject name
        const subPool = `${sub.name} ${sub.category} विषय subject`.toLowerCase();
        const subMatches = tokens.length > 0 && tokens.every((t) => subPool.includes(t));
        if (subMatches) {
          results.push({
            id: `sub-${sub.id}`,
            type: "subject_chapter",
            title: sub.name,
            subtitle: `${sub.chapters.length} अध्याय • ${sub.category}`,
            badge: "विषय",
            badgeColor: "bg-amber-100 text-amber-900 border border-amber-200",
            icon: <BookOpen className="w-4 h-4 text-amber-800" />,
            subjectName: sub.name,
          });
        }

        // Match individual chapters
        sub.chapters.forEach((ch) => {
          const chPool = `${ch} ${sub.name} अध्याय chapter`.toLowerCase();
          const chMatches = tokens.length > 0 && tokens.every((t) => chPool.includes(t));
          if (chMatches) {
            results.push({
              id: `ch-${sub.id}-${ch}`,
              type: "subject_chapter",
              title: ch,
              subtitle: `${sub.name} • अध्याय`,
              badge: "अध्याय",
              badgeColor: "bg-stone-100 text-stone-800 border border-stone-200",
              icon: <Layers className="w-4 h-4 text-stone-600" />,
              subjectName: sub.name,
              chapterName: ch,
            });
          }
        });
      });
    }

    // C. Match Lectures
    if (activeTab === "all" || activeTab === "lectures") {
      lectures.forEach((lec) => {
        if (lec.status === "archived" && tokens.length === 0) return;

        const lecPool = [
          lec.title,
          lec.chapter,
          lec.subject,
          `l-${lec.lectureNumber}`,
          `l${lec.lectureNumber}`,
          `lec ${lec.lectureNumber}`,
          lec.conceptNotes || "",
          lec.formulaNotes || "",
          lec.previousMistakes || "",
          lec.calculationTricks || "",
          lec.lastRating || "",
          lec.status === "due_today" || lec.nextDueDate <= todayStr ? "due नियत" : "",
          lec.status === "completed" ? "completed पूर्ण" : "",
        ].join(" ").toLowerCase();

        const matches = tokens.length === 0 ? false : tokens.every((t) => lecPool.includes(t));

        if (matches) {
          // Check for notes/formulas snippet
          let snippet: SearchResultItem["snippet"] = undefined;
          if (tokens.length > 0) {
            const fields = [
              { label: "फॉर्मूला", text: lec.formulaNotes },
              { label: "कॉन्सेप्ट", text: lec.conceptNotes },
              { label: "पिछली गलती", text: lec.previousMistakes },
              { label: "ट्रिक", text: lec.calculationTricks },
            ];
            for (const f of fields) {
              if (f.text) {
                const lower = f.text.toLowerCase();
                for (const t of tokens) {
                  const idx = lower.indexOf(t);
                  if (idx !== -1) {
                    const start = Math.max(0, idx - 20);
                    const end = Math.min(f.text.length, idx + t.length + 30);
                    snippet = {
                      source: f.label,
                      text: (start > 0 ? "..." : "") + f.text.slice(start, end).trim() + (end < f.text.length ? "..." : ""),
                    };
                    break;
                  }
                }
                if (snippet) break;
              }
            }
          }

          const isDue = lec.status === "due_today" || (lec.nextDueDate && lec.nextDueDate <= todayStr && lec.status !== "completed");
          const isMastered = lec.revisionCount >= 4 || lec.status === "completed";

          results.push({
            id: `lec-${lec.id}`,
            type: "lecture",
            title: lec.title,
            subtitle: `${lec.subject} • ${lec.chapter} (Lec #${lec.lectureNumber})`,
            badge: isDue ? "आज नियत" : isMastered ? "कंठस्थ" : `रिवीज़न #${lec.revisionCount || 0}`,
            badgeColor: isDue 
              ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold"
              : isMastered
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "bg-stone-100 text-stone-700 border border-stone-200",
            icon: <BookOpen className="w-4 h-4 text-amber-700" />,
            lecture: lec,
            snippet,
          });
        }
      });
    }

    // Default suggestions when query is empty
    if (tokens.length === 0) {
      // Suggest Due Today lectures
      const dueToday = lectures
        .filter((l) => l.status !== "archived" && (l.status === "due_today" || (l.nextDueDate && l.nextDueDate <= todayStr && l.status !== "completed")))
        .slice(0, 5)
        .map((l) => ({
          id: `due-${l.id}`,
          type: "lecture" as const,
          title: l.title,
          subtitle: `${l.subject} • ${l.chapter}`,
          badge: "आज रिवीज़न",
          badgeColor: "bg-amber-100 text-amber-900 border border-amber-300 font-black",
          icon: <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />,
          lecture: l,
        }));

      return [...results.slice(0, 6), ...dueToday];
    }

    return results.slice(0, 30);
  }, [query, activeTab, lectures, todayStr]);

  // Handle result selection
  const handleSelectResult = (item: SearchResultItem) => {
    triggerHaptic(8);
    if (query.trim()) {
      saveRecentSearch(query);
    }

    onClose();

    if (item.type === "lecture" && item.lecture) {
      onSelectLecture(item.lecture);
    } else if (item.type === "subject_chapter") {
      onNavigateToScreen("subjects_directory", {
        subjectName: item.subjectName,
        chapterName: item.chapterName,
      });
    } else if (item.type === "tool") {
      if (item.screenTarget) {
        onNavigateToScreen(item.screenTarget);
      } else if (item.overlayTarget && onOpenOverlay) {
        onOpenOverlay(item.overlayTarget);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < searchResults.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === "Enter" && searchResults[selectedIndex]) {
        e.preventDefault();
        handleSelectResult(searchResults[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="यूनिवर्सल सर्च एवं कमांड पैलेट"
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-150 mt-1 sm:mt-6"
      >
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-stone-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-stone-400 shrink-0 stroke-[2.4]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="लेक्चर, अध्याय, विषय या कोई भी टूल खोजें..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-stone-900 placeholder-stone-400 focus:outline-none"
          />

          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
              aria-label="खोज साफ़ करें"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-500 text-[10px] font-mono border border-stone-200">
              ESC
            </kbd>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer shrink-0 sm:hidden"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-stone-100 bg-stone-50/70 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: "all", label: "सभी" },
            { id: "lectures", label: "लेक्चर्स" },
            { id: "catalog", label: "विषय व अध्याय" },
            { id: "tools", label: "स्टडी टूल्स" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic(6);
                setActiveTab(tab.id as any);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-stone-900 text-white shadow-2xs"
                  : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recent Searches Pills (if query is empty and history exists) */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2 bg-stone-50/50 border-b border-stone-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-stone-400 shrink-0 flex items-center gap-1">
                <History className="w-3 h-3" />
                <span>हालिया:</span>
              </span>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    setSelectedIndex(0);
                  }}
                  className="px-2.5 py-0.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 text-[11px] font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>{term}</span>
                  <span
                    onClick={(e) => removeRecentSearch(term, e)}
                    className="text-stone-400 hover:text-stone-700 ml-0.5"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={clearAllRecent}
              className="text-[11px] text-stone-400 hover:text-stone-600 font-medium shrink-0 ml-2"
            >
              साफ़ करें
            </button>
          </div>
        )}

        {/* Search Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 scrollbar-none overscroll-contain">
          {searchResults.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Search className="w-5 h-5 stroke-[2]" />
              </div>
              <p className="text-sm font-bold text-stone-700">कोई परिणाम नहीं मिला</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                कृपया कोई अन्य शब्द या विषय का नाम लिखकर खोजें
              </p>
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex flex-col gap-1 border ${
                    isSelected
                      ? "bg-amber-50/80 border-amber-300 shadow-2xs"
                      : "bg-white border-stone-100 hover:border-stone-200 hover:bg-stone-50/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <span className={`px-2 py-0.2 rounded-md text-[10px] font-black shrink-0 ${item.badgeColor || "bg-stone-100 text-stone-700"}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
                  </div>

                  {/* Matching snippet highlight */}
                  {item.snippet && (
                    <div className="ml-10.5 px-2.5 py-1 rounded-xl bg-amber-100/60 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-1 leading-snug">
                      <CornerDownRight className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-800 mr-1">
                          [{item.snippet.source}]:
                        </span>
                        <span className="italic font-medium text-stone-700">
                          "{item.snippet.text}"
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Hint */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-[10px] font-bold mr-1">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-[10px] font-bold mr-1.5">↓</kbd>
            नेविगेट करें • <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-[10px] font-bold mr-1.5">ENTER</kbd> खोलें
          </span>
          <span className="text-amber-800 font-semibold ml-auto">
            {searchResults.length} परिणाम मिले
          </span>
        </div>
      </div>
    </div>
  );
};
