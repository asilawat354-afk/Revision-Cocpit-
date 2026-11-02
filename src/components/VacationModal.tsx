import React, { useState } from "react";
import { PauseCircle, PlayCircle, X, Calendar, AlertCircle } from "lucide-react";

interface VacationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVacationActive: boolean;
  defaultDays: number;
  onConfirmStart: () => void;
  onConfirmEnd: (daysToShift: number) => void;
}

export const VacationModal: React.FC<VacationModalProps> = ({
  isOpen,
  onClose,
  isVacationActive,
  defaultDays,
  onConfirmStart,
  onConfirmEnd,
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xl backdrop-saturate-150 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        role="dialog" 
        aria-modal="true"
        className="bg-white/95 backdrop-blur-2xl w-full max-w-md rounded-3xl shadow-2xl border border-white/80 overflow-hidden glass-specular"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl font-bold ${isVacationActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {isVacationActive ? <PlayCircle className="w-5 h-5" /> : <PauseCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {isVacationActive ? "छुट्टी मोड बंद करें" : "छुट्टी मोड (Pause Mode)"}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {isVacationActive ? "पढ़ाई पुनः शुरू करें" : "कैलेंडर को अस्थायी रूप से रोकें"}
              </p>
            </div>
          </div>
          <button
            id="btn-close-vacation-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!isVacationActive ? (
            // Starting Vacation Mode
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>क्या आप छुट्टी मोड चालू करना चाहते हैं?</span>
                </div>
                <p>
                  जब तक छुट्टी मोड चालू रहेगा, <strong>कोई नया बैकलॉग नहीं जुड़ेगा</strong> और आपका कैलेंडर रुका रहेगा।
                </p>
              </div>
              <p className="text-xs text-stone-600">
                जब आप वापस आकर इसे दोबारा प्ले करेंगे, आप चाहें तो बिना तारीख बदले (0 दिन) या जितने दिन छुट्टी रही उतने दिन लेक्चर्स आगे खिसका सकते हैं।
              </p>
            </div>
          ) : (
            // Ending Vacation Mode - Options for 0 days (trial/accidental) and more days
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <Calendar className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>तारीखें आगे बढ़ानी हैं या जैसे हैं वैसे ही रखें?</span>
                </div>
                <p>
                  अगर आपने <strong>सिर्फ़ टेस्ट/ट्रायल के लिए चालू किया था</strong>, तो <strong>0 दिन (कोई बदलाव नहीं)</strong> चुनें। यदि सच में छुट्टी पर थे, तो 1, 2 या 3 दिन चुनें।
                </p>
              </div>

              {/* Quick direct button for Trial / No shift */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-stone-900">सिर्फ़ टेस्ट कर रहे थे?</p>
                  <p className="text-[11px] text-stone-500">तारीखों में 0 दिन का बदलाव होगा (जैसा था वैसा रहेगा)</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onConfirmEnd(0);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 rounded-lg shadow-xs transition-colors shrink-0"
                >
                  तुरंत बंद करें (0 दिन)
                </button>
              </div>

              {/* Number of days picker with compact slider */}
              <div className="space-y-2 pt-1 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>छुट्टी के दिन चुनें:</span>
                  <span className="text-emerald-950 font-black bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {selectedDays} {selectedDays === 1 ? "दिन" : "दिन"} आगे खिसकेगा
                  </span>
                </div>
                <div className="pt-1">
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-1.5 bg-stone-200 rounded-full appearance-none accent-emerald-600 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 font-bold px-0.5">
                  <span>1 दिन</span>
                  <span>7 दिन (हफ़्ता)</span>
                  <span>15 दिन</span>
                  <span>30 दिन (महीना)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            id="btn-cancel-vacation-modal"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-xl transition-colors"
          >
            रद्द करें (Cancel)
          </button>
          
          {!isVacationActive ? (
            <button
              id="btn-confirm-start-vacation"
              type="button"
              onClick={() => {
                onConfirmStart();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
            >
              हाँ, छुट्टी मोड शुरू करें
            </button>
          ) : (
            <button
              id="btn-confirm-end-vacation"
              type="button"
              onClick={() => {
                onConfirmEnd(selectedDays);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              {selectedDays === 0 ? "बिना बदलाव बंद करें (0 दिन)" : `पढ़ाई पुनः शुरू करें (${selectedDays} दिन शिफ्ट)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
