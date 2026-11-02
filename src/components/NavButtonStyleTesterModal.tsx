import React, { useState, useEffect } from "react";
import { 
  X, 
  ArrowLeft, 
  Menu, 
  Check, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  SlidersHorizontal,
  Info,
  Maximize2,
  Droplet,
  Minus,
  Zap,
  ZapOff,
  Search,
  Settings,
  Compass,
  Layers,
  Layout,
  Sun,
  Eye,
  Type,
  Home,
  CalendarDays,
  Grid3X3
} from "lucide-react";
import { 
  NavButtonStyle, 
  NavButtonSize,
  NavButtonOpacity,
  NavButtonBorder,
  NavButtonEffect,
  NavButtonConfig,
  NAV_BUTTON_STYLES, 
  getNavButtonClasses,
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
  TopStripStyle,
  TopStripPosition,
  TopStripThickness,
  TopStripAnimation,
  TopBarConfig,
  TOP_BAR_STYLES,
  TOP_STRIP_STYLES,
  getTopBarClasses,
  getStoredTopBarConfig,
  saveTopBarConfig,
  getTopStripClasses
} from "../utils/topBarStyles";
import {
  TabConfig,
  TabIconVisibility,
  TabNameSize,
  TabNameWeight,
  TabNameFormat,
  TabStripPreset,
  TabStripHeight,
  TabStripOpacity,
  TabStripRadius,
  TabActiveIndicator,
  TAB_STRIP_PRESETS,
  getStoredTabConfig,
  saveTabConfig,
  getTabIconDisplayClasses,
  getTabNameTypographyClasses,
  getTabStripClasses
} from "../utils/tabStyles";
import { CompactRangeSlider } from "./CompactRangeSlider";

// Step arrays for compact range sliders
const TOP_BAR_HEIGHT_STEPS: { id: TopBarHeight; label: string; px: string }[] = [
  { id: "compact", label: "कॉम्पैक्ट", px: "42px" },
  { id: "standard", label: "मानक", px: "50px" },
  { id: "comfort", label: "आरामदायक", px: "58px" },
  { id: "spacious", label: "स्पेशियस", px: "66px" },
];

const BORDER_STEPS: { id: TopBarBorder; label: string; px: string }[] = [
  { id: "none", label: "शून्य लाइन", px: "0px" },
  { id: "thin", label: "बारीक 1px", px: "1px" },
  { id: "medium", label: "मध्यम 2px", px: "2px" },
  { id: "bold", label: "गहरी 3px", px: "3px" },
];

const STRIP_THICKNESS_STEPS: TopStripThickness[] = ["1px", "2px", "3px", "4px", "6px"];

const TOP_ICON_SIZE_STEPS: { id: TopIconSize; label: string; px: string }[] = [
  { id: "compact", label: "छोटा", px: "28px" },
  { id: "medium", label: "मध्यम", px: "34px" },
  { id: "large", label: "बड़ा", px: "42px" },
  { id: "jumbo", label: "जंबो", px: "48px" },
];

const TAB_NAME_SIZE_STEPS: { id: TabNameSize; label: string; px: string }[] = [
  { id: "xs", label: "बारीक XS", px: "9.5px" },
  { id: "sm", label: "छोटा SM", px: "10.5px" },
  { id: "md", label: "मानक MD", px: "12px" },
  { id: "lg", label: "बड़ा LG", px: "13.5px" },
  { id: "xl", label: "अल्ट्रा XL", px: "15px" },
];

const TAB_STRIP_HEIGHT_STEPS: { id: TabStripHeight; label: string; px: string }[] = [
  { id: "compact", label: "कॉम्पैक्ट", px: "40px" },
  { id: "standard", label: "मानक", px: "50px" },
  { id: "comfort", label: "कम्फर्ट", px: "58px" },
  { id: "spacious", label: "बड़ी", px: "66px" },
];

const NAV_BTN_SIZE_STEPS: { id: NavButtonSize; label: string; px: string }[] = [
  { id: "compact", label: "छोटा", px: "32px" },
  { id: "medium", label: "मध्यम", px: "38px" },
  { id: "large", label: "बड़ा", px: "46px" },
  { id: "jumbo", label: "जंबो", px: "52px" },
];

interface NavButtonStyleTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStyle?: NavButtonStyle;
  onSelectStyle?: (style: NavButtonStyle) => void;
  currentBackTitle?: string;
  onConfigChange?: (config: NavButtonConfig) => void;
}

type TesterSection = "top_bar" | "top_icons" | "tabs" | "back_menu";

export const NavButtonStyleTesterModal: React.FC<NavButtonStyleTesterModalProps> = ({
  isOpen,
  onClose,
  activeStyle,
  onSelectStyle,
  currentBackTitle = "वापस",
  onConfigChange,
}) => {
  // Active Section
  const [activeSection, setActiveSection] = useState<TesterSection>("top_bar");

  // 1. Back & Menu Buttons Config State
  const [btnConfig, setBtnConfig] = useState<NavButtonConfig>(() => {
    const saved = getStoredNavButtonConfig();
    return {
      ...saved,
      preset: activeStyle || saved.preset,
    };
  });

  // 2. Top Icons Config State
  const [iconConfig, setIconConfig] = useState<TopIconConfig>(() => getStoredTopIconConfig());

  // 3. Top Bar Config State
  const [barConfig, setBarConfig] = useState<TopBarConfig>(() => getStoredTopBarConfig());

  // 4. Tab Navigation Config State (Tab Names, Icon desktop-only rule, Tab Strip)
  const [tabConfig, setTabConfig] = useState<TabConfig>(() => getStoredTabConfig());

  // Preview mode toggle: Simulate mobile vs desktop
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("desktop");
  const [testActionMessage, setTestActionMessage] = useState<string | null>(null);

  // Sync on open
  useEffect(() => {
    if (isOpen) {
      const storedBtn = getStoredNavButtonConfig();
      setBtnConfig({
        ...storedBtn,
        preset: activeStyle || storedBtn.preset,
      });
      setIconConfig(getStoredTopIconConfig());
      setBarConfig(getStoredTopBarConfig());
      setTabConfig(getStoredTabConfig());
    }
  }, [isOpen, activeStyle]);

  // Haptic feedback
  const triggerHaptic = (duration = 10) => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(duration);
      }
    } catch {
      // ignore
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Updaters
  const updateBtnConfig = (partial: Partial<NavButtonConfig>) => {
    const updated: NavButtonConfig = { ...btnConfig, ...partial };
    setBtnConfig(updated);
    saveNavButtonConfig(updated);
    if (partial.preset && onSelectStyle && partial.preset !== activeStyle) {
      onSelectStyle(partial.preset);
    }
    onConfigChange?.(updated);
  };

  const updateIconConfig = (partial: Partial<TopIconConfig>) => {
    const updated: TopIconConfig = { ...iconConfig, ...partial };
    setIconConfig(updated);
    saveTopIconConfig(updated);
  };

  const updateBarConfig = (partial: Partial<TopBarConfig>) => {
    const updated: TopBarConfig = { ...barConfig, ...partial };
    setBarConfig(updated);
    saveTopBarConfig(updated);
  };

  const updateTabConfig = (partial: Partial<TabConfig>) => {
    const updated: TabConfig = { ...tabConfig, ...partial };
    setTabConfig(updated);
    saveTabConfig(updated);
  };

  const handleTestClick = (itemName: string, effect: string) => {
    if (effect !== "none") {
      triggerHaptic(12);
    }
    setTestActionMessage(`✓ ${itemName} दबाया गया!`);
    setTimeout(() => {
      setTestActionMessage(null);
    }, 1500);
  };

  // Render classes for preview
  const backClasses = getNavButtonClasses(btnConfig.preset, "back", btnConfig);
  const menuClasses = getNavButtonClasses(btnConfig.preset, "menu", btnConfig);
  const topIconClasses = getTopIconClasses(iconConfig);
  const topBarClasses = getTopBarClasses(barConfig);
  const topStrip = getTopStripClasses(barConfig);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[94vh] transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="btn-style-modal-title"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs shrink-0">
              <SlidersHorizontal className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div>
              <h2 id="btn-style-modal-title" className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
                टाप बार, टाप आइकन्स व टैब्स कस्टमाइज़र
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
                टाप पट्टी, टाप आइकन्स, टैब नाम साइज, डेस्कटॉप आइकॉन रूल व बॉटम पट्टी के सभी विकल्प
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unified Live Interactive Sandbox Header */}
        <div className="bg-gradient-to-b from-stone-200/60 via-stone-100 to-stone-50 px-3 sm:px-6 py-3 border-b border-stone-200/90 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              लाइव टेस्ट सैंडबॉक्स (वास्तविक प्रीव्यू - दबाकर देखें)
            </span>

            {/* Device preview toggler */}
            <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(6);
                  setPreviewDevice("mobile");
                }}
                className={`px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-all ${
                  previewDevice === "mobile"
                    ? "bg-white text-stone-900 shadow-2xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                title="मोबाइल व्यू"
              >
                <Smartphone className="w-3 h-3" />
                <span className="text-[10.5px]">मोबाइल</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(6);
                  setPreviewDevice("desktop");
                }}
                className={`px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-all ${
                  previewDevice === "desktop"
                    ? "bg-white text-stone-900 shadow-2xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                title="डेस्कटॉप व्यू"
              >
                <Monitor className="w-3 h-3" />
                <span className="text-[10.5px]">डेस्कटॉप</span>
              </button>
            </div>
          </div>

          {/* Simulated Top Bar with Layout */}
          <div className={`transition-all ${barConfig.layout === "floating_island" ? "p-1.5" : "p-0"}`}>
            {/* Top Ribbon on Header Top if positioned at top or both */}
            {topStrip.isVisible && (topStrip.position === "top" || topStrip.position === "both") && (
              <div className={`${topStrip.stripClasses} rounded-t-xl`} />
            )}

            <div 
              className={`flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 rounded-xl transition-all ${
                topBarClasses.isDark 
                  ? "bg-stone-950 text-white border border-stone-800" 
                  : "bg-white/95 text-stone-900 border border-stone-200/90 shadow-2xs"
              } ${barConfig.height === "compact" ? "min-h-[42px] py-1" : barConfig.height === "comfort" ? "min-h-[56px] py-1.5" : barConfig.height === "spacious" ? "min-h-[64px] py-2" : "min-h-[48px] py-1"}`}
            >
              {/* Left Buttons: Back & Menu */}
              <div className="flex items-center gap-1.5 min-w-0">
                <button
                  type="button"
                  onClick={() => handleTestClick("बैक बटन", btnConfig.effect)}
                  className={backClasses.buttonClasses}
                  title="बैक बटन टेस्ट करें"
                >
                  <ArrowLeft className={backClasses.iconClasses} />
                  {previewDevice === "desktop" && (
                    <span className={backClasses.textClasses.replace("hidden sm:inline", "inline")}>
                      {currentBackTitle}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTestClick("मेनू बटन", btnConfig.effect)}
                  className={menuClasses.buttonClasses}
                  title="मेनू बटन टेस्ट करें"
                >
                  <Menu className={menuClasses.iconClasses} />
                  {previewDevice === "desktop" && (
                    <span className={menuClasses.textClasses.replace("hidden sm:inline", "inline")}>
                      मेनू
                    </span>
                  )}
                </button>

                {/* Simulated Title */}
                <div className="flex items-center gap-1.5 ml-1 truncate">
                  <div className="w-4.5 h-4.5 rounded-md bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-[9px] shrink-0">
                    <Compass className="w-3 h-3" />
                  </div>
                  <span className={`text-xs sm:text-sm font-extrabold truncate ${topBarClasses.isDark ? "text-white" : "text-stone-900"}`}>
                    होम डैशबोर्ड
                  </span>
                </div>
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Search Icon */}
                <button
                  type="button"
                  onClick={() => handleTestClick("सर्च आइकन", iconConfig.effect)}
                  className={topIconClasses.buttonClasses}
                  title="सर्च आइकन टेस्ट करें"
                >
                  <Search className={topIconClasses.iconClasses} />
                  {topIconClasses.labelDisplay !== "icons_only" && (
                    <span className={previewDevice === "mobile" && topIconClasses.labelDisplay === "desktop_only" ? "hidden" : "inline text-xs"}>
                      खोजें
                    </span>
                  )}
                </button>

                {/* AI Assistant Icon */}
                <button
                  type="button"
                  onClick={() => handleTestClick("AI डाउट आइकन", iconConfig.effect)}
                  className={topIconClasses.buttonClasses}
                  title="AI डाउट टेस्ट करें"
                >
                  <Sparkles className={`${topIconClasses.iconClasses} text-amber-500`} />
                  {topIconClasses.labelDisplay !== "icons_only" && (
                    <span className={previewDevice === "mobile" && topIconClasses.labelDisplay === "desktop_only" ? "hidden" : "inline text-xs"}>
                      AI
                    </span>
                  )}
                </button>

                {/* Settings Icon */}
                <button
                  type="button"
                  onClick={() => handleTestClick("सेटिंग्स आइकन", iconConfig.effect)}
                  className={topIconClasses.buttonClasses}
                  title="सेटिंग्स टेस्ट करें"
                >
                  <Settings className={topIconClasses.iconClasses} />
                  {topIconClasses.labelDisplay !== "icons_only" && (
                    <span className={previewDevice === "mobile" && topIconClasses.labelDisplay === "desktop_only" ? "hidden" : "inline text-xs"}>
                      सेटिंग
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Top Ribbon on Header Bottom if positioned at bottom or both */}
            {topStrip.isVisible && (topStrip.position === "bottom" || topStrip.position === "both") && (
              <div className={`${topStrip.stripClasses} rounded-b-xl`} />
            )}
          </div>

          {/* Simulated Tab Strip Preview (Real-time Icon & Name display) */}
          <div className="mt-2.5 pt-2 border-t border-stone-200/80">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10.5px] font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>टैब्स की पट्टी (Tabs Preview):</span>
                <span className="text-[9.5px] font-semibold text-stone-500">
                  {previewDevice === "mobile" ? "📱 मोबाइल" : "💻 डेस्कटॉप"}
                  {tabConfig.iconVisibility === "desktop_only" && (
                    previewDevice === "mobile" 
                      ? " • केवल नाम (आइकॉन छिपा)" 
                      : " • आइकॉन + नाम दोनों"
                  )}
                </span>
              </span>
              <span className="text-[9.5px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded-full border border-amber-300">
                {tabConfig.stripPreset}
              </span>
            </div>

            {/* Simulated tab buttons in sandbox */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/95 border border-stone-200 shadow-2xs max-w-full overflow-x-auto no-scrollbar">
                {[
                  { id: "home", name: "होम डैशबोर्ड", shortName: "होम", icon: <Home className="w-3.5 h-3.5" /> },
                  { id: "cockpit", name: "आज का रिवीजन", shortName: "रिवीजन", icon: <Compass className="w-3.5 h-3.5" /> },
                  { id: "heatmap", name: "30-दिन कैलेंडर", shortName: "कैलेंडर", icon: <CalendarDays className="w-3.5 h-3.5" /> },
                  { id: "audit_grid", name: "प्रगति ग्रिड", shortName: "प्रगति", icon: <Grid3X3 className="w-3.5 h-3.5" /> },
                  { id: "more", name: "अन्य टूल्स व मेन्यू", shortName: "अन्य", icon: <Layers className="w-3.5 h-3.5" /> },
                ].map((t, idx) => {
                  const isSimActive = idx === 0;
                  const nameTypography = getTabNameTypographyClasses(tabConfig.nameSize, tabConfig.nameWeight);
                  const displayName = tabConfig.nameFormat === "full" ? t.name : t.shortName;

                  const showIcon = tabConfig.iconVisibility === "always"
                    || (tabConfig.iconVisibility === "desktop_only" && previewDevice === "desktop")
                    || (tabConfig.iconVisibility === "active_only" && (isSimActive || previewDevice === "desktop"));

                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTestClick(`टैब: ${displayName}`, "pulse")}
                      className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                        isSimActive 
                          ? "bg-amber-500 text-stone-950 font-black shadow-xs ring-1 ring-amber-600/30" 
                          : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      {showIcon && (
                        <span className="shrink-0">
                          {t.icon}
                        </span>
                      )}
                      <span className={nameTypography}>{displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status readout & Feedback banner */}
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10.5px] text-stone-500 font-medium truncate">
              टाप बार: <strong className="text-stone-800">{barConfig.preset}</strong> ({barConfig.opacity}%) • 
              पट्टी: <strong className="text-stone-800">{barConfig.stripStyle}</strong> • 
              टैब आइकॉन: <strong className="text-stone-800">{tabConfig.iconVisibility}</strong>
            </span>

            <div className="shrink-0">
              {testActionMessage ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md animate-in fade-in">
                  {testActionMessage}
                </span>
              ) : (
                <span className="text-[10px] text-stone-400 font-medium">
                  ऊपर किसी भी आइकन या टैब पर क्लिक करें 👆
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4 Main Navigation Tabs */}
        <div className="px-3 sm:px-6 py-2 bg-stone-100/80 border-b border-stone-200 flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "top_bar", name: "1. टाप बार व पट्टी (Top Bar & Strip)", desc: "शैलियाँ, पट्टी, ऊँचाई, पारदर्शिता, ब्लर व लाइन" },
            { id: "top_icons", name: "2. टाप आइकन्स (Top Icons)", desc: "सर्च, AI, सेटिंग्स: साइज, पारदर्शिता, इफ़ेक्ट" },
            { id: "tabs", name: "3. टैब्स (नाम, आइकॉन व पट्टी)", desc: "डेस्कटॉप पर ही आइकॉन, नाम साइज व पट्टी शैलियाँ" },
            { id: "back_menu", name: "4. वापस / मेनू बटन (Back & Menu)", desc: "बैक व मेनू बटन की शैली, साइज व लाइन" },
          ].map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  triggerHaptic(6);
                  setActiveSection(tab.id as TesterSection);
                }}
                className={`px-3 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-white text-stone-900 font-extrabold shadow-xs border border-stone-300 ring-2 ring-amber-400/20"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-semibold"
                }`}
              >
                <span className="text-xs sm:text-[13px] block leading-tight">{tab.name}</span>
                <span className="text-[9.5px] text-stone-500 font-normal hidden sm:block mt-0.5">{tab.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents: Scrollable Settings */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* ============================================================
              TAB 1: TOP BAR SETTINGS
             ============================================================ */}
          {activeSection === "top_bar" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* 1. TOP BAR PRESETS (बड़े-बड़े ऐप्स के हेडर डिज़ाइन्स) */}
              <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-amber-600" />
                    <span>बड़े-बड़े ऐप्स के टाप बार डिज़ाइन्स (Top Bar Presets):</span>
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    {TOP_BAR_STYLES.find((s) => s.id === barConfig.preset)?.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {TOP_BAR_STYLES.map((style) => {
                    const isSelected = barConfig.preset === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateBarConfig({ preset: style.id });
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/20 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 truncate">{style.nameHindi}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-stone-500 block mt-1 line-clamp-2 leading-tight">
                          {style.descriptionHindi}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. TOP BAR HEIGHT / SIZE SLIDER */}
              <CompactRangeSlider
                id="slider-topbar-height"
                label="टाप बार की ऊँचाई / साइज (Height)"
                icon={<Maximize2 className="w-3.5 h-3.5" />}
                min={0}
                max={TOP_BAR_HEIGHT_STEPS.length - 1}
                step={1}
                value={Math.max(0, TOP_BAR_HEIGHT_STEPS.findIndex((s) => s.id === barConfig.height))}
                valueDisplay={
                  <span>
                    {(TOP_BAR_HEIGHT_STEPS.find((s) => s.id === barConfig.height) || TOP_BAR_HEIGHT_STEPS[1]).label}
                    {" "}({(TOP_BAR_HEIGHT_STEPS.find((s) => s.id === barConfig.height) || TOP_BAR_HEIGHT_STEPS[1]).px})
                  </span>
                }
                subLabel="स्लाइडर से कॉम्पैक्ट 42px से लेकर स्पेशियस 66px तक एडजस्ट करें"
                minLabel="कॉम्पैक्ट (42px)"
                maxLabel="स्पेशियस (66px)"
                accentColor="indigo"
                onChange={(idx) => {
                  const step = TOP_BAR_HEIGHT_STEPS[idx] || TOP_BAR_HEIGHT_STEPS[1];
                  updateBarConfig({ height: step.id });
                }}
              />

              {/* 3. TOP BAR TRANSPARENCY / OPACITY SLIDER */}
              <CompactRangeSlider
                id="slider-topbar-opacity"
                label="टाप बार पारदर्शिता (Transparency / Opacity)"
                icon={<Droplet className="w-3.5 h-3.5" />}
                min={0}
                max={100}
                step={5}
                value={barConfig.opacity}
                valueDisplay={`${barConfig.opacity}%`}
                subLabel="0% पूर्ण पारदर्शी वाटर ग्लास से 100% ठोस अपारदर्शी तक"
                minLabel="0% ग्लास"
                maxLabel="100% ठोस"
                accentColor="sky"
                onChange={(val) => {
                  updateBarConfig({ opacity: val });
                }}
              />

              {/* 4. TOP BAR BLUR & BORDER LINE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Border Line Slider */}
                <CompactRangeSlider
                  id="slider-topbar-border"
                  label="नीचे की बॉर्डर लाइन (Border)"
                  icon={<Minus className="w-3.5 h-3.5" />}
                  min={0}
                  max={BORDER_STEPS.length - 1}
                  step={1}
                  value={Math.max(0, BORDER_STEPS.findIndex((b) => b.id === barConfig.border))}
                  valueDisplay={(BORDER_STEPS.find((b) => b.id === barConfig.border) || BORDER_STEPS[1]).label}
                  minLabel="0px (शून्य)"
                  maxLabel="3px (बोल्ड)"
                  accentColor="stone"
                  onChange={(idx) => {
                    const b = BORDER_STEPS[idx] || BORDER_STEPS[1];
                    updateBarConfig({ border: b.id });
                  }}
                />

                {/* Blur Glass */}
                <div className="p-2.5 sm:p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-teal-600" />
                      <span>ग्लास ब्लर (Backdrop Blur):</span>
                    </label>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">{barConfig.blur}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: "none", name: "शून्य" },
                      { id: "light", name: "हल्का" },
                      { id: "medium", name: "मध्यम" },
                      { id: "heavy", name: "गहरा" },
                    ].map((bl) => (
                      <button
                        key={bl.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateBarConfig({ blur: bl.id as TopBarBlur });
                        }}
                        className={`py-1 text-center rounded-lg border text-[10.5px] font-bold transition-all cursor-pointer ${
                          barConfig.blur === bl.id
                            ? "bg-teal-50 border-teal-600 text-teal-900 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                        }`}
                      >
                        {bl.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. TOP BAR LAYOUT: FULL-WIDTH vs FLOATING ISLAND */}
              <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-purple-600" />
                    <span>लेआउट रूप (Layout Appearance):</span>
                  </label>
                  <span className="text-[10.5px] font-bold text-purple-700">
                    {barConfig.layout === "full_width" ? "स्क्रीन से सटा (Edge to Edge)" : "फ्लोटिंग आइलैंड (Detached Island)"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: "full_width", name: "पूरी चौड़ाई (Full Width)", desc: "स्क्रीन के शीर्ष पर चिपकी हुई मानक पट्टी" },
                    { id: "floating_island", name: "फ्लोटिंग द्वीप (Floating Island)", desc: "स्क्रीन से अलग तैरता हुआ गोल कोनों वाला सुंदर कार्ड" },
                  ].map((ly) => (
                    <button
                      key={ly.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(8);
                        updateBarConfig({ layout: ly.id as TopBarLayout });
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        barConfig.layout === ly.id
                          ? "bg-purple-50 border-purple-600 ring-2 ring-purple-400/20 shadow-2xs"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{ly.name}</span>
                        {barConfig.layout === ly.id && <Check className="w-3 h-3 text-purple-600 stroke-[3]" />}
                      </div>
                      <span className="text-[9.5px] text-stone-500 block mt-0.5">{ly.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. TOP STRIP / RIBBON OPTIONS ("Top की पट्टी के विकल्प") */}
              <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Top की पट्टी (Top Ribbon / Strip Bar):</span>
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    {TOP_STRIP_STYLES.find((s) => s.id === barConfig.stripStyle)?.nameHindi || barConfig.stripStyle}
                  </span>
                </div>

                {/* Strip Presets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {TOP_STRIP_STYLES.map((st) => {
                    const isSelected = barConfig.stripStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateBarConfig({ stripStyle: st.id });
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400/20 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-900 truncate">{st.nameHindi.split(" ")[0]}</span>
                          {isSelected && <Check className="w-3 h-3 text-amber-600 stroke-[3]" />}
                        </div>
                        {st.id !== "none" && (
                          <div className={`w-full h-1.5 rounded-full ${st.gradientClass} mb-1`} />
                        )}
                        <span className="text-[9.5px] text-stone-500 block leading-tight">{st.descriptionHindi}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Strip Position & Thickness */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {/* Position */}
                  <div className="p-2 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="text-[11px] font-bold text-stone-700 block">पट्टी की स्थिति (Position):</span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: "bottom", name: "नीचे" },
                        { id: "top", name: "ऊपर" },
                        { id: "both", name: "दोनों" },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic(6);
                            updateBarConfig({ stripPosition: pos.id as TopStripPosition });
                          }}
                          className={`py-1 text-center rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                            barConfig.stripPosition === pos.id
                              ? "bg-stone-900 text-white shadow-2xs"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                          }`}
                        >
                          {pos.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thickness Range Slider */}
                  <div className="p-2 bg-white rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-700 block">मोटाई (Height):</span>
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                        {barConfig.stripThickness}
                      </span>
                    </div>
                    <div className="pt-0.5">
                      <input
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        value={Math.max(0, STRIP_THICKNESS_STEPS.indexOf(barConfig.stripThickness))}
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          const th = STRIP_THICKNESS_STEPS[idx] || "2px";
                          triggerHaptic(6);
                          updateBarConfig({ stripThickness: th });
                        }}
                        className="w-full h-1.5 bg-stone-200 rounded-full appearance-none accent-amber-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-[8.5px] text-stone-400 font-bold px-0.5">
                      <span>1px स्लिम</span>
                      <span>6px गहरा</span>
                    </div>
                  </div>

                  {/* Animation */}
                  <div className="p-2 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="text-[11px] font-bold text-stone-700 block">ऐनिमेशन (Effect):</span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: "none", name: "स्थिर" },
                        { id: "pulse", name: "पल्स" },
                        { id: "shimmer", name: "चमक" },
                      ].map((an) => (
                        <button
                          key={an.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic(6);
                            updateBarConfig({ stripAnimation: an.id as TopStripAnimation });
                          }}
                          className={`py-1 text-center rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                            barConfig.stripAnimation === an.id
                              ? "bg-stone-900 text-white shadow-2xs"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                          }`}
                        >
                          {an.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7 Big-Tech Strip Switcher Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">7 बिग-टेक त्वरित स्टाइल ट्रायल पट्टी</span>
                    <span className="text-[10px] text-amber-800">हेडर के तुरंत नीचे दिखने वाली 1-टैप स्विचिंग पट्टी</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      updateBarConfig({ showEcoStrip: !barConfig.showEcoStrip });
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                      barConfig.showEcoStrip
                        ? "bg-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-600/30"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {barConfig.showEcoStrip ? "दिखाएं (ON)" : "छिपाएं (OFF)"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 2: TOP ICONS SETTINGS
             ============================================================ */}
          {activeSection === "top_icons" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* 1. TOP ICONS PRESETS (बड़े ऐप्स के आइकन स्टाइल्स) */}
              <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>बड़े-बड़े ऐप्स के आइकन स्टाइल्स (Top Icon Styles):</span>
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    {TOP_ICON_STYLES.find((s) => s.id === iconConfig.preset)?.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {TOP_ICON_STYLES.map((opt) => {
                    const isSelected = iconConfig.preset === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateIconConfig({ preset: opt.id });
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/20 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 truncate">{opt.nameHindi}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-stone-500 block mt-1 line-clamp-2 leading-tight">
                          {opt.descriptionHindi}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. TOP ICONS SIZE SLIDER */}
              <CompactRangeSlider
                id="slider-topicon-size"
                label="टाप आइकन्स की साइज (Size)"
                icon={<Maximize2 className="w-3.5 h-3.5" />}
                min={0}
                max={TOP_ICON_SIZE_STEPS.length - 1}
                step={1}
                value={Math.max(0, TOP_ICON_SIZE_STEPS.findIndex((s) => s.id === iconConfig.size))}
                valueDisplay={
                  <span>
                    {(TOP_ICON_SIZE_STEPS.find((s) => s.id === iconConfig.size) || TOP_ICON_SIZE_STEPS[1]).label}
                    {" "}({(TOP_ICON_SIZE_STEPS.find((s) => s.id === iconConfig.size) || TOP_ICON_SIZE_STEPS[1]).px})
                  </span>
                }
                subLabel="स्लाइडर से छोटा 28px से लेकर जंबो 48px तक त्वरित चयन करें"
                minLabel="छोटा (28px)"
                maxLabel="जंबो (48px)"
                accentColor="indigo"
                onChange={(idx) => {
                  const step = TOP_ICON_SIZE_STEPS[idx] || TOP_ICON_SIZE_STEPS[1];
                  updateIconConfig({ size: step.id });
                }}
              />

              {/* 3. TOP ICONS TRANSPARENCY / OPACITY SLIDER */}
              <CompactRangeSlider
                id="slider-topicon-opacity"
                label="आइकन पृष्ठभूमि पारदर्शिता (Opacity)"
                icon={<Droplet className="w-3.5 h-3.5" />}
                min={0}
                max={100}
                step={5}
                value={iconConfig.opacity}
                valueDisplay={`${iconConfig.opacity}%`}
                subLabel="0% पारदर्शी (केवल आइकन) से लेकर 100% ठोस बॉक्स तक"
                minLabel="0% केवल आइकन"
                maxLabel="100% ठोस"
                accentColor="sky"
                onChange={(val) => {
                  updateIconConfig({ opacity: val });
                }}
              />

              {/* 4. TOP ICONS BORDER LINE & EFFECTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Border Line Slider */}
                <CompactRangeSlider
                  id="slider-topicon-border"
                  label="आइकन बॉर्डर (Border)"
                  icon={<Minus className="w-3.5 h-3.5" />}
                  min={0}
                  max={BORDER_STEPS.length - 1}
                  step={1}
                  value={Math.max(0, BORDER_STEPS.findIndex((b) => b.id === iconConfig.border))}
                  valueDisplay={(BORDER_STEPS.find((b) => b.id === iconConfig.border) || BORDER_STEPS[1]).label}
                  minLabel="0px"
                  maxLabel="3px"
                  accentColor="stone"
                  onChange={(idx) => {
                    const b = BORDER_STEPS[idx] || BORDER_STEPS[1];
                    updateIconConfig({ border: b.id });
                  }}
                />

                {/* Touch Effect (बगैर इफ़ेक्ट विकल्प) */}
                <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      {iconConfig.effect === "none" ? (
                        <ZapOff className="w-3.5 h-3.5 text-rose-600" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>टच इफ़ेक्ट (Click Effects):</span>
                    </label>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      iconConfig.effect === "none"
                        ? "text-rose-700 bg-rose-50 border-rose-200"
                        : "text-amber-700 bg-amber-50 border-amber-200"
                    }`}>
                      {iconConfig.effect === "none" ? "🚫 बगैर इफ़ेक्ट" : "इफ़ेक्ट सक्रिय"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "none", name: "बगैर इफ़ेक्ट (None)", desc: "शून्य हलचल, त्वरित टच" },
                      { id: "subtle", name: "हल्का फ़ेड (Fade)", desc: "सॉफ्ट ओपेसिटी फ़ेड" },
                      { id: "scale", name: "स्केल पॉप (Scale)", desc: "दबाने पर हल्का सिकुड़ना" },
                      { id: "glow", name: "ग्लो रिंग (Glow)", desc: "सॉफ्ट रिंग व शैडो" },
                    ].map((ef) => (
                      <button
                        key={ef.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateIconConfig({ effect: ef.id as TopIconEffect });
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          iconConfig.effect === ef.id
                            ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400/20 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{ef.name}</span>
                          {iconConfig.effect === ef.id && <Check className="w-3 h-3 text-amber-600 stroke-[3]" />}
                        </div>
                        <span className="text-[9px] text-stone-500 block mt-0.5">{ef.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. TEXT LABELS TOGGLE */}
              <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-blue-600" />
                    <span>टेक्स्ट लेबल दिखाएं (Icon Labels):</span>
                  </label>
                  <span className="text-[10.5px] font-bold text-blue-700">
                    {iconConfig.labelDisplay === "desktop_only" ? "डेस्कटॉप पर" : iconConfig.labelDisplay === "always" ? "हमेशा" : "केवल आइकन"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "desktop_only", name: "डेस्कटॉप पर नाम (स्मार्ट)", desc: "मोबाइल पर केवल आइकन, बड़ी स्क्रीन पर नाम भी" },
                    { id: "always", name: "हमेशा नाम दिखाएं", desc: "मोबाइल और डेस्कटॉप दोनों पर नाम साथ रहेगा" },
                    { id: "icons_only", name: "केवल आइकन (सुपर क्लीन)", desc: "कोई नाम नहीं, सिर्फ साफ़ आइकन बटन" },
                  ].map((lbl) => (
                    <button
                      key={lbl.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(8);
                        updateIconConfig({ labelDisplay: lbl.id as TopIconLabelDisplay });
                      }}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        iconConfig.labelDisplay === lbl.id
                          ? "bg-blue-50 border-blue-600 ring-2 ring-blue-400/20 shadow-2xs"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{lbl.name}</span>
                        {iconConfig.labelDisplay === lbl.id && <Check className="w-3 h-3 text-blue-600 stroke-[3]" />}
                      </div>
                      <span className="text-[9.5px] text-stone-500 block mt-0.5">{lbl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 3: TABS (NAME, ICON DESKTOP RULE & STRIP BAR)
             ============================================================ */}
          {activeSection === "tabs" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* 1. ICON DISPLAY RULE ("जहाँ tabs के नाम आते हैं वहां Icon न आए icon तभी आए जब decstop चल रहा हो") */}
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border-2 border-amber-300 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>जहाँ टैब्स के नाम आते हैं वहाँ आइकॉन (Icon Display Rule):</span>
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-200/80 font-black px-2.5 py-0.5 rounded-full border border-amber-400">
                    {tabConfig.iconVisibility === "desktop_only" 
                      ? "✨ केवल डेस्कटॉप पर (मोबाइल पर नाम मात्र)" 
                      : tabConfig.iconVisibility === "always" 
                      ? "दोनों पर आइकॉन" 
                      : tabConfig.iconVisibility === "never" 
                      ? "केवल नाम" 
                      : "सक्रिय टैब पर"}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/90 font-medium">
                  आपकी विशेष पसंद: <strong>मोबाइल पर सिर्फ टैब का नाम दिखे, आइकॉन केवल तभी आए जब डेस्कटॉप चल रहा हो।</strong>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {[
                    {
                      id: "desktop_only",
                      name: "💻 केवल डेस्कटॉप पर आइकॉन (मोबाइल पर सिर्फ नाम)",
                      tag: "✨ आपकी पसंद (Default)",
                      desc: "मोबाइल स्क्रीन पर कोई आइकॉन नहीं दिखेगा, केवल साफ-सुथरा टैब नाम दिखेगा। डेस्कटॉप पर आइकॉन व नाम दोनों दिखेंगे।",
                      bg: "border-amber-500 bg-white ring-2 ring-amber-400/30",
                    },
                    {
                      id: "always",
                      name: "📱💻 हमेशा आइकॉन दिखाएं (मोबाइल + डेस्कटॉप)",
                      tag: "दोनों पर",
                      desc: "मोबाइल और डेस्कटॉप दोनों पर आइकॉन और नाम दोनों हमेशा साथ दिखेंगे।",
                      bg: "border-stone-300 bg-white",
                    },
                    {
                      id: "never",
                      name: "🚫 आइकॉन कभी नहीं (सिर्फ नाम)",
                      tag: "सुपर मिनिमल",
                      desc: "मोबाइल और डेस्कटॉप किसी पर भी आइकॉन नहीं आएगा, केवल टैब्स के नाम दिखेंगे।",
                      bg: "border-stone-300 bg-white",
                    },
                    {
                      id: "active_only",
                      name: "⭐ केवल सक्रिय (Active) टैब पर आइकॉन",
                      tag: "स्मार्ट फोकस",
                      desc: "जिस टैब पर आप हैं केवल उसी का आइकॉन खुलेगा, बाकी पर केवल नाम रहेगा।",
                      bg: "border-stone-300 bg-white",
                    },
                  ].map((rule) => {
                    const isSelected = tabConfig.iconVisibility === rule.id;
                    return (
                      <button
                        key={rule.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateTabConfig({ iconVisibility: rule.id as TabIconVisibility });
                        }}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-100/90 border-amber-600 ring-2 ring-amber-500/30 shadow-xs"
                            : "bg-white border-stone-200 hover:border-amber-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-stone-900 leading-snug">{rule.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3] shrink-0 ml-1" />}
                        </div>
                        <span className="text-[10px] text-amber-900/80 font-bold block mb-0.5">{rule.tag}</span>
                        <span className="text-[9.5px] text-stone-600 block leading-tight">{rule.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. TAB NAME SIZE SLIDER ("tabs के नाम के लिए भी आपशन उनकी साइज") */}
              <CompactRangeSlider
                id="slider-tab-name-size"
                label="टैब्स के नाम का आकार (Name Font Size)"
                icon={<Type className="w-3.5 h-3.5" />}
                min={0}
                max={TAB_NAME_SIZE_STEPS.length - 1}
                step={1}
                value={Math.max(0, TAB_NAME_SIZE_STEPS.findIndex((s) => s.id === tabConfig.nameSize))}
                valueDisplay={
                  <span>
                    {(TAB_NAME_SIZE_STEPS.find((s) => s.id === tabConfig.nameSize) || TAB_NAME_SIZE_STEPS[2]).label}
                    {" "}({(TAB_NAME_SIZE_STEPS.find((s) => s.id === tabConfig.nameSize) || TAB_NAME_SIZE_STEPS[2]).px})
                  </span>
                }
                subLabel="बारीक 9.5px से लेकर अल्ट्रा 15px तक टैब नाम का टेक्स्ट आकार"
                minLabel="बारीक (9.5px)"
                maxLabel="अल्ट्रा (15px)"
                accentColor="blue"
                onChange={(idx) => {
                  const step = TAB_NAME_SIZE_STEPS[idx] || TAB_NAME_SIZE_STEPS[2];
                  updateTabConfig({ nameSize: step.id });
                }}
              />

              {/* 3. TAB NAME WEIGHT & FORMAT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Font Weight */}
                <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-stone-700" />
                      <span>नाम का गाढ़ापन (Font Weight):</span>
                    </label>
                    <span className="text-[10px] font-bold text-stone-600">{tabConfig.nameWeight}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "medium", name: "मीडियम", desc: "सामान्य" },
                      { id: "bold", name: "बोल्ड", desc: "गाढ़ा" },
                      { id: "extrabold", name: "अल्ट्रा", desc: "ब्लैक बोल्ड" },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(6);
                          updateTabConfig({ nameWeight: w.id as TabNameWeight });
                        }}
                        className={`p-2 text-center rounded-xl border transition-all cursor-pointer ${
                          tabConfig.nameWeight === w.id
                            ? "bg-stone-900 text-white font-extrabold shadow-2xs"
                            : "bg-white border-stone-200 hover:bg-stone-100 text-stone-800 font-semibold"
                        }`}
                      >
                        <span className="text-xs block">{w.name}</span>
                        <span className={`text-[9px] block opacity-80 ${tabConfig.nameWeight === w.id ? "text-stone-300" : "text-stone-500"}`}>{w.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Format */}
                <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>नाम का प्रारूप (Name Format):</span>
                    </label>
                    <span className="text-[10px] font-bold text-emerald-700">{tabConfig.nameFormat === "short" ? "संक्षिप्त" : "विस्तृत"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "short", name: "संक्षिप्त नाम", desc: "'होम', 'रिवीजन', 'कैलेंडर'" },
                      { id: "full", name: "पूरा नाम", desc: "'होम डैशबोर्ड', 'आज का रिवीजन'" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(6);
                          updateTabConfig({ nameFormat: f.id as TabNameFormat });
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          tabConfig.nameFormat === f.id
                            ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-400/20 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{f.name}</span>
                          {tabConfig.nameFormat === f.id && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                        </div>
                        <span className="text-[9.5px] text-stone-500 block mt-0.5">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. TAB STRIP PRESETS ("पट्टी बगैरह के विकल्प") */}
              <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>टैब्स की पट्टी डिज़ाइन्स (Tab Strip Presets):</span>
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    {TAB_STRIP_PRESETS.find((p) => p.id === tabConfig.stripPreset)?.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {TAB_STRIP_PRESETS.map((pst) => {
                    const isSelected = tabConfig.stripPreset === pst.id;
                    return (
                      <button
                        key={pst.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateTabConfig({ stripPreset: pst.id as TabStripPreset });
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400/20 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-900">{pst.nameHindi.split(" ")[0]}</span>
                          {isSelected && <Check className="w-3 h-3 text-amber-600 stroke-[3]" />}
                        </div>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded-md inline-block mb-1">
                          {pst.tag}
                        </span>
                        <span className="text-[9.5px] text-stone-500 block leading-tight">{pst.descriptionHindi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. STRIP HEIGHT & OPACITY & INDICATOR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Height Slider */}
                <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>पट्टी ऊंचाई:</span>
                    </label>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300">
                      {(TAB_STRIP_HEIGHT_STEPS.find((s) => s.id === tabConfig.stripHeight) || TAB_STRIP_HEIGHT_STEPS[1]).label} ({(TAB_STRIP_HEIGHT_STEPS.find((s) => s.id === tabConfig.stripHeight) || TAB_STRIP_HEIGHT_STEPS[1]).px})
                    </span>
                  </div>
                  <div className="pt-0.5">
                    <input
                      type="range"
                      min={0}
                      max={TAB_STRIP_HEIGHT_STEPS.length - 1}
                      step={1}
                      value={Math.max(0, TAB_STRIP_HEIGHT_STEPS.findIndex((s) => s.id === tabConfig.stripHeight))}
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        const step = TAB_STRIP_HEIGHT_STEPS[idx] || TAB_STRIP_HEIGHT_STEPS[1];
                        triggerHaptic(6);
                        updateTabConfig({ stripHeight: step.id });
                      }}
                      className="w-full h-1.5 bg-stone-200 rounded-full appearance-none accent-purple-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[8.5px] text-stone-400 font-bold px-0.5">
                    <span>40px</span>
                    <span>66px</span>
                  </div>
                </div>

                {/* Opacity */}
                <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-sky-600" />
                      <span>पट्टी की पारदर्शिता:</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "glass", name: "क्रिस्टल ग्लास" },
                      { id: "frosted", name: "फ्रॉस्टेड 88%" },
                      { id: "solid", name: "ठोस अपारदर्शी" },
                      { id: "dark", name: "डार्क वेलवेट" },
                    ].map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(6);
                          updateTabConfig({ stripOpacity: op.id as TabStripOpacity });
                        }}
                        className={`p-2 rounded-xl text-center border text-[11px] font-bold transition-all cursor-pointer ${
                          tabConfig.stripOpacity === op.id
                            ? "bg-sky-50 border-sky-600 text-sky-900 shadow-2xs"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {op.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Indicator */}
                <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>सक्रिय इंडिकेटर:</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "pill_fill", name: "भरा पिल" },
                      { id: "underline_strip", name: "अंडरलाइन पट्टी" },
                      { id: "top_line", name: "टॉप स्ट्रिप" },
                      { id: "subtle_glow", name: "हल्का ग्लो" },
                    ].map((ind) => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(6);
                          updateTabConfig({ activeIndicator: ind.id as TabActiveIndicator });
                        }}
                        className={`p-2 rounded-xl text-center border text-[11px] font-bold transition-all cursor-pointer ${
                          tabConfig.activeIndicator === ind.id
                            ? "bg-amber-50 border-amber-600 text-amber-900 shadow-2xs"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {ind.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================
              TAB 4: BACK & MENU BUTTON SETTINGS
             ============================================================ */}
          {activeSection === "back_menu" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* 1. BUTTON PRESETS */}
              <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                    <span>बड़े-बड़े ऐप्स के बैक और मेनू बटन स्टाइल्स:</span>
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    {NAV_BUTTON_STYLES.find((s) => s.id === btnConfig.preset)?.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {NAV_BUTTON_STYLES.map((opt) => {
                    const isSelected = btnConfig.preset === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateBtnConfig({ preset: opt.id });
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/20 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 truncate">{opt.nameHindi}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-stone-500 block mt-1 line-clamp-2 leading-tight">
                          {opt.descriptionHindi}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. BUTTON SIZE SLIDER */}
              <CompactRangeSlider
                id="slider-btn-size"
                label="बटन की साइज (Size Options)"
                icon={<Maximize2 className="w-3.5 h-3.5" />}
                min={0}
                max={NAV_BTN_SIZE_STEPS.length - 1}
                step={1}
                value={Math.max(0, NAV_BTN_SIZE_STEPS.findIndex((s) => s.id === btnConfig.size))}
                valueDisplay={
                  <span>
                    {(NAV_BTN_SIZE_STEPS.find((s) => s.id === btnConfig.size) || NAV_BTN_SIZE_STEPS[1]).label}
                    {" "}({(NAV_BTN_SIZE_STEPS.find((s) => s.id === btnConfig.size) || NAV_BTN_SIZE_STEPS[1]).px})
                  </span>
                }
                subLabel="स्लाइडर से छोटा 32px से लेकर जंबो 52px तक बटन आकार सेट करें"
                minLabel="छोटा (32px)"
                maxLabel="जंबो (52px)"
                accentColor="indigo"
                onChange={(idx) => {
                  const step = NAV_BTN_SIZE_STEPS[idx] || NAV_BTN_SIZE_STEPS[1];
                  updateBtnConfig({ size: step.id });
                }}
              />

              {/* 3. BUTTON TRANSPARENCY / OPACITY SLIDER */}
              <CompactRangeSlider
                id="slider-btn-opacity"
                label="बटन पारदर्शिता (Transparency / Opacity)"
                icon={<Droplet className="w-3.5 h-3.5" />}
                min={0}
                max={100}
                step={5}
                value={btnConfig.opacity}
                valueDisplay={`${btnConfig.opacity}%`}
                subLabel="0% केवल तीर (बिना बॉक्स) से लेकर 100% ठोस बटन तक"
                minLabel="0% केवल तीर"
                maxLabel="100% ठोस"
                accentColor="sky"
                onChange={(val) => {
                  updateBtnConfig({ opacity: val });
                }}
              />

              {/* 4. BUTTON BORDER LINE & EFFECTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Border line slider */}
                <CompactRangeSlider
                  id="slider-btn-border"
                  label="बटन बॉर्डर लाइन (Border)"
                  icon={<Minus className="w-3.5 h-3.5" />}
                  min={0}
                  max={BORDER_STEPS.length - 1}
                  step={1}
                  value={Math.max(0, BORDER_STEPS.findIndex((b) => b.id === btnConfig.border))}
                  valueDisplay={(BORDER_STEPS.find((b) => b.id === btnConfig.border) || BORDER_STEPS[1]).label}
                  minLabel="0px"
                  maxLabel="3px"
                  accentColor="stone"
                  onChange={(idx) => {
                    const b = BORDER_STEPS[idx] || BORDER_STEPS[1];
                    updateBtnConfig({ border: b.id });
                  }}
                />

                {/* Touch Effect (बगैर इफ़ेक्ट विकल्प) */}
                <div className="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      {btnConfig.effect === "none" ? (
                        <ZapOff className="w-3.5 h-3.5 text-rose-600" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>टच इफ़ेक्ट (Click Effects):</span>
                    </label>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      btnConfig.effect === "none"
                        ? "text-rose-700 bg-rose-50 border-rose-200"
                        : "text-amber-700 bg-amber-50 border-amber-200"
                    }`}>
                      {btnConfig.effect === "none" ? "🚫 बगैर इफ़ेक्ट" : "इफ़ेक्ट सक्रिय"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "none", name: "बगैर इफ़ेक्ट (None)", desc: "शून्य हलचल, त्वरित टच" },
                      { id: "subtle", name: "हल्का फ़ेड (Fade)", desc: "सॉफ्ट ओपेसिटी फ़ेड" },
                      { id: "scale", name: "स्केल पॉप (Scale)", desc: "दबाने पर हल्का सिकुड़ना" },
                      { id: "glow", name: "ग्लो रिंग (Glow)", desc: "सॉफ्ट रिंग व शैडो" },
                    ].map((ef) => (
                      <button
                        key={ef.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          updateBtnConfig({ effect: ef.id as NavButtonEffect });
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          btnConfig.effect === ef.id
                            ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400/20 shadow-2xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{ef.name}</span>
                          {btnConfig.effect === ef.id && <Check className="w-3 h-3 text-amber-600 stroke-[3]" />}
                        </div>
                        <span className="text-[9px] text-stone-500 block mt-0.5">{ef.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 font-medium">
            सभी सेटिंग्स स्वतः सेव हो जाती हैं
          </span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            पूर्ण (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
