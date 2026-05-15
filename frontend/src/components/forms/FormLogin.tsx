import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "../../types/auth";
import { apiFetch } from "../../api/client";

const FormLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data: AuthResponse = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      console.log("Submit", data);
      if (data.mfaRequired) {
        // Pass email to MfaVerify via location state
        navigate("/mfa/verify", { state: { email: data.email } });
      } else if (data.token) {
        navigate("/mfa/setup", { state: { token: data.token } });
        console.log("Set up, token:", data.token);
      }
    } catch (err: any) {
      setError(err.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Email</label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="jane@example.com"
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Password</label>
        <input
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-2"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
};

export default FormLogin;
