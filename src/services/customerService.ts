import { CustomerRecord, CustomerQueryFilter, CreateCustomerPayload } from "@/types/customer";
import { initialCustomersData } from "@/lib/services/customer.service";
import { apiFetch, apiList } from "./apiClient";

export class CustomerService {
  /**
   * Fetch customer directory with search & filters
   */
  static async getCustomers(params?: CustomerQueryFilter): Promise<{ data: CustomerRecord[]; total: number }> {
    const fallback = () => {
      let list = [...initialCustomersData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.customerId.toLowerCase().includes(q) ||
            c.phone.includes(q)
        );
      }
      if (params?.type) {
        list = list.filter((c) => c.type.toLowerCase() === params.type?.toLowerCase());
      }
      if (params?.status) {
        list = list.filter((c) => c.status.toLowerCase() === params.status?.toLowerCase());
      }
      return {
        data: list,
        total: 50,
      };
    };

    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return apiList<CustomerRecord>(
      `/customers/${qs}`,
      { method: "GET" },
      fallback
    );
  }

  /**
   * Create new customer
   */
  static async createCustomer(payload: CreateCustomerPayload): Promise<CustomerRecord> {
    const fallbackCustomer: CustomerRecord = {
      id: `cust-${Date.now()}`,
      customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: payload.name,
      phone: payload.phone,
      type: payload.type,
      orderCount: 0,
      totalSpent: 0,
      totalSpentFormatted: "৳ 0",
      dueAmount: 0,
      dueAmountFormatted: "৳ 0",
      status: payload.status || "Active",
    };

    return apiFetch<CustomerRecord>(
      "/customers/",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackCustomer
    );
  }
}
