"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StockItem } from "@/types/stock";
import { StockService } from "@/services";
import StatusPill, { Tone } from "@/components/shared/StatusPill";
import RowActionMenu from "@/components/shared/RowActionMenu";
import TablePagination from "@/components/shared/TablePagination";
import Modal, { GOLD_GRADIENT, MODAL_GHOST, MODAL_PRIMARY, RED_GRADIENT } from "@/components/shared/Modal";

/**
 * Figma: SORTPoint — Stock 57:13117.
 *
 * Search left, Add New right; an 898px card holding the 1128-wide eight-column
 * table (40px head, 54px rows) over the 64px pagination bar. Column tracks are
 * the design widths as fr units so extra width spreads evenly.
 */

const STATUS_TONE: Record<StockItem["status"], Tone> = {
  "In Stock": "green",
  "Low Stock": "gold",
  "Out of Stock": "rose",
};

/** Availability decides the badge, so it is derived rather than stored. */
const statusFor = (available: number, lowStock: number): StockItem["status"] =>
  available === 0 ? "Out of Stock" : available <= lowStock ? "Low Stock" : "In Stock";

function AddIcon() {
  return (
    <svg className="block size-[20px] shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="0.9" y="0.9" width="18.2" height="18.2" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6.4v7.2M6.4 10h7.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="block size-[24px] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="block size-[18px] shrink-0" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M2.25 4.5h13.5M4.5 9h9M7.5 13.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Product Name  SKU  Warehouse  Available  Reserved  Low Stock  Status  Action
const GRID = "grid-cols-[225fr_195fr_155fr_110fr_110fr_110fr_140fr_83fr]";
const CELL = "flex min-w-0 items-center p-[12px]";
const HEAD = "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#1e1e1e]";
const TEXT = "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#525252]";

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [note, setNote] = useState<string | null>(null);
  const [detailOf, setDetailOf] = useState<StockItem | null>(null);
  const [adjustOf, setAdjustOf] = useState<StockItem | null>(null);
  const [adjustBy, setAdjustBy] = useState("");
  const [adjustError, setAdjustError] = useState<string | null>(null);
  const [removeOf, setRemoveOf] = useState<StockItem | null>(null);

  useEffect(() => {
    StockService.getStock({ search: query })
      .then((res) => setStock(res.data))
      .catch(() => {});
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(stock.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = useMemo(
    () => stock.slice((current - 1) * pageSize, current * pageSize),
    [stock, current, pageSize]
  );

  return (
    <div className="flex w-full flex-col gap-[14px] select-none">
      {/* Headline — 57:13119 */}
      <div className="flex w-full flex-col items-stretch gap-[16px] lg:h-[48px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="flex h-[44px] w-full items-center justify-between gap-[12px] overflow-clip rounded-[10px] bg-white px-[12px] py-[10px] shadow-[inset_0_0_0_1px_#eaeaea] lg:w-[370px]">
          <div className="flex min-w-0 flex-1 items-center gap-[6px] text-[#525252]">
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by product name, SKU or barcode..."
              aria-label="Search stock"
              className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.5] tracking-[-0.28px] text-[#525252] outline-none placeholder:text-[#525252]"
            />
          </div>
          <button
            type="button"
            aria-label="Filter"
            onClick={() => setNote("Filter panel not designed yet")}
            className="shrink-0 cursor-pointer text-[#525252] transition-colors hover:text-[#1e1e1e]"
          >
            <FilterIcon />
          </button>
        </div>

        <Link
          href="/inventory/stock/add"
          style={{ backgroundImage: GOLD_GRADIENT }}
          className="flex h-[48px] shrink-0 cursor-pointer items-center justify-center gap-[12px] rounded-[12px] px-[16px] py-[8px] text-[16px] leading-[24px] font-semibold whitespace-nowrap text-white shadow-[inset_0px_0px_1.5px_0px_rgba(255,255,255,0.25)]"
        >
          <AddIcon />
          Add New
        </Link>
      </div>

      {/* Table card — 57:13151 */}
      <div className="w-full overflow-hidden rounded-[12px] bg-white shadow-[inset_0_0_0_1px_#eaeaea]">
        <div className="hidden px-[16px] pt-[16px] md:block">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <div className={`grid ${GRID} items-start overflow-clip rounded-[6px] shadow-[inset_0_0_0_1px_#eaeaea]`}>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Product Name</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>SKU</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Warehouse</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Available</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Reserved</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Low Stock</span></div>
                <div className={`${CELL} h-[40px] justify-center bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Status</span></div>
                <div className={`${CELL} h-[40px] justify-center bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Action</span></div>
              </div>

              <div className="mt-[6px]">
                {rows.length === 0 && (
                  <p className="py-[40px] text-center text-[14px] text-[#525252]">No stock matches that search.</p>
                )}
                {rows.map((r, i) => (
                  <div
                    key={r.id}
                    className={`grid ${GRID} h-[54px] items-center ${i === rows.length - 1 ? "" : "border-b border-solid border-[#eaeaea]"}`}
                  >
                    {/* 28px thumbnail, 8px from the name — 57:13233 */}
                    <div className={`${CELL} gap-[8px]`}>
                      <span className="relative size-[28px] shrink-0 overflow-hidden rounded-[6px]">
                        <Image src={r.image} alt="" fill sizes="28px" className="object-cover" />
                      </span>
                      <span className={`${TEXT} truncate`}>{r.name}</span>
                    </div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.sku}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.warehouse}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.available}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.reserved}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.lowStock}</span></div>
                    <div className={`${CELL} justify-center`}>
                      <StatusPill label={r.status} tone={STATUS_TONE[r.status] ?? "slate"} />
                    </div>
                    <div className={`${CELL} justify-center`}>
                      <RowActionMenu
                        label={`Actions for ${r.sku}`}
                        actions={[
                          { label: "View stock", onSelect: () => setDetailOf(r) },
                          {
                            label: "Adjust stock",
                            onSelect: () => {
                              setAdjustBy("");
                              setAdjustError(null);
                              setAdjustOf(r);
                            },
                          },
                          { label: "Remove stock line", onSelect: () => setRemoveOf(r) },
                        ]}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stacked cards below md */}
        <div className="flex flex-col gap-[10px] px-[16px] pt-[16px] md:hidden">
          {rows.map((r) => (
            <div key={r.id} className="rounded-[10px] border border-solid border-[#eaeaea] p-[12px]">
              <div className="flex items-start justify-between gap-[10px]">
                <div className="flex min-w-0 items-center gap-[8px]">
                  <span className="relative size-[28px] shrink-0 overflow-hidden rounded-[6px]">
                    <Image src={r.image} alt="" fill sizes="28px" className="object-cover" />
                  </span>
                  <div className="min-w-0">
                    <p className={`${TEXT} truncate !text-[#1e1e1e]`}>{r.name}</p>
                    <p className="mt-[2px] truncate text-[12px] tracking-[-0.24px] text-[#525252]">
                      {r.sku} · {r.warehouse}
                    </p>
                  </div>
                </div>
                <StatusPill label={r.status} tone={STATUS_TONE[r.status] ?? "slate"} />
              </div>
              <p className="mt-[10px] text-[12px] tracking-[-0.24px] text-[#525252]">
                {r.available} available · {r.reserved} reserved · low at {r.lowStock}
              </p>
            </div>
          ))}
        </div>

        {note && <p className="px-[16px] pt-[10px] text-[13px] text-[#525252]">{note}</p>}

        {/* Pagination — 57:13603 */}
        <div className="mt-[9px]">
          <TablePagination
            page={current}
            pageSize={pageSize}
            total={stock.length}
            onPageChange={setPage}
            onPageSizeChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* View stock */}
      <Modal
        open={detailOf !== null}
        onClose={() => setDetailOf(null)}
        title={detailOf?.name ?? ""}
        footer={
          <>
            <button type="button" className={MODAL_GHOST} onClick={() => setDetailOf(null)}>
              Close
            </button>
            <button
              type="button"
              style={{ backgroundImage: GOLD_GRADIENT }}
              className={MODAL_PRIMARY}
              onClick={() => {
                if (detailOf) {
                  setAdjustBy("");
                  setAdjustError(null);
                  setAdjustOf(detailOf);
                }
                setDetailOf(null);
              }}
            >
              Adjust stock
            </button>
          </>
        }
      >
        {detailOf && (
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[12px]">
              <span className="relative size-[56px] shrink-0 overflow-hidden rounded-[10px] border border-solid border-[#eaeaea]">
                <Image src={detailOf.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[16px] font-medium text-[#1e1e1e]">{detailOf.name}</p>
                <p className="truncate text-[13px] text-[#525252]">{detailOf.sku}</p>
              </div>
            </div>
            <dl className="flex flex-col gap-[12px]">
              {[
                ["Warehouse", detailOf.warehouse],
                ["Available", String(detailOf.available)],
                ["Reserved", String(detailOf.reserved)],
                ["Low stock at", String(detailOf.lowStock)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-[16px]">
                  <dt className="text-[14px] text-[#525252]">{k}</dt>
                  <dd className="text-[14px] font-medium text-[#1e1e1e]">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-[16px]">
                <dt className="text-[14px] text-[#525252]">Status</dt>
                <dd>
                  <StatusPill label={detailOf.status} tone={STATUS_TONE[detailOf.status] ?? "slate"} />
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      {/* Adjust stock — a signed delta against the available count */}
      <Modal
        open={adjustOf !== null}
        onClose={() => setAdjustOf(null)}
        title="Adjust stock"
        width={440}
        footer={
          <>
            <button type="button" className={MODAL_GHOST} onClick={() => setAdjustOf(null)}>
              Cancel
            </button>
            <button
              type="button"
              style={{ backgroundImage: GOLD_GRADIENT }}
              className={MODAL_PRIMARY}
              onClick={() => {
                if (!adjustOf) return;
                const delta = Number(adjustBy);
                if (!adjustBy.trim() || Number.isNaN(delta) || delta === 0) {
                  return setAdjustError("Enter a non-zero amount, e.g. 12 or -5.");
                }
                const next = adjustOf.available + delta;
                if (next < 0) return setAdjustError("That would take available stock below zero.");
                // Optimistic: the mock backend has no adjust endpoint yet.
                setStock((list) =>
                  list.map((x) =>
                    x.id === adjustOf.id
                      ? { ...x, available: next, status: statusFor(next, x.lowStock) }
                      : x
                  )
                );
                setNote(`${adjustOf.name}: available ${adjustOf.available} → ${next}`);
                setAdjustOf(null);
              }}
            >
              Apply adjustment
            </button>
          </>
        }
      >
        {adjustOf && (
          <div className="flex flex-col gap-[12px]">
            <p className="text-[14px] leading-[1.6] text-[#525252]">
              <span className="font-medium text-[#1e1e1e]">{adjustOf.name}</span> has{" "}
              <span className="font-medium text-[#1e1e1e]">{adjustOf.available}</span> available in{" "}
              {adjustOf.warehouse}.
            </p>
            <label className="flex flex-col gap-[6px]">
              <span className="text-[14px] font-medium tracking-[-0.28px] text-[#525252]">
                Adjustment (+ / −)
              </span>
              <input
                autoFocus
                value={adjustBy}
                onChange={(e) => {
                  setAdjustBy(e.target.value.replace(/[^\d-]/g, ""));
                  setAdjustError(null);
                }}
                inputMode="numeric"
                placeholder="e.g. 12 or -5"
                aria-label="Stock adjustment"
                className="flex h-[44px] items-center rounded-[10px] bg-white px-[12px] text-[14px] tracking-[-0.28px] text-[#525252] shadow-[inset_0_0_0_1px_#eaeaea] outline-none placeholder:text-[rgba(82,82,82,0.6)]"
              />
            </label>
            {adjustBy.trim() !== "" && !Number.isNaN(Number(adjustBy)) && (
              <p className="text-[13px] text-[#525252]">
                New available:{" "}
                <span className="font-medium text-[#1e1e1e]">
                  {adjustOf.available + Number(adjustBy)}
                </span>
              </p>
            )}
            {adjustError && <p className="text-[13px] text-[#ef4444]">{adjustError}</p>}
          </div>
        )}
      </Modal>

      {/* Remove line */}
      <Modal
        open={removeOf !== null}
        onClose={() => setRemoveOf(null)}
        title="Remove stock line"
        width={440}
        footer={
          <>
            <button type="button" className={MODAL_GHOST} onClick={() => setRemoveOf(null)}>
              Cancel
            </button>
            <button
              type="button"
              style={{ backgroundImage: RED_GRADIENT }}
              className={MODAL_PRIMARY}
              onClick={() => {
                if (!removeOf) return;
                setStock((list) => list.filter((x) => x.id !== removeOf.id));
                setNote(`${removeOf.name} removed from ${removeOf.warehouse}`);
                setRemoveOf(null);
              }}
            >
              Confirm remove
            </button>
          </>
        }
      >
        {removeOf && (
          <p className="text-[14px] leading-[1.6] text-[#525252]">
            Remove <span className="font-medium text-[#1e1e1e]">{removeOf.name}</span> from{" "}
            <span className="font-medium text-[#1e1e1e]">{removeOf.warehouse}</span>? The product itself is
            not deleted.
          </p>
        )}
      </Modal>
    </div>
  );
}
