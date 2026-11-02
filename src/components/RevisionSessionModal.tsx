import React, { useState, useEffect, useMemo } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  X, 
  BookOpen, 
  HelpCircle, 
  TrendingUp, 
  AlertCircle, 
  History, 
  Lightbulb, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Link as LinkIcon,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Filter,
  Check,
  Calendar,
  Layers,
  FileText
} from "lucide-react";
import { DifficultyRating, LectureItem, ReferenceLink, RevisionLogEntry } from "../types";
import { calculateNextRevision, formatHindiDate } from "../utils/revisionEngine";
import { getShortChapterName, getLectureDisplayName } from "../utils/formatters";
import { InfoTip } from "./InfoTip";

interface RevisionSessionModalProps {
  lecture: LectureItem | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    lectureId: string, 
    timeSpentMinutes: number, 
    rating?: DifficultyRating,
    remindersData?: {
      previousMistakes?: string;
      calculationTricks?: string;
      referenceLinks?: ReferenceLink[];
      comprehensionLevel?: "पक्का" | "सामान्य" | "संशय";
    }
  ) => void;
  onDeleteLog?: (lectureId: string, logId: string) => void;
  onToggleHideLog?: (lectureId: string, logId: string) => void;
  onAskGemini: (lecture: LectureItem) => void;
}

export const RevisionSessionModal: React.FC<RevisionSessionModalProps> = ({
  lecture,
  isOpen,
  onClose,
  onComplete,
  onDeleteLog,
  onToggleHideLog,
  onAskGemini,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [manualMinutes, setManualMinutes] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<DifficultyRating | undefined>(undefined);
  
  // Fullscreen toggle state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Filter for past history (All / Mistakes / Tricks / Links)
  const [historyFilter, setHistoryFilter] = useState<"all" | "mistakes" | "tricks" | "links">("all");
  const [showHiddenEntries, setShowHiddenEntries] = useState<boolean>(false);

  // Delete confirmation state
  const [confirmDeleteLogId, setConfirmDeleteLogId] = useState<string | null>(null);

  // Current session new inputs (appended to history)
  const [currentMistakesInput, setCurrentMistakesInput] = useState<string>("");
  const [currentTricksInput, setCurrentTricksInput] = useState<string>("");
  const [currentLinks, setCurrentLinks] = useState<ReferenceLink[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState<string>("");
  const [newLinkUrl, setNewLinkUrl] = useState<string>("");
  const [showAddLinkForm, setShowAddLinkForm] = useState<boolean>(false);
  const [comprehension, setComprehension] = useState<"पक्का" | "सामान्य" | "संशय">("पक्का");

  useEffect(() => {
    if (lecture) {
      setSeconds(0);
      setIsRunning(true);
      setManualMinutes(String(lecture.avgTimeMinutes || 15));
      setSelectedRating(lecture.lastRating || "Medium");
      setCurrentMistakesInput("");
      setCurrentTricksInput("");
      setCurrentLinks([]);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setShowAddLinkForm(false);
      setConfirmDeleteLogId(null);
      setComprehension(lecture.comprehensionLevel || "पक्का");
    }
  }, [lecture]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Collect all historical revision logs
  const pastLogs: RevisionLogEntry[] = useMemo(() => {
    if (!lecture) return [];
    if (lecture.revisionLogs && lecture.revisionLogs.length > 0) {
      return [...lecture.revisionLogs].sort((a, b) => b.attemptNumber - a.attemptNumber);
    }
    // Fallback if legacy item has singular fields
    if (lecture.previousMistakes || lecture.calculationTricks || (lecture.referenceLinks && lecture.referenceLinks.length > 0)) {
      return [{
        id: "legacy-log-1",
        attemptNumber: lecture.revisionCount || 1,
        date: lecture.lastRevisionDate || lecture.addedDate,
        timeSpentMinutes: lecture.avgTimeMinutes || 15,
        difficultyRating: lecture.lastRating,
        comprehensionLevel: lecture.comprehensionLevel || "पक्का",
        mistakes: lecture.previousMistakes,
        tricks: lecture.calculationTricks,
        links: lecture.referenceLinks,
        isHidden: false
      }];
    }
    return [];
  }, [lecture]);

  // Filter logs based on selection
  const filteredLogs = useMemo(() => {
    return pastLogs.filter((log) => {
      if (!showHiddenEntries && log.isHidden) return false;
      if (historyFilter === "mistakes") return Boolean(log.mistakes && log.mistakes.trim());
      if (historyFilter === "tricks") return Boolean(log.tricks && log.tricks.trim());
      if (historyFilter === "links") return Boolean(log.links && log.links.length > 0);
      return true;
    });
  }, [pastLogs, historyFilter, showHiddenEntries]);

  if (!isOpen || !lecture) return null;

  const timerMinutes = Math.max(1, Math.round(seconds / 60));
  const finalMinutes = isRunning || seconds > 30 ? timerMinutes : (parseInt(manualMinutes) || lecture.avgTimeMinutes || 15);

  const isFoundationPhase = !lecture.step1Completed || !lecture.step2Completed;
  const currentStep = !lecture.step1Completed ? "1-Day Foundation" : !lecture.step2Completed ? "3-Day Foundation" : "Rated";

  const nextPreview = calculateNextRevision(lecture, selectedRating);

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    let formattedUrl = newLinkUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }
    const newEntry: ReferenceLink = {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim() || formattedUrl,
      url: formattedUrl,
    };
    setCurrentLinks((prev) => [...prev, newEntry]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setShowAddLinkForm(false);
  };

  const handleRemoveCurrentLink = (linkId: string) => {
    setCurrentLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  const handleFinish = () => {
    onComplete(
      lecture.id, 
      finalMinutes, 
      isFoundationPhase ? undefined : selectedRating,
      {
        previousMistakes: currentMistakesInput.trim(),
        calculationTricks: currentTricksInput.trim(),
        referenceLinks: currentLinks,
        comprehensionLevel: comprehension,
      }
    );
    onClose();
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Historical Baseline metrics
  const attempts = lecture.revisionCount;
  const bestTime = lecture.minTimeMinutes > 0 ? lecture.minTimeMinutes : lecture.avgTimeMinutes;
  const maxTime = lecture.maxTimeMinutes > 0 ? lecture.maxTimeMinutes : Math.round(lecture.avgTimeMinutes * 1.3);
  const typicalRange = attempts > 0 ? `${bestTime} - ${maxTime} मिनट` : `~${lecture.avgTimeMinutes} मिनट`;
  const nextAttemptNumber = attempts + 1;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/60 backdrop-blur-xl backdrop-saturate-150 transition-all ${isFullscreen ? "p-0" : ""}`}>
      <div className={`bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/80 overflow-hidden flex flex-col transition-all duration-200 glass-specular ${
        isFullscreen 
          ? "w-full h-full rounded-none" 
          : "max-w-4xl w-full rounded-3xl max-h-[92vh]"
      }`}>
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 bg-stone-50/70">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-stone-200/80 text-stone-800">
              {lecture.subject}
            </span>
            <span 
              title={lecture.chapter}
              className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200"
            >
              {getShortChapterName(lecture.chapter)}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-stone-900 text-white">
              L-{String(lecture.lectureNumber).padStart(2, "0")}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              • कुल पिछली बारियाँ: <strong>{attempts}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
              title={isFullscreen ? "छोटे पर्दे में करें" : "बड़े पर्दे में खोलें (Fullscreen)"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title row */}
        <div className="px-4 py-2.5 bg-white border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            {getLectureDisplayName(lecture.lectureNumber, lecture.title)}
          </h2>

          {/* Quick Baseline Box */}
          <div className="flex items-center space-x-3 text-xs text-stone-600">
            <span>सर्वश्रेष्ठ: <strong className="text-emerald-700">{bestTime}m</strong></span>
            <span>औसत: <strong className="text-stone-900">{lecture.avgTimeMinutes}m</strong></span>
            <span>रेंज: <strong className="text-amber-800">{typicalRange}</strong></span>
          </div>
        </div>

        {/* Content Area (Two Columns in Fullscreen / Large screens) */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT COLUMN: All Historical Attempts & Reminders (6 or 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Past History Header & Filter Controls */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <History className="w-4 h-4 text-stone-700" />
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    पिछली सभी बारियों का इतिहास ({pastLogs.length})
                  </h3>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setHistoryFilter("all")}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      historyFilter === "all" ? "bg-stone-900 text-white font-bold" : "bg-white text-stone-600 border border-stone-200"
                    }`}
                  >
                    सभी
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter("mistakes")}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      historyFilter === "mistakes" ? "bg-stone-900 text-white font-bold" : "bg-white text-stone-600 border border-stone-200"
                    }`}
                  >
                    कठिनाइयां ({pastLogs.filter(l => l.mistakes?.trim()).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter("tricks")}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      historyFilter === "tricks" ? "bg-stone-900 text-white font-bold" : "bg-white text-stone-600 border border-stone-200"
                    }`}
                  >
                    ट्रिक्स ({pastLogs.filter(l => l.tricks?.trim()).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter("links")}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      historyFilter === "links" ? "bg-stone-900 text-white font-bold" : "bg-white text-stone-600 border border-stone-200"
                    }`}
                  >
                    लिंक्स ({pastLogs.filter(l => l.links && l.links.length > 0).length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowHiddenEntries(!showHiddenEntries)}
                    className="p-1 rounded text-stone-500 hover:text-stone-900 ml-1"
                    title={showHiddenEntries ? "छिपाए गए रिकॉर्ड छुपाएं" : "छिपाए गए रिकॉर्ड भी देखें"}
                  >
                    {showHiddenEntries ? <Eye className="w-3.5 h-3.5 text-sky-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Past Revision Cards List */}
              {filteredLogs.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center border border-dashed border-stone-200">
                  <p className="text-xs text-stone-500">
                    {pastLogs.length === 0 
                      ? "इस लेक्चर का अभी कोई पिछला इतिहास नहीं है। नीचे दिए गए बॉक्स में आज का अनुभव दर्ज करें।"
                      : "चुने गए फ़िल्टर में कोई रिकॉर्ड नहीं मिला।"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((entry) => {
                    const isConfirmingDelete = confirmDeleteLogId === entry.id;

                    return (
                      <div 
                        key={entry.id}
                        className={`bg-white rounded-xl border p-3 space-y-2.5 transition-all shadow-2xs ${
                          entry.isHidden ? "opacity-60 bg-stone-50 border-stone-200" : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {/* Entry Header */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200">
                              रिवीज़न बारी #{entry.attemptNumber}
                            </span>
                            <span className="text-[11px] text-stone-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-stone-400" />
                              {formatHindiDate(entry.date)}
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium">
                              • {entry.timeSpentMinutes} मिनट
                            </span>
                            {entry.difficultyRating && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                                {entry.difficultyRating}
                              </span>
                            )}
                          </div>

                          {/* Item Actions (Hide / Delete) */}
                          <div className="flex items-center space-x-1">
                            {onToggleHideLog && (
                              <button
                                type="button"
                                onClick={() => onToggleHideLog(lecture.id, entry.id)}
                                className="p-1 rounded text-stone-400 hover:text-stone-700"
                                title={entry.isHidden ? "दिखाएं" : "छिपाएं"}
                              >
                                {entry.isHidden ? <EyeOff className="w-3.5 h-3.5 text-stone-400" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            {onDeleteLog && (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteLogId(entry.id)}
                                className="p-1 rounded text-stone-400 hover:text-rose-600"
                                title="इस बारी का रिकॉर्ड हटाएं"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* In-Card Delete Confirmation */}
                        {isConfirmingDelete && (
                          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-2 animate-in fade-in">
                            <span className="text-xs font-semibold text-rose-950">
                              क्या आप <strong>रिवीज़न बारी #{entry.attemptNumber}</strong> का रिकॉर्ड हटाना चाहते हैं?
                            </span>
                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteLogId(null)}
                                className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded"
                              >
                                रद्द करें
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteLog?.(lecture.id, entry.id);
                                  setConfirmDeleteLogId(null);
                                }}
                                className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700"
                              >
                                हाँ, हटाएं
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Content: Mistakes / Difficulties */}
                        {entry.mistakes && (
                          <div className="text-xs bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                            <span className="text-[10px] font-bold text-rose-900 block mb-0.5">
                              कठिनाई व पुरानी गलतियाँ:
                            </span>
                            <p className="text-stone-800 whitespace-pre-wrap font-medium">
                              {entry.mistakes}
                            </p>
                          </div>
                        )}

                        {/* Content: Shortcuts & Tricks */}
                        {entry.tricks && (
                          <div className="text-xs bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                            <span className="text-[10px] font-bold text-emerald-900 block mb-0.5">
                              आसान हल / शॉर्टकट ट्रिक्स:
                            </span>
                            <p className="text-stone-900 whitespace-pre-wrap font-medium">
                              {entry.tricks}
                            </p>
                          </div>
                        )}

                        {/* Content: Links with Custom Text */}
                        {entry.links && entry.links.length > 0 && (
                          <div className="text-xs space-y-1">
                            <span className="text-[10px] font-bold text-sky-900 block">
                              संदर्भ लिंक्स व PDFs:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {entry.links.map((link) => (
                                <a
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3 text-sky-600" />
                                  <span>{link.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Assistant Help */}
            <div className="bg-sky-50/60 rounded-xl p-3 border border-sky-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-sky-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>सवालों के आसान हल चाहिए?</span>
                </span>
                <p className="text-[11px] text-sky-800">
                  इस अध्याय के कठिन सवालों का डिजिटल सम या शॉर्टकट तरीका पूछें।
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAskGemini(lecture)}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
              >
                AI से पूछें
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Stopwatch & Current Attempt Inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Stopwatch Card */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>रिवीज़न टाइमर (Stopwatch)</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isRunning ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {isRunning ? "रनिंग" : "पॉज़्ड"}
                </span>
              </div>

              <div className="text-center py-1">
                <div className="text-4xl font-black text-stone-900 font-mono tracking-tight">
                  {formatTimer(seconds)}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  अनुमानित समय: ~{lecture.avgTimeMinutes} मिनट
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                    isRunning
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isRunning ? "पॉज़ करें" : "स्टार्ट करें"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRunning(false);
                    setSeconds(0);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 border border-stone-300 transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>रीसेट</span>
                </button>
              </div>
            </div>

            {/* Current Session Inputs Card (Appended to History) */}
            <div className="bg-white rounded-xl p-3.5 border border-stone-200 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-stone-900">
                    इस बारी (#{nextAttemptNumber}) का नया डेटा जोड़ें
                  </h4>
                </div>
                <span className="text-[10px] text-stone-400 font-medium">
                  इतिहास में जुड़ेगा
                </span>
              </div>

              {/* Input 1: Mistakes */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-700 block">
                  कठिनाई / गलतियाँ (इस बार क्या दिक्कत आई?):
                </label>
                <textarea
                  rows={2}
                  value={currentMistakesInput}
                  onChange={(e) => setCurrentMistakesInput(e.target.value)}
                  placeholder="उदा. Q_45 में समय लगा, कॉन्सेप्ट में हल्का डाउट रहा..."
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              {/* Input 2: Shortcuts & Tricks */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-emerald-900 block">
                  आसान हल / शॉर्टकट ट्रिक्स (जो अगली बार काम आए):
                </label>
                <textarea
                  rows={2}
                  value={currentTricksInput}
                  onChange={(e) => setCurrentTricksInput(e.target.value)}
                  placeholder="उदा. Digital sum से सीधा उत्तर आ रहा है..."
                  className="w-full p-2 rounded-lg border border-emerald-200 bg-emerald-50/30 text-xs text-emerald-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Input 3: Reference Links with Custom Text */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-sky-900">
                    संदर्भ लिंक्स व PDFs (Hyperlink with Custom Text):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddLinkForm(!showAddLinkForm)}
                    className="text-[11px] font-bold text-sky-700 hover:text-sky-900 underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ लिंक जोड़ें</span>
                  </button>
                </div>

                {showAddLinkForm && (
                  <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 space-y-2">
                    <input
                      type="text"
                      placeholder="कस्टम नाम (उदा. Class PDF Pg 42 Q85)"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-stone-300 bg-white text-xs text-stone-900"
                    />
                    <input
                      type="text"
                      placeholder="URL लिंक (https://... या drive.google.com/...)"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-stone-300 bg-white text-xs text-stone-900"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAddLinkForm(false)}
                        className="px-2 py-1 text-xs text-stone-600 hover:text-stone-900"
                      >
                        रद्द करें
                      </button>
                      <button
                        type="button"
                        onClick={handleAddLink}
                        className="px-3 py-1 bg-sky-700 text-white rounded text-xs font-bold hover:bg-sky-800"
                      >
                        जोड़ें
                      </button>
                    </div>
                  </div>
                )}

                {currentLinks.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {currentLinks.map((l) => (
                      <span
                        key={l.id}
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-800 border border-stone-200"
                      >
                        <ExternalLink className="w-3 h-3 text-sky-600" />
                        <span>{l.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCurrentLink(l.id)}
                          className="text-stone-400 hover:text-rose-600 pl-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Comprehension Level */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700">समझ का स्तर:</span>
                <div className="flex items-center space-x-1.5">
                  {(["पक्का", "सामान्य", "संशय"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setComprehension(lvl)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        comprehension === lvl
                          ? "bg-stone-900 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Interval Selection */}
            <div className="bg-white rounded-xl p-3.5 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                  <span>अगला अंतराल (Rating)</span>
                </span>
                <span className="text-stone-500 font-semibold">
                  अगली तारीख: <strong>{formatHindiDate(nextPreview.nextDate)}</strong>
                </span>
              </div>

              {isFoundationPhase ? (
                <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 font-medium">
                  शुरुआती फाउंडेशन: <strong>+{nextPreview.daysAdded} दिन बाद</strong> स्वतः ड्यू होगा।
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRating("Easy")}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedRating === "Easy"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="block font-bold">सरल</span>
                    <span className="text-[10px] text-stone-500">+21 दिन</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRating("Medium")}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedRating === "Medium"
                        ? "bg-amber-50 border-amber-500 text-amber-950 font-bold"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="block font-bold">मध्यम</span>
                    <span className="text-[10px] text-stone-500">+12 दिन</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRating("Hard")}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedRating === "Hard"
                        ? "bg-rose-50 border-rose-500 text-rose-950 font-bold"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="block font-bold">कठिन</span>
                    <span className="text-[10px] text-stone-500">+4 दिन</span>
                  </button>
                </div>
              )}

              {/* Time Spent Compact Slider */}
              <div className="p-2.5 bg-stone-50/80 rounded-xl border border-stone-200/80 space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-700 font-bold">लगा हुआ समय (Time Spent):</span>
                  <span className="font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs">
                    {finalMinutes} मिनट
                  </span>
                </div>
                <div className="pt-0.5">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={Math.min(120, Math.max(5, finalMinutes))}
                    onChange={(e) => setManualMinutes(e.target.value)}
                    className="w-full h-1.5 bg-stone-200 rounded-full appearance-none accent-amber-500 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-stone-400 font-semibold px-0.5">
                  <span>5 मि.</span>
                  <span>25 मि.</span>
                  <span>50 मि.</span>
                  <span>120 मि.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-200 px-4 py-3 bg-stone-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            रद्द करें
          </button>

          <button
            id="btn-complete-revision"
            type="button"
            onClick={handleFinish}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center space-x-1.5 shadow-xs transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>रिवीज़न पूर्ण करें व नया रिकॉर्ड जोड़ें</span>
          </button>
        </div>

      </div>
    </div>
  );
};
