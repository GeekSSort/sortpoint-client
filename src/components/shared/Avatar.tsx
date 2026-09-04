import React from "react";
import Image from "next/image";

/**
 * The small square that stands in for a person or a company in a table row.
 *
 * Most of these records have no photo on the server, and `<Image src="">` is a
 * runtime error, not an empty box — so the fallback is the initials, drawn to
 * the same geometry as the photo it replaces.
 */
export default function Avatar({
  name,
  src,
  size = 28,
  radius = 6,
}: {
  name?: string | null;
  src?: string | null;
  size?: number;
  radius?: number;
}) {
  // Callers pass whatever the row holds, and a row with no name is a real
  // state — an unmapped field should show a dash, not throw.
  const initials = String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden bg-[#f5f5f5] font-medium text-[#525252] shadow-[inset_0_0_0_0.3px_#eaeaea]"
      style={{ width: size, height: size, borderRadius: radius, fontSize: Math.round(size * 0.4) }}
    >
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        (initials || "—")
      )}
    </span>
  );
}
