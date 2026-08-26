"use client";

import React from "react";
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
  LogOut,
} from "lucide-react";

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

  return (
    <aside
      className="w-[240px] min-h-screen bg-[#F8F9FA] border-r border-gray-200 pt-[20px] pb-[20px] px-[16px] flex flex-col justify-between select-none shrink-0"
      style={{ opacity: 1 }}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-[10px]">
        {/* Brand / Logo */}
        <div className="mb-3">
          <Link href="/dashboard" className="block relative w-full h-[52px] rounded-xl overflow-hidden bg-[#16161a]">
            <Image
              src="/left_sidebar_logo.png"
              alt="SORTPOINT SMART POS · SIMPLY BUSINESS"
              fill
              className="object-contain p-1.5"
              priority
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-[6px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
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
      <div className="flex flex-col gap-4 mt-auto pt-4">
        {/* Log Out Button */}
        <button
          type="button"
          onClick={() => {
            // Can be connected to auth sign-out action or redirect to /login
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
              onError={(e) => {
                // Fallback handling
                e.currentTarget.style.display = "none";
              }}
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