export interface InventoryProduct {
  id: string;
  index: string;
  name: string;
  image: string;
  category: "Electronics" | "Home & Living" | "Accessories" | "Footwear" | "Bags";
  brand: string;
  price: number;
  priceFormatted: string;
  stock: number;
  sku: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface InventoryQueryFilter {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  page?: number;
  limit?: number;
}

