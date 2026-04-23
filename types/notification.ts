export type NotificationType = "Urgent_Request" | "Task_Assigned" | "Task_Update" | "Shortage_Alert" | "System_Alert";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedEntityType?: "Request" | "Task" | "Shortage" | "User";
  relatedEntityId?: string;
}
