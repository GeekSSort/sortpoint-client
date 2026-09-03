import React from "react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import { SidebarProvider } from "@/components/shared/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-[#F8F9FA] overflow-hidden">
        {/* Fixed/Collapsible Sidebar */}
        <Sidebar />

        {/* Main Content Area filling whole width when minimized */}
        <div className="flex flex-1 flex-col overflow-y-auto min-w-0 bg-[#F8F9FA] transition-all duration-300">
          {/* Full-bleed: the navbar owns its own 24px gutters (Figma 30:15360). */}
          <Header />
          <main className="w-full flex flex-col p-[16px] gap-[24px] sm:p-[24px]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}