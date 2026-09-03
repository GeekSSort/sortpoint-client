import React from "react";

/**
 * The pill used for row status across the app (Figma 30:16980, 45:3783).
 * h24, radius 17, px9, 6px dot, 12px Medium label — only the pair of colours
 * changes between states.
 */
export const TONES = {
  green: { bg: "#dcfce7", fg: "#22c55e" },
  amber: { bg: "#fef3c7", fg: "#6d5b46" },
  slate: { bg: "#f1f5f9", fg: "#0f172a" },
  orange: { bg: "#fff2e8", fg: "#fe954d" },
  red: { bg: "#fee2e2", fg: "#ef4444" },
  mint: { bg: "#f5fff8", fg: "#00b837" },
  gold: { bg: "#fffbee", fg: "#f5b800" },
  rose: { bg: "#ffdfe2", fg: "#e63946" },
} as const;

export type Tone = keyof typeof TONES;

export default function StatusPill({ label, tone }: { label: string; tone: Tone }) {
  const c = TONES[tone] ?? TONES.slate;
  return (
    <span
      className="inline-flex h-[24px] shrink-0 items-center gap-[7px] overflow-clip rounded-[17px] px-[9px]"
      style={{ backgroundColor: c.bg }}
    >
      <span className="size-[6px] shrink-0 rounded-full" style={{ backgroundColor: c.fg }} />
      <span
        className="text-[12px] leading-normal font-medium tracking-[-0.24px] whitespace-nowrap"
        style={{ color: c.fg }}
      >
        {label}
      </span>
    </span>
  );
}
