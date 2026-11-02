export type DifficultyRating = "Easy" | "Medium" | "Hard";

export type RevisionPhase = "1-Day" | "3-Day" | "Rated";

export type TaskStatus = "active" | "due_today" | "scheduled" | "completed" | "archived" | "in_queue" | "not_started";

export interface ReferenceLink {
  id: string;
  title: string; // Custom Display Text
  url: string;   // Hyperlink URL
}

export interface RevisionLogEntry {
  id: string;
  attemptNumber: number; // e.g. 1, 2, 3
  date: string; // YYYY-MM-DD
  timeSpentMinutes: number;
  difficultyRating?: DifficultyRating;
  comprehensionLevel?: "पक्का" | "सामान्य" | "संशय";
  mistakes?: string; // कठिनाई / गलतियाँ (पिछला अनुभव)
  tricks?: string;   // आसान हल / ट्रिक्स
  links?: ReferenceLink[]; // संदर्भ लिंक्स (Hyperlink with Custom Text)
  isHidden?: boolean; // अगर यूज़र ने छिपाया हो
}

export interface LectureItem {
  id: string;
  subject: string;
  chapter: string;
  lectureNumber: number;
  title: string;
  addedDate: string; // YYYY-MM-DD
  
  // 2-Step Mandatory foundation
  step1Completed: boolean; // 1-Day
  step1Date?: string;
  step2Completed: boolean; // 3-Day
  step2Date?: string;
  
  // Rating & interval
  lastRating?: DifficultyRating;
  nextDueDate: string; // YYYY-MM-DD
  lastRevisionDate?: string;
  
  // Revisions & Time-boxing (Min / Avg / Max)
  revisionCount: number;
  minTimeMinutes: number;
  avgTimeMinutes: number;
  maxTimeMinutes: number;
  
  // Status
  status: TaskStatus;
  isOverdueLegacyDebt?: boolean;
  archivedReason?: string;
  
  // Chronological Revision Logs (प्रत्येक बारी का अलग इतिहास)
  revisionLogs?: RevisionLogEntry[];
  
  // Quick fallback fields
  previousMistakes?: string;
  calculationTricks?: string;
  referenceLinks?: ReferenceLink[];
  comprehensionLevel?: "पक्का" | "सामान्य" | "संशय";
  
  // Notes
  geminiDoubts?: string;
  conceptNotes?: string;
  formulaNotes?: string;
}

export interface SubjectMeta {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  category: "Quantitative" | "Reasoning" | "General Studies" | "Language" | "Other";
  chaptersCount: number;
  icon?: string;
}

export interface CockpitConfig {
  dailyQuota: number; // e.g. 5, 8
  prioritySubject: string; // "ALL" or subject name
  priorityChapter: string; // "ALL" or chapter name
  vacationMode: boolean; // Pause / Vacation switch
  vacationStartDate?: string;
  vacationDaysCount: number;
  lastSimulatedDate: string; // YYYY-MM-DD
}

export interface DayForecast {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  dayNumber: number;
  lectureIds: string[];
  count: number;
  estimatedMinutes: number;
  isOverloaded: boolean;
}

export interface CustomTaskItem {
  id: string;
  text: string;
  isDone: boolean;
  priority?: "high" | "medium" | "low";
  dueDate?: string;
  createdAt: string;
}

export interface CustomCardItem {
  id: string;
  title: string;
  content: string;
  color: "amber" | "emerald" | "sky" | "purple" | "rose" | "stone";
  createdAt: string;
  linkUrl?: string;
}

export type TileSize = "small" | "medium" | "large";

export interface DashboardTile {
  id: string; // Unique tile instance ID (e.g. "tile-cockpit-1")
  featureId: string; // Key matching registered feature in feature catalog
  x: number; // 2D Column position (0 to maxColumns-1)
  y: number; // 2D Row position (0, 1, 2, ...)
  size: TileSize; // "small" (1x1), "medium" (2x1), "large" (2x2)
  customTitle?: string;
  customColor?: "amber" | "emerald" | "sky" | "purple" | "rose" | "stone";
  createdAt: string;
}

export interface QuickSettingsDashboardConfig {
  isLocked: boolean;
  tiles: DashboardTile[];
  canvasColumns: number; // 4 on mobile, 6 on desktop
  compactMode?: boolean;
}

export interface HomeDashboardConfig {
  visionStatement: string; // e.g. "मेरा संकल्प: निरंतर रिवीज़न, अटूट एकाग्रता और 1st Attempt सफलता!"
  targetExamName: string;
  targetExamDate: string; // YYYY-MM-DD
  showExamCountdown: boolean;
  showDailyTasks: boolean;
  showStickyNotes: boolean;
  showPinnedTopics: boolean;
  showQuickLaunch: boolean;
  showCustomCards: boolean;
  showAiDailyPlan: boolean;
  stickyNoteContent: string;
  stickyNoteColor: "amber" | "emerald" | "sky" | "purple";
  pinnedSubjects: string[];
  pinnedChapters: string[];
  customTasks: CustomTaskItem[];
  customCards: CustomCardItem[];
  dashboardTiles?: DashboardTile[];
  isLayoutLocked?: boolean;
  aiDailyPlan?: {
    date: string;
    focusTheme: string;
    morningBlock: string;
    afternoonBlock: string;
    eveningBlock: string;
    goldenTip: string;
  };
}
