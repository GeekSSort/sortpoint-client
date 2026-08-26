import { SaleRecord, SalesQueryFilter } from "@/types/sales";
import { initialSalesData } from "@/lib/services/sales.service";
import { apiFetch } from "./apiClient";

export class SalesService {
  /**
   * Fetch paginated & filtered sales records
   */
  static async getSales(params?: SalesQueryFilter): Promise<{ data: SaleRecord[]; total: number }> {
    const fallback = () => {
      let result = [...initialSalesData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.customerName.toLowerCase().includes(q) ||
            s.invoiceNo.toLowerCase().includes(q) ||
            s.paymentMethod.toLowerCase().includes(q)
        );
      }
      if (params?.status) {
        result = result.filter((s) => s.status.toLowerCase() === params.status?.toLowerCase());
      }
      return {
        data: result,
        total: 50,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiFetch<{ data: SaleRecord[]; total: number }>(
      `/sales${qs}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Export sales records as CSV
   */
  static async exportSales(format: "csv" | "pdf" | "excel" = "csv"): Promise<void> {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Invoice No,Date,Customer,Total Amount,Payment Method,Status"]
        .concat(
          initialSalesData.map(
            (s) =>
              `${s.invoiceNo},${s.dateTime},${s.customerName},${s.totalAmount},${s.paymentMethod},${s.status}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
