"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ProductItem } from "@/types/pos";
import { PosService } from "@/services";
import TablePagination from "@/components/shared/TablePagination";

/**
 * Figma: SORTPoint — POS Discount 247:13582.
 *
 * The product wall with a discount chip: a 56px search, the category row at
 * 24px type, then a 6-up grid of 160-wide cards over the 565 pagination bar.
 *
 * A card is p-10 at radius 10 behind a 0.6px hairline: a 160x160 image at
 * radius 8, then the name, then the price beside the stock pill. A discounted
 * product gains a full-width #e8e8e8 chip naming the rate — which is what this
 * screen is for, so it doubles as the control that sets one.
 */

const CATEGORIES = ["All Categories", "Electronics", "Groceries", "Fashion", "Home & Living"] as const;

/** Percent off per product. Local until the catalogue carries a discount field. */
const SEED: Record<string, number> = {};

function SearchIcon() {
  return (
    <svg className="block size-[24px] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg className="block size-[24px] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M7 8.5v7M10 8.5v7M13.5 8.5v7M17 8.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PosDiscountPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const [rates, setRates] = useState<Record<string, number>>(SEED);
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    PosService.getProducts()
      .then(setProducts)
      .catch(() => {});
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (category === CATEGORIES[0] || p.category === category)
    );
  }, [products, query, category]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, totalPages);
  const shown = visible.slice((current - 1) * pageSize, current * pageSize);

  const save = () => {
    if (!editing) return;
    const pct = Number(draft);
    setRates((r) => {
      const next = { ...r };
      if (!draft.trim() || Number.isNaN(pct) || pct <= 0) delete next[editing.id];
      else next[editing.id] = Math.min(100, Math.round(pct));
      return next;
    });
    setEditing(null);
  };

  return (
    <div className="flex w-full flex-col gap-[16px] select-none">
      {/* Search — 247:15731 */}
      <div className="flex h-[56px] w-full items-center justify-between overflow-clip rounded-[10px] border border-solid border-[#eaeaea] bg-white px-[12px] py-[10px]">
        <div className="flex min-w-0 flex-1 items-center gap-[6px] text-[#525252]">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search product by name, SKU or barcode..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.5] tracking-[-0.28px] text-[#525252] outline-none placeholder:text-[#525252]"
          />
        </div>
        <button
          type="button"
          aria-label="Scan barcode"
          className="shrink-0 cursor-pointer text-[#525252] transition-colors hover:text-[#1e1e1e]"
        >
          <ScanIcon />
        </button>
      </div>

      <div className="flex w-full flex-col gap-[24px]">
        {/* Categories — 247:15742, 24px type across the row */}
        <div className="flex h-[56px] w-full items-center justify-between gap-[8px] overflow-x-auto">
          {CATEGORIES.map((c) => {
            const on = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setPage(1);
                }}
                className={`flex h-[56px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] whitespace-nowrap transition-colors ${
                  on
                    ? "border-[0.8px] border-solid border-[#f5b800] px-[24px] py-[10px] text-[#f5b800]"
                    : "p-[10px] text-[#525252] hover:text-[#1e1e1e]"
                }`}
              >
                <span className="text-[24px] leading-[1.2] font-normal tracking-[-0.72px]">{c}</span>
              </button>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-[14px]">
          {shown.length === 0 && (
            <p className="py-[40px] text-center text-[14px] text-[#525252]">
              No products match that search.
            </p>
          )}

          {/* 6 across at the design width; the track floor keeps the card at
              its designed 160 rather than stretching it on a wider screen. */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(182px,1fr))] gap-[14px]">
            {shown.map((p) => {
              const rate = rates[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setEditing(p);
                    setDraft(rate ? String(rate) : "");
                  }}
                  aria-label={`Set discount for ${p.name}`}
                  className="flex cursor-pointer items-center overflow-clip rounded-[10px] border-[0.6px] border-solid border-[#eaeaea] p-[10px] text-left transition-colors hover:border-[#f5b800]"
                >
                  <div className="flex w-full flex-col items-center justify-center gap-[12px]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-[8px] border-[0.3px] border-solid border-[#eaeaea]">
                      <Image src={p.image} alt={p.name} fill sizes="160px" className="object-cover" />
                    </div>
                    <div className="flex w-full flex-col items-start gap-[8px]">
                      <p className="w-full truncate text-[14px] leading-[24px] font-normal text-[#525252]">
                        {p.name}
                      </p>
                      <div className="flex w-full items-center justify-between gap-[6px]">
                        <span className="text-[16px] leading-[24px] font-medium whitespace-nowrap text-[#f5b800]">
                          {p.priceFormatted}
                        </span>
                        <span className="flex h-[24px] shrink-0 items-center gap-[7px] overflow-clip rounded-[17px] bg-[#f5fff8] px-[8px]">
                          <span className="size-[6px] shrink-0 rounded-full bg-[#00b837]" />
                          <span className="text-[12px] leading-normal tracking-[-0.24px] whitespace-nowrap text-[#00b837]">
                            Stock {p.stock}
                          </span>
                        </span>
                      </div>
                      {/* 247:16040 — only on a discounted product */}
                      {rate ? (
                        <span className="flex h-[24px] w-full items-center justify-center overflow-clip rounded-[17px] bg-[#e8e8e8] px-[8px]">
                          <span className="text-[12px] leading-normal tracking-[-0.24px] whitespace-nowrap text-[#656565]">
                            {rate}% Discount
                          </span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pagination — 247:15868, 565 wide */}
          <div className="w-full max-w-[565px]">
            <TablePagination
              dense
              sizes={[18, 36, 54]}
              page={current}
              pageSize={pageSize}
              total={visible.length}
              onPageChange={setPage}
              onPageSizeChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Setting a rate — no Figma frame; built in the app's own language. */}
      {editing && (
        <div
          className="sp-fade fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-[16px]"
          onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Set discount"
        >
          <div className="sp-rise flex w-full max-w-[380px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-between border-b border-solid border-[#eaeaea] px-[20px] py-[16px]">
              <p className="truncate text-[18px] leading-[1.5] font-medium tracking-[-0.36px] text-[#1e1e1e]">
                {editing.name}
              </p>
            </div>
            <div className="flex flex-col gap-[12px] px-[20px] py-[16px]">
              <label htmlFor="pos-discount" className="text-[13px] font-medium text-[#1e1e1e]">
                Discount (%)
              </label>
              <input
                id="pos-discount"
                autoFocus
                inputMode="numeric"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                  if (e.key === "Escape") setEditing(null);
                }}
                placeholder="0"
                className="h-[44px] w-full rounded-[10px] bg-white px-[12px] text-[14px] text-[#1e1e1e] shadow-[inset_0_0_0_1px_#eaeaea] outline-none focus:shadow-[inset_0_0_0_1px_#f5b800]"
              />
              <p className="text-[12px] text-[#8a8a8a]">Leave it empty to remove the discount.</p>
            </div>
            <div className="flex items-center justify-end gap-[12px] border-t border-solid border-[#eaeaea] px-[20px] py-[16px]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex h-[44px] cursor-pointer items-center justify-center rounded-[12px] border border-solid border-[#eaeaea] bg-white px-[16px] text-[14px] font-medium text-[#525252] transition-colors hover:bg-[#fafafa]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, rgb(245,184,0) 0%, rgb(245,184,0) 100%)",
                }}
                className="flex h-[44px] cursor-pointer items-center justify-center rounded-[12px] px-[16px] text-[14px] font-semibold text-white shadow-[inset_0px_0px_1.5px_0px_rgba(255,255,255,0.25)]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
