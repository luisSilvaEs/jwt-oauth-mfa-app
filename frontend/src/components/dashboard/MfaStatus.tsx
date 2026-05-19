interface UserProfile {
  mfaEnabled: boolean;
  createdAt: string;
}

const Row = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
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
        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
};

const MfaStatus = ({
  user,
  loading,
}: {
  user: UserProfile | null;
  loading: boolean;
}) => {
  return (
    <Card title="MFA Status">
      {loading ? (
        <div className="h-4 bg-white/5 rounded animate-pulse" />
      ) : !user ? (
        <p className="text-xs text-gray-700">—</p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-lg ${user.mfaEnabled ? "🟢" : "🔴"}`} />
            <span
              className={`text-sm font-medium ${user.mfaEnabled ? "text-emerald-400" : "text-red-400"}`}
            >
              {user.mfaEnabled ? "Active" : "Not enabled"}
            </span>
          </div>
          {user.mfaEnabled && (
            <div className="space-y-2 text-xs">
              <Row label="Method" value="TOTP (RFC 6238)" />
              <Row label="App" value="Microsoft Authenticator" />
              <Row label="Interval" value="30 seconds" />
              <Row label="Algorithm" value="HMAC-SHA1" />
              <Row label="Digits" value="6" />
            </div>
          )}
          {!user.mfaEnabled && (
            <a
              href="/mfa/setup"
              className="inline-block text-[11px] text-violet-400 hover:text-violet-300 transition-colors mt-1"
            >
              Enable MFA →
            </a>
          )}
        </div>
      )}
    </Card>
  );
};

export default MfaStatus;
