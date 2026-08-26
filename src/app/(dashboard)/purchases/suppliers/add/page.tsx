"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, CheckCircle2 } from "lucide-react";
import { SuppliersService } from "@/lib/services/suppliers.service";

export default function AddSupplierPage() {
  const router = useRouter();

  // Form State
  const [supplierName, setSupplierName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName) return;

    setIsSubmitting(true);
    try {
      await SuppliersService.createSupplier({
        name: supplierName,
        phone: phoneNumber || "+880 1912 345 680",
        mail: emailAddress || "info@abctraders.com",
        status: "Active",
      });

      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/purchases/suppliers");
      }, 1400);
    } catch (err) {
      console.error("Failed to add supplier:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 select-none">
      {/* Top Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Add Suppliers
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Add a new supplier and manage their business, contact, and payment information.
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
                Add Supplier
              </h3>
            </div>

            {/* Form Fields with Exact Spacing */}
            <div className="p-6 flex flex-col gap-4">
              {/* 1. Supplier Name */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Supplier Name
                </label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Enter supplier name"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 2. Phone Number */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter supplier phone number"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 3. Email Address */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* 4. Upload Image Box */}
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
              <span>Supplier added successfully! Redirecting to suppliers list...</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs text-center cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Adding Supplier..." : "Add Supplier"}
          </button>
        </form>
      </div>
    </div>
  );
}

