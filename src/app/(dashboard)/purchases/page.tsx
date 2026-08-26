"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { PurchaseRecord } from "@/types/purchases";
import { PurchaseService } from "@/services";

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("24 August 2026");
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    PurchaseService.getPurchases({ search: searchQuery }).then((res) => {
      setPurchases(res.data);
    });
  }, [searchQuery]);

  return (
    <div className="w-full flex flex-col gap-5 pb-8 select-none">
      {/* Top Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Purchase History
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Track, review, and manage all purchase transactions in one place.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span>{selectedDate}</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Purchase List Container Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Card Header: Purchase List Title + Search & Filter */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
          <h3 className="text-base font-bold text-gray-900">
            Purchase List
          </h3>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-[320px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Purchase ID or Supplier.."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Filter Funnel Button */}
            <button
              type="button"
              title="Filter purchases"
              className="p-2 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 bg-gray-50/50">
                <th className="py-3.5 px-5 font-semibold">Purchase ID</th>
                <th className="py-3.5 px-5 font-semibold">Supplier</th>
                <th className="py-3.5 px-5 font-semibold">Purchase Date</th>
                <th className="py-3.5 px-5 font-semibold text-center">Items</th>
                <th className="py-3.5 px-5 font-semibold">Total Amount</th>
                <th className="py-3.5 px-5 font-semibold text-center">Payment Status</th>
                <th className="py-3.5 px-5 font-semibold text-center">Status</th>
                <th className="py-3.5 px-5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {purchases.map((item, idx) => (
                <tr
                  key={`${item.id}-${idx}`}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* Purchase ID */}
                  <td className="py-4 px-5 text-gray-600 font-medium">
                    {item.purchaseId}
                  </td>

                  {/* Supplier + Avatar */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-amber-100 relative shrink-0 overflow-hidden border border-gray-200">
                        <Image
                          src={item.supplier.avatar}
                          alt={item.supplier.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900 truncate">
                        {item.supplier.name}
                      </span>
                    </div>
                  </td>

                  {/* Purchase Date */}
                  <td className="py-4 px-5 text-gray-500">
                    {item.purchaseDate}
                  </td>

                  {/* Items Count */}
                  <td className="py-4 px-5 text-center font-bold text-gray-900">
                    {item.itemsCount}
                  </td>

                  {/* Total Amount */}
                  <td className="py-4 px-5 font-bold text-gray-900">
                    {item.totalAmountFormatted}
                  </td>

                  {/* Payment Status Badge */}
                  <td className="py-4 px-5 text-center">
                    {item.paymentStatus === "Paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Due
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5 text-center">
                    {item.status === "Received" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Received
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Action 3 Dots */}
                  <td className="py-4 px-5 text-center">
                    <button
                      type="button"
                      title="More actions"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination Controls */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100 text-xs text-gray-500">
          {/* Entries summary */}
          <div className="flex items-center gap-4">
            <span>Showing 1 to {Math.min(pageSize, purchases.length)} of 50 entries</span>

            {/* Page Size Selector */}
            <div className="relative inline-flex items-center">
              <button
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span>Show {pageSize}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Page Numbers & Nav */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-xs bg-gray-50 text-gray-900 transition-colors cursor-pointer"
            >
              1
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className="w-8 h-8 rounded-xl border border-transparent flex items-center justify-center font-semibold text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer"
            >
              2
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(3)}
              className="w-8 h-8 rounded-xl border border-transparent flex items-center justify-center font-semibold text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer"
            >
              3
            </button>

            <span className="px-1 text-gray-400 font-bold">...</span>

            <button
              type="button"
              onClick={() => setCurrentPage(10)}
              className="w-8 h-8 rounded-xl border border-transparent flex items-center justify-center font-semibold text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer"
            >
              10
            </button>

            <button
              type="button"
              disabled={currentPage === 10}
              onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
