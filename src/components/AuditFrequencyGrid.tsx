import React, { useState } from "react";
import { 
  Grid3X3, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Filter,
  Play
} from "lucide-react";
import { LectureItem } from "../types";
import { SUBJECT_CHAPTER_CATALOG } from "../data/subjectChapterCatalog";
import { getShortChapterName, getLectureDisplayName } from "../utils/formatters";
import { InfoTip } from "./InfoTip";

interface AuditFrequencyGridProps {
  lectures: LectureItem[];
  onStartRevision: (lecture: LectureItem) => void;
}

export const AuditFrequencyGrid: React.FC<AuditFrequencyGridProps> = ({
  lectures,
  onStartRevision,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [hoveredLecture, setHoveredLecture] = useState<LectureItem | null>(null);

  const catalogSubjects = SUBJECT_CHAPTER_CATALOG;
  const allSubjectNames = Array.from(
    new Set([...catalogSubjects.map((s) => s.name), ...lectures.map((l) => l.subject)])
  );

  const filteredLectures = lectures.filter(
    (l) => selectedSubject === "ALL" || l.subject === selectedSubject
  );

  // Group by chapter
  const chaptersMap: { [chapterName: string]: LectureItem[] } = {};
  filteredLectures.forEach((l) => {
    if (!chaptersMap[l.chapter]) {
      chaptersMap[l.chapter] = [];
    }
    chaptersMap[l.chapter].push(l);
  });

  // Calculate Overall Mastery
  const totalLecs = filteredLectures.length;
  const count0 = filteredLectures.filter((l) => l.revisionCount === 0).length;
  const count1 = filteredLectures.filter((l) => l.revisionCount === 1).length;
  const count23 = filteredLectures.filter((l) => l.revisionCount >= 2 && l.revisionCount <= 3).length;
  const count4Plus = filteredLectures.filter((l) => l.revisionCount >= 4).length;

  const masteryPercent = totalLecs > 0 ? Math.round((count4Plus / totalLecs) * 100) : 0;

  const getCellColor = (revCount: number) => {
    if (revCount === 0) {
      return {
        bg: "bg-stone-800 text-stone-300 hover:bg-stone-700",
        label: "⬛ 0 बार (बाकी)",
      };
    }
    if (revCount === 1) {
      return {
        bg: "bg-rose-500 text-white hover:bg-rose-600",
        label: "🔴 1 बार",
      };
    }
    if (revCount <= 3) {
      return {
        bg: "bg-amber-400 text-stone-900 hover:bg-amber-500 font-bold",
        label: "🟡 2-3 बार",
      };
    }
    return {
      bg: "bg-emerald-500 text-white hover:bg-emerald-600 font-bold",
      label: "🟢 4+ बार",
    };
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Overall Mastery Banner */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/80 shadow-md glass-specular space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-stone-900 text-amber-400">
                <Grid3X3 className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                रिवीजन की स्थिति
              </h2>
              <InfoTip
                title="रिवीजन की स्थिति"
                content="यह ग्रिड दिखाता है कि आपका कौन-सा लेक्चर कितनी बार दोहराया गया है। 4+ बार (हरा) होने पर वह टॉपिक परीक्षा के लिए पूरी तरह पक्का माना जाता है।"
              />
            </div>
          </div>

          {/* Subject selector */}
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-medium text-stone-800 focus:bg-white truncate"
            >
              <option value="ALL">सभी विषय ({allSubjectNames.length} विषय)</option>
              {allSubjectNames.map((subName) => {
                const count = lectures.filter((l) => l.subject === subName).length;
                const cat = catalogSubjects.find((s) => s.name === subName);
                const chapterCount = cat ? cat.chapters.length : 0;
                return (
                  <option key={subName} value={subName}>
                    {subName} {count > 0 ? `(${count} लेक्चर्स)` : chapterCount > 0 ? `(0 लेक्चर्स • ${chapterCount} अध्याय)` : `(0)`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* 4-Color Scientific Legend & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-stone-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-400 font-bold block">⬛ 0 बार (बाकी)</span>
              <span className="text-lg font-extrabold font-mono text-stone-200">{count0}</span>
              <span className="text-[10px] text-stone-400 block">लेक्चर्स</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center font-bold text-xs text-stone-400">
              {totalLecs > 0 ? Math.round((count0 / totalLecs) * 100) : 0}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-rose-700 font-bold block">🔴 1 बार</span>
              <span className="text-lg font-extrabold font-mono text-rose-950">{count1}</span>
              <span className="text-[10px] text-rose-700 block">लेक्चर्स</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-rose-200 text-rose-900 flex items-center justify-center font-bold text-xs">
              {totalLecs > 0 ? Math.round((count1 / totalLecs) * 100) : 0}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-700 font-bold block">🟡 2-3 बार</span>
              <span className="text-lg font-extrabold font-mono text-amber-950">{count23}</span>
              <span className="text-[10px] text-amber-700 block">लेक्चर्स</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-950 flex items-center justify-center font-bold text-xs">
              {totalLecs > 0 ? Math.round((count23 / totalLecs) * 100) : 0}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-700 font-bold block">🟢 4+ बार (तैयार)</span>
              <span className="text-lg font-extrabold font-mono text-emerald-950">{count4Plus}</span>
              <span className="text-[10px] text-emerald-700 block">मजबूत पकड़</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-950 flex items-center justify-center font-bold text-xs">
              {masteryPercent}%
            </div>
          </div>
        </div>

      </div>

      {/* Chapter-wise Frequency Grid Matrix */}
      <div className="space-y-3">
        {Object.keys(chaptersMap).length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
            <h4 className="text-sm font-bold text-stone-800">
              {selectedSubject !== "ALL" 
                ? `विषय '${selectedSubject}' में अभी कोई लेक्चर नहीं है`
                : "कोई लेक्चर उपलब्ध नहीं है"}
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              आप 'नया लेक्चर जोड़ें' से इसमें लेक्चर जोड़ सकते हैं या नैवबार के '21 विषय' बटन से अध्याय सूची देख सकते हैं।
            </p>
          </div>
        ) : (
          Object.entries(chaptersMap).map(([chapterName, chapterLectures]) => {
          const chTotal = chapterLectures.length;
          const chMastered = chapterLectures.filter((l) => l.revisionCount >= 4).length;
          const chZero = chapterLectures.filter((l) => l.revisionCount === 0).length;
          const chPct = chTotal > 0 ? Math.round((chMastered / chTotal) * 100) : 0;

          return (
            <div
              key={chapterName}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                    <span>{chapterName}</span>
                    <span 
                      title={chapterName}
                      className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200"
                    >
                      {getShortChapterName(chapterName)}
                    </span>
                    <span className="text-xs text-stone-400 font-normal">
                      ({chTotal} लेक्चर्स)
                    </span>
                  </h3>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  {chZero > 0 && (
                    <span className="text-stone-500 font-medium">
                      ⬛ {chZero} बाकी
                    </span>
                  )}
                  <span className="text-emerald-700 font-bold">
                    🟢 {chMastered} तैयार ({chPct}%)
                  </span>

                  {/* Progress bar */}
                  <div className="w-16 sm:w-20 bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${chPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Lecture frequency blocks */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {chapterLectures
                  .sort((a, b) => a.lectureNumber - b.lectureNumber)
                  .map((lec) => {
                    const style = getCellColor(lec.revisionCount);
                    return (
                      <button
                        key={lec.id}
                        type="button"
                        onMouseEnter={() => setHoveredLecture(lec)}
                        onClick={() => onStartRevision(lec)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-2xs ${style.bg}`}
                        title={`${lec.title} • ${lec.revisionCount} बार रिवीज़न`}
                      >
                        <span className="text-[9px] font-mono leading-none opacity-90 font-bold">Lec {lec.lectureNumber}</span>
                        <span className="text-xs font-extrabold font-mono leading-tight">{lec.revisionCount}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        }))}
      </div>

      {/* Hovered Lecture Preview Bar */}
      {hoveredLecture && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-stone-700 flex items-center space-x-3 max-w-lg w-[90%] animate-in fade-in">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-amber-400 font-bold truncate flex items-center gap-1.5">
              <span>{getShortChapterName(hoveredLecture.chapter)}</span>
              <span>•</span>
              <span>Lec {hoveredLecture.lectureNumber}</span>
              <span className="text-stone-400 font-normal">({hoveredLecture.subject})</span>
            </div>
            <div className="text-xs font-semibold truncate text-white">
              {getLectureDisplayName(hoveredLecture.lectureNumber, hoveredLecture.title)}
            </div>
            <div className="text-[11px] text-stone-400">
              रिवीज़न: {hoveredLecture.revisionCount} बार | औसत: ~{hoveredLecture.avgTimeMinutes}m
            </div>
          </div>

          <button
            onClick={() => onStartRevision(hoveredLecture)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center space-x-1 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-stone-950" />
            <span>रिवीज़न</span>
          </button>
        </div>
      )}

    </div>
  );
};
