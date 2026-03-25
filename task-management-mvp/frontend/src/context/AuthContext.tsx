import { createContext, useMemo, useState } from "react";
import { authApi } from "../api/auth.api";
import { LoginResponse, User } from "../types/api.types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("currentUser");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      login: async (email: string, password: string) => {
        const data = await authApi.login({ email, password });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setToken(data.accessToken);
        setUser(data.user);
        return data;
      },
      logout: async () => {
        await authApi.logout();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
