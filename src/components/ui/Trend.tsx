import React from "react";

/**
 * Figma 77:20918 — the green "pill" shared by the stat and product cards.
 * Its text overrides the Type@12 token: Figma sets -0.24px (-2%) and
 * `leading: normal` on both pill instances, not the token's -1% / 1.5.
 */
export default function Trend({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[24px] shrink-0 items-center gap-[7px] overflow-clip rounded-[17px] bg-positive-surface px-[8px]">
      <span aria-hidden className="size-[6px] shrink-0 rounded-full bg-positive" />
      <span className="text-12 leading-normal tracking-[-0.24px] whitespace-nowrap text-positive">
        {children}
      </span>
    </span>
  );
}
