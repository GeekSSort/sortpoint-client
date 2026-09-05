import { SupplierRecord } from "@/types/suppliers";
import { toAmount } from "../apiClient";
import { formatMoney } from "@/lib/format";

/**
 * Supplier -> a row in the suppliers table.
 *
 * Rows used to go to the table straight from the API, so only name and phone
 * showed — the two names that happen to match — and every money column was
 * blank.
 *
 * Total purchases and the last purchase date are not on the supplier. The
 * caller sums them from the purchase list it already has.
 */

export interface PurchaseTotals {
  total: number;
  lastDate: string;
}

export function toSupplierRecord(
  row: any,
  index: number,
  totals?: PurchaseTotals
): SupplierRecord {
  const balance = toAmount(row?.currentBalance ?? row?.current_balance);
  const purchases = totals?.total ?? 0;
  return {
    id: String(row?.id ?? ""),
    index: String(index).padStart(2, "0"),
    name: String(row?.name || "—"),
    // No supplier logo on the server; the table draws initials.
    avatar: "",
    phone: String(row?.phone || "—"),
    mail: String(row?.email || "—"),
    totalPurchases: purchases,
    totalPurchasesFormatted: formatMoney(purchases),
    balance,
    balanceFormatted: formatMoney(balance),
    lastPurchase: totals?.lastDate || "—",
    status: row?.isActive === false || row?.is_active === false ? "Inactive" : "Active",
  };
}

/** Purchases added up per supplier, for those two columns. */
export function purchaseTotals(purchases: any[]): Map<string, PurchaseTotals> {
  const out = new Map<string, PurchaseTotals>();
  for (const p of purchases || []) {
    const key = String(p?.supplier ?? p?.supplierId ?? "");
    if (!key) continue;
    const date = String(p?.purchaseDate ?? p?.purchase_date ?? "");
    const found = out.get(key) || { total: 0, lastDate: "" };
    found.total += toAmount(p?.grandTotal ?? p?.grand_total);
    if (date > found.lastDate) found.lastDate = date;
    out.set(key, found);
  }
  return out;
}
