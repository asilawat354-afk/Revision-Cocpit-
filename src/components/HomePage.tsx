import React, { useMemo } from "react";
import { 
  Play, 
  BookOpen, 
  CalendarDays, 
  Database, 
  ShieldAlert, 
  Clock, 
  FileSpreadsheet, 
  Download, 
  ChevronRight, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  ArrowRight,
  Plus
} from "lucide-react";
import { LectureItem, CockpitConfig } from "../types";
import { ActiveTab } from "./Navbar";
import { triggerHaptic } from "../utils/haptics";

import { ExportDatasetType } from "../utils/exportData";

interface HomePageProps {
  lectures: LectureItem[];
  config: CockpitConfig;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenGeminiModal: () => void;
  onOpenDirectory: () => void;
  activeTodayCount: number;
  completedTodayCount: number;
  archivedCount: number;
  masteredCount: number;
  totalLectures: number;
  onOpenAddLecture: () => void;
  onOpenAppsScriptModal: () => void;
  onExportCSV: () => void;
  onOpenExportModal?: (dataset?: ExportDatasetType, subject?: string) => void;
  onToggleVacation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  lectures,
  config,
  onNavigateTab,
  onOpenGeminiModal,
  onOpenDirectory,
  activeTodayCount,
  completedTodayCount,
  archivedCount,
  masteredCount,
  totalLectures,
  onOpenAddLecture,
  onOpenAppsScriptModal,
  onExportCSV,
  onOpenExportModal,
  onToggleVacation,
}) => {
  // Format Hindi friendly date
  const todayLabel = useMemo(() => {
    try {
      return new Date().toLocaleDateString("hi-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    } catch {
      return "आज का दिन";
    }
  }, []);

  // Top active subjects summary
  const subjectBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; completed: number }>();
    lectures.forEach((l) => {
      const current = map.get(l.subject) || { total: 0, completed: 0 };
      current.total += 1;
      if (l.status === "completed" || l.revisionCount >= 4) {
        current.completed += 1;
      }
      map.set(l.subject, current);
    });
    return Array.from(map.entries())
      .map(([subject, data]) => ({
        subject,
        ...data,
        pct: Math.round((data.completed / data.total) * 100),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [lectures]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* 1. HERO STUDY BANNER (What to study today) */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden space-y-4">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-amber-400" />
              {todayLabel}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              नमस्ते! आज का रिवीज़न तैयार है
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md leading-relaxed">
              {activeTodayCount > 0
                ? `आज आपके पास ${activeTodayCount} लेक्चर्स का रिवीज़न बाकी है। एक-एक करके पूरा करें।`
                : "शानदार! आज का सारा निर्धारित रिवीज़न पूरा हो चुका है।"}
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                onNavigateTab("cockpit");
              }}
              className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>रिवीज़न शुरू करें</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. KEY METRIC TILES */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div
          onClick={() => onNavigateTab("cockpit")}
          className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs font-bold text-stone-500">आज बाकी</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {activeTodayCount}
            </span>
            <span className="text-xs text-stone-400 font-medium">कार्य</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("cockpit")}
          className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs font-bold text-stone-500">आज पूर्ण</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {completedTodayCount}
            </span>
            <span className="text-xs text-stone-400 font-medium">लेक्चर</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("master_db")}
          className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs font-bold text-stone-500">कंठस्थ (याद)</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">
              {masteredCount}
            </span>
            <span className="text-xs text-stone-400 font-medium">लेक्चर</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("master_db")}
          className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-stone-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <span className="text-xs font-bold text-stone-500">कुल लेक्चर्स</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {totalLectures}
            </span>
            <span className="text-xs text-stone-400 font-medium">दर्ज</span>
          </div>
        </div>
      </section>

      {/* 3. PRIMARY SECTIONS GRID */}
      <section className="space-y-3">
        <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
          मुख्य अनुभाग
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Subjects Directory Card */}
          <div
            onClick={onOpenDirectory}
            className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                  विषय एवं अध्याय निर्देशिका
                </h4>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  21 आधिकारिक विषय व 250+ अध्याय कैटलॉग
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-900 transition-colors shrink-0" />
          </div>

          {/* Calendar Load Forecast Card */}
          <div
            onClick={() => onNavigateTab("heatmap")}
            className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-indigo-800 transition-colors">
                  आने वाले 30 दिन का भार
                </h4>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  दैनिक रिवीज़न कैलेंडर व लोड संतुलन
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-900 transition-colors shrink-0" />
          </div>

          {/* Master Database Card */}
          <div
            onClick={() => onNavigateTab("master_db")}
            className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-sky-400 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-sky-800 transition-colors">
                  सभी लेक्चर्स की सूची
                </h4>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  खोज, फ़िल्टर, स्थिति व रेटिंग प्रबंधन
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-900 transition-colors shrink-0" />
          </div>

          {/* More Tools Card */}
          <div
            onClick={() => onNavigateTab("more")}
            className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-stone-400 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-stone-950 transition-colors">
                  अधिक टूल्स व मेन्यू
                </h4>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  गलतियाँ बैंक, पढ़ाई का टाइमर, नोट्स व सेटिंग्स
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-900 transition-colors shrink-0" />
          </div>
        </div>
      </section>

      {/* 4. SUBJECT PROGRESS PREVIEW */}
      {subjectBreakdown.length > 0 && (
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight">
              प्रमुख विषयों की प्रगति
            </h3>
            <button
              type="button"
              onClick={onOpenDirectory}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer flex items-center gap-1"
            >
              सभी देखें <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {subjectBreakdown.map((item) => (
              <div key={item.subject} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span className="truncate max-w-[200px]">{item.subject}</span>
                  <span className="text-stone-500">
                    {item.completed} / {item.total} ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. QUICK ACTIONS & CLOUD SYNC FOOTER */}
      <section className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-100 rounded-2xl text-xs text-stone-600">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddLecture}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>लेक्चर जोड़ें</span>
          </button>
          <button
            type="button"
            onClick={onOpenAppsScriptModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
            <span>शीट सिंक</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(8);
              if (onOpenExportModal) {
                onOpenExportModal("all_in_one");
              } else {
                onExportCSV();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>रिकॉर्ड व सिलेबस एक्सपोर्ट (CSV / Excel)</span>
          </button>
          <a
            href="/api/download-html"
            download="Smart-Revision-Cockpit-Standalone-Web-App.html"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>संपूर्ण Web HTML फ़ाइल</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            if (onOpenExportModal) {
              onOpenExportModal("all_in_one");
            } else {
              onExportCSV();
            }
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-stone-700 hover:text-stone-950 font-bold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV / Excel डाउनलोड</span>
        </button>
      </section>
    </div>
  );
};
