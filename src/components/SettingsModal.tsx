import React, { useState, useEffect } from "react";
import { 
  ArrowLeft,
  X, 
  Sparkles, 
  Smartphone, 
  Settings,
  Sliders, 
  Gauge, 
  Check, 
  RotateCcw,
  SlidersHorizontal,
  Zap,
  Info,
  Search,
  Target,
  Bell,
  Palette,
  Volume2,
  Calendar,
  Layers,
  Database,
  Shield,
  HelpCircle,
  ExternalLink,
  Menu,
  Monitor,
  Maximize2,
  Droplet,
  Minus,
  ZapOff,
  Layout,
  Sun,
  Type,
  Compass
} from "lucide-react";
import { 
  BottomBarStyle, 
  ScreenTransitionEffect, 
  PillSpeedOption, 
  ScrollSensitivity 
} from "./Navbar";
import { SearchDisplayType } from "./CommandPalette";
import { CockpitConfig } from "../types";
import { 
  NavButtonStyle, 
  NavButtonSize,
  NavButtonOpacity,
  NavButtonBorder,
  NavButtonEffect,
  NavButtonConfig,
  NAV_BUTTON_STYLES, 
  getNavButtonClasses, 
  getStoredNavButtonStyle,
  getStoredNavButtonConfig,
  saveNavButtonConfig
} from "../utils/navButtonStyles";
import {
  TopIconStyle,
  TopIconSize,
  TopIconOpacity,
  TopIconBorder,
  TopIconEffect,
  TopIconLabelDisplay,
  TopIconConfig,
  TOP_ICON_STYLES,
  getTopIconClasses,
  getStoredTopIconConfig,
  saveTopIconConfig
} from "../utils/topIconStyles";
import {
  TopBarStyle,
  TopBarHeight,
  TopBarOpacity,
  TopBarBlur,
  TopBarBorder,
  TopBarShadow,
  TopBarLayout,
  TopBarConfig,
  TOP_BAR_STYLES,
  getTopBarClasses,
  getStoredTopBarConfig,
  saveTopBarConfig
} from "../utils/topBarStyles";
import { HeaderAndButtonCustomizerSection } from "./HeaderAndButtonCustomizerSection";

export type SettingsTabId = "features" | "buttons" | "search" | "quota" | "performance" | "general";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFullPage?: boolean;
  onGoBack?: () => void;
  backTitle?: string;
  // Button Styles (7 सादा विकल्प)
  navButtonStyle?: NavButtonStyle;
  onSelectNavButtonStyle?: (style: NavButtonStyle) => void;
  // Bottom Bar & Screen Transitions
  bottomBarStyle: BottomBarStyle;
  onSelectBottomBarStyle: (style: BottomBarStyle) => void;
  screenTransition: ScreenTransitionEffect;
  onSelectScreenTransition: (effect: ScreenTransitionEffect) => void;
  speedMode: PillSpeedOption;
  onSelectSpeedMode: (speed: PillSpeedOption) => void;
  scrollSensitivity: ScrollSensitivity;
  onSelectScrollSensitivity: (sens: ScrollSensitivity) => void;

  // Search Engine customization
  searchDisplayType?: SearchDisplayType;
  onSelectSearchDisplayType?: (type: SearchDisplayType) => void;

  // Study Quota & Priority Settings
  config?: CockpitConfig;
  onUpdateConfig?: (newConfig: Partial<CockpitConfig>) => void;
  
  // Quick Actions from other features
  onOpenDirectory?: () => void;
  onOpenDebtModal?: () => void;
  onExportCSV?: () => void;
}

const SEARCH_STYLE_STORAGE_KEY = "sm_search_display_style";
const HAPTIC_STORAGE_KEY = "sm_settings_haptic_feedback";
const SOUND_STORAGE_KEY = "sm_settings_sound_fx";
const THEME_ACCENT_KEY = "sm_settings_accent_theme";

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isFullPage = false,
  onGoBack,
  backTitle = "वापस",
  navButtonStyle: propNavButtonStyle,
  onSelectNavButtonStyle: propOnSelectNavButtonStyle,
  bottomBarStyle,
  onSelectBottomBarStyle,
  screenTransition,
  onSelectScreenTransition,
  speedMode,
  onSelectSpeedMode,
  scrollSensitivity,
  onSelectScrollSensitivity,
  searchDisplayType: propSearchDisplayType,
  onSelectSearchDisplayType,
  config,
  onUpdateConfig,
  onOpenDirectory,
  onOpenDebtModal,
  onExportCSV,
}) => {
  // Active Tab inside Settings
  const [activeTab, setActiveTab] = useState<SettingsTabId>("features");

  // Nav Button Style & Full Configuration (Size, Opacity, Border, Effect)
  const [internalNavButtonStyle, setInternalNavButtonStyle] = useState<NavButtonStyle>(() => {
    return propNavButtonStyle || getStoredNavButtonStyle();
  });
  const [navBtnConfig, setNavBtnConfig] = useState<NavButtonConfig>(() => {
    const stored = getStoredNavButtonConfig();
    return {
      ...stored,
      preset: propNavButtonStyle || stored.preset,
    };
  });
  const [btnPreviewDevice, setBtnPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [btnTestActionMsg, setBtnTestActionMsg] = useState<string | null>(null);
  const [btnCategoryFilter, setBtnCategoryFilter] = useState<"all" | "big_apps" | "minimal">("all");

  useEffect(() => {
    if (propNavButtonStyle) {
      setInternalNavButtonStyle(propNavButtonStyle);
      setNavBtnConfig((prev) => ({ ...prev, preset: propNavButtonStyle }));
    }
  }, [propNavButtonStyle]);

  const activeNavButtonStyle = propNavButtonStyle || internalNavButtonStyle;

  const updateBtnConfig = (partial: Partial<NavButtonConfig>) => {
    const updated = {
      ...navBtnConfig,
      ...partial,
    };
    setNavBtnConfig(updated);
    saveNavButtonConfig(updated);
    if (partial.preset) {
      setInternalNavButtonStyle(partial.preset);
      propOnSelectNavButtonStyle?.(partial.preset);
    }
  };

  const handleSelectNavButtonStyle = (style: NavButtonStyle) => {
    if (navBtnConfig.effect !== "none") triggerHaptic(10);
    updateBtnConfig({ preset: style });
  };

  const backBtnClasses = getNavButtonClasses(activeNavButtonStyle, "back", navBtnConfig);
  const menuBtnClasses = getNavButtonClasses(activeNavButtonStyle, "menu", navBtnConfig);

  // Top Bar & Top Action Icons Config State in Settings
  const [topBarConfig, setTopBarConfig] = useState<TopBarConfig>(() => getStoredTopBarConfig());
  const [topIconConfig, setTopIconConfig] = useState<TopIconConfig>(() => getStoredTopIconConfig());
  const [customizerSubTab, setCustomizerSubTab] = useState<"top_bar" | "top_icons" | "back_menu">("top_bar");

  const updateBarConfig = (partial: Partial<TopBarConfig>) => {
    const updated = { ...topBarConfig, ...partial };
    setTopBarConfig(updated);
    saveTopBarConfig(updated);
  };

  const updateIconConfig = (partial: Partial<TopIconConfig>) => {
    const updated = { ...topIconConfig, ...partial };
    setTopIconConfig(updated);
    saveTopIconConfig(updated);
  };

  const topBarClasses = getTopBarClasses(topBarConfig);
  const topIconClasses = getTopIconClasses(topIconConfig);

  // Search Style Mode state (synced with localStorage & CommandPalette)
  const [internalSearchStyle, setInternalSearchStyle] = useState<SearchDisplayType>(() => {
    try {
      const saved = localStorage.getItem(SEARCH_STYLE_STORAGE_KEY) as SearchDisplayType;
      if (saved && ["fullscreen", "spotlight", "bottom_sheet"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "fullscreen";
  });
  const currentSearchStyle = propSearchDisplayType || internalSearchStyle;

  // Haptic feedback toggle
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(HAPTIC_STORAGE_KEY);
      return saved !== "false"; // default true
    } catch {
      return true;
    }
  });

  // Sound effects toggle
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved === "true"; // default false
    } catch {
      return false;
    }
  });

  // Accent theme preview
  const [accentTheme, setAccentTheme] = useState<string>(() => {
    try {
      return localStorage.getItem(THEME_ACCENT_KEY) || "amber";
    } catch {
      return "amber";
    }
  });

  // Subtle vibration for touch feel
  const triggerHaptic = (duration = 8) => {
    if (!isHapticEnabled) return;
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(duration);
      }
    } catch {
      // ignore
    }
  };

  const handleSelectSearchStyle = (style: SearchDisplayType) => {
    triggerHaptic(8);
    setInternalSearchStyle(style);
    try {
      localStorage.setItem(SEARCH_STYLE_STORAGE_KEY, style);
    } catch {
      // ignore
    }
    onSelectSearchDisplayType?.(style);
  };

  const toggleHapticFeedback = () => {
    const nextVal = !isHapticEnabled;
    setIsHapticEnabled(nextVal);
    try {
      localStorage.setItem(HAPTIC_STORAGE_KEY, String(nextVal));
    } catch {
      // ignore
    }
    if (nextVal) {
      try {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(15);
        }
      } catch {
        // ignore
      }
    }
  };

  const toggleSoundFx = () => {
    const nextVal = !isSoundEnabled;
    setIsSoundEnabled(nextVal);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(nextVal));
    } catch {
      // ignore
    }
  };

  const handleSelectAccentTheme = (theme: string) => {
    triggerHaptic(8);
    setAccentTheme(theme);
    try {
      localStorage.setItem(THEME_ACCENT_KEY, theme);
    } catch {
      // ignore
    }
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const innerContent = (
    <div 
      className={`bg-white w-full ${isFullPage ? "rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs" : "max-w-2xl rounded-3xl shadow-2xl border border-stone-200"} overflow-hidden flex flex-col ${isFullPage ? "" : "max-h-[92vh] animate-in zoom-in-95 duration-200"}`}
    >
      {/* Header */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/90">
        <div className="flex items-center space-x-2.5 min-w-0">
          {isFullPage && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                onGoBack ? onGoBack() : onClose();
              }}
              aria-label="वापस जाएं"
              className={backBtnClasses.buttonClasses}
            >
              <ArrowLeft className={backBtnClasses.iconClasses} />
              <span className={backBtnClasses.textClasses}>{backTitle}</span>
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-stone-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base sm:text-lg font-black text-stone-900 leading-tight truncate">
                Settings Hub
              </h2>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 shrink-0">
                ALL-IN-ONE
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium truncate">
              सर्च इंजन, नीचे वाली पट्टी, स्क्रीन इफ़ेक्ट्स, कोटा व अध्ययन प्राथमिकताएं
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            triggerHaptic(6);
            onGoBack ? onGoBack() : onClose();
          }}
          className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          aria-label={isFullPage ? "वापस जाएं" : "सेटिंग्स बंद करें"}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

        {/* Universal Horizontal Category Navigation Tabs */}
        <div className="px-3 sm:px-5 pt-2.5 pb-2 bg-stone-50/50 border-b border-stone-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setActiveTab("features");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "features"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/70"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>नेविगेशन पट्टी व ट्रांजिशन</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setActiveTab("buttons");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "buttons"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/70"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>टाप बार, टाप आइकन्स व बटन</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setActiveTab("search");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "search"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/70"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>सर्च इंजन डिस्प्ले</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setActiveTab("quota");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "quota"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/70"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>दैनिक कोटा व प्राथमिकता</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setActiveTab("performance");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "performance"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/70"
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>स्पीड व संवेदनशीलता</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setActiveTab("general");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "general"
                ? "bg-amber-500 text-stone-950 shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/70"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>थीम व हैप्टिक टच</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {/* TAB 1: BOTTOM BAR & SCREEN TRANSITIONS */}
          {activeTab === "features" && (
            <>
              {/* Bottom Bar Styles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>1. नीचे वाली नेविगेशन पट्टी का स्टाइल (Bottom Bar Style):</span>
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    तुरंत लागू
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-3">
                  अपनी पसंद के अनुसार बड़ी कंपनियों (Apple, Google, Spotify, Instagram) जैसा बॉटम बार चुनें:
                </p>

                <div className="space-y-2">
                  {/* Option 1: Water Clear Pill */}
                  <div
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectBottomBarStyle("water_clear_pill");
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      bottomBarStyle === "water_clear_pill"
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900">
                          💧 वॉटर क्लियर पिल (Water Clear Floating Pill)
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 bg-amber-200 text-stone-950 font-bold rounded">
                          डिफ़ॉल्ट
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        नीचे सटा तैरता हुआ फ्रॉस्टेड कांच (25% ट्रांसपेरेंट)। स्क्रीन के नीचे का कंटेंट आर-पार दिखाई देता है।
                      </p>
                    </div>
                    {bottomBarStyle === "water_clear_pill" && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Option 2: Apple iOS Native Tab Bar */}
                  <div
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectBottomBarStyle("apple_ios_bar");
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      bottomBarStyle === "apple_ios_bar"
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900">
                          🍏 Apple iPhone नेटिव बार (Apple iOS Edge-to-Edge)
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 bg-stone-900 text-white font-bold rounded">
                          iOS
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        iPhone/iPad का मानक स्टाइल: पूरी चौड़ाई वाला फ्रॉस्टेड व्हाइट बार, ऊपर आइकॉन + नीचे सूक्ष्म टेक्स्ट और एक्टिव डॉट।
                      </p>
                    </div>
                    {bottomBarStyle === "apple_ios_bar" && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Option 3: Google Material Design 3 */}
                  <div
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectBottomBarStyle("google_material_bar");
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      bottomBarStyle === "google_material_bar"
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900">
                          🤖 Google Material 3 (Android 14+ Pill Bar)
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 bg-blue-600 text-white font-bold rounded">
                          Material
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Pixel और Android 14 का आधुनिक बॉटम नेविगेशन: एक्टिव टैब के पीछे अंडाकार कैप्सूल पिल और सुगम टच।
                      </p>
                    </div>
                    {bottomBarStyle === "google_material_bar" && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Option 4: Spotify Floating Dock */}
                  <div
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectBottomBarStyle("spotify_linear_dock");
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      bottomBarStyle === "spotify_linear_dock"
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900">
                          🎵 Spotify / Linear फ्लोटिंग डार्क आइलैंड (Charcoal Island)
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 bg-emerald-600 text-white font-bold rounded">
                          Dark
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        प्रीमियम गहरा चारकोल डार्क बार (Dark 900 Glass), जो स्क्रीन के नीचे तैरता हुआ उच्च कंट्रास्ट और मॉडर्न लुक देता है।
                      </p>
                    </div>
                    {bottomBarStyle === "spotify_linear_dock" && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Option 5: Instagram Minimal Bar */}
                  <div
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectBottomBarStyle("instagram_minimal");
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      bottomBarStyle === "instagram_minimal"
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900">
                          📸 Instagram अल्ट्रा-क्लीन फ्लैट बार (Edge-to-Edge Minimal)
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded">
                          Minimal
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Instagram जैसा शून्य झंझट वाला किनारों तक फैला बार: सूक्ष्म आइकॉन, केवल एक्टिव पर लेबल और तेज रिस्पॉन्स।
                      </p>
                    </div>
                    {bottomBarStyle === "instagram_minimal" && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. SCREEN TRANSITION EFFECTS */}
              <div className="pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>2. स्क्रीन बदलने का एनीमेशन इफ़ेक्ट (Screen Transitions):</span>
                  </label>
                  <span className="text-[10px] text-stone-500">
                    वर्तमान: <strong className="text-stone-900">{screenTransition}</strong>
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-3">
                  जब आप एक टैब से दूसरे टैब में स्विच करते हैं, तो स्क्रीन कैसे बदले:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {/* Apple iOS Spring */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScreenTransition("ios_page_cover");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      screenTransition === "ios_page_cover"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-400"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">🍏 Apple iOS स्प्रिंग</span>
                      {screenTransition === "ios_page_cover" && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                      iPhone जैसा स्मूथ स्लाइडिंग स्प्रिंग
                    </span>
                  </button>

                  {/* Material Elevate */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScreenTransition("material_elevate");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      screenTransition === "material_elevate"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-400"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">🤖 Google Material 3</span>
                      {screenTransition === "material_elevate" && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                      नीचे से उठकर एलिवेट होना
                    </span>
                  </button>

                  {/* Linear Snap */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScreenTransition("linear_snap");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      screenTransition === "linear_snap"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-400"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">⚡ Linear.app स्नैप</span>
                      {screenTransition === "linear_snap" && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                      सुपरफास्ट 140ms स्नैप
                    </span>
                  </button>

                  {/* Instagram Depth */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScreenTransition("insta_depth");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      screenTransition === "insta_depth"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-400"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">📸 Instagram ज़ूम</span>
                      {screenTransition === "insta_depth" && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                      गहराई से हल्का स्केल इन
                    </span>
                  </button>

                  {/* Spotify Fade */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScreenTransition("spotify_fade");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      screenTransition === "spotify_fade"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-400"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">🎵 Spotify ब्लर फ़ेड</span>
                      {screenTransition === "spotify_fade" && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                      रेशमी स्मूथ ब्लर डिसॉल्व
                    </span>
                  </button>

                  {/* None */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScreenTransition("none");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      screenTransition === "none"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-400"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">⏹️ बिना इफ़ेक्ट (None)</span>
                      {screenTransition === "none" && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                      0% एनीमेशन, तुरंत कट स्विच
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TOP BAR, TOP ICONS & BUTTONS (टाप बार, टाप आइकन्स व बटन कस्टमाइज़र) */}
          {activeTab === "buttons" && (
            <HeaderAndButtonCustomizerSection
              navButtonStyle={activeNavButtonStyle}
              onSelectNavButtonStyle={handleSelectNavButtonStyle}
              backTitle={backTitle}
            />
          )}
          {activeTab === "search" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-amber-600" />
                    <span>सर्च इंजन डिस्प्ले स्टाइल (Search Box Modal Type):</span>
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    Ctrl + K / खोजें
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-3">
                  जब आप "खोजें" बटन दबाते हैं या कीबोर्ड पर Ctrl+K प्रेस करते हैं, तो सर्च विंडो किस रूप में खुले:
                </p>

                <div className="space-y-2.5">
                  {/* Option 1: Fullscreen Focus */}
                  <div
                    onClick={() => handleSelectSearchStyle("fullscreen")}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      currentSearchStyle === "fullscreen"
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900">
                          🖥️ फुल स्क्रीन फोकस (Fullscreen Immersive View)
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 bg-stone-900 text-white font-bold rounded">
                          गहराई से अध्ययन
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                        पूरी स्क्रीन पर चौड़ा सर्च विंडो, जिसमें विषय के पूरे नोट्स, गलतियों के स्निपेट्स और फॉर्मूला कार्ड्स एक साथ दिखाई देते हैं।
                      </p>
                    </div>
                    {currentSearchStyle === "fullscreen" && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Option 2: Spotlight Modal */}
                  <div
                    onClick={() => handleSelectSearchStyle("spotlight")}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      currentSearchStyle === "spotlight"
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900">
                          🎯 मैक स्पॉटलाइट / Raycast (Compact Spotlight Box)
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 bg-amber-200 text-stone-950 font-bold rounded">
                          त्वरित कमांड
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                        Mac OS Spotlight या Raycast की तरह स्क्रीन के बीचों-बीच तैरता हुआ कॉम्पैक्ट बॉक्स। बिना पूरी स्क्रीन ढके तेज सर्च के लिए।
                      </p>
                    </div>
                    {currentSearchStyle === "spotlight" && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Option 3: Bottom Sheet */}
                  <div
                    onClick={() => handleSelectSearchStyle("bottom_sheet")}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      currentSearchStyle === "bottom_sheet"
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900">
                          📱 मोबाइल बॉटम शीट (Mobile Drawer Bottom Sheet)
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 bg-emerald-600 text-white font-bold rounded">
                          एक हाथ से टाइपिंग
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                        स्मार्टफोन में नीचे से ऊपर की ओर स्लाइड होने वाली शीट। अंगूठे से टाइप करने और लेक्चर्स चुनने के लिए सबसे सुविधाजनक।
                      </p>
                    </div>
                    {currentSearchStyle === "bottom_sheet" && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Engine Information Box */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1.5">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>सर्च इंजन के विशेष फीचर्स:</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  • <strong>स्मार्ट स्निपेट्स:</strong> केवल चैप्टर का नाम ही नहीं, बल्कि आपके द्वारा लिखे गए फॉर्मूले, ट्रिक्स और पिछली गलतियों के अंदर से भी खोज निकालता है।
                </p>
                <p className="text-[11px] text-stone-500">
                  • <strong>रिसेंट हिस्ट्री:</strong> पिछली 5 खोजें स्थानीय मेमोरी में सुरक्षित रहती हैं ताकि 1-क्लिक में दोबारा खोला जा सके।
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: STUDY QUOTA & REVISION ENGINE (दैनिक कोटा व प्राथमिक विषय) */}
          {activeTab === "quota" && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>दैनिक रिवीज़न कोटा (Daily Revision Quota):</span>
                  </label>
                  <span className="text-xs font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                    {config?.dailyQuota || 5} लेक्चर्स / दिन
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-3">
                  प्रत्येक दिन कॉकपिट में आपको कितने मुख्य लेक्चर्स पर ध्यान केंद्रित करना है (शेष शांत कतार में सुरक्षित रहेंगे):
                </p>

                {/* Quota Range Slider */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>कोटा स्लाइडर:</span>
                    <span className="text-amber-950 font-black bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      {config?.dailyQuota || 5} लेक्चर्स प्रति दिन
                    </span>
                  </div>
                  <div className="pt-1">
                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={config?.dailyQuota || 5}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 5;
                        triggerHaptic(6);
                        onUpdateConfig?.({ dailyQuota: val });
                      }}
                      className="w-full h-1.5 bg-stone-200 rounded-full appearance-none accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400 font-bold px-0.5">
                    <span>1 न्यूनतम</span>
                    <span>5 आदर्श</span>
                    <span>10 मध्यम</span>
                    <span>20 अधिकतम</span>
                  </div>
                </div>
              </div>

              {/* Priority Subject Control */}
              <div className="pt-3 border-t border-stone-100">
                <label className="text-xs font-black uppercase tracking-wider text-stone-800 block mb-1.5">
                  फोकस विषय प्राथमिकता (Priority Subject Focus):
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={config?.prioritySubject || "ALL"}
                    onChange={(e) => {
                      triggerHaptic(6);
                      onUpdateConfig?.({ prioritySubject: e.target.value, priorityChapter: "ALL" });
                    }}
                    className="flex-1 bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="ALL">🌟 सभी विषय (संतुलित रोटेशन)</option>
                    <option value="Maths- (Arithmetic)">📐 Maths (Arithmetic)</option>
                    <option value="Maths- (Advance)">📐 Maths (Advance)</option>
                    <option value="Reasoning">🧠 Reasoning</option>
                    <option value="Modern History">📜 Modern History</option>
                    <option value="Geography">🌍 Geography</option>
                    <option value="Indian Polity">⚖️ Indian Polity</option>
                    <option value="General Science">🔬 General Science</option>
                  </select>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  चुने हुए विषय के लेक्चर्स को आज की कतार में सबसे ऊपर प्राथमिकता दी जाएगी।
                </p>
              </div>

              {/* Quick Actions to other modules */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  त्वरित प्रबंधन लिंक
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {onOpenDirectory && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        onClose();
                        onOpenDirectory();
                      }}
                      className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-left cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-stone-900">📚 21-विषय डायरेक्टरी</div>
                        <div className="text-[10px] text-stone-500">सभी 310 चैप्टर्स देखें</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  )}

                  {onOpenDebtModal && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        onClose();
                        onOpenDebtModal();
                      }}
                      className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-left cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-rose-950">🛡️ डेब्ट वॉल्ट रिसेट</div>
                        <div className="text-[10px] text-rose-700">पैनिक-फ्री आर्काइव</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPEED & SCROLL SENSITIVITY */}
          {activeTab === "performance" && (
            <div className="space-y-5">
              {/* Speed Mode Option */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>पट्टी की एनीमेशन गति (Dock Glide Speed):</span>
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectSpeedMode("ultra_fast");
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      speedMode === "ultra_fast"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">⚡ सुपरफास्ट (100ms)</div>
                    <div className="text-[10px] text-stone-500">बिजली जैसी गति</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectSpeedMode("instant_glide");
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      speedMode === "instant_glide"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">✨ झटपट ग्लाइड (180ms)</div>
                    <div className="text-[10px] text-stone-500">डिफ़ॉल्ट और संतुलित</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectSpeedMode("smooth_breeze");
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      speedMode === "smooth_breeze"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">🍃 स्मूथ ब्रीज़ (260ms)</div>
                    <div className="text-[10px] text-stone-500">हल्का और कोमल</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectSpeedMode("gentle_float");
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      speedMode === "gentle_float"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">🕊️ जेंटल फ्लोट (350ms)</div>
                    <div className="text-[10px] text-stone-500">धीमा और रेशमी</div>
                  </button>
                </div>
              </div>

              {/* Scroll Sensitivity Option */}
              <div className="pt-4 border-t border-stone-100">
                <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5 mb-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>स्क्रोल संवेदनशीलता (Scroll Hide/Show Sensitivity):</span>
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScrollSensitivity("sensitive");
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      scrollSensitivity === "sensitive"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">तेज़ (Sensitive)</div>
                    <div className="text-[9.5px] text-stone-500">हल्के से स्क्रोल पर छिपना</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScrollSensitivity("normal");
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      scrollSensitivity === "normal"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">सामान्य (Normal)</div>
                    <div className="text-[9.5px] text-stone-500">मध्यम संवेदनशीलता</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onSelectScrollSensitivity("calm");
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      scrollSensitivity === "calm"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">पक्का (Calm)</div>
                    <div className="text-[9.5px] text-stone-500">डिफ़ॉल्ट, स्थिर अनुभव</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GENERAL PREFERENCES & BACKUP (थीम, हैप्टिक टच व बैकअप) */}
          {activeTab === "general" && (
            <div className="space-y-5">
              {/* Haptic touch toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">हैप्टिक टच कंपन (Haptic Vibration)</div>
                    <div className="text-[11px] text-stone-500">बटन और टैब बदलने पर सूक्ष्म वाइब्रेशन फीडबैक</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleHapticFeedback}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isHapticEnabled ? "bg-amber-500" : "bg-stone-300"
                  }`}
                >
                  <span 
                    className={`w-5 h-5 rounded-full bg-white shadow-sm block transition-transform ${
                      isHapticEnabled ? "translate-x-6" : "translate-x-1"
                    }`} 
                  />
                </button>
              </div>

              {/* Data Backup Option */}
              {onExportCSV && (
                <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">रिकॉर्ड व सिलेबस एक्सपोर्ट (CSV / Excel)</div>
                      <div className="text-[11px] text-stone-500">अपने सभी लेक्चर्स का रिकॉर्ड और 21 विषयों का सिलेबस Excel (.xlsx) या CSV में डाउनलोड करें</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      onExportCSV();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs shrink-0"
                  >
                    CSV / Excel एक्सपोर्ट
                  </button>
                </div>
              )}

              {/* Version & Storage Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-950 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>ऑटोमैटिक लोकल सिंक (100% प्राइवेट)</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  आपकी चुनी हुई सभी सेटिंग्स (सर्च इंजन स्टाइल, बॉटम बार, स्क्रीन इफ़ेक्ट्स, स्पीड और कोटा) आपके ब्राउज़र के <strong>Local Storage</strong> में स्थायी रूप से सुरक्षित रहती हैं।
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">सभी सेटिंग्स तुरंत सुरक्षित सेव हो जाती हैं।</span>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              onGoBack ? onGoBack() : onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-black bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            सम्पन्न (Done)
          </button>
        </div>
      </div>
  );

  if (isFullPage) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {innerContent}
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-stone-950/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          triggerHaptic(6);
          onClose();
        }
      }}
    >
      {innerContent}
    </div>
  );
};
