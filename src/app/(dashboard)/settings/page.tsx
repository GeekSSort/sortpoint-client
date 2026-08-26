"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SettingsService } from "@/services";
import { CompanyProfile } from "@/types/settings";

export default function SettingsPage() {
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: "ABC Retail Ltd.",
    businessType: "Private Limited",
    companyEmail: "info@abcretail.com",
    phoneNumber: "+880 1712-345678",
    website: "www.abcretail.com",
    taxId: "123456789",
    tradeLicenseBin: "123456789",
    currency: "BDT — Bangladeshi Taka",
    logoUrl: "/image1.png",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    SettingsService.getCompanyProfile().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

  const handleFieldChange = (field: keyof CompanyProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await SettingsService.updateCompanyProfile(profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 select-none">
      {/* Top Page Header Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Company Profile
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Manage your company information, branding, contact details, and business settings.
        </p>
      </div>

      {/* Main Settings Container */}
      <form onSubmit={handleSave} className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Branding / Logo Card */}
        <div className="w-full lg:w-[280px] bg-white rounded-2xl border border-gray-200/90 p-8 flex flex-col items-center justify-center gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] shrink-0">
          <div className="w-[180px] h-[90px] relative flex items-center justify-center">
            <Image
              src="/image1.png"
              alt="ABCD Retailer Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <Link
            href="/settings/edit"
            className="px-5 py-1.5 border border-amber-400 text-amber-500 hover:bg-amber-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Edit Profile
          </Link>
        </div>

        {/* Right Form Card */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          {/* 1. Company Name */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => handleFieldChange("companyName", e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* 2. Business Type */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Business Type
            </label>
            <input
              type="text"
              value={profile.businessType}
              onChange={(e) => handleFieldChange("businessType", e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* 3. Company Email */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Company Email
            </label>
            <input
              type="email"
              value={profile.companyEmail}
              onChange={(e) => handleFieldChange("companyEmail", e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* 4. Phone Number */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phoneNumber}
              onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* 5. Website */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Website
            </label>
            <input
              type="text"
              value={profile.website}
              onChange={(e) => handleFieldChange("website", e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* 6. Tax ID / BIN */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Tax ID / BIN
            </label>
            <input
              type="text"
              value={profile.taxId}
              onChange={(e) => handleFieldChange("taxId", e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* 7. Tax ID / BIN */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Tax ID / BIN
            </label>
            <input
              type="text"
              value={profile.tradeLicenseBin}
              onChange={(e) => handleFieldChange("tradeLicenseBin", e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* 8. Currency */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Currency
            </label>
            <input
              type="text"
              value={profile.currency}
              onChange={(e) => handleFieldChange("currency", e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-gray-800 bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Success Message */}
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#F4B41A] hover:bg-[#E5A612] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
