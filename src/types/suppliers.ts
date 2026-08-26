export interface SupplierRecord {
  id: string;
  index: string;
  name: string;
  avatar: string;
  phone: string;
  mail: string;
  totalPurchases: number;
  totalPurchasesFormatted: string;
  balance: number;
  balanceFormatted: string;
  lastPurchase: string;
  status: "Active" | "Inactive";
}

export interface SupplierQueryFilter {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateSupplierPayload {
  name: string;
  phone: string;
  mail: string;
  status?: "Active" | "Inactive";
}

