import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Sparkles, 
  Save, 
  Check, 
  Volume2,
  FileAudio
} from "lucide-react";
import { triggerHaptic } from "../utils/haptics";
import { soundFx } from "../utils/soundEffects";

interface VoiceStudyMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceStudyMemoModal: React.FC<VoiceStudyMemoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioNotes, setAudioNotes] = useState<{ id: string; title: string; duration: string; timestamp: string }[]>(() => {
    try {
      const saved = localStorage.getItem("sm_study_voice_memos");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: "memo-1", title: "Ratio & Proportion फॉर्मूला ट्रिक्स (3-स्टेप मेथड)", duration: "0:42", timestamp: "आज 10:15 AM" },
      { id: "memo-2", title: "इतिहास - गवर्नर जनरल व प्रमुख घटनाएं", duration: "1:15", timestamp: "कल 08:30 PM" }
    ];
  });

  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [noteTitleInput, setNoteTitleInput] = useState<string>("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  const handleToggleRecord = () => {
    triggerHaptic(12);
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      soundFx.playWhatsAppSent();
      const mins = Math.floor(recordingSeconds / 60);
      const secs = recordingSeconds % 60;
      const durStr = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      const newMemo = {
        id: `memo-${Date.now()}`,
        title: noteTitleInput.trim() || `ऑडियो रिवीज़न मेमो #${audioNotes.length + 1}`,
        duration: durStr === "0:00" ? "0:15" : durStr,
        timestamp: "अभी-अभी"
      };
      const updated = [newMemo, ...audioNotes];
      setAudioNotes(updated);
      try {
        localStorage.setItem("sm_study_voice_memos", JSON.stringify(updated));
      } catch {
        // ignore
      }
      setNoteTitleInput("");
    }
  };

  const handleDeleteMemo = (id: string) => {
    triggerHaptic(8);
    const updated = audioNotes.filter((m) => m.id !== id);
    setAudioNotes(updated);
    try {
      localStorage.setItem("sm_study_voice_memos", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handlePlayToggle = (id: string) => {
    triggerHaptic(8);
    soundFx.playApplePop();
    if (currentPlayingId === id) {
      setCurrentPlayingId(null);
    } else {
      setCurrentPlayingId(id);
      setTimeout(() => {
        setCurrentPlayingId(null);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
      >
        {/* WhatsApp Emerald Header */}
        <div className="p-4 bg-[#075e54] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#128c7e] flex items-center justify-center font-bold">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  WhatsApp Style
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#25d366] text-stone-950">
                  VOICE MEMO
                </span>
              </div>
              <h2 className="text-sm font-black text-white">
                ऑडियो स्टडी मेमो व वॉयस नोट्स
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

        {/* Recording Console */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3">
          <input
            type="text"
            placeholder="मेमो का नाम (उदा. ट्रिक्स, फॉर्मूला, संशय)..."
            value={noteTitleInput}
            onChange={(e) => setNoteTitleInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#128c7e]"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-rose-500 animate-ping" : "bg-stone-300"}`} />
              <span className="text-xs font-mono font-bold text-stone-700">
                {isRecording 
                  ? `रिकॉर्डिंग चालू... ${Math.floor(recordingSeconds / 60)}:${recordingSeconds % 60 < 10 ? "0" : ""}${recordingSeconds % 60}`
                  : "माइक दबाकर वॉयस मेमो बनाएं"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleRecord}
              className={`px-4 py-2 rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                isRecording 
                  ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse" 
                  : "bg-[#25d366] hover:bg-[#20ba59] text-stone-950"
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>रोकें व सेव करें</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>रिकॉर्ड शुरू करें</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Saved Audio Memos */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            सेव किए गए वॉयस नोट्स ({audioNotes.length})
          </p>

          {audioNotes.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              कोई वॉयस मेमो नहीं है। ऊपर दिए माइक बटन से रिकॉर्ड करें!
            </div>
          ) : (
            audioNotes.map((memo) => {
              const isPlaying = currentPlayingId === memo.id;
              return (
                <div
                  key={memo.id}
                  className="p-3 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handlePlayToggle(memo.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer ${
                        isPlaying 
                          ? "bg-[#25d366] text-stone-950 shadow-xs" 
                          : "bg-emerald-50 text-[#075e54] hover:bg-emerald-100"
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {memo.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                        <span className="font-mono font-semibold text-emerald-800">{memo.duration}</span>
                        <span>•</span>
                        <span>{memo.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMemo(memo.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-black bg-stone-900 text-white cursor-pointer"
          >
            पूर्ण करें (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
