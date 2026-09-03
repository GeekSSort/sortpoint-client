import React from "react";
import PosRail from "@/components/modules/pos/PosRail";
import PosHead from "@/components/modules/pos/PosHead";

/**
 * Figma: SORTPoint — POS environment 247:13582.
 *
 * A sibling of (dashboard), not a page inside it: the till owns the whole
 * window. 240 of rail against a white content column, the content scrolling
 * under a head that stays put.
 *
 * Its own rail and head, so nothing from the back office leaks in — and no
 * SidebarProvider, because that context belongs to the dashboard's drawer.
 */
export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <PosRail />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <PosHead />
        <main className="min-h-0 w-full flex-1 overflow-y-auto py-[24px] pr-[16px] pl-[24px]">
          {children}
        </main>
      </div>
    </div>
  );
}
