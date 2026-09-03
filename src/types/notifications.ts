export interface NotificationItem {
  id: string;
  event: string;
  title: string;
  message: string;
  entityType: string;
  entityId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
