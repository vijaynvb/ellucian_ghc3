export type Role = "END_USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
