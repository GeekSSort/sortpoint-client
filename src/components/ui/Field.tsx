import React from "react";

/**
 * Figma 77:20751 — labelled text input. The design gives two states: a filled
 * grey resting state and a white/brand-bordered focus state.
 */
export default function Field({
  label,
  className = "",
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  return (
    <div className={`flex w-full flex-col gap-[8px] ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-18 leading-[24px] font-medium text-muted">
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className="h-[56px] w-full rounded-[12px] border border-transparent bg-surface px-[16px] py-[8px] text-16 text-muted outline-none placeholder:text-muted/60 focus:border-brand focus:bg-white"
      />
    </div>
  );
}
