import { NotificationItem } from "@/types/notifications";
import { apiFetch, apiList } from "./apiClient";

/** Shown when /notifications is unreachable, matching the rest of the app's fallback strategy. */
const fallbackNotifications: NotificationItem[] = [
  {
    id: "n-1",
    event: "stock.low",
    title: "Low stock alert",
    message: "Wireless Mouse is down to 4 units.",
    entityType: "product",
    entityId: null,
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    id: "n-2",
    event: "sale.completed",
    title: "New sale recorded",
    message: "Invoice #INV-2043 for ৳ 4,250 was completed.",
    entityType: "sale",
    entityId: null,
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "n-3",
    event: "purchase.received",
    title: "Purchase received",
    message: "PO-0189 from Rahman Traders was marked received.",
    entityType: "purchase",
    entityId: null,
    isRead: true,
    readAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
];

export class NotificationService {
  /** Newest first. The API returns the standard paginated envelope. */
  static async list(limit = 10): Promise<NotificationItem[]> {
    const res = await apiList<NotificationItem>(
      `/notifications/?limit=${limit}`,
      { method: "GET" },
      { data: fallbackNotifications, total: fallbackNotifications.length }
    );
    return res.data;
  }

  static async unreadCount(): Promise<number> {
    const res = await apiFetch<{ count?: number }>("/notifications/unread-count/", {
      method: "GET",
    });
    return Number(res?.count ?? 0);
  }

  /** POST /notifications/mark-read/ */
  static async markRead(ids: string[]): Promise<{ success: boolean }> {
    if (ids.length === 0) return { success: true };
    return apiFetch<{ success: boolean }>(
      "/notifications/mark-read/",
      { method: "POST", body: JSON.stringify({ notification_ids: ids }) },
      { success: true }
    );
  }
}
