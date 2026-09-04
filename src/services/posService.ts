import { ProductItem, ProductCategory, Customer, CheckoutPayload, OrderResponse } from "@/types/pos";
import { initialProductCatalog } from "@/lib/mock-pos-data";
import { apiFetch, apiList } from "./apiClient";
import { toProductItem } from "./mappers/product";

const fallbackCustomers: Customer[] = [
  { id: "cust-1", name: "Walk-in Customer", type: "Walk-in" },
  { id: "cust-2", name: "Rahim Uddin", phone: "+880 1712 345 678", type: "VIP" },
  { id: "cust-3", name: "Karim Ahmed", phone: "+880 1812 456 789", type: "Regular" },
  { id: "cust-4", name: "Tanvir Hasan", phone: "+880 1912 567 890", type: "Premium" },
];

export class PosService {
  /**
   * Fetch POS catalog products with optional category and search filters
   */
  static async getProducts(category?: ProductCategory, search?: string): Promise<ProductItem[]> {
    const fallback = () => {
      let filtered = [...initialProductCatalog];
      if (category && category !== "All Categories") {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (search && search.trim() !== "") {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }
      return filtered;
    };

    const params = new URLSearchParams();
    if (category && category !== "All Categories") params.set("category", category);
    if (search) params.set("search", search);
    params.set("limit", "60");
    const queryString = `?${params.toString()}`;

    // Two calls, because the catalogue and the stock ledger are separate
    // resources: a product says what it is, `/inventory/stock/` says how many
    // are on the shelf. Joined here on SKU so the tile can show both.
    const [products, stock, categories] = await Promise.all([
      apiList<any>(`/products/${queryString}`, { method: "GET" }, undefined, (r) => r),
      apiList<any>("/inventory/stock/?limit=200", { method: "GET" }, undefined, (r) => r).catch(
        () => ({ data: [] as any[] })
      ),
      // A product names its category by id only, so the tiles would read as
      // UUIDs and the category filter would match nothing.
      apiList<any>("/categories/?limit=100", { method: "GET" }, undefined, (r) => r).catch(
        () => ({ data: [] as any[] })
      ),
    ]);

    if (!products?.data?.length) return fallback();

    const stockBySku = new Map<string, number>();
    for (const row of stock.data || []) {
      const sku = String(row?.sku ?? "");
      if (!sku) continue;
      stockBySku.set(sku, (stockBySku.get(sku) ?? 0) + Number(row?.available ?? 0));
    }

    const categoryNames = new Map<string, string>();
    for (const c of categories.data || []) {
      if (c?.id) categoryNames.set(String(c.id), String(c.name ?? ""));
    }

    return products.data.map((row: any) => toProductItem(row, { stockBySku, categoryNames }));
  }

  /**
   * Fetch customer list for POS dropdown
   */
  static async getCustomers(): Promise<Customer[]> {
    const res = await apiList<Customer>(
      "/customers/?limit=100",
      { method: "GET" },
      { data: fallbackCustomers, total: fallbackCustomers.length },
      (row: any) => ({
        id: String(row?.id ?? ""),
        name: String(row?.name ?? ""),
        phone: row?.phone || undefined,
        type: (String(row?.customerType || "").toUpperCase() === "VIP"
          ? "VIP"
          : "Regular") as Customer["type"],
      })
    );

    // A till always needs a way to sell to somebody who is not on file.
    return [{ id: "", name: "Walk-in Customer", type: "Walk-in" }, ...res.data];
  }

  /**
   * Submit checkout transaction
   */
  static async checkout(payload: CheckoutPayload): Promise<OrderResponse> {
    const fallbackResponse: OrderResponse = {
      success: true,
      orderId: `ORD-${Date.now()}`,
      invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      message: "Order placed successfully!",
      timestamp: new Date().toISOString(),
    };

    return apiFetch<OrderResponse>(
      "/sales/",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackResponse
    );
  }

  /**
   * Alias for checkout
   */
  static async createOrder(payload: CheckoutPayload): Promise<OrderResponse> {
    return this.checkout(payload);
  }
}
