import { apiList, toAmount, PagedResult } from "./apiClient";

/**
 * The platform console — our own staff, reading across ALL companies, which no
 * shop-side call may do. Works only with a console token.
 */

export interface TenantRow {
  id: string;
  name: string;
  subdomain: string | null;
  plan: string | null;
  status: string | null;
  userCount: number;
  branchCount: number;
  isActive: boolean;
  createdAt: string;
}

function toTenantRow(row: any): TenantRow {
  return {
    id: String(row?.id ?? ""),
    name: String(row?.name ?? ""),
    subdomain: row?.subdomain || null,
    plan: row?.plan || null,
    status: row?.subscriptionStatus || null,
    // Through the same helper as money, so a string from a future change
    // cannot quietly become "5" + 1 = "51".
    userCount: toAmount(row?.userCount),
    branchCount: toAmount(row?.branchCount),
    isActive: row?.isActive !== false,
    createdAt: String(row?.createdAt ?? ""),
  };
}

export class PlatformService {
  static async listTenants(search?: string): Promise<PagedResult<TenantRow>> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    return apiList<TenantRow>(
      `/platform/organizations/${qs}`,
      { method: "GET" },
      undefined,
      toTenantRow
    );
  }
}
