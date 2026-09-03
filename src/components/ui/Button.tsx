import React from "react";

/** Figma 77:20763 — brand button. */
export default function Button({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`relative flex h-[56px] w-full cursor-pointer items-center justify-center rounded-[12px] bg-brand px-[16px] py-[8px] text-18 leading-[24px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {/* Figma layers a top-down white wash over the flat brand fill, plus a
          hairline inner highlight. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] bg-linear-to-b from-white/20 to-transparent shadow-[inset_0_0_1.5px_0_rgba(255,255,255,0.25)]"
      />
      <span className="relative">{children}</span>
    </button>
  );
}
