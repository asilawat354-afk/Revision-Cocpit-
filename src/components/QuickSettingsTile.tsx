import React, { useRef, useState } from "react";
import { 
  Minus,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  X
} from "lucide-react";
import { DashboardTile, TileSize } from "../types";
import { FeatureDefinition, FeatureContext } from "../data/featureCatalog";

export interface DragPosition {
  left: number;
  top: number;
}

interface QuickSettingsTileProps {
  tile: DashboardTile;
  feature: FeatureDefinition;
  context: FeatureContext;
  isEditMode: boolean;
  isLocked: boolean;
  isDragging: boolean;
  isSelected?: boolean;
  showTileControls?: boolean;
  dragPos?: DragPosition;
  calculatedLeft: number;
  calculatedTop: number;
  calculatedWidth: number;
  calculatedHeight: number;
  onRemove: (tileId: string) => void;
  onSelectTile?: (tileId: string) => void;
  onToggleControls?: (tileId: string) => void;
  onSetSize?: (tileId: string, size: TileSize) => void;
  onCycleSize?: (tileId: string) => void;
  onNudge?: (tileId: string, dx: number, dy: number) => void;
  onStartDrag: (
    tile: DashboardTile,
    e: React.PointerEvent,
    initialLeft: number,
    initialTop: number
  ) => void;
  onEnterEditMode: () => void;
}

export const QuickSettingsTile: React.FC<QuickSettingsTileProps> = ({
  tile,
  feature,
  context,
  isEditMode,
  isLocked,
  isDragging,
  isSelected,
  showTileControls = false,
  dragPos,
  calculatedLeft,
  calculatedTop,
  calculatedWidth,
  calculatedHeight,
  onRemove,
  onSelectTile,
  onToggleControls,
  onSetSize,
  onCycleSize,
  onNudge,
  onStartDrag,
  onEnterEditMode,
}) => {
  const tileRef = useRef<HTMLDivElement | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const pointerStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isLifted, setIsLifted] = useState<boolean>(false);

  const statusText = feature.getStatus(context);
  const action = feature.getAction(context);

  const triggerHaptic = (duration = 8) => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(duration);
      }
    } catch {
      // ignore
    }
  };

  // Pointer Down handling
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Don't drag if clicking buttons (nudge arrows, close, remove)
    const isControlAction = !!target.closest("[data-arrow-btn], [data-close-btn], [data-remove-btn]");
    if (isControlAction) {
      return;
    }

    pointerStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    setIsPressed(true);

    if (isEditMode) {
      // Only initiate hold-to-drag when controls are closed so taps don't trigger drag
      if (!isLocked && !showTileControls) {
        if (holdTimerRef.current) {
          clearTimeout(holdTimerRef.current);
        }

        holdTimerRef.current = window.setTimeout(() => {
          triggerHaptic(12);
          setIsLifted(true);
          onStartDrag(tile, e, calculatedLeft, calculatedTop);
          holdTimerRef.current = null;
        }, 130);
      }
    } else {
      // In Normal Mode: Setup Long Press for 350ms to activate Edit Mode
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }

      holdTimerRef.current = window.setTimeout(() => {
        triggerHaptic(20);
        onEnterEditMode();
        setIsPressed(false);
        holdTimerRef.current = null;
      }, 350);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartPosRef.current) {
      const dx = Math.abs(e.clientX - pointerStartPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerStartPosRef.current.y);

      // If user moved finger before hold timer elapsed, cancel drag so page scrolls!
      if (!isDragging && !isLifted && (dx > 7 || dy > 7)) {
        if (holdTimerRef.current) {
          clearTimeout(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        setIsPressed(false);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsPressed(false);
    setIsLifted(false);

    const target = e.target as HTMLElement;
    if (target.closest("[data-arrow-btn], [data-close-btn], [data-remove-btn]")) {
      pointerStartPosRef.current = null;
      return;
    }

    if (!isEditMode) {
      if (pointerStartPosRef.current) {
        const dx = Math.abs(pointerStartPosRef.current.x - e.clientX);
        const dy = Math.abs(pointerStartPosRef.current.y - e.clientY);
        const elapsed = Date.now() - pointerStartPosRef.current.time;

        if (dx < 10 && dy < 10 && elapsed < 350) {
          triggerHaptic(6);
          action();
        }
      }
    } else {
      // In Edit Mode:
      // 1st Tap: shows the 4 compass arrows and current size (e.g. 1×1)
      // 2nd Tap (or double-tap): cycles size to 2×2 (then 2×1, then 1×1)
      if (pointerStartPosRef.current) {
        const dx = Math.abs(pointerStartPosRef.current.x - e.clientX);
        const dy = Math.abs(pointerStartPosRef.current.y - e.clientY);
        const elapsed = Date.now() - pointerStartPosRef.current.time;

        if (dx < 15 && dy < 15 && elapsed < 400) {
          if (!showTileControls) {
            // First Tap: Open the compass arrows and display current size (e.g. 1×1)
            triggerHaptic(8);
            onToggleControls?.(tile.id);
          } else {
            // Second Tap on the tile: Cycle to 2×2!
            triggerHaptic(10);
            onCycleSize?.(tile.id);
          }
        }
      }
    }

    pointerStartPosRef.current = null;
  };

  const handlePointerCancel = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsPressed(false);
    setIsLifted(false);
    pointerStartPosRef.current = null;
  };

  const currentLeft = isDragging && dragPos ? dragPos.left : calculatedLeft;
  const currentTop = isDragging && dragPos ? dragPos.top : calculatedTop;

  const isSmall = tile.size === "small";
  const isCapsule = tile.size === "medium";

  // When dragging: Pure clean floating circular icon, NO square border, NO label text!
  if (isDragging) {
    return (
      <div
        ref={tileRef}
        id={`tile-${tile.id}`}
        style={{
          position: "absolute",
          left: `${currentLeft}px`,
          top: `${currentTop}px`,
          width: `${calculatedWidth}px`,
          height: `${calculatedHeight}px`,
          zIndex: 100,
          pointerEvents: "none",
          transition: "none",
        }}
        className="flex items-center justify-center select-none"
      >
        <div 
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${feature.colorScheme.iconBg} ${feature.colorScheme.iconColor} shadow-2xl scale-110`}
        >
          {feature.getIcon(context)}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tileRef}
      id={`tile-${tile.id}`}
      data-tile-root="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        position: "absolute",
        left: `${currentLeft}px`,
        top: `${currentTop}px`,
        width: `${calculatedWidth}px`,
        height: `${calculatedHeight}px`,
        zIndex: isLifted ? 40 : isEditMode ? 10 : 1,
        touchAction: isEditMode && !isLocked ? "none" : "auto",
        transition:
          "left 0.28s cubic-bezier(0.2, 0, 0, 1), top 0.28s cubic-bezier(0.2, 0, 0, 1), width 0.2s ease, height 0.2s ease, transform 0.15s ease",
        transform: isLifted
          ? "scale(1.05)"
          : isPressed && !isEditMode
          ? "scale(0.96)"
          : "scale(1)",
      }}
      className={`group select-none ${
        isSmall
          ? "bg-transparent border-none"
          : "rounded-2xl sm:rounded-3xl border border-white/15 bg-stone-900/85 backdrop-blur-md backdrop-saturate-150 text-white glass-specular-dark"
      } ${
        isEditMode
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-pointer"
      } overflow-visible`}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. SMALL TILE (1x1) - POCO M4 5G CIRCULAR TOGGLE + 2-LINE NAME */}
      {/* ------------------------------------------------------------- */}
      {isSmall && (
        <div className="w-full h-full flex flex-col items-center justify-start text-center pt-1 relative">
          {/* Circular Button Container */}
          <div className="relative shrink-0">
            {/* The Round Disc Toggle */}
            <div 
              className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${feature.colorScheme.iconBg} ${feature.colorScheme.iconColor} shadow-xs border ${feature.colorScheme.border} transition-transform ${isPressed ? "scale-90" : "group-hover:scale-105"}`}
            >
              {feature.getIcon(context)}
            </div>

            {/* Red Minus Badge in Edit Mode (When controls are not open) */}
            {isEditMode && !showTileControls && (
              <button
                data-no-drag
                id={`tile-remove-${tile.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic(8);
                  onRemove(tile.id);
                }}
                title="हटाएं (Remove)"
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center shadow-md border-2 border-white active:scale-90 cursor-pointer z-30"
              >
                <Minus className="w-3 h-3 stroke-[3]" />
              </button>
            )}

            {/* 4-Directional Compass Arrow Controller (चारों तरफ ऊपर, नीचे, बाएँ, दाएँ तीर) */}
            {isEditMode && showTileControls && (
              <div
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("[data-arrow-btn], [data-close-btn]")) {
                    return;
                  }
                  e.stopPropagation();
                  triggerHaptic(10);
                  onCycleSize?.(tile.id);
                }}
                className="absolute inset-0 z-50 pointer-events-auto animate-in fade-in zoom-in-90 duration-150 cursor-pointer"
              >
                {/* 1. UP Arrow (ऊपर) */}
                <button
                  data-arrow-btn
                  onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 0, -1); }}
                  title="ऊपर ले जाएं (Move Up)"
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-lg flex items-center justify-center cursor-pointer transition-all z-50"
                >
                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                {/* 2. DOWN Arrow (नीचे) */}
                <button
                  data-arrow-btn
                  onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 0, 1); }}
                  title="नीचे ले जाएं (Move Down)"
                  className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-lg flex items-center justify-center cursor-pointer transition-all z-50"
                >
                  <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                {/* 3. LEFT Arrow (बाएँ) */}
                <button
                  data-arrow-btn
                  onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, -1, 0); }}
                  title="बाएँ ले जाएं (Move Left)"
                  className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-lg flex items-center justify-center cursor-pointer transition-all z-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                {/* 4. RIGHT Arrow (दाएँ) */}
                <button
                  data-arrow-btn
                  onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 1, 0); }}
                  title="दाएँ ले जाएं (Move Right)"
                  className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-lg flex items-center justify-center cursor-pointer transition-all z-50"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                {/* Center Size Cycle Badge (1×1 → 2×2 → 2×1) */}
                <button
                  data-size-btn
                  onClick={(e) => { e.stopPropagation(); triggerHaptic(10); onCycleSize?.(tile.id); }}
                  title="आकार बदलें (वर्तमान: 1×1, टैप करने पर 2×2 होगा)"
                  className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[10px] border border-amber-300 shadow-md flex items-center justify-center cursor-pointer active:scale-90 z-50 transition-transform"
                >
                  1×1
                </button>

                {/* Close ✕ Button */}
                <button
                  data-close-btn
                  onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onSelectTile?.(tile.id); }}
                  title="कंट्रोल बंद करें"
                  className="absolute -top-2.5 -right-2.5 w-4.5 h-4.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-600 flex items-center justify-center shadow-xs cursor-pointer active:scale-90 z-50"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>

          {/* 2-Line Text Below Circle - Clean, Stationary, 100% Legible! */}
          <div className="mt-1.5 w-full px-0.5">
            <span 
              title={tile.customTitle || feature.shortTitle}
              className="text-[11px] sm:text-xs font-semibold leading-[13px] sm:leading-[14px] text-stone-800 text-center line-clamp-2 break-words block"
            >
              {tile.customTitle || feature.shortTitle}
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MEDIUM TILE (2x1) - ANDROID CAPSULE PILL                   */}
      {/* ------------------------------------------------------------- */}
      {isCapsule && (
        <div className="w-full h-full px-2.5 sm:px-3 py-2 flex items-center justify-between gap-2 relative overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Circular Icon */}
            <div className={`w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center ${feature.colorScheme.iconBg} ${feature.colorScheme.iconColor} shadow-xs border border-stone-700/60`}>
              {feature.getIcon(context)}
            </div>

            {/* Title & Status in 2 Clear Lines with Yellow Pill */}
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <h4 
                title={tile.customTitle || feature.shortTitle || feature.title}
                className="text-xs sm:text-sm font-bold tracking-tight leading-tight text-white truncate"
              >
                {tile.customTitle || feature.shortTitle || feature.title}
              </h4>
              <div className="mt-1 flex items-center">
                {statusText ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${feature.colorScheme.badgeBg || "bg-amber-400 text-stone-950"} shadow-2xs leading-none truncate max-w-full border border-amber-300/40`}>
                    {statusText}
                  </span>
                ) : (
                  <p className="text-[11px] text-stone-300 font-medium truncate">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls / Status */}
          {isEditMode && !showTileControls && (
            <button
              data-remove-btn
              id={`tile-remove-${tile.id}`}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic(8);
                onRemove(tile.id);
              }}
              title="हटाएं"
              className="w-5 h-5 rounded-full bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center shadow-md active:scale-90 cursor-pointer shrink-0 z-20"
            >
              <Minus className="w-3 h-3 stroke-[3]" />
            </button>
          )}

          {/* 4-Directional Compass Overlay for 2x1 */}
          {isEditMode && showTileControls && (
            <div
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("[data-arrow-btn], [data-close-btn]")) {
                  return;
                }
                e.stopPropagation();
                triggerHaptic(10);
                onCycleSize?.(tile.id);
              }}
              className="absolute inset-0 z-50 pointer-events-auto rounded-2xl bg-stone-950/70 backdrop-blur-md backdrop-saturate-150 flex items-center justify-center animate-in fade-in zoom-in-95 duration-150 cursor-pointer"
            >
              {/* UP Arrow */}
              <button
                data-arrow-btn
                onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 0, -1); }}
                title="ऊपर ले जाएं"
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-lg flex items-center justify-center cursor-pointer transition-all z-50"
              >
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* DOWN Arrow */}
              <button
                data-arrow-btn
                onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 0, 1); }}
                title="नीचे ले जाएं"
                className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-lg flex items-center justify-center cursor-pointer transition-all z-50"
              >
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* LEFT Arrow */}
              <button
                data-arrow-btn
                onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, -1, 0); }}
                title="बाएँ ले जाएं"
                className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-lg flex items-center justify-center cursor-pointer transition-all z-50"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* RIGHT Arrow */}
              <button
                data-arrow-btn
                onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 1, 0); }}
                title="दाएँ ले जाएं"
                className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-lg flex items-center justify-center cursor-pointer transition-all z-50"
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Center Single Size Badge + Close - Tap immediately cycles size */}
              <div className="flex items-center gap-1.5 z-50">
                <button
                  data-size-btn
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic(10);
                    onCycleSize?.(tile.id);
                  }}
                  title="आकार बदलें (वर्तमान: 2×1, टैप करने पर 1×1 होगा)"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs border border-amber-300 shadow-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                >
                  <span>2×1</span>
                </button>
                <button
                  data-close-btn
                  onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onSelectTile?.(tile.id); }}
                  title="कंट्रोल बंद करें"
                  className="w-7 h-7 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-600 flex items-center justify-center cursor-pointer active:scale-90"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. LARGE TILE (2x2) - ANDROID QUICK SETTING                   */}
      {/* ------------------------------------------------------------- */}
      {tile.size === "large" && (
        <div className="w-full h-full p-3 sm:p-3.5 flex flex-col justify-between relative">
          {/* Top Row: Icon on Left + Name & Subtitle on Right */}
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${feature.colorScheme.iconBg} ${feature.colorScheme.iconColor} shadow-md border border-stone-700/60`}>
                {feature.getIcon(context)}
              </div>

              <div className="min-w-0 flex-1">
                <h3 
                  title={tile.customTitle || feature.title}
                  className="text-xs sm:text-sm font-extrabold text-white leading-snug break-words"
                >
                  {tile.customTitle || feature.title}
                </h3>
                <div className="mt-1 flex items-center">
                  {statusText ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${feature.colorScheme.badgeBg || "bg-amber-400 text-stone-950"} shadow-2xs leading-none truncate max-w-full border border-amber-300/40`}>
                      {statusText}
                    </span>
                  ) : (
                    <p className="text-[11px] font-semibold text-stone-300 leading-snug line-clamp-1">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Red Minus Badge in Edit Mode */}
            {isEditMode && !showTileControls && (
              <button
                data-remove-btn
                id={`tile-remove-${tile.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic(8);
                  onRemove(tile.id);
                }}
                title="हटाएं"
                className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md active:scale-90 cursor-pointer shrink-0 z-20"
              >
                <Minus className="w-3 h-3 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Clean Subtitle / Status Display */}
          <div className="pt-2 border-t border-stone-700/40 flex items-center justify-between text-[11px] font-bold text-stone-400">
            <span>{statusText || "त्वरित एक्सेस"}</span>
            <span className="text-amber-400 font-bold">→</span>
          </div>

          {/* 4-Directional Compass Overlay for 2x2 */}
          {isEditMode && showTileControls && (
            <div
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("[data-arrow-btn], [data-close-btn]")) {
                  return;
                }
                e.stopPropagation();
                triggerHaptic(10);
                onCycleSize?.(tile.id);
              }}
              className="absolute inset-0 z-50 pointer-events-auto rounded-3xl bg-stone-950/70 backdrop-blur-md backdrop-saturate-150 flex items-center justify-center animate-in fade-in zoom-in-95 duration-150 cursor-pointer"
            >
              {/* UP Arrow */}
              <button
                data-arrow-btn
                onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 0, -1); }}
                title="ऊपर ले जाएं"
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-xl flex items-center justify-center cursor-pointer transition-all z-50"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* DOWN Arrow */}
              <button
                data-arrow-btn
                onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 0, 1); }}
                title="नीचे ले जाएं"
                className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-xl flex items-center justify-center cursor-pointer transition-all z-50"
              >
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* LEFT Arrow */}
              <button
                data-arrow-btn
                onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, -1, 0); }}
                title="बाएँ ले जाएं"
                className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-xl flex items-center justify-center cursor-pointer transition-all z-50"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* RIGHT Arrow */}
              <button
                data-arrow-btn
                onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onNudge?.(tile.id, 1, 0); }}
                title="दाएँ ले जाएं"
                className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-90 border border-amber-400 shadow-xl flex items-center justify-center cursor-pointer transition-all z-50"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Center Single Size Badge + Close - Tap immediately cycles size */}
              <div className="flex items-center gap-2 z-50">
                <button
                  data-size-btn
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic(10);
                    onCycleSize?.(tile.id);
                  }}
                  title="आकार बदलें (वर्तमान: 2×2, टैप करने पर 2×1 होगा)"
                  className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm border border-amber-300 shadow-2xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                >
                  <span>2×2</span>
                </button>
                <button
                  data-close-btn
                  onClick={(e) => { e.stopPropagation(); triggerHaptic(6); onSelectTile?.(tile.id); }}
                  title="कंट्रोल बंद करें"
                  className="w-8 h-8 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-600 flex items-center justify-center cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
