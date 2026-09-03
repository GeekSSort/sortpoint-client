import React from "react";

/**
 * A Figma icon's two-box geometry: a fixed outer frame with the artwork inset
 * by the exact percentages Figma reports, so the leaf keeps its aspect ratio
 * instead of stretching to the frame. Flat fills in the generated paths are
 * currentColor, so the caller sets the tone.
 */
export default function Glyph({
  w,
  h,
  inset,
  viewBox,
  children,
}: {
  w: number;
  h: number;
  inset: string;
  viewBox: string;
  children: React.ReactNode;
}) {
  return (
    <span className="relative block shrink-0" style={{ width: w, height: h }} aria-hidden>
      <span className="absolute block" style={{ inset }}>
        <svg
          className="block h-full w-full"
          viewBox={viewBox}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {children}
        </svg>
      </span>
    </span>
  );
}
