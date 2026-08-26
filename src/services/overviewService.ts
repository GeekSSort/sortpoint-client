import { SalesOverviewItem, OrderListItem, CustomerListItem } from "@/types/overview";
import { mockSalesOverviewList, mockOrderList, mockCustomerList } from "@/lib/mock-overview-data";
import { apiFetch } from "./apiClient";

export class OverviewService {
  /**
   * Fetch CEO Overview sales list
   */
  static async getSalesOverview(): Promise<SalesOverviewItem[]> {
    return apiFetch<SalesOverviewItem[]>(
      "/ceo-overview/sales",
      { method: "GET" },
      mockSalesOverviewList
    );
  }

  /**
   * Fetch CEO Overview orders list
   */
  static async getOrders(): Promise<OrderListItem[]> {
    return apiFetch<OrderListItem[]>(
      "/ceo-overview/orders",
      { method: "GET" },
      mockOrderList
    );
  }

  /**
   * Fetch CEO Overview customers list
   */
  static async getCustomers(): Promise<CustomerListItem[]> {
    return apiFetch<CustomerListItem[]>(
      "/ceo-overview/customers",
      { method: "GET" },
      mockCustomerList
    );
  }
}
