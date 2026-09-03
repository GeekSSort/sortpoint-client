import { NotificationItem } from "@/types/notifications";
import { apiFetch } from "./apiClient";

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

interface Paginated<T> {
  results?: T[];
  data?: { results?: T[] } | T[];
}

export class NotificationService {
  /** GET /notifications/ — newest first. */
  static async list(limit = 10): Promise<NotificationItem[]> {
    const res = await apiFetch<Paginated<NotificationItem> | NotificationItem[]>(
      `/notifications/?limit=${limit}`,
      { method: "GET" },
      fallbackNotifications
    );

    if (Array.isArray(res)) return res;
    if (Array.isArray(res.results)) return res.results;
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.results)) return res.data.results;
    return fallbackNotifications;
  }

  /** GET /notifications/unread-count/ */
  static async unreadCount(): Promise<number> {
    const res = await apiFetch<{ data?: { count?: number }; count?: number }>(
      "/notifications/unread-count/",
      { method: "GET" },
      { count: fallbackNotifications.filter((n) => !n.isRead).length }
    );
    return res?.data?.count ?? res?.count ?? 0;
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
