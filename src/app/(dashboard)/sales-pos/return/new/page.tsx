"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, CheckCircle2 } from "lucide-react";
import { PosService, ReturnService } from "@/services";

interface ReturnOrderItem {
  id: string;
  name: string;
  image: string;
  priceFormatted: string;
  price: number;
  qty: number;
}

export default function NewReturnPage() {
  const router = useRouter();
  const [items, setItems] = useState<ReturnOrderItem[]>([]);
  const [customerName, setCustomerName] = useState("Rahman Uddin");
  const [customerType, setCustomerType] = useState("Walk-in Customer");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  React.useEffect(() => {
    PosService.getProducts().then((products) => {
      if (products.length >= 3) {
        setItems([
          {
            id: "item-1",
            name: products[0].name,
            image: products[0].image,
            priceFormatted: products[0].priceFormatted,
            price: products[0].price,
            qty: 1,
          },
          {
            id: "item-2",
            name: products[1].name,
            image: products[1].image,
            priceFormatted: products[1].priceFormatted,
            price: products[1].price,
            qty: 1,
          },
          {
            id: "item-3",
            name: products[2].name,
            image: products[2].image,
            priceFormatted: products[2].priceFormatted,
            price: products[2].price,
            qty: 1,
          },
        ]);
      }
    });
  }, []);

  const handleUpdateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleRefundNow = async () => {
    setIsProcessing(true);
    try {
      const refundTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      await ReturnService.processRefund({
        invoiceNo: "INV-2024-00125",
        customerName,
        refundAmount: refundTotal,
        paymentMethod: "Cash",
      });
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/sales-pos/return");
      }, 1500);
    } catch (err) {
      console.error("Refund failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="w-full flex flex-col gap-6 pb-12 select-none">
      {/* Top Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          New Return
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Create a new product return and refund request.
        </p>
      </div>

      {/* Centered Return Form Container */}
      <div className="mx-auto w-full max-w-[560px] flex flex-col gap-6">
        {/* 1. Customer Order List Card */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Card Header */}
          <div className="py-3 px-4 text-center border-b border-gray-100 bg-white">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
              Customer Order List
            </h3>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 font-medium border-b border-gray-100">
                  <th className="py-2.5 px-4 w-10">#</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-center w-28">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800 font-medium">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    {/* Index */}
                    <td className="py-3.5 px-4 text-gray-400 font-medium">
                      {String(idx + 1).padStart(2, "0")}
                    </td>

                    {/* Reference Thumbnail + Name */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-gray-100 relative shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                        <span className="truncate max-w-[170px] text-xs font-semibold text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right text-xs font-bold text-gray-900">
                      {item.priceFormatted}
                    </td>

                    {/* Qty Pill Counter */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center border border-gray-200 rounded-lg p-0.5 bg-white max-w-[85px] mx-auto">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Customer Summary Section */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs sm:text-sm font-bold text-gray-900">
            Customer Summary
          </h4>

          <div className="flex flex-col gap-2">
            <div className="w-full px-4 py-2.5 text-center bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 shadow-2xs">
              {customerName}
            </div>
            <div className="w-full px-4 py-2.5 text-center bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 shadow-2xs">
              {customerType}
            </div>
          </div>
        </div>

        {/* 3. Order Summary Section */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs sm:text-sm font-bold text-gray-900">
            Order Summary
          </h4>

          <div className="flex flex-col gap-2 text-xs text-gray-500 font-medium">
            <div className="flex items-center justify-between">
              <span>Subtotal ({totalItemsCount}item)</span>
              <span className="font-semibold text-gray-800">$199.98</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-gray-800">$5.98</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="font-semibold text-gray-800">$5.98</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-base font-extrabold text-gray-900">$186.99</span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Refund processed successfully! Redirecting...</span>
          </div>
        )}

        {/* 4. Refund Now Action Button */}
        <button
          type="button"
          onClick={handleRefundNow}
          disabled={isProcessing}
          className="w-full py-3.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs text-center cursor-pointer disabled:opacity-60"
        >
          {isProcessing ? "Processing Refund..." : "Refund Now"}
        </button>
      </div>
    </div>
  );
}

