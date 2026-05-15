import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import useAuth from "../../hooks/useAuth";
import type { AuthResponse } from "../../types/auth";

interface MfaVerifyForm {
  email: string;
}

const MfaVerify = ({ email }: MfaVerifyForm) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) return;
    setError(null);
    setLoading(true);
    try {
      const data: AuthResponse = await apiFetch("/auth/mfa-login", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      login(data.token!);
      navigate("/home");
    } catch (err: any) {
      setError("Invalid code. Try again.");
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      {/* 6-digit input */}
      <div className="flex gap-2 justify-center mb-8" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-xl font-bold bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors caret-transparent"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading || digits.join("").length < 6}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
      >
        {loading ? "Verifying…" : "Verify"}
      </button>
    </form>
  );
};

export default MfaVerify;
