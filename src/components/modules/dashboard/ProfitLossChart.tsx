"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProfitLossData } from "@/types/dashboard";

interface ProfitLossChartProps {
  data: ProfitLossData;
}

function createDonutArc(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngleDeg: number,
  endAngleDeg: number
) {
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const sRad = rad(startAngleDeg);
  const eRad = rad(endAngleDeg);

  const x1 = cx + rOuter * Math.cos(sRad);
  const y1 = cy + rOuter * Math.sin(sRad);
  const x2 = cx + rOuter * Math.cos(eRad);
  const y2 = cy + rOuter * Math.sin(eRad);

  const x3 = cx + rInner * Math.cos(eRad);
  const y3 = cy + rInner * Math.sin(eRad);
  const x4 = cx + rInner * Math.cos(sRad);
  const y4 = cy + rInner * Math.sin(sRad);

  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

export default function ProfitLossChart({ data }: ProfitLossChartProps) {
  const [timeRange, setTimeRange] = useState("This Week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const ranges = ["Today", "This Week", "This Month", "This Year"];

  // 6 Segment Definitions with gaps and exact angles matching screenshot
  const slices = [
    // Top-Left Green
    { start: 298, end: 354, color: "#22C55E" },
    // Top-Right Large Green
    { start: 1, end: 94, color: "#22C55E" },
    // Bottom-Right Green
    { start: 101, end: 148, color: "#22C55E" },
    // Bottom Red
    { start: 155, end: 202, color: "#EF4444" },
    // Bottom-Left Red
    { start: 209, end: 247, color: "#EF4444" },
    // Left Red
    { start: 253, end: 291, color: "#EF4444" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Profit & Loss
        </h2>

        {/* Timeframe Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20">
              {ranges.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setTimeRange(range);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-amber-50 hover:text-[#F4B41A] transition-colors ${
                    timeRange === range ? "font-semibold text-[#F4B41A]" : "text-gray-700"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Segmented Donut + Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto">
        {/* Rounded Segment Donut Chart */}
        <div className="relative w-[160px] h-[160px] flex items-center justify-center shrink-0">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={createDonutArc(100, 100, 80, 48, slice.start, slice.end)}
                fill={slice.color}
                stroke={slice.color}
                strokeWidth={7}
                strokeLinejoin="round"
                className="transition-all duration-300 hover:opacity-90 cursor-pointer"
              />
            ))}
          </svg>

          {/* Center Text (Golden / Amber) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-sm sm:text-base font-extrabold text-[#F4B41A] leading-tight">
              {data.profitMargin}%
            </span>
            <span className="text-[10px] text-[#F4B41A] font-medium mt-0.5">
              Profit Margin
            </span>
          </div>
        </div>

        {/* Legend & Stats Column */}
        <div className="flex-1 w-full flex flex-col gap-3 min-w-[125px]">
          {/* Total Revenue */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
              <span>Total Revenue</span>
            </div>
            <span className="text-sm font-bold text-gray-900 pl-3">
              {data.revenueFormatted}
            </span>
          </div>

          {/* Total Expenses */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />
              <span>Total Expenses</span>
            </div>
            <span className="text-sm font-bold text-gray-900 pl-3">
              {data.expensesFormatted}
            </span>
          </div>

          {/* Net Profit Beige/Cream Box */}
          <div className="bg-[#FEF9EE] rounded-2xl p-3 text-center mt-1">
            <div className="text-xs font-bold text-[#F4B41A]">
              Net Profit
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#F4B41A] mt-0.5">
              {data.netProfitFormatted}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
