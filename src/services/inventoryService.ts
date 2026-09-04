import { InventoryProduct, InventoryQueryFilter } from "@/types/inventory";
import { initialInventoryProducts } from "@/lib/services/inventory.service";
import { apiFetch, apiList, apiListAll } from "./apiClient";
import { namesById, stockBySku, toInventoryProduct } from "./mappers/inventory";

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
    // These pages filter and page in the browser, so ask for the whole
    // list rather than the API's default 20 — otherwise the pager counts
    // one page and calls it the total.
    searchParams.set("limit", String(params?.limit ?? 500));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    // Price and SKU live on the default variant, the category and brand are
    // ids, and on-hand quantity is a different resource keyed by SKU.
    const [rows, categories, brands, stock] = await Promise.all([
      apiList<any>(`/products/${qs}`, { method: "GET" }, fallback, (r) => r),
      apiList<any>("/categories/?limit=200", { method: "GET" }, { data: [], total: 0 }, (r) => r)
        .catch(() => ({ data: [] as any[] })),
      apiList<any>("/brands/?limit=200", { method: "GET" }, { data: [], total: 0 }, (r) => r)
        .catch(() => ({ data: [] as any[] })),
      // Every page: one call returns 200 rows at most, and the SKUs it misses
      // would read as zero stock on a shelf that is full.
      apiListAll<any>("/inventory/stock/", (r) => r).catch(() => [] as any[]),
    ]);

    // Already-mapped fallback rows carry `priceFormatted`; nothing to map.
    if (rows.data[0]?.priceFormatted !== undefined) {
      return rows as { data: InventoryProduct[]; total: number };
    }

    const lookups = {
      categories: namesById(categories.data),
      brands: namesById(brands.data),
      stockBySku: stockBySku(stock),
    };
    return {
      data: rows.data.map((row: any, i: number) => toInventoryProduct(row, i + 1, lookups)),
      total: rows.total,
    };
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
