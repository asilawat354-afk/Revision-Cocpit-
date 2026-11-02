import React, { useEffect, useState, useRef, useTransition } from "react";
import { createPortal } from "react-dom";
import { 
  Home,
  Compass, 
  Database, 
  CalendarDays, 
  Grid3X3, 
  FolderOpen, 
  X, 
  Sparkles, 
  FileSpreadsheet, 
  PauseCircle, 
  PlayCircle,
  ChevronRight,
  BookOpen,
  Download,
  Flame,
  CheckCircle2,
  TrendingUp,
  Layers,
  Archive,
  Search,
  Settings,
  ShieldAlert,
  SlidersHorizontal
} from "lucide-react";
import { ActiveTab } from "./Navbar";
import { CockpitConfig } from "../types";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  config: CockpitConfig;
  onToggleVacation: () => void;
  archivedCount: number;
  totalLectures: number;
  activeTodayCount: number;
  completedTodayCount?: number;
  masteredCount?: number;
  onOpenGeminiModal: () => void;
  onOpenAppsScriptModal: () => void;
  onOpenDirectory?: () => void;
  onOpenDebtModal?: () => void;
  onExportCSV?: () => void;
  onOpenExportModal?: () => void;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
  onOpenEcosystemModal?: () => void;
  onOpenButtonStyleModal?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  config,
  onToggleVacation,
  archivedCount,
  totalLectures,
  activeTodayCount,
  completedTodayCount = 0,
  masteredCount = 0,
  onOpenGeminiModal,
  onOpenAppsScriptModal,
  onOpenDirectory,
  onOpenDebtModal,
  onExportCSV,
  onOpenExportModal,
  onOpenSearch,
  onOpenSettings,
  onOpenEcosystemModal,
  onOpenButtonStyleModal,
}) => {
  // Subtle haptic vibration helper (works on Android / Chrome touch devices)
  const triggerHaptic = (duration = 10) => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(duration);
      }
    } catch {
      // Ignore if not supported
    }
  };

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll smoothly when drawer is open, safely preserving and restoring previous overflow
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleTabClick = (tab: ActiveTab) => {
    triggerHaptic(8);
    onSelectTab(tab);
    onClose();
  };

  // Progress calculations for daily study widget
  const totalScheduledToday = activeTodayCount + completedTodayCount;
  const progressPercent = totalScheduledToday > 0 
    ? Math.round((completedTodayCount / totalScheduledToday) * 100) 
    : 100;

  const navItems: {
    id: ActiveTab;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: "home",
      title: "होम पेज (My Personal Space)",
      subtitle: "100% कस्टमाइज़ेबल डैशबोर्ड, नोट्स व गोल्स",
      icon: <Home className="w-5 h-5 shrink-0" />,
      badge: "कस्टम",
      badgeColor: "bg-amber-400/20 text-amber-900 border border-amber-300 font-bold",
    },
    {
      id: "cockpit",
      title: "आज का रिवीज़न",
      subtitle: "दैनिक लक्ष्य, क्विज़ व स्टडी टाइमर",
      icon: <Compass className="w-5 h-5 shrink-0" />,
      badge: activeTodayCount > 0 ? `${activeTodayCount} आज` : (completedTodayCount > 0 ? "✓ पूरा" : undefined),
      badgeColor: activeTodayCount > 0 
        ? "bg-amber-400 text-stone-950 font-bold" 
        : "bg-emerald-100 text-emerald-800 font-bold",
    },
    {
      id: "master_db",
      title: "सभी लेक्चर्स (मास्टर डेटाबेस)",
      subtitle: "फुल लेक्चर सूची, 2-स्टेप फाउंडेशन व रेटिंग",
      icon: <Database className="w-5 h-5 shrink-0" />,
      badge: totalLectures > 0 ? `${totalLectures}` : undefined,
      badgeColor: "bg-stone-200 text-stone-700 font-semibold",
    },
    {
      id: "heatmap",
      title: "30-दिन कैलेंडर",
      subtitle: "दैनिक लोड, आगामी रिवीज़न व पूर्वानुमान",
      icon: <CalendarDays className="w-5 h-5 shrink-0" />,
    },
    {
      id: "audit_grid",
      title: "प्रगति ग्रिड",
      subtitle: "अध्याय-वार रिवीज़न फ्रीक्वेंसी ऑडिट",
      icon: <Grid3X3 className="w-5 h-5 shrink-0" />,
    },
    {
      id: "debt_vault",
      title: "पुराना बैकलॉग वॉल्ट",
      subtitle: "सुरक्षित संग्रहीत लेक्चर्स, 1-टच फ़ोल्डर्स व बॉक्सेस",
      icon: <FolderOpen className="w-5 h-5 shrink-0" />,
      badge: archivedCount > 0 ? `${archivedCount}` : undefined,
      badgeColor: "bg-amber-100 text-amber-900 border border-amber-300 font-bold",
    },
  ];

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      id="navigation-drawer-root"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100dvh",
        zIndex: 9999,
        pointerEvents: isOpen ? "auto" : "none",
        overflow: "hidden",
      }}
    >
      {/* 1. Backdrop / Scrim with silky fade */}
      <div
        id="navigation-drawer-backdrop"
        onClick={() => {
          triggerHaptic(6);
          onClose();
        }}
        aria-hidden={!isOpen}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
        className={`bg-stone-950/50 backdrop-blur-md backdrop-saturate-150 transition-opacity duration-250 ease-out will-change-opacity ${
          isOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 2. Left Side Navigation Drawer Panel */}
      <aside
        id="navigation-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="नेविगेशन ड्रॉअर"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          height: "100%",
        }}
        className={`w-[84vw] max-w-[335px] sm:max-w-[355px] bg-white/95 backdrop-blur-2xl text-stone-900 shadow-2xl flex flex-col justify-between border-r border-white/60 select-none glass-specular transition-transform duration-250 ease-out ${
          isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
        }`}
      >
        {/* Visual Swipe Handle on the right edge */}
        <div 
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-stone-300/80 pointer-events-none"
          title="बंद करने के लिए बाईं ओर स्वाइप करें"
        />

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/70 backdrop-blur-md">
          <div className="flex items-center justify-between">
            {/* App Logo & Title */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ring-2 ring-stone-900/10">
                <Compass className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-normal leading-normal pt-0.5">
                  रिवीज़न कॉकपिट
                </h2>
                <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5 flex items-center gap-1.5">
                  <span>स्मार्ट स्टडी इंजन</span>
                  <span>•</span>
                  <span className="text-amber-700 font-semibold">v2.4 Ultra</span>
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="btn-close-drawer"
              onClick={() => {
                triggerHaptic(6);
                onClose();
              }}
              aria-label="ड्रॉअर बंद करें"
              className="w-8.5 h-8.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200/70 flex items-center justify-center transition-colors active:scale-90 shrink-0 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Quick Study Progress / Health Card in Header */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold text-stone-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>आज का रिवीज़न स्टेटस</span>
              </span>
              <span className="font-extrabold text-stone-900">
                {completedTodayCount} / {totalScheduledToday} पूरा
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{masteredCount} लेक्चर्स पक्के</span>
              </span>
              <span className="font-semibold text-amber-700">
                {progressPercent}% पूर्ण
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Navigation List Items (5 Main Tabs) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-none overscroll-contain">
          <p className="px-3 pt-1 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
            <span>मुख्य नेविगेशन टैब्स</span>
            <span className="text-[9.5px] font-normal lowercase text-stone-400">स्वाइप ⇦ बंद करें</span>
          </p>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`drawer-item-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between gap-3 transition-all min-h-[52px] cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200/80 active:scale-[0.99]"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive 
                      ? "text-amber-400 bg-white/10" 
                      : "text-stone-600 bg-stone-100"
                  }`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-bold truncate leading-snug ${
                      isActive ? "text-white" : "text-stone-900"
                    }`}>
                      {item.title}
                    </p>
                    <p className={`text-[10.5px] truncate mt-0.5 ${
                      isActive ? "text-stone-300" : "text-stone-500"
                    }`}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Badge or Arrow */}
                <div className="shrink-0 flex items-center space-x-1.5">
                  {item.badge ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10.5px] shadow-2xs ${item.badgeColor || "bg-stone-200 text-stone-700"}`}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={`w-4 h-4 ${
                      isActive ? "text-stone-400" : "text-stone-300"
                    }`} />
                  )}
                </div>
              </button>
            );
          })}

          {/* Quick Tools & Utilities */}
          <div className="pt-3 mt-2 border-t border-stone-100 space-y-1">
            <p className="px-3 pt-1 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-stone-400">
              त्वरित टूल्स व खोज
            </p>

            {/* Ecosystem Studio Option */}
            {onOpenEcosystemModal && (
              <button
                id="drawer-item-ecosystem"
                onClick={() => {
                  triggerHaptic(8);
                  onOpenEcosystemModal();
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100/90 to-yellow-100/80 hover:from-amber-200 hover:to-yellow-200 border border-amber-300/80 transition-all cursor-pointer active:scale-[0.99] shadow-2xs"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-black">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-black">इकोसिस्टम स्टूडियो (7 मोड्स)</span>
                    <p className="text-[10px] text-amber-800 font-normal">Google, Apple, WhatsApp, GPay</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            )}

            {/* Settings & Features Option requested by user */}
            {onOpenSettings && (
              <button
                id="drawer-item-settings"
                onClick={() => {
                  triggerHaptic(8);
                  onOpenSettings();
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span>सेटिंग</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              </button>
            )}

            {/* Back & Menu Button Styles Option (बिल्कुल सादा विकल्प) */}
            {onOpenButtonStyleModal && (
              <button
                id="drawer-item-button-styles"
                onClick={() => {
                  triggerHaptic(8);
                  onOpenButtonStyleModal();
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">बैक व मेनू बटन कस्टमाइज़र</span>
                    <p className="text-[10px] text-stone-500">बड़े ऐप्स, साइज, पारदर्शिता, लाइन व बगैर इफ़ेक्ट</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              </button>
            )}

            {/* Instant Search Command Palette */}
            {onOpenSearch && (
              <button
                onClick={() => {
                  triggerHaptic(6);
                  onOpenSearch();
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <span>त्वरित खोज (Instant Search)</span>
                </div>
              </button>
            )}

            {/* Gemini AI */}
            <button
              onClick={() => {
                triggerHaptic(8);
                onOpenGeminiModal();
                onClose();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Gemini AI संशय व ट्रिक्स</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            </button>

            {/* Google Sheets Sync */}
            <button
              onClick={() => {
                triggerHaptic(8);
                onOpenAppsScriptModal();
                onClose();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span>Google Sheets सिंक</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            </button>

            {/* Subjects Catalog */}
            {onOpenDirectory && (
              <button
                onClick={() => {
                  triggerHaptic(8);
                  onOpenDirectory();
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>विषय व अध्याय डायरेक्टरी</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              </button>
            )}

            {/* Strategic Triage / Debt Reset */}
            {onOpenDebtModal && (
              <button
                onClick={() => {
                  triggerHaptic(8);
                  onOpenDebtModal();
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span>सक्रिय चुनाव व बैकलॉग छंटाई</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              </button>
            )}

            {/* Quick Master CSV / Excel Backup */}
            {(onOpenExportModal || onExportCSV) && (
              <button
                onClick={() => {
                  triggerHaptic(8);
                  if (onOpenExportModal) {
                    onOpenExportModal();
                  } else if (onExportCSV) {
                    onExportCSV();
                  }
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold">रिकॉर्ड व सिलेबस एक्सपोर्ट</span>
                    <span className="text-[10px] text-stone-500 font-normal">Excel (.xlsx) व CSV डाउनलोड</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              </button>
            )}

            {/* Standalone Single-File Web HTML Download */}
            <a
              id="drawer-download-standalone-html"
              href="/api/download-html"
              download="Smart-Revision-Cockpit-Standalone-Web-App.html"
              onClick={() => {
                triggerHaptic(8);
                onClose();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 transition-colors cursor-pointer active:scale-[0.99] border border-emerald-200/80"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <span>संपूर्ण Web HTML फ़ाइल (All-in-One)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
            </a>

            {/* Project ZIP Backup */}
            <a
              id="drawer-download-project-zip"
              href="/api/download-zip"
              download="smart-revision-cockpit-backup.zip"
              onClick={() => {
                triggerHaptic(8);
                onClose();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Archive className="w-4 h-4" />
                </div>
                <span>प्रोजेक्ट ZIP बैकअप (कोड व डेटा)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            </a>
          </div>
        </div>

        {/* Drawer Footer with Vacation Mode Toggle & Cloud Status */}
        <div className="p-3.5 border-t border-stone-200 bg-stone-50/90 space-y-2">
          {/* Vacation Mode Switch inside Drawer */}
          <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2 shadow-2xs">
            <div className="min-w-0">
              <p className="text-xs font-bold text-stone-900 truncate">
                छुट्टी मोड (Vacation)
              </p>
              <p className="text-[10px] text-stone-500 truncate">
                {config.vacationMode ? "सक्रिय • बैकलॉग फ़्रीज़ है" : "निष्क्रिय • सामान्य मोड"}
              </p>
            </div>
            <button
              onClick={() => {
                triggerHaptic(10);
                onToggleVacation();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer ${
                config.vacationMode
                  ? "bg-amber-500 hover:bg-amber-600 text-stone-950"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
              }`}
            >
              {config.vacationMode ? (
                <>
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>चालू</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>शुरू करें</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Cloud Firestore कनेक्टेड</span>
            </span>
            <span className="font-mono">60 FPS Native</span>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
};
