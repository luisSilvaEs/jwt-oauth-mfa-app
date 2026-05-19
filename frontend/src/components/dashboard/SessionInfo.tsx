interface UserProfile {
  email: string;
  name: string;
  provider: "LOCAL" | "GOOGLE" | "GITHUB";
  mfaEnabled: boolean;
  createdAt: string;
}

const providerIcon: Record<string, string> = {
  GOOGLE: "🟦 Google",
  GITHUB: "⬛ GitHub",
  LOCAL: "🔑 Password",
};

const Row = ({
  label,
  value,
  dim,
}: {
  label: string;
  value: string;
  dim?: boolean;
}) => {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-600 text-[11px]">{label}</span>
      <span
        className={`text-[11px] ${dim ? "text-gray-700" : "text-gray-300"} truncate max-w-[140px] text-right`}
      >
        {value}
      </span>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-3 bg-white/5 rounded animate-pulse" />
      ))}
    </div>
  );
};

const Empty = () => {
  return <p className="text-xs text-gray-700">No session data.</p>;
};

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
};

const SessionInfo = ({
  user,
  loading,
}: {
  user: UserProfile | null;
  loading: boolean;
}) => {
  const loginTime = sessionStorage.getItem("loginTime");

  return (
    <Card title="Session & Auth">
      {loading ? (
        <Skeleton />
      ) : !user ? (
        <Empty />
      ) : (
        <div className="space-y-3 text-xs">
          <Row
            label="Provider"
            value={providerIcon[user.provider] ?? user.provider}
          />
          <Row label="Email" value={user.email} />
          <Row label="Name" value={user.name || "—"} />
          <Row label="Token type" value="Bearer (JWT)" />
          <Row
            label="Login at"
            value={loginTime ? new Date(loginTime).toLocaleTimeString() : "—"}
          />
          <Row label="Refresh" value="Not implemented" dim />
        </div>
      )}
    </Card>
  );
};

export default SessionInfo;
