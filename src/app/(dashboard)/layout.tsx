import React from "react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-[#F8F9FA] overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area filling width without arbitrary right margins */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0 bg-[#F8F9FA]">
        <div className="w-full px-5 py-4 flex flex-col gap-5">
          <Header />
          <main className="w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}