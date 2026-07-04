"use client";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // duration in seconds for one full loop cycle
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  gap?: number;
}

export function Marquee({
  children,
  speed = 25,
  direction = "left",
  pauseOnHover = true,
  className = "",
  gap = 40,
}: MarqueeProps) {
  const uniqueId = `marquee-${direction}-${speed}`;

  return (
    <div
      className={`relative overflow-hidden w-full flex ${className}`}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <style>{`
        @keyframes ${uniqueId} {
          0% {
            transform: translateX(${direction === "left" ? "0%" : "-50%"});
          }
          100% {
            transform: translateX(${direction === "left" ? "-50%" : "0%"});
          }
        }
        .animate-${uniqueId} {
          display: flex;
          width: max-content;
          animation: ${uniqueId} ${speed}s linear infinite;
        }
        .pause-hover-${uniqueId}:hover {
          animation-play-state: ${pauseOnHover ? "paused" : "running"};
        }
      `}</style>
      
      <div 
        className={`animate-${uniqueId} ${pauseOnHover ? `pause-hover-${uniqueId}` : ""}`} 
        style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
      >
        {/* Render twice for a clean, seamless loop */}
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
export default Marquee;
