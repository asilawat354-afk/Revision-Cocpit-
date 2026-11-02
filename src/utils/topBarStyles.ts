import React from "react";

export type TopBarStyle =
  | "apple_ios"          // Apple iOS 18 Safari Frosted Blur
  | "google_material"    // Google / YouTube Material 3 Surface
  | "instagram_minimal"  // Instagram / Threads Edge-to-Edge Pure Flat
  | "spotify_dark"       // Spotify / Netflix Dark Frosted Glass
  | "whatsapp_meta"      // WhatsApp Clean Messenger Header
  | "airbnb_floating"    // Airbnb Detached Floating Island
  | "retro_boxy"         // Retro Web / Notion Brutalist Sharp
  | "water_glass";       // 100% Water Clear Glass

export type TopBarHeight = "compact" | "standard" | "comfort" | "spacious";
export type TopBarOpacity = number;
export type TopBarBlur = "none" | "light" | "medium" | "heavy";
export type TopBarBorder = "none" | "thin" | "medium" | "bold";
export type TopBarShadow = "none" | "subtle" | "elevated" | "glow";
export type TopBarLayout = "full_width" | "floating_island";

// Top Ribbon / Strip ("Top की पट्टी") Options
export type TopStripStyle = 
  | "amber_gold"    // ऐम्बर गोल्ड प्रीमियम पट्टी (Default)
  | "rainbow"       // मल्टीकलर प्रिज्मीय रेनबो स्ट्रिप
  | "neon_glow"     // साइबर नियॉन इलेक्ट्रो लाइट
  | "sunset"        // सनसेट कोरल ग्रेडिएंट स्ट्रिप
  | "emerald"       // एमराल्ड ग्रीन फोकस स्ट्रिप
  | "frosted_glass" // स्लीक फ्रॉस्टेड ग्लास रिबन
  | "minimal_stone" // न्यूट्रल मिनिमल डिवाइडर
  | "none";         // शून्य (पट्टी छिपाएं)

export type TopStripPosition = "top" | "bottom" | "both";
export type TopStripThickness = "1px" | "2px" | "3px" | "4px" | "6px";
export type TopStripAnimation = "none" | "shimmer" | "pulse";

export interface TopBarConfig {
  preset: TopBarStyle;
  height: TopBarHeight;
  opacity: TopBarOpacity;
  blur: TopBarBlur;
  border: TopBarBorder;
  shadow: TopBarShadow;
  layout: TopBarLayout;
  // Top Strip ("Top की पट्टी")
  stripStyle: TopStripStyle;
  stripPosition: TopStripPosition;
  stripThickness: TopStripThickness;
  stripAnimation: TopStripAnimation;
  showEcoStrip: boolean;
}

export interface TopBarStyleOption {
  id: TopBarStyle;
  nameHindi: string;
  nameEnglish: string;
  appName: string;
  descriptionHindi: string;
  category: "big_apps" | "minimal" | "modern";
  tag: string;
}

export const TOP_BAR_STYLES: TopBarStyleOption[] = [
  {
    id: "apple_ios",
    nameHindi: "Apple iOS (Safari / iPhone)",
    nameEnglish: "Cupertino Frosted Blur",
    appName: "Apple iOS 18",
    descriptionHindi: "अल्ट्रा-फ्रॉस्टेड ग्लास, सुरुचिपूर्ण 1px हेयरलाइन बॉर्डर और सूक्ष्म शैडो",
    category: "big_apps",
    tag: "iOS 18 (Apple)",
  },
  {
    id: "google_material",
    nameHindi: "Google / YouTube (Material You 3)",
    nameEnglish: "Material 3 Surface",
    appName: "Google / YouTube",
    descriptionHindi: "टोनल न्यूट्रल सरफेस, सौम्य एलिवेशन, Android 14 का आधिकारिक लुक",
    category: "big_apps",
    tag: "Material 3 (Google)",
  },
  {
    id: "instagram_minimal",
    nameHindi: "Instagram / Threads (प्योर मिनिमल)",
    nameEnglish: "Edge-to-Edge Pure Flat",
    appName: "Instagram / Meta",
    descriptionHindi: "शून्य बॉर्डर, 100% सपाट फ्लैट, साफ़ सफेद बैकग्राउंड, केवल जरूरी स्पेसिंग",
    category: "big_apps",
    tag: "इंस्टाग्राम (Instagram)",
  },
  {
    id: "spotify_dark",
    nameHindi: "Spotify / Netflix (डार्क चारकोल ग्लास)",
    nameEnglish: "Dark Charcoal Island",
    appName: "Spotify / Netflix",
    descriptionHindi: "गहरा डार्क फ्रॉस्टेड हेडर, सफेद स्पष्ट टेक्स्ट, सिनेमाई प्रीमियम लुक",
    category: "big_apps",
    tag: "स्पॉटिफ़ाई (Spotify)",
  },
  {
    id: "whatsapp_meta",
    nameHindi: "WhatsApp / Telegram (क्लीन हेडर)",
    nameEnglish: "Messenger Clean Header",
    appName: "WhatsApp",
    descriptionHindi: "मैसेंजर ऐप्स जैसा क्लीन, विश्वसनीय और स्मूथ हेडर लेआउट",
    category: "big_apps",
    tag: "व्हाट्सएप (WhatsApp)",
  },
  {
    id: "airbnb_floating",
    nameHindi: "Airbnb (फ्लोटिंग आइलैंड हेडर)",
    nameEnglish: "Floating Detached Island",
    appName: "Airbnb / Uber",
    descriptionHindi: "स्क्रीन से अलग तैरता हुआ फ्लोटिंग कार्ड, गोल किनारे और सुरुचिपूर्ण शैडो",
    category: "big_apps",
    tag: "एयरबीएनबी (Airbnb)",
  },
  {
    id: "retro_boxy",
    nameHindi: "Retro Web / Notion (शार्प बॉक्सी)",
    nameEnglish: "Sharp Brutalist 90°",
    appName: "Retro / Notion",
    descriptionHindi: "शार्प 90° कोने, क्रिस्प 2px डार्क बॉर्डर, विंटेज व सॉलिड लुक",
    category: "minimal",
    tag: "शार्प बॉक्सी (Brutalist)",
  },
  {
    id: "water_glass",
    nameHindi: "वॉटर क्लियर ग्लास (Water Glass)",
    nameEnglish: "Ultra Clear Water Glass",
    appName: "Modern UI",
    descriptionHindi: "100% पारदर्शी, केवल जरूरी आइकन व शीर्षक, शून्य भारीपन",
    category: "minimal",
    tag: "वॉटर ग्लास (Clear)",
  },
];

export interface TopStripStyleOption {
  id: TopStripStyle;
  nameHindi: string;
  nameEnglish: string;
  gradientClass: string;
  descriptionHindi: string;
}

export const TOP_STRIP_STYLES: TopStripStyleOption[] = [
  {
    id: "amber_gold",
    nameHindi: "ऐम्बर गोल्ड (Amber Gold Ribbon)",
    nameEnglish: "Amber Gold Accent",
    gradientClass: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600",
    descriptionHindi: "ऐम्बर व गोल्ड का रॉयल कॉम्बिनेशन, प्रीमियम बिग-टेक लुक",
  },
  {
    id: "rainbow",
    nameHindi: "रेनबो प्रिज्मा (Rainbow Aura)",
    nameEnglish: "Rainbow Prismatic Spectrum",
    gradientClass: "bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-sky-400 to-violet-600",
    descriptionHindi: "Apple व Google जैसा सतरंगी मल्टीकलर प्रिज्मीय स्ट्रिप",
  },
  {
    id: "neon_glow",
    nameHindi: "साइबर नियॉन (Cyber Glow)",
    nameEnglish: "Cyan & Magenta Neon",
    gradientClass: "bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]",
    descriptionHindi: "इलेक्ट्रिफाइंग नियॉन चमक, हाई-टेक फ्यूचरिस्टिक लुक",
  },
  {
    id: "sunset",
    nameHindi: "सनसेट कोरल (Sunset Coral)",
    nameEnglish: "Warm Sunset Flare",
    gradientClass: "bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300",
    descriptionHindi: "गर्म नारंगी व कोरल का मनमोहक सूर्यास्त ग्रेडिएंट",
  },
  {
    id: "emerald",
    nameHindi: "एमराल्ड फोकस (Emerald Calm)",
    nameEnglish: "Deep Forest Emerald",
    gradientClass: "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500",
    descriptionHindi: "शांत हरा व टील, फोकस और आंखों को आराम देने वाली पट्टी",
  },
  {
    id: "frosted_glass",
    nameHindi: "फ्रॉस्टेड ग्लास (Frosted Silver)",
    nameEnglish: "Subtle Glass Border",
    gradientClass: "bg-gradient-to-r from-white/20 via-white/80 to-white/20 dark:from-white/10 dark:via-white/30 dark:to-white/10",
    descriptionHindi: "सिल्वर ग्लास रिबन, अत्यधिक सुरुचिपूर्ण और न्यूनतम",
  },
  {
    id: "minimal_stone",
    nameHindi: "मिनिमल स्टोन (Neutral Border)",
    nameEnglish: "Neutral Border Line",
    gradientClass: "bg-stone-300 dark:bg-stone-700",
    descriptionHindi: "साधारण न्यूट्रल डिवाइडर पट्टी, बिना किसी चमक के सादगी",
  },
  {
    id: "none",
    nameHindi: "शून्य पट्टी (No Strip)",
    nameEnglish: "Hidden Strip",
    gradientClass: "hidden",
    descriptionHindi: "कोई पट्टी नहीं, क्लीन हेडर लुक",
  },
];

export const TOP_BAR_CONFIG_KEY = "sm_top_bar_full_config";

export const DEFAULT_TOP_BAR_CONFIG: TopBarConfig = {
  preset: "apple_ios",
  height: "standard",
  opacity: 85,
  blur: "medium",
  border: "thin",
  shadow: "subtle",
  layout: "full_width",
  stripStyle: "amber_gold",
  stripPosition: "bottom",
  stripThickness: "2px",
  stripAnimation: "none",
  showEcoStrip: true,
};

export function getStoredTopBarConfig(): TopBarConfig {
  try {
    const saved = localStorage.getItem(TOP_BAR_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return {
          preset: parsed.preset || "apple_ios",
          height: parsed.height || "standard",
          opacity: typeof parsed.opacity === "number" ? parsed.opacity : 85,
          blur: parsed.blur || "medium",
          border: parsed.border || "thin",
          shadow: parsed.shadow || "subtle",
          layout: parsed.layout || "full_width",
          stripStyle: parsed.stripStyle || "amber_gold",
          stripPosition: parsed.stripPosition || "bottom",
          stripThickness: parsed.stripThickness || "2px",
          stripAnimation: parsed.stripAnimation || "none",
          showEcoStrip: typeof parsed.showEcoStrip === "boolean" ? parsed.showEcoStrip : true,
        };
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_TOP_BAR_CONFIG;
}

/**
 * Returns CSS classes for the Top Strip ribbon
 */
export function getTopStripClasses(customConfig?: Partial<TopBarConfig>): {
  stripClasses: string;
  isVisible: boolean;
  position: TopStripPosition;
} {
  const cfg = {
    ...getStoredTopBarConfig(),
    ...customConfig,
  };

  if (cfg.stripStyle === "none") {
    return { stripClasses: "hidden", isVisible: false, position: cfg.stripPosition };
  }

  const option = TOP_STRIP_STYLES.find((s) => s.id === cfg.stripStyle) || TOP_STRIP_STYLES[0];

  // Thickness
  let heightClass = "h-[2px]";
  switch (cfg.stripThickness) {
    case "1px":
      heightClass = "h-[1px]";
      break;
    case "2px":
      heightClass = "h-[2px]";
      break;
    case "3px":
      heightClass = "h-[3px]";
      break;
    case "4px":
      heightClass = "h-[4px]";
      break;
    case "6px":
      heightClass = "h-[6px]";
      break;
  }

  // Animation
  let animClass = "";
  if (cfg.stripAnimation === "pulse") {
    animClass = "animate-pulse";
  } else if (cfg.stripAnimation === "shimmer") {
    animClass = "animate-[shimmer_2s_infinite]";
  }

  const stripClasses = `w-full ${heightClass} ${option.gradientClass} ${animClass} shrink-0 transition-all duration-300`;

  return {
    stripClasses,
    isVisible: true,
    position: cfg.stripPosition,
  };
}

export function saveTopBarConfig(config: TopBarConfig): void {
  try {
    localStorage.setItem(TOP_BAR_CONFIG_KEY, JSON.stringify(config));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("top_bar_config_updated", { detail: config }));
    }
  } catch {
    // ignore
  }
}

/**
 * Returns Tailwind classes for the Top Bar header container and contents
 */
export function getTopBarClasses(
  customConfig?: Partial<TopBarConfig>
): {
  headerClasses: string;
  innerClasses: string;
  minHeightClass: string;
  isDark: boolean;
} {
  const currentConfig = {
    ...getStoredTopBarConfig(),
    ...customConfig,
  };

  const { preset, height, opacity, blur, border, shadow, layout } = currentConfig;
  const isDark = preset === "spotify_dark";

  // 1. Height mapping
  let minHeightClass = "min-h-[50px] py-1";
  switch (height) {
    case "compact":
      minHeightClass = "min-h-[42px] py-0.5";
      break;
    case "comfort":
      minHeightClass = "min-h-[58px] py-1.5";
      break;
    case "spacious":
      minHeightClass = "min-h-[66px] py-2";
      break;
    case "standard":
    default:
      minHeightClass = "min-h-[50px] py-1";
      break;
  }

  // 2. Blur mapping
  let blurClass = "backdrop-blur-md backdrop-saturate-150";
  switch (blur) {
    case "none":
      blurClass = "backdrop-blur-none";
      break;
    case "light":
      blurClass = "backdrop-blur-xs";
      break;
    case "medium":
      blurClass = "backdrop-blur-md backdrop-saturate-150";
      break;
    case "heavy":
      blurClass = "backdrop-blur-xl backdrop-saturate-200";
      break;
  }

  // 3. Border mapping
  let borderClass = "border-b border-stone-200/70";
  if (layout === "floating_island") {
    switch (border) {
      case "none":
        borderClass = "border-0";
        break;
      case "thin":
        borderClass = isDark ? "border border-white/15" : "border border-stone-200/90";
        break;
      case "medium":
        borderClass = isDark ? "border-2 border-white/30" : "border-2 border-stone-300";
        break;
      case "bold":
        borderClass = isDark ? "border-[3px] border-white/50" : "border-[3px] border-stone-800";
        break;
    }
  } else {
    switch (border) {
      case "none":
        borderClass = "border-b-0";
        break;
      case "thin":
        borderClass = isDark ? "border-b border-white/10" : "border-b border-stone-200/70";
        break;
      case "medium":
        borderClass = isDark ? "border-b-2 border-white/20" : "border-b-2 border-stone-300/90";
        break;
      case "bold":
        borderClass = isDark ? "border-b-[3px] border-amber-400" : "border-b-[3px] border-stone-800";
        break;
    }
  }

  // 4. Shadow mapping
  let shadowClass = "shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]";
  switch (shadow) {
    case "none":
      shadowClass = "shadow-none";
      break;
    case "subtle":
      shadowClass = "shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]";
      break;
    case "elevated":
      shadowClass = isDark ? "shadow-2xl shadow-black/60" : "shadow-md shadow-stone-900/10";
      break;
    case "glow":
      shadowClass = isDark ? "shadow-[0_4px_20px_rgba(251,191,36,0.15)]" : "shadow-[0_4px_20px_rgba(217,119,6,0.12)]";
      break;
  }

  // 5. Opacity & Base Color mapping
  let bgClass = "";
  if (isDark) {
    if (opacity === 0) bgClass = "bg-transparent text-white";
    else if (opacity <= 30) bgClass = "bg-stone-950/30 text-white";
    else if (opacity <= 60) bgClass = "bg-stone-950/60 text-white";
    else if (opacity <= 85) bgClass = "bg-stone-950/85 text-white";
    else bgClass = "bg-stone-950 text-white";
  } else {
    switch (preset) {
      case "apple_ios":
        if (opacity === 0) bgClass = "bg-transparent text-stone-900";
        else if (opacity <= 30) bgClass = "bg-stone-50/30 sm:bg-white/30 text-stone-900";
        else if (opacity <= 60) bgClass = "bg-stone-50/60 sm:bg-white/60 text-stone-900";
        else if (opacity <= 85) bgClass = "bg-stone-50/85 sm:bg-white/85 text-stone-900";
        else bgClass = "bg-stone-50 sm:bg-white text-stone-900";
        break;
      case "google_material":
        if (opacity === 0) bgClass = "bg-transparent text-stone-900";
        else if (opacity <= 30) bgClass = "bg-stone-100/30 text-stone-900";
        else if (opacity <= 60) bgClass = "bg-stone-100/65 text-stone-900";
        else if (opacity <= 85) bgClass = "bg-stone-100/90 text-stone-900";
        else bgClass = "bg-stone-100 text-stone-900";
        break;
      case "instagram_minimal":
        if (opacity === 0) bgClass = "bg-transparent text-black";
        else if (opacity <= 50) bgClass = "bg-white/70 text-black";
        else bgClass = "bg-white text-black";
        break;
      case "whatsapp_meta":
        if (opacity === 0) bgClass = "bg-transparent text-stone-900";
        else if (opacity <= 60) bgClass = "bg-stone-50/70 sm:bg-white/70 text-stone-900";
        else bgClass = "bg-white text-stone-900";
        break;
      case "airbnb_floating":
        if (opacity === 0) bgClass = "bg-transparent text-stone-900";
        else if (opacity <= 60) bgClass = "bg-white/70 text-stone-900";
        else bgClass = "bg-white text-stone-900";
        break;
      case "retro_boxy":
        if (opacity === 0) bgClass = "bg-transparent text-stone-950";
        else if (opacity <= 60) bgClass = "bg-stone-100/70 text-stone-950";
        else bgClass = "bg-stone-100 text-stone-950";
        break;
      case "water_glass":
      default:
        if (opacity === 0) bgClass = "bg-transparent text-stone-900";
        else if (opacity <= 30) bgClass = "bg-white/20 text-stone-900";
        else if (opacity <= 60) bgClass = "bg-white/50 text-stone-900";
        else if (opacity <= 85) bgClass = "bg-white/80 text-stone-900";
        else bgClass = "bg-white text-stone-900";
        break;
    }
  }

  // Layout classes
  let headerClasses = "";
  let innerClasses = "";

  if (layout === "floating_island") {
    headerClasses = "sticky top-2 z-40 px-2 sm:px-4 pointer-events-none transition-all";
    innerClasses = `pointer-events-auto max-w-7xl mx-auto px-3 sm:px-6 rounded-2xl sm:rounded-3xl ${bgClass} ${blurClass} ${borderClass} ${shadowClass} transition-all`;
  } else {
    headerClasses = `sticky top-0 z-40 ${bgClass} ${blurClass} ${borderClass} ${shadowClass} transition-all`;
    innerClasses = "max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8";
  }

  return {
    headerClasses,
    innerClasses,
    minHeightClass,
    isDark,
  };
}
