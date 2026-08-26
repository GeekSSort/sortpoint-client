"use client";

import React from "react";
import Image from "next/image";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-[60px] bg-transparent flex items-center justify-between select-none">
      {/* Title */}
      <div>
        <h1 className="text-base font-bold text-gray-800 tracking-tight">
          Dashboard_Overview
        </h1>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-full bg-amber-50/90 text-[#F4B41A] hover:bg-amber-100/80 flex items-center justify-center transition-colors cursor-pointer relative"
        >
          <Bell className="w-4 h-4 fill-[#F4B41A]/20 text-[#F4B41A]" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#F4B41A] rounded-full ring-2 ring-white" />
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 relative border border-gray-200 cursor-pointer hover:ring-2 hover:ring-amber-400/40 transition-all">
          <Image
            src="/image.png"
            alt="Zayn Malik"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}