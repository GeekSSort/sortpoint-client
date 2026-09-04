import {
  DashboardResponse,
  MetricCardData,
  ProfitLossData,
  SalesDataPoint,
} from "@/types/dashboard";
import { toAmount } from "../apiClient";
import { formatCount, formatMoney, formatMoneyCompact } from "@/lib/format";

/**
 * The dashboard payload -> what the screen renders. The server sends five
 * summaries and no person, so `user` comes from whoever is signed in and the
 * metric cards are built from the summaries.
 *
 * `recentActivities` stays empty: the server has no activity feed, and sales
 * under that name would be a different list wearing its label.
 */

function metrics(sales: any, purchases: any, pnl: any): MetricCardData[] {
  const revenue = toAmount(sales?.revenue);
  const saleCount = toAmount(sales?.saleCount);
  const orders = toAmount(purchases?.purchaseCount);
  const profit = toAmount(pnl?.netProfit);

  // No comparison period comes back yet, so the trend is left neutral rather
  // than invented. A made-up "+12%" on a real dashboard is worse than none.
  const flat = { trend: "—", trendType: "up" as const, vsText: "no comparison yet" };

  return [
    { id: "revenue", title: "Total Revenue", value: formatMoneyCompact(revenue), icon: "revenue", ...flat },
    { id: "sales", title: "Total Sales", value: formatCount(saleCount), icon: "sales", ...flat },
    { id: "orders", title: "Total Orders", value: formatCount(orders), icon: "orders", ...flat },
    { id: "customers", title: "Net Profit", value: formatMoneyCompact(profit), icon: "customers", ...flat },
  ];
}

function series(byDay: any): SalesDataPoint[] {
  if (!Array.isArray(byDay)) return [];
  return byDay.map((row: any) => ({
    date: String(row?.day ?? row?.date ?? ""),
    sales: toAmount(row?.revenue ?? row?.sales),
    orders: toAmount(row?.saleCount ?? row?.orders),
  }));
}

function profitLoss(pnl: any): ProfitLossData {
  const totalRevenue = toAmount(pnl?.revenue);
  const totalExpenses = toAmount(pnl?.expenses) + toAmount(pnl?.costOfGoods);
  const netProfit = toAmount(pnl?.netProfit);
  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    // Rounded here as well as at display: a component that forgets to format
    // should still not print sixteen decimal places.
    profitMargin:
      totalRevenue > 0 ? Number((((netProfit / totalRevenue) * 100)).toFixed(2)) : 0,
    revenueFormatted: formatMoney(totalRevenue),
    expensesFormatted: formatMoney(totalExpenses),
    netProfitFormatted: formatMoney(netProfit),
  };
}

export function toDashboardResponse(
  payload: any,
  user: { name: string; email: string }
): DashboardResponse {
  const p = payload || {};
  return {
    user: { name: user.name, email: user.email },
    metrics: metrics(p.salesSummary, p.purchaseSummary, p.financePnl),
    salesSummary: series(p.salesByDay),
    profitLoss: profitLoss(p.financePnl),
    recentActivities: [],
  };
}
