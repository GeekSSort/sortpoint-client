export interface StockItem {
  id: string;
  name: string;
  image: string;
  sku: string;
  warehouse: string;
  available: number;
  reserved: number;
  lowStock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface StockQueryFilter {
  search?: string;
  warehouse?: string;
  status?: string;
  page?: number;
  limit?: number;
}

