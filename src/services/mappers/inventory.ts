import { InventoryProduct } from "@/types/inventory";
import { StockItem } from "@/types/stock";
import { toAmount } from "../apiClient";
import { formatMoney } from "@/lib/format";

/**
 * Catalogue and stock rows -> the inventory tables.
 *
 * Both were rendering raw API rows, so category and brand showed as uuids and
 * price, stock, SKU and status were blank. Price and SKU live on the default
 * VARIANT, not the product; on-hand quantity lives in `/inventory/stock/` and
 * is joined on SKU.
 */

/** Below this many units a line reads as running out. */
const LOW_STOCK = 10;

function statusFor(available: number, reorder: number): StockItem["status"] {
  if (available <= 0) return "Out of Stock";
  return available <= Math.max(reorder, LOW_STOCK) ? "Low Stock" : "In Stock";
}

export interface Lookups {
  categories?: Map<string, string>;
  brands?: Map<string, string>;
  stockBySku?: Map<string, number>;
}

export function toInventoryProduct(row: any, index: number, lookups: Lookups = {}): InventoryProduct {
  const variants: any[] = Array.isArray(row?.variants) ? row.variants : [];
  const variant = variants.find((v) => v?.isDefault) || variants[0] || {};
  const sku = String(variant?.sku ?? "—");
  const price = toAmount(variant?.price);
  const stock = toAmount(lookups.stockBySku?.get(sku) ?? 0);

  const images: any[] = Array.isArray(row?.images) ? row.images : [];
  const ready = images.filter((i) => !i?.status || i.status === "READY");
  const primary = ready.find((i) => i?.isPrimary) ?? ready[0];
  const raw = String(primary?.url ?? primary ?? "");

  return {
    id: String(row?.id ?? ""),
    index: String(index).padStart(2, "0"),
    name: String(row?.name || "—"),
    // Some filenames contain spaces; unencoded they break the request.
    image: raw ? encodeURI(raw) : "",
    // The UI type names five categories, the catalogue has twenty. The real
    // name is carried through and the table filters on it as a string.
    category: (lookups.categories?.get(String(row?.category ?? "")) ||
      "Uncategorised") as InventoryProduct["category"],
    brand: lookups.brands?.get(String(row?.brand ?? "")) || "—",
    price,
    priceFormatted: price > 0 ? formatMoney(price, { decimals: 2 }) : "No price",
    stock,
    sku,
    status: statusFor(stock, toAmount(row?.reorderLevel ?? row?.reorder_level)),
  };
}

export function toStockItem(row: any): StockItem {
  const available = toAmount(row?.available);
  const reorder = toAmount(row?.reorderLevel ?? row?.reorder_level);
  return {
    id: String(row?.id ?? ""),
    name: String(row?.productName ?? row?.product_name ?? "—"),
    image: "",
    sku: String(row?.sku || "—"),
    // The warehouse comes back as an id and a code; the code is the readable one.
    warehouse: String(row?.warehouseCode ?? row?.warehouse_code ?? "—"),
    available,
    reserved: toAmount(row?.reservedQuantity ?? row?.reserved_quantity),
    lowStock: reorder || LOW_STOCK,
    status: statusFor(available, reorder),
  };
}

/** id -> name, for the lookup tables the product rows point at. */
export function namesById(rows: any[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const row of rows || []) {
    if (row?.id) out.set(String(row.id), String(row?.name ?? ""));
  }
  return out;
}

/** SKU -> units on hand, summed over warehouses. */
export function stockBySku(rows: any[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const row of rows || []) {
    const sku = String(row?.sku ?? "");
    if (!sku) continue;
    out.set(sku, (out.get(sku) ?? 0) + toAmount(row?.available));
  }
  return out;
}
