import { InventoryProduct, InventoryQueryFilter } from "@/types/inventory";
import { initialInventoryProducts } from "@/lib/services/inventory.service";
import { apiFetch, apiList } from "./apiClient";

export interface CreateProductPayload {
  name: string;
  category: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  discount?: number;
  tax?: number;
  image?: string;
}

export class InventoryService {
  /**
   * Fetch inventory products catalog with search & filters
   */
  static async getProducts(params?: InventoryQueryFilter): Promise<{ data: InventoryProduct[]; total: number }> {
    const fallback = () => {
      let list = [...initialInventoryProducts];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }
      if (params?.category) {
        list = list.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.status) {
        list = list.filter((p) => p.status.toLowerCase() === params.status?.toLowerCase());
      }
      return {
        data: list,
        total: 50,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.category) searchParams.set("category", params.category);
    if (params?.brand) searchParams.set("brand", params.brand);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiList<InventoryProduct>(
      `/products/${qs}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Create a new inventory product
   */
  static async createProduct(payload: CreateProductPayload): Promise<InventoryProduct> {
    const fallbackProduct: InventoryProduct = {
      id: `prod-${Date.now()}`,
      index: "14",
      name: payload.name,
      image: payload.image || "/product_images/sony_headphone.png",
      category: (payload.category as any) || "Electronics",
      brand: payload.brand || "Generic",
      price: payload.sellingPrice,
      priceFormatted: `৳ ${payload.sellingPrice.toLocaleString()}`,
      stock: 100,
      sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "In Stock",
    };

    return apiFetch<InventoryProduct>(
      "/products/",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackProduct
    );
  }
}
