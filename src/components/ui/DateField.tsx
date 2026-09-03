import React from "react";
import MaskIcon from "./MaskIcon";

/**
 * Figma 77:20963 / 77:20965 — date control. `Default` is the brand-filled
 * variant, `Variant2` the outlined one.
 */
export default function DateField({
  value,
  variant = "solid",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const solid = variant === "solid";
  return (
    <button
      {...props}
      className={`relative flex cursor-pointer items-center justify-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-16 font-medium ${
        solid
          ? "bg-brand text-white"
          : "text-muted outline outline-1 -outline-offset-1 outline-muted"
      } ${className}`}
    >
      {solid && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[12px] bg-linear-to-b from-white/20 to-transparent shadow-[inset_0_0_1.5px_0_rgba(255,255,255,0.25)]"
        />
      )}
      <span className="relative whitespace-nowrap">{value}</span>
      <span className="relative size-[20px] shrink-0">
        <MaskIcon src="/icons/ui/calendar.svg" />
      </span>
    </button>
  );
}
