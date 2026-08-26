export interface CustomerRecord {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  type: "Regular" | "VIP" | "Premium";
  orderCount: number;
  totalSpent: number;
  totalSpentFormatted: string;
  dueAmount: number;
  dueAmountFormatted: string;
  status: "Active" | "Inactive";
}

export interface CustomerQueryFilter {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  type: "Regular" | "VIP" | "Premium";
  status?: "Active" | "Inactive";
}

