"use client";

import React, { useState } from "react";
import { Upload, ChevronDown } from "lucide-react";
import { SalesDataPoint } from "@/types/dashboard";

interface SalesSummaryChartProps {
  data?: SalesDataPoint[];
}

export default function SalesSummaryChart({ data }: SalesSummaryChartProps) {
  const [timeRange, setTimeRange] = useState("This Week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const ranges = ["Today", "This Week", "This Month", "This Year"];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Sales Summary
        </h2>

        <div className="flex items-center gap-2 relative">
          {/* Export Button */}
          <button
            type="button"
            onClick={() => {
              // CSV / PDF export trigger
              alert("Exporting Sales Summary data...");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Export</span>
          </button>

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
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full relative h-[220px] flex items-stretch">
        {/* Y Axis Grid & Labels */}
        <div className="flex flex-col justify-between text-[11px] font-medium text-gray-400 pr-3 select-none pb-7">
          <div className="flex items-center gap-2"><span>7k</span><span className="text-gray-300">-</span></div>
          <div className="flex items-center gap-2"><span>6k</span><span className="text-gray-300">-</span></div>
          <div className="flex items-center gap-2"><span>5k</span><span className="text-gray-300">-</span></div>
          <div className="flex items-center gap-2"><span>4k</span><span className="text-gray-300">-</span></div>
          <div className="flex items-center gap-2"><span>3k</span><span className="text-gray-300">-</span></div>
          <div className="flex items-center gap-2"><span>2k</span><span className="text-gray-300">-</span></div>
          <div className="flex items-center gap-2"><span>1k</span><span className="text-gray-300">-</span></div>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="flex-1 relative flex flex-col justify-between">
          <svg
            viewBox="0 0 500 200"
            className="w-full h-[180px] overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Vertical Dotted Pattern for peak areas */}
              <pattern
                id="dot-pattern"
                x="0"
                y="0"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="4" cy="4" r="0.8" fill="#F4B41A" opacity="0.6" />
              </pattern>

              {/* Linear Gradient under curve */}
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4B41A" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#F4B41A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Dotted Region 1 Under Peak 1 */}
            <path
              d="M 60,95 C 75,70 100,70 115,95 L 115,180 L 60,180 Z"
              fill="url(#dot-pattern)"
            />

            {/* Dotted Region 2 Under Peak 2 */}
            <path
              d="M 270,95 C 290,75 320,75 340,95 L 340,180 L 270,180 Z"
              fill="url(#dot-pattern)"
            />

            {/* Gradient Area under full line */}
            <path
              d="M 10,105 
                 C 50,40 80,45 110,110 
                 C 130,140 160,140 180,100 
                 C 200,60 220,50 240,110 
                 C 260,150 280,110 305,90 
                 C 325,75 340,100 365,130 
                 C 390,155 420,130 450,80
                 L 450,180 L 10,180 Z"
              fill="url(#area-gradient)"
            />

            {/* Main Yellow Curve Line */}
            <path
              d="M 10,105 
                 C 50,40 80,45 110,110 
                 C 130,140 160,140 180,100 
                 C 200,60 220,50 240,110 
                 C 260,150 280,110 305,90 
                 C 325,75 340,100 365,130 
                 C 390,155 420,130 450,80"
              fill="none"
              stroke="#F4B41A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Base Horizontal Bar Segments */}
            <line x1="10" y1="180" x2="450" y2="180" stroke="#E5E7EB" strokeWidth="2" />
            <line x1="80" y1="180" x2="160" y2="180" stroke="#F4B41A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="260" y1="180" x2="330" y2="180" stroke="#F4B41A" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* X Axis Labels */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 px-2 pt-2">
            <span>01 Aug</span>
            <span>15 Aug</span>
            <span>31 Aug</span>
          </div>
        </div>
      </div>
    </div>
  );
}

