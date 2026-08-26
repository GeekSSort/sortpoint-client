"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CloudUpload, CheckCircle2 } from "lucide-react";

export default function AddNewProductPage() {
  const router = useRouter();

  // Form State
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [isTaxOpen, setIsTaxOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Compute Final Price
  const sp = parseFloat(sellingPrice) || 0;
  const disc = parseFloat(discountPercent) || 0;
  const tax = parseFloat(taxRate) || 0;
  const discounted = sp - (sp * disc) / 100;
  const finalCalculatedPrice = discounted + (discounted * tax) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/inventory");
      }, 1400);
    }, 800);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 select-none">
      {/* Top Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Add New Product
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Add a new product to your inventory with pricing, stock, and product information.
        </p>
      </div>

      {/* Centered Form Container */}
      <div className="mx-auto w-full max-w-[560px] flex flex-col gap-5 pt-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Card Form Box */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Header */}
            <div className="py-3 px-4 text-center border-b border-gray-100 bg-white">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
                Add New Product
              </h3>
            </div>

            {/* Form Fields with Exact Spacing */}
            <div className="p-6 flex flex-col gap-4">
              {/* 1. Product Name */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full border border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 2. Category */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs bg-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className={category ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {category || "Select product category"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                    {["Electronics", "Home & Living", "Accessories", "Footwear", "Bags"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                          category === cat ? "font-bold text-[#F4B41A]" : "text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Brand */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Brand
                </label>
                <button
                  type="button"
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs bg-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className={brand ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {brand || "Select product brand"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isBrandOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                    {["Apple", "Sony", "Logitech", "Philips", "Decathlon", "Samsonite", "Nike", "Ray-Ban"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setBrand(b);
                          setIsBrandOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                          brand === b ? "font-bold text-[#F4B41A]" : "text-gray-700"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Purchase Price & Selling Price Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    Purchase Price
                  </label>
                  <input
                    type="text"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="৳ 0.00"
                    className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    Selling Price
                  </label>
                  <input
                    type="text"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="৳ 0.00"
                    className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 5. Discount & Tax / VAT Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    Discount
                  </label>
                  <input
                    type="text"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="0 %"
                    className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    Tax / VAT
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTaxOpen(!isTaxOpen)}
                    className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs bg-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className={taxRate ? "text-gray-800 font-medium" : "text-gray-400"}>
                      {taxRate ? `${taxRate}%` : "Select tax rate"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {isTaxOpen && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                      {["0", "5", "7.5", "10", "15"].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => {
                            setTaxRate(rate);
                            setIsTaxOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                            taxRate === rate ? "font-bold text-[#F4B41A]" : "text-gray-700"
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Final Price */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Final Price
                </label>
                <input
                  type="text"
                  readOnly
                  value={finalCalculatedPrice > 0 ? `৳ ${finalCalculatedPrice.toFixed(2)}` : ""}
                  placeholder="৳ 0.00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-gray-50/50 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* 7. Upload Image Box */}
              <div>
                <label className="w-full border border-gray-200 hover:border-gray-300 rounded-xl py-6 flex items-center justify-center gap-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50/70 transition-colors cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" />
                  <CloudUpload className="w-5 h-5 text-gray-700" />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Product saved successfully! Redirecting to inventory...</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs text-center cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Saving Product..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

