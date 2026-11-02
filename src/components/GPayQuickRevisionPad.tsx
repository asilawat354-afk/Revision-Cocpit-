import React, { useState } from "react";
import { 
  X, 
  Zap, 
  CheckCircle2, 
  Gift, 
  Clock, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Share2
} from "lucide-react";
import { LectureItem, DifficultyRating } from "../types";
import { soundFx } from "../utils/soundEffects";
import { triggerHaptic } from "../utils/haptics";
import { formatHindiDate } from "../utils/revisionEngine";

interface GPayQuickRevisionPadProps {
  isOpen: boolean;
  onClose: () => void;
  pendingLectures: LectureItem[];
  onMarkStudied: (lectureId: string, rating: DifficultyRating, timeMinutes: number) => void;
}

export const GPayQuickRevisionPad: React.FC<GPayQuickRevisionPadProps> = ({
  isOpen,
  onClose,
  pendingLectures,
  onMarkStudied,
}) => {
  const [successReceipt, setSuccessReceipt] = useState<{
    lectureTitle: string;
    subject: string;
    nextDate: string;
    revId: string;
  } | null>(null);

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyRating>("Medium");
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [showScratchCard, setShowScratchCard] = useState<boolean>(false);
  const [isScratched, setIsScratched] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentLecture = pendingLectures[0];

  const handleQuickPay = (lec: LectureItem) => {
    triggerHaptic(15);
    soundFx.playUpiSuccess();

    // Mark as studied
    onMarkStudied(lec.id, selectedDifficulty, selectedMinutes);

    // Calculate next review text
    const today = new Date();
    const nextDays = selectedDifficulty === "Hard" ? 2 : selectedDifficulty === "Easy" ? 7 : 4;
    today.setDate(today.getDate() + nextDays);
    const nextDateStr = today.toISOString().split("T")[0];

    setSuccessReceipt({
      lectureTitle: lec.title,
      subject: lec.subject,
      nextDate: formatHindiDate(nextDateStr),
      revId: `UPI-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]"
        role="dialog"
      >
        {/* UPI Header (Navy / Google Pay Aesthetic) */}
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  BHIM UPI / Google Pay
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-400 text-slate-950">
                  FAST 1-TAP
                </span>
              </div>
              <h2 className="text-sm font-black text-white">
                त्वरित 1-टैप रिवीज़न पैड
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic(6);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Success Receipt State */}
          {successReceipt ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50 animate-bounce">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  रिवीज़न सफलतापूर्वक दर्ज!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  UPI ID: {successReceipt.revId} • आज ही संपन्न
                </p>
              </div>

              {/* Receipt Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>विषय:</span>
                  <span className="font-bold text-slate-900">{successReceipt.subject}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>लेक्चर:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{successReceipt.lectureTitle}</span>
                </div>
                <div className="border-t border-slate-200/60 pt-2 flex justify-between text-slate-600">
                  <span>अगला दोहराव:</span>
                  <span className="font-black text-blue-700">{successReceipt.nextDate}</span>
                </div>
              </div>

              {/* Rewards Scratch Card Button */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    soundFx.playDuolingoChime();
                    setShowScratchCard(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Gift className="w-4 h-4" />
                  <span>रिवॉर्ड स्क्रैच कार्ड अनलॉक करें!</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSuccessReceipt(null);
                    if (pendingLectures.length <= 1) {
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                >
                  अगला रिवीज़न करें (शेष {Math.max(0, pendingLectures.length - 1)})
                </button>
              </div>
            </div>
          ) : currentLecture ? (
            /* Active Pending Card */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/50 to-white border-2 border-blue-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100">
                    {currentLecture.subject}
                  </span>
                  <span>लेक्चर #{currentLecture.lectureNumber}</span>
                </div>

                <h3 className="text-base font-black text-slate-950 tracking-tight leading-snug">
                  {currentLecture.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  अध्याय: {currentLecture.chapter}
                </p>

                {/* Quick Rating Selector */}
                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <p className="text-[11px] font-bold text-slate-600 mb-1.5">
                    समझने में कैसा लगा?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Easy", "Medium", "Hard"] as DifficultyRating[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedDifficulty(r)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          selectedDifficulty === r
                            ? r === "Easy"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : r === "Medium"
                              ? "bg-amber-500 text-slate-950 shadow-xs"
                              : "bg-rose-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {r === "Easy" ? "🟢 सरल" : r === "Medium" ? "🟡 सामान्य" : "🔴 कठिन"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Spent */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>समय लगा:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {[15, 25, 45].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMinutes(m)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                          selectedMinutes === m
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Big GPay 1-Tap Complete Button */}
              <button
                type="button"
                onClick={() => handleQuickPay(currentLecture)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>1-टैप सम्पन्न करें (Mark Completed)</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>वैज्ञानिक 2-स्टेप अंतराल इंजन द्वारा सुरक्षित</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                आज के सभी रिवीज़न पूर्ण हैं!
              </h3>
              <p className="text-xs text-slate-500">
                बहुत बढ़िया! आपका आज का कोई भी रिवीज़न बकाया नहीं है।
              </p>
            </div>
          )}

          {/* Interactive Scratch Card Modal Overlay */}
          {showScratchCard && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 text-center space-y-3 shadow-xl animate-in zoom-in-90 duration-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                लकी स्टडी स्क्रैच कार्ड
              </h4>
              <div 
                onClick={() => {
                  triggerHaptic(20);
                  soundFx.playDuolingoChime();
                  setIsScratched(true);
                }}
                className="w-full h-28 rounded-xl bg-amber-200/90 border-2 border-dashed border-amber-800/40 flex items-center justify-center cursor-pointer select-none relative overflow-hidden"
              >
                {isScratched ? (
                  <div className="animate-in zoom-in duration-300 space-y-1">
                    <span className="text-3xl">🏆</span>
                    <p className="text-sm font-black text-slate-950">
                      +100 रिवीज़न XP बोनस!
                    </p>
                    <p className="text-[10px] font-bold text-amber-900">
                      "लगातार प्रयास ही सफलता की चाबी है"
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Sparkles className="w-6 h-6 text-amber-800 animate-spin" />
                    <span className="text-xs font-black text-amber-950 mt-1">
                      टैप करके स्क्रैच करें!
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowScratchCard(false)}
                className="text-xs font-bold underline text-amber-950 cursor-pointer"
              >
                कार्ड बंद करें
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
