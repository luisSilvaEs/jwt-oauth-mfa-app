//frontend/src/context/AuthProvider.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [user, setUser] = useState<User | null>(null);

  function login(token: string) {
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    setUser({
      email: payload.sub,
      provider: payload.provider ?? "LOCAL",
      mfaEnabled: payload.mfaEnabled ?? false,
    });
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
