import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Bot, 
  Edit3, 
  Sparkles, 
  Tag, 
  ExternalLink,
  Plus,
  Trash2,
  Share2,
  Bookmark
} from "lucide-react";
import { DifficultyRating, LectureItem, ReferenceLink } from "../types";
import { formatHindiDate } from "../utils/revisionEngine";
import { triggerHaptic } from "../utils/haptics";

interface TopicDetailViewProps {
  lecture: LectureItem;
  onGoBack: () => void;
  onStartRevision: (lecture: LectureItem) => void;
  onAskGemini: (lecture: LectureItem) => void;
  onUpdateLecture?: (updated: LectureItem) => void;
  backTitle?: string;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  lecture,
  onGoBack,
  onStartRevision,
  onAskGemini,
  onUpdateLecture,
  backTitle = "वापस",
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "tricks" | "history">("overview");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(lecture.conceptNotes || "");
  const [tricksText, setTricksText] = useState(lecture.calculationTricks || "");
  const [mistakesText, setMistakesText] = useState(lecture.previousMistakes || "");
  const [isFlagged, setIsFlagged] = useState(lecture.lastRating === "Hard");

  useEffect(() => {
    setNotesText(lecture.conceptNotes || "");
    setTricksText(lecture.calculationTricks || "");
    setMistakesText(lecture.previousMistakes || "");
    setIsFlagged(lecture.lastRating === "Hard");
    setIsEditingNotes(false);
  }, [lecture.id, lecture.conceptNotes, lecture.calculationTricks, lecture.previousMistakes, lecture.lastRating]);

  const handleSaveNotes = () => {
    triggerHaptic(10);
    if (onUpdateLecture) {
      onUpdateLecture({
        ...lecture,
        conceptNotes: notesText,
        calculationTricks: tricksText,
        previousMistakes: mistakesText,
      });
    }
    setIsEditingNotes(false);
  };

  const getStatusBadge = () => {
    if (lecture.status === "completed" || lecture.revisionCount >= 4) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          पक्का / पूर्ण ({lecture.revisionCount} बार)
        </span>
      );
    }
    if (lecture.lastRating === "Hard") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          कठिन / संशय
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-amber-700" />
        अगला रिवीज़न: {formatHindiDate(lecture.nextDueDate)}
      </span>
    );
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top App Header & Breadcrumb */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(8);
              onGoBack();
            }}
            aria-label="वापस जाएं"
            className="h-8 w-8 sm:w-auto px-0 sm:px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-stone-200 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">{backTitle}</span>
          </button>

          {/* Breadcrumb path: Subject / Chapter / Lecture */}
          <div className="min-w-0 flex items-center text-xs text-stone-500 truncate">
            <span className="font-semibold text-stone-700 truncate">{lecture.subject}</span>
            <span className="mx-1.5 text-stone-400">/</span>
            <span className="truncate">{lecture.chapter}</span>
          </div>
        </div>

        {/* Primary Action: Start Revision */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              onStartRevision(lecture);
            }}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>रिवीज़न सत्र शुरू करें</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(8);
              onAskGemini(lecture);
            }}
            title="AI डाउट असिस्टेंट"
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-purple-700 transition-all active:scale-95"
          >
            <Bot className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Topic Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-stone-100 text-stone-700 border border-stone-200">
                Lec #{lecture.lectureNumber}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                जोड़ा गया: {formatHindiDate(lecture.addedDate)}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
              {lecture.title}
            </h1>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 block">कुल रिवीज़न</span>
            <span className="text-base sm:text-lg font-black text-stone-900">{lecture.revisionCount} बार</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 block">औसत समय</span>
            <span className="text-base sm:text-lg font-black text-stone-900">{lecture.avgTimeMinutes || 25} मिनट</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 block">पिछली रेटिंग</span>
            <span className="text-base sm:text-lg font-black text-stone-900">
              {lecture.lastRating === "Easy" ? "सरल (पक्का)" : lecture.lastRating === "Medium" ? "मध्यम" : lecture.lastRating === "Hard" ? "कठिन (संशय)" : "प्रारंभिक"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 block">फ़ाउंडेशन स्टेप्स</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${lecture.step1Completed ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
                1-दिन: {lecture.step1Completed ? "पूर्ण" : "लंबित"}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${lecture.step2Completed ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
                3-दिन: {lecture.step2Completed ? "पूर्ण" : "लंबित"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs inside Detail Screen: Overview | Notes | Calculation Tricks | Past History */}
        <div className="border-b border-stone-200 flex space-x-4 pt-3 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-stone-900 text-stone-900 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            अवलोकन (Overview)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "notes"
                ? "border-stone-900 text-stone-900 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            स्टडी नोट्स व सूत्र
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tricks")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "tricks"
                ? "border-stone-900 text-stone-900 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            शॉर्ट ट्रिक्स व गलतियाँ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "history"
                ? "border-stone-900 text-stone-900 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            रिवीज़न इतिहास ({lecture.revisionLogs?.length || 0})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                मुख्य विचार व कॉन्सेप्ट सारांश
              </h3>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {lecture.conceptNotes || "इस टॉपिक के लिए अभी कोई मुख्य सारांश नहीं लिखा गया है। नोट्स टैब में जाकर अपने मुख्य बिंदु दर्ज करें!"}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  onStartRevision(lecture);
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                रिवीज़न शुरू करें
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 border border-stone-200"
              >
                <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                नोट्स संपादित करें
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Notes Editor */}
        {activeTab === "notes" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                कॉन्सेप्ट व फॉर्मूला नोट्स
              </h3>
              {!isEditingNotes ? (
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(true)}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  एडिट करें
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  सुरक्षित करें
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="यहाँ मुख्य फॉर्मूले, परिभाषाएँ और कॉन्सेप्ट्स लिखें..."
                rows={8}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium text-stone-900 bg-stone-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all leading-relaxed"
              />
            ) : (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-medium min-h-[120px]">
                {notesText || "यहाँ अभी कोई नोट्स नहीं हैं। 'एडिट करें' बटन पर क्लिक करके नोट्स जोड़ें!"}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Calculation Tricks & Past Mistakes */}
        {activeTab === "tricks" && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-2">
              <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                कैलकुलेशन शॉर्ट ट्रिक्स
              </h3>
              <textarea
                value={tricksText}
                onChange={(e) => setTricksText(e.target.value)}
                onBlur={handleSaveNotes}
                placeholder="उदा. डिजिटल सम, 1/7 का मान = 14.28%, 25 से गुणा करने पर 4 से भाग..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-purple-200 text-xs text-stone-900 bg-white focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-2">
              <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                पिछली गलतियाँ व एग्ज़ाम ट्रैप्स (Mistake Bank)
              </h3>
              <textarea
                value={mistakesText}
                onChange={(e) => setMistakesText(e.target.value)}
                onBlur={handleSaveNotes}
                placeholder="उदा. ब्याज की दर अर्धवार्षिक होने पर r/2 करना भूल जाते हैं..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-rose-200 text-xs text-stone-900 bg-white focus:ring-2 focus:ring-rose-200 outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Chronological Revision History */}
        {activeTab === "history" && (
          <div className="space-y-3 pt-2">
            {!lecture.revisionLogs || lecture.revisionLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
                अभी तक कोई पिछला रिवीज़न सत्र दर्ज नहीं हुआ है। जब आप इस टॉपिक को रिवीज़न करेंगे, तो समय व रेटिंग का इतिहास यहाँ अपने आप सुरक्षित होगा।
              </div>
            ) : (
              <div className="space-y-2">
                {lecture.revisionLogs.map((log, index) => (
                  <div
                    key={log.id || index}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-[10px]">
                        #{log.attemptNumber || index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-stone-900 block">{formatHindiDate(log.date)}</span>
                        <span className="text-[11px] text-stone-500">लगा समय: {log.timeSpentMinutes} मिनट</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.difficultyRating === "Easy"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.difficultyRating === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {log.difficultyRating || "पक्का"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
