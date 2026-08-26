"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Calendar, CheckCircle2 } from "lucide-react";
import { StockService, PosService } from "@/services";
import { ProductItem } from "@/types/pos";

export default function AddStockPage() {
  const router = useRouter();

  // Products state
  const [productsList, setProductsList] = useState<ProductItem[]>([]);

  // Form State
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [sku, setSku] = useState("৳ 0.00");
  const [warehouse, setWarehouse] = useState("");
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState("120");
  const [addQuantity, setAddQuantity] = useState("");
  const [date, setDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  React.useEffect(() => {
    PosService.getProducts().then((data) => {
      setProductsList(data);
    });
  }, []);

  // Computed New Total Stock
  const currentNum = parseInt(currentStock, 10) || 0;
  const addNum = parseInt(addQuantity, 10) || 0;
  const newTotalStock = addQuantity !== "" ? String(currentNum + addNum) : "";

  const handleSelectProduct = (name: string, skuVal: string) => {
    setSelectedProduct(name);
    setSku(skuVal || "SONY-WH-1000XM5");
    setIsProductOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmitting(true);
    try {
      await StockService.addStock({
        productName: selectedProduct,
        sku,
        warehouse: warehouse || "Main Central Hub",
        currentStock: currentNum,
        addQuantity: addNum,
        date,
      });
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/inventory/stock");
      }, 1400);
    } catch (err) {
      console.error("Failed to add stock:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 select-none">
      {/* Top Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Add Stock
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Add new stock to your inventory.
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
                Add Stock
              </h3>
            </div>

            {/* Form Fields with Exact Spacing */}
            <div className="p-6 flex flex-col gap-4">
              {/* 1. Select Product */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Select Product
                </label>
                <button
                  type="button"
                  onClick={() => setIsProductOpen(!isProductOpen)}
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs bg-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className={selectedProduct ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {selectedProduct || "Select product name"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isProductOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30 max-h-48 overflow-y-auto">
                    {productsList.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleSelectProduct(prod.name, prod.sku)}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                          selectedProduct === prod.name ? "font-bold text-[#F4B41A]" : "text-gray-700"
                        }`}
                      >
                        {prod.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. SKU */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="৳ 0.00"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 3. Warehouse */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Warehouse
                </label>
                <button
                  type="button"
                  onClick={() => setIsWarehouseOpen(!isWarehouseOpen)}
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs bg-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className={warehouse ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {warehouse || "Select warehouse"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isWarehouseOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
                    {["Main Central Warehouse", "Electronics Hub", "Home & Living Depot", "Fashion Storage"].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {
                          setWarehouse(w);
                          setIsWarehouseOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                          warehouse === w ? "font-bold text-[#F4B41A]" : "text-gray-700"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Current Stock & Add Quantity Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    placeholder="120"
                    className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1.5">
                    Add Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={addQuantity}
                    onChange={(e) => setAddQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 5. New Total Stock */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  New Total Stock
                </label>
                <input
                  type="text"
                  readOnly
                  value={newTotalStock}
                  placeholder="Current Stock + Add Quantity"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-gray-50/50 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* 6. Date */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Date
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-200 hover:border-gray-300 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Success Notification */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Stock added successfully! Redirecting to stock list...</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs text-center cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Adding Stock..." : "Add Stock"}
          </button>
        </form>
      </div>
    </div>
  );
}

