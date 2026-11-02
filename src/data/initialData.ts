import { LectureItem, SubjectMeta } from "../types";
import { SUBJECT_CHAPTER_CATALOG, ALL_CH_LIST_RAW, generateLectureId } from "./subjectChapterCatalog";
import MASTER_DB_SEED from "./masterDatabaseSeed.json";

export const COMPETITIVE_SUBJECTS: SubjectMeta[] = SUBJECT_CHAPTER_CATALOG.map((s) => ({
  id: s.id,
  nameHindi: s.name,
  nameEnglish: s.name,
  category: 
    s.category === "Maths" ? "Quantitative" : 
    s.category === "Reasoning" ? "Reasoning" : 
    s.category === "Science" || s.category === "General Studies" ? "General Studies" : "Other",
  chaptersCount: s.chapters.length,
  icon: s.iconName,
}));

// Helper to format date offset from dynamic today
export const getTodayStr = (): string => new Date().toISOString().split("T")[0];
export const TODAY_STR = new Date().toISOString().split("T")[0];

function addDaysToDate(baseDateStr: string, days: number): string {
  const d = new Date(baseDateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// Build initial 130 lectures directly from user's CSV
export function getInitialLectures(): LectureItem[] {
  const subjectName = "Maths- (Arithmetic)";
  
  interface ChapterMetaRaw {
    name: string;
    totalLec: number;
    lecConfigs: {
      lec: number;
      revCount: number;
      minT?: number;
      avgT?: number;
      maxT?: number;
      rating?: "Easy" | "Medium" | "Hard";
      geminiDoubts?: string;
      conceptNotes?: string;
      calcTricks?: string;
      isOverdueDebt?: boolean;
    }[];
  }

  const rawChapters: ChapterMetaRaw[] = [
    {
      name: "Ratio & Proportion",
      totalLec: 17,
      lecConfigs: [
        { lec: 1, revCount: 2, minT: 14, avgT: 18, maxT: 25, rating: "Medium", calcTricks: "Digital Sum, Unit Digit", isOverdueDebt: true },
        { lec: 2, revCount: 3, minT: 12, avgT: 15, maxT: 20, rating: "Easy", calcTricks: "Ratio Cross-Multiplication", isOverdueDebt: true },
        { lec: 3, revCount: 1, minT: 20, avgT: 24, maxT: 30, rating: "Hard", isOverdueDebt: true },
        { lec: 4, revCount: 0, minT: 15, avgT: 20, maxT: 28, isOverdueDebt: true },
        { lec: 5, revCount: 1, minT: 25, avgT: 32, maxT: 45, rating: "Hard", conceptNotes: "Types 43-52, T-5, T-6 Questions", isOverdueDebt: true },
        { lec: 6, revCount: 3, minT: 10, avgT: 14, maxT: 18, rating: "Easy", isOverdueDebt: true },
        { lec: 7, revCount: 0, isOverdueDebt: true },
        { lec: 8, revCount: 0, isOverdueDebt: true },
        { lec: 9, revCount: 0, isOverdueDebt: true },
        { lec: 10, revCount: 1, minT: 16, avgT: 22, maxT: 30, isOverdueDebt: true },
        { lec: 11, revCount: 0, isOverdueDebt: true },
        { lec: 12, revCount: 0, isOverdueDebt: true },
        { lec: 13, revCount: 0, isOverdueDebt: true },
        { lec: 14, revCount: 0, isOverdueDebt: true },
        { lec: 15, revCount: 1, minT: 18, avgT: 25, maxT: 35, isOverdueDebt: true },
        { lec: 16, revCount: 0, isOverdueDebt: true },
        { lec: 17, revCount: 0, isOverdueDebt: true },
      ]
    },
    {
      name: "Percentage",
      totalLec: 18,
      lecConfigs: [
        { lec: 1, revCount: 1, minT: 12, avgT: 16, maxT: 22, calcTricks: "Fraction to % Chart 1/1 to 1/20", isOverdueDebt: true },
        { lec: 2, revCount: 1, minT: 15, avgT: 20, maxT: 26, isOverdueDebt: true },
        { lec: 3, revCount: 1, minT: 14, avgT: 18, maxT: 24, isOverdueDebt: true },
        { lec: 4, revCount: 0, isOverdueDebt: true },
        { lec: 5, revCount: 1, minT: 18, avgT: 22, maxT: 30, isOverdueDebt: true },
        { lec: 6, revCount: 1, minT: 16, avgT: 20, maxT: 28, isOverdueDebt: true },
        { lec: 7, revCount: 0, isOverdueDebt: true },
        { lec: 8, revCount: 0, isOverdueDebt: true },
        { lec: 9, revCount: 0, isOverdueDebt: true },
        { lec: 10, revCount: 0, isOverdueDebt: true },
        { lec: 11, revCount: 0, isOverdueDebt: true },
        { lec: 12, revCount: 0, isOverdueDebt: true },
        { lec: 13, revCount: 0, isOverdueDebt: true },
        { lec: 14, revCount: 0, isOverdueDebt: true },
        { lec: 15, revCount: 0, isOverdueDebt: true },
        { lec: 16, revCount: 0, isOverdueDebt: true },
        { lec: 17, revCount: 0, isOverdueDebt: true },
        { lec: 18, revCount: 0, isOverdueDebt: true },
      ]
    },
    {
      name: "Mixture & Alligation",
      totalLec: 9,
      lecConfigs: [
        { lec: 1, revCount: 5, minT: 8, avgT: 12, maxT: 15, rating: "Easy", conceptNotes: "Alligation कभी भी कुल मात्रा पर नहीं लगाया जाता। यह हमेशा दर, प्रतिशत या अनुपात (Concentration) पर लगाया जाता है।" },
        { lec: 2, revCount: 4, minT: 14, avgT: 18, maxT: 24, rating: "Easy", conceptNotes: "सिर्फ 1 वस्तु मिलाना, लाभ के साथ मिश्रण, अनुपात दिया हो, कुल मात्रा बदलना, Replacement" },
        { lec: 3, revCount: 4, minT: 15, avgT: 20, maxT: 25, rating: "Easy", conceptNotes: "समान क्षमता, असमान मात्रा में मिलाना, वास्तविक मात्रा, 3 बर्तनों की क्षमता, औसत" },
        { lec: 4, revCount: 2, minT: 20, avgT: 26, maxT: 34, rating: "Medium", conceptNotes: "किस अनुपात में मिलाएं, दिए गए अनुपात में मिलाना" },
        { lec: 5, revCount: 3, minT: 22, avgT: 28, maxT: 38, rating: "Medium", conceptNotes: "Mix Replacement, Mix Successive Rep., Reverse Successive" },
        { lec: 6, revCount: 0, minT: 18, avgT: 25, maxT: 35, rating: "Hard", conceptNotes: "3-Items Equation, Double Alligation", isOverdueDebt: true },
        { lec: 7, revCount: 1, minT: 16, avgT: 22, maxT: 28, rating: "Medium", isOverdueDebt: true },
        { lec: 8, revCount: 2, minT: 14, avgT: 19, maxT: 25, rating: "Medium", isOverdueDebt: true },
        { lec: 9, revCount: 2, minT: 25, avgT: 35, maxT: 48, rating: "Hard", geminiDoubts: "pdf(9) Q_82,83,85,88,90,95", isOverdueDebt: true },
      ]
    },
    {
      name: "Profit & Loss",
      totalLec: 13,
      lecConfigs: [
        { lec: 1, revCount: 4, minT: 10, avgT: 14, maxT: 18, rating: "Easy" },
        { lec: 2, revCount: 2, minT: 18, avgT: 24, maxT: 32, rating: "Medium", calcTricks: "Calculation ×÷, Types 7 to 21" },
        { lec: 3, revCount: 4, minT: 12, avgT: 16, maxT: 20, rating: "Easy" },
        { lec: 4, revCount: 4, minT: 14, avgT: 18, maxT: 22, rating: "Easy" },
        { lec: 5, revCount: 5, minT: 12, avgT: 15, maxT: 20, rating: "Easy", conceptNotes: "No Loss, Successive Chain, CP Same, SP Same" },
        { lec: 6, revCount: 3, minT: 16, avgT: 22, maxT: 28, rating: "Medium", geminiDoubts: "pdf(6) Q_64,66,68,72", conceptNotes: "SP Same, Part Sales, Rs/Qty×% Rule" },
        { lec: 7, revCount: 4, minT: 15, avgT: 20, maxT: 26, rating: "Easy", geminiDoubts: "Pdf (7) Q_73,77,84,84" },
        { lec: 8, revCount: 3, minT: 18, avgT: 24, maxT: 30, rating: "Medium", geminiDoubts: "Pdf (8) Q_90,91,92,93", conceptNotes: "Cashbox Equation, Discount_Basics, Discount_Successive" },
        { lec: 9, revCount: 1, minT: 22, avgT: 30, maxT: 40, rating: "Hard", conceptNotes: "Successive Discount, Golden Ratio, Fraction SP, Real Profit Link", isOverdueDebt: true },
        { lec: 10, revCount: 2, minT: 20, avgT: 26, maxT: 35, rating: "Medium", isOverdueDebt: true },
        { lec: 11, revCount: 1, minT: 18, avgT: 25, maxT: 32, rating: "Hard", isOverdueDebt: true },
        { lec: 12, revCount: 2, minT: 20, avgT: 28, maxT: 36, rating: "Medium", conceptNotes: "Dummy Data, Chain & Successive, Balance Game, Static MP", isOverdueDebt: true },
        { lec: 13, revCount: 3, minT: 16, avgT: 22, maxT: 30, rating: "Medium", conceptNotes: "Education Swap, Ratio Bridge, Scenario Gap, Remaining Target" },
      ]
    },
    {
      name: "Simple Interest",
      totalLec: 7,
      lecConfigs: [
        { lec: 1, revCount: 3, minT: 12, avgT: 15, maxT: 20, rating: "Easy", conceptNotes: "Direct %, Reverse Base, Missing R/T" },
        { lec: 2, revCount: 2, minT: 18, avgT: 25, maxT: 34, rating: "Medium", conceptNotes: "समय परिवर्तन, मूलधन (P) न दिया हो, कई हिस्सों में निवेश, समान R और T" },
        { lec: 3, revCount: 2, minT: 14, avgT: 18, maxT: 24, rating: "Medium", conceptNotes: "दर (Rate) में बदलाव" },
        { lec: 4, revCount: 2, minT: 14, avgT: 18, maxT: 24, rating: "Medium" },
        { lec: 5, revCount: 2, minT: 15, avgT: 20, maxT: 26, rating: "Medium" },
        { lec: 6, revCount: 2, minT: 16, avgT: 22, maxT: 28, rating: "Medium" },
        { lec: 7, revCount: 2, minT: 14, avgT: 18, maxT: 25, rating: "Medium", isOverdueDebt: true },
      ]
    },
    {
      name: "Compound Interest",
      totalLec: 11,
      lecConfigs: [
        { lec: 1, revCount: 3, minT: 14, avgT: 18, maxT: 24, rating: "Easy" },
        { lec: 2, revCount: 3, minT: 16, avgT: 20, maxT: 28, rating: "Easy" },
        { lec: 3, revCount: 2, minT: 18, avgT: 24, maxT: 32, rating: "Medium" },
        { lec: 4, revCount: 2, minT: 18, avgT: 24, maxT: 32, rating: "Medium" },
        { lec: 5, revCount: 1, minT: 22, avgT: 30, maxT: 40, rating: "Hard", isOverdueDebt: true },
        { lec: 6, revCount: 3, minT: 16, avgT: 20, maxT: 26, rating: "Medium" },
        { lec: 7, revCount: 1, minT: 20, avgT: 28, maxT: 38, rating: "Hard", isOverdueDebt: true },
        { lec: 8, revCount: 3, minT: 16, avgT: 22, maxT: 30, rating: "Medium" },
        { lec: 9, revCount: 2, minT: 20, avgT: 26, maxT: 35, rating: "Medium", isOverdueDebt: true },
        { lec: 10, revCount: 1, minT: 22, avgT: 30, maxT: 42, rating: "Hard", isOverdueDebt: true },
        { lec: 11, revCount: 0, isOverdueDebt: true },
      ]
    },
    {
      name: "Chain Rule",
      totalLec: 4,
      lecConfigs: [
        { lec: 1, revCount: 3, minT: 10, avgT: 14, maxT: 18, rating: "Easy", conceptNotes: "M1*D1*H1/W1 = M2*D2*H2/W2" },
        { lec: 2, revCount: 1, minT: 14, avgT: 18, maxT: 24, rating: "Medium", isOverdueDebt: true },
        { lec: 3, revCount: 0, isOverdueDebt: true },
        { lec: 4, revCount: 1, minT: 15, avgT: 20, maxT: 28, rating: "Medium", isOverdueDebt: true },
      ]
    },
    {
      name: "Time & Work",
      totalLec: 8,
      lecConfigs: [
        { lec: 1, revCount: 2, minT: 14, avgT: 18, maxT: 24, rating: "Medium" },
        { lec: 2, revCount: 1, minT: 16, avgT: 22, maxT: 28, rating: "Medium", isOverdueDebt: true },
        { lec: 3, revCount: 2, minT: 15, avgT: 20, maxT: 26, rating: "Medium", isOverdueDebt: true },
        { lec: 4, revCount: 1, minT: 18, avgT: 24, maxT: 30, rating: "Hard", isOverdueDebt: true },
        { lec: 5, revCount: 0, isOverdueDebt: true },
        { lec: 6, revCount: 1, minT: 16, avgT: 22, maxT: 30, isOverdueDebt: true },
        { lec: 7, revCount: 0, isOverdueDebt: true },
        { lec: 8, revCount: 0, isOverdueDebt: true },
      ]
    },
    {
      name: "Pipe & Cistern",
      totalLec: 5,
      lecConfigs: [
        { lec: 1, revCount: 1, minT: 14, avgT: 18, maxT: 24, isOverdueDebt: true },
        { lec: 2, revCount: 1, minT: 14, avgT: 18, maxT: 24, isOverdueDebt: true },
        { lec: 3, revCount: 0, isOverdueDebt: true },
        { lec: 4, revCount: 1, minT: 16, avgT: 22, maxT: 28, isOverdueDebt: true },
        { lec: 5, revCount: 1, minT: 16, avgT: 22, maxT: 28, isOverdueDebt: true },
      ]
    },
    {
      name: "Average",
      totalLec: 9,
      lecConfigs: [
        { lec: 1, revCount: 2, minT: 12, avgT: 16, maxT: 22, rating: "Medium" },
        { lec: 2, revCount: 2, minT: 14, avgT: 18, maxT: 24, rating: "Medium" },
        { lec: 3, revCount: 2, minT: 14, avgT: 18, maxT: 24, rating: "Medium" },
        { lec: 4, revCount: 3, minT: 12, avgT: 15, maxT: 20, rating: "Easy" },
        { lec: 5, revCount: 2, minT: 14, avgT: 18, maxT: 24, rating: "Medium" },
        { lec: 6, revCount: 1, minT: 16, avgT: 22, maxT: 28, isOverdueDebt: true },
        { lec: 7, revCount: 1, minT: 16, avgT: 22, maxT: 28, isOverdueDebt: true },
        { lec: 8, revCount: 1, minT: 18, avgT: 24, maxT: 32, isOverdueDebt: true },
        { lec: 9, revCount: 1, minT: 18, avgT: 24, maxT: 32, isOverdueDebt: true },
      ]
    },
    {
      name: "Age",
      totalLec: 7,
      lecConfigs: [
        { lec: 1, revCount: 2, minT: 10, avgT: 14, maxT: 18, rating: "Easy" },
        { lec: 2, revCount: 2, minT: 12, avgT: 15, maxT: 20, rating: "Easy" },
        { lec: 3, revCount: 2, minT: 12, avgT: 15, maxT: 20, rating: "Easy" },
        { lec: 4, revCount: 2, minT: 14, avgT: 18, maxT: 22, rating: "Medium" },
        { lec: 5, revCount: 1, minT: 15, avgT: 20, maxT: 26, isOverdueDebt: true },
        { lec: 6, revCount: 1, minT: 15, avgT: 20, maxT: 26, isOverdueDebt: true },
        { lec: 7, revCount: 1, minT: 15, avgT: 20, maxT: 26, isOverdueDebt: true },
      ]
    },
    {
      name: "Partnership",
      totalLec: 5,
      lecConfigs: [
        { lec: 1, revCount: 1, minT: 12, avgT: 16, maxT: 22, isOverdueDebt: true },
        { lec: 2, revCount: 1, minT: 12, avgT: 16, maxT: 22, isOverdueDebt: true },
        { lec: 3, revCount: 4, minT: 10, avgT: 14, maxT: 18, rating: "Easy" },
        { lec: 4, revCount: 3, minT: 12, avgT: 16, maxT: 20, rating: "Easy" },
        { lec: 5, revCount: 1, minT: 14, avgT: 18, maxT: 25, isOverdueDebt: true },
      ]
    },
    {
      name: "Time Speed & Distance",
      totalLec: 10,
      lecConfigs: [
        { lec: 1, revCount: 1, minT: 18, avgT: 24, maxT: 32, isOverdueDebt: true },
        { lec: 2, revCount: 1, minT: 18, avgT: 24, maxT: 32, isOverdueDebt: true },
        { lec: 3, revCount: 1, minT: 18, avgT: 24, maxT: 32, isOverdueDebt: true },
        { lec: 4, revCount: 1, minT: 18, avgT: 24, maxT: 32, isOverdueDebt: true },
        { lec: 5, revCount: 0, minT: 22, avgT: 30, maxT: 40, conceptNotes: "Types 40-48, T-6 Concept", isOverdueDebt: true },
        { lec: 6, revCount: 0 },
        { lec: 7, revCount: 0 },
        { lec: 8, revCount: 0 },
        { lec: 9, revCount: 0 },
        { lec: 10, revCount: 0 },
      ]
    },
    {
      name: "Train",
      totalLec: 3,
      lecConfigs: [
        { lec: 1, revCount: 0, minT: 20, avgT: 28, maxT: 38, conceptNotes: "Con, T1, 1-20, T2, T3 Relative Speed", isOverdueDebt: true },
        { lec: 2, revCount: 0, minT: 20, avgT: 26, maxT: 36, conceptNotes: "21-37, T4, T5 Length & Bridge Crossing", isOverdueDebt: true },
        { lec: 3, revCount: 0, minT: 18, avgT: 25, maxT: 35, conceptNotes: "38-60 Opposing trains and poles" },
      ]
    },
    {
      name: "Boat and Stream",
      totalLec: 4,
      lecConfigs: [
        { lec: 1, revCount: 0, minT: 15, avgT: 20, maxT: 28, conceptNotes: "Downstream (u+v) & Upstream (u-v) Basics" },
        { lec: 2, revCount: 0, minT: 18, avgT: 24, maxT: 32, conceptNotes: "Average Speed in Still vs Running water" },
        { lec: 3, revCount: 0, minT: 20, avgT: 26, maxT: 35, conceptNotes: "Ratio of time taken upstream vs downstream" },
        { lec: 4, revCount: 0, minT: 22, avgT: 30, maxT: 40, conceptNotes: "Equation solving with quadratic or option trial" },
      ]
    }
  ];

  const items: LectureItem[] = [];

  rawChapters.forEach((ch) => {
    for (let l = 1; l <= ch.totalLec; l++) {
      const cfg = ch.lecConfigs.find((c) => c.lec === l);
      const revCount = cfg?.revCount ?? 0;
      const isLegacyDebt = cfg?.isOverdueDebt === true || (revCount === 0 && l <= 5);

      // Status determination
      let status: LectureItem["status"] = "scheduled";
      let nextDue = addDaysToDate(TODAY_STR, (l % 7) + 1);

      if (isLegacyDebt) {
        status = "in_queue";
        nextDue = TODAY_STR; // Due now from backlog
      } else if (revCount >= 4) {
        status = "completed";
        nextDue = addDaysToDate(TODAY_STR, 25);
      } else if (revCount > 0) {
        status = "active";
        nextDue = addDaysToDate(TODAY_STR, (l * 3) % 15 + 1);
      }

      // 2-step foundation status
      const step1Completed = revCount >= 1;
      const step2Completed = revCount >= 2;

      // Time boxing
      const minT = cfg?.minT || 15;
      const avgT = cfg?.avgT || Math.round(minT * 1.35);
      const maxT = cfg?.maxT || Math.round(minT * 1.8);

      items.push({
        id: `arithmetic-${ch.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}-lec-${l}`,
        subject: subjectName,
        chapter: ch.name,
        lectureNumber: l,
        title: `Lec ${l}`,
        addedDate: "2026-06-25",
        step1Completed,
        step1Date: step1Completed ? "2026-06-26" : undefined,
        step2Completed,
        step2Date: step2Completed ? "2026-06-29" : undefined,
        lastRating: cfg?.rating || (revCount >= 3 ? "Easy" : revCount === 2 ? "Medium" : undefined),
        nextDueDate: nextDue,
        revisionCount: revCount,
        minTimeMinutes: minT,
        avgTimeMinutes: avgT,
        maxTimeMinutes: maxT,
        status,
        isOverdueLegacyDebt: isLegacyDebt,
        geminiDoubts: cfg?.geminiDoubts,
        conceptNotes: cfg?.conceptNotes,
        calculationTricks: cfg?.calcTricks,
      });
    }
  });

  return items;
}

function parseSheetDate(dStr: string): string {
  if (!dStr) return TODAY_STR;
  const parts = dStr.split("/");
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dStr;
}

/**
 * Builds the complete syllabus:
 * - 130 active/revision lectures for Maths- (Arithmetic)
 * - 1,289+ Master Database lectures seeded directly from user's Google Spreadsheet
 * - All other lectures from "All CH List" across Advance Maths, Reasoning, Physics, Chemistry,
 *   Biology, Static GK, Indian/World/Physical Geography, Polity, Economics, History, Computer, etc.
 *   initialized with status: "not_started" (आगामी/अभी पढ़ाई बाकी है)
 */
export function getAllSyllabusLectures(): LectureItem[] {
  const initialArithmetic = getInitialLectures();
  const allLectures: LectureItem[] = [...initialArithmetic];

  // Map existing arithmetic lectures by chapter and lectureNumber for quick lookup
  const existingMap = new Map<string, number>();
  initialArithmetic.forEach((item, idx) => {
    existingMap.set(`${item.subject}:::${item.chapter}:::${item.lectureNumber}`, idx);
  });

  // Enrich with Master Database Seed from Google Sheet
  if (Array.isArray(MASTER_DB_SEED)) {
    MASTER_DB_SEED.forEach((seed: any) => {
      const lMatch = (seed.lectureName || "").match(/\d+/);
      const lecNum = lMatch ? parseInt(lMatch[0], 10) : 1;
      const key = `${seed.subject}:::${seed.chapter}:::${lecNum}`;

      const revCount = typeof seed.revCount === "number" ? seed.revCount : 0;
      const minT = typeof seed.minTime === "number" && seed.minTime > 0 ? seed.minTime : 15;
      const avgT = typeof seed.avgTime === "number" && seed.avgTime > 0 ? seed.avgTime : 20;
      const maxT = typeof seed.maxTime === "number" && seed.maxTime > 0 ? seed.maxTime : 30;
      const nextDue = parseSheetDate(seed.nextDueDate);
      const lastRev = seed.lastRevDate ? parseSheetDate(seed.lastRevDate) : undefined;
      const isOverdue = (seed.overdueDays || 0) > 0;
      const difficulty = (seed.difficulty === "Easy" || seed.difficulty === "Hard" ? seed.difficulty : "Medium") as "Easy" | "Medium" | "Hard";

      if (existingMap.has(key)) {
        // Enrich existing
        const idx = existingMap.get(key)!;
        allLectures[idx].id = seed.uid || allLectures[idx].id;
        if (revCount > 0) {
          allLectures[idx].revisionCount = revCount;
          allLectures[idx].lastRating = difficulty;
          allLectures[idx].nextDueDate = nextDue;
          allLectures[idx].lastRevisionDate = lastRev;
        }
      } else {
        // Add new lecture from Master DB
        const newLec: LectureItem = {
          id: seed.uid || generateLectureId(seed.subject, seed.chapter, lecNum),
          subject: seed.subject,
          chapter: seed.chapter,
          lectureNumber: lecNum,
          title: seed.lectureName || `Lec ${lecNum}`,
          addedDate: lastRev || TODAY_STR,
          step1Completed: revCount >= 1,
          step1Date: revCount >= 1 ? lastRev : undefined,
          step2Completed: revCount >= 2,
          step2Date: revCount >= 2 ? lastRev : undefined,
          lastRating: revCount > 0 ? difficulty : undefined,
          nextDueDate: nextDue,
          lastRevisionDate: lastRev,
          revisionCount: revCount,
          minTimeMinutes: minT,
          avgTimeMinutes: avgT,
          maxTimeMinutes: maxT,
          status: revCount > 0 ? (isOverdue ? "due_today" : "active") : "not_started",
          isOverdueLegacyDebt: isOverdue,
        };
        allLectures.push(newLec);
        existingMap.set(key, allLectures.length - 1);
      }
    });
  }

  // Ensure remaining chapters from syllabus catalog exist
  ALL_CH_LIST_RAW.forEach((entry) => {
    for (let l = 1; l <= entry.lectures; l++) {
      const key = `${entry.subject}:::${entry.chapter}:::${l}`;
      if (!existingMap.has(key)) {
        allLectures.push({
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
        existingMap.set(key, allLectures.length - 1);
      }
    }
  });

  return allLectures;
}

