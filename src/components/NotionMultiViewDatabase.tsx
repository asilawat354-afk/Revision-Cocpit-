import React, { useState } from "react";
import { 
  Columns3, 
  CreditCard, 
  Table, 
  ListFilter, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  Sparkles
} from "lucide-react";
import { LectureItem, DifficultyRating } from "../types";
import { triggerHaptic } from "../utils/haptics";
import { soundFx } from "../utils/soundEffects";
import { formatHindiDate } from "../utils/revisionEngine";

interface NotionMultiViewDatabaseProps {
  lectures: LectureItem[];
  onOpenLectureModal: (lecture: LectureItem) => void;
  onMarkComplete: (lecture: LectureItem) => void;
}

export type DatabaseViewType = "board" | "flashcards" | "table" | "feed";

export const NotionMultiViewDatabase: React.FC<NotionMultiViewDatabaseProps> = ({
  lectures,
  onOpenLectureModal,
  onMarkComplete,
}) => {
  const [viewType, setViewType] = useState<DatabaseViewType>("board");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    triggerHaptic(8);
    soundFx.playApplePop();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const dueTodayLectures = lectures.filter((l) => l.status === "due_today" || l.status === "active");
  const step1Lectures = lectures.filter((l) => !l.step1Completed && l.status !== "archived");
  const step2Lectures = lectures.filter((l) => l.step1Completed && !l.step2Completed && l.status !== "archived");
  const masteredLectures = lectures.filter((l) => l.revisionCount >= 3 && l.status !== "archived");

  return (
    <div className="space-y-4">
      {/* Notion Top View Selector Bar */}
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5 flex-wrap gap-2">
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setViewType("board");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              viewType === "board"
                ? "bg-white text-stone-950 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Notion बोर्ड (Kanban)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setViewType("flashcards");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              viewType === "flashcards"
                ? "bg-white text-stone-950 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>फ़्लैशकार्ड गैलरी</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(6);
              setViewType("table");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              viewType === "table"
                ? "bg-white text-stone-950 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>स्मार्ट स्प्रेडशीट</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          कुल <span className="font-bold text-stone-900">{lectures.length}</span> लेक्चर्स
        </div>
      </div>

      {/* VIEW 1: NOTION KANBAN BOARD */}
      {viewType === "board" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start">
          
          {/* Column 1: Due Today */}
          <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center justify-between font-extrabold text-xs text-amber-950 pb-1 border-b border-amber-200/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>आज देय (Due Today)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px]">
                {dueTodayLectures.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-0.5">
              {dueTodayLectures.slice(0, 10).map((l) => (
                <div
                  key={l.id}
                  onClick={() => onOpenLectureModal(l)}
                  className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                    {l.subject}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 leading-snug line-clamp-2 group-hover:text-amber-900">
                    {l.title}
                  </h4>
                  <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                    <span>Lec #{l.lectureNumber}</span>
                    <span className="font-semibold text-amber-700">रिवीज़न #{l.revisionCount + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: 1-Day Foundation */}
          <div className="bg-blue-50/60 rounded-2xl p-3 border border-blue-200/80 space-y-2.5">
            <div className="flex items-center justify-between font-extrabold text-xs text-blue-950 pb-1 border-b border-blue-200/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>चरण 1 (1-Day फ़ाउंडेशन)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-200 text-blue-950 font-black text-[10px]">
                {step1Lectures.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-0.5">
              {step1Lectures.slice(0, 10).map((l) => (
                <div
                  key={l.id}
                  onClick={() => onOpenLectureModal(l)}
                  className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                    {l.subject}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 leading-snug line-clamp-2">
                    {l.title}
                  </h4>
                  <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                    <span>1st दोहराव अनिवार्य</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: 3-Day Foundation */}
          <div className="bg-purple-50/60 rounded-2xl p-3 border border-purple-200/80 space-y-2.5">
            <div className="flex items-center justify-between font-extrabold text-xs text-purple-950 pb-1 border-b border-purple-200/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>चरण 2 (3-Day फ़ाउंडेशन)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-200 text-purple-950 font-black text-[10px]">
                {step2Lectures.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-0.5">
              {step2Lectures.slice(0, 10).map((l) => (
                <div
                  key={l.id}
                  onClick={() => onOpenLectureModal(l)}
                  className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded">
                    {l.subject}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 leading-snug line-clamp-2">
                    {l.title}
                  </h4>
                  <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                    <span>पक्का होने की राह पर</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Mastered */}
          <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center justify-between font-extrabold text-xs text-emerald-950 pb-1 border-b border-emerald-200/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>पक्के लेक्चर्स (Mastered)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[10px]">
                {masteredLectures.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-0.5">
              {masteredLectures.slice(0, 10).map((l) => (
                <div
                  key={l.id}
                  onClick={() => onOpenLectureModal(l)}
                  className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {l.subject}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 mt-1 leading-snug line-clamp-2">
                    {l.title}
                  </h4>
                  <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{l.revisionCount}x रिवीज़न पूरा</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: FLASHCARD GALLERY */}
      {viewType === "flashcards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lectures.slice(0, 12).map((l) => {
            const isFlipped = !!flippedCards[l.id];
            return (
              <div
                key={l.id}
                onClick={() => toggleFlip(l.id)}
                className="h-52 rounded-2xl border-2 border-stone-200/90 bg-white shadow-xs p-4 flex flex-col justify-between cursor-pointer select-none transition-all hover:border-amber-400 relative overflow-hidden"
              >
                {!isFlipped ? (
                  // Front Side
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10.5px] text-stone-500 font-semibold mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 font-bold text-stone-800">
                          {l.subject}
                        </span>
                        <span>#{l.lectureNumber}</span>
                      </div>
                      <h3 className="text-sm font-black text-stone-900 mt-2 leading-snug">
                        {l.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        अध्याय: {l.chapter}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-amber-700 font-bold">
                      <span className="flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>पलटें (ट्रिक्स व नोट्स देखें)</span>
                      </span>
                      <span>Next: {formatHindiDate(l.nextDueDate)}</span>
                    </div>
                  </div>
                ) : (
                  // Back Side
                  <div className="h-full flex flex-col justify-between bg-amber-50/70 -m-4 p-4 rounded-2xl animate-in zoom-in-95 duration-150">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                        ट्रिक्स व पिछला अनुभव
                      </span>
                      <p className="text-xs text-stone-800 mt-2 font-medium leading-relaxed">
                        {l.calculationTricks || l.previousMistakes || l.conceptNotes || "कोई विशेष नोट नहीं है। लेक्चर विस्तार में जाकर ट्रिक्स जोड़ें!"}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLectureModal(l);
                        }}
                        className="font-bold text-amber-950 underline"
                      >
                        पूरा विवरण खोलें
                      </button>
                      <span className="text-[10px] text-stone-500">टैप करके वापस पलटें</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: SMART TABLE VIEW */}
      {viewType === "table" && (
        <div className="border border-stone-200 rounded-2xl overflow-x-auto bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">विषय व अध्याय</th>
                <th className="py-2.5 px-3">शीर्षक</th>
                <th className="py-2.5 px-3">स्थिति</th>
                <th className="py-2.5 px-3">अगला दोहराव</th>
                <th className="py-2.5 px-3 text-right">क्रिया</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {lectures.slice(0, 15).map((l) => (
                <tr 
                  key={l.id} 
                  onClick={() => onOpenLectureModal(l)}
                  className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-500">
                    {l.lectureNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-stone-900 block">{l.subject}</span>
                    <span className="text-[10.5px] text-stone-500">{l.chapter}</span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-stone-800 max-w-xs truncate">
                    {l.title}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      l.status === "due_today"
                        ? "bg-amber-100 text-amber-900"
                        : l.status === "completed"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-stone-100 text-stone-700"
                    }`}>
                      {l.status === "due_today" ? "आज देय" : l.status === "completed" ? "सम्पन्न" : "निर्धारित"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">
                    {formatHindiDate(l.nextDueDate)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkComplete(l);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-600 hover:text-white font-bold text-[11px] transition-colors"
                    >
                      पूर्ण करें
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
