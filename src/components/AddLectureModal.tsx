import React, { useState, useEffect } from "react";
import { 
  Plus, 
  X, 
  BookOpen, 
  Layers, 
  Clock, 
  HelpCircle,
  Sparkles
} from "lucide-react";
import { LectureItem } from "../types";
import { COMPETITIVE_SUBJECTS, TODAY_STR } from "../data/initialData";
import { getChaptersForSubject } from "../data/subjectChapterCatalog";
import { addDays } from "../utils/revisionEngine";

interface AddLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newLecture: LectureItem) => void;
  initialSubject?: string;
  initialChapter?: string;
}

export const AddLectureModal: React.FC<AddLectureModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialSubject,
  initialChapter,
}) => {
  const [subject, setSubject] = useState<string>("Maths- (Arithmetic)");
  const [chapter, setChapter] = useState<string>("Ratio & Proportion");
  const [lectureNumber, setLectureNumber] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [avgTime, setAvgTime] = useState<number>(20);
  const [geminiDoubts, setGeminiDoubts] = useState<string>("");
  const [conceptNotes, setConceptNotes] = useState<string>("");
  const [calculationTricks, setCalculationTricks] = useState<string>("");

  const availableChapters = getChaptersForSubject(subject);

  // Sync initialSubject and initialChapter when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialSubject) {
        setSubject(initialSubject);
        const chaptersForSub = getChaptersForSubject(initialSubject);
        if (initialChapter) {
          setChapter(initialChapter);
        } else if (chaptersForSub.length > 0) {
          setChapter(chaptersForSub[0]);
        }
      } else if (initialChapter) {
        setChapter(initialChapter);
      }
      setTitle("");
      setGeminiDoubts("");
      setConceptNotes("");
      setCalculationTricks("");
    }
  }, [isOpen, initialSubject, initialChapter]);

  useEffect(() => {
    if (availableChapters.length > 0 && !availableChapters.includes(chapter)) {
      if (!initialChapter || initialChapter !== chapter) {
        setChapter(availableChapters[0]);
      }
    }
  }, [subject]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter.trim()) return;

    const finalTitle = title.trim() || `Lec ${lectureNumber}`;

    const newItem: LectureItem = {
      id: `lec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      addedDate: TODAY_STR,
      subject,
      chapter: chapter.trim(),
      lectureNumber,
      title: finalTitle,
      step1Completed: false,
      step2Completed: false,
      revisionCount: 0,
      minTimeMinutes: Math.max(5, avgTime - 5),
      avgTimeMinutes: avgTime,
      maxTimeMinutes: avgTime + 10,
      status: "due_today", // Foundation 1-Day due right away or next day
      nextDueDate: addDays(TODAY_STR, 1),
      geminiDoubts: geminiDoubts.trim() || undefined,
      conceptNotes: conceptNotes.trim() || undefined,
      calculationTricks: calculationTricks.trim() || undefined,
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xl backdrop-saturate-150 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 glass-specular">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-stone-900 text-amber-400 font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                नया लेक्चर जोड़ें
              </h2>
              <p className="text-xs text-stone-500">
                1 दिन बाद पहला रिवीज़न तय होगा।
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-3 space-y-3 overflow-y-auto flex-1 text-xs">
          
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-stone-700 block mb-1">विषय (Subject):</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-medium"
              >
                {COMPETITIVE_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.nameHindi}>
                    {s.nameHindi} ({s.chaptersCount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">लेक्चर नंबर:</label>
              <input
                type="number"
                min="1"
                max="300"
                value={lectureNumber}
                onChange={(e) => setLectureNumber(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">अध्याय (Chapter):</label>
            {availableChapters.length > 0 ? (
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
              >
                {availableChapters.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="उदा. Ratio & Proportion, Percentage..."
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            )}
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">लेक्चर शीर्षक / टॉपिक:</label>
            <input
              type="text"
              placeholder={`Lec ${lectureNumber} (या कोई विशेष टॉपिक)`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-stone-700 block mb-1">समय (मिनट):</label>
              <input
                type="number"
                min="5"
                max="120"
                value={avgTime}
                onChange={(e) => setAvgTime(parseInt(e.target.value) || 20)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">ट्रिक या शॉर्टकट:</label>
              <input
                type="text"
                placeholder="उदा. Digital Sum / Ratio"
                value={calculationTricks}
                onChange={(e) => setCalculationTricks(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">कठिन प्रश्न / डाउट्स:</label>
            <input
              type="text"
              placeholder="उदा. Q45, Q48"
              value={geminiDoubts}
              onChange={(e) => setGeminiDoubts(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-900"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">नोट्स (वैकल्पिक):</label>
            <textarea
              rows={2}
              placeholder="महत्वपूर्ण फॉर्मूले या बिंदु..."
              value={conceptNotes}
              onChange={(e) => setConceptNotes(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-white text-stone-900"
            />
          </div>

          <div className="border-t border-stone-100 pt-3 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl font-medium text-stone-600 hover:bg-stone-100"
            >
              रद्द करें
            </button>

            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl font-bold bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
            >
              सहेजें
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
