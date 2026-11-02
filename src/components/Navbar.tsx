import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft,
  Home,
  Menu,
  Compass, 
  Database, 
  CalendarDays, 
  Grid3X3, 
  ShieldCheck, 
  PauseCircle, 
  Sparkles,
  Search,
  Settings,
  Layers,
  SlidersHorizontal,
  BookOpen
} from "lucide-react";
import { CockpitConfig } from "../types";
import { TabGuideModal } from "./TabGuideModal";
import { BigTechEcosystem, ECOSYSTEM_LIST } from "../utils/ecosystemTheme";
import { 
  NavButtonStyle, 
  NavButtonConfig,
  NAV_BUTTON_STYLES, 
  getNavButtonClasses, 
  getStoredNavButtonStyle,
  getStoredNavButtonConfig,
  saveNavButtonConfig
} from "../utils/navButtonStyles";
import {
  TopIconConfig,
  getTopIconClasses,
  getStoredTopIconConfig
} from "../utils/topIconStyles";
import {
  TopBarConfig,
  getTopBarClasses,
  getStoredTopBarConfig,
  getTopStripClasses
} from "../utils/topBarStyles";
import {
  TabConfig,
  getStoredTabConfig,
  getTabIconDisplayClasses,
  getTabNameTypographyClasses,
  getTabStripClasses
} from "../utils/tabStyles";
import { NavButtonStyleTesterModal } from "./NavButtonStyleTesterModal";

export type ActiveTab = "home" | "cockpit" | "heatmap" | "audit_grid" | "more" | "master_db" | "debt_vault";

// User Preferred: "झटपट ग्लाइड (180ms)" & "पक्का स्क्रोल (Calm)"
export type PillSpeedOption = "ultra_fast" | "instant_glide" | "smooth_breeze" | "gentle_float";
export type ScrollSensitivity = "sensitive" | "normal" | "calm";

// Big Tech Top App Screen Transition Architectures
export type ScreenTransitionEffect = 
  | "ios_page_cover" 
  | "material_elevate" 
  | "linear_snap" 
  | "insta_depth" 
  | "spotify_fade" 
  | "mobile_slide" 
  | "none";

// Big Tech Bottom Navigation Bar Styles (कंपनियों के ऐप्स में नीचे वाली पट्टी कैसी होती है):
export type BottomBarStyle = 
  | "water_clear_pill" 
  | "apple_ios_bar" 
  | "google_material_bar" 
  | "spotify_linear_dock" 
  | "instagram_minimal"
  | "capsule_segmented"
  | "modern_floating";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
  backTitle?: string;
  customTitle?: string;
  config: CockpitConfig;
  onToggleVacation: () => void;
  archivedCount: number;
  totalLectures: number;
  activeTodayCount: number;
  onOpenGeminiModal: () => void;
  onOpenAppsScriptModal: () => void;
  onOpenDirectory?: () => void;
  onOpenDrawer?: () => void;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
  activeEcosystem?: BigTechEcosystem;
  onSelectEcosystem?: (eco: BigTechEcosystem) => void;
  onOpenEcosystemModal?: () => void;
  screenTransition: ScreenTransitionEffect;
  onSelectScreenTransition: (effect: ScreenTransitionEffect) => void;
  bottomBarStyle?: BottomBarStyle;
  onSelectBottomBarStyle?: (style: BottomBarStyle) => void;
  speedMode?: PillSpeedOption;
  onSelectSpeedMode?: (speed: PillSpeedOption) => void;
  scrollSensitivity?: ScrollSensitivity;
  onSelectScrollSensitivity?: (sens: ScrollSensitivity) => void;
  navButtonStyle?: NavButtonStyle;
  onSelectNavButtonStyle?: (style: NavButtonStyle) => void;
  onOpenButtonStyleModal?: () => void;
}

const PILL_SPEED_KEY = "sm_compact_pill_speed";
const PILL_SENSE_KEY = "sm_compact_pill_sensitivity";
const BOTTOM_BAR_STYLE_KEY = "sm_bottom_bar_style_pref";

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  canGoBack = false,
  onGoBack,
  backTitle,
  customTitle,
  config,
  onToggleVacation,
  archivedCount,
  activeTodayCount,
  onOpenGeminiModal,
  onOpenDrawer,
  onOpenSearch,
  onOpenSettings,
  activeEcosystem,
  onSelectEcosystem,
  onOpenEcosystemModal,
  screenTransition,
  onSelectScreenTransition,
  bottomBarStyle: propBottomBarStyle,
  onSelectBottomBarStyle: propOnSelectBottomBarStyle,
  speedMode: propSpeedMode,
  onSelectSpeedMode: propOnSelectSpeedMode,
  scrollSensitivity: propScrollSensitivity,
  onSelectScrollSensitivity: propOnSelectScrollSensitivity,
  navButtonStyle: propNavButtonStyle,
  onSelectNavButtonStyle: propOnSelectNavButtonStyle,
  onOpenButtonStyleModal,
}) => {
  // Tab Guide Dialog
  const [guideTabKey, setGuideTabKey] = useState<ActiveTab | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Button Style State & Live Tester Modal
  const [internalNavButtonStyle, setInternalNavButtonStyle] = useState<NavButtonStyle>(() => {
    return propNavButtonStyle || getStoredNavButtonStyle();
  });
  const [navButtonConfig, setNavButtonConfig] = useState<NavButtonConfig>(() => getStoredNavButtonConfig());
  const [isButtonStyleModalOpen, setIsButtonStyleModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (propNavButtonStyle) {
      setInternalNavButtonStyle(propNavButtonStyle);
      setNavButtonConfig((prev) => ({ ...prev, preset: propNavButtonStyle }));
    }
  }, [propNavButtonStyle]);

  // Sync config when modal or settings change
  const refreshNavButtonConfig = () => {
    setNavButtonConfig(getStoredNavButtonConfig());
  };

  const activeNavButtonStyle = propNavButtonStyle || internalNavButtonStyle;

  const handleSelectNavButtonStyle = (style: NavButtonStyle) => {
    setInternalNavButtonStyle(style);
    const updated = { ...getStoredNavButtonConfig(), preset: style };
    saveNavButtonConfig(updated);
    setNavButtonConfig(updated);
    if (propOnSelectNavButtonStyle) {
      propOnSelectNavButtonStyle(style);
    }
  };

  const backBtnConfig = getNavButtonClasses(activeNavButtonStyle, "back", navButtonConfig);
  const menuBtnConfig = getNavButtonClasses(activeNavButtonStyle, "menu", navButtonConfig);

  // Top Bar & Top Action Icons Config State
  const [topBarConfig, setTopBarConfig] = useState<TopBarConfig>(() => getStoredTopBarConfig());
  const [topIconConfig, setTopIconConfig] = useState<TopIconConfig>(() => getStoredTopIconConfig());
  const [tabConfig, setTabConfig] = useState<TabConfig>(() => getStoredTabConfig());

  useEffect(() => {
    const handleBarUpdate = (e: Event) => {
      const custom = e as CustomEvent<TopBarConfig>;
      if (custom.detail) setTopBarConfig(custom.detail);
      else setTopBarConfig(getStoredTopBarConfig());
    };
    const handleIconUpdate = (e: Event) => {
      const custom = e as CustomEvent<TopIconConfig>;
      if (custom.detail) setTopIconConfig(custom.detail);
      else setTopIconConfig(getStoredTopIconConfig());
    };
    const handleTabUpdate = (e: Event) => {
      const custom = e as CustomEvent<TabConfig>;
      if (custom.detail) setTabConfig(custom.detail);
      else setTabConfig(getStoredTabConfig());
    };

    window.addEventListener("top_bar_config_updated", handleBarUpdate);
    window.addEventListener("top_icon_config_updated", handleIconUpdate);
    window.addEventListener("tab_config_updated", handleTabUpdate);

    return () => {
      window.removeEventListener("top_bar_config_updated", handleBarUpdate);
      window.removeEventListener("top_icon_config_updated", handleIconUpdate);
      window.removeEventListener("tab_config_updated", handleTabUpdate);
    };
  }, []);

  const topBarClasses = getTopBarClasses(topBarConfig);
  const topIconClasses = getTopIconClasses(topIconConfig);
  const topStrip = getTopStripClasses(topBarConfig);
  const tabStripInfo = getTabStripClasses(tabConfig);

  // Speed Mode State
  const [internalSpeedMode, setInternalSpeedMode] = useState<PillSpeedOption>(() => {
    try {
      const saved = localStorage.getItem(PILL_SPEED_KEY) as PillSpeedOption;
      if (saved && ["ultra_fast", "instant_glide", "smooth_breeze", "gentle_float"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "instant_glide";
  });
  const speedMode = propSpeedMode || internalSpeedMode;

  // Sensitivity State
  const [internalSensitivity, setInternalSensitivity] = useState<ScrollSensitivity>(() => {
    try {
      const saved = localStorage.getItem(PILL_SENSE_KEY) as ScrollSensitivity;
      if (saved && ["sensitive", "normal", "calm"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "calm";
  });
  const sensitivity = propScrollSensitivity || internalSensitivity;
  
  // Big Tech Bottom Bar Style State
  const [internalBottomBarStyle, setInternalBottomBarStyle] = useState<BottomBarStyle>(() => {
    try {
      const saved = localStorage.getItem(BOTTOM_BAR_STYLE_KEY) as BottomBarStyle;
      if (saved && ["water_clear_pill", "apple_ios_bar", "google_material_bar", "spotify_linear_dock", "instagram_minimal"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "water_clear_pill";
  });
  const bottomBarStyle = propBottomBarStyle || internalBottomBarStyle;

  // Smart Scroll Direction State
  const [isDockVisible, setIsDockVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleSelectBottomBarStyle = (style: BottomBarStyle) => {
    if (propOnSelectBottomBarStyle) {
      propOnSelectBottomBarStyle(style);
    } else {
      setInternalBottomBarStyle(style);
      try {
        localStorage.setItem(BOTTOM_BAR_STYLE_KEY, style);
      } catch {
        // ignore
      }
    }
  };

  // High-performance scroll listener to detect scroll up/down with "Calm" defaults
  useEffect(() => {
    const thresholdDown = sensitivity === "sensitive" ? 4 : sensitivity === "normal" ? 8 : 16;
    const thresholdUp = sensitivity === "sensitive" ? -2 : sensitivity === "normal" ? -5 : -10;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollDiff = currentScrollY - lastScrollY.current;

      // Always show when near top of page (first 40px)
      if (currentScrollY < 40) {
        setIsDockVisible(true);
      } else if (scrollDiff > thresholdDown) {
        setIsDockVisible(false);
      } else if (scrollDiff < thresholdUp) {
        setIsDockVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sensitivity]);

  const triggerHaptic = (duration = 8) => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(duration);
      }
    } catch {
      // ignore
    }
  };

  // Metadata for 5 primary tabs
  const tabList: Array<{
    id: ActiveTab;
    name: string;
    shortName: string;
    renderIcon: (isActive: boolean, customColor?: string) => React.ReactNode;
    badge?: number | string;
  }> = [
    {
      id: "home",
      name: "होम",
      shortName: "होम",
      renderIcon: (isActive, customColor) => (
        <Home
          className={`w-5 h-5 shrink-0 transition-colors ${
            customColor || (isActive ? "text-stone-950 font-black stroke-[2.7]" : "text-stone-600 stroke-[2.2]")
          }`}
        />
      ),
    },
    {
      id: "cockpit",
      name: "रिवीज़न",
      shortName: "रिवीज़न",
      renderIcon: (isActive, customColor) => (
        <BookOpen
          className={`w-5 h-5 shrink-0 transition-colors ${
            customColor || (isActive ? "text-stone-950 font-black stroke-[2.7]" : "text-stone-600 stroke-[2.2]")
          }`}
        />
      ),
      badge: activeTodayCount > 0 ? `${activeTodayCount}` : undefined,
    },
    {
      id: "heatmap",
      name: "कैलेंडर",
      shortName: "कैलेंडर",
      renderIcon: (isActive, customColor) => (
        <CalendarDays
          className={`w-5 h-5 shrink-0 transition-colors ${
            customColor || (isActive ? "text-stone-950 font-black stroke-[2.7]" : "text-stone-600 stroke-[2.2]")
          }`}
        />
      ),
    },
    {
      id: "master_db",
      name: "डेटाबेस",
      shortName: "डेटाबेस",
      renderIcon: (isActive, customColor) => (
        <Database
          className={`w-5 h-5 shrink-0 transition-colors ${
            customColor || (isActive ? "text-stone-950 font-black stroke-[2.7]" : "text-stone-600 stroke-[2.2]")
          }`}
        />
      ),
    },
    {
      id: "more",
      name: "अधिक",
      shortName: "अधिक",
      renderIcon: (isActive, customColor) => (
        <Menu
          className={`w-5 h-5 shrink-0 transition-colors ${
            customColor || (isActive ? "text-stone-950 font-black stroke-[2.7]" : "text-stone-600 stroke-[2.2]")
          }`}
        />
      ),
      badge: archivedCount > 0 ? `${archivedCount}` : undefined,
    },
  ];

  const currentTab = tabList.find((t) => t.id === activeTab) || tabList[0];

  const getSpeedClasses = () => "transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1)";
  const isBottomBarHidden = canGoBack || !isDockVisible;

  return (
    <>
      {/* Top Header: Responsive Custom Top Bar & Action Icons */}
      <header className={topBarClasses.headerClasses}>
        {/* Top Strip Ribbon ("Top की पट्टी") - Top Position */}
        {topStrip.isVisible && (topStrip.position === "top" || topStrip.position === "both") && (
          <div className={topStrip.stripClasses} />
        )}

        <div className={topBarClasses.innerClasses}>
          
          <div className={`flex items-center justify-between ${topBarClasses.minHeightClass} gap-1.5 sm:gap-3`}>
            
            {/* Left: Back Button (ONLY if canGoBack on a sub-page) OR ☰ Menu Button + Brand on root tabs */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 min-w-0 flex-1 mr-1">
              {canGoBack ? (
                <button
                  id="btn-nav-back"
                  type="button"
                  onClick={() => {
                    if (navButtonConfig.effect !== "none") triggerHaptic(8);
                    onGoBack?.();
                  }}
                  aria-label={backTitle ? `वापस जाएं: ${backTitle}` : "वापस जाएं (Back)"}
                  title={backTitle ? `वापस जाएं (${backTitle})` : "पिछली स्क्रीन पर वापस जाएं"}
                  className={backBtnConfig.buttonClasses}
                >
                  <ArrowLeft className={backBtnConfig.iconClasses} />
                  <span className={backBtnConfig.textClasses}>{backTitle || "वापस"}</span>
                </button>
              ) : (
                <button
                  id="btn-nav-drawer-menu"
                  type="button"
                  onClick={() => {
                    if (navButtonConfig.effect !== "none") triggerHaptic(6);
                    onOpenDrawer?.();
                  }}
                  aria-label="नेविगेशन मेनू खोलें"
                  title="नेविगेशन मेनू (सभी टैब्स व टूल्स)"
                  className={menuBtnConfig.buttonClasses}
                >
                  <Menu className={menuBtnConfig.iconClasses} />
                  <span className={menuBtnConfig.textClasses}>मेनू</span>
                </button>
              )}

              {/* Title & Brand Icon */}
              <div 
                onClick={() => {
                  if (!canGoBack) {
                    setGuideTabKey(activeTab);
                    setIsGuideOpen(true);
                    triggerHaptic(6);
                  }
                }}
                title={canGoBack ? undefined : "टैब विवरण व गाइड देखने के लिए क्लिक करें"}
                className={`min-w-0 py-0.5 group truncate flex items-center gap-1.5 ${!canGoBack ? "cursor-pointer select-none" : ""}`}
              >
                {!canGoBack && (
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${topBarClasses.isDark ? "bg-amber-400 text-stone-950" : "bg-stone-900 text-amber-400"}`}>
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                )}
                <h1 className={`text-[13.5px] sm:text-[15.5px] font-extrabold tracking-tight leading-tight truncate transition-colors ${topBarClasses.isDark ? "text-white group-hover:text-amber-300" : "text-stone-900 group-hover:text-amber-900"}`}>
                  {customTitle || currentTab.name}
                </h1>
              </div>
            </div>

            {/* Right Actions: Instant Search, Vacation Mode, Gemini AI, Customizer & Settings */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
              
              {/* Instant Search Button (Always visible on all screens) */}
              {onOpenSearch && (
                <button
                  id="btn-navbar-search"
                  onClick={() => {
                    if (topIconConfig.effect !== "none") triggerHaptic(6);
                    onOpenSearch();
                  }}
                  title="त्वरित खोज (Ctrl+K)"
                  aria-label="खोजें"
                  className={topIconClasses.buttonClasses}
                >
                  <Search className={topIconClasses.iconClasses} />
                  <span className="hidden sm:inline text-xs font-bold">खोजें</span>
                </button>
              )}

              {/* Vacation Mode Indicator */}
              {config.vacationMode && (
                <button
                  id="btn-vacation-mode-active"
                  onClick={() => {
                    if (topIconConfig.effect !== "none") triggerHaptic(10);
                    onToggleVacation();
                  }}
                  title="छुट्टी मोड चालू है"
                  className={`${topIconClasses.buttonClasses} text-amber-950 bg-amber-100/90 border border-amber-300 animate-pulse`}
                >
                  <PauseCircle className={`${topIconClasses.iconClasses} text-amber-700`} />
                  <span className="hidden sm:inline text-xs font-bold">छुट्टी</span>
                </button>
              )}

              {/* On Root Tabs ONLY: Show AI Doubt, Customizer, Settings */}
              {!canGoBack && (
                <>
                  {/* Gemini AI Assistant Button */}
                  <button
                    id="btn-open-gemini-assistant"
                    onClick={() => {
                      if (topIconConfig.effect !== "none") triggerHaptic(8);
                      onOpenGeminiModal();
                    }}
                    title="Gemini AI डाउट सॉल्वर"
                    aria-label="Gemini AI डाउट सॉल्वर"
                    className={`${topIconClasses.buttonClasses} ${topIconConfig.preset === "classic_amber" ? "" : "hover:border-amber-300"}`}
                  >
                    <Sparkles className={`${topIconClasses.iconClasses} text-amber-600 shrink-0`} />
                    <span className="hidden sm:inline text-xs font-bold">AI डाउट</span>
                  </button>

                  {/* Customizer / Button Style Switcher */}
                  <button
                    id="btn-navbar-button-style-tester"
                    onClick={() => {
                      if (topIconConfig.effect !== "none") triggerHaptic(6);
                      if (onOpenButtonStyleModal) {
                        onOpenButtonStyleModal();
                      } else {
                        setIsButtonStyleModalOpen(true);
                      }
                    }}
                    title="हेडर व बटन स्टाइल"
                    aria-label="हेडर व बटन स्टाइल बदलें"
                    className={topIconClasses.buttonClasses}
                  >
                    <SlidersHorizontal className={topIconClasses.iconClasses} />
                    <span className="hidden sm:inline text-xs font-bold">स्टाइल</span>
                  </button>

                  {/* Direct Settings Shortcut */}
                  {onOpenSettings && (
                    <button
                      id="btn-navbar-settings"
                      onClick={() => {
                        if (topIconConfig.effect !== "none") triggerHaptic(6);
                        onOpenSettings();
                      }}
                      title="सेटिंग्स"
                      aria-label="सेटिंग्स"
                      className={topIconClasses.buttonClasses}
                    >
                      <Settings className={topIconClasses.iconClasses} />
                      <span className="hidden sm:inline text-xs font-bold">सेटिंग</span>
                    </button>
                  )}
                </>
              )}
            </div>

          </div>

        </div>

        {/* Tab Comprehensive Information & Improvement Guide Modal */}
        <TabGuideModal
          isOpen={isGuideOpen}
          tabKey={guideTabKey}
          onClose={() => setIsGuideOpen(false)}
          onSwitchTab={(tab) => {
            setActiveTab(tab);
            setIsGuideOpen(false);
          }}
        />

        {/* Nav Button Style Tester Modal */}
        <NavButtonStyleTesterModal
          isOpen={isButtonStyleModalOpen}
          onClose={() => setIsButtonStyleModalOpen(false)}
          activeStyle={activeNavButtonStyle}
          onSelectStyle={handleSelectNavButtonStyle}
          currentBackTitle={backTitle || "वापस"}
          onConfigChange={(cfg) => setNavButtonConfig(cfg)}
        />
        {/* Top Strip Ribbon ("Top की पट्टी") - Bottom Position */}
        {topStrip.isVisible && (topStrip.position === "bottom" || topStrip.position === "both") && (
          <div className={topStrip.stripClasses} />
        )}
      </header>

      {/* 7 Big-Tech Options Switcher Bar - Fast 1-Tap Trial Strip */}
      {topBarConfig.showEcoStrip && (
        <nav aria-label="इकोसिस्टम स्टाइल स्विचर" className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-2 sm:px-4 py-1.5 overflow-x-auto no-scrollbar shadow-2xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            <div className="text-[11px] font-extrabold text-stone-600 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1 select-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="hidden sm:inline">7 बिग-टेक स्टाइल्स:</span>
              <span className="sm:hidden">स्टाइल:</span>
            </div>
            {ECOSYSTEM_LIST.map((eco) => {
              const isCurrent = activeEcosystem === eco.id;
              return (
                <button
                  key={eco.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    onSelectEcosystem?.(eco.id);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isCurrent
                      ? "bg-stone-900 text-white shadow-xs scale-105 ring-2 ring-amber-400"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95"
                  }`}
                  title={`${eco.name} - ${eco.tagline}`}
                >
                  <span className="text-xs shrink-0">{eco.icon}</span>
                  <span className="text-[11px]">{eco.shortName}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ------------------------------------------------------------- */}
      {/* BIG TECH BOTTOM NAVIGATION BAR ARCHITECTURE                   */}
      {/* ------------------------------------------------------------- */}

      {/* STYLE 1: WATER CLEAR PILL / FLOATING SLIM CAPSULE (~10px above screen bottom) */}
      {(tabConfig.stripPreset === "water_clear_pill" || (!["apple_ios_bar", "google_material_bar", "spotify_linear_dock", "instagram_minimal", "capsule_segmented", "modern_floating"].includes(tabConfig.stripPreset) && bottomBarStyle === "water_clear_pill")) && (
        <div
          className={`fixed bottom-2.5 sm:bottom-3 inset-x-0 z-40 flex justify-center px-2 pointer-events-none ${getSpeedClasses()} ${
            isBottomBarHidden
              ? "opacity-0 translate-y-14 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="pointer-events-auto inline-flex items-center gap-1 p-1.5 rounded-full border transition-all duration-200 overflow-x-auto no-scrollbar max-w-full bg-white/95 backdrop-blur-xl backdrop-saturate-150 border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-stone-900/5">
            {tabList.map((t) => {
              const isActive = t.id === activeTab;
              const displayName = tabConfig.nameFormat === "full" ? t.name : t.shortName;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab(t.id);
                  }}
                  title={t.name}
                  aria-label={t.name}
                  className={`p-2.5 sm:px-3.5 sm:py-2 rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 relative ${
                    isActive
                      ? "bg-amber-500 text-stone-950 shadow-md font-black scale-105 ring-1 ring-amber-600/30"
                      : "text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 active:scale-95"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-amber-400/20 blur-xs -z-10 animate-pulse" />
                  )}
                  <span className={`shrink-0 ${isActive ? "scale-110" : ""}`}>
                    {t.renderIcon(isActive)}
                  </span>
                  {/* On Mobile (<640px): text hidden. On Desktop (≥640px): text visible side-by-side */}
                  <span className="hidden sm:inline-block text-xs font-bold leading-none select-none">
                    {displayName}
                  </span>
                  {t.badge && (
                    <span
                      className={`text-[9.5px] px-1 rounded-full font-black ${
                        isActive ? "bg-stone-950 text-amber-300" : "bg-rose-500 text-white"
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STYLE 2: APPLE iOS NATIVE TAB BAR */}
      {(tabConfig.stripPreset === "apple_ios_bar" || (tabConfig.stripPreset !== "water_clear_pill" && bottomBarStyle === "apple_ios_bar")) && (
        <div
          className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl backdrop-saturate-150 border-t border-stone-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] ${getSpeedClasses()} ${
            isBottomBarHidden ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="max-w-xl mx-auto flex items-center justify-around px-1 py-1 sm:py-1.5">
            {tabList.map((t) => {
              const isActive = t.id === activeTab;
              const displayName = tabConfig.nameFormat === "full" ? t.name : t.shortName;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab(t.id);
                  }}
                  className={`flex flex-col items-center justify-center py-2 sm:py-1 px-2.5 sm:px-2 rounded-xl transition-all relative flex-1 cursor-pointer ${
                    isActive ? "text-amber-600 scale-105" : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <div className="relative">
                    {t.renderIcon(isActive, isActive ? "text-amber-600 stroke-[2.6]" : "text-stone-500 stroke-[2]")}
                    {t.badge && (
                      <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] px-1 rounded-full font-black leading-tight">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  {/* On Mobile: text hidden. On Desktop: text visible */}
                  <span className={`hidden sm:block mt-0.5 tracking-tight text-[11px] font-bold ${isActive ? "text-amber-950 font-black" : "text-stone-500"}`}>
                    {displayName}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-0.5 animate-pulse sm:hidden" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STYLE 3: GOOGLE MATERIAL DESIGN 3 */}
      {(tabConfig.stripPreset === "google_material_bar" || (tabConfig.stripPreset !== "water_clear_pill" && bottomBarStyle === "google_material_bar")) && (
        <div
          className={`fixed bottom-0 inset-x-0 z-40 bg-stone-100/95 backdrop-blur-xl border-t border-stone-300 shadow-md ${getSpeedClasses()} ${
            isBottomBarHidden ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-1.5">
            {tabList.map((t) => {
              const isActive = t.id === activeTab;
              const iconDisplay = getTabIconDisplayClasses(tabConfig.iconVisibility, isActive);
              const nameTypography = getTabNameTypographyClasses(tabConfig.nameSize, tabConfig.nameWeight);
              const displayName = tabConfig.nameFormat === "full" ? t.name : t.shortName;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab(t.id);
                  }}
                  className="flex flex-col items-center justify-center py-0.5 px-2 transition-all flex-1 cursor-pointer group"
                >
                  <div
                    className={`px-3.5 py-1 rounded-full transition-all duration-200 flex items-center justify-center relative ${
                      isActive ? "bg-amber-200 text-amber-950 shadow-xs" : "bg-transparent text-stone-600 group-hover:bg-stone-200"
                    }`}
                  >
                    {iconDisplay.shouldRenderOnDesktop && (
                      <span className={iconDisplay.iconWrapperClass}>
                        {t.renderIcon(isActive, isActive ? "text-amber-950 stroke-[2.7]" : "text-stone-600 stroke-[2.1]")}
                      </span>
                    )}
                    {t.badge && (
                      <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] px-1 rounded-full font-bold">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <span className={`mt-0.5 ${nameTypography} ${isActive ? "text-stone-900 font-black" : "text-stone-600"}`}>
                    {displayName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STYLE 4: SPOTIFY / LINEAR FLOATING CHARCOAL DOCK */}
      {(tabConfig.stripPreset === "spotify_linear_dock" || (tabConfig.stripPreset !== "water_clear_pill" && bottomBarStyle === "spotify_linear_dock")) && (
        <div
          className={`fixed bottom-2 inset-x-0 z-40 flex justify-center px-2 pointer-events-none ${getSpeedClasses()} ${
            isBottomBarHidden ? "opacity-0 translate-y-14 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="pointer-events-auto inline-flex items-center p-1.5 rounded-2xl bg-stone-950/95 backdrop-blur-xl border border-stone-800 shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-x-auto no-scrollbar max-w-full">
            {tabList.map((t) => {
              const isActive = t.id === activeTab;
              const iconDisplay = getTabIconDisplayClasses(tabConfig.iconVisibility, isActive);
              const nameTypography = getTabNameTypographyClasses(tabConfig.nameSize, tabConfig.nameWeight);
              const displayName = tabConfig.nameFormat === "full" ? t.name : t.shortName;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab(t.id);
                  }}
                  title={t.name}
                  aria-label={t.name}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-all duration-180 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-stone-800 text-amber-400 shadow-inner font-extrabold"
                      : "text-stone-400 hover:text-white hover:bg-stone-900"
                  }`}
                >
                  {iconDisplay.shouldRenderOnDesktop && (
                    <span className={iconDisplay.iconWrapperClass}>
                      {t.renderIcon(isActive, isActive ? "text-amber-400 stroke-[2.6]" : "text-stone-400 stroke-[2]")}
                    </span>
                  )}
                  <span className={nameTypography}>{displayName}</span>
                  {t.badge && (
                    <span className="text-[9px] px-1 bg-amber-500 text-stone-950 rounded-full font-black">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STYLE 5: INSTAGRAM ULTRA-CLEAN MINIMAL */}
      {(tabConfig.stripPreset === "instagram_minimal" || (tabConfig.stripPreset !== "water_clear_pill" && bottomBarStyle === "instagram_minimal")) && (
        <div
          className={`fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-100 shadow-[0_-1px_4px_rgba(0,0,0,0.03)] ${getSpeedClasses()} ${
            isBottomBarHidden ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
            {tabList.map((t) => {
              const isActive = t.id === activeTab;
              const iconDisplay = getTabIconDisplayClasses(tabConfig.iconVisibility, isActive);
              const nameTypography = getTabNameTypographyClasses(tabConfig.nameSize, tabConfig.nameWeight);
              const displayName = tabConfig.nameFormat === "full" ? t.name : t.shortName;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab(t.id);
                  }}
                  className="flex flex-col items-center justify-center p-1 transition-all cursor-pointer relative flex-1"
                >
                  {iconDisplay.shouldRenderOnDesktop && (
                    <span className={iconDisplay.iconWrapperClass}>
                      {t.renderIcon(isActive, isActive ? "text-stone-950 stroke-[2.8] scale-110" : "text-stone-400 stroke-[1.8]")}
                    </span>
                  )}
                  <span className={`mt-1 ${nameTypography} ${isActive ? "font-black text-stone-950" : "font-normal text-stone-400"}`}>
                    {displayName}
                  </span>
                  {t.badge && (
                    <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STYLE 6: CAPSULE SEGMENTED CONTROL RIBBON */}
      {tabConfig.stripPreset === "capsule_segmented" && (
        <div
          className={`fixed bottom-2 inset-x-0 z-40 flex justify-center px-2 pointer-events-none ${getSpeedClasses()} ${
            isBottomBarHidden ? "opacity-0 translate-y-14 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="pointer-events-auto inline-flex items-center p-1 rounded-full border border-stone-300/80 shadow-md bg-stone-100/90 backdrop-blur-xl max-w-full overflow-x-auto no-scrollbar">
            {tabList.map((t) => {
              const isActive = t.id === activeTab;
              const iconDisplay = getTabIconDisplayClasses(tabConfig.iconVisibility, isActive);
              const nameTypography = getTabNameTypographyClasses(tabConfig.nameSize, tabConfig.nameWeight);
              const displayName = tabConfig.nameFormat === "full" ? t.name : t.shortName;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab(t.id);
                  }}
                  title={t.name}
                  aria-label={t.name}
                  className={`px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-white text-stone-900 shadow-sm font-black scale-102 ring-1 ring-stone-900/10"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                  }`}
                >
                  {iconDisplay.shouldRenderOnDesktop && (
                    <span className={iconDisplay.iconWrapperClass}>
                      {t.renderIcon(isActive)}
                    </span>
                  )}
                  <span className={nameTypography}>{displayName}</span>
                  {t.badge && (
                    <span className="text-[9px] px-1 bg-amber-500 text-stone-950 rounded-full font-black">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STYLE 7: MODERN FLOATING ISLAND BAR */}
      {tabConfig.stripPreset === "modern_floating" && (
        <div
          className={`fixed bottom-3 inset-x-0 z-40 flex justify-center px-3 pointer-events-none ${getSpeedClasses()} ${
            isBottomBarHidden ? "opacity-0 translate-y-14 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="pointer-events-auto inline-flex items-center p-2 rounded-2xl border border-stone-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.15)] bg-white/95 backdrop-blur-xl overflow-x-auto no-scrollbar max-w-full">
            {tabList.map((t) => {
              const isActive = t.id === activeTab;
              const iconDisplay = getTabIconDisplayClasses(tabConfig.iconVisibility, isActive);
              const nameTypography = getTabNameTypographyClasses(tabConfig.nameSize, tabConfig.nameWeight);
              const displayName = tabConfig.nameFormat === "full" ? t.name : t.shortName;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveTab(t.id);
                  }}
                  title={t.name}
                  aria-label={t.name}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-stone-900 text-amber-400 shadow-md font-black scale-102"
                      : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                  }`}
                >
                  {iconDisplay.shouldRenderOnDesktop && (
                    <span className={iconDisplay.iconWrapperClass}>
                      {t.renderIcon(isActive, isActive ? "text-amber-400 stroke-[2.6]" : "text-stone-600 stroke-[2]")}
                    </span>
                  )}
                  <span className={nameTypography}>{displayName}</span>
                  {t.badge && (
                    <span className="text-[9px] px-1 bg-amber-500 text-stone-950 rounded-full font-black">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
