import React from "react";
import { 
  X, 
  Check, 
  Sparkles, 
  Volume2, 
  ArrowRight,
  Layers,
  Smartphone
} from "lucide-react";
import { BigTechEcosystem, ECOSYSTEM_LIST, EcosystemMeta } from "../utils/ecosystemTheme";
import { soundFx } from "../utils/soundEffects";
import { triggerHaptic } from "../utils/haptics";

interface EcosystemSwitcherModalProps {
  isOpen: boolean;
  activeEcosystem: BigTechEcosystem;
  onSelectEcosystem: (ecosystem: BigTechEcosystem) => void;
  onClose: () => void;
}

export const EcosystemSwitcherModal: React.FC<EcosystemSwitcherModalProps> = ({
  isOpen,
  activeEcosystem,
  onSelectEcosystem,
  onClose,
}) => {
  if (!isOpen) return null;

  const playPreviewSound = (ecoId: BigTechEcosystem) => {
    triggerHaptic(10);
    switch (ecoId) {
      case "gpay_fintech":
        soundFx.playUpiSuccess();
        break;
      case "whatsapp_meta":
        soundFx.playWhatsAppSent();
        break;
      case "apple_notion":
        soundFx.playApplePop();
        break;
      case "duolingo_arena":
        soundFx.playDuolingoChime();
        break;
      default:
        soundFx.playApplePop();
        break;
    }
  };

  const handleSelect = (eco: EcosystemMeta) => {
    playPreviewSound(eco.id);
    onSelectEcosystem(eco.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  इकोसिस्टम स्टूडियो (7 नए ऐप अवतार)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950">
                  FLAGSHIP
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Google, Apple, WhatsApp, GPay व Notion जैसे 7 अलग-अलग दुनियाओं में से चुनें
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic(6);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200/60 flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              एक-एक करके ट्राई करें — पूरा लुक, रंग, बटन्स और काम करने का तरीका तुरंत बदल जाएगा!
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 shrink-0 hidden sm:inline">
            7 मोड्स उपलब्ध
          </span>
        </div>

        {/* Ecosystem List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {ECOSYSTEM_LIST.map((eco) => {
            const isSelected = activeEcosystem === eco.id;
            return (
              <div
                key={eco.id}
                onClick={() => handleSelect(eco)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                  isSelected
                    ? "border-stone-950 bg-stone-50/90 shadow-md ring-2 ring-stone-950/10 scale-[1.01]"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs active:scale-[0.99]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <span className="text-2xl sm:text-3xl shrink-0 p-2 rounded-2xl bg-stone-100/90 border border-stone-200/60 shadow-xs">
                      {eco.icon}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-extrabold text-stone-950 tracking-tight">
                          {eco.name}
                        </h3>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-950 text-white flex items-center gap-1 shadow-2xs">
                            <Check className="w-3 h-3 stroke-[3]" /> सक्रिय
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {eco.tagline}
                      </p>

                      {/* Feature Chips */}
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        {eco.featuresHighlight.map((feat, i) => (
                          <span 
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200/70"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sound Preview / Select Button */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreviewSound(eco.id);
                      }}
                      title="साउंड इफ़ेक्ट सुनें"
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected 
                          ? "bg-stone-950 text-white shadow-xs" 
                          : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                      }`}
                    >
                      <span>{isSelected ? "लागू है" : "चुनें"}</span>
                      {!isSelected && <ArrowRight className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Smartphone className="w-4 h-4 text-stone-400" />
            <span>पसंद आने पर जो ठीक लगे बता दीजिएगा, वही डिफ़ॉल्ट बन जाएगा।</span>
          </div>

          <button
            onClick={() => {
              triggerHaptic(6);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-black bg-stone-900 hover:bg-stone-800 text-white shadow-sm cursor-pointer"
          >
            पूर्ण करें (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
