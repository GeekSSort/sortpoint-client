import { ReturnRecord, ReturnQueryFilter, CreateReturnPayload } from "@/types/returns";
import { initialReturnsData } from "@/lib/services/returns.service";
import { apiFetch, apiList } from "./apiClient";

export class ReturnService {
  /**
   * Fetch returns with search and filters
   */
  static async getReturns(params?: ReturnQueryFilter): Promise<{ data: ReturnRecord[]; total: number }> {
    const fallback = () => {
      let list = [...initialReturnsData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.customerName.toLowerCase().includes(q) ||
            r.invoiceNo.toLowerCase().includes(q) ||
            r.returnNo.toLowerCase().includes(q)
        );
      }
      if (params?.status) {
        list = list.filter((r) => r.status.toLowerCase() === params.status?.toLowerCase());
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

    return apiList<ReturnRecord>(
      `/returns${qs}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Process refund and record return
   */
  static async processRefund(payload: CreateReturnPayload): Promise<ReturnRecord> {
    const fallbackRecord: ReturnRecord = {
      id: `ret-${Date.now()}`,
      returnNo: `RET-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceNo: payload.invoiceNo,
      dateTime: "Just now",
      customerName: payload.customerName,
      totalAmount: payload.refundAmount,
      totalAmountFormatted: `৳ ${payload.refundAmount.toLocaleString()}`,
      refundAmount: payload.refundAmount,
      refundAmountFormatted: `৳ ${payload.refundAmount.toLocaleString()}`,
      paymentMethod: (payload.paymentMethod as any) || "Cash",
      status: "Paid",
    };

    return apiFetch<ReturnRecord>(
      "/returns/refund",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackRecord
    );
  }
}
