export interface TransferRecord {
  id: string;
  transferId: string;
  fromLocation: string;
  toLocation: string;
  productsSummary: string;
  quantity: number;
  dateTime: string;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Completed" | "Pending";
}

export interface TransferQueryFilter {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

