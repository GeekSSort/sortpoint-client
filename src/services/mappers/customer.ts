import { CustomerRecord } from "@/types/customer";
import { toAmount } from "../apiClient";
import { formatMoney } from "@/lib/format";

/**
 * Customer -> a row in the customers table.
 *
 * The names differ on each side: the API says `code` and `current_balance`,
 * the table wants `customerId` and `dueAmount`. Without this only name and
 * phone showed, because those two happen to match.
 *
 * Orders and total spent are not on the customer at all. The caller sums them
 * from the sales list it already has.
 */

const TYPE: Record<string, CustomerRecord["type"]> = {
  RETAIL: "Regular",
  WHOLESALE: "Premium",
  VIP: "VIP",
};

export interface SalesTotals {
  orders: number;
  spent: number;
}

export function toCustomerRecord(row: any, totals?: SalesTotals): CustomerRecord {
  const due = toAmount(row?.currentBalance ?? row?.current_balance);
  const spent = totals?.spent ?? 0;
  return {
    id: String(row?.id ?? ""),
    customerId: String(row?.code || "—"),
    name: String(row?.name || "—"),
    phone: String(row?.phone || "—"),
    email: String(row?.email || "—"),
    type: TYPE[String(row?.customerType ?? row?.customer_type ?? "").toUpperCase()] ?? "Regular",
    orderCount: totals?.orders ?? 0,
    totalSpent: spent,
    totalSpentFormatted: formatMoney(spent),
    dueAmount: due,
    dueAmountFormatted: formatMoney(due),
    status: row?.isActive === false || row?.is_active === false ? "Inactive" : "Active",
  };
}

/** Sales added up per customer, for those two columns. */
export function salesTotals(sales: any[]): Map<string, SalesTotals> {
  const out = new Map<string, SalesTotals>();
  for (const sale of sales || []) {
    const key = String(sale?.customer ?? sale?.customerId ?? "");
    if (!key) continue;
    const found = out.get(key) || { orders: 0, spent: 0 };
    found.orders += 1;
    found.spent += toAmount(sale?.grandTotal ?? sale?.grand_total);
    out.set(key, found);
  }
  return out;
}
