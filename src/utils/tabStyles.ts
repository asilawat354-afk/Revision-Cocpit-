import React from "react";

// Tab Icon Display Rule: User specifically requested:
// "जहा tabs के नाम आते हैं वहां Icon न आए icon तभी आए जब decstop चल रहा हो"
export type TabIconVisibility = 
  | "desktop_only"   // डेस्कटॉप पर ही आइकॉन (मोबाइल पर सिर्फ नाम) - DEFAULT
  | "always"         // हमेशा आइकॉन (मोबाइल और डेस्कटॉप दोनों)
  | "never"          // आइकॉन कभी नहीं (सिर्फ नाम)
  | "active_only";   // केवल सक्रिय टैब पर आइकॉन

// Tab Name Font Size: "tabs के नाम के लिए भी आपशन चाहिए उनकी साइज"
export type TabNameSize = 
  | "xs"  // बारीक (9px - 10px)
  | "sm"  // छोटा / कॉम्पैक्ट (10.5px - 11.5px)
  | "md"  // मानक / मध्यम (11.5px - 13px)
  | "lg"  // बड़ा / स्पष्ट (13px - 14.5px)
  | "xl"; // अल्ट्रा बड़ा (14.5px - 16px)

// Tab Name Font Weight
export type TabNameWeight = 
  | "medium"    // सामान्य मीडियम
  | "bold"      // बोल्ड (गाढ़ा)
  | "extrabold"; // एक्स्ट्रा-बोल्ड (अत्यधिक गाढ़ा)

// Tab Name Format: Short vs Full
export type TabNameFormat = 
  | "short" // संक्षिप्त (जैसे 'होम', 'रिवीजन', 'कैलेंडर')
  | "full";  // पूरा नाम (जैसे 'होम डैशबोर्ड', 'आज का रिवीजन')

// Tab Bar / Strip Preset: "पट्टी बगैरह"
export type TabStripPreset = 
  | "water_clear_pill"    // वाटर-क्लियर पिल (Water Clear Pill)
  | "apple_ios_bar"       // एप्पल iOS बार (Cupertino Bar)
  | "google_material_bar" // गूगल मटेरियल 3 बार (Material 3 Bar)
  | "spotify_linear_dock" // स्पॉटिफाई डार्क आइलैंड (Spotify Dark)
  | "instagram_minimal"   // इंस्टाग्राम क्लीन मिनिमल (Instagram Clean)
  | "capsule_segmented"   // कैप्सूल सेग्मेंटेड पट्टी (Capsule Ribbon)
  | "modern_floating";    // मॉडर्न फ्लोटिंग बार (Modern Floating)

// Tab Strip Height: "पट्टी की साइज"
export type TabStripHeight = 
  | "compact"   // कॉम्पैक्ट (कम ऊंचाई)
  | "standard"  // मानक (मध्यम ऊंचाई)
  | "comfort"   // कम्फर्ट (खुली ऊंचाई)
  | "spacious"; // स्पेशियस (बड़ी पट्टी)

// Tab Strip Background / Opacity
export type TabStripOpacity = 
  | "glass"   // क्रिस्टल ग्लास (अल्ट्रा ट्रांसपेरेंट 70%)
  | "frosted" // फ्रॉस्टेड 88%
  | "solid"   // सॉलिड 100% अपारदर्शी
  | "dark";   // डार्क वेलवेट ग्लास

// Tab Strip Border / Radius
export type TabStripRadius = 
  | "full"        // पिल राउंडेड
  | "rounded_2xl" // मॉडर्न कर्व्ड कॉर्नर
  | "flat";       // सीधा एज-टू-एज

// Active Tab Indicator Style
export type TabActiveIndicator = 
  | "pill_fill"       // भरा हुआ पिल
  | "underline_strip" // नीचे चमकती अंडरलाइन पट्टी
  | "top_line"        // ऊपर ऐक्सेंट लाइन
  | "subtle_glow";    // हल्का ग्लो

export interface TabConfig {
  iconVisibility: TabIconVisibility;
  nameSize: TabNameSize;
  nameWeight: TabNameWeight;
  nameFormat: TabNameFormat;
  stripPreset: TabStripPreset;
  stripHeight: TabStripHeight;
  stripOpacity: TabStripOpacity;
  stripRadius: TabStripRadius;
  activeIndicator: TabActiveIndicator;
}

export interface TabStripPresetOption {
  id: TabStripPreset;
  nameHindi: string;
  nameEnglish: string;
  appName: string;
  descriptionHindi: string;
  tag: string;
}

export const TAB_STRIP_PRESETS: TabStripPresetOption[] = [
  {
    id: "water_clear_pill",
    nameHindi: "वाटर-क्लियर पिल (Water Clear Pill)",
    nameEnglish: "Floating Clear Pill",
    appName: "Modern Glass",
    descriptionHindi: "हवा में तैरती फ्रॉस्टेड पिल, गोल किनारे, सुरुचिपूर्ण ग्लास रिफ्लेक्शन",
    tag: "पॉपुलर / बेस्ट",
  },
  {
    id: "apple_ios_bar",
    nameHindi: "Apple iOS (सफारी / आईफोन बॉटम बार)",
    nameEnglish: "Cupertino Full Bar",
    appName: "Apple iOS",
    descriptionHindi: "स्क्रीन के नीचे किनारा-से-किनारा फ्रॉस्टेड बार, 1px हेयरलाइन डिवाइडर",
    tag: "iOS 18 (Apple)",
  },
  {
    id: "google_material_bar",
    nameHindi: "Google Material You 3 (मटेरियल बार)",
    nameEnglish: "Material 3 Indicator",
    appName: "Google / Android",
    descriptionHindi: "टोनल सरफेस, पिल इंडिकेटर शेप, Android 14 का आधिकारिक बॉटम नेविगेशन",
    tag: "Material 3 (Google)",
  },
  {
    id: "spotify_linear_dock",
    nameHindi: "Spotify / Linear (डार्क चारकोल डॉक)",
    nameEnglish: "Dark Charcoal Floating Dock",
    appName: "Spotify / Linear",
    descriptionHindi: "गहरे डार्क बैकग्राउंड पर तैरता हुआ डॉक, गोल्ड/ऐम्बर एक्टिव इंडिकेटर",
    tag: "डार्क मोड (Spotify)",
  },
  {
    id: "instagram_minimal",
    nameHindi: "Instagram / Threads (क्लीन मिनिमल)",
    nameEnglish: "Pure Minimal Edge Flat",
    appName: "Instagram / Meta",
    descriptionHindi: "शून्य अतिरिक्त बॉर्डर, 100% सपाट फ्लैट, साफ़ सफेद बैकग्राउंड",
    tag: "मिनिमल (Instagram)",
  },
  {
    id: "capsule_segmented",
    nameHindi: "कैप्सूल सेग्मेंटेड रिबन (Capsule Ribbon)",
    nameEnglish: "Segmented Control Ribbon",
    appName: "macOS / iPadOS",
    descriptionHindi: "सेग्मेंटेड कंट्रोलर पट्टी, प्रत्येक टैब के बीच स्पष्ट विभाजन व स्मूथ स्विचिंग",
    tag: "सेग्मेंटेड (macOS)",
  },
  {
    id: "modern_floating",
    nameHindi: "मॉडर्न फ्लोटिंग बार (Modern Island)",
    nameEnglish: "Elevated Floating Bar",
    appName: "Airbnb / Arc",
    descriptionHindi: "स्क्रीन से ऊपर उठी हुई चौड़ी पट्टी, कर्व्ड कॉर्नर्स व प्रीमियम ड्रॉप शैडो",
    tag: "फ्लोटिंग आइलैंड",
  },
];

export const TAB_CONFIG_KEY = "sm_tab_navigation_full_config";

export const DEFAULT_TAB_CONFIG: TabConfig = {
  // Default as requested by user:
  // "जहा tabs के नाम आते हैं वहां Icon न आए icon तभी आए जब decstop चल रहा हो"
  iconVisibility: "desktop_only",
  nameSize: "md",
  nameWeight: "bold",
  nameFormat: "short",
  stripPreset: "water_clear_pill",
  stripHeight: "standard",
  stripOpacity: "frosted",
  stripRadius: "full",
  activeIndicator: "pill_fill",
};

export function getStoredTabConfig(): TabConfig {
  try {
    const saved = localStorage.getItem(TAB_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return {
          iconVisibility: parsed.iconVisibility || "desktop_only",
          nameSize: parsed.nameSize || "md",
          nameWeight: parsed.nameWeight || "bold",
          nameFormat: parsed.nameFormat || "short",
          stripPreset: parsed.stripPreset || "water_clear_pill",
          stripHeight: parsed.stripHeight || "standard",
          stripOpacity: parsed.stripOpacity || "frosted",
          stripRadius: parsed.stripRadius || "full",
          activeIndicator: parsed.activeIndicator || "pill_fill",
        };
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_TAB_CONFIG;
}

export function saveTabConfig(config: TabConfig): void {
  try {
    localStorage.setItem(TAB_CONFIG_KEY, JSON.stringify(config));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("tab_config_updated", { detail: config }));
    }
  } catch {
    // ignore
  }
}

/**
 * Returns icon display classes based on user rule:
 * "जहा tabs के नाम आते हैं वहां Icon न आए icon तभी आए जब decstop चल रहा हो"
 */
export function getTabIconDisplayClasses(
  visibility: TabIconVisibility = "desktop_only",
  isActive: boolean = false
): {
  iconWrapperClass: string;
  shouldRenderOnMobile: boolean;
  shouldRenderOnDesktop: boolean;
} {
  switch (visibility) {
    case "desktop_only":
      // Mobile: Hidden, Desktop (sm and above): inline-flex
      return {
        iconWrapperClass: "hidden sm:inline-flex shrink-0 transition-transform duration-200",
        shouldRenderOnMobile: false,
        shouldRenderOnDesktop: true,
      };
    case "never":
      return {
        iconWrapperClass: "hidden",
        shouldRenderOnMobile: false,
        shouldRenderOnDesktop: false,
      };
    case "always":
      return {
        iconWrapperClass: "inline-flex shrink-0 transition-transform duration-200",
        shouldRenderOnMobile: true,
        shouldRenderOnDesktop: true,
      };
    case "active_only":
      return {
        iconWrapperClass: isActive
          ? "inline-flex shrink-0 transition-transform duration-200"
          : "hidden sm:inline-flex shrink-0 transition-transform duration-200",
        shouldRenderOnMobile: isActive,
        shouldRenderOnDesktop: true,
      };
  }
}

/**
 * Returns tab name typography classes
 */
export function getTabNameTypographyClasses(
  size: TabNameSize = "md",
  weight: TabNameWeight = "bold"
): string {
  // Font Size
  let sizeClass = "text-xs";
  switch (size) {
    case "xs":
      sizeClass = "text-[9.5px] sm:text-[10px]";
      break;
    case "sm":
      sizeClass = "text-[10.5px] sm:text-[11.5px]";
      break;
    case "md":
      sizeClass = "text-[11.5px] sm:text-[13px]";
      break;
    case "lg":
      sizeClass = "text-[13px] sm:text-[14.5px]";
      break;
    case "xl":
      sizeClass = "text-[14.5px] sm:text-[16px]";
      break;
  }

  // Font Weight
  let weightClass = "font-bold";
  switch (weight) {
    case "medium":
      weightClass = "font-medium";
      break;
    case "bold":
      weightClass = "font-bold";
      break;
    case "extrabold":
      weightClass = "font-black tracking-tight";
      break;
  }

  return `${sizeClass} ${weightClass} whitespace-nowrap leading-tight transition-all`;
}

/**
 * Returns tab strip container and button classes
 */
export function getTabStripClasses(customConfig?: Partial<TabConfig>): {
  containerWrapperClasses: string;
  stripInnerClasses: string;
  tabButtonClasses: (isActive: boolean) => string;
  isDark: boolean;
} {
  const cfg = {
    ...getStoredTabConfig(),
    ...customConfig,
  };

  const isDark = cfg.stripPreset === "spotify_linear_dock" || cfg.stripOpacity === "dark";

  // Height / Padding mapping
  let paddingClass = "p-1 sm:p-1.5";
  let btnPaddingClass = "px-2.5 py-1.5 sm:px-3 sm:py-1.5";
  switch (cfg.stripHeight) {
    case "compact":
      paddingClass = "p-0.5 sm:p-1";
      btnPaddingClass = "px-2 py-1 sm:px-2.5 sm:py-1";
      break;
    case "comfort":
      paddingClass = "p-1.5 sm:p-2";
      btnPaddingClass = "px-3 py-2 sm:px-3.5 sm:py-2";
      break;
    case "spacious":
      paddingClass = "p-2 sm:p-2.5";
      btnPaddingClass = "px-3.5 py-2.5 sm:px-4 sm:py-2.5";
      break;
    case "standard":
    default:
      paddingClass = "p-1 sm:p-1.5";
      btnPaddingClass = "px-2.5 py-1.5 sm:px-3 sm:py-1.5";
      break;
  }

  // Radius mapping
  let radiusClass = "rounded-full";
  let btnRadiusClass = "rounded-full";
  switch (cfg.stripRadius) {
    case "rounded_2xl":
      radiusClass = "rounded-2xl";
      btnRadiusClass = "rounded-xl";
      break;
    case "flat":
      radiusClass = "rounded-none";
      btnRadiusClass = "rounded-none";
      break;
    case "full":
    default:
      radiusClass = "rounded-full";
      btnRadiusClass = "rounded-full";
      break;
  }

  // Background and opacity mapping
  let bgClass = "bg-white/90 backdrop-blur-xl backdrop-saturate-150 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-stone-950/5";
  if (isDark) {
    bgClass = "bg-stone-950/95 backdrop-blur-xl border border-stone-800 shadow-[0_12px_40px_rgba(0,0,0,0.4)] text-white";
  } else {
    switch (cfg.stripOpacity) {
      case "glass":
        bgClass = "bg-white/65 backdrop-blur-2xl border border-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-stone-950/5";
        break;
      case "solid":
        bgClass = "bg-white border border-stone-200 shadow-lg ring-1 ring-stone-950/5";
        break;
      case "frosted":
      default:
        bgClass = "bg-white/90 backdrop-blur-xl backdrop-saturate-150 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-stone-950/5";
        break;
    }
  }

  // Preset specific adjustments
  let containerWrapperClasses = "fixed bottom-1.5 sm:bottom-2 inset-x-0 z-40 flex justify-center px-1.5 sm:px-3 pointer-events-none";
  let stripInnerClasses = `pointer-events-auto inline-flex items-center ${paddingClass} ${radiusClass} border transition-all duration-200 overflow-x-auto no-scrollbar max-w-full ${bgClass}`;

  if (cfg.stripPreset === "apple_ios_bar") {
    containerWrapperClasses = "fixed bottom-0 inset-x-0 z-40 bg-white/92 backdrop-blur-xl backdrop-saturate-150 border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]";
    stripInnerClasses = `max-w-xl mx-auto flex items-center justify-around px-1 ${paddingClass}`;
    radiusClass = "rounded-none";
    btnRadiusClass = "rounded-xl";
  } else if (cfg.stripPreset === "google_material_bar") {
    containerWrapperClasses = "fixed bottom-0 inset-x-0 z-40 bg-stone-100/95 backdrop-blur-xl border-t border-stone-300 shadow-md";
    stripInnerClasses = `max-w-2xl mx-auto flex items-center justify-around px-2 ${paddingClass}`;
    radiusClass = "rounded-none";
  } else if (cfg.stripPreset === "instagram_minimal") {
    containerWrapperClasses = "fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-100 shadow-[0_-1px_4px_rgba(0,0,0,0.03)]";
    stripInnerClasses = `max-w-md mx-auto flex items-center justify-around px-2 ${paddingClass}`;
    radiusClass = "rounded-none";
  } else if (cfg.stripPreset === "modern_floating") {
    containerWrapperClasses = "fixed bottom-3 inset-x-0 z-40 flex justify-center px-3 pointer-events-none";
    stripInnerClasses = `pointer-events-auto inline-flex items-center ${paddingClass} rounded-2xl border border-stone-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.15)] bg-white/95 backdrop-blur-xl overflow-x-auto no-scrollbar max-w-full`;
    btnRadiusClass = "rounded-xl";
  } else if (cfg.stripPreset === "capsule_segmented") {
    containerWrapperClasses = "fixed bottom-2 inset-x-0 z-40 flex justify-center px-2 pointer-events-none";
    stripInnerClasses = `pointer-events-auto inline-flex items-center ${paddingClass} rounded-full border border-stone-300/80 shadow-md bg-stone-100/90 backdrop-blur-xl p-1 max-w-full overflow-x-auto no-scrollbar`;
    btnRadiusClass = "rounded-full";
  }

  // Tab Button dynamic styling based on active state and indicator
  const tabButtonClasses = (isActive: boolean) => {
    let base = `${btnPaddingClass} ${btnRadiusClass} transition-all duration-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 relative select-none`;

    if (isDark) {
      if (isActive) {
        if (cfg.activeIndicator === "underline_strip") {
          return `${base} text-amber-400 font-black border-b-2 border-amber-400`;
        } else if (cfg.activeIndicator === "top_line") {
          return `${base} text-amber-400 font-black border-t-2 border-amber-400`;
        }
        return `${base} bg-stone-800 text-amber-400 shadow-inner font-extrabold ring-1 ring-amber-400/30`;
      }
      return `${base} text-stone-400 hover:text-white hover:bg-stone-900 active:scale-95`;
    }

    if (isActive) {
      if (cfg.activeIndicator === "underline_strip") {
        return `${base} text-amber-700 font-black border-b-[3px] border-amber-500 pb-1`;
      } else if (cfg.activeIndicator === "top_line") {
        return `${base} text-amber-700 font-black border-t-[3px] border-amber-500 pt-1`;
      } else if (cfg.activeIndicator === "subtle_glow") {
        return `${base} bg-amber-100 text-amber-950 font-black shadow-sm ring-1 ring-amber-400 scale-105`;
      }
      // default: pill_fill
      return `${base} bg-amber-500 text-stone-950 shadow-md font-black scale-105 ring-1 ring-amber-600/30`;
    }

    return `${base} text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 active:scale-95`;
  };

  return {
    containerWrapperClasses,
    stripInnerClasses,
    tabButtonClasses,
    isDark,
  };
}
