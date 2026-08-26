import { SystemUserRecord, UserQueryFilter, CreateUserPayload } from "@/types/roles";
import { initialSystemUsersData } from "@/lib/services/roles.service";
import { apiFetch } from "./apiClient";

export class RoleService {
  /**
   * Fetch system users & roles with search & filter
   */
  static async getUsers(params?: UserQueryFilter): Promise<{ data: SystemUserRecord[]; total: number }> {
    const fallback = () => {
      let list = [...initialSystemUsersData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.phone.includes(q) ||
            u.mail.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        );
      }
      if (params?.role) {
        list = list.filter((u) => u.role.toLowerCase() === params.role?.toLowerCase());
      }
      if (params?.status) {
        list = list.filter((u) => u.status.toLowerCase() === params.status?.toLowerCase());
      }
      return {
        data: list,
        total: 50,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.role) searchParams.set("role", params.role);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiFetch<{ data: SystemUserRecord[]; total: number }>(
      `/users${qs}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Create new user and assign role
   */
  static async createUser(payload: CreateUserPayload): Promise<SystemUserRecord> {
    const fallbackUser: SystemUserRecord = {
      id: `usr-${Date.now()}`,
      index: "14",
      name: payload.name,
      avatar: "/image.png",
      phone: payload.phone,
      mail: payload.mail,
      role: payload.role,
      lastLogin: "Just now",
      status: payload.status || "Active",
    };

    return apiFetch<SystemUserRecord>(
      "/users",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackUser
    );
  }
}
