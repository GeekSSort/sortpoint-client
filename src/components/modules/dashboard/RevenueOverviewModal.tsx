"use client";

import React, { useMemo } from "react";
import { SalesDataPoint } from "@/types/dashboard";
import StatusPill from "@/components/shared/StatusPill";
import OverviewPanel, { PANEL_CELL, PANEL_HEAD, PANEL_TEXT } from "./OverviewPanel";

/**
 * The TOTAL REVENUE card's panel.
 *
 * Revenue used to share the Sales panel, so two of the four cards opened the
 * same thing. It gets its own breakdown: revenue per day over the period, with
 * the order count, the average order value and each day's share of the total.
 */

const GRID = "grid-cols-[150fr_170fr_120fr_170fr_160fr_140fr]";
const FILTERS = ["All days", "Above average", "Below average"] as const;
const taka = (n: number) => `৳ ${Math.round(n).toLocaleString("en-IN")}`;

interface Row {
  id: string;
  date: string;
  sales: number;
  orders: number;
  avg: number;
  share: number;
  aboveAverage: boolean;
}

export default function RevenueOverviewModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: SalesDataPoint[];
}) {
  const rows = useMemo<Row[]>(() => {
    const total = data.reduce((s, d) => s + d.sales, 0) || 1;
    const mean = total / (data.length || 1);
    return data.map((d) => ({
      id: d.date,
      date: d.date,
      sales: d.sales,
      orders: d.orders,
      avg: d.orders ? d.sales / d.orders : 0,
      share: (d.sales / total) * 100,
      aboveAverage: d.sales >= mean,
    }));
  }, [data]);

  const stats = useMemo(() => {
    const total = rows.reduce((s, r) => s + r.sales, 0);
    const orders = rows.reduce((s, r) => s + r.orders, 0);
    const best = rows.reduce<Row | null>((b, r) => (!b || r.sales > b.sales ? r : b), null);
    return [
      { label: "Revenue", value: taka(total) },
      { label: "Avg order value", value: orders ? taka(total / orders) : "—" },
      { label: "Best day", value: best ? `${best.date} · ${taka(best.sales)}` : "—" },
    ];
  }, [rows]);

  return (
    <OverviewPanel<Row>
      open={isOpen}
      onClose={onClose}
      title="Revenue Overview"
      subtitle="How the period’s revenue broke down, day by day."
      searchPlaceholder="Search by date..."
      rows={rows}
      searchable={(r) => r.date}
      filters={FILTERS}
      matchesFilter={(r, f) => (f === "Above average" ? r.aboveAverage : !r.aboveAverage)}
      stats={stats}
      grid={GRID}
      emptyText="No days match that search."
      head={
        <>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Date</span></div>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Revenue</span></div>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Orders</span></div>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Avg Order Value</span></div>
          <div className={`${PANEL_CELL} h-[40px]`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>Share of Period</span></div>
          <div className={`${PANEL_CELL} h-[40px] justify-center`}><span className={`${PANEL_HEAD} whitespace-nowrap`}>vs Average</span></div>
        </>
      }
      renderRow={(r) => (
        <>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate !text-[#1e1e1e]`}>{r.date}</span></div>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate !text-[#1e1e1e]`}>{taka(r.sales)}</span></div>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate`}>{r.orders}</span></div>
          <div className={PANEL_CELL}><span className={`${PANEL_TEXT} truncate`}>{taka(r.avg)}</span></div>
          {/* A bar reads faster than the number alone for a share column. */}
          <div className={`${PANEL_CELL} gap-[8px]`}>
            <span className="h-[6px] min-w-[40px] flex-1 overflow-hidden rounded-full bg-[#f5f5f5]">
              <span
                className="block h-full rounded-full bg-[#f5b800]"
                style={{ width: `${Math.min(100, r.share * 3)}%` }}
              />
            </span>
            <span className={`${PANEL_TEXT} shrink-0`}>{r.share.toFixed(1)}%</span>
          </div>
          <div className={`${PANEL_CELL} justify-center`}>
            <StatusPill label={r.aboveAverage ? "Above" : "Below"} tone={r.aboveAverage ? "green" : "amber"} />
          </div>
        </>
      )}
    />
  );
}
