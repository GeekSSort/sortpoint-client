"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  CreditCard,
} from "lucide-react";
import { EmployeeRecord } from "@/types/hrm";
import { HrmService } from "@/services";

export default function HrmPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("24 August 2026");
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New employee state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<"Management" | "HR" | "Sales" | "Accounts" | "IT">("Management");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    HrmService.getEmployees({ search: searchQuery }).then((res) => {
      setEmployees(res.data);
    });
  }, [searchQuery]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation) return;

    const created = await HrmService.createEmployee({
      name,
      department,
      designation,
      status: "Present",
    });

    setEmployees((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setName("");
    setDesignation("");
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-8 select-none">
      {/* Top Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            All Employees
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage employee records, attendance, check-in/out, and employee status from one place.
          </p>
        </div>

        {/* Action Controls: Mini Payroll Button, Date Filter & Add New */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Mini Payroll Button (Requested) */}
          <Link
            href="/hrm/payroll"
            className="flex items-center gap-2 px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100/80 text-amber-700 border border-amber-200/80 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
            title="Manage Payroll"
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>Payroll</span>
          </Link>

          {/* Date Selector Pill */}
          <button
            type="button"
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span>{selectedDate}</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </button>

          {/* Add New Button */}
          <Link
            href="/hrm/add"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New</span>
          </Link>
        </div>
      </div>

      {/* Employee List Container Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Card Header: Product List Title + Search & Filter */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
          <h3 className="text-base font-bold text-gray-900">
            Employee List
          </h3>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-[320px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, email, phone..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Filter Funnel Button */}
            <button
              type="button"
              title="Filter employees"
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
                <th className="py-3.5 px-4 font-semibold w-10">#</th>
                <th className="py-3.5 px-4 font-semibold">Employee</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Designation</th>
                <th className="py-3.5 px-4 font-semibold">Check In</th>
                <th className="py-3.5 px-4 font-semibold">Check Out</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {employees.map((item, idx) => (
                <tr
                  key={`${item.id}-${idx}`}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* Index */}
                  <td className="py-4 px-4 text-gray-500 font-medium">
                    {item.index}
                  </td>

                  {/* Employee Avatar + Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-amber-100 relative shrink-0 overflow-hidden border border-gray-200">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900 truncate">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-4 px-4 text-gray-600">
                    {item.department}
                  </td>

                  {/* Designation */}
                  <td className="py-4 px-4 text-gray-700 font-medium">
                    {item.designation}
                  </td>

                  {/* Check In */}
                  <td className="py-4 px-4 text-gray-500 font-mono text-[11px]">
                    {item.checkIn}
                  </td>

                  {/* Check Out */}
                  <td className="py-4 px-4 text-gray-500 font-mono text-[11px]">
                    {item.checkOut}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center">
                    {item.status === "Present" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Present
                      </span>
                    )}
                    {item.status === "On Leave" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        On Leave
                      </span>
                    )}
                    {item.status === "Absent" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Absent
                      </span>
                    )}
                  </td>

                  {/* Action 3 Dots */}
                  <td className="py-4 px-4 text-center">
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
            <span>Showing 1 to {Math.min(pageSize, employees.length)} of 50 entries</span>

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

      {/* Add New Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h4 className="text-base font-bold text-gray-900">Add New Employee</h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmed Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Management">Management</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Accounts">Accounts</option>
                  <option value="IT">IT</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. General Manager"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#F4B41A] hover:bg-[#E5A612] shadow-xs transition-colors"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
