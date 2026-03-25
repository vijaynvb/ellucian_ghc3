import bcrypt from "bcryptjs";
import { users } from "../data/inMemoryDb";
import { Role, User, UserStatus } from "../models/user.model";
import { AppError } from "../utils/appError";
import { buildPagination } from "../utils/pagination";

const sanitizeUser = (user: User) => ({
  userId: user.userId,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const userService = {
  list: async (query: Record<string, unknown>) => {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 20);
    const role = query.role as Role | undefined;
    const status = query.status as UserStatus | undefined;

    let filtered = [...users];
    if (role) {
      filtered = filtered.filter((item) => item.role === role);
    }
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize).map(sanitizeUser);

    return {
      data,
      pagination: buildPagination(page, pageSize, filtered.length)
    };
  },

  create: async (payload: { email: string; password: string; role: Role; status?: UserStatus }) => {
    const alreadyExists = users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase());
    if (alreadyExists) {
      throw new AppError("BAD_REQUEST", 400, "Email already exists");
    }

    const timestamp = new Date().toISOString();
    const passwordHash = await bcrypt.hash(payload.password, 10);

    const newUser: User = {
      userId: `usr_${String(users.length + 1).padStart(3, "0")}`,
      email: payload.email,
      passwordHash,
      role: payload.role,
      status: payload.status ?? "ACTIVE",
      createdAt: timestamp,
      updatedAt: timestamp
    };

    users.push(newUser);
    return sanitizeUser(newUser);
  },

  getById: async (userId: string) => {
    const user = users.find((item) => item.userId === userId);
    if (!user) {
      throw new AppError("NOT_FOUND", 404, `User with id ${userId} not found.`);
    }

    return sanitizeUser(user);
  },

  update: async (userId: string, payload: { role?: Role; status?: UserStatus }) => {
    const user = users.find((item) => item.userId === userId);
    if (!user) {
      throw new AppError("NOT_FOUND", 404, `User with id ${userId} not found.`);
    }

    if (payload.role) {
      user.role = payload.role;
    }
    if (payload.status) {
      user.status = payload.status;
    }
    user.updatedAt = new Date().toISOString();

    return sanitizeUser(user);
  }
};
