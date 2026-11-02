import { DifficultyRating, LectureItem, CockpitConfig, DayForecast } from "../types";

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatHindiDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    const monthsHindi = [
      "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
      "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ];
    return `${d.getDate()} ${monthsHindi[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + "T00:00:00").getTime();
  const d2 = new Date(dateStr2 + "T00:00:00").getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

/**
 * Scientific Interval Calculation:
 * - 1st Revision: 1-Day
 * - 2nd Revision: 3-Day
 * - Post-Foundation Rating:
 *   - Easy: +21 Days (20-25 days)
 *   - Medium: +12 Days (10-14 days)
 *   - Hard: +4 Days (3-5 days)
 */
export function calculateNextRevision(
  lecture: LectureItem,
  rating?: DifficultyRating,
  todayStr: string = getTodayStr()
): { nextDate: string; nextPhase: "1-Day" | "3-Day" | "Rated"; daysAdded: number } {
  if (!lecture.step1Completed) {
    return {
      nextDate: addDays(todayStr, 1),
      nextPhase: "1-Day",
      daysAdded: 1,
    };
  }

  if (!lecture.step2Completed) {
    return {
      nextDate: addDays(todayStr, 3),
      nextPhase: "3-Day",
      daysAdded: 3,
    };
  }

  // After 2 mandatory revisions, use difficulty rating
  const effectiveRating = rating || lecture.lastRating || "Medium";
  let interval = 12;
  if (effectiveRating === "Easy") {
    interval = 21; // 20-25 days
  } else if (effectiveRating === "Hard") {
    interval = 4; // 3-5 days
  } else {
    interval = 12; // 10-14 days
  }

  return {
    nextDate: addDays(todayStr, interval),
    nextPhase: "Rated",
    daysAdded: interval,
  };
}

/**
 * Filter & prioritize items for Today's Focus Cockpit Quota
 */
export function getCockpitQueue(
  lectures: LectureItem[],
  config: CockpitConfig,
  currentDate: string = getTodayStr()
): {
  todayQuotaItems: LectureItem[];
  quietQueueItems: LectureItem[];
  totalDueCount: number;
  timeBoxingSummary: { minTotal: number; avgTotal: number; maxTotal: number };
} {
  // Only consider active, non-archived, already studied items that are due on or before currentDate
  const dueItems = lectures.filter(
    (item) => item.status !== "archived" && item.status !== "not_started" && item.nextDueDate <= currentDate
  );

  // Sorting with Priority Engine:
  // 1. Priority Subject match
  // 2. Priority Chapter match
  // 3. Foundation pending (step1 or step2)
  // 4. Hard rating
  // 5. Revision count (fewer revisions = higher urgency)
  const sorted = [...dueItems].sort((a, b) => {
    const aSubjMatch = config.prioritySubject !== "ALL" && a.subject === config.prioritySubject ? 1 : 0;
    const bSubjMatch = config.prioritySubject !== "ALL" && b.subject === config.prioritySubject ? 1 : 0;
    if (aSubjMatch !== bSubjMatch) return bSubjMatch - aSubjMatch;

    const aChaptMatch = config.priorityChapter !== "ALL" && a.chapter.includes(config.priorityChapter) ? 1 : 0;
    const bChaptMatch = config.priorityChapter !== "ALL" && b.chapter.includes(config.priorityChapter) ? 1 : 0;
    if (aChaptMatch !== bChaptMatch) return bChaptMatch - aChaptMatch;

    // Foundation priority
    const aFoundation = !a.step1Completed || !a.step2Completed ? 1 : 0;
    const bFoundation = !b.step1Completed || !b.step2Completed ? 1 : 0;
    if (aFoundation !== bFoundation) return bFoundation - aFoundation;

    // Difficulty priority
    const diffScore = (item: LectureItem) => (item.lastRating === "Hard" ? 2 : item.lastRating === "Medium" ? 1 : 0);
    if (diffScore(a) !== diffScore(b)) return diffScore(b) - diffScore(a);

    return a.revisionCount - b.revisionCount;
  });

  const todayQuotaItems = sorted.slice(0, config.dailyQuota);
  const quietQueueItems = sorted.slice(config.dailyQuota);

  // Time boxing for today's quota
  const minTotal = todayQuotaItems.reduce((acc, curr) => acc + (curr.minTimeMinutes || 15), 0);
  const avgTotal = todayQuotaItems.reduce((acc, curr) => acc + (curr.avgTimeMinutes || 20), 0);
  const maxTotal = todayQuotaItems.reduce((acc, curr) => acc + (curr.maxTimeMinutes || 30), 0);

  return {
    todayQuotaItems,
    quietQueueItems,
    totalDueCount: dueItems.length,
    timeBoxingSummary: { minTotal, avgTotal, maxTotal },
  };
}

/**
 * 30-Day Heatmap Forecast
 */
export function generate30DayForecast(
  lectures: LectureItem[],
  config: CockpitConfig,
  baseDate: string = getTodayStr()
): DayForecast[] {
  const forecast: DayForecast[] = [];
  const daysMap = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

  for (let i = 0; i < 30; i++) {
    const dateStr = addDays(baseDate, i);
    const d = new Date(dateStr + "T00:00:00");
    const dayOfWeek = daysMap[d.getDay()];

    const scheduled = lectures.filter(
      (item) => item.status !== "archived" && item.status !== "not_started" && item.nextDueDate === dateStr
    );

    const estimatedMinutes = scheduled.reduce((acc, curr) => acc + (curr.avgTimeMinutes || 20), 0);

    forecast.push({
      date: dateStr,
      dayOfWeek,
      dayNumber: i + 1,
      lectureIds: scheduled.map((s) => s.id),
      count: scheduled.length,
      estimatedMinutes,
      isOverloaded: scheduled.length > config.dailyQuota,
    });
  }

  return forecast;
}

/**
 * Auto-Leveling / Load Smoother Algorithm
 * Shifts excess tasks from peak days into the nearest subsequent light days
 */
export function autoLevelSchedule(
  lectures: LectureItem[],
  dailyQuota: number,
  baseDate: string = getTodayStr()
): { updatedLectures: LectureItem[]; shiftedCount: number } {
  const updated = [...lectures.map((l) => ({ ...l }))];
  let shiftedCount = 0;

  // Track daily load map for the next 35 days
  const dailySlots: { [dateStr: string]: LectureItem[] } = {};
  for (let i = 0; i < 35; i++) {
    const dStr = addDays(baseDate, i);
    dailySlots[dStr] = [];
  }

  // Populate active items (excluding archived and not_started)
  updated.forEach((lec) => {
    if (lec.status !== "archived" && lec.status !== "not_started") {
      if (!dailySlots[lec.nextDueDate]) {
        dailySlots[lec.nextDueDate] = [];
      }
      dailySlots[lec.nextDueDate].push(lec);
    }
  });

  // Rebalance from day 0 through day 30
  for (let i = 0; i < 30; i++) {
    const currentDStr = addDays(baseDate, i);
    const dayItems = dailySlots[currentDStr] || [];

    if (dayItems.length > dailyQuota) {
      // Sort dayItems so that easier or higher revision count items shift first
      dayItems.sort((a, b) => b.revisionCount - a.revisionCount);

      const excessCount = dayItems.length - dailyQuota;
      const toShift = dayItems.splice(dayItems.length - excessCount, excessCount);

      // Find subsequent days with space
      for (const item of toShift) {
        let placed = false;
        for (let nextDayOffset = 1; nextDayOffset <= 7; nextDayOffset++) {
          const targetDStr = addDays(currentDStr, nextDayOffset);
          if (!dailySlots[targetDStr]) dailySlots[targetDStr] = [];

          if (dailySlots[targetDStr].length < dailyQuota) {
            item.nextDueDate = targetDStr;
            dailySlots[targetDStr].push(item);
            shiftedCount++;
            placed = true;
            break;
          }
        }

        // If all next 7 days are full, push to day + 8
        if (!placed) {
          const fallbackDStr = addDays(currentDStr, 8);
          if (!dailySlots[fallbackDStr]) dailySlots[fallbackDStr] = [];
          item.nextDueDate = fallbackDStr;
          dailySlots[fallbackDStr].push(item);
          shiftedCount++;
        }
      }
    }
  }

  return { updatedLectures: updated, shiftedCount };
}

/**
 * Vacation / Pause Mode:
 * Shifts all upcoming uncompleted tasks forward by N days (zero extra backlog)
 */
export function shiftTasksForVacation(
  lectures: LectureItem[],
  daysToShift: number,
  baseDate: string = getTodayStr()
): LectureItem[] {
  if (daysToShift <= 0) return lectures;

  return lectures.map((lec) => {
    if (lec.status === "archived") return lec;
    // Shift due dates that are >= baseDate or due today
    if (lec.nextDueDate >= baseDate || lec.status === "in_queue" || lec.status === "due_today") {
      return {
        ...lec,
        nextDueDate: addDays(lec.nextDueDate, daysToShift),
      };
    }
    return lec;
  });
}
