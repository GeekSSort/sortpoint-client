import { StockItem, StockQueryFilter } from "@/types/stock";
import { initialStockData } from "@/lib/services/stock.service";
import { apiFetch, apiList } from "./apiClient";

export interface AddStockPayload {
  productName: string;
  sku: string;
  warehouse: string;
  currentStock: number;
  addQuantity: number;
  date?: string;
}

export class StockService {
  /**
   * Fetch stock inventory with search & filter
   */
  static async getStock(params?: StockQueryFilter): Promise<{ data: StockItem[]; total: number }> {
    const fallback = () => {
      let list = [...initialStockData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.sku.toLowerCase().includes(q) ||
            s.warehouse.toLowerCase().includes(q)
        );
      }
      if (params?.status) {
        list = list.filter((s) => s.status.toLowerCase() === params.status?.toLowerCase());
      }
      return {
        data: list,
        total: 50,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.warehouse) searchParams.set("warehouse", params.warehouse);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiList<StockItem>(
      `/inventory/stock/${qs}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Add stock quantity to a product
   */
  static async addStock(payload: AddStockPayload): Promise<StockItem> {
    const fallbackStock: StockItem = {
      id: `stock-${Date.now()}`,
      name: payload.productName,
      image: "/product_images/sony_headphone.png",
      sku: payload.sku,
      warehouse: payload.warehouse,
      available: payload.currentStock + payload.addQuantity,
      reserved: 0,
      lowStock: 10,
      status: "In Stock",
    };

    return apiFetch<StockItem>(
      "/inventory/adjustments/",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackStock
    );
  }
}
