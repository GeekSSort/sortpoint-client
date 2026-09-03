"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ProductCategory, ProductItem } from "@/types/pos";
import { PosService } from "@/services";
import TablePagination from "@/components/shared/TablePagination";

/**
 * Figma: SORTPoint — POS product list 45:2171.
 *
 * 565-wide column: a 44px search bar, 16px gap, then the category row (40px),
 * 24px gap and a 3-up grid of 180x248 cards (12.5 across, 14 down) over a 48px
 * pagination bar.
 *
 * Below the design width the grid reflows on its own track size rather than
 * holding three columns — mine, no Figma frame for it.
 */

const CATEGORIES: ProductCategory[] = [
  "All Categories",
  "Electronics",
  "Groceries",
  "Fashion",
  "Home & Living",
];

/** Node 45:2174 — magnifier. */
function SearchIcon() {
  return (
    <svg className="block size-[24px] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8.5 3.75a6.75 6.75 0 0 1 6.75 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

/** Node 45:2179 — barcode scan. */
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

/** vuesax/linear/more, turned upright — node 45:2196. */
function MoreIcon() {
  return (
    <svg className="block size-[16px] -rotate-90" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.33333 6.66667C2.6 6.66667 2 7.26667 2 8C2 8.73333 2.6 9.33333 3.33333 9.33333C4.06667 9.33333 4.66667 8.73333 4.66667 8C4.66667 7.26667 4.06667 6.66667 3.33333 6.66667Z" fill="currentColor" />
      <path d="M12.6667 6.66667C11.9333 6.66667 11.3333 7.26667 11.3333 8C11.3333 8.73333 11.9333 9.33333 12.6667 9.33333C13.4 9.33333 14 8.73333 14 8C14 7.26667 13.4 6.66667 12.6667 6.66667Z" fill="currentColor" />
      <path d="M8 6.66667C7.26667 6.66667 6.66667 7.26667 6.66667 8C6.66667 8.73333 7.26667 9.33333 8 9.33333C8.73333 9.33333 9.33333 8.73333 9.33333 8C9.33333 7.26667 8.73333 6.66667 8 6.66667Z" fill="currentColor" />
    </svg>
  );
}

interface ProductGridProps {
  onSelectProduct?: (product: ProductItem) => void;
}

export default function ProductGrid({ onSelectProduct }: ProductGridProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [category, setCategory] = useState<ProductCategory>("All Categories");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    PosService.getProducts().then(setProducts).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "All Categories" || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    );
  }, [products, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <div className="flex w-full flex-col">
      {/* Search — 45:2172 */}
      <div className="flex h-[44px] w-full shrink-0 items-center justify-between overflow-clip rounded-[10px] bg-white px-[12px] py-[10px] shadow-[inset_0_0_0_1px_#eaeaea]">
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
            className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.5] font-normal tracking-[-0.28px] text-[#525252] outline-none placeholder:text-[#525252]"
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

      {/* Categories — 45:2183, 16px below the search bar */}
      <div className="mt-[16px] flex w-full shrink-0 items-center justify-between gap-[12px]">
        <div className="-mx-[2px] flex h-[40px] min-w-0 flex-1 items-center gap-[2px] overflow-x-auto px-[2px]">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setPage(1);
                }}
                className={`flex shrink-0 cursor-pointer items-center justify-center rounded-[10px] whitespace-nowrap transition-colors ${
                  active
                    ? "h-[40px] border-[0.8px] border-solid border-[#f5b800] px-[12px] py-[10px] text-[16px] leading-[1.2] tracking-[-0.48px] text-[#f5b800]"
                    : "p-[10px] text-[14px] leading-[1.2] tracking-[-0.42px] text-[#525252] hover:bg-[#fafafa]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="More filters"
          className="flex size-[40px] shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-[10px] border border-solid border-[#eaeaea] bg-white text-[#1e1e1e] shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)] transition-colors hover:bg-[#fafafa]"
        >
          <MoreIcon />
        </button>
      </div>

      {/* Grid — 45:2197, 24px below the category row */}
      <div className="mt-[24px] grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-[12.5px] gap-y-[14px]">
        {shown.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectProduct?.(p)}
            className="flex cursor-pointer items-center overflow-clip rounded-[10px] border-[0.6px] border-solid border-[#eaeaea] bg-white p-[10px] text-left transition-colors hover:border-[#f5b800]"
          >
            <div className="flex w-full flex-col items-center justify-center gap-[12px]">
              <div className="relative aspect-square w-full overflow-hidden rounded-[8px] border-[0.3px] border-solid border-[#eaeaea]">
                <Image src={p.image} alt={p.name} fill sizes="180px" className="object-cover" />
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
                    <span className="text-[12px] leading-normal font-normal tracking-[-0.24px] whitespace-nowrap text-[#00b837]">
                      Stock {p.stock}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-[40px] text-center text-[14px] text-[#525252]">No products match that search.</p>
      )}

      {/* Pagination — 45:2309, 14px under the grid */}
      <div className="mt-[14px]">
        <TablePagination
          dense
          page={current}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
