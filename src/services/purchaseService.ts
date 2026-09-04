import { PurchaseRecord, PurchaseQueryFilter } from "@/types/purchases";
import { initialPurchasesData } from "@/lib/services/purchases.service";
import { apiList } from "./apiClient";
import { toPurchaseRecord } from "./mappers/purchase";

export class PurchaseService {
  /**
   * Fetch purchase history records with search & filters
   */
  static async getPurchases(params?: PurchaseQueryFilter): Promise<{ data: PurchaseRecord[]; total: number }> {
    const fallback = () => {
      let list = [...initialPurchasesData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.purchaseId.toLowerCase().includes(q) ||
            p.supplier.name.toLowerCase().includes(q) ||
            p.status.toLowerCase().includes(q) ||
            p.paymentStatus.toLowerCase().includes(q)
        );
      }
      if (params?.status) {
        list = list.filter((p) => p.status.toLowerCase() === params.status?.toLowerCase());
      }
      if (params?.paymentStatus) {
        list = list.filter((p) => p.paymentStatus.toLowerCase() === params.paymentStatus?.toLowerCase());
      }
      return {
        data: list,
        total: 50,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.paymentStatus) searchParams.set("paymentStatus", params.paymentStatus);
    if (params?.page) searchParams.set("page", String(params.page));
    // These pages filter and page in the browser, so ask for the whole
    // list rather than the API's default 20 — otherwise the pager counts
    // one page and calls it the total.
    searchParams.set("limit", String(params?.limit ?? 500));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiList<PurchaseRecord>(
      `/purchases/${qs}`,
      { method: "GET" },
      fallback,
      // Unmapped, the supplier arrives as an id under a key the table reads as
      // an object, and every column but the date comes out blank.
      (row: any) => (row?.supplier?.name !== undefined ? row : toPurchaseRecord(row))
    );
  }
}
