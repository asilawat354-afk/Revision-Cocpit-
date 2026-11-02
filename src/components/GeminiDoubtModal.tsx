import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  BookOpen, 
  Check, 
  AlertCircle,
  Copy,
  Save,
  Loader2
} from "lucide-react";
import { LectureItem } from "../types";
import { getShortChapterName } from "../utils/formatters";

interface GeminiDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureItem | null;
  onSaveNotesToLecture: (lectureId: string, notes: string) => void;
}

export const GeminiDoubtModal: React.FC<GeminiDoubtModalProps> = ({
  isOpen,
  onClose,
  lecture,
  onSaveNotesToLecture,
}) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (lecture) {
      const defaultQ = lecture.geminiDoubts
        ? `कृपया इस लेक्चर के कठिन प्रश्नों को समझाएं: ${lecture.geminiDoubts}। विशेषकर शॉर्टकट ट्रिक और डिजिटल सम / रेशियो मेथड बताएं।`
        : `इस अध्याय '${lecture.chapter}' के मुख्य कॉन्सेप्ट, ट्रिक्स और परीक्षा में समय बचाने वाले तरीके समझाएं।`;
      setQuery(defaultQ);
      setAnswer("");
      setError("");
      setSaved(false);
    }
  }, [lecture]);

  if (!isOpen) return null;

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setLoading(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/gemini/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionQuery: q,
          subject: lecture?.subject || "अंकगणित",
          chapter: lecture?.chapter || "गणित",
          lecture: lecture?.title || "N/A",
          contextType: "Competitive Exam Doubt & Shortcut",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gemini से उत्तर प्राप्त करने में त्रुटि।");
      }

      setAnswer(data.answer);
    } catch (err: any) {
      console.error("Gemini request error:", err);
      setError(err?.message || "नेटवर्क या सर्वर त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLecture = () => {
    if (lecture && answer) {
      const existing = lecture.conceptNotes ? `${lecture.conceptNotes}\n\n` : "";
      const updated = `${existing}[Gemini AI उत्तर]: ${answer.slice(0, 300)}...`;
      onSaveNotesToLecture(lecture.id, updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xl backdrop-saturate-150 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 glass-specular">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-start space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-900">
                  AI सहायता
                </span>
                {lecture && (
                  <span className="text-xs text-stone-600 font-medium">
                    <strong className="text-stone-900">{getShortChapterName(lecture.chapter)}</strong> • Lec {lecture.lectureNumber} ({lecture.subject})
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
                सवाल या शॉर्टकट पूछें
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="py-3 overflow-y-auto space-y-3.5 flex-1 pr-1">
          
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleAsk("इस टॉपिक को हल करने का सबसे तेज़ रेश्यो या एलिगेशन मेथड बताएं।")}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
            >
              ⚡ शॉर्टकट ट्रिक
            </button>
            <button
              onClick={() => handleAsk("डिजिटल सम (Digital Sum) और यूनिट डिजिट से विकल्पों को कैसे हटाएं?")}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
            >
              🔢 डिजिटल सम
            </button>
            <button
              onClick={() => handleAsk("इस अध्याय में छात्र अक्सर क्या गलती करते हैं और परीक्षा में क्या ध्यान रखें?")}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
            >
              ⚠️ आम गलतियाँ
            </button>
          </div>

          {/* Question Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">
              आपका सवाल:
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="यहाँ अपना सवाल लिखें..."
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                disabled={loading || !query.trim()}
                onClick={() => handleAsk()}
                className="absolute right-2 bottom-2 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1 transition-colors shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                    <span>पूछ रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 text-amber-400" />
                    <span>पूछें</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error display with Retry button */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => handleAsk()}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs transition-colors"
              >
                पुनः प्रयास
              </button>
            </div>
          )}

          {/* Answer display */}
          {answer && (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  समाधान
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleCopy}
                    className="px-2 py-1 rounded-md text-[11px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "कॉपी हुआ" : "कॉपी"}</span>
                  </button>

                  {lecture && (
                    <button
                      onClick={handleSaveToLecture}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold text-sky-700 hover:text-sky-900 hover:bg-sky-100 flex items-center gap-1 transition-colors"
                    >
                      {saved ? <Check className="w-3 h-3 text-emerald-600" /> : <Save className="w-3 h-3" />}
                      <span>{saved ? "सहेजा गया!" : "नोट्स में जोड़ें"}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-stone-800 whitespace-pre-wrap leading-relaxed space-y-2">
                {answer}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 pt-3 flex items-center justify-end text-xs text-stone-500">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-stone-700 hover:bg-stone-100 font-medium"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
