"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import MetricCards from "@/components/modules/dashboard/MetricCards";
import SalesSummaryChart from "@/components/modules/dashboard/SalesSummaryChart";
import ProfitLossChart from "@/components/modules/dashboard/ProfitLossChart";
import RecentActivitiesTable from "@/components/modules/dashboard/RecentActivitiesTable";
import SalesOverviewModal from "@/components/modules/dashboard/SalesOverviewModal";
import OrderListModal from "@/components/modules/dashboard/OrderListModal";
import CustomerListModal from "@/components/modules/dashboard/CustomerListModal";
import { fetchDashboardData, initialDashboardData } from "@/lib/mock-dashboard-data";
import { DashboardResponse } from "@/types/dashboard";
import { OverviewModalType } from "@/types/overview";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse>(initialDashboardData);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<OverviewModalType>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchDashboardData();
        setData(res);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMetricCardClick = (cardId: string) => {
    if (cardId === "sales" || cardId === "revenue") {
      setActiveModal(activeModal === "sales" ? null : "sales");
    } else if (cardId === "orders") {
      setActiveModal(activeModal === "orders" ? null : "orders");
    } else if (cardId === "customers") {
      setActiveModal(activeModal === "customers" ? null : "customers");
    }
  };

  return (
    <div className="w-full space-y-5 pb-6">
      {/* Top Banner / Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
            Welcome, {data.user.name}
            <span className="text-xl inline-block animate-pulse">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        {/* Date Selector Badge */}
        <div className="self-start sm:self-auto">
          <button
            type="button"
            className="flex items-center gap-2.5 px-4 py-2 bg-[#F4B41A] hover:bg-[#E5A612] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>24 August 2026</span>
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Metric Statistics Cards (Never overlapped) */}
      <MetricCards 
        metrics={data.metrics} 
        onCardClick={handleMetricCardClick} 
      />

      {/* Lower Dashboard Section: Anchor for Docked Panels aligned with Sales Summary */}
      <div className="relative w-full">
        {/* Background Content (Charts + Recent Activities) */}
        <div className={`space-y-5 transition-all duration-300 ${activeModal ? "opacity-30 blur-[0.2px] select-none pointer-events-none" : "opacity-100"}`}>
          {/* Charts Grid Row (Sales Summary + Profit & Loss) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Sales Summary Line Chart (approx 63% width) */}
            <div className="lg:col-span-7 xl:col-span-8">
              <SalesSummaryChart data={data.salesSummary} />
            </div>

            {/* Profit & Loss Donut Chart (approx 37% width) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <ProfitLossChart data={data.profitLoss} />
            </div>
          </div>

          {/* Recent Activities Data Table */}
          <RecentActivitiesTable activities={data.recentActivities} />
        </div>

        {/* Docked Slide-over Panels: Anchored strictly within the lower section aligned with Sales Summary */}
        <SalesOverviewModal
          isOpen={activeModal === "sales"}
          onClose={() => setActiveModal(null)}
        />

        <OrderListModal
          isOpen={activeModal === "orders"}
          onClose={() => setActiveModal(null)}
        />

        <CustomerListModal
          isOpen={activeModal === "customers"}
          onClose={() => setActiveModal(null)}
        />
      </div>
    </div>
  );
}
