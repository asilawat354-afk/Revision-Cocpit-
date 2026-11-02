export type BigTechEcosystem = 
  | "google_workspace"     // 1. Google Material You & Workspace (Pixel, Keep, Calendar, Drive)
  | "apple_notion"         // 2. Apple iOS 18 + Notion Workspace (SF Pro, Frosted Glass, Minimal Monochrome)
  | "gpay_fintech"         // 3. Google Pay & BHIM UPI (Ultra-Fast 1-Tap Ledger, Sound Chimes, Rewards)
  | "whatsapp_meta"        // 4. WhatsApp & Meta Chat (Status Rings, Audio Memos, Bubble Study Logs)
  | "instagram_creator"    // 5. Instagram Stories & Reels Grid (Daily Highlights, Swipe Review Cards)
  | "linear_obsidian"      // 6. Linear & Obsidian Pro (Cyber Dark 950, Keyboard Velocity, Power Kanban)
  | "duolingo_arena";      // 7. Duolingo Study Arena (XP Streaks, Milestone Pathway, Tactile 3D Buttons)

export interface EcosystemMeta {
  id: BigTechEcosystem;
  name: string;
  shortName: string;
  tagline: string;
  brandColor: string;
  accentBg: string;
  headerBg: string;
  bodyBg: string;
  cardBg: string;
  cardBorder: string;
  cardRadius: string;
  buttonClass: string;
  badgeStyle: string;
  icon: string; // Emoji or representation
  featuresHighlight: string[];
}

export const ECOSYSTEM_LIST: EcosystemMeta[] = [
  {
    id: "google_workspace",
    name: "Google Workspace & Material You",
    shortName: "Google",
    tagline: "Pixel Android 15 & Google Keep जैसी सहजता, Google Sans लेआउट",
    brandColor: "text-blue-600",
    accentBg: "bg-blue-600 text-white",
    headerBg: "bg-white/95 border-b border-blue-100",
    bodyBg: "bg-blue-50/20",
    cardBg: "bg-white",
    cardBorder: "border border-blue-100 shadow-sm",
    cardRadius: "rounded-2xl",
    buttonClass: "rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs",
    badgeStyle: "bg-blue-50 text-blue-700 border border-blue-200",
    icon: "🌐",
    featuresHighlight: ["Google Keep स्टाइल नोट्स", "Calendar टाइमटेबल", "Material 3 पैलेट्स"]
  },
  {
    id: "apple_notion",
    name: "Apple iOS 18 & Notion Studio",
    shortName: "Apple/Notion",
    tagline: "Apple SF Pro टाइपोग्राफी, फ्रॉस्टेड ग्लास और Notion डेटाबेस व्यूज",
    brandColor: "text-stone-900",
    accentBg: "bg-stone-950 text-white",
    headerBg: "bg-stone-50/85 backdrop-blur-2xl border-b border-stone-200/80",
    bodyBg: "bg-[#faf9f6]",
    cardBg: "bg-white/90 backdrop-blur-md",
    cardBorder: "border border-stone-200/70 shadow-xs",
    cardRadius: "rounded-xl",
    buttonClass: "rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold shadow-xs",
    badgeStyle: "bg-stone-100 text-stone-800 border border-stone-200",
    icon: "🍎",
    featuresHighlight: ["Notion Kanban & टेबल व्यू", "Apple हैप्टिक फील", "मिनिमल मोनोक्रोम"]
  },
  {
    id: "gpay_fintech",
    name: "Google Pay & BHIM UPI Fintech",
    shortName: "GPay / UPI",
    tagline: "1-टैप फास्ट पेमेंट जैसी रिवीज़न एंट्री, UPI साउंड चाइम और स्क्रैच कार्ड",
    brandColor: "text-sky-600",
    accentBg: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
    headerBg: "bg-slate-900 text-white border-b border-slate-800",
    bodyBg: "bg-slate-50",
    cardBg: "bg-white",
    cardBorder: "border border-slate-200/90 shadow-md",
    cardRadius: "rounded-2xl",
    buttonClass: "rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-md active:scale-95",
    badgeStyle: "bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold",
    icon: "⚡",
    featuresHighlight: ["UPI स्टाइल 1-टैप मार्क", "ऑडियो सक्सेस चाइम", "रिवॉर्ड स्क्रैच कार्ड"]
  },
  {
    id: "whatsapp_meta",
    name: "WhatsApp & Meta Pulse",
    shortName: "WhatsApp",
    tagline: "व्हाट्सएप स्टेटस रिंग, वॉइस मेमो नोट्स और चैट-बबल रिवीज़न इतिहास",
    brandColor: "text-emerald-700",
    accentBg: "bg-emerald-600 text-white",
    headerBg: "bg-[#075e54] text-white border-b border-[#054c44]",
    bodyBg: "bg-[#efeae2]/40",
    cardBg: "bg-white",
    cardBorder: "border border-emerald-100 shadow-xs",
    cardRadius: "rounded-2xl",
    buttonClass: "rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white font-bold shadow-md",
    badgeStyle: "bg-emerald-100 text-emerald-900 border border-emerald-300",
    icon: "💬",
    featuresHighlight: ["स्टेटस स्टोरी रिंग्स", "चैट बबल नोट्स", "ऑडियो वॉइस मेमो"]
  },
  {
    id: "instagram_creator",
    name: "Instagram Stories & Visual Grid",
    shortName: "Instagram",
    tagline: "स्टोरी हाइलाइट्स, स्वाइप फ्लैशकार्ड और वाइब्रेंट ग्रेडिएंट विजुअल्स",
    brandColor: "text-rose-600",
    accentBg: "bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white",
    headerBg: "bg-white/95 backdrop-blur-xl border-b border-stone-200",
    bodyBg: "bg-stone-50",
    cardBg: "bg-white",
    cardBorder: "border border-stone-200/80 shadow-xs",
    cardRadius: "rounded-2xl",
    buttonClass: "rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold shadow-sm",
    badgeStyle: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: "📸",
    featuresHighlight: ["डेली स्टोरी रील्स", "स्वाइप रिव्यू कार्ड", "वाइब्रेंट ग्रेडिएंट्स"]
  },
  {
    id: "linear_obsidian",
    name: "Linear & Obsidian Cyber-Pro",
    shortName: "Linear Pro",
    tagline: "डार्क साइबर मोड, कीबोर्ड वेलोसिटी और इंजीनियरिंग-ग्रेड परिशुद्धता",
    brandColor: "text-purple-400",
    accentBg: "bg-purple-600 text-white",
    headerBg: "bg-stone-950 text-white border-b border-stone-800",
    bodyBg: "bg-stone-950 text-stone-100",
    cardBg: "bg-stone-900/90 text-stone-100",
    cardBorder: "border border-stone-800/80 shadow-md",
    cardRadius: "rounded-xl",
    buttonClass: "rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold font-mono text-xs",
    badgeStyle: "bg-stone-800 text-purple-300 border border-purple-500/30 font-mono",
    icon: "🟣",
    featuresHighlight: ["अल्ट्रा-डार्क 950 थीम", "कमांड लाइन स्पीड", "मोनोस्पेस मैट्रिक्स"]
  },
  {
    id: "duolingo_arena",
    name: "Duolingo Study Arena",
    shortName: "Duolingo",
    tagline: "गेमिफाइड 3D टैक्टाइल बटन्स, XP स्ट्रीक्स और माइलस्टोन क्वेस्ट पाथ",
    brandColor: "text-emerald-600",
    accentBg: "bg-[#58cc02] text-white",
    headerBg: "bg-white border-b-2 border-stone-200",
    bodyBg: "bg-amber-50/30",
    cardBg: "bg-white",
    cardBorder: "border-2 border-stone-200 shadow-sm",
    cardRadius: "rounded-2xl",
    buttonClass: "rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 shadow-md",
    badgeStyle: "bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-black",
    icon: "🦉",
    featuresHighlight: ["3D बाउंस बटन्स", "XP स्ट्रीक रिवॉर्ड", "क्वेस्ट पाथ"]
  }
];

export const getEcosystem = (id: BigTechEcosystem): EcosystemMeta => {
  return ECOSYSTEM_LIST.find((e) => e.id === id) || ECOSYSTEM_LIST[0];
};
