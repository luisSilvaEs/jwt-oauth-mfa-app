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

  function login(token: string, user: User) {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
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
