import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Info } from "lucide-react";

interface InfoTipProps {
  title: string;
  content: string | React.ReactNode;
  ariaLabel?: string;
  className?: string;
  size?: "sm" | "md";
}

/**
 * InfoTip with Option A (Mobile Bottom Sheet & Desktop Compact Card)
 * - Mobile (<640px): Slides up as a 25-35% height Bottom Sheet with ~20% dim backdrop.
 * - Desktop (≥640px): Clean, compact anchored popover next to the ⓘ icon.
 * - Dismisses instantly on tapping outside or tapping [×].
 * - Scrolls cleanly inside if content is long.
 */
export const InfoTip: React.FC<InfoTipProps> = ({
  title,
  content,
  ariaLabel,
  className = "",
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 640;
    }
    return false;
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const desktopPopoverRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const [align, setAlign] = useState<"left" | "right" | "center">("center");

  // Track viewport size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate desktop placement relative to trigger button
  useEffect(() => {
    if (!isOpen || isMobile || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (viewportHeight - rect.bottom < 180 && rect.top > 180) {
      setPlacement("top");
    } else {
      setPlacement("bottom");
    }

    if (rect.left < 140) {
      setAlign("left");
    } else if (viewportWidth - rect.right < 140) {
      setAlign("right");
    } else {
      setAlign("center");
    }
  }, [isOpen, isMobile]);

  // Handle escape key and outside click for desktop popover
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleDesktopClickOutside = (e: MouseEvent | TouchEvent) => {
      if (isMobile) return;
      const target = e.target as Node;
      if (
        desktopPopoverRef.current &&
        !desktopPopoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleDesktopClickOutside);
    document.addEventListener("touchstart", handleDesktopClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleDesktopClickOutside);
      document.removeEventListener("touchstart", handleDesktopClickOutside);
    };
  }, [isOpen, isMobile]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const badgeSizeClasses =
    size === "sm"
      ? "w-4 h-4 text-[11px]"
      : "w-5 h-5 text-[12px]";

  // Desktop popover positioning classes
  const getContainerClass = () => {
    let classes = "";
    if (placement === "bottom") {
      classes += " top-full mt-2";
    } else {
      classes += " bottom-full mb-2";
    }

    if (align === "left") {
      classes += " left-0";
    } else if (align === "right") {
      classes += " right-0";
    } else {
      classes += " left-1/2 -translate-x-1/2";
    }

    return classes;
  };

  const getCaretClass = () => {
    if (placement === "bottom") {
      if (align === "left") return "top-[-5px] left-3";
      if (align === "right") return "top-[-5px] right-3";
      return "top-[-5px] left-1/2 -translate-x-1/2";
    } else {
      if (align === "left") return "bottom-[-5px] left-3";
      if (align === "right") return "bottom-[-5px] right-3";
      return "bottom-[-5px] left-1/2 -translate-x-1/2";
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Trigger Button (Min 36px touch target area for easy mobile thumb tap) */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-label={ariaLabel || `${title} की जानकारी`}
        title={title}
        className={`relative inline-flex items-center justify-center cursor-pointer select-none p-1.5 -m-1 focus:outline-none shrink-0 ${className}`}
      >
        <span
          className={`inline-flex items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-stone-700 hover:text-amber-900 hover:border-amber-500 hover:bg-amber-100 transition-all font-bold shadow-2xs active:scale-90 ${badgeSizeClasses} ${
            isOpen ? "bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-500/20" : ""
          }`}
        >
          ⓘ
        </span>
      </button>

      {/* MOBILE (<640px): OPTION A - MOBILE BOTTOM SHEET WITH ~20% DIM BACKDROP */}
      {isOpen && isMobile && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex flex-col justify-end animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
            aria-modal="true"
            role="dialog"
          >
            {/* 20% Light Dim Backdrop */}
            <div
              className="absolute inset-0 bg-stone-900/25 backdrop-blur-[1px] transition-opacity"
              aria-hidden="true"
            />

            {/* Bottom Sheet Box (approx 25-35% height, smooth slide-up) */}
            <div
              className="relative w-full max-h-[75vh] bg-white rounded-t-3xl border-t border-stone-200 shadow-2xl p-4 sm:p-5 text-left animate-in slide-in-from-bottom duration-150 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Grab / Drag pill handle */}
              <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-3 shrink-0" />

              {/* Header: Title + [×] Button */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    ⓘ
                  </span>
                  <h4 className="text-sm font-bold text-stone-900">{title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 active:scale-95 transition-colors cursor-pointer"
                  aria-label="बंद करें"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content area: Clean, scrollable if long */}
              <div className="pt-3 text-xs sm:text-sm text-stone-700 leading-relaxed overflow-y-auto overscroll-contain flex-1">
                {typeof content === "string" ? <p>{content}</p> : content}
              </div>

              {/* Quick Close Button for extra thumb convenience */}
              <div className="pt-3 mt-1 border-t border-stone-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  समझ गया (बंद करें)
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* DESKTOP (≥640px): ANCHORED MINI-CARD POPOVER */}
      {isOpen && !isMobile && (
        <div
          ref={desktopPopoverRef}
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-[99999] w-[280px] bg-stone-900 text-white rounded-xl shadow-xl border border-stone-800 p-3 text-left animate-in fade-in zoom-in-95 duration-150 select-text ${getContainerClass()}`}
          role="tooltip"
        >
          {/* Caret */}
          <div
            className={`absolute w-2.5 h-2.5 bg-stone-900 border-stone-800 transform rotate-45 ${
              placement === "bottom" ? "border-t border-l" : "border-b border-r"
            } ${getCaretClass()}`}
          />

          {/* Desktop Header */}
          <div className="flex items-start justify-between gap-1.5 pb-1.5 border-b border-stone-800/80">
            <span className="text-[12px] font-bold text-amber-300 leading-tight">
              {title}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-0.5 rounded text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors shrink-0 -mr-1 -mt-0.5 cursor-pointer"
              aria-label="बंद करें"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop Content */}
          <div className="pt-1.5 text-xs text-stone-300 leading-relaxed max-h-[220px] overflow-y-auto overscroll-contain">
            {typeof content === "string" ? <p>{content}</p> : content}
          </div>
        </div>
      )}
    </div>
  );
};

