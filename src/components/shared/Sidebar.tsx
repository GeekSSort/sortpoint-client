"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import MaskIcon from "../ui/MaskIcon";

/**
 * Figma: SORTPoint / node 59:17268 (sidebar), with the expanded submenu from
 * the design system's node 77:20880.
 */
interface SubItem {
  name: string;
  href: string;
  match?: (pathname: string) => boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  /** inset of the glyph inside its 20x20 frame, straight from Figma */
  inset: string;
  children?: SubItem[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "/icons/sidebar/dashboard.svg",
    inset: "8.33%",
  },
  {
    name: "Sales & POS",
    href: "/sales-pos",
    icon: "/icons/sidebar/sales-pos.svg",
    inset: "8.33% 16.04% 8.33% 16.67%",
    children: [
      {
        name: "POS",
        href: "/sales-pos",
        match: (p) => p === "/sales-pos" || p === "/sales-pos/pos",
      },
      { name: "Sales", href: "/sales-pos/sales" },
      { name: "Return", href: "/sales-pos/return" },
    ],
  },
  {
    name: "Customers",
    href: "/customers",
    icon: "/icons/sidebar/customers.svg",
    inset: "8.33% 12.3% 8.33% 8.33%",
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: "/icons/sidebar/inventory.svg",
    inset: "6.25% 7.33% 10.42% 6.25%",
    children: [
      {
        name: "Product",
        href: "/inventory",
        match: (p) =>
          !p.startsWith("/inventory/stock") && !p.startsWith("/inventory/transfers"),
      },
      { name: "Stock", href: "/inventory/stock" },
      { name: "Transfers", href: "/inventory/transfers" },
    ],
  },
  {
    name: "Purchases",
    href: "/purchases",
    icon: "/icons/sidebar/purchases.svg",
    inset: "12.5% 8.33% 12.37% 8.33%",
    children: [
      {
        name: "Purchase History",
        href: "/purchases",
        match: (p) => !p.startsWith("/purchases/suppliers"),
      },
      { name: "Suppliers", href: "/purchases/suppliers" },
    ],
  },
  {
    name: "HRM",
    href: "/hrm",
    icon: "/icons/sidebar/hrm.svg",
    inset: "8.33% 8.33% 10.11% 8.33%",
  },
  {
    name: "Roles & Permissions",
    href: "/roles-permissions",
    icon: "/icons/sidebar/roles.svg",
    inset: "12.5%",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "/icons/sidebar/settings.svg",
    inset: "8.33% 8.35% 8.33% 12.5%",
  },
];

const isRouteActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const [openMenu, setOpenMenu] = useState<string | null>(
    () => navItems.find((i) => i.children && isRouteActive(pathname, i.href))?.name ?? null
  );

  return (
    <aside
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-surface transition-all duration-300 ease-in-out select-none z-40 ${
        isCollapsed
          ? "w-0 -translate-x-full p-0 opacity-0 pointer-events-none"
          : "h-screen w-[240px] translate-x-0 px-[16px] py-[20px] opacity-100"
      }`}
    >
      <div className="flex h-full w-[208px] flex-col items-start justify-between">
        {/* Logo + navigation */}
        <div className="flex w-full flex-col items-center justify-center gap-[32px]">
          <Link href="/dashboard" className="block h-[54px] w-[208px] shrink-0">
            <Image
              src="/sidebar_logo.png"
              alt="SORTPoint — Smart POS, Simple Business"
              width={208}
              height={54}
              className="h-[54px] w-[208px] object-contain"
              priority
            />
          </Link>

          <nav className="flex w-full flex-col gap-[8px]">
            {navItems.map((item) => {
              const active = isRouteActive(pathname, item.href);
              const isOpen = openMenu === item.name;

              const expanded = !!item.children && isOpen;

              // Expanded parents become the brand card from node 77:20880:
              // header plus its sub-items, all inside one gold panel.
              if (expanded) {
                return (
                  <div
                    key={item.name}
                    className="flex w-full items-start gap-[14px] rounded-[6px] bg-brand px-[14px] py-[8px]"
                  >
                    <span className="relative mt-[0.5px] size-[20px] shrink-0 overflow-hidden text-white">
                      <MaskIcon src={item.icon} inset={item.inset} />
                    </span>
                    <div className="flex flex-1 flex-col items-start gap-[4px]">
                      <button
                        type="button"
                        onClick={() => setOpenMenu(null)}
                        className="flex h-[21px] cursor-pointer items-center gap-[8px]"
                      >
                        <span className="text-14 font-semibold whitespace-nowrap text-white">
                          {item.name}
                        </span>
                        <span
                          aria-hidden
                          className="relative block h-[4px] w-[8px] shrink-0 -scale-y-100 text-white"
                        >
                          <MaskIcon src="/icons/sidebar/chevron.svg" inset="-16.67% -8.33%" />
                        </span>
                      </button>
                      {item.children!.map((sub) => {
                        const subActive = sub.match
                          ? active && sub.match(pathname)
                          : isRouteActive(pathname, sub.href);
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            // Fixed height so the bordered variants match the
                            // filled one — Figma strokes are inside-aligned.
                            className={`flex h-[26px] w-full items-center rounded-[5px] px-[12px] text-12 leading-[14px] font-medium whitespace-nowrap ${
                              subActive
                                ? "bg-white text-brand"
                                : "border border-white text-white"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (item.children) setOpenMenu(item.name);
                  }}
                  className={`flex w-full shrink-0 items-center rounded-[6px] px-[10px] transition-colors ${
                    active
                      ? "h-[41px] bg-brand py-[10px] font-semibold text-white"
                      : "h-[37px] py-[8px] font-normal text-muted hover:bg-black/[0.04]"
                  }`}
                >
                  <span className="flex shrink-0 items-center gap-[14px]">
                    <span className="relative size-[20px] shrink-0 overflow-hidden">
                      <MaskIcon src={item.icon} inset={item.inset} />
                    </span>
                    <span className="flex h-[21px] shrink-0 items-center gap-[8px]">
                      <span className="text-14 whitespace-nowrap">{item.name}</span>
                      {item.children && (
                        <span
                          aria-hidden
                          className="relative block h-[4px] w-[8px] shrink-0 -rotate-90"
                        >
                          <MaskIcon src="/icons/sidebar/chevron.svg" inset="-16.67% -8.33%" />
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Log out + profile */}
        <div className="flex w-full flex-col items-start gap-[12px]">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/login";
            }}
            className="flex h-[50px] w-full cursor-pointer flex-col items-start justify-center rounded-[10px] border border-solid border-muted px-[12px] text-muted transition-colors hover:bg-black/[0.04]"
          >
            <span className="flex w-full items-center justify-between">
              <span className="text-14 font-medium whitespace-nowrap">
                Log Out
              </span>
              <span className="relative size-[18px] shrink-0 overflow-hidden">
                <MaskIcon src="/icons/sidebar/logout.svg" inset="12.5% 5.89% 12.5% 12.5%" />
              </span>
            </span>
          </button>

          <div className="h-px w-[208px] shrink-0 bg-muted" />

          <div className="flex h-[48px] w-full items-center gap-[8px] rounded-[10px] pl-[10px]">
            <Image
              src="/avatar.png"
              alt="Zayn Malik"
              width={32}
              height={32}
              className="size-[32px] shrink-0 rounded-full object-cover"
            />
            <div className="flex w-[151px] flex-col items-start text-muted">
              <span className="h-[18px] truncate text-16 font-medium">
                Zayn Malik
              </span>
              <span className="h-[18px] truncate text-12">
                zaynmalik29@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
