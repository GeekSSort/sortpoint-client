"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  ScanBarcode, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown 
} from "lucide-react";
import { ProductItem, ProductCategory } from "@/types/pos";
import { initialProductCatalog } from "@/lib/mock-pos-data";

interface ProductGridProps {
  onSelectProduct?: (product: ProductItem) => void;
}

const categories: ProductCategory[] = [
  "All Categories",
  "Electronics",
  "Groceries",
  "Fashion",
  "Home & Living",
];

export default function ProductGrid({ onSelectProduct }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

  const filteredProducts = initialProductCatalog.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 flex-1 select-none">
      {/* Search Input Bar with Barcode Scanner Icon */}
      <div className="relative w-full flex items-center">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search product by name, SKU or barcode..."
          className="w-full pl-10 pr-11 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
        />
        <button
          type="button"
          aria-label="Scan barcode"
          title="Scan barcode"
          className="absolute right-3 text-gray-500 hover:text-gray-800 transition-colors p-1"
        >
          <ScanBarcode className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "border border-amber-400 text-amber-500 bg-white shadow-2xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* More Options / Filter Button */}
        <button
          type="button"
          className="p-1.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* 3x3 Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct?.(product)}
            className="bg-white rounded-2xl p-3 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-amber-300/80 transition-all cursor-pointer group flex flex-col justify-between"
          >
            {/* Product Image Container */}
            <div className="w-full h-[120px] sm:h-[135px] bg-[#F9FAFB] rounded-xl relative overflow-hidden flex items-center justify-center p-3">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="mt-2.5">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {product.name}
              </h4>

              {/* Price & Stock status */}
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs sm:text-sm font-bold text-[#F4B41A]">
                  {product.priceFormatted}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Stock {product.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Grid Pagination Footer */}
      <div className="mt-2 py-3 px-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 select-none">
        <div>
          Showing 1 to {filteredProducts.length} of 50 entries
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
            <div className="absolute bottom-full mb-1 left-0 w-24 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
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

        {/* Page Controls */}
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
          <span className="px-1 text-gray-400 text-xs">..</span>
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
  );
}

