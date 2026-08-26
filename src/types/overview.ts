export interface SalesOverviewItem {
  id: string;
  invoiceNo: string;
  dateTime: string;
  customer: string;
  totalAmount: number;
  totalAmountFormatted: string;
  paymentMethod: "Cash" | "bKash" | "Card" | "Bank Transfer";
  status: "Paid" | "Unpaid";
}

export interface OrderListItem {
  id: string;
  purchaseId: string;
  supplier: {
    name: string;
    avatarUrl?: string;
  };
  purchaseDate: string;
  items: number;
  totalAmount: number;
  totalAmountFormatted: string;
  paymentStatus: "Paid" | "Due";
  status: "Received" | "Pending";
}

export interface CustomerListItem {
  id: string;
  customerId: string;
  customer: string;
  phone: string;
  type: "Regular" | "VIP" | "Premium";
  order: number;
  totalSpent: number;
  totalSpentFormatted: string;
  due: number;
  dueFormatted: string;
  status: "Active" | "Inactive";
}

export type OverviewModalType = "sales" | "orders" | "customers" | "revenue" | null;

