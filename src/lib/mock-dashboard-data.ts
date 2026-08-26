import { DashboardResponse } from "@/types/dashboard";

export const initialDashboardData: DashboardResponse = {
  user: {
    name: "Zayn Malik",
    email: "zaynmalik29@gmail.com",
    avatarUrl: "/image.png",
  },
  metrics: [
    {
      id: "revenue",
      title: "TOTAL REVENUE",
      value: "৳ 12,84,500",
      trend: "12.5%",
      trendType: "up",
      vsText: "vs. last month",
      icon: "revenue",
    },
    {
      id: "sales",
      title: "TOTAL SALES",
      value: "৳ 98,250",
      trend: "15.3%",
      trendType: "up",
      vsText: "vs yesterday",
      icon: "sales",
    },
    {
      id: "orders",
      title: "TOTAL ORDERS",
      value: "156",
      trend: "12.8%",
      trendType: "up",
      vsText: "vs yesterday",
      icon: "orders",
    },
    {
      id: "customers",
      title: "TOTAL CUSTOMERS",
      value: "1,248",
      trend: "8.5%",
      trendType: "up",
      vsText: "vs last month",
      icon: "customers",
    },
  ],
  salesSummary: [
    { date: "01 Aug", sales: 3400, orders: 45 },
    { date: "05 Aug", sales: 5200, orders: 62 },
    { date: "10 Aug", sales: 3800, orders: 48 },
    { date: "15 Aug", sales: 5800, orders: 75 },
    { date: "20 Aug", sales: 3900, orders: 50 },
    { date: "25 Aug", sales: 4900, orders: 65 },
    { date: "31 Aug", sales: 5400, orders: 70 },
  ],
  profitLoss: {
    totalRevenue: 425600,
    totalExpenses: 298100,
    netProfit: 127500,
    profitMargin: 29.9,
    revenueFormatted: "৳ 425,600",
    expensesFormatted: "৳ 298,100",
    netProfitFormatted: "৳ 127,500",
  },
  recentActivities: [
    {
      id: "act-1",
      activity: "New Sale",
      reference: "INV-250824-001",
      dateTime: "17 May 2026 - 10:45 AM",
      amount: 15600,
      amountFormatted: "৳ 15,600",
      status: "Delivered",
    },
    {
      id: "act-2",
      activity: "New Customer",
      reference: "CUS-250824-024",
      dateTime: "17 May 2026 - 10:45 AM",
      amount: 1999,
      amountFormatted: "৳ 1,999",
      status: "Pending",
    },
    {
      id: "act-3",
      activity: "Purchase Order",
      reference: "PO-250824-008",
      dateTime: "17 May 2026 - 10:45 AM",
      amount: 2750,
      amountFormatted: "৳ 2,750",
      status: "Process",
    },
    {
      id: "act-4",
      activity: "Sales Return",
      reference: "RTN-250824-003",
      dateTime: "17 May 2026 - 10:45 AM",
      amount: 850,
      amountFormatted: "৳ 850",
      status: "Shipping",
    },
    {
      id: "act-5",
      activity: "Expense Added",
      reference: "EXP-250824-012",
      dateTime: "17 May 2026 - 10:45 AM",
      amount: 5000,
      amountFormatted: "৳ 5,000",
      status: "Shipping",
    },
  ],
};

// Async backend fetcher simulation ready for real API / REST / GraphQL endpoints
export async function fetchDashboardData(): Promise<DashboardResponse> {
  // Can be replaced with `fetch('/api/v1/dashboard')`
  return Promise.resolve(initialDashboardData);
}

