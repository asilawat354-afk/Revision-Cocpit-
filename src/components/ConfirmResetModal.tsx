import React from "react";
import { RotateCcw, AlertTriangle, X } from "lucide-react";
import { LectureItem } from "../types";
import { getLectureDisplayName } from "../utils/formatters";

interface ConfirmResetModalProps {
  isOpen: boolean;
  lecture: LectureItem | null;
  onClose: () => void;
  onConfirm: (lectureId: string) => void;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
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
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                वापस करने की पुष्टि करें
              </h3>
              <p className="text-xs text-stone-500">
                लेक्चर को वापस '⚪ अभी बाकी' सूची में डालना
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
          {lecture.revisionCount > 0 && (
            <div className="text-[11px] text-amber-800 font-medium">
              अब तक {lecture.revisionCount} बार रिवीज़न हो चुका है।
            </div>
          )}
        </div>

        {/* Warning / Explanation */}
        <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-rose-900">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
            <span>क्या आप वाकई इसे वापस 'अभी बाकी' करना चाहते हैं?</span>
          </div>
          <p className="leading-relaxed text-rose-800 text-[11px]">
            यह लेक्चर सक्रिय रिवीज़न कतार से हट जाएगा और इसका सारा रिवीज़न शेड्यूल रिसेट होकर वापस <strong>"⚪ अभी बाकी (Not Started)"</strong> स्थिति में चला जाएगा।
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
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>हां, वापस करें</span>
          </button>
        </div>

      </div>
    </div>
  );
};
