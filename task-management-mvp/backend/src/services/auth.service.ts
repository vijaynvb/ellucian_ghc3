import bcrypt from "bcryptjs";
import { users } from "../data/inMemoryDb";
import { AppError } from "../utils/appError";
import { signAccessToken } from "../utils/jwt";

const sanitizeUser = (userId: string) => {
  const user = users.find((item) => item.userId === userId);
  if (!user) {
    throw new AppError("NOT_FOUND", 404, "User not found");
  }
  return {
    userId: user.userId,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const authService = {
  login: async (email: string, password: string) => {
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user || user.status !== "ACTIVE") {
      throw new AppError("BAD_REQUEST", 400, "Invalid credentials");
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new AppError("BAD_REQUEST", 400, "Invalid credentials");
    }

    return {
      accessToken: signAccessToken({ userId: user.userId, email: user.email, role: user.role }),
      tokenType: "Bearer",
      expiresInSeconds: 28800,
      user: sanitizeUser(user.userId)
    };
  },
  logout: async () => ({
    message: "Logged out successfully"
  })
};
