import React from "react";

/**
 * Renders an exported Figma SVG through a CSS mask so the glyph stays exact
 * while its colour follows `currentColor`. Figma exports bake the fill in,
 * which breaks any component that needs the same icon in two colours.
 */
export default function MaskIcon({
  src,
  className = "",
  inset = "0",
}: {
  src: string;
  className?: string;
  /** Glyph inset inside its frame, as given by Figma. */
  inset?: string;
}) {
  return (
    <span
      aria-hidden
      className={`absolute bg-current ${className}`}
      style={{
        inset,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
