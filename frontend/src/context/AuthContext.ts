import { createContext } from "react";
import type { User } from "../types/auth";

interface AuthContextType {
    token: string | null
    user: User | null 
    login: (token: string, user: User) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export default AuthContext;