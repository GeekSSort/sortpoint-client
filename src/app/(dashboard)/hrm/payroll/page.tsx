"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { PayrollRecord } from "@/types/payroll";
import { PayrollService, initialPayrollData } from "@/lib/services/payroll.service";

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>(initialPayrollData);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    PayrollService.getPayroll({ search: searchQuery }).then((res) => {
      setPayroll(res.data);
    });
  }, [searchQuery]);

  return (
    <div className="w-full flex flex-col gap-5 pb-8 select-none">
      {/* Top Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Payroll
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage employee salaries, allowances, deductions, attendance, overtime, and payment status from one place.
          </p>
        </div>

        {/* Add New Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Payroll List Container Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Card Header: Product List Title + Search & Filter */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
          <h3 className="text-base font-bold text-gray-900">
            Product List
          </h3>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-[320px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, email, phone.."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Filter Funnel Button */}
            <button
              type="button"
              title="Filter payroll"
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
                <th className="py-3.5 px-6 font-semibold w-10">#</th>
                <th className="py-3.5 px-6 font-semibold">Employee</th>
                <th className="py-3.5 px-6 font-semibold">Basic Salary</th>
                <th className="py-3.5 px-6 font-semibold">Allowances</th>
                <th className="py-3.5 px-6 font-semibold">Deductions</th>
                <th className="py-3.5 px-6 font-semibold">Net Salary</th>
                <th className="py-3.5 px-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {payroll.map((item, idx) => (
                <tr
                  key={`${item.id}-${idx}`}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* Index */}
                  <td className="py-4 px-6 text-gray-500 font-medium">
                    {item.index}
                  </td>

                  {/* Employee Avatar + Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-amber-100 relative shrink-0 overflow-hidden border border-gray-200">
                        <Image
                          src={item.employee.avatar}
                          alt={item.employee.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900 truncate">
                        {item.employee.name}
                      </span>
                    </div>
                  </td>

                  {/* Basic Salary */}
                  <td className="py-4 px-6 font-bold text-gray-900">
                    {item.basicSalaryFormatted}
                  </td>

                  {/* Allowances */}
                  <td className="py-4 px-6 font-bold text-gray-900">
                    {item.allowancesFormatted}
                  </td>

                  {/* Deductions */}
                  <td className="py-4 px-6 font-bold text-gray-900">
                    {item.deductionsFormatted}
                  </td>

                  {/* Net Salary */}
                  <td className="py-4 px-6 font-bold text-gray-900">
                    {item.netSalaryFormatted}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6 text-center">
                    {item.status === "Paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
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

        {/* Footer / Pagination Controls */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100 text-xs text-gray-500">
          {/* Entries summary */}
          <div className="flex items-center gap-4">
            <span>Showing 1 to {Math.min(pageSize, payroll.length)} of 50 entries</span>

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

