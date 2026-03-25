export type Role = "END_USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "NEW" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "CANCELLED";

export interface User {
  userId: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  taskId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  categoryId: string | null;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface Category {
  categoryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TaskListResponse {
  data: Task[];
  pagination: PaginationMeta;
}

export interface CategoryListResponse {
  data: Category[];
  pagination: PaginationMeta;
}

export interface UserListResponse {
  data: User[];
  pagination: PaginationMeta;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: User;
}
