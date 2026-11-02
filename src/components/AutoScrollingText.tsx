import React, { useRef, useState, useEffect } from "react";

interface AutoScrollingTextProps {
  text: string;
  className?: string;
  containerClassName?: string;
}

export const AutoScrollingText: React.FC<AutoScrollingTextProps> = ({
  text,
  className = "",
  containerClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [overflowDistance, setOverflowDistance] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.scrollWidth;
        const diff = textWidth - containerWidth;
        if (diff > 4) {
          setOverflowDistance(diff + 8);
        } else {
          setOverflowDistance(0);
        }
      }
    };

    checkOverflow();

    const observer = new ResizeObserver(() => {
      checkOverflow();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [text]);

  // Readably slow: 15px per second + 4s of pause time
  const durationSec = Math.max(5, Math.min(10, Math.round(overflowDistance / 14) + 4));

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className={`overflow-hidden relative w-full select-none ${containerClassName}`}
    >
      <span
        ref={textRef}
        style={
          overflowDistance > 0
            ? ({
                "--scroll-dist": `${overflowDistance}px`,
                display: "inline-block",
                whiteSpace: "nowrap",
                animation: isPaused
                  ? "none"
                  : `marquee-smooth-flow ${durationSec}s ease-in-out infinite`,
                transform: isPaused ? `translateX(-${Math.min(overflowDistance, 20)}px)` : undefined,
                transition: isPaused ? "transform 0.3s ease-out" : undefined,
              } as React.CSSProperties)
            : {
                display: "inline-block",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "100%",
              }
        }
        className={className}
      >
        {text}
      </span>

      <style>{`
        @keyframes marquee-smooth-flow {
          0%, 25% {
            transform: translateX(0px);
          }
          65%, 82% {
            transform: translateX(calc(-1 * var(--scroll-dist, 0px)));
          }
          100% {
            transform: translateX(0px);
          }
        }
      `}</style>
    </div>
  );
};
