export type NavButtonStyle =
  | "apple_ios"          // 1. Apple iOS (Safari / iPhone)
  | "google_material"    // 2. Google / YouTube (Material You Tonal)
  | "instagram_flat"     // 3. Instagram / Threads (हाई-कॉन्ट्रास्ट)
  | "whatsapp_meta"      // 4. WhatsApp / Telegram (मैसेंजर हेडर)
  | "spotify_glass"      // 5. Spotify / Netflix (डार्क फ्लोटिंग डिस्क)
  | "airbnb_card"        // 6. Airbnb / Uber (फ्लोटिंग व्हाइट कार्ड)
  | "twitter_splash"     // 7. Twitter / X (सर्कल हवर स्प्लैश)
  | "retro_boxy"         // 8. Retro Web / Brutalist (शार्प 90° बॉक्सी)
  | "plain_ghost"        // 9. बिल्कुल सादा पारदर्शी (Zero Background)
  | "wireframe_outline"  // 10. क्लीन वायरफ्रेम (Thin Border Line)
  | "pill_soft"          // 11. सादा कैप्सूल पिल
  | "editorial_text"     // 12. केवल सादा तीर
  | "soft_stone_card"    // 13. सॉफ्ट न्यूट्रल कार्ड
  | "classic_amber";     // 14. क्लासिक एम्बर

export type NavButtonSize = "compact" | "medium" | "large" | "jumbo";
export type NavButtonOpacity = number;
export type NavButtonBorder = "none" | "thin" | "medium" | "bold";
export type NavButtonEffect = "none" | "subtle" | "scale" | "glow";

export interface NavButtonConfig {
  preset: NavButtonStyle;
  size: NavButtonSize;
  opacity: NavButtonOpacity;
  border: NavButtonBorder;
  effect: NavButtonEffect;
}

export interface NavButtonStyleOption {
  id: NavButtonStyle;
  nameHindi: string;
  nameEnglish: string;
  appName: string;
  descriptionHindi: string;
  isPlain: boolean;
  category: "big_apps" | "minimal" | "classic";
  tag: string;
  iconType?: string;
}

export const NAV_BUTTON_STYLES: NavButtonStyleOption[] = [
  {
    id: "apple_ios",
    nameHindi: "Apple iOS (Safari / iPhone)",
    nameEnglish: "Cupertino Touch",
    appName: "Apple iOS 18",
    descriptionHindi: "क्लीन शेवरॉन, सुरुचिपूर्ण फ्रॉस्टेड टच, iOS जैसा आरामदायक स्पर्श",
    isPlain: true,
    category: "big_apps",
    tag: "iOS 18 (Apple)",
  },
  {
    id: "google_material",
    nameHindi: "Google / YouTube (Material You)",
    nameEnglish: "Material 3 Tonal",
    appName: "Google / YouTube",
    descriptionHindi: "सॉफ्ट टोनल पिल कंटेनर (MD3 Surface chip), आंखों को सुकून देने वाला शेड",
    isPlain: true,
    category: "big_apps",
    tag: "Material 3 (Google)",
  },
  {
    id: "instagram_flat",
    nameHindi: "Instagram / Threads (फ्लैट)",
    nameEnglish: "High Contrast Flat",
    appName: "Instagram / Meta",
    descriptionHindi: "अल्ट्रा-क्लीन बोल्ड तीर, बिना किसी बैकग्राउंड के, शून्य रुकावट",
    isPlain: true,
    category: "big_apps",
    tag: "इंस्टाग्राम (Instagram)",
  },
  {
    id: "whatsapp_meta",
    nameHindi: "WhatsApp / Telegram (मैसेंजर)",
    nameEnglish: "Messenger Header",
    appName: "WhatsApp",
    descriptionHindi: "सर्कुलर स्मूथ टच टारगेट, मैसेजिंग ऐप्स जैसा त्वरित नेविगेशन",
    isPlain: true,
    category: "big_apps",
    tag: "व्हाट्सएप (WhatsApp)",
  },
  {
    id: "spotify_glass",
    nameHindi: "Spotify / Netflix (डार्क डिस्क)",
    nameEnglish: "Dark Floating Disc",
    appName: "Spotify / Netflix",
    descriptionHindi: "डार्क फ्रॉस्टेड डिस्क, सफेद स्पष्ट आइकन, गहरा प्रीमियम लुक",
    isPlain: false,
    category: "big_apps",
    tag: "स्पॉटिफ़ाई (Spotify)",
  },
  {
    id: "airbnb_card",
    nameHindi: "Airbnb / Uber (फ्लोटिंग कार्ड)",
    nameEnglish: "Floating White Card",
    appName: "Airbnb",
    descriptionHindi: "सफेद एलिवेटेड कार्ड, सॉफ्ट सूक्ष्म शैडो और गोल-मटोल सुरुचिपूर्ण आकार",
    isPlain: true,
    category: "big_apps",
    tag: "एयरबीएनबी (Airbnb)",
  },
  {
    id: "twitter_splash",
    nameHindi: "Twitter / X (सर्कल स्प्लैश)",
    nameEnglish: "Circular Tap Ring",
    appName: "X (Twitter)",
    descriptionHindi: "क्लासिक गोल हवर स्प्लैश, मिनिमल और तुरंत उत्तरदायी",
    isPlain: true,
    category: "big_apps",
    tag: "एक्स / ट्विटर (X)",
  },
  {
    id: "retro_boxy",
    nameHindi: "Retro Web / Notion (शार्प बॉक्सी)",
    nameEnglish: "Sharp Brutalist 90°",
    appName: "Retro / Notion",
    descriptionHindi: "शार्प 90° कोने (rounded-none), स्पष्ट बॉर्डर लाइन, मॉडर्न मोनोक्रोम",
    isPlain: true,
    category: "big_apps",
    tag: "शार्प बॉक्सी (Brutalist)",
  },
  {
    id: "plain_ghost",
    nameHindi: "बिल्कुल सादा पारदर्शी (Ghost)",
    nameEnglish: "Minimal Ghost",
    appName: "Clean Web",
    descriptionHindi: "कोई बैकग्राउंड या बॉक्स नहीं, बिल्कुल साफ़ तीर और पारदर्शी रूप",
    isPlain: true,
    category: "minimal",
    tag: "सर्वाधिक सादा (Cleanest)",
  },
  {
    id: "wireframe_outline",
    nameHindi: "हल्का बॉर्डर (Wireframe)",
    nameEnglish: "Clean Wireframe",
    appName: "Linear / Arc",
    descriptionHindi: "बारीक सुरुचिपूर्ण बॉर्डर, सफेद/पारदर्शी बैकग्राउंड",
    isPlain: true,
    category: "minimal",
    tag: "क्रिस्प लाइन (Crisp)",
  },
  {
    id: "pill_soft",
    nameHindi: "सादा कैप्सूल पिल (Soft Pill)",
    nameEnglish: "Soft Pill",
    appName: "Modern Minimal",
    descriptionHindi: "दोनों तरफ से पूरा गोल कैप्सूल, हल्का न्यूट्रल टच",
    isPlain: true,
    category: "minimal",
    tag: "सॉफ्ट पिल (Gentle)",
  },
  {
    id: "editorial_text",
    nameHindi: "केवल सादा तीर (Pure Arrow)",
    nameEnglish: "Pure Editorial Arrow",
    appName: "Editorial",
    descriptionHindi: "बिना किसी बटन बॉक्स के केवल सटीक तीर, अत्यधिक मिनिमल",
    isPlain: true,
    category: "minimal",
    tag: "अल्ट्रा मिनिमल (Ultra)",
  },
  {
    id: "soft_stone_card",
    nameHindi: "सॉफ्ट न्यूट्रल स्क्वेयर (Soft Square)",
    nameEnglish: "Soft Stone Square",
    appName: "Neutral Card",
    descriptionHindi: "हल्के गोल कोनों वाला न्यूट्रल स्टोन बॉक्स (आंखों को नहीं चुभता)",
    isPlain: true,
    category: "minimal",
    tag: "संतुलित (Balanced)",
  },
  {
    id: "classic_amber",
    nameHindi: "क्लासिक एम्बर (Classic Amber)",
    nameEnglish: "Classic Amber Accent",
    appName: "Original App",
    descriptionHindi: "पहले वाला पीला/एम्बर हाईलाइट बटन (तुलना व चमकीलेपन के लिए)",
    isPlain: false,
    category: "classic",
    tag: "ओरिजिनल (Original)",
  },
];

export const NAV_BUTTON_STORAGE_KEY = "sm_nav_button_style_pref";
export const NAV_BUTTON_CONFIG_KEY = "sm_nav_button_full_config";

export const DEFAULT_NAV_BUTTON_CONFIG: NavButtonConfig = {
  preset: "plain_ghost",
  size: "medium",
  opacity: 50,
  border: "thin",
  effect: "none",
};

export function getStoredNavButtonConfig(): NavButtonConfig {
  try {
    const saved = localStorage.getItem(NAV_BUTTON_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return {
          preset: parsed.preset || "plain_ghost",
          size: parsed.size || "medium",
          opacity: typeof parsed.opacity === "number" ? parsed.opacity : 50,
          border: parsed.border || "thin",
          effect: parsed.effect || "none",
        };
      }
    }
  } catch {
    // fallback
  }

  // Fallback to legacy single-key if present
  try {
    const legacy = localStorage.getItem(NAV_BUTTON_STORAGE_KEY) as NavButtonStyle;
    if (legacy && NAV_BUTTON_STYLES.some((s) => s.id === legacy)) {
      return {
        ...DEFAULT_NAV_BUTTON_CONFIG,
        preset: legacy,
      };
    }
  } catch {
    // ignore
  }

  return DEFAULT_NAV_BUTTON_CONFIG;
}

export function saveNavButtonConfig(config: NavButtonConfig): void {
  try {
    localStorage.setItem(NAV_BUTTON_CONFIG_KEY, JSON.stringify(config));
    localStorage.setItem(NAV_BUTTON_STORAGE_KEY, config.preset);
  } catch {
    // ignore
  }
}

export function getStoredNavButtonStyle(): NavButtonStyle {
  return getStoredNavButtonConfig().preset;
}

/**
 * Generates Tailwind CSS classes based on active preset, size, opacity, border, and effect.
 */
export function getNavButtonClasses(
  style: NavButtonStyle,
  type: "back" | "menu" = "back",
  customConfig?: Partial<NavButtonConfig>
): {
  buttonClasses: string;
  iconClasses: string;
  textClasses: string;
  inlineStyle?: React.CSSProperties;
} {
  const currentConfig = {
    ...getStoredNavButtonConfig(),
    preset: style,
    ...customConfig,
  };

  const { size, opacity, border, effect } = currentConfig;

  // 1. Size mapping
  let sizeBtnClasses = "h-9 min-w-[36px] sm:w-auto px-2 sm:px-2.5";
  let iconClasses = "w-4.5 h-4.5 shrink-0";
  let textClasses = "hidden sm:inline text-xs font-semibold tracking-tight";

  switch (size) {
    case "compact":
      sizeBtnClasses = "h-7.5 min-w-[30px] sm:w-auto px-1.5 sm:px-2";
      iconClasses = "w-3.5 h-3.5 shrink-0";
      textClasses = "hidden sm:inline text-[11px] font-semibold tracking-tight";
      break;
    case "large":
      sizeBtnClasses = "h-11 min-w-[44px] sm:w-auto px-3 sm:px-3.5";
      iconClasses = "w-5 h-5 shrink-0";
      textClasses = "hidden sm:inline text-sm font-bold tracking-tight";
      break;
    case "jumbo":
      sizeBtnClasses = "h-13 min-w-[52px] sm:w-auto px-3.5 sm:px-4.5";
      iconClasses = "w-6 h-6 shrink-0";
      textClasses = "hidden sm:inline text-base font-extrabold tracking-tight";
      break;
    case "medium":
    default:
      sizeBtnClasses = "h-9 min-w-[36px] sm:w-auto px-2 sm:px-2.5";
      iconClasses = "w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0";
      textClasses = "hidden sm:inline text-xs font-semibold tracking-tight";
      break;
  }

  // 2. Border mapping (उपयोगकर्ता का अनुरोध: "और कितना करना है एक लाइन भी दे देना")
  let borderClass = "border-0";
  switch (border) {
    case "thin":
      borderClass = "border border-stone-300/80";
      break;
    case "medium":
      borderClass = "border-2 border-stone-400/90";
      break;
    case "bold":
      borderClass = "border-[3px] border-stone-800";
      break;
    case "none":
    default:
      borderClass = "border-0";
      break;
  }

  // 3. Effect mapping (उपयोगकर्ता का अनुरोध: "और effect बगैर भी")
  let effectClass = "transition-none transform-none active:transform-none";
  switch (effect) {
    case "none":
      effectClass = "transition-none transform-none active:transform-none select-none"; // शून्य प्रभाव (No effect)
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

  // 4. Base shape and colors for presets + opacity integration
  let shapeAndColor = "";

  switch (style) {
    case "apple_ios":
      // iOS Cupertino: Rounded-xl or pill with clean chevron, frosted glass
      shapeAndColor = "rounded-xl text-stone-900 hover:text-stone-950 shadow-2xs";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200/40";
      else if (opacity === 25) shapeAndColor += " bg-stone-100/30 backdrop-blur-xs hover:bg-stone-200/50";
      else if (opacity === 50) shapeAndColor += " bg-stone-100/60 backdrop-blur-sm hover:bg-stone-200/70";
      else if (opacity === 75) shapeAndColor += " bg-stone-100/85 backdrop-blur-md hover:bg-stone-200/90";
      else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      break;

    case "google_material":
      // Google / YouTube Material You 3: Tonal rounded-full pill
      shapeAndColor = "rounded-full text-stone-800 hover:text-stone-950";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-300/40";
      else if (opacity === 25) shapeAndColor += " bg-stone-200/30 hover:bg-stone-300/50";
      else if (opacity === 50) shapeAndColor += " bg-stone-200/60 backdrop-blur-xs hover:bg-stone-300/80";
      else if (opacity === 75) shapeAndColor += " bg-stone-200/85 hover:bg-stone-300";
      else shapeAndColor += " bg-stone-200 hover:bg-stone-300";
      break;

    case "instagram_flat":
      // Instagram / Threads: Pure flat high-contrast chevron, minimal background
      shapeAndColor = "rounded-lg text-stone-900 hover:text-black";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-100";
      else if (opacity <= 50) shapeAndColor += " bg-stone-100/50 hover:bg-stone-200/60";
      else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      break;

    case "whatsapp_meta":
      // WhatsApp / Telegram Messenger Header: Circular tap target
      shapeAndColor = "rounded-full text-stone-800 hover:text-stone-950";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-emerald-100/40";
      else if (opacity <= 50) shapeAndColor += " bg-emerald-50/50 hover:bg-emerald-100/70";
      else shapeAndColor += " bg-emerald-50 hover:bg-emerald-100 border-emerald-200/50";
      break;

    case "spotify_glass":
      // Spotify / Netflix: Dark disc, crisp white text/icon
      shapeAndColor = "rounded-full text-white shadow-xs";
      if (opacity === 0) shapeAndColor += " bg-transparent text-stone-900 hover:text-black";
      else if (opacity === 25) shapeAndColor += " bg-stone-900/30 backdrop-blur-xs hover:bg-stone-900/45";
      else if (opacity === 50) shapeAndColor += " bg-stone-900/60 backdrop-blur-sm hover:bg-stone-900/75";
      else if (opacity === 75) shapeAndColor += " bg-stone-900/85 backdrop-blur-md hover:bg-stone-900/95";
      else shapeAndColor += " bg-stone-950 hover:bg-black";
      break;

    case "airbnb_card":
      // Airbnb: Floating elevated white card
      shapeAndColor = "rounded-full text-stone-800 hover:text-stone-950 shadow-sm";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-white/40";
      else if (opacity <= 50) shapeAndColor += " bg-white/60 backdrop-blur-sm hover:bg-white/80";
      else shapeAndColor += " bg-white hover:bg-stone-50";
      break;

    case "twitter_splash":
      // Twitter / X: Circle hover ring
      shapeAndColor = "rounded-full text-stone-800 hover:text-black";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200/60";
      else if (opacity <= 50) shapeAndColor += " bg-stone-200/40 hover:bg-stone-200/70";
      else shapeAndColor += " bg-stone-200 hover:bg-stone-300";
      break;

    case "retro_boxy":
      // Retro Brutalist: Sharp 90° corners, no border-radius
      shapeAndColor = "rounded-none text-stone-950 font-mono shadow-xs";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200";
      else if (opacity <= 50) shapeAndColor += " bg-white/60 hover:bg-white";
      else shapeAndColor += " bg-white hover:bg-stone-100";
      break;

    case "wireframe_outline":
      shapeAndColor = "rounded-xl text-stone-800 hover:text-stone-950 shadow-2xs";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-100/50";
      else if (opacity <= 50) shapeAndColor += " bg-white/50 backdrop-blur-xs hover:bg-white/80";
      else shapeAndColor += " bg-white hover:bg-stone-100";
      break;

    case "pill_soft":
      shapeAndColor = "rounded-full text-stone-800 hover:text-stone-950 shadow-2xs";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200/50";
      else if (opacity <= 50) shapeAndColor += " bg-stone-100/60 backdrop-blur-xs hover:bg-stone-200/80";
      else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      break;

    case "editorial_text":
      shapeAndColor = "rounded-none bg-transparent hover:text-stone-950 text-stone-800";
      break;

    case "soft_stone_card":
      shapeAndColor = "rounded-xl text-stone-800 hover:text-stone-950 shadow-2xs";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200/50";
      else if (opacity <= 50) shapeAndColor += " bg-stone-100/60 backdrop-blur-xs hover:bg-stone-200/80";
      else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      break;

    case "classic_amber":
      if (type === "back") {
        shapeAndColor = "rounded-xl text-stone-950 font-black shadow-xs";
        if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-amber-100";
        else if (opacity <= 50) shapeAndColor += " bg-amber-400/50 hover:bg-amber-400/80";
        else shapeAndColor += " bg-amber-400 hover:bg-amber-300";
      } else {
        shapeAndColor = "rounded-xl text-stone-700 hover:text-stone-950 shadow-2xs";
        if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200/50";
        else if (opacity <= 50) shapeAndColor += " bg-stone-100/60 hover:bg-stone-200/80";
        else shapeAndColor += " bg-stone-100 hover:bg-stone-200";
      }
      break;

    case "plain_ghost":
    default:
      shapeAndColor = "rounded-lg text-stone-800 hover:text-stone-950";
      if (opacity === 0) shapeAndColor += " bg-transparent hover:bg-stone-200/40";
      else if (opacity <= 50) shapeAndColor += " bg-stone-200/30 hover:bg-stone-200/60";
      else shapeAndColor += " bg-stone-200/80 hover:bg-stone-200";
      break;
  }

  // Combine into clean buttonClasses
  const buttonClasses = [
    sizeBtnClasses,
    shapeAndColor,
    borderClass,
    effectClass,
    "flex items-center justify-center gap-1.5 shrink-0 cursor-pointer",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    buttonClasses,
    iconClasses,
    textClasses,
  };
}
