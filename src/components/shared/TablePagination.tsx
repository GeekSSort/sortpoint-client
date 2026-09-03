"use client";

import React, { useState } from "react";

/**
 * The pagination bar shared by the dashboard table (Figma 30:17020) and the POS
 * product grid (45:2309). Same controls; the POS one is denser — 48px tall with
 * 12px between the page groups instead of 64px and 24px.
 */

export function Chevron({ dir }: { dir: "up" | "left" | "right" }) {
  const d =
    dir === "up"
      ? "M7.5286 5.5286C7.78894 5.26825 8.21105 5.26825 8.4714 5.5286L12.4714 9.5286C12.7318 9.78895 12.7318 10.2111 12.4714 10.4714C12.2111 10.7318 11.7889 10.7318 11.5286 10.4714L8 6.94281L4.4714 10.4714C4.21105 10.7318 3.78894 10.7318 3.5286 10.4714C3.26825 10.2111 3.26825 9.78895 3.5286 9.5286L7.5286 5.5286Z"
      : dir === "left"
        ? "M10.4714 3.5286C10.7318 3.78894 10.7318 4.21105 10.4714 4.4714L6.94281 8L10.4714 11.5286C10.7318 11.7889 10.7318 12.2111 10.4714 12.4714C10.2111 12.7318 9.78895 12.7318 9.5286 12.4714L5.5286 8.4714C5.26825 8.21105 5.26825 7.78894 5.5286 7.5286L9.5286 3.5286C9.78895 3.26825 10.2111 3.26825 10.4714 3.5286Z"
        : "M5.5286 3.5286C5.78895 3.26825 6.21106 3.26825 6.4714 3.5286L10.4714 7.5286C10.7318 7.78894 10.7318 8.21105 10.4714 8.4714L6.4714 12.4714C6.21106 12.7318 5.78895 12.7318 5.5286 12.4714C5.26825 12.2111 5.26825 11.7889 5.5286 11.5286L9.05719 8L5.5286 4.4714C5.26825 4.21105 5.26825 3.78894 5.5286 3.5286Z";
  return (
    <svg className="block size-[16px]" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d={d} fill="currentColor" />
    </svg>
  );
}

/** 1 2 3 … 10, collapsed around the current page. */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) out.push("…");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 1) out.push("…");
  out.push(total);
  return out;
}

const SQUARE =
  "flex size-[32px] items-center justify-center rounded-[8px] border border-solid border-[#eaeaea] bg-white text-[#525252] transition-colors not-disabled:cursor-pointer hover:not-disabled:bg-[#fafafa] disabled:cursor-not-allowed disabled:text-[#d4d4d4]";
const SIZES = [8, 16, 24, 50];

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  /** POS variant: 48px tall, tighter gutters and group gaps. */
  dense?: boolean;
}

export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  dense = false,
}: TablePaginationProps) {
  const [sizeOpen, setSizeOpen] = useState(false);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const from = total ? (current - 1) * pageSize + 1 : 0;
  const to = Math.min(current * pageSize, total);

  return (
    <div
      className={`flex flex-col items-center justify-between gap-[12px] sm:flex-row ${
        dense
          ? "min-h-[48px] rounded-[12px] bg-white px-[12px] py-[8px] shadow-[inset_0_0_0_1px_#eaeaea]"
          : "min-h-[64px] px-[22px] py-[16px] shadow-[inset_0_1px_0_#eaeaea]"
      }`}
    >
      <div className="flex items-center gap-[16px]">
        <p className="text-[12px] leading-normal font-medium tracking-[-0.24px] whitespace-nowrap text-[#525252]">
          Showing {from} to {to} of {total} entries
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSizeOpen((v) => !v)}
            onBlur={() => window.setTimeout(() => setSizeOpen(false), 120)}
            aria-expanded={sizeOpen}
            className="flex h-[32px] cursor-pointer items-center justify-center gap-[10px] overflow-clip rounded-[8px] border border-solid border-[#eaeaea] bg-white p-[10px] text-[12px] leading-normal font-medium tracking-[-0.24px] whitespace-nowrap text-[#1e1e1e] transition-colors hover:bg-[#fafafa]"
          >
            Show {pageSize}
            <span className="text-[#1e1e1e]">
              <Chevron dir="up" />
            </span>
          </button>
          {sizeOpen && (
            <div className="absolute bottom-[38px] left-0 z-30 w-[110px] overflow-hidden rounded-[10px] bg-white py-[4px] shadow-[0_8px_30px_rgba(0,0,0,0.10)] ring-1 ring-[#eaeaea]">
              {SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    onPageSizeChange(n);
                    setSizeOpen(false);
                  }}
                  className={`block w-full cursor-pointer px-[14px] py-[8px] text-left text-[12px] transition-colors hover:bg-[#fafafa] ${
                    n === pageSize ? "font-medium text-[#f5b800]" : "text-[#525252]"
                  }`}
                >
                  Show {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "gap-[12px]" : "gap-[12px] sm:gap-[24px]"}`}>
        <button
          type="button"
          aria-label="Previous page"
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          className={SQUARE}
        >
          <Chevron dir="left" />
        </button>

        <div className="flex items-start">
          {pageList(current, totalPages).map((n, i) =>
            n === "…" ? (
              <span
                key={`gap-${i}`}
                className="flex size-[32px] items-center justify-center text-[12px] leading-normal font-medium tracking-[-0.24px] text-[#525252]"
              >
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onPageChange(n)}
                aria-current={n === current ? "page" : undefined}
                className={`flex size-[32px] cursor-pointer items-center justify-center overflow-clip rounded-[10px] text-[12px] leading-normal font-medium tracking-[-0.24px] text-[#525252] transition-colors ${
                  n === current
                    ? `border border-solid bg-white ${dense ? "border-[#eaeaea]" : "border-[#fff2e8]"}`
                    : "hover:bg-[#fafafa]"
                }`}
              >
                {n}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          aria-label="Next page"
          disabled={current === totalPages}
          onClick={() => onPageChange(current + 1)}
          className={SQUARE}
        >
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}
