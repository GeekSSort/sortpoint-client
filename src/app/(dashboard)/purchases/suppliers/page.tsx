"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { SupplierRecord } from "@/types/suppliers";
import { SuppliersService, initialSuppliersData } from "@/lib/services/suppliers.service";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(initialSuppliersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New supplier state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");

  useEffect(() => {
    SuppliersService.getSuppliers({ search: searchQuery }).then((res) => {
      setSuppliers(res.data);
    });
  }, [searchQuery]);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const created = await SuppliersService.createSupplier({
      name,
      phone,
      mail: mail || "info@abctraders.com",
      status: "Active",
    });

    setSuppliers((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setName("");
    setPhone("");
    setMail("");
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-8 select-none">
      {/* Top Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            All Suppliers
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage all suppliers, purchase history, outstanding balances, and supplier information from one place.
          </p>
        </div>

        {/* Add New Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/purchases/suppliers/add"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New</span>
          </Link>
        </div>
      </div>

      {/* Supplier List Container Card */}
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
              title="Filter suppliers"
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
                <th className="py-3.5 px-4 font-semibold">Supplier Name</th>
                <th className="py-3.5 px-4 font-semibold">Phone</th>
                <th className="py-3.5 px-4 font-semibold">Mail</th>
                <th className="py-3.5 px-4 font-semibold">Total Purchases</th>
                <th className="py-3.5 px-4 font-semibold">Balance</th>
                <th className="py-3.5 px-4 font-semibold">Last Purchase</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {suppliers.map((item, idx) => (
                <tr
                  key={`${item.id}-${idx}`}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* Index */}
                  <td className="py-4 px-4 text-gray-500 font-medium">
                    {item.index}
                  </td>

                  {/* Supplier Name + Avatar */}
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

                  {/* Phone */}
                  <td className="py-4 px-4 text-gray-600">
                    {item.phone}
                  </td>

                  {/* Mail */}
                  <td className="py-4 px-4 text-gray-600">
                    {item.mail}
                  </td>

                  {/* Total Purchases */}
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {item.totalPurchasesFormatted}
                  </td>

                  {/* Balance */}
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {item.balanceFormatted}
                  </td>

                  {/* Last Purchase */}
                  <td className="py-4 px-4 text-gray-500">
                    {item.lastPurchase}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center">
                    {item.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Inactive
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
            <span>Showing 1 to {Math.min(pageSize, suppliers.length)} of 50 entries</span>

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

      {/* Add New Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h4 className="text-base font-bold text-gray-900">Add New Supplier</h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Traders"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +880 1912 345 680"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. info@abctraders.com"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

