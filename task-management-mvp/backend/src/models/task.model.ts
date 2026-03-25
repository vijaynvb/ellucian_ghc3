export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "NEW" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "CANCELLED";

export interface Task {
  taskId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
