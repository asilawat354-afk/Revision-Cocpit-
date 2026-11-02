import React from "react";

export interface CompactRangeSliderProps {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  valueDisplay?: React.ReactNode;
  subLabel?: string;
  minLabel?: string;
  maxLabel?: string;
  accentColor?: "amber" | "indigo" | "sky" | "blue" | "emerald" | "purple" | "stone" | "rose";
  onChange: (val: number) => void;
  className?: string;
}

export const CompactRangeSlider: React.FC<CompactRangeSliderProps> = ({
  id,
  label,
  icon,
  value,
  min,
  max,
  step = 1,
  valueDisplay,
  subLabel,
  minLabel,
  maxLabel,
  accentColor = "amber",
  onChange,
  className = "",
}) => {
  const triggerHaptic = () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(6);
      }
    } catch {
      // ignore
    }
  };

  // Color mapping for badge & accent
  const colorMap = {
    amber: {
      accent: "accent-amber-500",
      badge: "bg-amber-100 text-amber-950 border-amber-300",
      icon: "text-amber-600",
      track: "bg-amber-200",
    },
    indigo: {
      accent: "accent-indigo-600",
      badge: "bg-indigo-100 text-indigo-950 border-indigo-300",
      icon: "text-indigo-600",
      track: "bg-indigo-200",
    },
    sky: {
      accent: "accent-sky-600",
      badge: "bg-sky-100 text-sky-950 border-sky-300",
      icon: "text-sky-600",
      track: "bg-sky-200",
    },
    blue: {
      accent: "accent-blue-600",
      badge: "bg-blue-100 text-blue-950 border-blue-300",
      icon: "text-blue-600",
      track: "bg-blue-200",
    },
    emerald: {
      accent: "accent-emerald-600",
      badge: "bg-emerald-100 text-emerald-950 border-emerald-300",
      icon: "text-emerald-600",
      track: "bg-emerald-200",
    },
    purple: {
      accent: "accent-purple-600",
      badge: "bg-purple-100 text-purple-950 border-purple-300",
      icon: "text-purple-600",
      track: "bg-purple-200",
    },
    stone: {
      accent: "accent-stone-800",
      badge: "bg-stone-100 text-stone-900 border-stone-300",
      icon: "text-stone-700",
      track: "bg-stone-200",
    },
    rose: {
      accent: "accent-rose-600",
      badge: "bg-rose-100 text-rose-950 border-rose-300",
      icon: "text-rose-600",
      track: "bg-rose-200",
    },
  };

  const scheme = colorMap[accentColor] || colorMap.amber;

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={`p-2.5 sm:p-3 bg-stone-50/90 rounded-2xl border border-stone-200/90 space-y-1.5 transition-all ${className}`}>
      {/* Header Row: Label + Value Badge */}
      <div className="flex items-center justify-between gap-2">
        <label 
          htmlFor={id} 
          className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5 cursor-pointer select-none truncate"
        >
          {icon && <span className={`shrink-0 ${scheme.icon}`}>{icon}</span>}
          <span className="truncate">{label}</span>
        </label>
        
        <span className={`text-[10.5px] font-black px-2 py-0.5 rounded-full border shadow-2xs shrink-0 select-none ${scheme.badge}`}>
          {valueDisplay !== undefined ? valueDisplay : value}
        </span>
      </div>

      {subLabel && (
        <p className="text-[10px] text-stone-500 font-medium leading-tight select-none">
          {subLabel}
        </p>
      )}

      {/* Slider Track Row */}
      <div className="pt-0.5 pb-0.5">
        <div className="relative flex items-center">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const val = Number(e.target.value);
              triggerHaptic();
              onChange(val);
            }}
            className={`w-full h-1.5 sm:h-2 bg-stone-200 rounded-full cursor-pointer appearance-none ${scheme.accent} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-stone-400/40 transition-all`}
          />
        </div>
      </div>

      {/* Bottom Row: Min & Max labels if provided */}
      {(minLabel || maxLabel) && (
        <div className="flex items-center justify-between text-[9px] text-stone-400 font-bold px-0.5 select-none">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};
