//frontend/src/context/AuthContext.ts
import { createContext } from "react";
import type { User } from "../types/auth";

interface AuthContextType {
    token: string | null
    user: User | null 
    login: (token: string) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export default AuthContext;