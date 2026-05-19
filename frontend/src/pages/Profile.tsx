import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { apiFetch } from "../api/client";

interface MeResponse {
  id: number;
  email: string;
  name: string;
  provider: string;
  mfaEnabled: boolean;
  createdAt: string;
}

type MfaAction = "idle" | "setup" | "disable-confirm" | "loading";

const PROVIDER_META: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  LOCAL: {
    label: "Email & Password",
    icon: "🔑",
    color: "#6366f1",
  },
  GOOGLE: {
    label: "Google",
    icon: "🌐",
    color: "#ea4335",
  },
  GITHUB: {
    label: "GitHub",
    icon: "🐙",
    color: "#24292f",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mfaAction, setMfaAction] = useState<MfaAction>("idle");
  const [mfaFeedback, setMfaFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch("/user/me")
      .then((data: MeResponse) => setUser(data))
      .catch(() => setError("Could not load your profile. Please try again."));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEnableMfa = () => {
    navigate("/mfa/setup");
  };

  const handleDisableMfa = async () => {
    setMfaAction("loading");
    setMfaFeedback(null);
    try {
      const res = await apiFetch("/auth/mfa/disable", { method: "POST" });
      if (!res.ok) throw new Error();
      setUser((prev) => (prev ? { ...prev, mfaEnabled: false } : prev));
      setMfaFeedback("MFA has been disabled.");
    } catch {
      setMfaFeedback("Failed to disable MFA. Please try again.");
    } finally {
      setMfaAction("idle");
    }
  };

  const copyEmail = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <span style={{ fontSize: 32 }}>⚠️</span>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.btnOutline}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.skeleton}>
          <div
            style={{
              ...styles.skeletonBlock,
              width: 72,
              height: 72,
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              ...styles.skeletonBlock,
              width: 180,
              height: 20,
              marginTop: 16,
            }}
          />
          <div
            style={{
              ...styles.skeletonBlock,
              width: 120,
              height: 14,
              marginTop: 8,
            }}
          />
        </div>
      </div>
    );
  }

  const provider = PROVIDER_META[user.provider] ?? PROVIDER_META.LOCAL;

  return (
    <div style={styles.page}>
      {/* Nav bar */}
      <nav style={styles.nav}>
        <button style={styles.navBack} onClick={() => navigate("/home")}>
          ← Home
        </button>
        <span style={styles.navTitle}>Profile</span>
        <button style={styles.btnDanger} onClick={handleLogout}>
          Sign out
        </button>
      </nav>

      <div style={styles.content}>
        {/* ── Avatar + identity card ── */}
        <div style={styles.identityCard}>
          <div style={styles.avatarRing}>
            <div style={styles.avatar}>{getInitials(user.name)}</div>
          </div>

          <div style={styles.identityInfo}>
            <h1 style={styles.userName}>{user.name}</h1>
            <div style={styles.emailRow}>
              <span style={styles.emailText}>{user.email}</span>
              <button
                style={styles.copyBtn}
                onClick={copyEmail}
                title="Copy email"
              >
                {copied ? "✓" : "⎘"}
              </button>
            </div>
            <p style={styles.memberSince}>
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* ── Two-column detail grid ── */}
        <div style={styles.grid}>
          {/* Auth Method */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Auth method</h2>
            <div style={styles.providerBadge}>
              <span style={{ fontSize: 22 }}>{provider.icon}</span>
              <div>
                <p style={styles.providerLabel}>{provider.label}</p>
                <p style={styles.providerSub}>
                  {user.provider === "LOCAL"
                    ? "Registered with email & password"
                    : `Signed in via ${provider.label} OAuth`}
                </p>
              </div>
            </div>
            <div style={styles.divider} />
            <div style={styles.metaRow}>
              <span style={styles.metaKey}>User ID</span>
              <code style={styles.metaVal}>#{user.id}</code>
            </div>
            <div style={styles.metaRow}>
              <span style={styles.metaKey}>Role</span>
              <span style={{ ...styles.metaVal, ...styles.roleBadge }}>
                User
              </span>
            </div>
          </section>

          {/* MFA status */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Two-factor auth</h2>

            {/* Status indicator */}
            <div style={styles.mfaStatusRow}>
              <div
                style={{
                  ...styles.mfaDot,
                  background: user.mfaEnabled ? "#22c55e" : "#ef4444",
                }}
              />
              <span style={styles.mfaStatusLabel}>
                {user.mfaEnabled
                  ? "Enabled — TOTP active"
                  : "Disabled — no 2FA protection"}
              </span>
            </div>

            {user.mfaEnabled && (
              <p style={styles.mfaNote}>
                Your account is protected with Microsoft Authenticator (TOTP).
                Every login requires a 6-digit code in addition to your
                password.
              </p>
            )}

            {!user.mfaEnabled && (
              <p style={styles.mfaNote}>
                Enable two-factor authentication to add a second layer of
                protection to your account using an authenticator app.
              </p>
            )}

            <div style={styles.divider} />

            {/* MFA feedback */}
            {mfaFeedback && (
              <p
                style={{
                  ...styles.mfaFeedback,
                  color: mfaFeedback.startsWith("Failed")
                    ? "#ef4444"
                    : "#22c55e",
                }}
              >
                {mfaFeedback}
              </p>
            )}

            {/* Actions */}
            {mfaAction === "disable-confirm" ? (
              <div style={styles.confirmBox}>
                <p style={styles.confirmText}>
                  Disabling MFA will remove your second-factor protection. Are
                  you sure?
                </p>
                <div style={styles.confirmBtns}>
                  <button style={styles.btnDanger} onClick={handleDisableMfa}>
                    Yes, disable
                  </button>
                  <button
                    style={styles.btnOutline}
                    onClick={() => setMfaAction("idle")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : mfaAction === "loading" ? (
              <p style={styles.loadingText}>Processing…</p>
            ) : user.mfaEnabled ? (
              <button
                style={styles.btnOutline}
                onClick={() => setMfaAction("disable-confirm")}
              >
                Disable MFA
              </button>
            ) : (
              <button style={styles.btnPrimary} onClick={handleEnableMfa}>
                Enable MFA →
              </button>
            )}
          </section>
        </div>

        {/* ── Account actions ── */}
        <section style={{ ...styles.card, marginTop: 0 }}>
          <h2 style={styles.cardTitle}>Account</h2>
          <div style={styles.actionsList}>
            <div style={styles.actionRow}>
              <div>
                <p style={styles.actionLabel}>Session</p>
                <p style={styles.actionSub}>
                  Sign out of all devices and clear the stored JWT
                </p>
              </div>
              <button style={styles.btnDanger} onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f1117",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(15,17,23,0.95)",
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
    backdropFilter: "blur(8px)",
  },
  navBack: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 14,
    padding: "6px 10px",
    borderRadius: 6,
    transition: "color 0.15s",
  },
  navTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#f1f5f9",
    letterSpacing: "0.01em",
  },
  content: {
    maxWidth: 780,
    margin: "0 auto",
    padding: "32px 20px 60px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 20,
  },

  // Identity card
  identityCard: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    background: "linear-gradient(135deg, #1e2130 0%, #151823 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "24px 28px",
  },
  avatarRing: {
    flexShrink: 0,
    padding: 3,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "#1e2130",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 700,
    color: "#a5b4fc",
    letterSpacing: "0.02em",
  },
  identityInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#f1f5f9",
    letterSpacing: "-0.02em",
  },
  emailRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  emailText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  copyBtn: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 4,
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 12,
    padding: "2px 6px",
    lineHeight: 1.4,
    transition: "border-color 0.15s",
  },
  memberSince: {
    margin: "6px 0 0",
    fontSize: 12,
    color: "#64748b",
  },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },

  // Cards
  card: {
    background: "#151823",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "20px 22px",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#64748b",
  },

  // Provider
  providerBadge: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8,
    padding: "12px 14px",
  },
  providerLabel: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "#e2e8f0",
  },
  providerSub: {
    margin: "2px 0 0",
    fontSize: 12,
    color: "#64748b",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.06)",
    margin: "16px 0",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
  },
  metaKey: {
    fontSize: 13,
    color: "#64748b",
  },
  metaVal: {
    fontSize: 13,
    color: "#cbd5e1",
  },
  roleBadge: {
    background: "rgba(99,102,241,0.15)",
    color: "#a5b4fc",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
  },

  // MFA
  mfaStatusRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  mfaDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: "0 0 6px currentColor",
  },
  mfaStatusLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#cbd5e1",
  },
  mfaNote: {
    margin: 0,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.6,
  },
  mfaFeedback: {
    margin: "0 0 12px",
    fontSize: 13,
    fontWeight: 500,
  },
  confirmBox: {
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 8,
    padding: "14px 16px",
  },
  confirmText: {
    margin: "0 0 12px",
    fontSize: 13,
    color: "#fca5a5",
    lineHeight: 1.5,
  },
  confirmBtns: {
    display: "flex",
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#64748b",
    margin: 0,
  },

  // Account actions
  actionsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  actionLabel: {
    margin: 0,
    fontSize: 14,
    fontWeight: 500,
    color: "#e2e8f0",
  },
  actionSub: {
    margin: "2px 0 0",
    fontSize: 12,
    color: "#64748b",
  },

  // Buttons
  btnPrimary: {
    background: "#6366f1",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    padding: "9px 18px",
    transition: "opacity 0.15s",
    marginTop: 4,
  },
  btnOutline: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    padding: "8px 16px",
    transition: "border-color 0.15s",
    marginTop: 4,
  },
  btnDanger: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 8,
    color: "#f87171",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    padding: "8px 16px",
    transition: "background 0.15s",
  },

  // States
  errorCard: {
    maxWidth: 360,
    margin: "80px auto",
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    margin: 0,
    fontSize: 14,
    color: "#94a3b8",
  },
  skeleton: {
    maxWidth: 400,
    margin: "80px auto",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  skeletonBlock: {
    background: "#1e2130",
    borderRadius: 6,
    animation: "pulse 1.5s ease-in-out infinite",
  },
};

export default Profile;
