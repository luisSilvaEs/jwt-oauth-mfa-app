import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { apiFetch } from "../api/client";
import JwtInspector from "../components/dashboard/JwtInspector";
import type { MeResponse } from "../types/auth";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  provider: "LOCAL" | "GOOGLE" | "GITHUB";
  mfaEnabled: boolean;
  createdAt: string;
}

const Home = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    apiFetch("/user/me")
      .then((data: MeResponse) => {
        setUser(data);
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono">
      {/* Top bar */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            Auth Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-xs text-gray-500">{user.email}</span>}
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors tracking-wider uppercase"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Welcome row */}
      <div className="px-6 pt-6 pb-2">
        {loadingUser ? (
          <div className="h-7 w-48 bg-white/5 animate-pulse rounded" />
        ) : (
          <h1 className="text-lg font-semibold tracking-tight text-white/90">
            Welcome back{user?.name ? `, ${user.name}` : ""}.
          </h1>
        )}
        <p className="text-xs text-gray-600 mt-0.5">
          Live view of your authentication session.
        </p>
      </div>

      {/* Grid */}
      <main className="px-6 py-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <JwtInspector token={token} />
        </div>
      </main>
    </div>
  );
};

export default Home;
