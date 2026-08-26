import { TransferRecord, TransferQueryFilter } from "@/types/transfers";
import { initialTransfersData } from "@/lib/services/transfers.service";
import { apiFetch } from "./apiClient";

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
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiFetch<{ data: TransferRecord[]; total: number }>(
      `/inventory/transfers${qs}`,
      { method: "GET" },
      fallback
    );
  }
}
