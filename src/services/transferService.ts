import { TransferRecord, TransferQueryFilter } from "@/types/transfers";
import { initialTransfersData } from "@/lib/services/transfers.service";
import { apiList } from "./apiClient";

export class TransferService {
  /**
   * Fetch transfer records with search and filters
   */
  static async getTransfers(params?: TransferQueryFilter): Promise<{ data: TransferRecord[]; total: number }> {
    const fallback = () => {
      let list = [...initialTransfersData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (t) =>
            t.transferId.toLowerCase().includes(q) ||
            t.fromLocation.toLowerCase().includes(q) ||
            t.toLocation.toLowerCase().includes(q) ||
            t.productsSummary.toLowerCase().includes(q)
        );
      }
      if (params?.status) {
        list = list.filter((t) => t.status.toLowerCase() === params.status?.toLowerCase());
      }
      return {
        data: list,
        total: 50,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    // These pages filter and page in the browser, so ask for the whole
    // list rather than the API's default 20 — otherwise the pager counts
    // one page and calls it the total.
    searchParams.set("limit", String(params?.limit ?? 500));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiList<TransferRecord>(
      `/inventory/transfers/${qs}`,
      { method: "GET" },
      fallback
    );
  }
}
