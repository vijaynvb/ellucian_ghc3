import bcrypt from "bcryptjs";
import { Category } from "../models/category.model";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";

const now = new Date().toISOString();
const defaultPasswordHash = bcrypt.hashSync("password", 10);

export const users: User[] = [
  {
    userId: "usr_001",
    email: "admin@example.com",
    passwordHash: defaultPasswordHash,
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now
  },
  {
    userId: "usr_002",
    email: "user@example.com",
    passwordHash: defaultPasswordHash,
    role: "END_USER",
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now
  }
];

export const tasks: Task[] = [];

export const categories: Category[] = [
  {
    categoryId: "cat_1001",
    name: "Work",
    description: "Tasks related to work projects and deliverables.",
    isActive: true,
    createdAt: now,
    updatedAt: now
  },
  {
    categoryId: "cat_1002",
    name: "Personal",
    description: "Personal errands and growth goals.",
    isActive: true,
    createdAt: now,
    updatedAt: now
  },
  {
    categoryId: "cat_1003",
    name: "Others",
    description: "Miscellaneous tasks that do not fit other categories.",
    isActive: true,
    createdAt: now,
    updatedAt: now
  }
];
