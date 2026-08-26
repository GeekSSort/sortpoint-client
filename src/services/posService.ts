import { ProductItem, ProductCategory, Customer, CheckoutPayload, OrderResponse } from "@/types/pos";
import { initialProductCatalog } from "@/lib/mock-pos-data";
import { apiFetch } from "./apiClient";

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
    const queryString = params.toString() ? `?${params.toString()}` : "";

    return apiFetch<ProductItem[]>(
      `/pos/products${queryString}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Fetch customer list for POS dropdown
   */
  static async getCustomers(): Promise<Customer[]> {
    return apiFetch<Customer[]>(
      "/pos/customers",
      { method: "GET" },
      fallbackCustomers
    );
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
      "/pos/checkout",
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
