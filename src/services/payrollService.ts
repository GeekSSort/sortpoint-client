import { PayrollRecord, PayrollQueryFilter } from "@/types/payroll";
import { initialPayrollData } from "@/lib/services/payroll.service";
import { apiList } from "./apiClient";

export class PayrollService {
  /**
   * Fetch payroll data with search & filter
   */
  static async getPayroll(params?: PayrollQueryFilter): Promise<{ data: PayrollRecord[]; total: number }> {
    const fallback = () => {
      let list = [...initialPayrollData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.employee.name.toLowerCase().includes(q) ||
            p.status.toLowerCase().includes(q)
        );
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
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiList<PayrollRecord>(
      `/hrm/payroll-runs/${qs}`,
      { method: "GET" },
      fallback
    );
  }
}
