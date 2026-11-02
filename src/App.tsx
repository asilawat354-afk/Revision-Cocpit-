import React, { useState, useEffect, useRef } from "react";
import { X, Compass } from "lucide-react";
import { 
  CockpitConfig, 
  DifficultyRating, 
  LectureItem,
  ReferenceLink,
  RevisionLogEntry
} from "./types";
import { 
  loadLectures, 
  saveLectures, 
  loadConfig, 
  saveConfig, 
  exportToCSV 
} from "./utils/storage";
import { loadUserDataFromCloud, saveUserDataToCloud, ensureAuthenticatedUser, auth } from "./lib/firebase";
import { 
  autoLevelSchedule, 
  calculateNextRevision, 
  shiftTasksForVacation,
  addDays,
  getTodayStr
} from "./utils/revisionEngine";
import { TODAY_STR } from "./data/initialData";
import { DEFAULT_SPREADSHEET_ID } from "./utils/appsScriptCode";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { initCapacitorMobile } from "./utils/capacitorBridge";

import { AppHeader } from "./components/AppHeader";
import { AppBottomNav } from "./components/AppBottomNav";
import { Navbar, ActiveTab, ScreenTransitionEffect, BottomBarStyle, PillSpeedOption, ScrollSensitivity } from "./components/Navbar";
import { CockpitDashboard } from "./components/CockpitDashboard";
import { MasterDatabase } from "./components/MasterDatabase";
import { HeatmapForecast } from "./components/HeatmapForecast";
import { AuditFrequencyGrid } from "./components/AuditFrequencyGrid";
import { DebtVaultView } from "./components/DebtVaultView";

import { SubjectsDirectoryView } from "./components/SubjectsDirectoryView";
import { DebtResetView } from "./components/DebtResetView";
import { SettingsView } from "./components/SettingsView";
import { AppsScriptSyncView } from "./components/AppsScriptSyncView";

import { RevisionSessionModal } from "./components/RevisionSessionModal";
import { GeminiDoubtModal } from "./components/GeminiDoubtModal";
import { AddLectureModal } from "./components/AddLectureModal";
import { VacationModal } from "./components/VacationModal";
import { ConfirmStudiedModal } from "./components/ConfirmStudiedModal";
import { ConfirmResetModal } from "./components/ConfirmResetModal";
import { NavigationDrawer } from "./components/NavigationDrawer";
import { HomePage } from "./components/HomePage";
import { CelebrationModal } from "./components/CelebrationModal";
import { EcosystemSwitcherModal } from "./components/EcosystemSwitcherModal";
import { CommandPalette, SearchDisplayType } from "./components/CommandPalette";
import { BigTechEcosystem, getEcosystem } from "./utils/ecosystemTheme";
import { TopicDetailView } from "./components/TopicDetailView";
import { MistakesQueueView } from "./components/MistakesQueueView";
import { FocusTimerView } from "./components/FocusTimerView";
import { NotesEditorView } from "./components/NotesEditorView";
import { MoreHubView } from "./components/MoreHubView";
import { CustomRevisionModal } from "./components/CustomRevisionModal";
import { VoiceStudyMemoModal } from "./components/VoiceStudyMemoModal";
import { ExportDataModal } from "./components/ExportDataModal";
import { ExportDatasetType } from "./utils/exportData";
import { 
  NavButtonStyle, 
  getStoredNavButtonStyle, 
  NAV_BUTTON_STORAGE_KEY 
} from "./utils/navButtonStyles";
import { NavButtonStyleTesterModal } from "./components/NavButtonStyleTesterModal";

export type FullPageView = 
  | "subjects_directory" 
  | "debt_reset" 
  | "settings" 
  | "apps_script"
  | "topic_detail"
  | "mistake_queue"
  | "focus_timer"
  | "notes_editor"
  | "master_db"
  | "debt_vault";

export type NavItem = 
  | { type: "tab"; id: ActiveTab; params?: Record<string, any>; scrollPos?: number }
  | { type: "page"; id: FullPageView; params?: Record<string, any>; scrollPos?: number };

export const NAV_TITLES: Record<string, { name: string; shortName: string }> = {
  home: { name: "होम डैशबोर्ड", shortName: "होम" },
  cockpit: { name: "रिवीज़न कॉकपिट", shortName: "रिवीज़न" },
  heatmap: { name: "आने वाले 30 दिन का भार", shortName: "कैलेंडर" },
  audit_grid: { name: "21-दिन अभ्यास प्रगति", shortName: "प्रगति" },
  more: { name: "अधिक विकल्प", shortName: "अधिक" },
  master_db: { name: "सभी लेक्चर्स की सूची", shortName: "डेटाबेस" },
  debt_vault: { name: "बैकलॉग छंटाई व रीसेट", shortName: "बैकलॉग" },
  subjects_directory: { name: "विषय एवं अध्याय निर्देशिका", shortName: "निर्देशिका" },
  debt_reset: { name: "बैकलॉग छंटाई व रीसेट", shortName: "छंटाई" },
  settings: { name: "सेटिंग्स", shortName: "सेटिंग्स" },
  apps_script: { name: "ऑनलाइन शीट से जोड़ें", shortName: "शीट सिंक" },
  topic_detail: { name: "टॉपिक विवरण व नोट्स", shortName: "विवरण" },
  mistake_queue: { name: "कमज़ोर टॉपिक्स व गलतियाँ", shortName: "गलतियाँ" },
  focus_timer: { name: "पढ़ाई का टाइमर", shortName: "टाइमर" },
  notes_editor: { name: "स्टडी नोट्स व सूत्र बैंक", shortName: "नोट्स" },
};

export default function App() {
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [config, setConfig] = useState<CockpitConfig>(loadConfig());
  const [navStack, setNavStack] = useState<NavItem[]>([{ type: "tab", id: "home" }]);
  const [prevTab, setPrevTab] = useState<ActiveTab>("home");
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);

  // Screen Transition Effect (Apple, Google, Linear, Instagram, Spotify, etc.)
  const [screenTransition, setScreenTransition] = useState<ScreenTransitionEffect>(() => {
    try {
      const saved = localStorage.getItem("sm_screen_transition_effect") as ScreenTransitionEffect;
      if (
        saved &&
        [
          "ios_page_cover",
          "material_elevate",
          "linear_snap",
          "insta_depth",
          "spotify_fade",
          "mobile_slide",
          "none",
        ].includes(saved)
      ) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "ios_page_cover"; // Apple iOS spring cover by default!
  });

  const handleSelectScreenTransition = (effect: ScreenTransitionEffect) => {
    setScreenTransition(effect);
    try {
      localStorage.setItem("sm_screen_transition_effect", effect);
    } catch {
      // ignore
    }
  };

  // Bottom Navigation Bar Style (Water clear pill, Apple iOS, Google Material, Spotify, Instagram)
  const [bottomBarStyle, setBottomBarStyle] = useState<BottomBarStyle>(() => {
    try {
      const saved = localStorage.getItem("sm_bottom_bar_style_pref") as BottomBarStyle;
      if (saved && ["water_clear_pill", "apple_ios_bar", "google_material_bar", "spotify_linear_dock", "instagram_minimal"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "water_clear_pill";
  });

  const handleSelectBottomBarStyle = (style: BottomBarStyle) => {
    setBottomBarStyle(style);
    try {
      localStorage.setItem("sm_bottom_bar_style_pref", style);
    } catch {
      // ignore
    }
  };

  // Dock Glide Speed Mode
  const [speedMode, setSpeedMode] = useState<PillSpeedOption>(() => {
    try {
      const saved = localStorage.getItem("sm_compact_pill_speed") as PillSpeedOption;
      if (saved && ["ultra_fast", "instant_glide", "smooth_breeze", "gentle_float"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "instant_glide";
  });

  const handleSelectSpeedMode = (speed: PillSpeedOption) => {
    setSpeedMode(speed);
    try {
      localStorage.setItem("sm_compact_pill_speed", speed);
    } catch {
      // ignore
    }
  };

  // Dock Scroll Sensitivity
  const [scrollSensitivity, setScrollSensitivity] = useState<ScrollSensitivity>(() => {
    try {
      const saved = localStorage.getItem("sm_compact_pill_sensitivity") as ScrollSensitivity;
      if (saved && ["sensitive", "normal", "calm"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "calm";
  });

  const handleSelectScrollSensitivity = (sens: ScrollSensitivity) => {
    setScrollSensitivity(sens);
    try {
      localStorage.setItem("sm_compact_pill_sensitivity", sens);
    } catch {
      // ignore
    }
  };

  // Big-Tech 7 Ecosystem Experience Mode (Google, Apple, GPay, WhatsApp, Instagram, Linear, Duolingo)
  const [ecosystem, setEcosystem] = useState<BigTechEcosystem>(() => {
    try {
      const saved = localStorage.getItem("sm_active_ecosystem") as BigTechEcosystem;
      if (
        saved &&
        [
          "google_workspace",
          "apple_notion",
          "gpay_fintech",
          "whatsapp_meta",
          "instagram_creator",
          "linear_obsidian",
          "duolingo_arena",
        ].includes(saved)
      ) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "google_workspace";
  });

  const [isVoiceMemoOpen, setIsVoiceMemoOpen] = useState<boolean>(false);

  const handleSelectEcosystem = (eco: BigTechEcosystem) => {
    setEcosystem(eco);
    try {
      localStorage.setItem("sm_active_ecosystem", eco);
    } catch {
      // ignore
    }

    // Automatically align the authentic bottom bar for each flagship ecosystem!
    switch (eco) {
      case "google_workspace":
        handleSelectBottomBarStyle("google_material_bar");
        break;
      case "apple_notion":
        handleSelectBottomBarStyle("apple_ios_bar");
        break;
      case "gpay_fintech":
        handleSelectBottomBarStyle("water_clear_pill");
        break;
      case "whatsapp_meta":
        handleSelectBottomBarStyle("apple_ios_bar");
        break;
      case "instagram_creator":
        handleSelectBottomBarStyle("instagram_minimal");
        break;
      case "linear_obsidian":
        handleSelectBottomBarStyle("spotify_linear_dock");
        break;
      case "duolingo_arena":
        handleSelectBottomBarStyle("water_clear_pill");
        break;
    }
  };

  // Search Engine Display Type State (fullscreen, spotlight, bottom_sheet)
  const [searchDisplayType, setSearchDisplayType] = useState<SearchDisplayType>(() => {
    try {
      const saved = localStorage.getItem("sm_search_display_style") as SearchDisplayType;
      if (saved && ["fullscreen", "spotlight", "bottom_sheet"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "fullscreen";
  });

  const handleSelectSearchDisplayType = (type: SearchDisplayType) => {
    setSearchDisplayType(type);
    try {
      localStorage.setItem("sm_search_display_style", type);
    } catch {
      // ignore
    }
  };

  // Nav Button Style: 7 Plain options for Back & Menu buttons (सादा पारदर्शी, सादा गोल, वायरफ्रेम आदि)
  const [navButtonStyle, setNavButtonStyle] = useState<NavButtonStyle>(() => {
    return getStoredNavButtonStyle();
  });
  const [isNavButtonStyleModalOpen, setIsNavButtonStyleModalOpen] = useState<boolean>(false);

  const handleSelectNavButtonStyle = (style: NavButtonStyle) => {
    setNavButtonStyle(style);
    try {
      localStorage.setItem(NAV_BUTTON_STORAGE_KEY, style);
    } catch {
      // ignore
    }
  };

  const tabOrder: ActiveTab[] = ["home", "cockpit", "heatmap", "audit_grid", "more", "master_db", "debt_vault"];

  // Selected lecture for TopicDetailView / NotesEditorView
  const [selectedTopicLecture, setSelectedTopicLecture] = useState<LectureItem | null>(null);
  const [isCustomRevisionOpen, setIsCustomRevisionOpen] = useState<boolean>(false);
  const [isExitRevisionConfirmOpen, setIsExitRevisionConfirmOpen] = useState<boolean>(false);

  const currentNav = navStack[navStack.length - 1] || { type: "tab", id: "home" };
  
  // Can go back ONLY when inside a dedicated sub-page / feature view (NEVER between bottom tabs)
  const canGoBack = currentNav.type === "page" && navStack.length > 1;

  // Title and back button labels
  const currentTitle = NAV_TITLES[currentNav.id]?.name || "स्मार्ट रिवीज़न कॉकपिट";
  const prevNav = canGoBack ? navStack[navStack.length - 2] : null;
  const backTitle = prevNav ? (NAV_TITLES[prevNav.id]?.shortName || "वापस") : undefined;

  // Tab highlighted in bottom navigation bar
  const activeTab: ActiveTab = (() => {
    if (currentNav.type === "tab") return currentNav.id;
    for (let i = navStack.length - 2; i >= 0; i--) {
      if (navStack[i].type === "tab") return (navStack[i] as { type: "tab"; id: ActiveTab }).id;
    }
    return "home";
  })();

  // Switching root tabs replaces the stack so no back button is ever shown between tabs
  const handleSwitchTab = (newTab: ActiveTab) => {
    if (newTab !== activeTab) {
      setPrevTab(activeTab);
    }
    setNavStack([{ type: "tab", id: newTab }]);
  };

  // Navigating to full sub-pages pushes onto history so user can return with Back
  const handleOpenPage = (pageId: FullPageView, params?: Record<string, any>) => {
    const currentY = typeof window !== "undefined" ? window.scrollY : 0;
    setNavStack((prev) => {
      const updated = prev.map((item, idx) =>
        idx === prev.length - 1 ? { ...item, scrollPos: currentY } : item
      );
      try {
        window.history.pushState({ appStep: updated.length, pageId }, "");
      } catch {
        // ignore
      }
      return [...updated, { type: "page", id: pageId, params }];
    });
  };

  const handleOpenTopicDetail = (lecture: LectureItem, fromSearch = false) => {
    setSelectedTopicLecture(lecture);
    handleOpenPage("topic_detail", { lectureId: lecture.id, fromSearch });
  };

  const handleUpdateSingleLecture = (updated: LectureItem) => {
    setLectures((prev) => {
      const next = prev.map((l) => (l.id === updated.id ? updated : l));
      try {
        localStorage.setItem("sm_lectures_data", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setSelectedTopicLecture(updated);
  };

  const handleOpenDirectory = () => handleOpenPage("subjects_directory");
  const handleOpenDebtReset = () => handleOpenPage("debt_reset");
  const handleOpenSettings = () => handleOpenPage("settings");
  const handleOpenAppsScript = () => handleOpenPage("apps_script");

  // Determine slide direction (Left or Right) based on tab sequence
  const isSlideLeft = tabOrder.indexOf(activeTab) >= tabOrder.indexOf(prevTab);

  const getTransitionClass = () => {
    switch (screenTransition) {
      case "ios_page_cover":
        return isSlideLeft ? "animate-ios-slide-left" : "animate-ios-slide-right";
      case "material_elevate":
        return "animate-material-elevate";
      case "linear_snap":
        return isSlideLeft ? "animate-linear-snap-left" : "animate-linear-snap-right";
      case "insta_depth":
        return "animate-insta-zoom";
      case "spotify_fade":
        return "animate-spotify-fade";
      case "mobile_slide":
        return isSlideLeft ? "animate-mobile-slide-left" : "animate-mobile-slide-right";
      case "none":
        return "";
      default:
        return isSlideLeft ? "animate-ios-slide-left" : "animate-ios-slide-right";
    }
  };

  // Automatically scroll to the exact top whenever active screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [currentNav.id]);

  // Modal states (Fast contextual overlays)
  const [activeRevisionLecture, setActiveRevisionLecture] = useState<LectureItem | null>(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState<boolean>(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);
  const [geminiLectureContext, setGeminiLectureContext] = useState<LectureItem | null>(null);
  const [isAddLectureModalOpen, setIsAddLectureModalOpen] = useState<boolean>(false);
  const [addLectureDefaults, setAddLectureDefaults] = useState<{ subject?: string; chapter?: string }>({});
  const [isEcosystemModalOpen, setIsEcosystemModalOpen] = useState<boolean>(false);
  const [isVacationModalOpen, setIsVacationModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportModalDefaults, setExportModalDefaults] = useState<{
    dataset?: ExportDatasetType;
    subject?: string;
  }>({ dataset: "all_in_one", subject: "ALL" });

  const handleOpenExportModal = (
    dataset: ExportDatasetType = "all_in_one",
    subject: string = "ALL"
  ) => {
    setExportModalDefaults({ dataset, subject });
    setIsExportModalOpen(true);
  };

  const handleOpenAddLectureModal = (subject?: string, chapter?: string) => {
    setAddLectureDefaults({ subject, chapter });
    setIsAddLectureModalOpen(true);
  };
  const [confirmStudiedLecture, setConfirmStudiedLecture] = useState<LectureItem | null>(null);
  const [confirmResetLecture, setConfirmResetLecture] = useState<LectureItem | null>(null);

  // Instant Search Command Palette & Celebration Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    title: string;
    chapter: string;
    attemptNumber: number;
    nextDate: string;
  }>({
    isOpen: false,
    title: "",
    chapter: "",
    attemptNumber: 1,
    nextDate: "",
  });

  // Contextual overlays & Back button synchronization
  const isNavDrawerOpenRef = useRef(isNavDrawerOpen);
  isNavDrawerOpenRef.current = isNavDrawerOpen;

  const isSearchOpenRef = useRef(isSearchOpen);
  isSearchOpenRef.current = isSearchOpen;

  const isRevisionModalOpenRef = useRef(isRevisionModalOpen);
  isRevisionModalOpenRef.current = isRevisionModalOpen;

  const isExitRevisionConfirmOpenRef = useRef(isExitRevisionConfirmOpen);
  isExitRevisionConfirmOpenRef.current = isExitRevisionConfirmOpen;

  const isCustomRevisionOpenRef = useRef(isCustomRevisionOpen);
  isCustomRevisionOpenRef.current = isCustomRevisionOpen;

  const isAddLectureModalOpenRef = useRef(isAddLectureModalOpen);
  isAddLectureModalOpenRef.current = isAddLectureModalOpen;

  const isGeminiModalOpenRef = useRef(isGeminiModalOpen);
  isGeminiModalOpenRef.current = isGeminiModalOpen;

  const isVacationModalOpenRef = useRef(isVacationModalOpen);
  isVacationModalOpenRef.current = isVacationModalOpen;

  const isEcosystemModalOpenRef = useRef(isEcosystemModalOpen);
  isEcosystemModalOpenRef.current = isEcosystemModalOpen;

  const isNavButtonStyleModalOpenRef = useRef(isNavButtonStyleModalOpen);
  isNavButtonStyleModalOpenRef.current = isNavButtonStyleModalOpen;

  const isVoiceMemoOpenRef = useRef(isVoiceMemoOpen);
  isVoiceMemoOpenRef.current = isVoiceMemoOpen;

  const isExportModalOpenRef = useRef(isExportModalOpen);
  isExportModalOpenRef.current = isExportModalOpen;

  const confirmLectureRef = useRef(!!confirmStudiedLecture || !!confirmResetLecture);
  confirmLectureRef.current = !!confirmStudiedLecture || !!confirmResetLecture;

  const navStackRef = useRef(navStack);
  navStackRef.current = navStack;

  const isInAppBackActionRef = useRef<boolean>(false);

  // Centralized, unified Back Handler across modals, drawers, search, sub-pages, and tabs
  const executeGlobalBack = () => {
    // Priority 1: Soft Keyboard - blur first
    if (typeof document !== "undefined" && document.activeElement && 
       (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
      (document.activeElement as HTMLElement).blur();
      return;
    }

    // Priority 2: Revision exit confirm dialog
    if (isExitRevisionConfirmOpenRef.current) {
      setIsExitRevisionConfirmOpen(false);
      return;
    }

    // Priority 3: Active Revision session protection - ask confirm so session is not lost
    if (isRevisionModalOpenRef.current) {
      setIsExitRevisionConfirmOpen(true);
      return;
    }

    // Priority 4: Dismiss Overlays & Modals in strict z-index / focus order
    if (isExportModalOpenRef.current) {
      setIsExportModalOpen(false);
      return;
    }
    if (isVoiceMemoOpenRef.current) {
      setIsVoiceMemoOpen(false);
      return;
    }
    if (isNavButtonStyleModalOpenRef.current) {
      setIsNavButtonStyleModalOpen(false);
      return;
    }
    if (isEcosystemModalOpenRef.current) {
      setIsEcosystemModalOpen(false);
      return;
    }
    if (confirmLectureRef.current) {
      setConfirmStudiedLecture(null);
      setConfirmResetLecture(null);
      return;
    }
    if (isCustomRevisionOpenRef.current) {
      setIsCustomRevisionOpen(false);
      return;
    }
    if (isNavDrawerOpenRef.current) {
      setIsNavDrawerOpen(false);
      return;
    }
    if (isSearchOpenRef.current) {
      setIsSearchOpen(false);
      return;
    }
    if (isAddLectureModalOpenRef.current) {
      setIsAddLectureModalOpen(false);
      return;
    }
    if (isGeminiModalOpenRef.current) {
      setIsGeminiModalOpen(false);
      return;
    }
    if (isVacationModalOpenRef.current) {
      setIsVacationModalOpen(false);
      return;
    }

    // Priority 5: Child screen back to parent screen (Navigation Stack Pop)
    const currentStack = navStackRef.current;
    if (currentStack.length > 1) {
      const poppedScreen = currentStack[currentStack.length - 1];
      const targetScreen = currentStack[currentStack.length - 2];

      setNavStack((prev) => prev.slice(0, -1));

      // If user came from Universal Search, re-open search so context is preserved!
      if (poppedScreen.params?.fromSearch) {
        setIsSearchOpen(true);
      }

      // Restore scroll position
      if (targetScreen?.scrollPos !== undefined) {
        setTimeout(() => {
          window.scrollTo({ top: targetScreen.scrollPos || 0, behavior: "instant" });
        }, 50);
      }
      return;
    }

    // Priority 6: Non-home root tab back to Home
    if (currentStack[0] && currentStack[0].type === "tab" && currentStack[0].id !== "home") {
      setNavStack([{ type: "tab", id: "home" }]);
    }
  };

  const handleGoBack = () => {
    isInAppBackActionRef.current = true;
    executeGlobalBack();
    try {
      window.history.back();
    } catch {
      // ignore
    }
    setTimeout(() => {
      isInAppBackActionRef.current = false;
    }, 150);
  };

  // Browser / Android physical back button synchronization & Capacitor Native Integration
  useEffect(() => {
    initCapacitorMobile();

    try {
      window.history.replaceState({ appStep: 0 }, "");
    } catch {
      // ignore
    }

    const handlePopState = () => {
      // If back was already handled by in-app back button, don't execute twice
      if (isInAppBackActionRef.current) {
        isInAppBackActionRef.current = false;
        return;
      }
      executeGlobalBack();
    };

    window.addEventListener("popstate", handlePopState);

    let capListenerHandle: any = null;
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener("backButton", () => {
        const hasOverlay =
          isExitRevisionConfirmOpenRef.current ||
          isRevisionModalOpenRef.current ||
          isExportModalOpenRef.current ||
          isVoiceMemoOpenRef.current ||
          isNavButtonStyleModalOpenRef.current ||
          isEcosystemModalOpenRef.current ||
          confirmLectureRef.current ||
          isCustomRevisionOpenRef.current ||
          isNavDrawerOpenRef.current ||
          isSearchOpenRef.current ||
          isAddLectureModalOpenRef.current ||
          isGeminiModalOpenRef.current ||
          isVacationModalOpenRef.current;

        const currentStack = navStackRef.current;
        const isSubPage = currentStack.length > 1;
        const isNonHomeTab = currentStack[0] && currentStack[0].type === "tab" && currentStack[0].id !== "home";

        if (hasOverlay || isSubPage || isNonHomeTab) {
          executeGlobalBack();
        } else {
          CapApp.exitApp();
        }
      }).then((handle) => {
        capListenerHandle = handle;
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (capListenerHandle) {
        capListenerHandle.remove();
      }
    };
  }, []);

  // Toast / Status banner with optional action (e.g. Undo)
  const [toastMessage, setToastMessage] = useState<{ 
    text: string; 
    type: "success" | "info";
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (
    text: string, 
    type: "success" | "info" = "success",
    action?: { label: string; onClick: () => void }
  ) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage({ 
      text, 
      type, 
      actionLabel: action?.label, 
      onAction: action?.onClick 
    });
    // Keep notification visible for 15 seconds so the user can read it comfortably
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 15000);
  };

  const dismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(null);
  };

  const [currentUserId, setCurrentUserId] = useState<string | null>(auth.currentUser?.uid || null);

  // Initial Load & Cloud Sync with Authenticated User
  useEffect(() => {
    const loaded = loadLectures();
    setLectures(loaded);

    // Ensure anonymous auth and sync user's isolated data from Google Cloud Firestore
    ensureAuthenticatedUser().then((user) => {
      if (user) {
        setCurrentUserId(user.uid);
        loadUserDataFromCloud(user.uid).then((cloudData) => {
          if (cloudData && cloudData.lectures && cloudData.lectures.length > 0) {
            setLectures(cloudData.lectures);
            saveLectures(cloudData.lectures);
            if (cloudData.config) {
              setConfig(cloudData.config);
              saveConfig(cloudData.config);
            }
          }
        }).catch((err: any) => {
          console.log("Cloud load sync note:", err);
        });
      }
    });
  }, []);

  // Global Ctrl+K / ⌘K shortcut listener for instant search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync to localStorage and Google Cloud Firestore
  const updateLectures = (newLectures: LectureItem[]) => {
    setLectures(newLectures);
    saveLectures(newLectures);
    const uid = currentUserId || auth.currentUser?.uid;
    if (uid) {
      saveUserDataToCloud(uid, newLectures, config).catch((err: any) => {
        console.error("Cloud save error:", err);
      });
    }
  };

  const handleUpdateConfig = (partial: Partial<CockpitConfig>) => {
    const updated = { ...config, ...partial };
    setConfig(updated);
    saveConfig(updated);
    const uid = currentUserId || auth.currentUser?.uid;
    if (uid) {
      saveUserDataToCloud(uid, lectures, updated).catch((err: any) => {
        console.error("Cloud save error:", err);
      });
    }
  };

  // Live Google Sheets Synchronization
  const handleSyncLiveSheet = async (sheetId: string): Promise<{ count: number; message: string }> => {
    const targetId = sheetId.trim() || DEFAULT_SPREADSHEET_ID;
    const res = await fetch(`/api/sheets/fetch?sheetId=${encodeURIComponent(targetId)}&gid=625661383`);
    if (!res.ok) {
      throw new Error(`Google Sheets fetch failed (Status ${res.status})`);
    }
    const csvText = await res.text();
    const rows = csvText.split("\n").map(line => {
      const cells: string[] = [];
      let inQuotes = false;
      let current = "";
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          cells.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      cells.push(current.trim());
      return cells;
    });

    if (rows.length <= 2) {
      throw new Error("स्प्रेडशीट में कोई डेटा नहीं मिला");
    }

    const newLectures: LectureItem[] = [...lectures];
    const lecMap = new Map<string, number>();
    newLectures.forEach((l, i) => lecMap.set(`${l.subject}:::${l.chapter}:::${l.lectureNumber}`, i));

    let updatedCount = 0;
    for (let i = 2; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length < 4) continue;
      const uid = r[0] || "";
      const subject = r[1] || "";
      const chapter = r[2] || "";
      const lectureName = r[3] || "";
      const difficulty = (r[4] === "Easy" || r[4] === "Hard" ? r[4] : "Medium") as DifficultyRating;
      const lastRev = r[5] || "";
      const nextDue = r[7] || "";
      const overdueDays = parseInt(r[8] || "0", 10) || 0;
      const revCount = parseInt(r[9] || "0", 10) || 0;
      const minT = parseInt(r[10] || "0", 10) || 15;
      const avgT = parseInt(r[11] || "0", 10) || 20;
      const maxT = parseInt(r[12] || "0", 10) || 30;

      if (!subject || !chapter || !lectureName) continue;
      const lMatch = lectureName.match(/\d+/);
      const lecNum = lMatch ? parseInt(lMatch[0], 10) : 1;
      const key = `${subject}:::${chapter}:::${lecNum}`;

      const formattedNextDue = nextDue.includes("/") 
        ? nextDue.split("/").reverse().join("-")
        : nextDue || TODAY_STR;

      if (lecMap.has(key)) {
        const idx = lecMap.get(key)!;
        newLectures[idx] = {
          ...newLectures[idx],
          id: uid || newLectures[idx].id,
          revisionCount: revCount > 0 ? revCount : newLectures[idx].revisionCount,
          lastRating: difficulty,
          nextDueDate: formattedNextDue,
          isOverdueLegacyDebt: overdueDays > 0,
          minTimeMinutes: minT > 0 ? minT : newLectures[idx].minTimeMinutes,
          avgTimeMinutes: avgT > 0 ? avgT : newLectures[idx].avgTimeMinutes,
          maxTimeMinutes: maxT > 0 ? maxT : newLectures[idx].maxTimeMinutes,
        };
        updatedCount++;
      }
    }

    updateLectures(newLectures);
    showToast(`✅ Google Sheet से ${updatedCount} लेक्चर्स सफलतापूर्वक सिंक हुए!`);
    return {
      count: updatedCount,
      message: `सफलता! Google Sheet से ${updatedCount} लेक्चर्स का डेटा सिंक हो गया।`
    };
  };

  // 1. Revision Completion Handler (Stopwatch, Ratings & Pre-Revision Reminders)
  const handleCompleteRevision = (
    lectureId: string,
    timeSpentMinutes: number,
    rating?: DifficultyRating,
    remindersData?: {
      previousMistakes?: string;
      calculationTricks?: string;
      referenceLinks?: ReferenceLink[];
      comprehensionLevel?: "पक्का" | "सामान्य" | "संशय";
    }
  ) => {
    const current = lectures.find((l) => l.id === lectureId);
    if (!current) return;

    const today = getTodayStr();
    const { nextDate, nextPhase } = calculateNextRevision(current, rating, today);

    const newRevCount = current.revisionCount + 1;
    const isStep1Done = current.step1Completed || nextPhase === "1-Day";
    const isStep2Done = current.step2Completed || nextPhase === "3-Day";

    // Recalculate Min, Avg, Max dynamically
    const newMin = current.minTimeMinutes > 0 ? Math.min(current.minTimeMinutes, timeSpentMinutes) : timeSpentMinutes;
    const newMax = Math.max(current.maxTimeMinutes, timeSpentMinutes);
    const newAvg = current.avgTimeMinutes > 0 ? Math.round((current.avgTimeMinutes + timeSpentMinutes) / 2) : timeSpentMinutes;

    const updated = lectures.map((l) => {
      if (l.id === lectureId) {
        const newLogEntry: RevisionLogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          attemptNumber: newRevCount,
          date: TODAY_STR,
          timeSpentMinutes,
          difficultyRating: rating || l.lastRating,
          comprehensionLevel: remindersData?.comprehensionLevel || "पक्का",
          mistakes: remindersData?.previousMistakes || "",
          tricks: remindersData?.calculationTricks || "",
          links: remindersData?.referenceLinks || [],
          isHidden: false,
        };

        const currentLogs = l.revisionLogs || [];
        const newLogs = [...currentLogs, newLogEntry];

        return {
          ...l,
          step1Completed: isStep1Done,
          step2Completed: isStep2Done,
          revisionCount: newRevCount,
          lastRating: rating || l.lastRating,
          lastRevisionDate: TODAY_STR,
          nextDueDate: nextDate,
          status: (newRevCount >= 4 ? "completed" : "active") as LectureItem["status"],
          minTimeMinutes: newMin,
          avgTimeMinutes: newAvg,
          maxTimeMinutes: newMax,
          revisionLogs: newLogs,
          previousMistakes: remindersData?.previousMistakes || l.previousMistakes,
          calculationTricks: remindersData?.calculationTricks || l.calculationTricks,
          referenceLinks: remindersData?.referenceLinks || l.referenceLinks,
          comprehensionLevel: remindersData?.comprehensionLevel || l.comprehensionLevel,
        };
      }
      return l;
    });

    updateLectures(updated);
    showToast(`सफलतापूर्वक '${current.title}' का रिवीज़न #${newRevCount} दर्ज! अगली तारीख: ${nextDate}`);

    // Trigger golden celebration burst modal
    setCelebrationData({
      isOpen: true,
      title: current.title,
      chapter: current.chapter,
      attemptNumber: newRevCount,
      nextDate: nextDate,
    });
  };

  // Delete specific Revision Log Entry (with confirmation handled in UI)
  const handleDeleteRevisionLog = (lectureId: string, logId: string) => {
    const updated = lectures.map((l) => {
      if (l.id === lectureId && l.revisionLogs) {
        const filtered = l.revisionLogs.filter((entry) => entry.id !== logId);
        return {
          ...l,
          revisionLogs: filtered,
        };
      }
      return l;
    });
    updateLectures(updated);
    showToast("रिवीज़न रिकॉर्ड सफलतापूर्वक हटा दिया गया।");
  };

  // Toggle Visibility / Hide specific Revision Log Entry
  const handleToggleHideRevisionLog = (lectureId: string, logId: string) => {
    const updated = lectures.map((l) => {
      if (l.id === lectureId && l.revisionLogs) {
        const toggled = l.revisionLogs.map((entry) =>
          entry.id === logId ? { ...entry, isHidden: !entry.isHidden } : entry
        );
        return {
          ...l,
          revisionLogs: toggled,
        };
      }
      return l;
    });
    updateLectures(updated);
  };

  // Quick Complete without modal
  const handleQuickComplete = (lectureId: string, rating?: DifficultyRating) => {
    const item = lectures.find((l) => l.id === lectureId);
    if (item) {
      handleCompleteRevision(lectureId, item.avgTimeMinutes, rating);
    }
  };

  // 2. Vacation / Pause Mode Modal Open & Confirmations
  const handleToggleVacation = () => {
    setIsVacationModalOpen(true);
  };

  const handleConfirmStartVacation = () => {
    handleUpdateConfig({
      vacationMode: true,
      vacationStartDate: TODAY_STR,
      vacationDaysCount: 1,
    });
    showToast("छुट्टी मोड चालू किया गया। रिवीज़न कैलेंडर पॉज़ हो गया है।", "info");
  };

  const handleConfirmEndVacation = (daysToShift: number) => {
    const finalDays = Math.max(0, daysToShift);
    if (finalDays > 0) {
      const shifted = shiftTasksForVacation(lectures, finalDays, TODAY_STR);
      updateLectures(shifted);
      showToast(`छुट्टी मोड समाप्त! सभी लेक्चर्स ${finalDays} दिन आगे खिसकाए गए (0 अतिरिक्त बैकलॉग)।`);
    } else {
      showToast("छुट्टी मोड बंद किया गया। तारीखों में कोई बदलाव नहीं हुआ।");
    }
    handleUpdateConfig({
      vacationMode: false,
      vacationStartDate: undefined,
      vacationDaysCount: 0,
    });
  };

  // 3. Auto-Leveling / Smooth Load Balancer
  const handleAutoLevel = () => {
    const { updatedLectures, shiftedCount } = autoLevelSchedule(
      lectures,
      config.dailyQuota,
      TODAY_STR
    );
    updateLectures(updatedLectures);
    showToast(`⚡ सफलता! ${shiftedCount} अतिरिक्त लेक्चर्स को आगामी हल्के दिनों में संतुलित किया गया।`);
  };

  // 4. Strategic Debt Reset (Phase 1)
  const handleExecuteDebtReset = (selectedKeepActiveIds: string[]) => {
    const updated = lectures.map((l) => {
      // If student chose to keep this lecture active
      if (selectedKeepActiveIds.includes(l.id)) {
        return {
          ...l,
          status: "due_today" as const,
          nextDueDate: TODAY_STR,
          step1Completed: true, // Keep foundation fresh
          isOverdueLegacyDebt: false,
        };
      }
      // Else archive legacy debt
      return {
        ...l,
        status: "archived" as const,
        archivedReason: "रणनीतिक डेब्ट रिसेट (Phase 1)",
      };
    });

    updateLectures(updated);
    showToast(`🛡️ डेब्ट रिसेट पूर्ण! ${selectedKeepActiveIds.length} लेक्चर्स सक्रिय रखे गए, शेष सुरक्षित संग्रह (Vault) में आर्काइव हुए।`);
  };

  // Restore all archived lectures
  const handleRestoreAllArchived = () => {
    const updated = lectures.map((l) => ({
      ...l,
      status: "active" as const,
      archivedReason: undefined,
    }));
    updateLectures(updated);
    showToast("🔄 सभी आर्काइव्ड लेक्चर्स पुनः सक्रिय किए गए।");
  };

  // Reactivate single lecture from Vault
  const handleReactivateSingle = (lectureId: string) => {
    const updated = lectures.map((l) => {
      if (l.id === lectureId) {
        return {
          ...l,
          status: "due_today" as const,
          nextDueDate: TODAY_STR,
          archivedReason: undefined,
        };
      }
      return l;
    });
    updateLectures(updated);
    showToast("✅ लेक्चर सक्रिय कॉकपिट में वापस लाया गया।");
  };

  // Reschedule single lecture to a new date
  const handleRescheduleLecture = (lectureId: string, newDate: string) => {
    const updated = lectures.map((l) => (l.id === lectureId ? { ...l, nextDueDate: newDate } : l));
    updateLectures(updated);
    showToast(`📅 लेक्चर को ${newDate} पर रीशेड्यूल किया गया।`);
  };

  // Quick Rating change from Master DB
  const handleQuickRatingChange = (lectureId: string, rating: DifficultyRating) => {
    const item = lectures.find((l) => l.id === lectureId);
    if (!item) return;
    const today = getTodayStr();
    const { nextDate } = calculateNextRevision(item, rating, today);
    const updated = lectures.map((l) =>
      l.id === lectureId ? { ...l, lastRating: rating, nextDueDate: nextDate } : l
    );
    updateLectures(updated);
    showToast(`⭐ कठिनाई सेट: ${rating} ➔ अगली तारीख: ${nextDate}`);
  };

  // Mark lecture as studied (moves from "not_started" to active revision queue scheduled for 24h)
  const handleMarkAsStudied = (lectureId: string) => {
    const target = lectures.find((l) => l.id === lectureId);
    if (!target) return;
    const today = getTodayStr();
    // When marked as studied today, 1st revision is due tomorrow (+1 day)
    const tomorrow = new Date(today + "T00:00:00");
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDue = tomorrow.toISOString().split("T")[0];

    // Keep snapshot for undo
    const previousState = { ...target };

    const updated = lectures.map((l) => {
      if (l.id === lectureId) {
        return {
          ...l,
          status: "in_queue" as const,
          addedDate: today,
          nextDueDate: nextDue,
          step1Completed: false,
          step2Completed: false,
          revisionCount: 0,
        };
      }
      return l;
    });

    updateLectures(updated);
    showToast(
      `✅ '${target.chapter} - ${target.title}' की पढ़ाई पूरी! 24 घंटे में पहला रिवीज़न शेड्यूल हुआ।`,
      "success",
      {
        label: "↩️ वापस लें (Undo)",
        onClick: () => {
          const reverted = lectures.map((l) => (l.id === lectureId ? previousState : l));
          updateLectures(reverted);
          showToast(`↩️ '${target.chapter} - ${target.title}' को वापस '⚪ अभी बाकी' कर दिया गया।`, "info");
        }
      }
    );
  };

  // Reset lecture to "not_started" (Undo from Master DB anytime)
  const handleResetToNotStarted = (lectureId: string) => {
    const target = lectures.find((l) => l.id === lectureId);
    if (!target) return;
    const updated = lectures.map((l) => {
      if (l.id === lectureId) {
        return {
          ...l,
          status: "not_started" as const,
          revisionCount: 0,
          step1Completed: false,
          step2Completed: false,
          lastRating: undefined,
          lastRevisionDate: undefined,
          nextDueDate: TODAY_STR,
        };
      }
      return l;
    });
    updateLectures(updated);
    showToast(`↩️ '${target.chapter} - ${target.title}' को वापस '⚪ अभी बाकी' कर दिया गया।`, "info");
  };

  // Add new lecture
  const handleAddNewLecture = (newItem: LectureItem) => {
    const updated = [newItem, ...lectures];
    updateLectures(updated);
    showToast(`🎉 नया लेक्चर '${newItem.title}' मास्टर डेटाबेस में जोड़ा गया!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = exportToCSV(lectures);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `smart_revision_master_log_${TODAY_STR}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📥 Master Task Log CSV डाउनलोड हुआ!");
  };

  // Save Gemini answer directly to lecture notes
  const handleSaveNotesToLecture = (lectureId: string, notes: string) => {
    const updated = lectures.map((l) => (l.id === lectureId ? { ...l, conceptNotes: notes } : l));
    updateLectures(updated);
    showToast("💾 Gemini नोट्स लेक्चर में सहेजे गए!");
  };

  // Derived counts
  const archivedCount = lectures.filter((l) => l.status === "archived").length;
  const activeTodayCount = lectures.filter(
    (l) => l.status !== "archived" && l.nextDueDate <= TODAY_STR
  ).length;
  const completedTodayCount = lectures.filter(
    (l) => l.lastRevisionDate === TODAY_STR
  ).length;
  const masteredCount = lectures.filter(
    (l) => l.status === "completed" || l.revisionCount >= 4
  ).length;

  const currentEco = getEcosystem(ecosystem);

  return (
    <div className={`min-h-screen ${currentEco.bodyBg} text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900 transition-colors duration-300`}>
      
      {/* Modern, Clean Top Header */}
      <AppHeader
        title={currentTitle}
        canGoBack={canGoBack}
        onGoBack={handleGoBack}
        onOpenDrawer={() => setIsNavDrawerOpen((prev) => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddLecture={() => setIsAddLectureModalOpen(true)}
        onOpenGemini={() => {
          setGeminiLectureContext(null);
          setIsGeminiModalOpen(true);
        }}
        isVacationActive={!!config.vacationMode}
        onToggleVacation={handleToggleVacation}
        streakCount={completedTodayCount > 0 ? 1 : 0}
      />

      {/* Modern Overlay Navigation Drawer */}
      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          handleSwitchTab(tab);
          setIsNavDrawerOpen(false);
        }}
        config={config}
        onToggleVacation={handleToggleVacation}
        archivedCount={archivedCount}
        totalLectures={lectures.length}
        activeTodayCount={activeTodayCount}
        completedTodayCount={completedTodayCount}
        masteredCount={masteredCount}
        onOpenGeminiModal={() => {
          setGeminiLectureContext(null);
          setIsGeminiModalOpen(true);
        }}
        onOpenAppsScriptModal={handleOpenAppsScript}
        onOpenDirectory={handleOpenDirectory}
        onOpenDebtModal={handleOpenDebtReset}
        onExportCSV={handleExportCSV}
        onOpenExportModal={() => handleOpenExportModal("all_in_one")}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={handleOpenSettings}
        onOpenButtonStyleModal={() => setIsNavButtonStyleModalOpen(true)}
        onOpenEcosystemModal={() => setIsEcosystemModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl lg:max-w-5xl w-full mx-auto px-3.5 sm:px-6 pt-3 pb-24 sm:pb-28 transition-all duration-200">
        
        {/* Centered Notification Banner (Pushes content down, restores when removed) */}
        {toastMessage && (
          <div className="mb-2 sm:mb-3 flex justify-center w-full transition-all duration-300">
            <div className="w-full max-w-2xl bg-stone-900/75 backdrop-blur-md backdrop-saturate-150 text-white pl-4 pr-2.5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 border border-white/15 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                <span className="leading-snug break-words">{toastMessage.text}</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {toastMessage.actionLabel && toastMessage.onAction && (
                  <button
                    onClick={() => {
                      toastMessage.onAction?.();
                      dismissToast();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition-colors"
                  >
                    {toastMessage.actionLabel}
                  </button>
                )}
                <button
                  id="btn-dismiss-toast"
                  onClick={dismissToast}
                  aria-label="नोटिफिकेशन बंद करें"
                  title="नोटिफिकेशन हटाएं"
                  className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Animated View Container */}
        <div key={currentNav.id} className={`w-full ${getTransitionClass()}`}>
          {/* Full Page Dedicated Views */}
          {currentNav.type === "page" && currentNav.id === "subjects_directory" && (
            <SubjectsDirectoryView
              lectures={lectures}
              onGoBack={handleGoBack}
              backTitle={backTitle}
              initialSubjectName={currentNav.params?.subjectName}
              initialChapterName={currentNav.params?.chapterName}
              onStartRevision={(lec) => {
                setActiveRevisionLecture(lec);
                setIsRevisionModalOpen(true);
              }}
              onAskGemini={(lec) => {
                setGeminiLectureContext(lec);
                setIsGeminiModalOpen(true);
              }}
              onViewTopicDetail={(lec) => handleOpenTopicDetail(lec, false)}
              onOpenAddLecture={handleOpenAddLectureModal}
              onOpenExportModal={handleOpenExportModal}
            />
          )}

          {currentNav.type === "page" && currentNav.id === "debt_reset" && (
            <DebtResetView
              onGoBack={handleGoBack}
              backTitle={backTitle}
              lectures={lectures}
              onExecuteReset={handleExecuteDebtReset}
              onRestoreAll={handleRestoreAllArchived}
              archivedCount={archivedCount}
            />
          )}

          {currentNav.type === "page" && currentNav.id === "settings" && (
            <SettingsView
              onGoBack={handleGoBack}
              backTitle={backTitle}
              navButtonStyle={navButtonStyle}
              onSelectNavButtonStyle={handleSelectNavButtonStyle}
              bottomBarStyle={bottomBarStyle}
              onSelectBottomBarStyle={handleSelectBottomBarStyle}
              screenTransition={screenTransition}
              onSelectScreenTransition={handleSelectScreenTransition}
              speedMode={speedMode}
              onSelectSpeedMode={handleSelectSpeedMode}
              scrollSensitivity={scrollSensitivity}
              onSelectScrollSensitivity={handleSelectScrollSensitivity}
              searchDisplayType={searchDisplayType}
              onSelectSearchDisplayType={handleSelectSearchDisplayType}
              config={config}
              onUpdateConfig={handleUpdateConfig}
              onOpenDirectory={handleOpenDirectory}
              onOpenDebtModal={handleOpenDebtReset}
              onExportCSV={() => handleOpenExportModal("all_in_one")}
            />
          )}

          {currentNav.type === "page" && currentNav.id === "apps_script" && (
            <AppsScriptSyncView
              onGoBack={handleGoBack}
              backTitle={backTitle}
              onExportCSV={() => handleOpenExportModal("all_in_one")}
              onSyncLiveSheet={handleSyncLiveSheet}
            />
          )}

          {currentNav.type === "page" && currentNav.id === "topic_detail" && (
            <TopicDetailView
              lecture={
                (currentNav.params?.lectureId
                  ? lectures.find((l) => l.id === currentNav.params?.lectureId)
                  : null) ||
                selectedTopicLecture ||
                lectures[0]
              }
              onGoBack={handleGoBack}
              backTitle={backTitle}
              onStartRevision={(lec) => {
                setActiveRevisionLecture(lec);
                setIsRevisionModalOpen(true);
              }}
              onAskGemini={(lec) => {
                setGeminiLectureContext(lec);
                setIsGeminiModalOpen(true);
              }}
              onUpdateLecture={handleUpdateSingleLecture}
            />
          )}

          {currentNav.type === "page" && currentNav.id === "mistake_queue" && (
            <MistakesQueueView
              lectures={lectures}
              onGoBack={handleGoBack}
              backTitle={backTitle}
              onStartRevision={(lec) => {
                setActiveRevisionLecture(lec);
                setIsRevisionModalOpen(true);
              }}
              onViewLecture={(lec: LectureItem) => handleOpenTopicDetail(lec)}
            />
          )}

          {currentNav.type === "page" && currentNav.id === "focus_timer" && (
            <FocusTimerView
              onGoBack={handleGoBack}
              backTitle={backTitle}
              lectureTitle={selectedTopicLecture ? `${selectedTopicLecture.subject}: ${selectedTopicLecture.title}` : undefined}
            />
          )}

          {currentNav.type === "page" && currentNav.id === "notes_editor" && (
            <NotesEditorView
              onGoBack={handleGoBack}
              backTitle={backTitle}
              lectureId={selectedTopicLecture?.id}
              lectureTitle={selectedTopicLecture?.title}
            />
          )}

          {/* Master DB rendered as page or tab */}
          {((currentNav.type === "page" && currentNav.id === "master_db") || (currentNav.type === "tab" && currentNav.id === "master_db")) && (
            <MasterDatabase
              lectures={lectures}
              onStartRevision={(lec) => {
                setActiveRevisionLecture(lec);
                setIsRevisionModalOpen(true);
              }}
              onAskGemini={(lec) => {
                setGeminiLectureContext(lec);
                setIsGeminiModalOpen(true);
              }}
              onOpenAddLecture={() => handleOpenAddLectureModal()}
              onExportCSV={handleExportCSV}
              onOpenExportModal={handleOpenExportModal}
              onQuickRatingChange={handleQuickRatingChange}
              onOpenDirectory={handleOpenDirectory}
              onMarkAsStudied={(lectureId) => {
                const lec = lectures.find((l) => l.id === lectureId);
                if (lec) setConfirmStudiedLecture(lec);
              }}
              onResetToNotStarted={(lectureId) => {
                const lec = lectures.find((l) => l.id === lectureId);
                if (lec) setConfirmResetLecture(lec);
              }}
            />
          )}

          {/* Debt Vault rendered as page or tab */}
          {((currentNav.type === "page" && currentNav.id === "debt_vault") || (currentNav.type === "tab" && currentNav.id === "debt_vault")) && (
            <DebtVaultView
              lectures={lectures}
              onReactivateLecture={handleReactivateSingle}
              onOpenDebtResetModal={handleOpenDebtReset}
              onRestoreAllArchived={handleRestoreAllArchived}
            />
          )}

          {/* Main 5 Primary Tabs */}
          {currentNav.type === "tab" && currentNav.id === "home" && (
            <HomePage
              lectures={lectures}
              config={config}
              onNavigateTab={(tab) => {
                handleSwitchTab(tab);
              }}
              onOpenGeminiModal={() => {
                setGeminiLectureContext(null);
                setIsGeminiModalOpen(true);
              }}
              onOpenDirectory={handleOpenDirectory}
              activeTodayCount={activeTodayCount}
              completedTodayCount={completedTodayCount}
              archivedCount={archivedCount}
              masteredCount={masteredCount}
              totalLectures={lectures.length}
              onOpenAddLecture={() => handleOpenAddLectureModal()}
              onOpenAppsScriptModal={handleOpenAppsScript}
              onExportCSV={handleExportCSV}
              onOpenExportModal={handleOpenExportModal}
              onToggleVacation={handleToggleVacation}
            />
          )}

          {currentNav.type === "tab" && currentNav.id === "cockpit" && (
            <CockpitDashboard
              lectures={lectures}
              config={config}
              onUpdateConfig={handleUpdateConfig}
              onStartRevision={(lec) => {
                setActiveRevisionLecture(lec);
                setIsRevisionModalOpen(true);
              }}
              onQuickComplete={handleQuickComplete}
              onAskGemini={(lec) => {
                setGeminiLectureContext(lec);
                setIsGeminiModalOpen(true);
              }}
              onOpenDebtModal={handleOpenDebtReset}
              onToggleVacation={handleToggleVacation}
              archivedDebtCount={archivedCount}
              onOpenCustomRevision={() => setIsCustomRevisionOpen(true)}
              onViewTopicDetail={handleOpenTopicDetail}
            />
          )}

          {currentNav.type === "tab" && currentNav.id === "heatmap" && (
            <HeatmapForecast
              lectures={lectures}
              config={config}
              onAutoLevel={handleAutoLevel}
              onRescheduleLecture={handleRescheduleLecture}
            />
          )}

          {currentNav.type === "tab" && currentNav.id === "audit_grid" && (
            <AuditFrequencyGrid
              lectures={lectures}
              onStartRevision={(lec) => {
                setActiveRevisionLecture(lec);
                setIsRevisionModalOpen(true);
              }}
            />
          )}

          {currentNav.type === "tab" && currentNav.id === "more" && (
            <MoreHubView
              onNavigatePage={(p) => handleOpenPage(p)}
              onNavigateTab={(t) => handleSwitchTab(t)}
              archivedDebtCount={archivedCount}
              mistakesCount={lectures.filter((l) => l.lastRating === "Hard" || Boolean(l.previousMistakes)).length}
              totalLectures={lectures.length}
              onExportCSV={handleExportCSV}
              onOpenExportModal={handleOpenExportModal}
              onOpenGemini={() => {
                setGeminiLectureContext(null);
                setIsGeminiModalOpen(true);
              }}
              onToggleVacation={handleToggleVacation}
              isVacationActive={!!config.vacationMode}
              onOpenButtonStyleModal={() => setIsNavButtonStyleModalOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Floating Slim Navigation Bar (Icons on Mobile, Icons + Text on Desktop) */}
      <AppBottomNav
        activeTab={activeTab}
        onSelectTab={handleSwitchTab}
        activeTodayCount={activeTodayCount}
        archivedCount={archivedCount}
        hidden={canGoBack}
      />

      {/* Fast Contextual Popups */}
      <RevisionSessionModal
        isOpen={isRevisionModalOpen}
        lecture={activeRevisionLecture}
        onClose={() => {
          setIsRevisionModalOpen(false);
          setActiveRevisionLecture(null);
        }}
        onComplete={handleCompleteRevision}
        onDeleteLog={handleDeleteRevisionLog}
        onToggleHideLog={handleToggleHideRevisionLog}
        onAskGemini={(lec) => {
          setGeminiLectureContext(lec);
          setIsGeminiModalOpen(true);
        }}
      />

      <GeminiDoubtModal
        isOpen={isGeminiModalOpen}
        lecture={geminiLectureContext}
        onClose={() => setIsGeminiModalOpen(false)}
        onSaveNotesToLecture={handleSaveNotesToLecture}
      />

      <AddLectureModal
        isOpen={isAddLectureModalOpen}
        onClose={() => setIsAddLectureModalOpen(false)}
        onAdd={handleAddNewLecture}
        initialSubject={addLectureDefaults.subject}
        initialChapter={addLectureDefaults.chapter}
      />

      <EcosystemSwitcherModal
        isOpen={isEcosystemModalOpen}
        activeEcosystem={ecosystem}
        onSelectEcosystem={handleSelectEcosystem}
        onClose={() => setIsEcosystemModalOpen(false)}
      />

      <ConfirmStudiedModal
        isOpen={!!confirmStudiedLecture}
        lecture={confirmStudiedLecture}
        onClose={() => setConfirmStudiedLecture(null)}
        onConfirm={handleMarkAsStudied}
      />

      <ConfirmResetModal
        isOpen={!!confirmResetLecture}
        lecture={confirmResetLecture}
        onClose={() => setConfirmResetLecture(null)}
        onConfirm={handleResetToNotStarted}
      />

      <VacationModal
        isOpen={isVacationModalOpen}
        onClose={() => setIsVacationModalOpen(false)}
        isVacationActive={!!config.vacationMode}
        defaultDays={config.vacationDaysCount || 1}
        onConfirmStart={handleConfirmStartVacation}
        onConfirmEnd={handleConfirmEndVacation}
      />

      {/* Records & Syllabus CSV / Excel (.xlsx) Export Hub Modal */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        lectures={lectures}
        initialDataset={exportModalDefaults.dataset}
        initialSubject={exportModalDefaults.subject}
        onExportSuccess={(msg) => showToast(msg, "success")}
      />

      {/* Custom Revision Session Builder Modal */}
      <CustomRevisionModal
        isOpen={isCustomRevisionOpen}
        onClose={() => setIsCustomRevisionOpen(false)}
        lectures={lectures}
        onStartSession={(sessionLectures) => {
          setIsCustomRevisionOpen(false);
          if (sessionLectures.length > 0) {
            setActiveRevisionLecture(sessionLectures[0]);
            setIsRevisionModalOpen(true);
          }
        }}
      />

      {/* Active Revision Exit Confirmation Dialog (Instruction 17) */}
      {isExitRevisionConfirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6 text-amber-700 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">रिवीज़न सत्र सक्रिय है</h3>
              <p className="text-xs text-stone-600 mt-1">
                रिवीज़न सत्र चल रहा है। क्या आप इसे जारी रखना चाहते हैं या बाहर निकलना चाहते हैं?
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsExitRevisionConfirmOpen(false);
                  setIsRevisionModalOpen(false);
                  setActiveRevisionLecture(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                बाहर निकलें (Exit)
              </button>
              <button
                type="button"
                onClick={() => setIsExitRevisionConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                जारी रखें (Continue)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Search Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lectures={lectures}
        displayType={searchDisplayType}
        onSelectLecture={(lecture) => {
          handleOpenTopicDetail(lecture, true);
        }}
        onNavigateToScreen={(screenId, params) => {
          if (screenId === "subjects_directory") {
            handleOpenPage("subjects_directory", params);
          } else {
            handleOpenPage(screenId as FullPageView, params);
          }
        }}
        onOpenOverlay={(overlayId) => {
          if (overlayId === "add_lecture") {
            handleOpenAddLectureModal();
          } else if (overlayId === "gemini_doubt") {
            setGeminiLectureContext(null);
            setIsGeminiModalOpen(true);
          } else if (overlayId === "vacation") {
            setIsVacationModalOpen(true);
          } else if (overlayId === "export_data") {
            handleOpenExportModal("all_in_one");
          }
        }}
      />

      {/* Revision Celebration Burst Modal */}
      <CelebrationModal
        isOpen={celebrationData.isOpen}
        onClose={() => setCelebrationData((prev) => ({ ...prev, isOpen: false }))}
        title={celebrationData.title}
        chapter={celebrationData.chapter}
        attemptNumber={celebrationData.attemptNumber}
        nextDate={celebrationData.nextDate}
      />

      {/* WhatsApp Voice Memo & Audio Study Recorder Modal */}
      <VoiceStudyMemoModal
        isOpen={isVoiceMemoOpen}
        onClose={() => setIsVoiceMemoOpen(false)}
      />

      {/* Nav Button Style Tester & Switcher Modal (बड़े ऐप्स, साइज, ओपेसिटी, लाइन, बगैर इफ़ेक्ट) */}
      <NavButtonStyleTesterModal
        isOpen={isNavButtonStyleModalOpen}
        onClose={() => setIsNavButtonStyleModalOpen(false)}
        activeStyle={navButtonStyle}
        onSelectStyle={handleSelectNavButtonStyle}
        currentBackTitle={backTitle || "वापस"}
        onConfigChange={(cfg) => {
          setNavButtonStyle(cfg.preset);
        }}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        <p>
          स्मार्ट रिवीज़न कॉकपिट • 2-Step Foundation + Dynamic Quota + 30-Day Auto-Leveling • 
          शून्य बैकलॉग पैनिक • परीक्षा केंद्रित वैज्ञानिक Spaced Repetition
        </p>
      </footer>
    </div>
  );
}
