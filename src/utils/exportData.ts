import * as XLSX from "xlsx";
import { LectureItem } from "../types";
import { SUBJECT_CHAPTER_CATALOG, ALL_CH_LIST_RAW } from "../data/subjectChapterCatalog";
import { getTodayStr } from "./revisionEngine";

export type ExportFormat = "xlsx" | "csv";
export type ExportDatasetType = 
  | "all_in_one" 
  | "records" 
  | "syllabus" 
  | "subject_summary" 
  | "revision_logs";

export type RecordFilterOption = 
  | "ALL" 
  | "STUDIED_ONLY" 
  | "DUE_TODAY" 
  | "COMPLETED" 
  | "HARD_MISTAKES" 
  | "NOT_STARTED";

function getStatusHindi(lec: LectureItem, todayStr: string): string {
  if (lec.revisionCount >= 4 || lec.status === "completed") return "कंठस्थ / पूर्ण (Mastered)";
  if (lec.status === "archived") return "आर्काइव / वॉल्ट (Archived)";
  if (lec.nextDueDate && lec.nextDueDate < todayStr && lec.status !== "not_started") return "अतिदेय (Overdue)";
  if (lec.status === "due_today" || (lec.nextDueDate && lec.nextDueDate === todayStr && lec.status !== "not_started")) return "आज नियत (Due Today)";
  if (lec.status === "active" || lec.status === "in_queue" || lec.revisionCount > 0) return "प्रगति पर (In Progress)";
  return "प्रारंभ नहीं (Not Started)";
}

function getSubjectCategory(subjectName: string): string {
  const found = SUBJECT_CHAPTER_CATALOG.find(
    (s) => s.name.toLowerCase().trim() === subjectName.toLowerCase().trim()
  );
  return found ? found.category : "Other";
}

/**
 * Filter lectures based on RecordFilterOption and optional subject filter
 */
export function filterLecturesForExport(
  lectures: LectureItem[],
  filter: RecordFilterOption = "ALL",
  subjectFilter: string = "ALL"
): LectureItem[] {
  const todayStr = getTodayStr();
  return lectures.filter((lec) => {
    if (subjectFilter !== "ALL" && lec.subject !== subjectFilter) return false;
    switch (filter) {
      case "STUDIED_ONLY":
        return lec.status !== "not_started" || lec.revisionCount > 0;
      case "DUE_TODAY":
        return (
          lec.status === "due_today" ||
          (Boolean(lec.nextDueDate) && lec.nextDueDate <= todayStr && lec.status !== "completed" && lec.status !== "not_started")
        );
      case "COMPLETED":
        return lec.status === "completed" || lec.revisionCount >= 4;
      case "HARD_MISTAKES":
        return lec.lastRating === "Hard" || Boolean(lec.previousMistakes?.trim());
      case "NOT_STARTED":
        return lec.status === "not_started" && lec.revisionCount === 0;
      case "ALL":
      default:
        return true;
    }
  });
}

/**
 * Build rows for Lecture Records
 */
export function buildLectureRecordRows(lectures: LectureItem[]) {
  const todayStr = getTodayStr();
  return lectures.map((item, idx) => ({
    "क्र.सं. (Sr.No)": idx + 1,
    "लेक्चर ID": item.id,
    "श्रेणी (Category)": getSubjectCategory(item.subject),
    "विषय (Subject)": item.subject,
    "अध्याय (Chapter)": item.chapter,
    "लेक्चर नं. (Lecture No)": item.lectureNumber,
    "शीर्षक (Title)": item.title,
    "स्थिति (Status)": getStatusHindi(item, todayStr),
    "1-Day फाउंडेशन": item.step1Completed ? "हाँ (Yes)" : "नहीं (No)",
    "3-Day फाउंडेशन": item.step2Completed ? "हाँ (Yes)" : "नहीं (No)",
    "कुल रिवीज़न (Rev Count)": item.revisionCount || 0,
    "कठिनाई रेटिंग (Difficulty)": item.lastRating || "-",
    "समझ स्तर (Comprehension)": item.comprehensionLevel || "-",
    "जोड़े जाने की तारीख (Added Date)": item.addedDate || "-",
    "अंतिम रिवीज़न (Last Revised)": item.lastRevisionDate || "-",
    "अगली रिवीज़न तारीख (Next Due)": item.nextDueDate || "-",
    "न्यूनतम समय (Min Mins)": item.minTimeMinutes || 15,
    "औसत समय (Avg Mins)": item.avgTimeMinutes || 20,
    "अधिकतम समय (Max Mins)": item.maxTimeMinutes || 30,
    "पिछली गलतियाँ (Mistakes)": item.previousMistakes || "",
    "शॉर्टकट व ट्रिक्स (Tricks)": item.calculationTricks || "",
    "संकल्पना नोट्स (Concept Notes)": item.conceptNotes || "",
    "सूत्र नोट्स (Formula Notes)": item.formulaNotes || "",
    "AI डाउट्स (Gemini Doubts)": item.geminiDoubts || "",
  }));
}

/**
 * Build rows for Complete Syllabus (Chapter-by-chapter across all 21 subjects)
 */
export function buildSyllabusRows(lectures: LectureItem[], subjectFilter: string = "ALL") {
  const todayStr = getTodayStr();
  const rows: Record<string, any>[] = [];
  let srNo = 1;

  // Map official lecture counts from ALL_CH_LIST_RAW
  const rawLectureCountMap = new Map<string, number>();
  ALL_CH_LIST_RAW.forEach((entry) => {
    rawLectureCountMap.set(
      `${entry.subject.toLowerCase().trim()}:::${entry.chapter.toLowerCase().trim()}`,
      entry.lectures
    );
  });

  const subjectsToExport =
    subjectFilter === "ALL"
      ? SUBJECT_CHAPTER_CATALOG
      : SUBJECT_CHAPTER_CATALOG.filter((s) => s.name === subjectFilter);

  subjectsToExport.forEach((sub) => {
    sub.chapters.forEach((chName, chIdx) => {
      const chLectures = lectures.filter(
        (l) =>
          l.subject === sub.name &&
          l.chapter.toLowerCase().trim() === chName.toLowerCase().trim()
      );

      const officialCount =
        rawLectureCountMap.get(`${sub.name.toLowerCase().trim()}:::${chName.toLowerCase().trim()}`) ||
        chLectures.length ||
        0;

      const totalRecorded = chLectures.length;
      const studiedCount = chLectures.filter(
        (l) => l.status !== "not_started" || l.revisionCount > 0
      ).length;
      const masteredCount = chLectures.filter(
        (l) => l.status === "completed" || l.revisionCount >= 4
      ).length;
      const dueTodayCount = chLectures.filter(
        (l) =>
          l.status === "due_today" ||
          (l.nextDueDate && l.nextDueDate <= todayStr && l.status !== "completed" && l.status !== "not_started")
      ).length;
      const hardCount = chLectures.filter((l) => l.lastRating === "Hard").length;
      const notStartedCount = Math.max(0, totalRecorded - studiedCount);
      const totalRevisionsDone = chLectures.reduce((sum, l) => sum + (l.revisionCount || 0), 0);

      const baseTotal = totalRecorded > 0 ? totalRecorded : officialCount;
      const completionPct = baseTotal > 0 ? Math.round((masteredCount / baseTotal) * 100) : 0;
      const studiedPct = baseTotal > 0 ? Math.round((studiedCount / baseTotal) * 100) : 0;

      let chapterStatus = "प्रारंभ नहीं (Not Started)";
      if (baseTotal > 0 && masteredCount >= baseTotal) {
        chapterStatus = "कंठस्थ / पूर्ण (Completed)";
      } else if (studiedCount > 0) {
        chapterStatus = "प्रगति पर (In Progress)";
      }

      rows.push({
        "क्र.सं. (Sr.No)": srNo++,
        "श्रेणी (Category)": sub.category,
        "विषय (Subject)": sub.name,
        "अध्याय क्र. (Ch.No)": chIdx + 1,
        "अध्याय का नाम (Chapter Name)": chName,
        "निर्धारित लेक्चर्स (Syllabus Lectures)": officialCount,
        "दर्ज लेक्चर्स (Total in App)": totalRecorded,
        "पढ़े गए लेक्चर्स (Studied)": studiedCount,
        "कंठस्थ लेक्चर्स (Mastered)": masteredCount,
        "आज नियत (Due Today)": dueTodayCount,
        "शेष लेक्चर्स (Remaining)": notStartedCount,
        "कठिन लेक्चर्स (Hard)": hardCount,
        "कुल संपन्न रिवीज़न (Total Revisions)": totalRevisionsDone,
        "पढ़ाई प्रगति % (Studied %)": `${studiedPct}%`,
        "कंठस्थ प्रगति % (Mastered %)": `${completionPct}%`,
        "अध्याय स्थिति (Status)": chapterStatus,
      });
    });
  });

  return rows;
}

/**
 * Build rows for 21 Subjects Summary
 */
export function buildSubjectSummaryRows(lectures: LectureItem[]) {
  const todayStr = getTodayStr();
  return SUBJECT_CHAPTER_CATALOG.map((sub, idx) => {
    const subLectures = lectures.filter((l) => l.subject === sub.name);
    const totalChapters = sub.chapters.length;
    const totalLectures = subLectures.length;
    const studiedCount = subLectures.filter(
      (l) => l.status !== "not_started" || l.revisionCount > 0
    ).length;
    const masteredCount = subLectures.filter(
      (l) => l.status === "completed" || l.revisionCount >= 4
    ).length;
    const dueCount = subLectures.filter(
      (l) =>
        l.status === "due_today" ||
        (l.nextDueDate && l.nextDueDate <= todayStr && l.status !== "completed" && l.status !== "not_started")
    ).length;
    const hardCount = subLectures.filter((l) => l.lastRating === "Hard").length;
    const remainingCount = Math.max(0, totalLectures - studiedCount);
    const totalRevisions = subLectures.reduce((acc, l) => acc + (l.revisionCount || 0), 0);
    const completionPct = totalLectures > 0 ? Math.round((masteredCount / totalLectures) * 100) : 0;

    return {
      "क्र.सं. (Sr.No)": idx + 1,
      "श्रेणी (Category)": sub.category,
      "विषय (Subject Name)": sub.name,
      "कुल अध्याय (Total Chapters)": totalChapters,
      "कुल लेक्चर्स (Total Lectures)": totalLectures,
      "पढ़े गए (Studied)": studiedCount,
      "कंठस्थ / पूर्ण (Mastered)": masteredCount,
      "आज नियत (Due Today)": dueCount,
      "शेष (Not Started)": remainingCount,
      "कठिन (Hard)": hardCount,
      "कुल रिवीज़न (Total Revisions)": totalRevisions,
      "प्रगति % (Completion %)": `${completionPct}%`,
    };
  });
}

/**
 * Build rows for Detailed Chronological Revision Logs
 */
export function buildRevisionLogRows(lectures: LectureItem[], subjectFilter: string = "ALL") {
  const rows: Record<string, any>[] = [];
  let srNo = 1;

  const filtered =
    subjectFilter === "ALL"
      ? lectures
      : lectures.filter((l) => l.subject === subjectFilter);

  filtered.forEach((lec) => {
    if (lec.revisionLogs && lec.revisionLogs.length > 0) {
      lec.revisionLogs.forEach((log) => {
        rows.push({
          "क्र.सं. (Sr.No)": srNo++,
          "तारीख (Revision Date)": log.date,
          "विषय (Subject)": lec.subject,
          "अध्याय (Chapter)": lec.chapter,
          "लेक्चर नं. (Lecture No)": lec.lectureNumber,
          "शीर्षक (Title)": lec.title,
          "रिवीज़न बारी (Attempt #)": log.attemptNumber,
          "समय लगा (Time Spent Mins)": log.timeSpentMinutes,
          "कठिनाई रेटिंग (Rating)": log.difficultyRating || lec.lastRating || "-",
          "समझ स्तर (Comprehension)": log.comprehensionLevel || lec.comprehensionLevel || "-",
          "गलतियाँ / कठिनाई (Mistakes)": log.mistakes || lec.previousMistakes || "",
          "आसान हल / ट्रिक्स (Tricks)": log.tricks || lec.calculationTricks || "",
          "संदर्भ लिंक्स (Links)":
            log.links && log.links.length > 0
              ? log.links.map((lk) => `${lk.title}: ${lk.url}`).join(" | ")
              : "",
          "अगली देय तिथि (Next Due)": lec.nextDueDate || "-",
        });
      });
    } else if (lec.revisionCount > 0 || lec.status !== "not_started") {
      // Fallback row for lectures that were revised/marked without detailed log entries
      rows.push({
        "क्र.सं. (Sr.No)": srNo++,
        "तारीख (Revision Date)": lec.lastRevisionDate || lec.addedDate || "-",
        "विषय (Subject)": lec.subject,
        "अध्याय (Chapter)": lec.chapter,
        "लेक्चर नं. (Lecture No)": lec.lectureNumber,
        "शीर्षक (Title)": lec.title,
        "रिवीज़न बारी (Attempt #)": lec.revisionCount,
        "समय लगा (Time Spent Mins)": lec.avgTimeMinutes || 20,
        "कठिनाई रेटिंग (Rating)": lec.lastRating || "-",
        "समझ स्तर (Comprehension)": lec.comprehensionLevel || "-",
        "गलतियाँ / कठिनाई (Mistakes)": lec.previousMistakes || "",
        "आसान हल / ट्रिक्स (Tricks)": lec.calculationTricks || "",
        "संदर्भ लिंक्स (Links)":
          lec.referenceLinks && lec.referenceLinks.length > 0
            ? lec.referenceLinks.map((lk) => `${lk.title}: ${lk.url}`).join(" | ")
            : "",
        "अगली देय तिथि (Next Due)": lec.nextDueDate || "-",
      });
    }
  });

  return rows;
}

/**
 * Helper to auto-size worksheet columns neatly
 */
function autoFitColumns(rows: Record<string, any>[], worksheet: XLSX.WorkSheet) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const colWidths = headers.map((header) => {
    let maxLen = header.length + 4;
    for (let i = 0; i < Math.min(rows.length, 200); i++) {
      const val = String(rows[i][header] ?? "");
      if (val.length > maxLen) {
        maxLen = val.length;
      }
    }
    return { wch: Math.min(Math.max(maxLen, 12), 45) };
  });
  worksheet["!cols"] = colWidths;
}

/**
 * Convert array of objects to UTF-8 BOM CSV string (so Excel opens Hindi characters cleanly)
 */
export function convertRowsToCSV(rows: Record<string, any>[]): string {
  if (!rows || rows.length === 0) {
    return "\uFEFFकोई डेटा उपलब्ध नहीं है (No Data)";
  }
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  return "\uFEFF" + csv;
}

/**
 * Trigger browser file download for CSV
 */
export function downloadCSVFile(rows: Record<string, any>[], filenameBase: string) {
  const csvContent = convertRowsToCSV(rows);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filenameBase}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Trigger browser file download for Excel (.xlsx)
 */
export function downloadExcelWorkbook(
  sheets: { name: string; rows: Record<string, any>[] }[],
  filenameBase: string
) {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const safeRows =
      sheet.rows.length > 0
        ? sheet.rows
        : [{ "सूचना (Info)": "कोई रिकॉर्ड उपलब्ध नहीं है (No records found)" }];
    const worksheet = XLSX.utils.json_to_sheet(safeRows);
    autoFitColumns(safeRows, worksheet);
    // Excel sheet names max 31 chars
    const safeSheetName = sheet.name.slice(0, 31);
    XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
  });

  XLSX.writeFile(workbook, `${filenameBase}.xlsx`);
}

/**
 * High-level unified export function for Records & Syllabus in CSV or Excel (.xlsx)
 */
export function executeDataExport(options: {
  lectures: LectureItem[];
  dataset: ExportDatasetType;
  format: ExportFormat;
  recordFilter?: RecordFilterOption;
  subjectFilter?: string;
}): { filename: string; rowCount: number } {
  const {
    lectures,
    dataset,
    format,
    recordFilter = "ALL",
    subjectFilter = "ALL",
  } = options;

  const today = getTodayStr();
  const subSuffix =
    subjectFilter !== "ALL"
      ? `_${subjectFilter.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_")}`
      : "";

  if (dataset === "all_in_one") {
    const filteredLectures = filterLecturesForExport(lectures, recordFilter, subjectFilter);
    const recordRows = buildLectureRecordRows(filteredLectures);
    const syllabusRows = buildSyllabusRows(lectures, subjectFilter);
    const summaryRows = buildSubjectSummaryRows(lectures);
    const logRows = buildRevisionLogRows(lectures, subjectFilter);

    const filenameBase = `Smart_Revision_Complete_Report${subSuffix}_${today}`;

    if (format === "xlsx") {
      downloadExcelWorkbook(
        [
          { name: "Lectures_Record", rows: recordRows },
          { name: "Complete_Syllabus", rows: syllabusRows },
          { name: "Subject_Summary", rows: summaryRows },
          { name: "Revision_History", rows: logRows },
        ],
        filenameBase
      );
      return {
        filename: `${filenameBase}.xlsx`,
        rowCount: recordRows.length + syllabusRows.length,
      };
    } else {
      // For CSV when "all_in_one" is chosen, export both or master record + syllabus combined
      downloadCSVFile(recordRows, `Smart_Revision_Records${subSuffix}_${today}`);
      setTimeout(() => {
        downloadCSVFile(syllabusRows, `Smart_Revision_Syllabus${subSuffix}_${today}`);
      }, 350);
      return {
        filename: `Smart_Revision_Records & Syllabus (${today}).csv`,
        rowCount: recordRows.length + syllabusRows.length,
      };
    }
  }

  if (dataset === "records") {
    const filteredLectures = filterLecturesForExport(lectures, recordFilter, subjectFilter);
    const rows = buildLectureRecordRows(filteredLectures);
    const filenameBase = `Smart_Revision_Records${subSuffix}_${today}`;

    if (format === "xlsx") {
      downloadExcelWorkbook([{ name: "Lectures_Record", rows }], filenameBase);
    } else {
      downloadCSVFile(rows, filenameBase);
    }
    return { filename: `${filenameBase}.${format}`, rowCount: rows.length };
  }

  if (dataset === "syllabus") {
    const rows = buildSyllabusRows(lectures, subjectFilter);
    const filenameBase = `Smart_Revision_Syllabus${subSuffix}_${today}`;

    if (format === "xlsx") {
      const summaryRows = buildSubjectSummaryRows(lectures);
      downloadExcelWorkbook(
        [
          { name: "Complete_Syllabus", rows },
          { name: "Subject_Summary", rows: summaryRows },
        ],
        filenameBase
      );
    } else {
      downloadCSVFile(rows, filenameBase);
    }
    return { filename: `${filenameBase}.${format}`, rowCount: rows.length };
  }

  if (dataset === "subject_summary") {
    const rows = buildSubjectSummaryRows(lectures);
    const filenameBase = `Smart_Revision_Subject_Summary_${today}`;

    if (format === "xlsx") {
      downloadExcelWorkbook([{ name: "Subject_Summary", rows }], filenameBase);
    } else {
      downloadCSVFile(rows, filenameBase);
    }
    return { filename: `${filenameBase}.${format}`, rowCount: rows.length };
  }

  // revision_logs
  const rows = buildRevisionLogRows(lectures, subjectFilter);
  const filenameBase = `Smart_Revision_History_Logs${subSuffix}_${today}`;
  if (format === "xlsx") {
    downloadExcelWorkbook([{ name: "Revision_History", rows }], filenameBase);
  } else {
    downloadCSVFile(rows, filenameBase);
  }
  return { filename: `${filenameBase}.${format}`, rowCount: rows.length };
}
