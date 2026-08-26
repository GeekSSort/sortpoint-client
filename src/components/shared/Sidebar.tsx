"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Boxes,
  ShoppingCart,
  UserCheck,
  ShieldCheck,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
  PanelLeftClose,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  hasChevron?: boolean;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sales & POS", href: "/sales-pos", icon: Receipt, hasChevron: true },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Boxes, hasChevron: true },
  { name: "Purchases", href: "/purchases", icon: ShoppingCart, hasChevron: true },
  { name: "HRM", href: "/hrm", icon: UserCheck },
  { name: "Roles & Permissions", href: "/roles-permissions", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const isSalesPosRoute = pathname.startsWith("/sales-pos");
  const [salesPosOpen, setSalesPosOpen] = useState(isSalesPosRoute);

  const isPosActive = pathname === "/sales-pos" || pathname === "/sales-pos/pos";
  const isSalesActive = pathname === "/sales-pos/sales";
  const isReturnActive = pathname === "/sales-pos/return";

  return (
    <aside
      className={`bg-[#F8F9FA] border-r border-gray-200 flex flex-col justify-between select-none shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-40 ${
        isCollapsed
          ? "w-0 p-0 border-r-0 opacity-0 pointer-events-none -translate-x-full"
          : "w-[240px] min-h-screen pt-[20px] pb-[20px] px-[16px] gap-[10px] opacity-100 translate-x-0"
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-[10px] w-[208px]">
        {/* Brand / Logo + Minimize button */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <Link href="/dashboard" className="block relative flex-1 h-[52px] rounded-xl overflow-hidden bg-[#16161a]">
            <Image
              src="/left_sidebar_logo.png"
              alt="SORTPOINT SMART POS · SIMPLY BUSINESS"
              fill
              className="object-contain p-1.5"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            title="Minimize sidebar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-[6px]">
          {navItems.map((item) => {
            const isDashboard = item.href === "/dashboard" && (pathname === "/" || pathname === "/dashboard");
            const isSalesPos = item.name === "Sales & POS";
            const isActive = isSalesPos ? isSalesPosRoute : (pathname === item.href || isDashboard);
            const Icon = item.icon;

            // Render expanded Golden Card for Sales & POS
            if (isSalesPos && (salesPosOpen || isSalesPosRoute)) {
              return (
                <div
                  key={item.name}
                  className="bg-[#F4B41A] rounded-2xl p-2.5 sm:p-3 text-white shadow-sm flex flex-col gap-2 transition-all"
                >
                  {/* Sales & POS Header inside the Gold Card */}
                  <button
                    type="button"
                    onClick={() => setSalesPosOpen(!salesPosOpen)}
                    className="flex items-center justify-between w-full text-left font-bold text-sm text-white cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-4 h-4 text-white" />
                      <span>Sales & POS</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>

                  {/* Submenu Items */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    {/* POS Sub-item */}
                    <Link
                      href="/sales-pos"
                      className={`w-full text-left py-1.5 px-3 rounded-lg font-medium text-xs transition-colors block ${
                        isPosActive
                          ? "bg-white text-gray-900 font-semibold shadow-2xs"
                          : "border border-white/50 text-white hover:bg-white/10"
                      }`}
                    >
                      POS
                    </Link>

                    {/* Sales Sub-item */}
                    <Link
                      href="/sales-pos/sales"
                      className={`w-full text-left py-1.5 px-3 rounded-lg font-medium text-xs transition-colors block ${
                        isSalesActive
                          ? "bg-white text-gray-900 font-semibold shadow-2xs"
                          : "border border-white/50 text-white hover:bg-white/10"
                      }`}
                    >
                      Sales
                    </Link>

                    {/* Return Sub-item */}
                    <Link
                      href="/sales-pos/return"
                      className={`w-full text-left py-1.5 px-3 rounded-lg font-medium text-xs transition-colors block ${
                        isReturnActive
                          ? "bg-white text-gray-900 font-semibold shadow-2xs"
                          : "border border-white/50 text-white hover:bg-white/10"
                      }`}
                    >
                      Return
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (isSalesPos) {
                    setSalesPosOpen(true);
                  }
                }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-[#F4B41A] shadow-xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors ${
                      isActive ? "text-[#F4B41A]" : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.hasChevron && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform text-gray-400 ${
                      isActive ? "text-[#F4B41A]" : "group-hover:translate-x-0.5"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Log Out & User Profile */}
      <div className="flex flex-col gap-4 mt-auto pt-4 w-[208px]">
        {/* Log Out Button */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/login";
          }}
          className="w-full py-2 px-3.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 flex items-center justify-between transition-all cursor-pointer shadow-2xs"
        >
          <span>Log Out</span>
          <LogOut className="w-4 h-4 text-gray-500 rotate-180" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 relative shrink-0">
            <Image
              src="/image.png"
              alt="Zayn Malik"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-900 truncate">
              Zayn Malik
            </span>
            <span className="text-[11px] text-gray-500 truncate">
              zaynmalik29@gmail.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}