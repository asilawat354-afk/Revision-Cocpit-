import React from "react";
import { 
  Compass, 
  Database, 
  CalendarDays, 
  Grid3X3, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  Target, 
  CheckSquare, 
  StickyNote, 
  PlusCircle, 
  Layers, 
  PauseCircle, 
  PlayCircle, 
  Download, 
  Cloud, 
  Sliders, 
  Flame,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { TileSize, CockpitConfig, LectureItem, HomeDashboardConfig } from "../types";
import { ActiveTab } from "../components/Navbar";

export interface FeatureContext {
  lectures: LectureItem[];
  config: CockpitConfig;
  homeConfig: HomeDashboardConfig;
  activeTodayCount: number;
  completedTodayCount: number;
  archivedCount: number;
  masteredCount: number;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenGeminiModal: () => void;
  onOpenDirectory: () => void;
  onOpenAddLecture?: () => void;
  onOpenAppsScriptModal?: () => void;
  onExportCSV?: () => void;
  onToggleVacation?: () => void;
  onOpenExamEditor?: () => void;
  onOpenTasksModal?: () => void;
  onOpenNotesEditor?: () => void;
  onOpenAiPlanModal?: () => void;
}

export interface FeatureDefinition {
  id: string;
  title: string;
  shortTitle: string;
  category: "कोर रिवीज़न" | "लाइब्रेरी" | "योजना व लक्ष्य" | "AI सहायता" | "टूल्स व सेटिंग्स";
  description: string;
  defaultSize: TileSize;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
  };
  getIcon: (ctx: FeatureContext) => React.ReactNode;
  getStatus: (ctx: FeatureContext) => string | undefined;
  getAction: (ctx: FeatureContext) => () => void;
}

export const FEATURE_CATALOG: Record<string, FeatureDefinition> = {
  cockpit: {
    id: "cockpit",
    title: "आज का रिवीज़न कॉकपिट",
    shortTitle: "आज का रिवीज़न",
    category: "कोर रिवीज़न",
    description: "दैनिक 2-Step फाउंडेशन रिवीज़न, टाइमर व कठिनाई रेटिंग",
    defaultSize: "medium",
    colorScheme: {
      bg: "bg-amber-500/10 hover:bg-amber-500/15",
      border: "border-amber-400/40",
      text: "text-amber-950",
      iconBg: "bg-amber-500 text-stone-950",
      iconColor: "text-stone-950",
      badgeBg: "bg-amber-400 text-stone-950 font-bold",
      badgeText: "text-stone-950",
    },
    getIcon: () => <Compass className="w-5 h-5" />,
    getStatus: (ctx) => ctx.activeTodayCount > 0 ? `${ctx.activeTodayCount} रिवीज़न आज` : (ctx.completedTodayCount > 0 ? "✓ आज का कोटा पूरा" : "सब पूरा"),
    getAction: (ctx) => () => ctx.onNavigateTab("cockpit"),
  },

  master_db: {
    id: "master_db",
    title: "सभी लेक्चर्स",
    shortTitle: "सभी लेक्चर्स",
    category: "लाइब्रेरी",
    description: "सभी 21 विषयों के लेक्चर्स, 2-स्टेप फाउंडेशन व रेटिंग",
    defaultSize: "medium",
    colorScheme: {
      bg: "bg-sky-500/10 hover:bg-sky-500/15",
      border: "border-sky-400/40",
      text: "text-sky-950",
      iconBg: "bg-sky-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-sky-100 text-sky-900 border border-sky-300 font-semibold",
      badgeText: "text-sky-900",
    },
    getIcon: () => <Database className="w-5 h-5" />,
    getStatus: (ctx) => `${ctx.lectures.length} कुल लेक्चर्स`,
    getAction: (ctx) => () => ctx.onNavigateTab("master_db"),
  },

  heatmap: {
    id: "heatmap",
    title: "30-दिन कैलेंडर हीटमैप",
    shortTitle: "30-दिन कैलेंडर",
    category: "योजना व लक्ष्य",
    description: "दैनिक लोड, आगामी रिवीज़न व ऑटो-लेवलिंग पूर्वानुमान",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-indigo-500/10 hover:bg-indigo-500/15",
      border: "border-indigo-400/40",
      text: "text-indigo-950",
      iconBg: "bg-indigo-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-indigo-100 text-indigo-900 border border-indigo-200",
      badgeText: "text-indigo-900",
    },
    getIcon: () => <CalendarDays className="w-5 h-5" />,
    getStatus: () => "लोड संतुलन",
    getAction: (ctx) => () => ctx.onNavigateTab("heatmap"),
  },

  audit_grid: {
    id: "audit_grid",
    title: "प्रगति ग्रिड ऑडिट",
    shortTitle: "प्रगति ग्रिड",
    category: "कोर रिवीज़न",
    description: "अध्याय-वार रिवीज़न फ्रीक्वेंसी व मास्टरी स्थिति",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
      border: "border-emerald-400/40",
      text: "text-emerald-950",
      iconBg: "bg-emerald-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-emerald-100 text-emerald-900 border border-emerald-300",
      badgeText: "text-emerald-900",
    },
    getIcon: () => <Grid3X3 className="w-5 h-5" />,
    getStatus: (ctx) => `${ctx.masteredCount} पक्के`,
    getAction: (ctx) => () => ctx.onNavigateTab("audit_grid"),
  },

  debt_vault: {
    id: "debt_vault",
    title: "पुराना बैकलॉग वॉल्ट",
    shortTitle: "बैकलॉग वॉल्ट",
    category: "कोर रिवीज़न",
    description: "सुरक्षित संग्रहीत पुराने लेक्चर्स, 1-टच अन-आर्काइव",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-amber-700/10 hover:bg-amber-700/15",
      border: "border-amber-600/30",
      text: "text-amber-950",
      iconBg: "bg-amber-700 text-white",
      iconColor: "text-white",
      badgeBg: "bg-amber-100 text-amber-950 border border-amber-300 font-bold",
      badgeText: "text-amber-950",
    },
    getIcon: () => <ShieldCheck className="w-5 h-5" />,
    getStatus: (ctx) => `${ctx.archivedCount} सुरक्षित`,
    getAction: (ctx) => () => ctx.onNavigateTab("debt_vault"),
  },

  gemini_doubt: {
    id: "gemini_doubt",
    title: "AI डाउट सॉल्वर व शॉर्ट ट्रिक्स",
    shortTitle: "AI डाउट सॉल्वर",
    category: "AI सहायता",
    description: "वैदिक गणित शॉर्ट ट्रिक्स, कैलकुलेशन विधियाँ व समाधान",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-violet-500/10 hover:bg-violet-500/15",
      border: "border-violet-400/40",
      text: "text-violet-950",
      iconBg: "bg-violet-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-violet-100 text-violet-900 border border-violet-300",
      badgeText: "text-violet-900",
    },
    getIcon: () => <Bot className="w-5 h-5" />,
    getStatus: () => "सक्रिय AI",
    getAction: (ctx) => () => ctx.onOpenGeminiModal(),
  },

  ai_daily_plan: {
    id: "ai_daily_plan",
    title: "जादुई AI दैनिक स्टडी प्लानर",
    shortTitle: "AI स्टडी प्लान",
    category: "AI सहायता",
    description: "सुबह, दोपहर व शाम का संतुलित 3-स्टेप स्मार्ट शेड्यूल",
    defaultSize: "medium",
    colorScheme: {
      bg: "bg-amber-400/15 hover:bg-amber-400/20",
      border: "border-amber-400/50",
      text: "text-stone-900",
      iconBg: "bg-amber-500 text-stone-950",
      iconColor: "text-stone-950",
      badgeBg: "bg-amber-400 text-stone-950 font-bold",
      badgeText: "text-stone-950",
    },
    getIcon: () => <Sparkles className="w-5 h-5" />,
    getStatus: (ctx) => ctx.homeConfig.aiDailyPlan ? ctx.homeConfig.aiDailyPlan.focusTheme : "स्मार्ट प्लानर",
    getAction: (ctx) => () => {
      if (ctx.onOpenAiPlanModal) ctx.onOpenAiPlanModal();
      else ctx.onOpenGeminiModal();
    },
  },

  exam_countdown: {
    id: "exam_countdown",
    title: "लक्ष्य परीक्षा उलटी गिनती टाइमर",
    shortTitle: "परीक्षा टाइमर",
    category: "योजना व लक्ष्य",
    description: "टारगेट परीक्षा के शेष दिन, सप्ताह व डेडलाइन",
    defaultSize: "medium",
    colorScheme: {
      bg: "bg-rose-500/10 hover:bg-rose-500/15",
      border: "border-rose-400/40",
      text: "text-rose-950",
      iconBg: "bg-rose-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-rose-100 text-rose-900 border border-rose-300 font-bold",
      badgeText: "text-rose-900",
    },
    getIcon: () => <Target className="w-5 h-5" />,
    getStatus: (ctx) => {
      const examDate = new Date(ctx.homeConfig.targetExamDate);
      const today = new Date();
      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} दिन शेष` : "परीक्षा आज";
    },
    getAction: (ctx) => () => {
      if (ctx.onOpenExamEditor) ctx.onOpenExamEditor();
    },
  },

  daily_tasks: {
    id: "daily_tasks",
    title: "व्यक्तिगत दैनिक चेकलिस्ट",
    shortTitle: "दैनिक लक्ष्य",
    category: "योजना व लक्ष्य",
    description: "आज के माइक्रो-टास्क, PYQ व रिवीजन चेकलिस्ट",
    defaultSize: "medium",
    colorScheme: {
      bg: "bg-teal-500/10 hover:bg-teal-500/15",
      border: "border-teal-400/40",
      text: "text-teal-950",
      iconBg: "bg-teal-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-teal-100 text-teal-900 border border-teal-300 font-semibold",
      badgeText: "text-teal-900",
    },
    getIcon: () => <CheckSquare className="w-5 h-5" />,
    getStatus: (ctx) => {
      const tasks = ctx.homeConfig.customTasks || [];
      const done = tasks.filter(t => t.isDone).length;
      return `${done}/${tasks.length} पूरे`;
    },
    getAction: (ctx) => () => {
      if (ctx.onOpenTasksModal) ctx.onOpenTasksModal();
    },
  },

  quick_notes: {
    id: "quick_notes",
    title: "फॉर्मूला व त्वरित नोट्स स्क्रैचपैड",
    shortTitle: "क्विक नोट्स",
    category: "टूल्स व सेटिंग्स",
    description: "ऑटो-सेविंग फॉर्मूला शीट व अध्ययन टिप्स",
    defaultSize: "medium",
    colorScheme: {
      bg: "bg-amber-100/60 hover:bg-amber-100/80",
      border: "border-amber-300/60",
      text: "text-amber-950",
      iconBg: "bg-amber-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-amber-200 text-amber-950 font-bold",
      badgeText: "text-amber-950",
    },
    getIcon: () => <StickyNote className="w-5 h-5" />,
    getStatus: () => "ऑटो-सेव",
    getAction: (ctx) => () => {
      if (ctx.onOpenNotesEditor) ctx.onOpenNotesEditor();
    },
  },

  add_lecture: {
    id: "add_lecture",
    title: "नया लेक्चर दर्ज करें",
    shortTitle: "नया लेक्चर",
    category: "कोर रिवीज़न",
    description: "किसी भी विषय में नया लेक्चर जोड़ें",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
      border: "border-emerald-400/40",
      text: "text-emerald-950",
      iconBg: "bg-emerald-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-emerald-100 text-emerald-900 font-semibold",
      badgeText: "text-emerald-900",
    },
    getIcon: () => <PlusCircle className="w-5 h-5" />,
    getStatus: () => "दर्ज करें",
    getAction: (ctx) => () => {
      if (ctx.onOpenAddLecture) ctx.onOpenAddLecture();
      else ctx.onNavigateTab("master_db");
    },
  },

  subject_directory: {
    id: "subject_directory",
    title: "21 विषय व अध्याय डायरेक्टरी",
    shortTitle: "विषय डायरेक्टरी",
    category: "लाइब्रेरी",
    description: "अंकगणित, रीज़निंग, GS, विज्ञान व भाषाएँ",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-blue-500/10 hover:bg-blue-500/15",
      border: "border-blue-400/40",
      text: "text-blue-950",
      iconBg: "bg-blue-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-blue-100 text-blue-900 font-semibold",
      badgeText: "text-blue-900",
    },
    getIcon: () => <Layers className="w-5 h-5" />,
    getStatus: () => "21 विषय",
    getAction: (ctx) => () => ctx.onOpenDirectory(),
  },

  vacation_mode: {
    id: "vacation_mode",
    title: "हॉलिडे / पॉज़ मोड स्विच",
    shortTitle: "पॉज़ मोड",
    category: "टूल्स व सेटिंग्स",
    description: "तारीखें आगे बढ़ाएं, बिना स्ट्रेस ब्रेक लें",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-amber-500/15 hover:bg-amber-500/20",
      border: "border-amber-400/40",
      text: "text-amber-950",
      iconBg: "bg-amber-500 text-stone-950",
      iconColor: "text-stone-950",
      badgeBg: "bg-amber-200 text-amber-950 font-bold",
      badgeText: "text-amber-950",
    },
    getIcon: (ctx) => ctx.config.vacationMode ? <PlayCircle className="w-5 h-5" /> : <PauseCircle className="w-5 h-5" />,
    getStatus: (ctx) => ctx.config.vacationMode ? "चालू (ON)" : "बंद (OFF)",
    getAction: (ctx) => () => {
      if (ctx.onToggleVacation) ctx.onToggleVacation();
    },
  },

  export_backup: {
    id: "export_backup",
    title: "डेटा बैकअप व CSV एक्सपोर्ट",
    shortTitle: "डेटा बैकअप",
    category: "टूल्स व सेटिंग्स",
    description: "सभी लेक्चर्स व प्रोग्रेस का सुरक्षित डाउनलोड",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-stone-500/10 hover:bg-stone-500/15",
      border: "border-stone-400/40",
      text: "text-stone-950",
      iconBg: "bg-stone-700 text-white",
      iconColor: "text-white",
      badgeBg: "bg-stone-200 text-stone-900 font-semibold",
      badgeText: "text-stone-900",
    },
    getIcon: () => <Download className="w-5 h-5" />,
    getStatus: () => "CSV/ZIP",
    getAction: (ctx) => () => {
      if (ctx.onExportCSV) ctx.onExportCSV();
    },
  },

  google_sync: {
    id: "google_sync",
    title: "गूगल शीट्स ऑटो सिंक",
    shortTitle: "शीट्स सिंक",
    category: "टूल्स व सेटिंग्स",
    description: "क्लाउड स्प्रेडशीट 2-वे सिंक्रोनाइज़ेशन",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
      border: "border-emerald-400/40",
      text: "text-emerald-950",
      iconBg: "bg-emerald-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-emerald-100 text-emerald-900 font-semibold",
      badgeText: "text-emerald-900",
    },
    getIcon: () => <Cloud className="w-5 h-5" />,
    getStatus: () => "क्लाउड",
    getAction: (ctx) => () => {
      if (ctx.onOpenAppsScriptModal) ctx.onOpenAppsScriptModal();
    },
  },

  study_streak: {
    id: "study_streak",
    title: "अध्ययन स्ट्रीक व दक्षता मीटर",
    shortTitle: "दैनिक स्ट्रीक",
    category: "कोर रिवीज़न",
    description: "आज की पूर्णता दर व नियमितता मीटर",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-orange-500/10 hover:bg-orange-500/15",
      border: "border-orange-400/40",
      text: "text-orange-950",
      iconBg: "bg-orange-500 text-white",
      iconColor: "text-white",
      badgeBg: "bg-orange-100 text-orange-900 font-bold",
      badgeText: "text-orange-900",
    },
    getIcon: () => <Flame className="w-5 h-5" />,
    getStatus: (ctx) => {
      const total = ctx.activeTodayCount + ctx.completedTodayCount;
      const pct = total > 0 ? Math.round((ctx.completedTodayCount / total) * 100) : 100;
      return `${pct}% पूर्ण`;
    },
    getAction: (ctx) => () => ctx.onNavigateTab("cockpit"),
  },

  auto_level: {
    id: "auto_level",
    title: "दैनिक लोड बैलेंसर (Auto Level)",
    shortTitle: "लोड बैलेंसर",
    category: "टूल्स व सेटिंग्स",
    description: "अतिरिक्त लेक्चर्स को आगामी 30 दिनों में संतुलित करें",
    defaultSize: "small",
    colorScheme: {
      bg: "bg-indigo-500/10 hover:bg-indigo-500/15",
      border: "border-indigo-400/40",
      text: "text-indigo-950",
      iconBg: "bg-indigo-600 text-white",
      iconColor: "text-white",
      badgeBg: "bg-indigo-100 text-indigo-900 font-semibold",
      badgeText: "text-indigo-900",
    },
    getIcon: () => <Sliders className="w-5 h-5" />,
    getStatus: () => "संतुलन",
    getAction: (ctx) => () => ctx.onNavigateTab("cockpit"),
  },
};
