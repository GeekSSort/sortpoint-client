"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { OverviewService } from "@/services";
import { OrderListItem } from "@/types/overview";

interface OrderListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderListModal({ isOpen, onClose }: OrderListModalProps) {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"All" | "Received" | "Pending">("All");

  useEffect(() => {
    OverviewService.getOrders().then((data) => {
      setOrders(data);
    });
  }, []);

  if (!isOpen) return null;

  const filteredData = orders.filter((item) => {
    const matchesSearch =
      item.purchaseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="absolute inset-y-0 right-0 left-auto w-[68%] min-w-[680px] z-20 flex flex-col pointer-events-auto">
      <div 
        className="w-full bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-200/90 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-white">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 shrink-0">
            Order List
          </h3>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Purchase ID or Supplier..."
                className="w-[260px] sm:w-[320px] pl-9 pr-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
              />
            </div>

            {/* Filter Funnel Button */}
            <button
              type="button"
              onClick={() => setFilterStatus(filterStatus === "All" ? "Received" : filterStatus === "Received" ? "Pending" : "All")}
              title={`Filter status: ${filterStatus}`}
              className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-700 font-semibold bg-white sticky top-0 z-10">
                <th className="py-3 px-6">Purchase ID</th>
                <th className="py-3 px-6">Supplier</th>
                <th className="py-3 px-6">Purchase Date</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Payment Status</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-normal text-gray-700">
              {filteredData.slice(0, pageSize).map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-3.5 px-6 text-gray-900 font-medium">
                    {item.purchaseId}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-amber-100 overflow-hidden relative shrink-0">
                        <Image
                          src={item.supplier.avatarUrl || "/image.png"}
                          alt={item.supplier.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {item.supplier.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-gray-600">
                    {item.purchaseDate}
                  </td>
                  <td className="py-3.5 px-6 text-gray-900 font-semibold">
                    {item.items}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-gray-900">
                    {item.totalAmountFormatted}
                  </td>
                  <td className="py-3.5 px-6">
                    {item.paymentStatus === "Paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Due
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {item.status === "Received" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Received
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="py-3.5 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none bg-white">
          <div className="text-xs text-gray-500">
            Showing 1 to {Math.min(pageSize, filteredData.length)} of 50 entries
          </div>

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
              <div className="absolute bottom-full mb-1 left-0 w-24 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                {[8, 15, 25, 50].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setPageSize(size);
                      setIsPageSizeOpen(false);
                    }}
                    className="w-full text-left px-3 py-1 text-xs hover:bg-amber-50 hover:text-[#F4B41A]"
                  >
                    Show {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-900">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
              3
            </button>
            <span className="px-1 text-gray-400 text-xs">...</span>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
              10
            </button>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
