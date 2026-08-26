"use client";

import React, { useState } from "react";
import { 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown 
} from "lucide-react";
import { RecentActivityItem, ActivityStatus } from "@/types/dashboard";

interface RecentActivitiesTableProps {
  activities: RecentActivityItem[];
}

export default function RecentActivitiesTable({ activities }: RecentActivitiesTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Delivered
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "Process":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            Process
          </span>
        );
      case "Shipping":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Shipping
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Title Bar */}
      <div className="py-4 px-6 border-b border-gray-100 text-center">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
          Recent Activities
        </h3>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-gray-100 text-gray-700 font-semibold bg-gray-50/40">
              <th className="py-3.5 px-6">Activity</th>
              <th className="py-3.5 px-6">Reference</th>
              <th className="py-3.5 px-6">Date & Time</th>
              <th className="py-3.5 px-6">Amount</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
            {activities.map((item) => (
              <tr 
                key={item.id}
                className="hover:bg-amber-50/20 transition-colors"
              >
                <td className="py-4 px-6 font-semibold text-gray-900">
                  {item.activity}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {item.reference}
                </td>
                <td className="py-4 px-6 text-gray-500">
                  {item.dateTime}
                </td>
                <td className="py-4 px-6 font-bold text-gray-900">
                  {item.amountFormatted}
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(item.status)}
                </td>
                <td className="py-4 px-6 text-center relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Action Menu */}
                  {activeMenuId === item.id && (
                    <div className="absolute right-6 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30 text-left">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(null)}
                        className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-amber-50 hover:text-[#F4B41A] transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(null)}
                        className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-amber-50 hover:text-[#F4B41A] transition-colors"
                      >
                        Download Receipt
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer & Pagination */}
      <div className="py-3.5 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        {/* Entries Count */}
        <div className="text-xs text-gray-500">
          Showing 1 to {activities.length} of 50 entries
        </div>

        {/* Page Size Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
            className="flex items-center gap-1.5 px-3 py-1 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span>Show {pageSize}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {isPageSizeOpen && (
            <div className="absolute bottom-full mb-1 left-0 w-24 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20">
              {[8, 15, 25, 50].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setPageSize(size);
                    setIsPageSizeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                    pageSize === size ? "font-bold text-[#F4B41A]" : "text-gray-700"
                  }`}
                >
                  Show {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentPage === 1
                ? "border border-gray-200 bg-gray-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            1
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentPage === 2
                ? "border border-gray-200 bg-gray-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            2
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(3)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentPage === 3
                ? "border border-gray-200 bg-gray-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            3
          </button>

          <span className="px-1 text-gray-400 text-xs">...</span>

          <button
            type="button"
            onClick={() => setCurrentPage(10)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentPage === 10
                ? "border border-gray-200 bg-gray-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            10
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
            disabled={currentPage === 10}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

