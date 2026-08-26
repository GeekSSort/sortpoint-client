export interface SaleRecord {
  id: string;
  invoiceNo: string;
  dateTime: string;
  customerName: string;
  totalAmount: number;
  totalAmountFormatted: string;
  paymentMethod: "Cash" | "bKash" | "Card" | "Bank Transfer";
  status: "Paid" | "Unpaid" | "Pending" | "Refunded";
}

export interface SalesQueryFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  status?: string;
  page?: number;
  limit?: number;
}

