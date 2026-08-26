import { DashboardResponse, MetricCardData, SalesDataPoint, RecentActivityItem } from "@/types/dashboard";
import { initialDashboardData } from "@/lib/mock-dashboard-data";
import { mockCustomerList, mockOrderList, mockSalesOverviewList } from "@/lib/mock-overview-data";
import { apiFetch } from "./apiClient";

export { initialDashboardData };

export class DashboardService {
  /**
   * Fetch complete aggregated dashboard data
   */
  static async getDashboardData(): Promise<DashboardResponse> {
    return apiFetch<DashboardResponse>(
      "/dashboard",
      { method: "GET" },
      initialDashboardData
    );
  }

  /**
   * Fetch dashboard key metrics
   */
  static async getMetrics(): Promise<MetricCardData[]> {
    return apiFetch<MetricCardData[]>(
      "/dashboard/metrics",
      { method: "GET" },
      initialDashboardData.metrics
    );
  }

  /**
   * Fetch sales trend chart dataset
   */
  static async getSalesSummary(): Promise<SalesDataPoint[]> {
    return apiFetch<SalesDataPoint[]>(
      "/dashboard/sales-summary",
      { method: "GET" },
      initialDashboardData.salesSummary
    );
  }

  /**
   * Fetch recent activity log / transactions
   */
  static async getRecentActivities(): Promise<RecentActivityItem[]> {
    return apiFetch<RecentActivityItem[]>(
      "/dashboard/recent-activities",
      { method: "GET" },
      initialDashboardData.recentActivities
    );
  }

  /**
   * Fetch customer breakdown list for modal
   */
  static async getCustomerListModal() {
    return apiFetch(
      "/dashboard/customers-modal",
      { method: "GET" },
      mockCustomerList
    );
  }

  /**
   * Fetch order breakdown list for modal
   */
  static async getOrderListModal() {
    return apiFetch(
      "/dashboard/orders-modal",
      { method: "GET" },
      mockOrderList
    );
  }

  /**
   * Fetch sales overview list for modal
   */
  static async getSalesOverviewModal() {
    return apiFetch(
      "/dashboard/sales-overview-modal",
      { method: "GET" },
      mockSalesOverviewList
    );
  }
}
