import React, { useEffect, useState } from "react";

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  angle: number;
  distance: number;
}

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  chapter: string;
  attemptNumber: number;
  nextDate: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  title,
  chapter,
  attemptNumber,
  nextDate,
}) => {
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    if (isOpen) {
      const colors = ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6", "#FBBF24"];
      const newParticles: SparkleParticle[] = Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() * 20 - 10),
        y: 45 + (Math.random() * 20 - 10),
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.2,
        duration: Math.random() * 0.9 + 0.8,
        angle: (i / 48) * 360 + (Math.random() * 15 - 7.5),
        distance: Math.random() * 140 + 70,
      }));
      setParticles(newParticles);

      // Auto dismiss timer or let user click
      const timer = setTimeout(() => {
        onClose();
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md backdrop-saturate-150 animate-in fade-in duration-200 cursor-pointer"
    >
      {/* Golden & Colorful Sparkle Burst Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const targetX = Math.cos(rad) * p.distance;
          const targetY = Math.sin(rad) * p.distance;

          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                borderRadius: p.size > 8 ? "2px" : "9999px",
                transform: `rotate(${p.angle * 2}deg)`,
                animation: `sparkleFly ${p.duration}s cubic-bezier(0.12, 0.8, 0.32, 1) ${p.delay}s forwards`,
                opacity: 0,
                boxShadow: `0 0 10px ${p.color}`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes sparkleFly {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(calc(cos(var(--angle, 0deg)) * 120px), calc(sin(var(--angle, 0deg)) * 120px)) scale(1.4) rotate(360deg);
          }
        }
      `}</style>

      {/* Glass Card Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl bg-white/95 backdrop-blur-2xl p-6 sm:p-7 border border-white/80 shadow-2xl glass-specular text-center space-y-4 animate-in zoom-in-90 duration-300 pointer-events-auto"
      >
        {/* Animated Badge */}
        <div className="w-18 h-18 mx-auto rounded-3xl bg-linear-to-tr from-amber-400 to-amber-200 text-stone-950 flex items-center justify-center shadow-xl border border-amber-300 animate-bounce">
          <span className="text-3xl">🎉</span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span>शानदार! रिवीज़न #{attemptNumber} पूर्ण</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-snug">
            {chapter}
          </h3>
          <p className="text-xs text-stone-600 font-medium line-clamp-2">
            {title}
          </p>
        </div>

        {/* Next Scheduled Pill */}
        <div className="p-3 rounded-2xl bg-stone-100/80 border border-stone-200/90 text-xs text-stone-700 flex items-center justify-between">
          <span className="font-semibold text-stone-500">अगला रिवीज़न:</span>
          <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
            {nextDate}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          शानदार! आगे बढ़ें ✨
        </button>
      </div>
    </div>
  );
};
