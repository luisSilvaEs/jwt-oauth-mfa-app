// src/pages/OAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      login(token);
      navigate("/home", { replace: true });
    } else {
      // Spring sent an error or no token — back to login
      navigate("/login?error=" + (error ?? "oauth_failed"), { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <p className="text-gray-400 text-sm animate-pulse">Signing you in…</p>
    </div>
  );
};

export default OAuthCallback;
