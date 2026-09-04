import { SupplierRecord, SupplierQueryFilter, CreateSupplierPayload } from "@/types/suppliers";
import { initialSuppliersData } from "@/lib/services/suppliers.service";
import { apiFetch, apiList } from "./apiClient";

export class SupplierService {
  /**
   * Fetch suppliers with search & filters
   */
  static async getSuppliers(params?: SupplierQueryFilter): Promise<{ data: SupplierRecord[]; total: number }> {
    const fallback = () => {
      let list = [...initialSuppliersData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.phone.includes(q) ||
            s.mail.toLowerCase().includes(q)
        );
      }
      if (params?.status) {
        list = list.filter((s) => s.status.toLowerCase() === params.status?.toLowerCase());
      }
      return {
        data: list,
        total: list.length,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiList<SupplierRecord>(
      `/suppliers/${qs}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Create a new supplier
   */
  static async createSupplier(payload: CreateSupplierPayload): Promise<SupplierRecord> {
    // No backend yet: keep the new supplier in the in-memory list so the add
    // flow actually round-trips (create -> redirect -> it's in the table).
    const fallbackSupplier = (): SupplierRecord => {
      const record: SupplierRecord = {
        id: `sup-${Date.now()}`,
        index: String(initialSuppliersData.length + 1).padStart(2, "0"),
        name: payload.name,
        avatar: "/image.png",
        phone: payload.phone,
        mail: payload.mail,
        totalPurchases: 0,
        totalPurchasesFormatted: "৳ 0",
        balance: 0,
        balanceFormatted: "৳ 0",
        lastPurchase: "Today",
        status: payload.status || "Active",
      };
      initialSuppliersData.push(record);
      return record;
    };

    return apiFetch<SupplierRecord>(
      "/suppliers/",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackSupplier
    );
  }
}
