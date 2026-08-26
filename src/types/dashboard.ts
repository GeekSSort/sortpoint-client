export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendType: "up" | "down";
  vsText: string;
  icon: "revenue" | "sales" | "orders" | "customers";
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface ProfitLossData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueFormatted: string;
  expensesFormatted: string;
  netProfitFormatted: string;
}

export type ActivityStatus = "Delivered" | "Pending" | "Process" | "Shipping" | "Cancelled";

export interface RecentActivityItem {
  id: string;
  activity: string;
  reference: string;
  dateTime: string;
  amount: number;
  amountFormatted: string;
  status: ActivityStatus;
}

export interface DashboardResponse {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  metrics: MetricCardData[];
  salesSummary: SalesDataPoint[];
  profitLoss: ProfitLossData;
  recentActivities: RecentActivityItem[];
}

