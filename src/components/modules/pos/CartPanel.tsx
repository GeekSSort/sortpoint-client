"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Trash2, 
  Minus, 
  Plus, 
  Search, 
  UserPlus, 
  ChevronDown, 
  Percent, 
  Ticket,
  CheckCircle2
} from "lucide-react";
import { CartItem, Customer } from "@/types/pos";
import { PosService } from "@/lib/services/pos.service";

interface CartPanelProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function CartPanel({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartPanelProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("Walk-in Customer");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponCode, setCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 5.98 : 0;
  const discountAmount = (rawSubtotal * discountPercent) / 100 + (couponCode === "SAVE10" ? 10 : 0);
  const finalTotal = Math.max(0, rawSubtotal + shipping - discountAmount);

  const handleCheckout = async (method: "Cash" | "Online") => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const response = await PosService.createOrder({
        customerId: selectedCustomer,
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
        paymentMethod: method,
        discountCode: couponCode || undefined,
        discountAmount,
        totalAmount: finalTotal,
      });

      setOrderSuccess(response.invoiceNo);
      setTimeout(() => {
        setOrderSuccess(null);
        onClearCart();
      }, 2500);
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-5 select-none">
      {/* Top Invoice Header with Hold, Start, Reset buttons */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <h3 className="text-sm font-bold text-gray-900">
          Invoice on payment
        </h3>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (cart.length > 0) alert("Order put on Hold successfully.");
            }}
            className="px-3 py-1 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Hold
          </button>
          <button
            type="button"
            className="px-3 py-1 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Start
          </button>
          <button
            type="button"
            onClick={onClearCart}
            className="px-3 py-1 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Cart List Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-gray-900">
            Cart ({totalItemsCount} items)
          </h4>
          <button
            type="button"
            onClick={onClearCart}
            title="Clear Cart"
            className="p-1 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-gray-400 font-medium border-b border-gray-100">
                <th className="py-2 px-1 w-6">#</th>
                <th className="py-2 px-2">Reference</th>
                <th className="py-2 px-2 text-right">Price</th>
                <th className="py-2 px-2 text-center w-24">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-800">
              {cart.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 text-xs">
                    Cart is empty. Click products on the left to add.
                  </td>
                </tr>
              ) : (
                cart.map((item, idx) => (
                  <tr key={item.product.id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-1 text-gray-400 text-[11px]">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gray-100 relative shrink-0 overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                        <span className="truncate max-w-[110px] text-xs font-semibold text-gray-900">
                          {item.product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-xs font-bold text-gray-900">
                      {item.product.priceFormatted}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center border border-gray-200 rounded-lg p-0.5 bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Summary Section */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
        <h4 className="text-xs sm:text-sm font-bold text-gray-900">
          Customer Summary
        </h4>

        {/* Customer Search with UserPlus icon */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Search customer by name..."
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            title="Add new customer"
            className="absolute right-2.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Customer Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs font-medium text-gray-700 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span>{selectedCustomer}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {isCustomerDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
              {["Walk-in Customer", "Rahim Uddin", "Karim Ahmed", "Tanvir Hasan"].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(name);
                    setIsCustomerDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-amber-50 hover:text-[#F4B41A] ${
                    selectedCustomer === name ? "font-bold text-[#F4B41A]" : "text-gray-700"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Discount & Coupon Row */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* % Discount */}
          <div className="relative flex items-center border border-gray-200 rounded-xl px-2.5 py-1.5 bg-white">
            <Percent className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent || ""}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              placeholder="Discount %"
              className="w-full text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* Coupon Code */}
          <div className="relative flex items-center border border-gray-200 rounded-xl px-2.5 py-1.5 bg-white">
            <Ticket className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              className="w-full text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <h4 className="text-xs sm:text-sm font-bold text-gray-900">
          Order Summary
        </h4>

        <div className="flex flex-col gap-1.5 text-xs text-gray-500 font-medium">
          <div className="flex items-center justify-between">
            <span>Subtotal ({totalItemsCount}item)</span>
            <span className="font-semibold text-gray-800">${rawSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-gray-800">${shipping.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="font-semibold text-emerald-600">-${discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-base font-extrabold text-gray-900">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {orderSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Order placed! Invoice: <strong>{orderSuccess}</strong></span>
        </div>
      )}

      {/* Payment Action Buttons (Cash Pay & Pay Online) */}
      <div className="flex items-center gap-2.5 pt-1">
        {/* Cash Pay */}
        <button
          type="button"
          disabled={cart.length === 0 || isProcessing}
          onClick={() => handleCheckout("Cash")}
          className="flex-1 py-3 px-3 bg-[#4D505B] hover:bg-[#3D404A] text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
          {isProcessing ? "Processing..." : "Cash Pay"}
        </button>

        {/* Pay Online */}
        <button
          type="button"
          disabled={cart.length === 0 || isProcessing}
          onClick={() => handleCheckout("Online")}
          className="flex-[1.5] py-3 px-4 bg-[#F4B41A] hover:bg-[#E5A612] text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
          {isProcessing ? "Processing..." : "Pay Online"}
        </button>
      </div>
    </div>
  );
}

