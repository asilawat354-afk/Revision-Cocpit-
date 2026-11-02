import { CockpitConfig, LectureItem, HomeDashboardConfig, DashboardTile } from "../types";
import { getAllSyllabusLectures, TODAY_STR } from "../data/initialData";
import { ALL_CH_LIST_RAW, generateLectureId } from "../data/subjectChapterCatalog";

const STORAGE_KEY_LECTURES = "smart_revision_lectures_v3";
const STORAGE_KEY_CONFIG = "smart_revision_config_v1";
const STORAGE_KEY_HOME = "smart_revision_home_config_v1";

export const DEFAULT_DASHBOARD_TILES: DashboardTile[] = [
  // Row 0: Top Primary Engines (Medium 2x1 tiles)
  { id: "tile-cockpit", featureId: "cockpit", x: 0, y: 0, size: "medium", createdAt: "2026-09-22" },
  { id: "tile-master-db", featureId: "master_db", x: 2, y: 0, size: "medium", createdAt: "2026-09-22" },

  // Row 1: Core Tool Icons (Small 1x1 tiles)
  { id: "tile-heatmap", featureId: "heatmap", x: 0, y: 1, size: "small", createdAt: "2026-09-22" },
  { id: "tile-audit", featureId: "audit_grid", x: 1, y: 1, size: "small", createdAt: "2026-09-22" },
  { id: "tile-vault", featureId: "debt_vault", x: 2, y: 1, size: "small", createdAt: "2026-09-22" },
  { id: "tile-ai-doubt", featureId: "gemini_doubt", x: 3, y: 1, size: "small", createdAt: "2026-09-22" },

  // Row 2: Study Plan & Exam Countdown (Medium 2x1)
  { id: "tile-ai-plan", featureId: "ai_daily_plan", x: 0, y: 2, size: "medium", createdAt: "2026-09-22" },
  { id: "tile-exam-countdown", featureId: "exam_countdown", x: 2, y: 2, size: "medium", createdAt: "2026-09-22" },

  // Row 3: Daily Tasks & Quick Notes (Medium 2x1)
  { id: "tile-tasks", featureId: "daily_tasks", x: 0, y: 3, size: "medium", createdAt: "2026-09-22" },
  { id: "tile-notes", featureId: "quick_notes", x: 2, y: 3, size: "medium", createdAt: "2026-09-22" },

  // Row 4: Secondary Quick Controls (Small 1x1)
  { id: "tile-add-lec", featureId: "add_lecture", x: 0, y: 4, size: "small", createdAt: "2026-09-22" },
  { id: "tile-directory", featureId: "subject_directory", x: 1, y: 4, size: "small", createdAt: "2026-09-22" },
  { id: "tile-vacation", featureId: "vacation_mode", x: 2, y: 4, size: "small", createdAt: "2026-09-22" },
  { id: "tile-backup", featureId: "export_backup", x: 3, y: 4, size: "small", createdAt: "2026-09-22" },
];

export const DEFAULT_HOME_CONFIG: HomeDashboardConfig = {
  visionStatement: "मेरा संकल्प: निरंतर रिवीज़न, अटूट अनुशासन और पहली ही बार में निश्चित सफलता!",
  targetExamName: "लक्ष्य परीक्षा (Target Exam)",
  targetExamDate: "2027-05-23",
  showExamCountdown: true,
  showDailyTasks: true,
  showStickyNotes: true,
  showPinnedTopics: true,
  showQuickLaunch: true,
  showCustomCards: true,
  showAiDailyPlan: true,
  stickyNoteContent: "आज की जरूरी बातें:\n1. Ratio & Proportion के 3-स्टेप फॉर्मूले दोहराएं।\n2. शाम को 30 मिनट का मॉक टेस्ट दें।\n3. कठिन प्रश्नों को AI डाउट हेल्पर से समझें।",
  stickyNoteColor: "amber",
  pinnedSubjects: ["Maths- (Arithmetic)", "Reasoning"],
  pinnedChapters: ["Ratio & Proportion", "Percentage"],
  dashboardTiles: DEFAULT_DASHBOARD_TILES,
  isLayoutLocked: false,
  customTasks: [
    { id: "task-1", text: "दैनिक कोटा के 5 रिवीज़न पूरे करना", isDone: false, priority: "high", createdAt: new Date().toISOString().split("T")[0] },
    { id: "task-2", text: "20 प्रीवियस ईयर क्वेश्चन्स (PYQ) हल करना", isDone: false, priority: "medium", createdAt: new Date().toISOString().split("T")[0] },
    { id: "task-3", text: "शॉर्ट नोट्स व फॉर्मूला री-कॉल करना", isDone: true, priority: "low", createdAt: new Date().toISOString().split("T")[0] }
  ],
  customCards: [
    {
      id: "card-1",
      title: "स्पीड ट्रिक्स व शॉर्टकट्स",
      content: "• डिजिटल सम (Digital Sum) मेथड से बड़े कैलकुलेशन 5 सेकंड में करें।\n• 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11% रेश्यो याद रखें।",
      color: "amber",
      createdAt: new Date().toISOString().split("T")[0]
    },
    {
      id: "card-2",
      title: "इस सप्ताह का मुख्य मिशन",
      content: "अंकगणित के अनुपात (Ratio) और प्रतिशत (Percentage) के सभी मुख्य लेक्चर्स का 2-स्टेप रिवीज़न पूरा करना।",
      color: "sky",
      createdAt: new Date().toISOString().split("T")[0]
    }
  ]
};

export function loadHomeConfig(): HomeDashboardConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HOME);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_HOME_CONFIG,
        ...parsed,
        dashboardTiles: Array.isArray(parsed.dashboardTiles) && parsed.dashboardTiles.length > 0 
          ? parsed.dashboardTiles 
          : DEFAULT_DASHBOARD_TILES,
        isLayoutLocked: typeof parsed.isLayoutLocked === "boolean" ? parsed.isLayoutLocked : false,
        customTasks: parsed.customTasks || DEFAULT_HOME_CONFIG.customTasks,
        customCards: parsed.customCards || DEFAULT_HOME_CONFIG.customCards,
      };
    }
  } catch (err) {
    console.error("Error loading home dashboard config:", err);
  }
  return DEFAULT_HOME_CONFIG;
}

export function saveHomeConfig(config: HomeDashboardConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_HOME, JSON.stringify(config));
  } catch (err) {
    console.error("Error saving home dashboard config:", err);
  }
}

export const DEFAULT_CONFIG: CockpitConfig = {
  dailyQuota: 5,
  prioritySubject: "ALL",
  priorityChapter: "ALL",
  vacationMode: false,
  vacationDaysCount: 0,
  lastSimulatedDate: TODAY_STR,
};

const CHAPTER_CLEANUP_MAP: Record<string, string> = {
  "1. Ratio & Proportion": "Ratio & Proportion",
  "2. Percentage": "Percentage",
  "3. Mixture & Aligation": "Mixture & Alligation",
  "3. Mixture & Alligation": "Mixture & Alligation",
  "4. Profit & Loss": "Profit & Loss",
  "5. Simple Interest": "Simple Interest",
  "6. Compound Interest": "Compound Interest",
  "7. Chain Rule": "Chain Rule",
  "8. Time & Work": "Time & Work",
  "9. Pipe & Cistern": "Pipe & Cistern",
  "10. Average": "Average",
  "11. Age": "Age",
  "12. Partnership": "Partnership",
  "13. Time, Speed & Distance": "Time Speed & Distance",
  "14. Train": "Train",
  "15. Boat and Stream": "Boat and Stream",
  "15. Boat & Stream": "Boat and Stream",
};

export function loadLectures(): LectureItem[] {
  try {
    // Check v3 key first, then fallback to v2 or v1 to preserve existing progress
    let raw = localStorage.getItem(STORAGE_KEY_LECTURES);
    if (!raw) {
      raw = localStorage.getItem("smart_revision_lectures_v2");
    }
    if (!raw) {
      raw = localStorage.getItem("smart_revision_lectures_v1");
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all syllabus items from ALL_CH_LIST_RAW exist with globally unique IDs
        const existingMap = new Map<string, LectureItem>();
        parsed.forEach((item: LectureItem) => {
          let cleanSubj = item.subject;
          if (cleanSubj === "अंकगणित (Arithmetic)" || cleanSubj.includes("अंकगणित")) {
            cleanSubj = "Maths- (Arithmetic)";
          }
          let cleanChap = CHAPTER_CLEANUP_MAP[item.chapter] || item.chapter;
          const key = `${cleanSubj}:::${cleanChap}:::${item.lectureNumber}`;

          // Always ensure a unique ID that does not collide across chapters with non-ASCII or similar names
          const safeId = item.id && !item.id.includes("___") 
            ? item.id 
            : generateLectureId(cleanSubj, cleanChap, item.lectureNumber);

          existingMap.set(key, { 
            ...item, 
            id: safeId,
            subject: cleanSubj, 
            chapter: cleanChap 
          });
        });

        const merged: LectureItem[] = [...existingMap.values()];

        // Add any missing lectures from syllabus with "not_started" status
        ALL_CH_LIST_RAW.forEach((entry) => {
          for (let l = 1; l <= entry.lectures; l++) {
            const key = `${entry.subject}:::${entry.chapter}:::${l}`;
            if (!existingMap.has(key)) {
              merged.push({
                id: generateLectureId(entry.subject, entry.chapter, l),
                subject: entry.subject,
                chapter: entry.chapter,
                lectureNumber: l,
                title: `Lec ${l}`,
                addedDate: TODAY_STR,
                step1Completed: false,
                step2Completed: false,
                nextDueDate: TODAY_STR,
                revisionCount: 0,
                minTimeMinutes: 15,
                avgTimeMinutes: 20,
                maxTimeMinutes: 30,
                status: "not_started",
              });
            }
          }
        });

        saveLectures(merged);
        return merged;
      }
    }
  } catch (err) {
    console.error("Error loading lectures from localStorage:", err);
  }

  const initial = getAllSyllabusLectures();
  saveLectures(initial);
  return initial;
}

export function saveLectures(lectures: LectureItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LECTURES, JSON.stringify(lectures));
  } catch (err) {
    console.error("Error saving lectures to localStorage:", err);
  }
}

export function loadConfig(): CockpitConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error("Error loading config from localStorage:", err);
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: CockpitConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error("Error saving config to localStorage:", err);
  }
}

export function exportToCSV(lectures: LectureItem[]): string {
  const headers = [
    "ID",
    "तारीख (Added Date)",
    "विषय (Subject)",
    "अध्याय (Chapter)",
    "लेक्चर (Lecture No)",
    "शीर्षक (Title)",
    "1-Day Foundation",
    "3-Day Foundation",
    "रेटिंग (Rating)",
    "कुल रिवीज़न (Rev Count)",
    "न्यूनतम मिनट (Min)",
    "औसत मिनट (Avg)",
    "अधिकतम मिनट (Max)",
    "स्थिति (Status)",
    "अगली रिवीज़न तारीख (Next Due Date)",
    "Gemini डाउट्स (Doubts)",
    "संकल्पना नोट्स (Concept Notes)",
    "कैलकुलेशन ट्रिक्स (Tricks)"
  ];

  const rows = lectures.map((item) => [
    `"${item.id}"`,
    `"${item.addedDate}"`,
    `"${item.subject}"`,
    `"${item.chapter}"`,
    item.lectureNumber,
    `"${item.title.replace(/"/g, '""')}"`,
    item.step1Completed ? "Yes" : "No",
    item.step2Completed ? "Yes" : "No",
    `"${item.lastRating || "-"}"`,
    item.revisionCount,
    item.minTimeMinutes,
    item.avgTimeMinutes,
    item.maxTimeMinutes,
    `"${item.status}"`,
    `"${item.nextDueDate}"`,
    `"${(item.geminiDoubts || "").replace(/"/g, '""')}"`,
    `"${(item.conceptNotes || "").replace(/"/g, '""')}"`,
    `"${(item.calculationTricks || "").replace(/"/g, '""')}"`
  ]);

  return "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function exportBackupJSON(lectures: LectureItem[], config: CockpitConfig): string {
  const backup = {
    version: 3,
    exportDate: new Date().toISOString(),
    config,
    lectures,
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupJSON(jsonStr: string): { lectures: LectureItem[]; config: CockpitConfig } | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && Array.isArray(parsed.lectures)) {
      return {
        lectures: parsed.lectures,
        config: parsed.config || DEFAULT_CONFIG,
      };
    }
  } catch (err) {
    console.error("Error parsing backup JSON:", err);
  }
  return null;
}
