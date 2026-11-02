import React from "react";
import { CheckCircle2, AlertTriangle, X, BookmarkCheck } from "lucide-react";
import { LectureItem } from "../types";
import { getLectureDisplayName } from "../utils/formatters";

interface ConfirmStudiedModalProps {
  isOpen: boolean;
  lecture: LectureItem | null;
  onClose: () => void;
  onConfirm: (lectureId: string) => void;
}

export const ConfirmStudiedModal: React.FC<ConfirmStudiedModalProps> = ({
  isOpen,
  lecture,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !lecture) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xl backdrop-saturate-150 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-white/80 overflow-hidden space-y-4 animate-in zoom-in-95 duration-200 glass-specular">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                पढ़ाई की पुष्टि करें
              </h3>
              <p className="text-xs text-stone-500">
                रिवीज़न साइकिल में जोड़ने से पहले पुष्टि
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Card */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-stone-500 font-semibold">
            <span>{lecture.subject}</span>
            <span className="font-mono text-[11px] bg-stone-200 px-1.5 py-0.2 rounded text-stone-700">
              {getLectureDisplayName(lecture.lectureNumber, lecture.title)}
            </span>
          </div>
          <div className="text-stone-900 font-bold text-sm">
            {lecture.chapter}
          </div>
        </div>

        {/* Explain what happens */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>क्या आप इस लेक्चर को आज पढ़ चुके हैं?</span>
          </div>
          <p className="leading-relaxed text-amber-800 text-[11px]">
            पुष्टि करने पर यह लेक्चर <strong>सक्रिय कतार</strong> में आ जाएगा और <strong>24 घंटे बाद (कल)</strong> इसका पहला रिवीज़न शेड्यूल होगा।
          </p>
          <p className="text-[10px] text-amber-700 font-medium">
            (यदि गलती से हुआ, तो आप तुरंत 'वापस लें' (Undo) भी कर सकेंगे)
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
          >
            रद्द करें (Cancel)
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(lecture.id);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>हां, पढ़ लिया</span>
          </button>
        </div>

      </div>
    </div>
  );
};
