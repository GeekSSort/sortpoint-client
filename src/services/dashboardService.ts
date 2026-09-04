import { DashboardResponse, MetricCardData, SalesDataPoint, RecentActivityItem } from "@/types/dashboard";
import { initialDashboardData } from "@/lib/mock-dashboard-data";
import { apiFetch } from "./apiClient";
import { toDashboardResponse } from "./mappers/dashboard";
import { AuthService } from "./authService";

export { initialDashboardData };

export class DashboardService {
  /**
   * Fetch complete aggregated dashboard data
   */
  static async getDashboardData(): Promise<DashboardResponse> {
    // The endpoint returns figures only — five summaries, no person and no
    // metric cards. `toDashboardResponse` turns them into what the screen
    // renders, and the greeting comes from whoever is signed in.
    const [payload, user] = await Promise.all([
      apiFetch<any>("/dashboard/", { method: "GET" }, null),
      AuthService.getCurrentUser().catch(() => ({ greeting: "there", email: "" })),
    ]);

    if (!payload) return initialDashboardData;
    // The greeting, not the full name — the heading reads "Welcome, ___".
    return toDashboardResponse(payload, { name: user.greeting, email: user.email });
  }

  /**
   * The pieces of the dashboard, read from the one bundle the server returns.
   *
   * `/dashboard/metrics`, `/dashboard/sales-summary` and
   * `/dashboard/recent-activities` were called here and none of them exist.
   * Rather than three dead URLs, these now slice the bundle — one round trip,
   * and no call that cannot succeed.
   */
  static async getMetrics(): Promise<MetricCardData[]> {
    return (await DashboardService.getDashboardData()).metrics;
  }

  static async getSalesSummary(): Promise<SalesDataPoint[]> {
    return (await DashboardService.getDashboardData()).salesSummary;
  }

  /**
   * Always empty for now: the server has no activity feed at all. Returning
   * sales under this name would be a different list wearing its label.
   */
  static async getRecentActivities(): Promise<RecentActivityItem[]> {
    return [];
  }
}
