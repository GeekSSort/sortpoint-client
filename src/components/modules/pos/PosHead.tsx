"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * Figma: SORTPoint — POS environment head 247:13658.
 *
 * px-24 py-12 over a #eaeaea rule, a 40px semibold gold title on the left and
 * a 12px-gap pair of 40px controls on the right: a circular bell button at
 * radius 22 with a 0.5px hairline, then the avatar.
 *
 * Distinct from the dashboard Header, which runs a 42px title with a subtitle
 * underneath and carries the notification and profile menus. In the till the
 * chrome stays quiet — the page name and who is on the terminal, nothing else.
 */

function BellIcon() {
  return (
    <svg className="block size-[20px] shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5a5 5 0 0 0-5 5v2.764a2.5 2.5 0 0 1-.528 1.535l-.79 1.017A.75.75 0 0 0 4.276 14h11.448a.75.75 0 0 0 .594-1.184l-.79-1.017A2.5 2.5 0 0 1 15 10.264V7.5a5 5 0 0 0-5-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 16.25a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Route -> the 40px title. The rail and the head always agree. */
function titleForPath(pathname: string): string {
  if (pathname.startsWith("/pos/customers")) return "Customers";
  if (pathname.startsWith("/pos/products")) return "Products";
  if (pathname.startsWith("/pos/reports")) return "Reports";
  if (pathname.startsWith("/pos/discount")) return "Discount";
  if (pathname.startsWith("/pos/settings")) return "Settings";
  if (pathname.startsWith("/pos/sales")) return "Sales";
  if (pathname.startsWith("/pos/return")) return "Return";
  return "POS";
}

export default function PosHead() {
  const pathname = usePathname();

  return (
    <header className="flex w-full shrink-0 items-center justify-between border-b border-solid border-[#eaeaea] bg-white px-[24px] py-[12px]">
      <h1 className="text-[40px] leading-[1.2] font-semibold whitespace-nowrap text-[#f5b800]">
        {titleForPath(pathname)}
      </h1>

      <div className="flex shrink-0 items-center gap-[12px]">
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-[40px] cursor-pointer items-center justify-center overflow-clip rounded-[22px] border-[0.5px] border-solid border-[#eaeaea] bg-white px-[14px] py-[12px] text-[#f5b800] shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)] transition-colors hover:bg-[#fafafa]"
        >
          <BellIcon />
        </button>
        <span className="relative size-[40px] shrink-0 overflow-hidden rounded-full">
          <Image src="/sidebar/nav-avatar.png" alt="Zayn Malik" fill sizes="40px" className="object-cover" />
        </span>
      </div>
    </header>
  );
}
