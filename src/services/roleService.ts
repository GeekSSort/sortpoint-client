import { SystemUserRecord, UserQueryFilter, CreateUserPayload } from "@/types/roles";
import { apiFetch, apiList, ApiError, PagedResult } from "./apiClient";
import { toSystemUser } from "./mappers/user";

/**
 * System users and the roles they hold.
 *
 * `/users/` pages but does not search, so the list is fetched once and then
 * searched, filtered and paged in the browser — the same trade the other HRM
 * tables make.
 */

export interface RoleOption {
  id: string;
  name: string;
  description?: string;
}

export class RoleService {
  static async getUsers(params?: UserQueryFilter): Promise<PagedResult<SystemUserRecord>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 8;

    const users = await apiList<any>("/users/?limit=500", { method: "GET" }, { data: [], total: 0 }, (r) => r);
    const rows = users.data.map((row: any, i: number) => toSystemUser(row, i + 1));

    const needle = params?.search?.trim().toLowerCase();
    const filtered = rows.filter((u: SystemUserRecord) => {
      if (params?.role && !u.role.toLowerCase().startsWith(params.role.toLowerCase())) return false;
      if (params?.status && u.status.toLowerCase() !== params.status.toLowerCase()) return false;
      if (!needle) return true;
      return (
        u.name.toLowerCase().includes(needle) ||
        u.mail.toLowerCase().includes(needle) ||
        u.phone.toLowerCase().includes(needle) ||
        u.role.toLowerCase().includes(needle)
      );
    });

    const offset = (page - 1) * limit;
    return {
      data: filtered.slice(offset, offset + limit),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    };
  }

  /** The roles this organization can assign. */
  static async getRoles(): Promise<RoleOption[]> {
    const roles = await apiList<RoleOption>(
      "/roles/?limit=100",
      { method: "GET" },
      { data: [], total: 0 },
      (r: any) => ({
        id: String(r?.id ?? ""),
        name: String(r?.name ?? ""),
        description: r?.description ? String(r.description) : undefined,
      })
    );
    return roles.data;
  }

  /**
   * Create a user, then mail them a link to set their own password.
   *
   * The API requires a password on create, and the form has no field for one —
   * rightly, since an administrator should never know it. A throwaway is sent
   * and immediately superseded by the invitation.
   */
  static async createUser(payload: CreateUserPayload): Promise<SystemUserRecord> {
    const created = await apiFetch<any>("/users/", {
      method: "POST",
      body: JSON.stringify({
        email: payload.mail,
        full_name: payload.name,
        phone: payload.phone,
        password: throwawayPassword(),
        roles: payload.role ? [payload.role] : [],
        is_active: payload.status !== "Inactive",
      }),
    });

    // A user who cannot be reached still exists; the list should show them.
    await apiFetch(`/users/${created?.id}/invite/`, { method: "POST", body: "{}" }).catch(
      () => undefined
    );
    return toSystemUser(created, 1);
  }

  /** Deactivating keeps the person's history; the API never deletes the row. */
  static async deactivate(id: string): Promise<void> {
    await apiFetch(`/users/${id}/`, { method: "DELETE" });
  }

  static async setRole(id: string, role: string): Promise<void> {
    await apiFetch(`/users/${id}/`, { method: "PATCH", body: JSON.stringify({ roles: [role] }) });
  }

  static async resendInvite(id: string): Promise<void> {
    await apiFetch(`/users/${id}/invite/`, { method: "POST", body: "{}" });
  }

  static describeError(error: unknown): string {
    if (error instanceof ApiError) {
      if (error.code === "PLAN_LIMIT_REACHED") return error.message;
      if (error.code === "NETWORK_ERROR") return "Cannot reach the server.";
      const field = Object.values(error.errors || {})[0];
      if (Array.isArray(field) && field.length) return String(field[0]);
      return error.message;
    }
    return "Something went wrong. Please try again.";
  }
}

/** Long, random, and never shown — the invitation replaces it. */
function throwawayPassword(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return `Sp1!${Array.from(bytes, (b) => b.toString(36)).join("")}`;
}
