export interface ReturnRecord {
  id: string;
  returnNo: string;
  invoiceNo: string;
  dateTime: string;
  customerName: string;
  totalAmount: number;
  totalAmountFormatted: string;
  refundAmount: number;
  refundAmountFormatted: string;
  paymentMethod: "Cash" | "bKash" | "Card" | "Bank Transfer";
  status: "Paid" | "Unpaid" | "Pending" | "Rejected";
}

export interface ReturnQueryFilter {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateReturnPayload {
  invoiceNo: string;
  customerName: string;
  refundAmount: number;
  paymentMethod: string;
  reason?: string;
}

