import React from "react";

export type OverlayVariant = "kids" | "tech" | "games" | "women" | "playful";

type Props = { variant?: OverlayVariant; absolute?: boolean };

export default function Overlay({ variant = "kids", absolute = true }: Props) {
  const containerClass = `${absolute ? "absolute inset-0 z-0" : ""} h-full w-full pointer-events-none`;

  const renderEmojiTiled = (emojis: string[], options?: { rows?: number; fontSize?: number }) => {
    const cols = 5;
    const rows = options?.rows ?? 5;
    const fontSize = options?.fontSize ?? 40;
    const cells = cols * rows;

    return (
      <div className={containerClass} aria-hidden>
        <div
          className="grid h-full w-full gap-[2px] sm:gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: cells }).map((_, i) => (
            <div key={i} className="flex items-center justify-center" style={{ opacity: 0.16 }}>
              <span style={{ fontSize, lineHeight: 1 }}>{emojis[i % emojis.length]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (variant === "kids") {
    return renderEmojiTiled(["🍀", "🌐", "🧸", "👧", "👦", "🛩️"], {
      rows: 18,
      fontSize: 28,
    });
  }

  if (variant === "playful") {
    return (
      <svg
        aria-hidden
        className={containerClass}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio={absolute ? "xMidYMid meet" : "none"}
      >
        <g opacity="0.16">
          <circle cx="120" cy="120" r="90" fill="#cededb" />
          <rect x="780" y="60" width="140" height="90" rx="28" fill="#f3ccd7" />
          <path d="M80 520 L220 460 L180 620 Z" fill="#94a3b8" />
          <path
            d="M500 380c60-40 140-20 160 30s-20 120-90 150-150 10-170-40 40-100 100-140Z"
            fill="#dcefc8"
          />
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={300 + i * 35} cy={120 + i * 22} r="6" fill="#64748b" />
          ))}
        </g>
      </svg>
    );
  }

  return null;
}
