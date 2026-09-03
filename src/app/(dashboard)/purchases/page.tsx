"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PurchaseRecord } from "@/types/purchases";
import { PurchaseService } from "@/services";
import StatusPill, { Tone } from "@/components/shared/StatusPill";
import RowActionMenu from "@/components/shared/RowActionMenu";
import TablePagination from "@/components/shared/TablePagination";
import DateField from "@/components/shared/DateField";
import Modal, { GOLD_GRADIENT, MODAL_GHOST, MODAL_PRIMARY } from "@/components/shared/Modal";
import { matchesDay } from "@/lib/dateFilter";

/**
 * Figma: SORTPoint — Purchase History 59:15218.
 *
 * Search left, date field right (this screen has no Add New); an 898px card
 * with the 1128-wide eight-column table (40px head, 54px rows) over the 64px
 * pagination bar.
 */

const PAYMENT_TONE: Record<PurchaseRecord["paymentStatus"], Tone> = {
  Paid: "green",
  Due: "gold",
  // Not drawn in the design; same construction, amber.
  Partial: "amber",
};

const STATUS_TONE: Record<PurchaseRecord["status"], Tone> = {
  Received: "green",
  Pending: "gold",
  Ordered: "slate",
  Cancelled: "rose",
};

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

// Purchase ID  Supplier  Purchase Date  Items  Total Amount  Payment Status  Status  Action
const GRID = "grid-cols-[157fr_220fr_144fr_114fr_130fr_140fr_140fr_83fr]";
const CELL = "flex min-w-0 items-center p-[12px]";
const HEAD = "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#1e1e1e]";
const TEXT = "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#525252]";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [note, setNote] = useState<string | null>(null);
  const [detailOf, setDetailOf] = useState<PurchaseRecord | null>(null);
  const [receiptOf, setReceiptOf] = useState<PurchaseRecord | null>(null);
  const [markOf, setMarkOf] = useState<{ row: PurchaseRecord; kind: "received" | "paid" } | null>(null);

  useEffect(() => {
    PurchaseService.getPurchases({ search: query })
      .then((res) => setPurchases(res.data))
      .catch(() => {});
  }, [query]);

  const visible = useMemo(
    () => purchases.filter((p) => matchesDay(p.purchaseDate, date)),
    [purchases, date]
  );
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = useMemo(
    () => visible.slice((current - 1) * pageSize, current * pageSize),
    [visible, current, pageSize]
  );

  return (
    <div className="flex w-full flex-col gap-[14px] select-none">
      {/* Headline — 59:15220 */}
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
              placeholder="Search by Purchase ID or Supplier..."
              aria-label="Search purchases"
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

        <DateField value={date} onChange={setDate} ariaLabel="Filter purchases by date" />
      </div>

      {/* Table card — 59:15252 */}
      <div className="w-full overflow-hidden rounded-[12px] bg-white shadow-[inset_0_0_0_1px_#eaeaea]">
        <div className="hidden px-[16px] pt-[16px] md:block">
          <div className="overflow-x-auto">
            <div className="min-w-[1050px]">
              <div className={`grid ${GRID} items-start overflow-clip rounded-[6px] shadow-[inset_0_0_0_1px_#eaeaea]`}>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Purchase ID</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Supplier</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Purchase Date</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Items</span></div>
                <div className={`${CELL} h-[40px] bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Total Amount</span></div>
                <div className={`${CELL} h-[40px] justify-center bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Payment Status</span></div>
                <div className={`${CELL} h-[40px] justify-center bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Status</span></div>
                <div className={`${CELL} h-[40px] justify-center bg-white`}><span className={`${HEAD} whitespace-nowrap`}>Action</span></div>
              </div>

              <div className="mt-[6px]">
                {rows.length === 0 && (
                  <p className="py-[40px] text-center text-[14px] text-[#525252]">
                    No purchases match that search or date.
                  </p>
                )}
                {rows.map((r, i) => (
                  // Not a <button>: the Action cell holds one, and buttons can't nest.
                  <div
                    key={r.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${r.purchaseId}`}
                    onClick={() => setDetailOf(r)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDetailOf(r);
                      }
                    }}
                    className={`grid ${GRID} h-[54px] cursor-pointer items-center transition-colors outline-none hover:bg-[#fafafa] focus-visible:bg-[#fffaeb] focus-visible:ring-1 focus-visible:ring-[#f5b800] focus-visible:ring-inset ${i === rows.length - 1 ? "" : "border-b border-solid border-[#eaeaea]"}`}
                  >
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.purchaseId}</span></div>
                    {/* 28px avatar, 8px from the name — 59:15334 */}
                    <div className={`${CELL} gap-[8px]`}>
                      <span className="relative size-[28px] shrink-0 overflow-hidden rounded-[6px]">
                        <Image src={r.supplier.avatar} alt="" fill sizes="28px" className="object-cover" />
                      </span>
                      <span className={`${TEXT} truncate`}>{r.supplier.name}</span>
                    </div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.purchaseDate}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.itemsCount}</span></div>
                    <div className={CELL}><span className={`${TEXT} truncate`}>{r.totalAmountFormatted}</span></div>
                    <div className={`${CELL} justify-center`}>
                      <StatusPill label={r.paymentStatus} tone={PAYMENT_TONE[r.paymentStatus] ?? "slate"} />
                    </div>
                    <div className={`${CELL} justify-center`}>
                      <StatusPill label={r.status} tone={STATUS_TONE[r.status] ?? "slate"} />
                    </div>
                    {/* The menu lives inside the row hit area — keep its clicks to itself. */}
                    <div
                      className={`${CELL} justify-center`}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <RowActionMenu
                        label={`Actions for ${r.purchaseId}`}
                        actions={[
                          { label: "View purchase", onSelect: () => setDetailOf(r) },
                          { label: "Print order", onSelect: () => setReceiptOf(r) },
                          ...(r.status === "Received"
                            ? []
                            : [{ label: "Mark received", onSelect: () => setMarkOf({ row: r, kind: "received" as const }) }]),
                          ...(r.paymentStatus === "Paid"
                            ? []
                            : [{ label: "Mark paid", onSelect: () => setMarkOf({ row: r, kind: "paid" as const }) }]),
                        ]}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stacked cards below md — also tappable */}
        <div className="flex flex-col gap-[10px] px-[16px] pt-[16px] md:hidden">
          {rows.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setDetailOf(r)}
              aria-label={`Open ${r.purchaseId}`}
              className="w-full cursor-pointer rounded-[10px] border border-solid border-[#eaeaea] p-[12px] text-left transition-colors outline-none hover:bg-[#fafafa] focus-visible:border-[#f5b800] focus-visible:bg-[#fffaeb]"
            >
              <div className="flex items-start justify-between gap-[10px]">
                <div className="flex min-w-0 items-center gap-[8px]">
                  <span className="relative size-[28px] shrink-0 overflow-hidden rounded-[6px]">
                    <Image src={r.supplier.avatar} alt="" fill sizes="28px" className="object-cover" />
                  </span>
                  <div className="min-w-0">
                    <p className={`${TEXT} truncate !text-[#1e1e1e]`}>{r.supplier.name}</p>
                    <p className="mt-[2px] truncate text-[12px] tracking-[-0.24px] text-[#525252]">
                      {r.purchaseId}
                    </p>
                  </div>
                </div>
                <StatusPill label={r.status} tone={STATUS_TONE[r.status] ?? "slate"} />
              </div>
              <div className="mt-[10px] flex items-center justify-between gap-[10px]">
                <span className="truncate text-[12px] tracking-[-0.24px] text-[#525252]">
                  {r.purchaseDate} · {r.itemsCount} items
                </span>
                <span className={`${TEXT} shrink-0`}>{r.totalAmountFormatted}</span>
              </div>
              <div className="mt-[8px]">
                <StatusPill label={r.paymentStatus} tone={PAYMENT_TONE[r.paymentStatus] ?? "slate"} />
              </div>
            </button>
          ))}
        </div>

        {note && <p className="px-[16px] pt-[10px] text-[13px] text-[#525252]">{note}</p>}

        {/* Pagination — 59:15704 */}
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

      {/* View purchase */}
      <Modal
        open={detailOf !== null}
        onClose={() => setDetailOf(null)}
        title={`Purchase ${detailOf?.purchaseId ?? ""}`}
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
                setReceiptOf(detailOf);
                setDetailOf(null);
              }}
            >
              Print order
            </button>
          </>
        }
      >
        {detailOf && (
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[12px]">
              <span className="relative size-[48px] shrink-0 overflow-hidden rounded-[10px] border border-solid border-[#eaeaea]">
                <Image src={detailOf.supplier.avatar} alt="" fill sizes="48px" className="object-cover" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[16px] font-medium text-[#1e1e1e]">{detailOf.supplier.name}</p>
                <p className="truncate text-[13px] text-[#525252]">{detailOf.purchaseId}</p>
              </div>
            </div>
            <dl className="flex flex-col gap-[12px]">
              {[
                ["Purchase Date", detailOf.purchaseDate],
                ["Items", String(detailOf.itemsCount)],
                ["Total Amount", detailOf.totalAmountFormatted],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-[16px]">
                  <dt className="text-[14px] text-[#525252]">{k}</dt>
                  <dd className="text-[14px] font-medium text-[#1e1e1e]">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-[16px]">
                <dt className="text-[14px] text-[#525252]">Payment Status</dt>
                <dd>
                  <StatusPill label={detailOf.paymentStatus} tone={PAYMENT_TONE[detailOf.paymentStatus] ?? "slate"} />
                </dd>
              </div>
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

      {/* Printable purchase order */}
      <Modal
        open={receiptOf !== null}
        onClose={() => setReceiptOf(null)}
        title="Purchase order"
        width={420}
        footer={
          <>
            <button type="button" className={MODAL_GHOST} onClick={() => setReceiptOf(null)}>
              Close
            </button>
            <button
              type="button"
              style={{ backgroundImage: GOLD_GRADIENT }}
              className={MODAL_PRIMARY}
              onClick={() => window.print()}
            >
              Print
            </button>
          </>
        }
      >
        {receiptOf && (
          <div className="print-area flex flex-col gap-[10px] text-[13px] text-[#525252]">
            <p className="text-center text-[16px] font-semibold text-[#1e1e1e]">SORTPoint</p>
            <p className="text-center text-[12px]">Purchase order</p>
            <div className="my-[6px] h-px w-full bg-[#eaeaea]" />
            <p className="flex justify-between"><span>Purchase</span><span className="font-medium text-[#1e1e1e]">{receiptOf.purchaseId}</span></p>
            <p className="flex justify-between"><span>Supplier</span><span>{receiptOf.supplier.name}</span></p>
            <p className="flex justify-between"><span>Date</span><span>{receiptOf.purchaseDate}</span></p>
            <p className="flex justify-between"><span>Items</span><span>{receiptOf.itemsCount}</span></p>
            <p className="flex justify-between"><span>Payment</span><span>{receiptOf.paymentStatus}</span></p>
            <p className="flex justify-between"><span>Status</span><span>{receiptOf.status}</span></p>
            <div className="my-[6px] h-px w-full bg-[#eaeaea]" />
            <p className="flex justify-between text-[15px] font-semibold text-[#1e1e1e]">
              <span>Total</span>
              <span>{receiptOf.totalAmountFormatted}</span>
            </p>
            <p className="mt-[8px] text-center text-[12px]">Authorised signature ____________________</p>
          </div>
        )}
      </Modal>

      {/* Mark received / paid */}
      <Modal
        open={markOf !== null}
        onClose={() => setMarkOf(null)}
        title={markOf?.kind === "paid" ? "Mark as paid" : "Mark as received"}
        width={440}
        footer={
          <>
            <button type="button" className={MODAL_GHOST} onClick={() => setMarkOf(null)}>
              Cancel
            </button>
            <button
              type="button"
              style={{ backgroundImage: GOLD_GRADIENT }}
              className={MODAL_PRIMARY}
              onClick={() => {
                if (!markOf) return;
                // Optimistic: the mock backend has no update endpoint yet.
                setPurchases((list) =>
                  list.map((x) =>
                    x.id === markOf.row.id
                      ? markOf.kind === "paid"
                        ? { ...x, paymentStatus: "Paid" as const }
                        : { ...x, status: "Received" as const }
                      : x
                  )
                );
                setNote(
                  markOf.kind === "paid"
                    ? `${markOf.row.purchaseId} marked as paid`
                    : `${markOf.row.purchaseId} marked as received`
                );
                setMarkOf(null);
              }}
            >
              {markOf?.kind === "paid" ? "Confirm payment" : "Confirm receipt"}
            </button>
          </>
        }
      >
        {markOf && (
          <p className="text-[14px] leading-[1.6] text-[#525252]">
            {markOf.kind === "paid" ? (
              <>
                Record <span className="font-medium text-[#1e1e1e]">{markOf.row.totalAmountFormatted}</span>{" "}
                as paid to <span className="font-medium text-[#1e1e1e]">{markOf.row.supplier.name}</span> for{" "}
                <span className="font-medium text-[#1e1e1e]">{markOf.row.purchaseId}</span>?
              </>
            ) : (
              <>
                Mark <span className="font-medium text-[#1e1e1e]">{markOf.row.purchaseId}</span> (
                {markOf.row.itemsCount} items from{" "}
                <span className="font-medium text-[#1e1e1e]">{markOf.row.supplier.name}</span>) as received?
              </>
            )}
          </p>
        )}
      </Modal>
    </div>
  );
}
