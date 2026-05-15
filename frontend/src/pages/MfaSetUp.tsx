import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../api/client";
import type { MfaSetupResponse } from "../types/auth";

const MfaSetup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = (location.state as { token: string })?.token;

  // Redirect to login if no email in state
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  const [step, setStep] = useState<"loading" | "scan" | "verify" | "done">(
    "loading",
  );
  const [setup, setSetup] = useState<MfaSetupResponse | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("token", token);
    apiFetch("/auth/mfa/setup", { method: "POST" })
      .then((data: MfaSetupResponse) => {
        setSetup(data);
        setStep("scan");
      })
      .catch(() =>
        setError("Failed to initialize MFA setup. Please try again."),
      );
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch("/auth/mfa/verify-setup", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      console.info(res);
      setStep("done");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <svg
              className="w-7 h-7 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-2.283-.639-4.42-1.752-6.246"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Set up two-factor auth
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Secure your account with Microsoft Authenticator
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Step indicator */}
          <div className="flex border-b border-gray-800">
            {["Scan QR", "Verify"].map((label, i) => {
              const active =
                (i === 0 && (step === "scan" || step === "loading")) ||
                (i === 1 && (step === "verify" || step === "done"));
              return (
                <div
                  key={label}
                  className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${active ? "text-indigo-400 border-b-2 border-indigo-500" : "text-gray-500"}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] mr-1.5 ${active ? "bg-indigo-500/20 text-indigo-400" : "bg-gray-800 text-gray-500"}`}
                  >
                    {i + 1}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>

          <div className="p-6">
            {/* Loading */}
            {step === "loading" && (
              <div className="flex flex-col items-center py-8 gap-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">
                  Generating your setup code…
                </p>
              </div>
            )}

            {/* Scan Step */}
            {step === "scan" && setup && (
              <div className="flex flex-col items-center gap-5">
                <p className="text-sm text-gray-400 text-center">
                  Open{" "}
                  <span className="text-white font-medium">
                    Microsoft Authenticator
                  </span>
                  , tap the <span className="text-white font-medium">+</span>{" "}
                  button and scan this QR code.
                </p>

                {/* QR Code */}
                <div className="p-3 bg-white rounded-xl">
                  <img
                    src={setup.qrCode}
                    alt="MFA QR Code"
                    className="w-48 h-48"
                  />
                </div>

                {/* Manual entry fallback */}
                <details className="w-full">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors text-center">
                    Can't scan? Enter manually
                  </summary>
                  <div className="mt-3 bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                    <code className="text-xs text-indigo-300 font-mono break-all">
                      {setup.secret}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(setup.secret)
                      }
                      className="shrink-0 text-gray-400 hover:text-white transition-colors"
                      title="Copy secret"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.637c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                        />
                      </svg>
                    </button>
                  </div>
                </details>

                <button
                  onClick={() => setStep("verify")}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  I've scanned it →
                </button>
              </div>
            )}

            {/* Verify Step */}
            {step === "verify" && (
              <form onSubmit={handleVerify} className="flex flex-col gap-5">
                <p className="text-sm text-gray-400 text-center">
                  Enter the{" "}
                  <span className="text-white font-medium">6-digit code</span>{" "}
                  shown in your authenticator app.
                </p>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  autoFocus
                  className="w-full text-center text-3xl font-mono tracking-[0.5em] bg-gray-800 border border-gray-700 focus:border-indigo-500 rounded-xl py-4 text-white outline-none transition-colors placeholder:text-gray-600"
                />

                {error && (
                  <p className="text-xs text-red-400 text-center">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("scan");
                      setError(null);
                      setCode("");
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={code.length !== 6 || loading}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                  >
                    {loading ? "Verifying…" : "Confirm"}
                  </button>
                </div>
              </form>
            )}

            {/* Success */}
            {step === "done" && (
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">MFA enabled!</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Redirecting to your dashboard…
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        {(step === "scan" || step === "verify") && (
          <p className="text-center text-xs text-gray-600 mt-5">
            <button
              onClick={() => navigate("/home")}
              className="hover:text-gray-400 transition-colors"
            >
              Skip for now
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default MfaSetup;
