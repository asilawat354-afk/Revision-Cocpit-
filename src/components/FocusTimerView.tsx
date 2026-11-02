import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Coffee, 
  CheckCircle2, 
  Flame,
  Volume2,
  VolumeX,
  Sparkles
} from "lucide-react";
import { triggerHaptic } from "../utils/haptics";

interface FocusTimerViewProps {
  onGoBack: () => void;
  backTitle?: string;
  lectureTitle?: string;
}

type TimerMode = "stopwatch" | "pomodoro_25" | "deep_50" | "custom";

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  onGoBack,
  backTitle = "वापस",
  lectureTitle,
}) => {
  const [mode, setMode] = useState<TimerMode>("pomodoro_25");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [targetSeconds, setTargetSeconds] = useState<number>(25 * 60);
  const [sessionCount, setSessionCount] = useState<number>(0);

  // Background-safe timing logic using Date.now()
  const startTimeRef = useRef<number | null>(null);
  const accumulatedSecondsRef = useRef<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      interval = setInterval(() => {
        if (startTimeRef.current) {
          const deltaSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const totalSecs = accumulatedSecondsRef.current + deltaSecs;
          setElapsedSeconds(totalSecs);

          // Check for countdown completion
          if (mode !== "stopwatch" && totalSecs >= targetSeconds) {
            setIsRunning(false);
            startTimeRef.current = null;
            accumulatedSecondsRef.current = targetSeconds;
            setElapsedSeconds(targetSeconds);
            setSessionCount((prev) => prev + 1);
            triggerHaptic(50);
          }
        }
      }, 250);
    } else {
      if (startTimeRef.current) {
        const deltaSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
        accumulatedSecondsRef.current += deltaSecs;
        startTimeRef.current = null;
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, targetSeconds]);

  const handleSelectMode = (newMode: TimerMode) => {
    setIsRunning(false);
    startTimeRef.current = null;
    accumulatedSecondsRef.current = 0;
    setElapsedSeconds(0);
    setMode(newMode);
    triggerHaptic(8);

    if (newMode === "pomodoro_25") setTargetSeconds(25 * 60);
    else if (newMode === "deep_50") setTargetSeconds(50 * 60);
    else if (newMode === "stopwatch") setTargetSeconds(0);
  };

  const handleTogglePlayPause = () => {
    triggerHaptic(12);
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    triggerHaptic(8);
    setIsRunning(false);
    startTimeRef.current = null;
    accumulatedSecondsRef.current = 0;
    setElapsedSeconds(0);
  };

  // Format MM:SS or HH:MM:SS
  const formatTime = (secs: number) => {
    const displaySecs = mode === "stopwatch" ? secs : Math.max(0, targetSeconds - secs);
    const m = Math.floor(displaySecs / 60);
    const s = displaySecs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progressPercent = mode === "stopwatch" 
    ? Math.min(100, (elapsedSeconds % 3600) / 36)
    : Math.min(100, (elapsedSeconds / targetSeconds) * 100);

  return (
    <div className="space-y-4 max-w-xl mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
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

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <h1 className="text-sm font-bold text-stone-900">फोकस स्टडी टाइमर</h1>
        </div>

        <span className="text-xs font-semibold text-stone-500">
          सत्र पूर्ण: {sessionCount}
        </span>
      </div>

      {/* Main Focused Timer Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 text-center shadow-xs space-y-6">
        {/* Mode Selector Chips */}
        <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => handleSelectMode("pomodoro_25")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              mode === "pomodoro_25" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            25 मि. पोमोडोरो
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode("deep_50")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              mode === "deep_50" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            50 मि. डीप फोकस
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode("stopwatch")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              mode === "stopwatch" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            स्टॉपवॉच
          </button>
        </div>

        {/* Large Time Display with Circular Aura */}
        <div className="relative py-4 sm:py-8 flex flex-col items-center justify-center">
          <div className="text-5xl sm:text-7xl font-mono font-black text-stone-900 tracking-tight select-none">
            {formatTime(elapsedSeconds)}
          </div>
          <span className="text-xs font-semibold text-stone-400 mt-2">
            {mode === "stopwatch" ? "अविराम अध्ययन समय" : isRunning ? "अध्ययन सत्र प्रगति पर है..." : "प्रारंभ करने के लिए नीचे टैप करें"}
          </span>

          {/* Minimalist Progress Line */}
          <div className="w-48 sm:w-64 h-1.5 bg-stone-100 rounded-full mt-5 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Big Action Buttons */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            title="रीसेट करें"
            className="p-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all active:scale-95 border border-stone-200"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlayPause}
            className={`px-8 py-4 rounded-2xl font-black text-base flex items-center gap-2.5 shadow-md transition-all active:scale-95 cursor-pointer ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-400 text-stone-950"
                : "bg-stone-900 hover:bg-stone-800 text-white"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-stone-950" />
                <span>रोकें (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>अध्ययन शुरू करें</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
