import React from "react";

export type TopIconStyle =
  | "apple_ios"          // Apple iOS Cupertino Pill/Glass
  | "google_material"    // Google / YouTube Material 3 Tonal Chip
  | "instagram_flat"     // Instagram / Threads High-Contrast Flat
  | "whatsapp_meta"      // WhatsApp / Meta Circular Touch Target
  | "spotify_glass"      // Spotify / Netflix Dark Disc
  | "airbnb_card"        // Airbnb / Uber Floating White Pill
  | "retro_boxy"         // Retro Web / Notion Sharp 90°
  | "plain_ghost"        // सादा पारदर्शी (Zero Background)
  | "wireframe_outline"  // हल्का बॉर्डर (Wireframe 1px)
  | "pill_soft"          // सादा कैप्सूल पिल
  | "classic_amber";     // क्लासिक एम्बर

export type TopIconSize = "compact" | "medium" | "large" | "jumbo";
export type TopIconOpacity = number;
export type TopIconBorder = "none" | "thin" | "medium" | "bold";
export type TopIconEffect = "none" | "subtle" | "scale" | "glow";
export type TopIconLabelDisplay = "desktop_only" | "always" | "icons_only";

export interface TopIconConfig {
  preset: TopIconStyle;
  size: TopIconSize;
  opacity: TopIconOpacity;
  border: TopIconBorder;
  effect: TopIconEffect;
  labelDisplay: TopIconLabelDisplay;
}

export interface TopIconStyleOption {
  id: TopIconStyle;
  nameHindi: string;
  nameEnglish: string;
  appName: string;
  descriptionHindi: string;
  category: "big_apps" | "minimal" | "classic";
  tag: string;
}

export const TOP_ICON_STYLES: TopIconStyleOption[] = [
  {
    id: "apple_ios",
    nameHindi: "Apple iOS (Cupertino Glass)",
    nameEnglish: "Cupertino Glass Pill",
    appName: "Apple iOS 18",
    descriptionHindi: "फ्रॉस्टेड ग्लास, सुरुचिपूर्ण 12px रेडियस, सूक्ष्म हवर, iOS जैसा अनुभव",
    category: "big_apps",
    tag: "iOS 18 (Apple)",
  },
  {
    id: "google_material",
    nameHindi: "Google / YouTube (Material You 3)",
    nameEnglish: "Material 3 Tonal Chip",
    appName: "Google / YouTube",
    descriptionHindi: "टोनल राउंडेड-फुल पिल कंटेनर, सौम्य सरफेस कलर, Android 14 स्टाइल",
    category: "big_apps",
    tag: "Material 3 (Google)",
  },
  {
    id: "instagram_flat",
    nameHindi: "Instagram / Threads (हाई-कॉन्ट्रास्ट)",
    nameEnglish: "High Contrast Flat",
    appName: "Instagram / Meta",
    descriptionHindi: "अल्ट्रा-क्लीन मिनिमल आइकन, कोई अतिरिक्त बैकग्राउंड नहीं",
    category: "big_apps",
    tag: "इंस्टाग्राम (Instagram)",
  },
  {
    id: "whatsapp_meta",
    nameHindi: "WhatsApp / Meta (सर्कुलर टच)",
    nameEnglish: "Messenger Circle Target",
    appName: "WhatsApp",
    descriptionHindi: "गोल स्मूथ टच टारगेट, मैसेजिंग ऐप्स जैसा त्वरित व आसान क्लिक",
    category: "big_apps",
    tag: "व्हाट्सएप (WhatsApp)",
  },
  {
    id: "spotify_glass",
    nameHindi: "Spotify / Netflix (डार्क डिस्क)",
    nameEnglish: "Dark Floating Disc",
    appName: "Spotify / Netflix",
    descriptionHindi: "डार्क फ्रॉस्टेड डिस्क, स्पष्ट सफेद आइकन, गहरा प्रीमियम लुक",
    category: "big_apps",
    tag: "स्पॉटिफ़ाई (Spotify)",
  },
  {
    id: "airbnb_card",
    nameHindi: "Airbnb / Uber (फ्लोटिंग कार्ड)",
    nameEnglish: "Floating White Card",
    appName: "Airbnb",
    descriptionHindi: "सफेद एलिवेटेड कार्ड, सूक्ष्म शैडो और गोल सुरुचिपूर्ण आकार",
    category: "big_apps",
    tag: "एयरबीएनबी (Airbnb)",
  },
  {
    id: "retro_boxy",
    nameHindi: "Retro Web / Notion (शार्प बॉक्सी)",
    nameEnglish: "Sharp Brutalist 90°",
    appName: "Retro / Notion",
    descriptionHindi: "शार्प 90° कोने (rounded-none), क्रिस्प बॉर्डर लाइन, मॉडर्न मोनोक्रोम",
    category: "big_apps",
    tag: "शार्प बॉक्सी (Brutalist)",
  },
  {
    id: "plain_ghost",
    nameHindi: "बिल्कुल सादा पारदर्शी (Ghost)",
    nameEnglish: "Minimal Ghost",
    appName: "Clean Web",
    descriptionHindi: "कोई बैकग्राउंड या बॉक्स नहीं, बिल्कुल पारदर्शी और हल्का",
    category: "minimal",
    tag: "सादा (Cleanest)",
  },
  {
    id: "wireframe_outline",
    nameHindi: "हल्का बॉर्डर (Wireframe)",
    nameEnglish: "Clean Wireframe",
    appName: "Linear / Arc",
    descriptionHindi: "बारीक 1px बॉर्डर, ट्रांसपेरेंट बैकग्राउंड, सटीक आउटलाइन",
    category: "minimal",
    tag: "क्रिस्प (Wireframe)",
  },
  {
    id: "pill_soft",
    nameHindi: "सादा कैप्सूल पिल (Soft Pill)",
    nameEnglish: "Soft Capsule Pill",
    appName: "Modern UI",
    descriptionHindi: "दोनों तरफ से गोल कैप्सूल, कोमल न्यूट्रल टच",
    category: "minimal",
    tag: "सॉफ्ट पिल (Gentle)",
  },
  {
    id: "classic_amber",
    nameHindi: "क्लासिक एम्बर (Classic Amber)",
    nameEnglish: "Classic Amber Accent",
    appName: "Original App",
    descriptionHindi: "चमकीला एम्बर हाईलाइट बटन, आंखों को तुरंत आकर्षित करने वाला",
    category: "classic",
    tag: "ओरिजिनल (Amber)",
  },
];

export const TOP_ICON_CONFIG_KEY = "sm_top_icon_full_config";

export const DEFAULT_TOP_ICON_CONFIG: TopIconConfig = {
  preset: "apple_ios",
  size: "medium",
  opacity: 50,
  border: "thin",
  effect: "none",
  labelDisplay: "desktop_only",
};

export function getStoredTopIconConfig(): TopIconConfig {
  try {
    const saved = localStorage.getItem(TOP_ICON_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return {
          preset: parsed.preset || "apple_ios",
          size: parsed.size || "medium",
          opacity: typeof parsed.opacity === "number" ? parsed.opacity : 50,
          border: parsed.border || "thin",
          effect: parsed.effect || "none",
          labelDisplay: parsed.labelDisplay || "desktop_only",
        };
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_TOP_ICON_CONFIG;
}

export function saveTopIconConfig(config: TopIconConfig): void {
  try {
    localStorage.setItem(TOP_ICON_CONFIG_KEY, JSON.stringify(config));
    // Dispatch custom event for instant cross-component updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("top_icon_config_updated", { detail: config }));
    }
  } catch {
    // ignore
  }
}

/**
 * Returns Tailwind classes for top action icons (Search, AI Doubt, Style Switcher, Settings, Vacation)
 */
export function getTopIconClasses(
  customConfig?: Partial<TopIconConfig>
): {
  buttonClasses: string;
  iconClasses: string;
  textClasses: string;
  labelDisplay: TopIconLabelDisplay;
} {
  const currentConfig = {
    ...getStoredTopIconConfig(),
    ...customConfig,
  };

  const { preset, size, opacity, border, effect, labelDisplay } = currentConfig;

  // 1. Size mapping
  let sizeBtnClasses = "h-8.5 min-w-[34px] px-2 sm:px-2.5";
  let iconClasses = "w-4 h-4 shrink-0";
  let textBaseClass = "text-xs font-semibold tracking-tight";

  switch (size) {
    case "compact":
      sizeBtnClasses = "h-7 min-w-[28px] px-1.5 sm:px-2";
      iconClasses = "w-3.5 h-3.5 shrink-0";
      textBaseClass = "text-[10.5px] font-semibold tracking-tight";
      break;
    case "large":
      sizeBtnClasses = "h-10 min-w-[42px] px-3 sm:px-3.5";
      iconClasses = "w-4.5 h-4.5 shrink-0";
      textBaseClass = "text-sm font-bold tracking-tight";
      break;
    case "jumbo":
      sizeBtnClasses = "h-12 min-w-[48px] px-3.5 sm:px-4.5";
      iconClasses = "w-5.5 h-5.5 shrink-0";
      textBaseClass = "text-base font-extrabold tracking-tight";
      break;
    case "medium":
    default:
      sizeBtnClasses = "h-8.5 min-w-[34px] px-2 sm:px-2.5";
      iconClasses = "w-4 h-4 shrink-0";
      textBaseClass = "text-xs font-semibold tracking-tight";
      break;
  }

  // Label display logic
  let textClasses = "hidden sm:inline " + textBaseClass;
  if (labelDisplay === "always") {
    textClasses = "inline " + textBaseClass;
  } else if (labelDisplay === "icons_only") {
    textClasses = "hidden";
  }

  // 2. Border mapping
  let borderClass = "border-0";
  switch (border) {
    case "thin":
      borderClass = "border border-stone-200/90";
      break;
    case "medium":
      borderClass = "border-2 border-stone-400/80";
      break;
    case "bold":
      borderClass = "border-[3px] border-stone-800";
      break;
    case "none":
    default:
      borderClass = "border-0";
      break;
  }

  // 3. Effect mapping (बगैर इफ़ेक्ट विकल्प)
  let effectClass = "transition-none transform-none active:transform-none select-none";
  switch (effect) {
    case "none":
      effectClass = "transition-none transform-none active:transform-none select-none";
      break;
    case "subtle":
      effectClass = "transition-opacity active:opacity-60 duration-75 select-none";
      break;
    case "scale":
      effectClass = "transition-all active:scale-95 duration-100 select-none";
      break;
    case "glow":
      effectClass = "transition-all active:scale-95 hover:shadow-md hover:ring-2 hover:ring-amber-400/40 select-none";
      break;
  }

  // 4. Base shape and colors for presets + opacity
  let shapeAndColor = "";

  switch (preset) {
    case "apple_ios":
      shapeAndColor = "rounded-xl text-stone-800 hover:text-stone-950 shadow-2xs";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200/40";
      else if (opacity === 25) shapeAndColor += " bg-stone-100/30 backdrop-blur-xs hover:bg-stone-200/50";
      else if (opacity === 50) shapeAndColor += " bg-stone-100/60 backdrop-blur-sm hover:bg-stone-200/70";
      else if (opacity === 75) shapeAndColor += " bg-stone-100/85 backdrop-blur-md hover:bg-stone-200/90";
      else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      break;

    case "google_material":
      shapeAndColor = "rounded-full text-stone-800 hover:text-stone-950";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-300/40";
      else if (opacity === 25) shapeAndColor += " bg-stone-200/30 hover:bg-stone-300/50";
      else if (opacity === 50) shapeAndColor += " bg-stone-200/60 backdrop-blur-xs hover:bg-stone-300/80";
      else if (opacity === 75) shapeAndColor += " bg-stone-200/85 hover:bg-stone-300";
      else shapeAndColor += " bg-stone-200 hover:bg-stone-300";
      break;

    case "instagram_flat":
      shapeAndColor = "rounded-lg text-stone-900 hover:text-black";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-100";
      else if (opacity <= 50) shapeAndColor += " bg-stone-100/50 hover:bg-stone-200/60";
      else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      break;

    case "whatsapp_meta":
      shapeAndColor = "rounded-full text-stone-800 hover:text-stone-950";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-emerald-100/40";
      else if (opacity <= 50) shapeAndColor += " bg-emerald-50/50 hover:bg-emerald-100/70";
      else shapeAndColor += " bg-emerald-50 hover:bg-emerald-100 border-emerald-200/50";
      break;

    case "spotify_glass":
      shapeAndColor = "rounded-full text-white shadow-xs";
      if (opacity === 0) shapeAndColor += " bg-transparent text-stone-900 hover:text-black";
      else if (opacity === 25) shapeAndColor += " bg-stone-900/35 backdrop-blur-xs hover:bg-stone-900/50";
      else if (opacity === 50) shapeAndColor += " bg-stone-900/65 backdrop-blur-sm hover:bg-stone-900/80";
      else if (opacity === 75) shapeAndColor += " bg-stone-900/85 backdrop-blur-md hover:bg-stone-900/95";
      else shapeAndColor += " bg-stone-950 hover:bg-black";
      break;

    case "airbnb_card":
      shapeAndColor = "rounded-xl text-stone-900 shadow-2xs";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-white/60";
      else if (opacity <= 50) shapeAndColor += " bg-white/70 backdrop-blur-sm hover:bg-white/90";
      else shapeAndColor += " bg-white hover:bg-stone-50";
      break;

    case "retro_boxy":
      shapeAndColor = "rounded-none text-stone-950 shadow-[1px_1px_0px_rgba(0,0,0,0.8)]";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200";
      else if (opacity <= 50) shapeAndColor += " bg-stone-100/60 hover:bg-stone-200";
      else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      break;

    case "plain_ghost":
      shapeAndColor = "rounded-lg text-stone-700 hover:text-stone-950 bg-transparent hover:bg-stone-150/40";
      break;

    case "wireframe_outline":
      shapeAndColor = "rounded-xl text-stone-800 hover:text-stone-950";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-100";
      else shapeAndColor += " bg-white/70 hover:bg-white";
      break;

    case "pill_soft":
      shapeAndColor = "rounded-full text-stone-800 hover:text-stone-950";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-100";
      else if (opacity <= 50) shapeAndColor += " bg-stone-100/60 hover:bg-stone-200";
      else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      break;

    case "classic_amber":
      shapeAndColor = "rounded-xl text-amber-950 shadow-2xs";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-amber-100/60";
      else if (opacity <= 50) shapeAndColor += " bg-amber-100/60 hover:bg-amber-100/90";
      else shapeAndColor += " bg-amber-100 hover:bg-amber-200";
      break;
  }

  const buttonClasses = `inline-flex items-center justify-center gap-1.5 cursor-pointer font-semibold ${sizeBtnClasses} ${borderClass} ${effectClass} ${shapeAndColor}`;

  return {
    buttonClasses,
    iconClasses,
    textClasses,
    labelDisplay,
  };
}
