"use client";

import React, { useMemo, useState } from "react";
import { ActivityStatus, RecentActivityItem } from "@/types/dashboard";
import TablePagination from "@/components/shared/TablePagination";

/**
 * Figma: SORTPoint — Recent Activities 30:16894.
 *
 * 1160x446: a 48px centred title, a 1128-wide table inset 16px (40px head with
 * its own 6px-radius outline, then 54px rows), and a 64px pagination bar.
 * Columns are three fluid (226 each at design width) then 150 / 170 / 130.
 *
 * Below md the rows become stacked cards — a six-column table has nowhere to go
 * on a phone. No Figma frame for that; it's mine.
 */

const STATUS: Record<ActivityStatus, { bg: string; fg: string }> = {
  Delivered: { bg: "#dcfce7", fg: "#22c55e" },
  Pending: { bg: "#fef3c7", fg: "#6d5b46" },
  Process: { bg: "#f1f5f9", fg: "#0f172a" },
  Shipping: { bg: "#fff2e8", fg: "#fe954d" },
  // Not drawn in the design; same construction, danger hue.
  Cancelled: { bg: "#fee2e2", fg: "#ef4444" },
};

function StatusPill({ status }: { status: ActivityStatus }) {
  const tone = STATUS[status] ?? STATUS.Process;
  return (
    <span
      className="inline-flex h-[24px] shrink-0 items-center gap-[7px] overflow-clip rounded-[17px] px-[9px]"
      style={{ backgroundColor: tone.bg }}
    >
      <span className="size-[6px] shrink-0 rounded-full" style={{ backgroundColor: tone.fg }} />
      <span
        className="text-[12px] leading-normal font-medium tracking-[-0.24px] whitespace-nowrap"
        style={{ color: tone.fg }}
      >
        {status}
      </span>
    </span>
  );
}

/** vuesax/linear/more — node 30:17007, turned upright as in the design. */
function MoreIcon() {
  return (
    <svg className="block size-[16px] -rotate-90" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.33333 6.66667C2.6 6.66667 2 7.26667 2 8C2 8.73333 2.6 9.33333 3.33333 9.33333C4.06667 9.33333 4.66667 8.73333 4.66667 8C4.66667 7.26667 4.06667 6.66667 3.33333 6.66667Z"
        fill="currentColor"
      />
      <path
        d="M12.6667 6.66667C11.9333 6.66667 11.3333 7.26667 11.3333 8C11.3333 8.73333 11.9333 9.33333 12.6667 9.33333C13.4 9.33333 14 8.73333 14 8C14 7.26667 13.4 6.66667 12.6667 6.66667Z"
        fill="currentColor"
      />
      <path
        d="M8 6.66667C7.26667 6.66667 6.66667 7.26667 6.66667 8C6.66667 8.73333 7.26667 9.33333 8 9.33333C8.73333 9.33333 9.33333 8.73333 9.33333 8C9.33333 7.26667 8.73333 6.66667 8 6.66667Z"
        fill="currentColor"
      />
    </svg>
  );
}



const CELL = "flex items-center p-[12px]";
const TEXT = "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#525252]";
const HEAD = "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#1e1e1e]";


interface RecentActivitiesTableProps {
  activities: RecentActivityItem[];
}

export default function RecentActivitiesTable({ activities }: RecentActivitiesTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(activities.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = useMemo(
    () => activities.slice((current - 1) * pageSize, current * pageSize),
    [activities, current, pageSize]
  );

  return (
    <div className="w-full overflow-hidden rounded-[12px] bg-white shadow-[inset_0_0_0_1px_#eaeaea]">
      {/* Head — 30:16895 */}
      <div className="flex h-[48px] items-center justify-center px-[16px]">
        <p className="text-[16px] leading-[1.5] font-medium tracking-[-0.32px] text-[#1e1e1e]">
          Recent Activities
        </p>
      </div>

      {/* Table — 30:16898, inset 16px */}
      <div className="mt-[9px] hidden px-[16px] md:block">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Column head — its own 6px outline */}
            <div className="flex items-start overflow-clip rounded-[6px] shadow-[inset_0_0_0_1px_#eaeaea]">
              <div className={`${CELL} h-[40px] min-w-px flex-1 bg-white`}>
                <span className={HEAD}>Activity</span>
              </div>
              <div className={`${CELL} h-[40px] min-w-px flex-1 bg-white`}>
                <span className={`${HEAD} whitespace-nowrap`}>Reference</span>
              </div>
              <div className={`${CELL} h-[40px] min-w-px flex-1 bg-white`}>
                <span className={`${HEAD} whitespace-nowrap`}>Date &amp; Time</span>
              </div>
              <div className={`${CELL} h-[40px] w-[150px] shrink-0 bg-white`}>
                <span className={`${HEAD} whitespace-nowrap`}>Amount</span>
              </div>
              <div className={`${CELL} h-[40px] w-[170px] shrink-0 bg-white`}>
                <span className={`${HEAD} whitespace-nowrap`}>Status</span>
              </div>
              <div className={`${CELL} h-[40px] w-[130px] shrink-0 justify-center bg-white`}>
                <span className={`${HEAD} whitespace-nowrap`}>Action</span>
              </div>
            </div>

            {/* Rows — 54px, 6px under the head */}
            <div className="mt-[6px]">
              {rows.map((a, i) => (
                <div
                  key={a.id}
                  className={`flex h-[54px] items-center ${
                    i === rows.length - 1 ? "" : "border-b border-solid border-[#eaeaea]"
                  }`}
                >
                  <div className={`${CELL} min-w-px flex-1`}>
                    <span className={`${TEXT} truncate`}>{a.activity}</span>
                  </div>
                  <div className={`${CELL} min-w-px flex-1`}>
                    <span className={`${TEXT} truncate`}>{a.reference}</span>
                  </div>
                  <div className={`${CELL} min-w-px flex-1`}>
                    <span className={`${TEXT} truncate`}>{a.dateTime}</span>
                  </div>
                  <div className={`${CELL} w-[150px] shrink-0`}>
                    <span className={`${TEXT} truncate`}>{a.amountFormatted}</span>
                  </div>
                  <div className={`${CELL} w-[170px] shrink-0`}>
                    <StatusPill status={a.status} />
                  </div>
                  <div className={`${CELL} relative w-[130px] shrink-0 justify-center`}>
                    <button
                      type="button"
                      aria-label={`Actions for ${a.reference}`}
                      onClick={() => setMenuFor(menuFor === a.id ? null : a.id)}
                      onBlur={() => window.setTimeout(() => setMenuFor(null), 120)}
                      className="flex size-[40px] cursor-pointer items-center justify-center overflow-clip rounded-[10px] border border-solid border-[#eaeaea] bg-white text-[#1e1e1e] shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)] transition-colors hover:bg-[#fafafa]"
                    >
                      <MoreIcon />
                    </button>
                    {menuFor === a.id && (
                      <div className="absolute top-[50px] right-[12px] z-30 w-[150px] overflow-hidden rounded-[10px] bg-white py-[4px] text-left shadow-[0_8px_30px_rgba(0,0,0,0.10)] ring-1 ring-[#eaeaea]">
                        {["View details", "Download receipt"].map((label) => (
                          <button
                            key={label}
                            type="button"
                            className="block w-full cursor-pointer px-[14px] py-[8px] text-left text-[13px] text-[#525252] transition-colors hover:bg-[#fafafa]"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stacked cards below md */}
      <div className="mt-[9px] flex flex-col gap-[10px] px-[16px] md:hidden">
        {rows.map((a) => (
          <div key={a.id} className="rounded-[10px] border border-solid border-[#eaeaea] p-[12px]">
            <div className="flex items-start justify-between gap-[10px]">
              <div className="min-w-0">
                <p className={`${TEXT} truncate !text-[#1e1e1e]`}>{a.activity}</p>
                <p className="mt-[2px] truncate text-[12px] tracking-[-0.24px] text-[#525252]">
                  {a.reference}
                </p>
              </div>
              <StatusPill status={a.status} />
            </div>
            <div className="mt-[10px] flex items-center justify-between gap-[10px]">
              <span className="truncate text-[12px] tracking-[-0.24px] text-[#525252]">
                {a.dateTime}
              </span>
              <span className={`${TEXT} shrink-0`}>{a.amountFormatted}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination — 30:17020 */}
      <div className="mt-[9px]">
        <TablePagination
          page={current}
          pageSize={pageSize}
          total={activities.length}
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
