import { SaleRecord } from "@/types/sales";
import { toAmount } from "../apiClient";

/**
 * Backend Sale -> the sales table's shape. The two sides use different words,
 * not just different casing: invoice_number/invoiceNo, grand_total/totalAmount.
 *
 * `status` is the sharpest: the server's COMPLETED/CANCELLED describes the
 * document, while the table's Paid/Unpaid is a question about what is owed.
 */

const CURRENCY = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatAmount(value: number): string {
  return `৳ ${CURRENCY.format(value)}`;
}

const PAYMENT_LABELS: Record<string, SaleRecord["paymentMethod"]> = {
  CASH: "Cash",
  CARD: "Card",
  BANK: "Bank Transfer",
  MOBILE: "bKash",
};

function paymentMethodOf(row: any): SaleRecord["paymentMethod"] {
  const payments: any[] = Array.isArray(row?.payments) ? row.payments : [];
  if (payments.length === 0) return "Cash";
  // A split payment has no single method; the largest one is the honest label.
  const largest = payments.reduce((a, b) => (toAmount(b?.amount) > toAmount(a?.amount) ? b : a));
  return PAYMENT_LABELS[String(largest?.method || "").toUpperCase()] || "Cash";
}

function statusOf(row: any): SaleRecord["status"] {
  if (String(row?.status).toUpperCase() === "CANCELLED") return "Refunded";
  return toAmount(row?.dueAmount) > 0 ? "Unpaid" : "Paid";
}

export function toSaleRecord(row: any): SaleRecord {
  const total = toAmount(row?.grandTotal);
  return {
    id: String(row?.id ?? ""),
    invoiceNo: String(row?.invoiceNumber ?? ""),
    dateTime: String(row?.saleDate ?? ""),
    customerName: String(row?.customerName ?? "Walk-in Customer"),
    totalAmount: total,
    totalAmountFormatted: formatAmount(total),
    paymentMethod: paymentMethodOf(row),
    status: statusOf(row),
  };
}
