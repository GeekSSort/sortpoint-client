"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, PanelLeft, PanelLeftClose } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function Header() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/customers/add" || pathname === "/customers/new") return "Customer_Add Customer";
    if (pathname.startsWith("/customers")) return "Customer_Overview";
    if (pathname.startsWith("/sales-pos/return")) return "Sales & POS_Return";
    if (pathname.startsWith("/sales-pos/sales")) return "Sales & POS_Sales";
    if (pathname.startsWith("/sales-pos")) return "Sales & POS_POS";
    if (pathname.startsWith("/ceo-overview")) return "CEO Overview";
    if (pathname.startsWith("/inventory")) return "Inventory";
    if (pathname.startsWith("/purchases")) return "Purchases";
    if (pathname.startsWith("/hrm")) return "HRM";
    if (pathname.startsWith("/roles-permissions")) return "Roles & Permissions";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Dashboard_Overview";
  };

  return (
    <header className="h-[60px] bg-transparent flex items-center justify-between select-none">
      {/* Title + Sidebar Minimize/Expand Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5 text-[#F4B41A]" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          {getPageTitle()}
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