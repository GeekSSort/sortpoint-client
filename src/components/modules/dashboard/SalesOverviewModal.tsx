"use client";

import React, { useEffect, useMemo, useState } from "react";
import { OverviewService } from "@/services";
import { SalesOverviewItem } from "@/types/overview";
import StatusPill from "@/components/shared/StatusPill";
import OverviewPanel, { PANEL_CELL, PANEL_HEAD, PANEL_TEXT } from "./OverviewPanel";

/** The TOTAL SALES card's panel — every invoice behind the figure. */

const GRID = "grid-cols-[140fr_170fr_170fr_140fr_150fr_110fr]";
const FILTERS = ["All payments", "Paid", "Unpaid"] as const;
const taka = (n: number) => `৳ ${n.toLocaleString("en-IN")}`;

export default function SalesOverviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [sales, setSales] = useState<SalesOverviewItem[]>([]);

  useEffect(() => {
    OverviewService.getSalesOverview()
      .then(setSales)
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const total = sales.reduce((s, x) => s + x.totalAmount, 0);
    const unpaid = sales.filter((x) => x.status === "Unpaid");
    return [
      { label: "Invoices", value: String(sales.length) },
      { label: "Collected", value: taka(total - unpaid.reduce((s, x) => s + x.totalAmount, 0)) },
      { label: "Unpaid", value: `${unpaid.length} · ${taka(unpaid.reduce((s, x) => s + x.totalAmount, 0))}` },
    ];
  }, [sales]);

  return (
    <OverviewPanel<SalesOverviewItem>
      open={isOpen}
      onClose={onClose}
      title="Sales Overview"
      subtitle="Every invoice behind today’s sales figure."
      searchPlaceholder="Search by customer, invoice or method..."
      rows={sales}
      searchable={(r) => `${r.customer} ${r.invoiceNo} ${r.paymentMethod}`}
      filters={FILTERS}
      matchesFilter={(r, f) => r.status === f}
      stats={stats}
      grid={GRID}
      emptyText="No invoices match that search."
      head={
        <>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Invoice No.</span></div>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Date &amp; Time</span></div>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Customer</span></div>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Total Amount</span></div>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Payment Method</span></div>
          <div className={`${PANEL_CELL} h-[40px] justify-center`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Status</span></div>
        </>
      }
      renderRow={(r) => (
        <>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate !text-[#1e1e1e]`}>{r.invoiceNo}</span></div>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate`}>{r.dateTime}</span></div>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate`}>{r.customer}</span></div>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate !text-[#1e1e1e]`}>{r.totalAmountFormatted}</span></div>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate`}>{r.paymentMethod}</span></div>
          <div className={`${PANEL_CELL} justify-center`}>
            <StatusPill label={r.status} tone={r.status === "Paid" ? "green" : "gold"} />
          </div>
        </>
      )}
    />
  );
}
