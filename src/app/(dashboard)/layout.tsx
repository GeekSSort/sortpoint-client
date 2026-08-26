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
          <div className="w-full px-5 py-4 flex flex-col gap-5">
            <Header />
            <main className="w-full">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}