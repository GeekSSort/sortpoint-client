"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TransferRecord } from "@/types/transfers";
import { TransferService } from "@/services";
import StatusPill, { Tone } from "@/components/shared/StatusPill";
import TablePagination from "@/components/shared/TablePagination";
import DateField from "@/components/shared/DateField";
import Modal, { GOLD_GRADIENT, MODAL_GHOST, MODAL_PRIMARY } from "@/components/shared/Modal";
import { matchesDay } from "@/lib/dateFilter";

/**
 * Figma: SORTPoint — Transfers 57:14237.
 *
 * Search left, date field + Add New right; an 898px card with the 1128-wide
 * seven-column table (40px head, 54px rows) over the 64px pagination bar.
 *
 * The design has no Action column, so the row itself is the control: clicking
 * one opens its detail.
 */

const STATUS_TONE: Record<TransferRecord["status"], Tone> = {
  "In Stock": "green",
  "Low Stock": "gold",
  "Out of Stock": "rose",
  Completed: "green",
  Pending: "amber",
};

const LOCATIONS = [
  "Head Office, Dhaka",
  "Uttara Branch, Dhaka",
  "Gulshan Branch, Dhaka",
  "Chittagong Warehouse",
  "Sylhet Outlet",
] as const;

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

/** The arrow between the two locations in the detail modal. */
function ArrowRight() {
  return (
    <svg className="block size-[18px] shrink-0" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 9h12M10.5 4.5L15 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Transfer ID  From  To  Products  Quantity  Date  Status
const GRID = "grid-cols-[145fr_184fr_184fr_142fr_142fr_190fr_140fr]";
const CELL = "flex min-w-0 items-center p-[12px]";
const HEAD = "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#1e1e1e]";
const TEXT = "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#525252]";
const FORM_FIELD =
  "flex h-[44px] items-center rounded-[10px] bg-white px-[12px] text-[14px] tracking-[-0.28px] text-[#525252] shadow-[inset_0_0_0_1px_#eaeaea] outline-none placeholder:text-[rgba(82,82,82,0.6)]";

const blank = { from: "", to: "", products: "", quantity: "" };

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [note, setNote] = useState<string | null>(null);
  const [detailOf, setDetailOf] = useState<TransferRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState({ ...blank });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    TransferService.getTransfers({ search: query })
      .then((res) => setTransfers(res.data))
      .catch(() => {});
  }, [query]);

  const visible = useMemo(
    () => transfers.filter((t) => matchesDay(t.dateTime, date)),
    [transfers, date]
  );
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = useMemo(
    () => visible.slice((current - 1) * pageSize, current * pageSize),
    [visible, current, pageSize]
  );

  const createTransfer = () => {
    const qty = Number(draft.quantity);
    if (!draft.from) return setFormError("Pick a source location.");
    if (!draft.to) return setFormError("Pick a destination.");
    if (draft.from === draft.to) return setFormError("Source and destination must differ.");
    if (!draft.products.trim()) return setFormError("Describe what is being transferred.");
    if (!draft.quantity.trim() || Number.isNaN(qty) || qty <= 0)
      return setFormError("Enter a quantity greater than zero.");
    const now = new Date();
    const created: TransferRecord = {
      id: `trf-${Date.now()}`,
      transferId: `TRF-${String(transfers.length + 1).padStart(4, "0")}`,
      fromLocation: draft.from,
      toLocation: draft.to,
      productsSummary: draft.products.trim(),
      quantity: qty,
      dateTime: `${now.getDate()} ${now.toLocaleString("en-GB", { month: "long" })} ${now.getFullYear()}, ${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })}`,
      status: "Pending",
    };
    // Optimistic: the mock backend has no create endpoint yet.
    setTransfers((list) => [created, ...list]);
    setNote(`${created.transferId} created`);
    setDraft({ ...blank });
    setFormError(null);
    setCreateOpen(false);
    setPage(1);
  };

  return (
    <div className="flex w-full flex-col gap-[14px] select-none">
      {/* Headline — 57:14239 */}
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
              aria-label="Search transfers"
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

        <div className="flex shrink-0 items-center gap-[16px]">
          <DateField value={date} onChange={setDate} ariaLabel="Filter transfers by date" />
          <button
            type="button"
            onClick={() => {
              setDraft({ ...blank });
              setFormError(null);
              setCreateOpen(true);
            }}
            style={{ backgroundImage: GOLD_GRADIENT }}
            className="flex h-[48px] shrink-0 cursor-pointer items-center justify-center gap-[12px] rounded-[12px] px-[16px] py-[8px] text-[16px] leading-[24px] font-semibold whitespace-nowrap text-white shadow-[inset_0px_0px_1.5px_0px_rgba(255,255,255,0.25)]"
          >
            <AddIcon />
            Add New
          </button>
        </div>
      </div>

      {/* Table card — 57:14271 */}
      <div className="w-full overflow-hidden rounded-[12px] bg-white shadow-[inset_0_0_0_1px_#eaeaea]">
        <div className="hidden px-[16px] pt-[16px] md:block">
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className={`grid ${GRID} items-start overflow-clip rounded-[6px] shadow-[inset_0_0_0_1px_#eaeaea]`}>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Transfer ID</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>From</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>To</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Products</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Quantity</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Date</span></div>
                <div className={`${CELL} h-[40px] justify-center bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Status</span></div>
              </div>

              <div className="mt-[6px]">
                {rows.length === 0 && (
                  <p className="py-[40px] text-center text-[14px] text-[#525252]">
                    No transfers match that search or date.
                  </p>
                )}
                {rows.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDetailOf(t)}
                    aria-label={`Open ${t.transferId}`}
                    className={`grid ${GRID} h-[54px] w-full cursor-pointer items-center text-left transition-colors outline-none hover:bg-[#fafafa] focus-visible:bg-[#fffaeb] focus-visible:ring-1 focus-visible:ring-[#f5b800] focus-visible:ring-inset ${
                      i === rows.length - 1 ? "" : "border-b border-solid border-[#eaeaea]"
                    }`}
                  >
                    <div className={CELL}><span className={`${TEXT} truncate`}>{t.transferId}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{t.fromLocation}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{t.toLocation}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{t.productsSummary}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{t.quantity}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{t.dateTime}</span></div>
                    <div className={`${CELL} justify-center`}>
                      <StatusPill label={t.status} tone={STATUS_TONE[t.status] ?? "slate"} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stacked cards below md — also tappable */}
        <div className="flex flex-col gap-[10px] px-[16px] pt-[16px] md:hidden">
          {rows.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setDetailOf(t)}
              aria-label={`Open ${t.transferId}`}
              className="w-full cursor-pointer rounded-[10px] border border-solid border-[#eaeaea] p-[12px] text-left transition-colors outline-none hover:bg-[#fafafa] focus-visible:border-[#f5b800] focus-visible:bg-[#fffaeb]"
            >
              <div className="flex items-start justify-between gap-[10px]">
                <div className="min-w-0">
                  <p className={`${TEXT} truncate !text-[#1e1e1e]`}>{t.transferId}</p>
                  <p className="mt-[2px] truncate text-[12px] tracking-[-0.24px] text-[#525252]">
                    {t.fromLocation} → {t.toLocation}
                  </p>
                </div>
                <StatusPill label={t.status} tone={STATUS_TONE[t.status] ?? "slate"} />
              </div>
              <div className="mt-[10px] flex items-center justify-between gap-[10px]">
                <span className="truncate text-[12px] tracking-[-0.24px] text-[#525252]">{t.dateTime}</span>
                <span className={`${TEXT} shrink-0`}>
                  {t.productsSummary} · {t.quantity}
                </span>
              </div>
            </button>
          ))}
        </div>

        {note && <p className="px-[16px] pt-[10px] text-[13px] text-[#525252]">{note}</p>}

        {/* Pagination — 57:14680 */}
        <div className="mt-[9px]">
          <TablePagination
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

      {/* Transfer detail — opened by clicking the row */}
      <Modal
        open={detailOf !== null}
        onClose={() => setDetailOf(null)}
        title={`Transfer ${detailOf?.transferId ?? ""}`}
        footer={
          <button type="button" className={MODAL_GHOST} onClick={() => setDetailOf(null)}>
            Close
          </button>
        }
      >
        {detailOf && (
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[12px] rounded-[10px] bg-[#fafafa] p-[12px]">
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[#8a8a8a]">From</p>
                <p className="truncate text-[14px] font-medium text-[#1e1e1e]">{detailOf.fromLocation}</p>
              </div>
              <span className="shrink-0 text-[#f5b800]">
                <ArrowRight />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[#8a8a8a]">To</p>
                <p className="truncate text-[14px] font-medium text-[#1e1e1e]">{detailOf.toLocation}</p>
              </div>
            </div>

            <dl className="flex flex-col gap-[12px]">
              {[
                ["Transfer ID", detailOf.transferId],
                ["Products", detailOf.productsSummary],
                ["Quantity", String(detailOf.quantity)],
                ["Date", detailOf.dateTime],
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

      {/* New transfer — no Figma frame; built in the app's own language. */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New transfer"
        width={460}
        footer={
          <>
            <button type="button" className={MODAL_GHOST} onClick={() => setCreateOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              style={{ backgroundImage: GOLD_GRADIENT }}
              className={MODAL_PRIMARY}
              onClick={createTransfer}
            >
              Create transfer
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-[14px]">
          {(["from", "to"] as const).map((k) => (
            <label key={k} className="flex flex-col gap-[6px]">
              <span className="text-[14px] font-medium tracking-[-0.28px] text-[#525252]">
                {k === "from" ? "From" : "To"}
              </span>
              <select
                value={draft[k]}
                aria-label={k === "from" ? "Transfer from" : "Transfer to"}
                onChange={(e) => {
                  setDraft((d) => ({ ...d, [k]: e.target.value }));
                  setFormError(null);
                }}
                className={`${FORM_FIELD} cursor-pointer`}
              >
                <option value="">Select a location</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <label className="flex flex-col gap-[6px]">
            <span className="text-[14px] font-medium tracking-[-0.28px] text-[#525252]">Products</span>
            <input
              value={draft.products}
              onChange={(e) => {
                setDraft((d) => ({ ...d, products: e.target.value }));
                setFormError(null);
              }}
              placeholder="e.g. 5 Products"
              aria-label="Products"
              className={FORM_FIELD}
            />
          </label>

          <label className="flex flex-col gap-[6px]">
            <span className="text-[14px] font-medium tracking-[-0.28px] text-[#525252]">Quantity</span>
            <input
              value={draft.quantity}
              onChange={(e) => {
                setDraft((d) => ({ ...d, quantity: e.target.value.replace(/[^\d]/g, "") }));
                setFormError(null);
              }}
              inputMode="numeric"
              placeholder="0"
              aria-label="Quantity"
              className={FORM_FIELD}
            />
          </label>

          <p className="text-[12px] text-[#8a8a8a]">New transfers start as Pending.</p>
          {formError && <p className="text-[13px] text-[#ef4444]">{formError}</p>}
        </div>
      </Modal>
    </div>
  );
}
