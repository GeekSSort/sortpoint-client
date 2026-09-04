import { CustomerRecord } from "@/types/customer";
import { toAmount } from "../apiClient";
import { formatMoney } from "@/lib/format";

/**
 * Customer -> a row in the customers table.
 *
 * The API names the customer's code `code` and their debt `current_balance`;
 * the table asks for `customerId` and `dueAmount`. Unmapped, only the two
 * fields whose names collide (name, phone) ever showed.
 *
 * Order count and total spent are not on the customer resource — they are
 * summed from `/sales/` by the caller, which already holds that list.
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

/** Sales summed per customer id, for the two columns they feed. */
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
