import { SaleRecord, SalesQueryFilter } from "@/types/sales";

export const initialSalesData: SaleRecord[] = [
  {
    id: "sale-1",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-2",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-3",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-4",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-5",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-6",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-7",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-8",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-9",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 15600,
    totalAmountFormatted: "৳ 15,600",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-10",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 1999,
    totalAmountFormatted: "৳ 1,999",
    paymentMethod: "bKash",
    status: "Paid",
  },
  {
    id: "sale-11",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 2750,
    totalAmountFormatted: "৳ 2,750",
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "sale-12",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 850,
    totalAmountFormatted: "৳ 850",
    paymentMethod: "Cash",
    status: "Unpaid",
  },
  {
    id: "sale-13",
    invoiceNo: "INV-2024-00125",
    dateTime: "17 May 2026 - 10:45 AM",
    customerName: "Rahim Uddin",
    totalAmount: 5000,
    totalAmountFormatted: "৳ 5,000",
    paymentMethod: "Cash",
    status: "Paid",
  },
];

export class SalesService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

  /**
   * Fetch paginated & filtered sales records
   */
  static async getSales(params?: SalesQueryFilter): Promise<{ data: SaleRecord[]; total: number }> {
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

    return Promise.resolve({
      data: result,
      total: 50, // total count in db
    });
  }

  /**
   * Export sales report (CSV / PDF / Excel)
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

