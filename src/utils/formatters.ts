// Utilities for formatting lecture names, chapters, and titles cleanly

/**
 * Maps known competitive chapters to standard short acronyms / abbreviations.
 * E.g. "Ratio & Proportion" -> "R & P", "Simple Interest" -> "SI", "Time, Speed & Distance" -> "TSD"
 */
const KNOWN_CHAPTER_ABBREVIATIONS: Record<string, string> = {
  // Arithmetic chapters
  "ratio & proportion": "R & P",
  "ratio and proportion": "R & P",
  "ration & proportion": "R & P",
  "percentage": "Pct",
  "percent": "Pct",
  "mixture & aligation": "M & A",
  "mixture & alligation": "M & A",
  "mixture and alligation": "M & A",
  "profit & loss": "P & L",
  "profit and loss": "P & L",
  "simple interest": "SI",
  "compound interest": "CI",
  "chain rule": "CR",
  "time & work": "T & W",
  "time and work": "T & W",
  "pipe & cistern": "P & C",
  "pipes & cisterns": "P & C",
  "pipes and cisterns": "P & C",
  "average": "Avg",
  "age": "Age",
  "problem on age": "Age",
  "problems on ages": "Age",
  "ages": "Age",
  "partnership": "Partnership",
  "time, speed & distance": "TSD",
  "time speed & distance": "TSD",
  "time, speed and distance": "TSD",
  "speed, time & distance": "TSD",
  "speed, time and distance": "TSD",
  "train": "Train",
  "trains": "Train",
  "boat and stream": "B & S",
  "boat & stream": "B & S",
  "boats and streams": "B & S",
  "boats & streams": "B & S",
  
  // Advanced & others
  "data interpretation": "DI",
  "number system": "Num Sys",
  "simplification": "Simp",
  "lcm & hcf": "LCM & HCF",
  "lcm and hcf": "LCM & HCF",
  "geometry": "Geom",
  "mensuration": "Mens",
  "trigonometry": "Trig",
  "algebra": "Alg",
  "coordinate geometry": "Coord Geom",
  "height & distance": "H & D",
  "height and distance": "H & D",

  // Reasoning
  "coding & decoding": "C & D",
  "coding decoding": "C & D",
  "blood relation": "BR",
  "blood relations": "BR",
  "direction & distance": "D & D",
  "direction and distance": "D & D",
  "syllogism": "Syl",
  "seating arrangement": "Seat Arr",
  "analogy": "Analogy",
  "classification": "Classif",
  "series": "Series",
  
  // GS & Others
  "indian polity": "Polity",
  "modern history": "Mod Hist",
  "ancient history": "Anc Hist",
  "medieval history": "Med Hist",
  "geography": "Geog",
  "indian economy": "Economy",
  "physics": "Physics",
  "chemistry": "Chem",
  "biology": "Bio",
  "current affairs": "CA",
  "static gk": "Static GK",
  "computer knowledge": "Computer",
  "environment & ecology": "Env",
  "environment and ecology": "Env"
};

/**
 * Returns clean chapter name for lists, cards and tables without creating confusing acronyms.
 * Strips technical prefixes like "Chapter 1: " or "01. " while keeping the full real name (e.g. "Ratio & Proportion", "Profit & Loss").
 */
export function getShortChapterName(chapter: string): string {
  if (!chapter) return "";

  // Strip leading numbering like "1. ", "01. ", "Ch 1: ", "1- ", "Chapter 1: "
  const stripped = chapter
    .replace(/^chapter\s*\d+[\.\:\-\s]*/i, "")
    .replace(/^ch\s*\d+[\.\:\-\s]*/i, "")
    .replace(/^\d+[\.\)\:\-\s]+/, "")
    .trim();

  // Return the complete, readable chapter name (both for Hindi and English)
  return stripped || chapter;
}

/**
 * Formats lecture title as requested by user:
 * Instead of full "Lecture 1" or "1. Ratio & Proportion - Lecture 1", returns "Lec 1", "Lec 2", etc.
 */
export function getLectureDisplayName(lectureNumber?: number, fallbackTitle?: string): string {
  if (typeof lectureNumber === "number" && lectureNumber > 0) {
    return `Lec ${lectureNumber}`;
  }
  if (fallbackTitle) {
    // Check if title has a lecture number pattern like "Lecture 5" or "Lec 5" or "L-5"
    const match = fallbackTitle.match(/(?:lecture|lec|l)[\s\-_#]*(\d+)/i);
    if (match && match[1]) {
      return `Lec ${match[1]}`;
    }
    return fallbackTitle;
  }
  return "Lec";
}
